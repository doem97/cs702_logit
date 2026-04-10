import { useState } from 'react';
import type { StreamState } from '../logit';
import { useStreamActions } from '../logit';
import { StreamListView } from './StreamListView';
import { StreamSliderView } from './StreamSliderView';
import { BarChart } from './BarChart';
import { TimelineSparkline } from './TimelineSparkline';
import { LLMInsightPanel } from './LLMInsightPanel';

interface StreamCardProps {
  stream: StreamState;
}

export function StreamCard({ stream }: StreamCardProps) {
  const actions = useStreamActions(stream.id);
  const [showInsight, setShowInsight] = useState(false);
  const hasNumeric = stream.entries.some(e => typeof e.value === 'number');

  // Actual field names from StreamState (types.ts uses `paused` and `collapsed`)
  const isPaused = stream.paused;
  const isCollapsed = stream.collapsed;

  return (
    <div className="border-l-2" style={{ borderLeftColor: stream.color }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 backdrop-blur-sm"
        style={{ backgroundColor: stream.color + '12' }}>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stream.color }} />
        <span className="font-label text-xs font-semibold text-on-surface truncate flex-1">{stream.name}</span>
        <span className="font-mono text-[10px] text-on-surface-variant px-1.5 py-0.5 rounded"
          style={{ backgroundColor: stream.color + '20' }}>
          {stream.entries.length}
        </span>
        {isPaused && <span className="material-symbols-outlined text-[12px] text-on-surface-variant">pause</span>}
      </div>

      {/* Highlighted path breadcrumb */}
      {stream.highlightedPaths.length > 0 && (
        <div className="flex items-center gap-1 px-3 py-1 bg-secondary-container/30">
          <span className="material-symbols-outlined text-[10px] text-secondary">filter_alt</span>
          <span className="font-mono text-[10px] text-secondary truncate flex-1">{stream.highlightedPaths[0]}</span>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(stream.highlightedPaths[0])}
            className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[10px]">content_copy</span>
          </button>
          <button
            type="button"
            onClick={() => actions.toggleHighlightPath(stream.highlightedPaths[0])}
            className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[10px]">close</span>
          </button>
        </div>
      )}

      <TimelineSparkline entries={stream.entries} color={stream.color} />

      {/* Body */}
      {!isCollapsed && (
        <>
          {stream.viewMode === 'list' && (
            <StreamListView
              entries={stream.entries}
              highlightedPaths={stream.highlightedPaths}
              expandedPaths={stream.expandedPaths}
              onDoubleClickKey={actions.toggleHighlightPath}
              onToggleExpand={actions.toggleExpandedPath}
            />
          )}
          {stream.viewMode === 'slider' && (
            <StreamSliderView
              entries={stream.entries}
              sliderIndex={stream.sliderIndex}
              onSliderChange={actions.setSliderIndex}
              highlightedPaths={stream.highlightedPaths}
              expandedPaths={stream.expandedPaths}
              onDoubleClickKey={actions.toggleHighlightPath}
              onToggleExpand={actions.toggleExpandedPath}
            />
          )}
          {stream.viewMode === 'bar' && hasNumeric && (
            <BarChart entries={stream.entries} color={stream.color} />
          )}
        </>
      )}

      {/* LLM insight placeholder — wired in Task 5 */}
      {showInsight && (
        <LLMInsightPanel entries={stream.entries} streamName={stream.name} />
      )}

      {/* Controls */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-t border-outline-variant/10 flex-wrap">
        <ControlBtn icon={isPaused ? 'play_arrow' : 'pause'} label={isPaused ? 'Resume' : 'Pause'}
          active={isPaused} onClick={actions.togglePause} />
        <ControlBtn icon={isCollapsed ? 'expand_more' : 'expand_less'}
          label={isCollapsed ? 'Unfold' : 'Collapse'} onClick={actions.toggleCollapse} />
        {isPaused && (
          <ControlBtn icon="delete" label="Delete" danger onClick={actions.deleteStream} />
        )}
        <div className="flex-1" />
        <ControlBtn icon="list" label="List" active={stream.viewMode === 'list'} onClick={() => actions.setViewMode('list')} />
        <ControlBtn icon="linear_scale" label="Slide" active={stream.viewMode === 'slider'} onClick={() => actions.setViewMode('slider')} />
        {hasNumeric && (
          <ControlBtn icon="bar_chart" label="Bar" active={stream.viewMode === 'bar'} onClick={() => actions.setViewMode('bar')} />
        )}
        <div className="w-px h-3 bg-outline-variant/30 mx-0.5" />
        <ControlBtn icon="auto_awesome" label="Explain" active={showInsight} onClick={() => setShowInsight(v => !v)} />
      </div>
    </div>
  );
}

function ControlBtn({ icon, label, active, danger, onClick }: {
  icon: string; label: string; active?: boolean; danger?: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} title={label}
      className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-label transition-colors duration-150
        ${danger ? 'text-error hover:bg-error-container/30' : ''}
        ${active && !danger ? 'bg-primary/10 text-primary' : ''}
        ${!active && !danger ? 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface' : ''}
      `}>
      <span className="material-symbols-outlined text-[12px]">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
