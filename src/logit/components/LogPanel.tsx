/**
 * LogPanel: The main container that renders all log streams.
 *
 * This is the "orchestra" described in Paper Section 4.5 —
 * the panel where all Streams are organized and displayed.
 */

import React, { useState } from 'react';
import type { StreamState } from '../types';
import { useLogStreams } from '../hooks';
import { StreamView } from './StreamView';
import { logStore } from '../store';

interface LogPanelProps {
  /** Position: 'right' panel (default), 'bottom', or 'floating' */
  position?: 'right' | 'bottom' | 'floating';
  /** Width for right panel */
  width?: number;
  /** Height for bottom panel */
  height?: number;
}

export const LogPanel: React.FC<LogPanelProps> = ({
  position = 'right',
  width = 400,
  height = 300,
}) => {
  const streams = useLogStreams();
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState('');

  const filteredStreams = filter
    ? streams.filter(
      (s) =>
        s.name.toLowerCase().includes(filter.toLowerCase()) ||
        s.id.toLowerCase().includes(filter.toLowerCase())
    )
    : streams;

  // Separate: attached streams (rendered at their element) vs panel streams
  const panelStreams = filteredStreams.filter((s) => !s.attachedElementId);
  const attachedStreams = filteredStreams.filter((s) => s.attachedElementId);

  const panelStyle: React.CSSProperties =
    position === 'right'
      ? {
        position: 'fixed',
        right: 0,
        top: 0,
        width: collapsed ? 40 : width,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'width 0.2s ease',
      }
      : position === 'bottom'
        ? {
          position: 'fixed',
          left: 0,
          bottom: 0,
          width: '100%',
          height: collapsed ? 40 : height,
          overflowY: 'auto',
          transition: 'height 0.2s ease',
        }
        : {};

  return (
    <>
      {/* Main panel */}
      <div className="log-panel" style={panelStyle} data-position={position}>
        <div className="log-panel-header">
          <button
            className="log-panel-toggle"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {position === 'right'
              ? collapsed ? '◀' : '▶'
              : collapsed ? '▲' : '▼'}
          </button>
          {!collapsed && (
            <>
              <span className="log-panel-title">Log-it</span>
              <span className="log-panel-count">{streams.length} streams</span>
              <input
                className="log-panel-filter"
                placeholder="Filter streams..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <button
                className="log-panel-clear"
                onClick={() => logStore.clearAll()}
                title="Clear all streams"
              >
                🗑
              </button>
            </>
          )}
        </div>
        {!collapsed && (
          <div className="log-panel-streams">
            {panelStreams.length === 0 && (
              <div className="log-panel-empty">
                <p>No log streams yet.</p>
                <p>
                  Use <code>log(value)</code> to start logging!
                </p>
              </div>
            )}
            {panelStreams.map((stream) => (
              <StreamView key={stream.id} stream={stream} />
            ))}
          </div>
        )}
      </div>

      {/* Attached streams — rendered as floating elements near their target */}
      {attachedStreams.map((stream) => (
        <AttachedStreamView key={stream.id} stream={stream} />
      ))}
    </>
  );
};

/** Renders a stream attached to a page element */
const AttachedStreamView: React.FC<{ stream: StreamState }> = ({ stream }) => {
  const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = React.useRef<number>(0);

  React.useEffect(() => {
    const updatePosition = () => {
      if (stream.attachedElementId) {
        const el = document.getElementById(stream.attachedElementId);
        if (el) {
          const rect = el.getBoundingClientRect();
          setPos({
            x: rect.right + 8,
            y: rect.top,
          });
        }
      }
      rafRef.current = requestAnimationFrame(updatePosition);
    };
    updatePosition();
    return () => cancelAnimationFrame(rafRef.current);
  }, [stream.attachedElementId]);

  return (
    <div
      className="attached-stream"
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 10000,
        maxWidth: 350,
      }}
    >
      <StreamView stream={stream} />
    </div>
  );
};
