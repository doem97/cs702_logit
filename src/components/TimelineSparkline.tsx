import { useEffect, useRef, useMemo } from 'react';
import type { LogEntry } from '../logit';

export function TimelineSparkline({ entries, color, height = 32 }: { entries: LogEntry[]; color: string; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isNumeric = useMemo(() =>
    entries.length > 0 && entries.every(e => typeof e.value === 'number'),
    [entries]
  );

  const timeRange = useMemo(() => {
    if (entries.length === 0) return { min: 0, max: 1 };
    const times = entries.map(e => e.timestamp);
    const min = Math.min(...times), max = Math.max(...times);
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

    const w = rect.width, h = rect.height, pad = 4;
    const { min: tMin, max: tMax } = timeRange;
    const tx = (t: number) => pad + ((t - tMin) / (tMax - tMin)) * (w - 2 * pad);

    // Axis line
    ctx.strokeStyle = '#dfe3e8'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, h - pad); ctx.lineTo(w - pad, h - pad); ctx.stroke();

    // Compute value range once (used for both line/fill and dots)
    const values = isNumeric ? entries.map(e => e.value as number) : [];
    const vMin = isNumeric ? Math.min(...values) : 0;
    const vMax = isNumeric ? Math.max(...values) : 0;
    const vRange = vMax === vMin ? 1 : vMax - vMin;
    const vy = (v: number) => h - pad - ((v - vMin) / vRange) * (h - 2 * pad);

    if (isNumeric) {
      // Area fill
      ctx.fillStyle = color + '20';
      ctx.beginPath();
      ctx.moveTo(tx(entries[0].timestamp), h - pad);
      entries.forEach(e => ctx.lineTo(tx(e.timestamp), vy(e.value as number)));
      ctx.lineTo(tx(entries[entries.length - 1].timestamp), h - pad);
      ctx.closePath(); ctx.fill();

      // Line
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      ctx.beginPath();
      entries.forEach((e, i) => {
        const x = tx(e.timestamp), y = vy(e.value as number);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Dots (for all entry types)
    entries.forEach(e => {
      const x = tx(e.timestamp);
      const y = isNumeric ? vy(e.value as number) : h / 2;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
    });
  }, [entries, color, isNumeric, timeRange]);

  if (entries.length < 2) return null;

  return (
    <div className="border-b border-outline-variant/10">
      <canvas ref={canvasRef} style={{ width: '100%', height: `${height}px`, display: 'block' }} />
    </div>
  );
}
