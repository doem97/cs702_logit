/**
 * TimelineSparkline: Extension 2 from the proposal.
 *
 * A miniature timeline below each Stream header:
 * - Horizontal axis = time
 * - Each dot = when a log was produced
 * - For numeric streams, also shows value trend as a line chart
 *
 * Responds to paper Section 7.3 — treating "log messages as data points."
 */

import React, { useMemo, useRef, useEffect } from 'react';
import type { LogEntry } from '../types';

interface TimelineSparklineProps {
  entries: LogEntry[];
  color: string;
  height?: number;
}

export const TimelineSparkline: React.FC<TimelineSparklineProps> = ({
  entries,
  color,
  height = 32,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isNumeric = useMemo(() => {
    return entries.length > 0 && entries.every((e) => typeof e.value === 'number');
  }, [entries]);

  const timeRange = useMemo(() => {
    if (entries.length === 0) return { min: 0, max: 1 };
    const times = entries.map((e) => e.timestamp);
    const min = Math.min(...times);
    const max = Math.max(...times);
    return { min, max: max === min ? min + 1000 : max };
  }, [entries]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const w = rect.width;
    const h = rect.height;
    const { min: tMin, max: tMax } = timeRange;
    const pad = 4;

    // Draw time axis line
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, h - pad);
    ctx.lineTo(w - pad, h - pad);
    ctx.stroke();

    if (entries.length === 0) return;

    // Map time to x
    const tx = (t: number) => pad + ((t - tMin) / (tMax - tMin)) * (w - 2 * pad);

    if (isNumeric) {
      // Draw line chart for numeric values
      const values = entries.map((e) => e.value as number);
      const vMin = Math.min(...values);
      const vMax = Math.max(...values);
      const vRange = vMax === vMin ? 1 : vMax - vMin;
      const vy = (v: number) => h - pad - ((v - vMin) / vRange) * (h - 2 * pad);

      // Fill area
      ctx.fillStyle = color + '20';
      ctx.beginPath();
      ctx.moveTo(tx(entries[0].timestamp), h - pad);
      entries.forEach((e) => {
        ctx.lineTo(tx(e.timestamp), vy(e.value as number));
      });
      ctx.lineTo(tx(entries[entries.length - 1].timestamp), h - pad);
      ctx.closePath();
      ctx.fill();

      // Draw line
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      entries.forEach((e, i) => {
        const x = tx(e.timestamp);
        const y = vy(e.value as number);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Draw dots for each entry
    entries.forEach((e) => {
      const x = tx(e.timestamp);
      const y = isNumeric
        ? (() => {
          const values = entries.map((en) => en.value as number);
          const vMin = Math.min(...values);
          const vMax = Math.max(...values);
          const vRange = vMax === vMin ? 1 : vMax - vMin;
          return h - pad - (((e.value as number) - vMin) / vRange) * (h - 2 * pad);
        })()
        : h / 2;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [entries, color, isNumeric, timeRange, height]);

  if (entries.length < 2) return null;

  return (
    <div className="timeline-sparkline">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
      />
    </div>
  );
};
