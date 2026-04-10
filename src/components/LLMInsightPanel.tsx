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

async function analyzeWithOpenAI(entries: LogEntry[], streamName: string, apiKey: string): Promise<string> {
  const data = entries.slice(-20).map(e => ({ timestamp: new Date(e.timestamp).toISOString(), value: e.value }));
  const prompt = `You are a debugging assistant. Analyze log entries from stream "${streamName}":
1. Brief summary  2. Patterns/trends  3. Anomalies  4. Debugging suggestions

Data (last ${data.length} entries):
${JSON.stringify(data, null, 2)}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], max_tokens: 500 }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.choices[0]?.message?.content ?? 'No analysis available.';
}

export function LLMInsightPanel({ entries, streamName }: { entries: LogEntry[]; streamName: string }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleLocal = useCallback(() => {
    setLoading(true);
    setTimeout(() => { setInsight(analyzeLocally(entries, streamName)); setLoading(false); }, 300);
  }, [entries, streamName]);

  const handleAI = useCallback(async () => {
    if (!apiKey) { setShowKey(true); return; }
    setLoading(true);
    try { setInsight(await analyzeWithOpenAI(entries, streamName, apiKey)); }
    catch (err) { setInsight(`Error: ${err instanceof Error ? err.message : 'Unknown'}`); }
    finally { setLoading(false); }
  }, [entries, streamName, apiKey]);

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
          {loading ? 'Analyzing…' : 'Explain'}
        </button>
        <button
          type="button"
          onClick={handleAI}
          disabled={loading || entries.length === 0}
          className="flex items-center gap-1 px-2 py-1 rounded font-label text-[10px]
            bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim
            disabled:opacity-40 transition-colors duration-150">
          <span className="material-symbols-outlined text-[12px]">robot_2</span>
          AI Explain
        </button>
      </div>
      {showKey && !apiKey && (
        <div className="flex gap-1 mb-2">
          <input
            type="password"
            placeholder="Enter OpenAI API key…"
            className="flex-1 text-[10px] font-mono bg-surface-container rounded px-2 py-1 outline-none
              border border-outline-variant/20 focus:border-outline/40"
            onChange={e => setApiKey(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowKey(false)}
            className="text-[10px] font-label text-on-surface-variant px-2 py-1 rounded hover:bg-surface-container">
            Cancel
          </button>
        </div>
      )}
      {insight && (
        <pre className="font-mono text-[10px] text-on-surface leading-relaxed whitespace-pre-wrap
          bg-surface-container rounded p-2 max-h-48 overflow-y-auto">
          {insight}
        </pre>
      )}
    </div>
  );
}
