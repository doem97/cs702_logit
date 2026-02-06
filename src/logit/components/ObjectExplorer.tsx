/**
 * ObjectExplorer: Renders a logged value with interactive exploration.
 *
 * Supports:
 * - Expanding/collapsing nested objects
 * - Property Highlighting (double-click a key to focus on it)
 * - Multi-property collection (right-click to add to collection)
 * - Synchronized interaction (all entries share expansion/highlight state)
 * - Changed-value highlighting for In-Place Sliding
 */

import React, { useCallback } from 'react';

interface ObjectExplorerProps {
  value: unknown;
  /** Previous value for change detection (slider mode) */
  prevValue?: unknown;
  /** Current path in the object tree */
  path?: string;
  /** Currently highlighted paths (single-property focus) */
  highlightedPaths?: string[];
  /** Collected paths (multi-property selection) */
  collectedPaths?: string[];
  /** Expanded paths */
  expandedPaths?: string[];
  /** Callbacks */
  onDoubleClickKey?: (path: string) => void;
  onRightClickKey?: (path: string) => void;
  onToggleExpand?: (path: string) => void;
  /** Depth for indentation */
  depth?: number;
}

export const ObjectExplorer: React.FC<ObjectExplorerProps> = ({
  value,
  prevValue,
  path = '',
  highlightedPaths = [],
  collectedPaths = [],
  expandedPaths = [],
  onDoubleClickKey,
  onRightClickKey,
  onToggleExpand,
  depth = 0,
}) => {
  const isHighlighted = highlightedPaths.length > 0;
  const currentHighlighted = highlightedPaths[0] || '';

  // If we have a highlight and this path is not a prefix of it, hide
  if (isHighlighted && currentHighlighted && path !== '' && !currentHighlighted.startsWith(path) && !path.startsWith(currentHighlighted)) {
    return null;
  }

  if (value === null) return <span className="oe-null">null</span>;
  if (value === undefined) return <span className="oe-undefined">undefined</span>;
  if (typeof value === 'string') {
    const changed = prevValue !== undefined && prevValue !== value;
    return (
      <span className={`oe-string ${changed ? 'oe-changed' : ''}`}>
        "{value}"
      </span>
    );
  }
  if (typeof value === 'number') {
    const changed = prevValue !== undefined && prevValue !== value;
    return (
      <span className={`oe-number ${changed ? 'oe-changed' : ''}`}>
        {value}
      </span>
    );
  }
  if (typeof value === 'boolean') {
    const changed = prevValue !== undefined && prevValue !== value;
    return (
      <span className={`oe-boolean ${changed ? 'oe-changed' : ''}`}>
        {String(value)}
      </span>
    );
  }

  if (Array.isArray(value)) {
    return (
      <ArrayExplorer
        value={value}
        prevValue={Array.isArray(prevValue) ? prevValue : undefined}
        path={path}
        highlightedPaths={highlightedPaths}
        collectedPaths={collectedPaths}
        expandedPaths={expandedPaths}
        onDoubleClickKey={onDoubleClickKey}
        onRightClickKey={onRightClickKey}
        onToggleExpand={onToggleExpand}
        depth={depth}
      />
    );
  }

  if (typeof value === 'object') {
    return (
      <ObjectNodeExplorer
        value={value as Record<string, unknown>}
        prevValue={typeof prevValue === 'object' && prevValue !== null ? prevValue as Record<string, unknown> : undefined}
        path={path}
        highlightedPaths={highlightedPaths}
        collectedPaths={collectedPaths}
        expandedPaths={expandedPaths}
        onDoubleClickKey={onDoubleClickKey}
        onRightClickKey={onRightClickKey}
        onToggleExpand={onToggleExpand}
        depth={depth}
      />
    );
  }

  return <span className="oe-other">{String(value)}</span>;
};

/** Object node renderer */
const ObjectNodeExplorer: React.FC<{
  value: Record<string, unknown>;
  prevValue?: Record<string, unknown>;
  path: string;
  highlightedPaths: string[];
  collectedPaths: string[];
  expandedPaths: string[];
  onDoubleClickKey?: (path: string) => void;
  onRightClickKey?: (path: string) => void;
  onToggleExpand?: (path: string) => void;
  depth: number;
}> = ({
  value,
  prevValue,
  path,
  highlightedPaths,
  collectedPaths,
  expandedPaths,
  onDoubleClickKey,
  onRightClickKey,
  onToggleExpand,
  depth,
}) => {
    const isExpanded = path === '' || expandedPaths.includes(path);
    const keys = Object.keys(value);

    const handleToggle = useCallback(() => {
      if (path !== '') onToggleExpand?.(path);
    }, [path, onToggleExpand]);

    if (!isExpanded && path !== '') {
      return (
        <span className="oe-collapsed" onClick={handleToggle}>
          {'{'}...{keys.length}{'}'}
        </span>
      );
    }

    return (
      <div className="oe-object" style={{ marginLeft: depth > 0 ? 12 : 0 }}>
        {path !== '' && (
          <span className="oe-bracket" onClick={handleToggle}>{'{'}</span>
        )}
        {keys.map((key) => {
          const childPath = path ? `${path}.${key}` : key;
          const isCollected = collectedPaths.includes(childPath);
          return (
            <div key={key} className={`oe-property ${isCollected ? 'oe-collected' : ''}`}>
              <span
                className="oe-key"
                onDoubleClick={(e) => {
                  e.preventDefault();
                  onDoubleClickKey?.(childPath);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onRightClickKey?.(childPath);
                }}
              >
                {key}
              </span>
              <span className="oe-colon">: </span>
              <ObjectExplorer
                value={value[key]}
                prevValue={prevValue?.[key]}
                path={childPath}
                highlightedPaths={highlightedPaths}
                collectedPaths={collectedPaths}
                expandedPaths={expandedPaths}
                onDoubleClickKey={onDoubleClickKey}
                onRightClickKey={onRightClickKey}
                onToggleExpand={onToggleExpand}
                depth={depth + 1}
              />
            </div>
          );
        })}
        {path !== '' && (
          <span className="oe-bracket" onClick={handleToggle}>{'}'}</span>
        )}
      </div>
    );
  };

/** Array renderer */
const ArrayExplorer: React.FC<{
  value: unknown[];
  prevValue?: unknown[];
  path: string;
  highlightedPaths: string[];
  collectedPaths: string[];
  expandedPaths: string[];
  onDoubleClickKey?: (path: string) => void;
  onRightClickKey?: (path: string) => void;
  onToggleExpand?: (path: string) => void;
  depth: number;
}> = ({
  value,
  prevValue,
  path,
  highlightedPaths,
  collectedPaths,
  expandedPaths,
  onDoubleClickKey,
  onRightClickKey,
  onToggleExpand,
  depth,
}) => {
    const isExpanded = path === '' || expandedPaths.includes(path);

    const handleToggle = useCallback(() => {
      if (path !== '') onToggleExpand?.(path);
    }, [path, onToggleExpand]);

    if (!isExpanded && path !== '') {
      return (
        <span className="oe-collapsed" onClick={handleToggle}>
          [{value.length}]
        </span>
      );
    }

    return (
      <div className="oe-array" style={{ marginLeft: depth > 0 ? 12 : 0 }}>
        {path !== '' && (
          <span className="oe-bracket" onClick={handleToggle}>[</span>
        )}
        {value.map((item, idx) => {
          const childPath = path ? `${path}[${idx}]` : `[${idx}]`;
          return (
            <div key={idx} className="oe-array-item">
              <span className="oe-index">{idx}: </span>
              <ObjectExplorer
                value={item}
                prevValue={prevValue?.[idx]}
                path={childPath}
                highlightedPaths={highlightedPaths}
                collectedPaths={collectedPaths}
                expandedPaths={expandedPaths}
                onDoubleClickKey={onDoubleClickKey}
                onRightClickKey={onRightClickKey}
                onToggleExpand={onToggleExpand}
                depth={depth + 1}
              />
            </div>
          );
        })}
        {path !== '' && (
          <span className="oe-bracket" onClick={handleToggle}>]</span>
        )}
      </div>
    );
  };
