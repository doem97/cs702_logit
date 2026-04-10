import { useState, useRef, useCallback } from 'react';
import { log } from '../logit';

export function SceneOrganizedStreams() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runLoop = useCallback(() => {
    if (running) return;
    setRunning(true);
    setDone(false);

    const entries: Array<{ i: number; j: number }> = [];
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 4; j++)
        entries.push({ i, j });

    let idx = 0;
    timerRef.current = setInterval(() => {
      if (idx >= entries.length) {
        clearInterval(timerRef.current!);
        setRunning(false);
        setDone(true);
        return;
      }
      const { i, j } = entries[idx];
      log({ i, j, product: i * j, sum: i + j, phase: idx === 0 ? 'init' : 'running' })
        .name('Nested Loop').color('#4A90D9');
      log(i * j).name('Products').color('#E57373');
      idx++;
    }, 300);
  }, [running]);

  return (
    <div className="min-h-full px-8 py-10 bg-surface">
      <div className="mb-2">
        <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
          Scene 01
        </span>
      </div>
      <h1 className="font-headline text-5xl font-semibold tracking-[-0.02em] text-on-surface mb-4 leading-none">
        Organized<br /><span className="font-light text-on-surface-variant">Streams</span>
      </h1>
      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-10 max-w-md">
        A nested loop runs and produces two kinds of output. Instead of a wall
        of interleaved text, each{' '}
        <code className="font-mono bg-surface-container px-1 rounded text-xs">log()</code>{' '}
        call is organized into its own named, color-coded stream.
      </p>

      <div className="flex items-center gap-4 mb-10">
        <button
          type="button"
          onClick={runLoop}
          disabled={running}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-label text-sm font-medium
            bg-primary text-on-primary hover:bg-primary/90 active:scale-95
            disabled:opacity-50 transition-all duration-200 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">
            {running ? 'hourglass_empty' : 'play_arrow'}
          </span>
          {running ? 'Running…' : 'Run Nested Loop'}
        </button>
        {done && (
          <span className="font-label text-xs text-on-surface-variant animate-fade-in">
            12 entries logged →
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg">
        {[
          { icon: 'view_stream', title: 'Stream Grouping', desc: 'Each log() call belongs to a named stream — no more flat walls of text.' },
          { icon: 'palette', title: 'Color Coding', desc: 'Each stream gets a distinct color for instant visual identification.' },
          { icon: 'format_list_numbered', title: 'List View', desc: 'Entries arrive chronologically with index and timestamp.' },
          { icon: 'sensors', title: 'Live Updates', desc: 'Entries animate in as they arrive in real time.' },
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
