import { useState, useCallback } from 'react';
import type { LogEntry } from '../logit';

function analyzeLocally(entries: LogEntry[], streamName: string): string {
  if (entries.length === 0) return 'No log entries to analyze.';
  const lines: string[] = [`Stream "${streamName}" — ${entries.length} entries`];

  const first = entries[0].timestamp, last = entries[entries.length - 1].timestamp;
  lines.push(`Time span: ${((last - first) / 1000).toFixed(2)}s`);

  if (entries.length >= 2) {
    const intervals = entries.slice(1).map((e, i) => e.timestamp - entries[i].timestamp);
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    lines.push(`Avg interval: ${avg.toFixed(0)}ms`);
    const bursts = intervals.filter(i => i < avg * 0.1).length;
    if (bursts > 0) lines.push(`⚡ ${bursts} burst(s) — rapid consecutive logs`);
    const gaps = intervals.filter(i => i > avg * 3).length;
    if (gaps > 0) lines.push(`⏸ ${gaps} gap(s) — long pauses`);
  }

  const nums = entries.filter(e => typeof e.value === 'number').map(e => e.value as number);
  if (nums.length > 0) {
    const min = Math.min(...nums), max = Math.max(...nums);
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    lines.push(`\nNumeric (${nums.length}): min ${min}, max ${max}, avg ${avg.toFixed(2)}`);
    if (nums.length >= 3) {
      let up = 0, down = 0;
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] > nums[i - 1]) up++;
        if (nums[i] < nums[i - 1]) down++;
      }
      const t = nums.length - 1;
      lines.push(up / t > 0.7 ? '📈 Trend: Generally increasing' : down / t > 0.7 ? '📉 Trend: Generally decreasing' : '📊 Trend: Fluctuating');
    }
    const std = Math.sqrt(nums.reduce((s, v) => s + (v - avg) ** 2, 0) / nums.length);
    const anomalies = nums.filter(v => Math.abs(v - avg) > 2 * std);
    if (anomalies.length > 0) lines.push(`⚠️ ${anomalies.length} anomaly(ies): ${anomalies.join(', ')}`);
  }

  const objs = entries.filter(e => typeof e.value === 'object' && e.value !== null && !Array.isArray(e.value));
  if (objs.length > 0) {
    const keys = Object.keys(objs[0].value as object);
    lines.push(`\nObject keys: {${keys.join(', ')}}`);
    const shapes = new Set(objs.map(e => Object.keys(e.value as object).sort().join(',')));
    if (shapes.size > 1) lines.push(`⚠️ Inconsistent shapes (${shapes.size} variants)`);
  }

  lines.push('\n💡 Use Property Highlighting (double-click) to focus on specific fields.');
  return lines.join('\n');
}

const DEEPSEEK_API_KEY = 'sk-cbb4ce40281c4ed9ad0fe0efdb48fb54';

async function analyzeWithDeepSeek(entries: LogEntry[], streamName: string): Promise<string> {
  const data = entries.slice(-20).map(e => ({ timestamp: new Date(e.timestamp).toISOString(), value: e.value }));
  const prompt = `You are a debugging assistant. Analyze log entries from stream "${streamName}":
1. Brief summary  2. Patterns/trends  3. Anomalies  4. Debugging suggestions

Data (last ${data.length} entries):
${JSON.stringify(data, null, 2)}`;

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], max_tokens: 500 }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.choices[0]?.message?.content ?? 'No analysis available.';
}

export function LLMInsightPanel({ entries, streamName }: { entries: LogEntry[]; streamName: string }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'local' | 'ai' | null>(null);

  const handleLocal = useCallback(() => {
    setLoading(true);
    setMode('local');
    setTimeout(() => { setInsight(analyzeLocally(entries, streamName)); setLoading(false); }, 300);
  }, [entries, streamName]);

  const handleAI = useCallback(async () => {
    setLoading(true);
    setMode('ai');
    try { setInsight(await analyzeWithDeepSeek(entries, streamName)); }
    catch (err) { setInsight(`Error: ${err instanceof Error ? err.message : 'Unknown'}`); }
    finally { setLoading(false); }
  }, [entries, streamName]);

  return (
    <div className="border-t border-outline-variant/10 bg-surface-container/30 px-3 py-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-[14px] text-secondary">auto_awesome</span>
        <span className="font-label text-[10px] font-semibold text-on-surface uppercase tracking-wide">Log Insight</span>
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        <button
          type="button"
          onClick={handleLocal}
          disabled={loading || entries.length === 0}
          className="flex items-center gap-1 px-2 py-1 rounded font-label text-[10px]
            bg-surface-container text-on-surface hover:bg-surface-container-high
            disabled:opacity-40 transition-colors duration-150">
          <span className="material-symbols-outlined text-[12px]">search</span>
          {loading && mode === 'local' ? 'Analyzing…' : 'Explain'}
        </button>
        <button
          type="button"
          onClick={handleAI}
          disabled={loading || entries.length === 0}
          className="flex items-center gap-1 px-2 py-1 rounded font-label text-[10px]
            bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim
            disabled:opacity-40 transition-colors duration-150">
          <span className="material-symbols-outlined text-[12px]">robot_2</span>
          {loading && mode === 'ai' ? 'Thinking…' : 'AI Explain'}
        </button>
        <span className="font-label text-[9px] text-on-surface-variant/40 ml-auto">DeepSeek</span>
      </div>
      {insight && (
        <pre className="font-mono text-[10px] text-on-surface leading-relaxed whitespace-pre-wrap
          bg-surface-container rounded p-2 max-h-48 overflow-y-auto">
          {insight}
        </pre>
      )}
    </div>
  );
}
