/**
 * BarChart: Horizontal bar chart visualization for numeric log streams.
 * Paper Section 4.4 — "A Stream of number logs can be transformed into
 * a horizontal bar plot using the shape button in the Stream menu."
 */

import React, { useMemo, useState } from 'react';
import type { LogEntry } from '../types';

interface BarChartProps {
  entries: LogEntry[];
  color: string;
}

export const BarChart: React.FC<BarChartProps> = ({ entries, color }) => {
  const [proportional, setProportional] = useState(false);

  const numericEntries = useMemo(() => {
    return entries
      .map((e) => ({
        ...e,
        numValue: typeof e.value === 'number' ? e.value : null,
      }))
      .filter((e) => e.numValue !== null);
  }, [entries]);

  const maxValue = useMemo(() => {
    return Math.max(...numericEntries.map((e) => Math.abs(e.numValue!)), 1);
  }, [numericEntries]);

  if (numericEntries.length === 0) {
    return <div className="bar-chart-empty">No numeric values to display</div>;
  }

  return (
    <div className="bar-chart">
      <div className="bar-chart-toggle">
        <label>
          <input
            type="checkbox"
            checked={proportional}
            onChange={(e) => setProportional(e.target.checked)}
          />
          <span>Proportional</span>
        </label>
      </div>
      {numericEntries.map((entry) => {
        const val = entry.numValue!;
        const width = proportional
          ? `${(Math.abs(val) / maxValue) * 100}%`
          : `${Math.min(Math.abs(val), 400)}px`;
        return (
          <div key={entry.id} className="bar-chart-row">
            <div className="bar-chart-label">{val}</div>
            <div className="bar-chart-bar-wrapper">
              <div
                className="bar-chart-bar"
                style={{
                  width,
                  backgroundColor: color + '99',
                  borderLeft: `3px solid ${color}`,
                }}
                title={`${val}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
