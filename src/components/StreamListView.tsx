import { useEffect, useRef } from 'react';
import type { LogEntry } from '../logit';
import { ObjectExplorer } from './ObjectExplorer';

interface StreamListViewProps {
  entries: LogEntry[];
  highlightedPaths: string[];
  expandedPaths: string[];
  onDoubleClickKey: (path: string) => void;
  onToggleExpand: (path: string) => void;
}

export function StreamListView({ entries, highlightedPaths, expandedPaths, onDoubleClickKey, onToggleExpand }: StreamListViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasObjects = entries.some(e => typeof e.value === 'object' && e.value !== null);

  // Auto-scroll within the card's own container — never touches page scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries.length]);

  return (
    <div ref={containerRef} className="overflow-y-auto max-h-64">
      {entries.map((entry, idx) => (
        <div key={entry.id}
          className="flex gap-2 px-3 py-1.5 border-b border-outline-variant/10 last:border-0
            hover:bg-surface-container/30 animate-fade-in">
          <span className="font-mono text-[10px] text-on-surface-variant/40 pt-0.5 w-5 text-right flex-shrink-0">
            {idx + 1}
          </span>
          <span className="font-mono text-[10px] text-on-surface-variant/40 pt-0.5 flex-shrink-0 w-16">
            {new Date(entry.timestamp).toLocaleTimeString()}
          </span>
          <div className="flex-1 min-w-0">
            <ObjectExplorer
              value={entry.value}
              highlightedPaths={highlightedPaths}
              expandedPaths={expandedPaths}
              onDoubleClickKey={onDoubleClickKey}
              onToggleExpand={onToggleExpand}
            />
          </div>
        </div>
      ))}
      {hasObjects && entries.length > 0 && (
        <div className="px-3 py-1.5 bg-surface-container/50">
          <span className="font-label text-[9px] text-on-surface-variant/40">
            Double-click a property key to highlight it across all entries
          </span>
        </div>
      )}
    </div>
  );
}
