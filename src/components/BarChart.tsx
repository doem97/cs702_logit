import { useState, useMemo } from 'react';
import type { LogEntry } from '../logit';

export function BarChart({ entries, color }: { entries: LogEntry[]; color: string }) {
  const [proportional, setProportional] = useState(false);

  const numericEntries = useMemo(() =>
    entries
      .map(e => ({ ...e, numValue: typeof e.value === 'number' ? (e.value as number) : null }))
      .filter((e): e is typeof e & { numValue: number } => e.numValue !== null),
    [entries]
  );

  const maxValue = useMemo(() =>
    Math.max(...numericEntries.map(e => Math.abs(e.numValue)), 1),
    [numericEntries]
  );

  if (numericEntries.length === 0) {
    return <div className="px-3 py-4 text-xs text-on-surface-variant font-body text-center italic">No numeric values</div>;
  }

  return (
    <div className="px-3 py-2">
      <label className="flex items-center gap-1.5 mb-2 cursor-pointer">
        <input type="checkbox" checked={proportional} onChange={e => setProportional(e.target.checked)}
          className="accent-primary w-3 h-3" />
        <span className="font-label text-[10px] text-on-surface-variant">Proportional</span>
      </label>
      <div className="flex flex-col gap-0.5 overflow-y-auto max-h-48">
        {numericEntries.map(entry => {
          const val = entry.numValue;
          const pct = proportional
            ? (Math.abs(val) / maxValue) * 100
            : Math.min(Math.abs(val) / maxValue * 100, 100);
          return (
            <div key={entry.id} className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-on-surface-variant w-14 text-right flex-shrink-0">{val}</span>
              <div className="flex-1 h-3.5 relative bg-surface-container rounded-sm overflow-hidden">
                <div className="h-full rounded-sm transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: color + '99', borderLeft: `2px solid ${color}` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
