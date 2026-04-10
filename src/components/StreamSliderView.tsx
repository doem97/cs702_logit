import type { LogEntry } from '../logit';
import { ObjectExplorer } from './ObjectExplorer';

interface StreamSliderViewProps {
  entries: LogEntry[];
  sliderIndex: number;
  onSliderChange: (index: number) => void;
  highlightedPaths: string[];
  expandedPaths: string[];
  onDoubleClickKey: (path: string) => void;
  onToggleExpand: (path: string) => void;
}

export function StreamSliderView({
  entries, sliderIndex, onSliderChange,
  highlightedPaths, expandedPaths, onDoubleClickKey, onToggleExpand,
}: StreamSliderViewProps) {
  if (entries.length === 0) {
    return <div className="px-3 py-4 text-xs text-on-surface-variant font-body text-center">No entries yet</div>;
  }

  const currentEntry = entries[sliderIndex] ?? entries[entries.length - 1];
  const prevEntry = sliderIndex > 0 ? entries[sliderIndex - 1] : undefined;

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          disabled={sliderIndex <= 0}
          onClick={() => onSliderChange(sliderIndex - 1)}
          className="text-on-surface-variant disabled:opacity-30 hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        <input
          type="range" min={0} max={entries.length - 1} value={sliderIndex}
          onChange={e => onSliderChange(Number(e.target.value))}
          className="flex-1 accent-primary h-1"
        />
        <button
          type="button"
          disabled={sliderIndex >= entries.length - 1}
          onClick={() => onSliderChange(sliderIndex + 1)}
          className="text-on-surface-variant disabled:opacity-30 hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
        <span className="font-mono text-[10px] text-on-surface-variant w-12 text-right flex-shrink-0">
          {sliderIndex + 1} / {entries.length}
        </span>
      </div>
      <div className="font-mono text-[10px] text-on-surface-variant/50 mb-2 flex items-center gap-2">
        <span>{new Date(currentEntry.timestamp).toLocaleTimeString()}</span>
        {prevEntry && (
          <span className="text-tertiary font-label text-[9px]">changed values highlighted</span>
        )}
      </div>
      <div className="bg-surface-container rounded-lg p-2">
        <ObjectExplorer
          value={currentEntry.value}
          prevValue={prevEntry?.value}
          highlightedPaths={highlightedPaths}
          expandedPaths={expandedPaths}
          onDoubleClickKey={onDoubleClickKey}
          onToggleExpand={onToggleExpand}
        />
      </div>
    </div>
  );
}
