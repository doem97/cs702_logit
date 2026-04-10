import { useCallback } from 'react';

interface ObjectExplorerProps {
  value: unknown;
  prevValue?: unknown;
  path?: string;
  highlightedPaths?: string[];
  expandedPaths?: string[];
  onDoubleClickKey?: (path: string) => void;
  onToggleExpand?: (path: string) => void;
  depth?: number;
}

export function ObjectExplorer({
  value,
  prevValue,
  path = '',
  highlightedPaths = [],
  expandedPaths = [],
  onDoubleClickKey,
  onToggleExpand,
  depth = 0,
}: ObjectExplorerProps) {
  // Highlight filter: show only highlighted path + ancestors.
  // Single-highlight design: the store enforces at most one highlighted path at a time.
  const highlighted = highlightedPaths[0] ?? '';
  if (
    highlighted &&
    path !== '' &&
    !highlighted.startsWith(path) &&
    !path.startsWith(highlighted)
  ) {
    return null;
  }

  if (value === null) return <span className="text-on-surface-variant/60 italic text-xs font-mono">null</span>;
  if (value === undefined) return <span className="text-on-surface-variant/60 italic text-xs font-mono">undefined</span>;

  if (typeof value === 'string') {
    const changed = prevValue !== undefined && prevValue !== value;
    return <span className={`text-xs font-mono ${changed ? 'bg-tertiary-fixed/60 rounded px-0.5' : 'text-green-700'}`}>"{value}"</span>;
  }
  if (typeof value === 'number') {
    const changed = prevValue !== undefined && prevValue !== value;
    return <span className={`text-xs font-mono ${changed ? 'bg-tertiary-fixed/60 rounded px-0.5' : 'text-orange-600'}`}>{value}</span>;
  }
  if (typeof value === 'boolean') {
    const changed = prevValue !== undefined && prevValue !== value;
    return <span className={`text-xs font-mono ${changed ? 'bg-tertiary-fixed/60 rounded px-0.5' : 'text-yellow-600'}`}>{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    return (
      <ArrayNode
        value={value}
        prevValue={Array.isArray(prevValue) ? prevValue : undefined}
        path={path} highlightedPaths={highlightedPaths} expandedPaths={expandedPaths}
        onDoubleClickKey={onDoubleClickKey} onToggleExpand={onToggleExpand} depth={depth}
      />
    );
  }
  if (typeof value === 'object') {
    // Cast is safe: value originates from log() calls with JSON-compatible data
    return (
      <ObjectNode
        value={value as Record<string, unknown>}
        prevValue={typeof prevValue === 'object' && prevValue !== null ? prevValue as Record<string, unknown> : undefined}
        path={path} highlightedPaths={highlightedPaths} expandedPaths={expandedPaths}
        onDoubleClickKey={onDoubleClickKey} onToggleExpand={onToggleExpand} depth={depth}
      />
    );
  }

  return <span className="text-xs font-mono text-on-surface-variant">{String(value)}</span>;
}

function ObjectNode({ value, prevValue, path, highlightedPaths, expandedPaths, onDoubleClickKey, onToggleExpand, depth }: {
  value: Record<string, unknown>; prevValue?: Record<string, unknown>;
  path: string; highlightedPaths: string[]; expandedPaths: string[];
  onDoubleClickKey?: (p: string) => void; onToggleExpand?: (p: string) => void; depth: number;
}) {
  const isExpanded = path === '' || expandedPaths.includes(path);
  const keys = Object.keys(value);
  const handleToggle = useCallback(() => { if (path !== '') onToggleExpand?.(path); }, [path, onToggleExpand]);

  if (!isExpanded && path !== '') {
    return (
      <span className="text-xs font-mono text-on-surface-variant/70 cursor-pointer hover:text-on-surface" onClick={handleToggle}>
        {'{'}…{keys.length}{'}'}
      </span>
    );
  }

  return (
    <div style={{ marginLeft: depth > 0 ? 12 : 0 }}>
      {path !== '' && <span className="text-xs font-mono text-on-surface-variant cursor-pointer" onClick={handleToggle}>{'{'}</span>}
      {keys.map(key => {
        const childPath = path ? `${path}.${key}` : key;
        return (
          <div key={key} className="flex items-start gap-1 leading-5 min-w-0">
            <span
              className="text-xs font-mono text-secondary cursor-pointer hover:text-primary select-none flex-shrink-0"
              onDoubleClick={e => { e.preventDefault(); onDoubleClickKey?.(childPath); }}
              title="Double-click to highlight across all entries"
            >
              {key}:
            </span>
            <span className="min-w-0 flex-1">
              <ObjectExplorer
                value={value[key]} prevValue={prevValue?.[key]}
                path={childPath} highlightedPaths={highlightedPaths} expandedPaths={expandedPaths}
                onDoubleClickKey={onDoubleClickKey} onToggleExpand={onToggleExpand} depth={depth + 1}
              />
            </span>
          </div>
        );
      })}
      {path !== '' && <span className="text-xs font-mono text-on-surface-variant cursor-pointer" onClick={handleToggle}>{'}'}</span>}
    </div>
  );
}

function ArrayNode({ value, prevValue, path, highlightedPaths, expandedPaths, onDoubleClickKey, onToggleExpand, depth }: {
  value: unknown[]; prevValue?: unknown[];
  path: string; highlightedPaths: string[]; expandedPaths: string[];
  onDoubleClickKey?: (p: string) => void; onToggleExpand?: (p: string) => void; depth: number;
}) {
  const isExpanded = path === '' || expandedPaths.includes(path);
  const handleToggle = useCallback(() => { if (path !== '') onToggleExpand?.(path); }, [path, onToggleExpand]);

  if (!isExpanded && path !== '') {
    return (
      <span className="text-xs font-mono text-on-surface-variant/70 cursor-pointer hover:text-on-surface" onClick={handleToggle}>
        [{value.length}]
      </span>
    );
  }

  return (
    <div style={{ marginLeft: depth > 0 ? 12 : 0 }}>
      {path !== '' && <span className="text-xs font-mono text-on-surface-variant cursor-pointer" onClick={handleToggle}>[</span>}
      {value.map((item, idx) => {
        const childPath = path ? `${path}[${idx}]` : `[${idx}]`;
        // key=idx is intentional: this is a read-only viewer, arrays are never reordered
        return (
          <div key={idx} className="flex items-start gap-1 leading-5">
            <span className="text-xs font-mono text-on-surface-variant/50 flex-shrink-0">{idx}:</span>
            <ObjectExplorer
              value={item} prevValue={prevValue?.[idx]}
              path={childPath} highlightedPaths={highlightedPaths} expandedPaths={expandedPaths}
              onDoubleClickKey={onDoubleClickKey} onToggleExpand={onToggleExpand} depth={depth + 1}
            />
          </div>
        );
      })}
      {path !== '' && <span className="text-xs font-mono text-on-surface-variant cursor-pointer" onClick={handleToggle}>]</span>}
    </div>
  );
}
