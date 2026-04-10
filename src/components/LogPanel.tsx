import { useState, useEffect } from 'react';
import { useLogStreams, logStore } from '../logit';
import { StreamCard } from './StreamCard';

export function LogPanel() {
  const streams = useLogStreams();
  const [filter, setFilter] = useState('');
  const visibleStreams = streams.filter(s => !s.attachedElementId);
  const panelStreams = filter
    ? visibleStreams.filter(s => s.id === filter)
    : visibleStreams;

  // Reset filter when the selected stream disappears (e.g. after clearAll)
  useEffect(() => {
    if (filter && !visibleStreams.find(s => s.id === filter)) setFilter('');
  });

  return (
    <div className="h-full flex flex-col bg-surface-container-lowest">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant/20">
        <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant flex-1">
          Active Streams
        </span>
        <span className="font-label text-[10px] text-on-surface-variant">{streams.length}</span>
        <button
          type="button"
          className="material-symbols-outlined text-[14px] text-on-surface-variant hover:text-on-surface transition-colors bg-transparent border-0 p-0 cursor-pointer"
          title="Clear all streams"
          onClick={() => logStore.clearAll()}
        >
          delete_sweep
        </button>
      </div>
      {visibleStreams.length > 1 && (
        <div className="px-3 py-2 border-b border-outline-variant/10">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full text-[11px] font-label bg-surface-container-low rounded px-2 py-1.5
              text-on-surface outline-none focus:bg-surface-container transition-colors cursor-pointer
              border border-outline-variant/20 focus:border-outline-variant/40"
          >
            <option value="">All streams ({visibleStreams.length})</option>
            {visibleStreams.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {panelStreams.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant/30">terminal</span>
            <p className="font-body text-xs text-on-surface-variant/60 leading-relaxed">
              Use <code className="font-mono bg-surface-container px-1 rounded">log(value)</code> to start logging
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-outline-variant/10">
            {panelStreams.map(stream => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
