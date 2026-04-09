/**
 * StreamView: The main visual component for a single Log Stream.
 *
 * A Stream consists of three parts (Paper Section 4.1):
 * - Header: name, count, drag handle, color indicator
 * - Body: chronological list of logged items (or slider/bar view)
 * - Menu: pause/resume, collapse/unfold, delete, view mode toggle
 *
 * Also integrates:
 * - Extension 1: LLM Insight panel
 * - Extension 2: Timeline Sparkline
 */

import React, { useCallback, useState, useRef, useEffect } from 'react';
import type { StreamState, LogEntry } from '../types';
import { ObjectExplorer } from './ObjectExplorer';
// [Phase 3] Bar Chart, Timeline Sparkline, LLM Insight — uncomment for next phase
// import { BarChart } from './BarChart';
// import { TimelineSparkline } from './TimelineSparkline';
// import { LLMInsightPanel } from './LLMInsight';
import { useStreamActions } from '../hooks';

interface StreamViewProps {
  stream: StreamState;
}

export const StreamView: React.FC<StreamViewProps> = ({ stream }) => {
  const actions = useStreamActions(stream.id);
  // [Phase 3] LLM Insight toggle — uncomment for next phase
  // const [showInsight, setShowInsight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const streamRef = useRef<HTMLDivElement>(null);

  // Drag handler for repositioning
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const rect = streamRef.current?.getBoundingClientRect();
      if (!rect) return;
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: position?.x ?? rect.left,
        origY: position?.y ?? rect.top,
      };
    },
    [position]
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.origX + dx,
        y: dragRef.current.origY + dy,
      });
    };
    const handleUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging]);

  const _hasNumericEntries = stream.entries.some((e) => typeof e.value === 'number');

  const style: React.CSSProperties = position
    ? { position: 'fixed', left: position.x, top: position.y, zIndex: 9999 }
    : {};

  return (
    <div
      ref={streamRef}
      className={`stream-view ${isDragging ? 'stream-dragging' : ''}`}
      style={{
        ...style,
        borderLeftColor: stream.color,
      }}
      data-stream-id={stream.id}
    >
      {/* --- Stream Header --- */}
      <div className="stream-header" style={{ backgroundColor: stream.color + '15' }}>
        <div className="stream-header-left">
          <span
            className="stream-drag-handle"
            onMouseDown={handleDragStart}
            title="Drag to reposition"
          >
            ⠿
          </span>
          <span
            className="stream-color-dot"
            style={{ backgroundColor: stream.color }}
          />
          <span className="stream-name">{stream.name}</span>
          <span className="stream-count">{stream.entries.length}</span>
        </div>
        <div className="stream-header-right">
          {/* Highlighted path breadcrumb */}
          {stream.highlightedPaths.length > 0 && (
            <span className="stream-path-breadcrumb">
              {stream.highlightedPaths[0]}
              <button
                className="stream-path-copy"
                onClick={() => navigator.clipboard.writeText(stream.highlightedPaths[0])}
                title="Copy indexing path"
              >
                📋
              </button>
              <button
                className="stream-path-clear"
                onClick={() => actions.toggleHighlightPath(stream.highlightedPaths[0])}
                title="Clear highlight"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      </div>

      {/* [Phase 3] Timeline Sparkline — uncomment for next phase */}
      {/* <TimelineSparkline entries={stream.entries} color={stream.color} /> */}

      {/* [Phase 3] Collected Properties — uncomment for next phase */}
      {/* {stream.collectedPaths.length > 0 && (
        <div className="stream-collected">
          <div className="stream-collected-header">📌 Collected Properties</div>
          {stream.collectedPaths.map((path) => (
            <span
              key={path}
              className="stream-collected-tag"
              style={{ borderColor: stream.color }}
            >
              {path}
              <button onClick={() => actions.toggleCollectedPath(path)}>✕</button>
            </span>
          ))}
        </div>
      )} */}

      {/* --- Stream Body --- */}
      {!stream.collapsed && (
        <div className="stream-body">
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
          {/* [Phase 3] Bar Chart view — uncomment for next phase */}
          {/* {stream.viewMode === 'bar' && (
            <BarChart entries={stream.entries} color={stream.color} />
          )} */}
        </div>
      )}

      {/* [Phase 3] LLM Insight panel — uncomment for next phase */}
      {/* {showInsight && (
        <LLMInsightPanel entries={stream.entries} streamName={stream.name} />
      )} */}

      {/* --- Stream Menu --- */}
      <div className="stream-menu">
        <button
          className={`stream-menu-btn ${stream.paused ? 'active' : ''}`}
          onClick={actions.togglePause}
          title={stream.paused ? 'Resume' : 'Pause'}
        >
          {stream.paused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button
          className="stream-menu-btn"
          onClick={actions.toggleCollapse}
          title={stream.collapsed ? 'Unfold' : 'Collapse'}
        >
          {stream.collapsed ? '▼ Unfold' : '▲ Collapse'}
        </button>
        {stream.paused && (
          <button
            className="stream-menu-btn stream-menu-btn-danger"
            onClick={actions.deleteStream}
            title="Delete stream"
          >
            🗑 Delete
          </button>
        )}

        {/* View mode toggles */}
        <div className="stream-menu-separator" />
        <button
          className={`stream-menu-btn ${stream.viewMode === 'list' ? 'active' : ''}`}
          onClick={() => actions.setViewMode('list')}
          title="List view"
        >
          ≡ List
        </button>
        <button
          className={`stream-menu-btn ${stream.viewMode === 'slider' ? 'active' : ''}`}
          onClick={() => actions.setViewMode('slider')}
          title="Slider view (In-Place Sliding)"
        >
          ↔ Slider
        </button>
        {/* [Phase 3] Bar Chart menu button — uncomment for next phase */}
        {/* {_hasNumericEntries && (
          <button
            className={`stream-menu-btn ${stream.viewMode === 'bar' ? 'active' : ''}`}
            onClick={() => actions.setViewMode('bar')}
            title="Bar chart view"
          >
            📊 Bar
          </button>
        )} */}

        {/* [Phase 3] LLM Insight menu button — uncomment for next phase */}
        {/* <div className="stream-menu-separator" />
        <button
          className={`stream-menu-btn ${showInsight ? 'active' : ''}`}
          onClick={() => setShowInsight(!showInsight)}
          title="LLM Insight"
        >
          💡 Explain
        </button> */}
      </div>
    </div>
  );
};

/** List view — chronological list of all entries */
const StreamListView: React.FC<{
  entries: LogEntry[];
  highlightedPaths: string[];
  expandedPaths: string[];
  onDoubleClickKey: (path: string) => void;
  onToggleExpand: (path: string) => void;
}> = ({ entries, highlightedPaths, expandedPaths, onDoubleClickKey, onToggleExpand }) => {
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <div className="stream-list">
      {entries.map((entry, idx) => (
        <div key={entry.id} className="stream-entry">
          <div className="stream-entry-index">#{idx + 1}</div>
          <div className="stream-entry-time">
            {new Date(entry.timestamp).toLocaleTimeString()}
          </div>
          <div className="stream-entry-value">
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
      <div ref={listEndRef} />
    </div>
  );
};

/** Slider view — In-Place Sliding (Paper Section 4.2.3) */
const StreamSliderView: React.FC<{
  entries: LogEntry[];
  sliderIndex: number;
  onSliderChange: (index: number) => void;
  highlightedPaths: string[];
  expandedPaths: string[];
  onDoubleClickKey: (path: string) => void;
  onToggleExpand: (path: string) => void;
}> = ({
  entries,
  sliderIndex,
  onSliderChange,
  highlightedPaths,
  expandedPaths,
  onDoubleClickKey,
  onToggleExpand,
}) => {
    if (entries.length === 0) {
      return <div className="stream-slider-empty">No entries yet</div>;
    }

    const currentEntry = entries[sliderIndex] || entries[entries.length - 1];
    const prevEntry = sliderIndex > 0 ? entries[sliderIndex - 1] : undefined;

    return (
      <div className="stream-slider">
        <div className="stream-slider-controls">
          <button
            disabled={sliderIndex <= 0}
            onClick={() => onSliderChange(sliderIndex - 1)}
          >
            ◀
          </button>
          <input
            type="range"
            min={0}
            max={entries.length - 1}
            value={sliderIndex}
            onChange={(e) => onSliderChange(Number(e.target.value))}
            className="stream-slider-range"
          />
          <button
            disabled={sliderIndex >= entries.length - 1}
            onClick={() => onSliderChange(sliderIndex + 1)}
          >
            ▶
          </button>
          <span className="stream-slider-label">
            {sliderIndex + 1} / {entries.length}
          </span>
        </div>
        <div className="stream-slider-timestamp">
          {new Date(currentEntry.timestamp).toLocaleTimeString()}
        </div>
        <div className="stream-slider-content">
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
  };
