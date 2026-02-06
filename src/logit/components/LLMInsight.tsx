/**
 * LLMInsight: Extension 1 from the proposal.
 *
 * An "Explain" button on each Stream. When clicked, the log data is
 * sent to an LLM API which returns a natural-language summary:
 * - Trend descriptions
 * - Anomaly detection
 * - Suggested next debugging steps
 *
 * For the reproduction, we support:
 * 1. A built-in heuristic analysis (no API key needed)
 * 2. Optional OpenAI API integration (user provides key)
 */

import React, { useState, useCallback } from 'react';
import type { LogEntry } from '../types';

interface LLMInsightProps {
  entries: LogEntry[];
  streamName: string;
}

/** Perform a local heuristic analysis of the logged data */
function analyzeLocally(entries: LogEntry[], streamName: string): string {
  if (entries.length === 0) return 'No log entries to analyze.';

  const lines: string[] = [];
  lines.push(`Stream "${streamName}" — ${entries.length} entries`);

  // Time analysis
  const firstTime = entries[0].timestamp;
  const lastTime = entries[entries.length - 1].timestamp;
  const duration = lastTime - firstTime;
  lines.push(`Time span: ${(duration / 1000).toFixed(2)}s`);

  if (entries.length >= 2) {
    const intervals = entries.slice(1).map((e, i) => e.timestamp - entries[i].timestamp);
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    lines.push(`Avg interval between logs: ${avgInterval.toFixed(0)}ms`);

    // Detect bursts (intervals < 10% of average)
    const bursts = intervals.filter((i) => i < avgInterval * 0.1).length;
    if (bursts > 0) {
      lines.push(`⚡ Detected ${bursts} burst(s) (rapid consecutive logs)`);
    }

    // Detect gaps (intervals > 3x average)
    const gaps = intervals.filter((i) => i > avgInterval * 3).length;
    if (gaps > 0) {
      lines.push(`⏸ Detected ${gaps} gap(s) (long pauses between logs)`);
    }
  }

  // Numeric analysis
  const numericValues = entries
    .filter((e) => typeof e.value === 'number')
    .map((e) => e.value as number);

  if (numericValues.length > 0) {
    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
    lines.push(`\nNumeric analysis (${numericValues.length} values):`);
    lines.push(`  Min: ${min}, Max: ${max}, Avg: ${avg.toFixed(2)}`);

    // Trend detection
    if (numericValues.length >= 3) {
      let increasing = 0;
      let decreasing = 0;
      for (let i = 1; i < numericValues.length; i++) {
        if (numericValues[i] > numericValues[i - 1]) increasing++;
        if (numericValues[i] < numericValues[i - 1]) decreasing++;
      }
      const total = numericValues.length - 1;
      if (increasing / total > 0.7) lines.push('📈 Trend: Generally increasing');
      else if (decreasing / total > 0.7) lines.push('📉 Trend: Generally decreasing');
      else lines.push('📊 Trend: Fluctuating / no clear trend');
    }

    // Anomaly detection (values > 2 std dev from mean)
    const std = Math.sqrt(
      numericValues.reduce((s, v) => s + (v - avg) ** 2, 0) / numericValues.length
    );
    const anomalies = numericValues.filter((v) => Math.abs(v - avg) > 2 * std);
    if (anomalies.length > 0) {
      lines.push(`⚠️ ${anomalies.length} potential anomaly(ies): ${anomalies.join(', ')}`);
    }
  }

  // Object structure analysis
  const objectEntries = entries.filter(
    (e) => typeof e.value === 'object' && e.value !== null && !Array.isArray(e.value)
  );
  if (objectEntries.length > 0) {
    const firstObj = objectEntries[0].value as Record<string, unknown>;
    const keys = Object.keys(firstObj);
    lines.push(`\nObject structure: {${keys.join(', ')}}`);

    // Check for key consistency
    const allKeys = objectEntries.map((e) => Object.keys(e.value as object).sort().join(','));
    const uniqueShapes = new Set(allKeys);
    if (uniqueShapes.size > 1) {
      lines.push(`⚠️ Inconsistent object shapes detected (${uniqueShapes.size} variants)`);
    }
  }

  lines.push('\n💡 Suggestion: Use Property Highlighting (double-click) to focus on specific fields.');

  return lines.join('\n');
}

/** Call OpenAI API if key is provided */
async function analyzeWithLLM(
  entries: LogEntry[],
  streamName: string,
  apiKey: string
): Promise<string> {
  const data = entries.slice(-20).map((e) => ({
    timestamp: new Date(e.timestamp).toISOString(),
    value: e.value,
  }));

  const prompt = `You are a programming debugging assistant. Analyze these log entries from a stream called "${streamName}" and provide:
1. A brief summary of what the data shows
2. Any patterns or trends
3. Any anomalies or potential issues
4. Suggested next debugging steps

Log data (last ${data.length} entries):
${JSON.stringify(data, null, 2)}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const result = await response.json();
  return result.choices[0]?.message?.content || 'No analysis available.';
}

export const LLMInsightPanel: React.FC<LLMInsightProps> = ({ entries, streamName }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleLocalAnalysis = useCallback(() => {
    setLoading(true);
    // Simulate brief loading
    setTimeout(() => {
      const result = analyzeLocally(entries, streamName);
      setInsight(result);
      setLoading(false);
    }, 300);
  }, [entries, streamName]);

  const handleLLMAnalysis = useCallback(async () => {
    if (!apiKey) {
      setShowApiInput(true);
      return;
    }
    setLoading(true);
    try {
      const result = await analyzeWithLLM(entries, streamName, apiKey);
      setInsight(result);
    } catch (err) {
      setInsight(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [entries, streamName, apiKey]);

  return (
    <div className="llm-insight">
      <div className="llm-insight-buttons">
        <button
          className="llm-btn llm-btn-local"
          onClick={handleLocalAnalysis}
          disabled={loading || entries.length === 0}
        >
          {loading ? '⏳ Analyzing...' : '🔍 Explain'}
        </button>
        <button
          className="llm-btn llm-btn-ai"
          onClick={handleLLMAnalysis}
          disabled={loading || entries.length === 0}
          title="Use OpenAI API"
        >
          🤖 AI Explain
        </button>
      </div>
      {showApiInput && !apiKey && (
        <div className="llm-api-input">
          <input
            type="password"
            placeholder="Enter OpenAI API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button onClick={() => setShowApiInput(false)}>Cancel</button>
        </div>
      )}
      {insight && (
        <pre className="llm-insight-result">{insight}</pre>
      )}
    </div>
  );
};
