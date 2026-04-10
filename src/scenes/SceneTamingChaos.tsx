import { useState, useRef, useCallback } from 'react';
import { log } from '../logit';

const STREAMS = [
  { name: 'Info',           color: '#90A4AE', make: (n: number) => `App initialized module #${n}` },
  { name: 'Warnings',       color: '#FFB74D', make: (n: number) => ({ level: 'warn', message: `Slow query: ${60 + n * 3}ms`, query: `SELECT * FROM table_${n}` }) },
  { name: 'User Events',    color: '#BA68C8', make: (n: number) => ({ userId: 1000 + n, action: 'scroll', timestamp: Date.now(), duration: Math.round(100 + Math.random() * 100) }) },
  { name: 'Metrics',        color: '#4DD0E1', make: (n: number) => Math.round((100 + n * 5.1) * 10) / 10 },
  { name: 'Service Status', color: '#81C784', make: (n: number) => ({ service: 'api', status: 'healthy', latency: Math.round(40 + Math.random() * 20), connections: 10 + n }) },
] as const;

export function SceneTamingChaos() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generate = useCallback(() => {
    if (running) return;
    setRunning(true);
    setDone(false);

    // 3 entries per stream = 15 total, shuffled for interleaved delivery
    const schedule = STREAMS.flatMap((_, si) => [1, 2, 3].map(n => ({ si, n })));
    schedule.sort(() => Math.random() - 0.5);

    let idx = 0;
    timerRef.current = setInterval(() => {
      if (idx >= schedule.length) {
        clearInterval(timerRef.current!);
        setRunning(false);
        setDone(true);
        return;
      }
      const { si, n } = schedule[idx];
      const s = STREAMS[si];
      log(s.make(n)).id(s.name).name(s.name).color(s.color);
      idx++;
    }, 200);
  }, [running]);

  return (
    <div className="min-h-full px-8 py-10 bg-surface">
      <div className="mb-2">
        <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
          Scene 04
        </span>
      </div>
      <h1 className="font-headline text-5xl font-semibold tracking-[-0.02em] text-on-surface mb-4 leading-none">
        Taming<br /><span className="font-light text-on-surface-variant">the Chaos</span>
      </h1>
      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-10 max-w-md">
        Five different stream types fire simultaneously. Use the controls in
        the right panel to filter, collapse, pause, and delete streams.
      </p>

      <div className="bg-surface-container rounded-xl p-6 mb-8 max-w-md flex flex-col items-center gap-4 border border-outline-variant/10">
        <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
          {STREAMS.map(s => (
            <div key={s.name} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-label text-[9px] text-on-surface-variant">{s.name}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={running}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-label text-sm font-medium
            bg-primary text-on-primary hover:bg-primary/90 active:scale-95
            disabled:opacity-50 transition-all duration-200 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">{running ? 'hourglass_empty' : 'blur_on'}</span>
          {running ? 'Generating…' : 'Generate Cluttered Logs'}
        </button>
        {done && (
          <div className="flex items-start gap-2 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3 text-left">
            <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 flex-shrink-0">arrow_forward</span>
            <div>
              <div className="font-label text-[11px] font-semibold text-primary mb-0.5">
                Now try the Log Panel on the right →
              </div>
              <div className="font-body text-[10px] text-on-surface-variant leading-relaxed">
                Each stream card has controls: <strong>filter</strong> by name (top search box),
                <strong> ⏸ pause</strong> to freeze updates,
                <strong> ⌄ collapse</strong> to hide the body, and
                <strong> 🗑 delete</strong> to remove a paused stream.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg">
        {[
          { icon: 'filter_list', title: 'Filtering', desc: 'Type in the filter box to narrow streams by name.' },
          { icon: 'compress', title: 'Collapse / Unfold', desc: 'Hide a stream body to reduce noise while keeping its header.' },
          { icon: 'pause', title: 'Pause / Resume', desc: 'Freeze a stream to stop new entries from arriving.' },
          { icon: 'delete', title: 'Delete', desc: 'Remove a paused stream entirely.' },
        ].map(f => (
          <div key={f.title} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10">
            <span className="material-symbols-outlined text-[20px] text-primary mb-2 block">{f.icon}</span>
            <div className="font-label text-xs font-semibold text-on-surface mb-1">{f.title}</div>
            <div className="font-body text-[11px] text-on-surface-variant leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
