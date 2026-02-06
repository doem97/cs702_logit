/**
 * Core types for the Log-it reproduction.
 */

/** A single logged item within a stream */
export interface LogEntry {
  id: string;
  value: unknown;
  timestamp: number;
  /** Stringified preview for display */
  preview: string;
}

/** Configuration for a log stream */
export interface StreamConfig {
  name?: string;
  color?: string;
  elementId?: string;
  paused?: boolean;
}

/** State of a single log stream */
export interface StreamState {
  /** Unique stream identifier (derived from call-site or user-set .id()) */
  id: string;
  /** Display name */
  name: string;
  /** Assigned color */
  color: string;
  /** All logged entries */
  entries: LogEntry[];
  /** Whether the stream is paused */
  paused: boolean;
  /** Whether the stream body is collapsed */
  collapsed: boolean;
  /** View mode: 'list' | 'slider' | 'bar' */
  viewMode: 'list' | 'slider' | 'bar';
  /** Current slider index (for slider view) */
  sliderIndex: number;
  /** Highlighted property paths (for synchronized interaction) */
  highlightedPaths: string[];
  /** Collected property paths (right-click multi-select) */
  collectedPaths: string[];
  /** Expanded property paths */
  expandedPaths: string[];
  /** Attached element ID */
  attachedElementId: string | null;
  /** Creation timestamp */
  createdAt: number;
  /** Config from the chaining API */
  config: StreamConfig;
}

/** Events emitted by the log store */
export type StoreEvent =
  | { type: 'stream-created'; streamId: string }
  | { type: 'stream-updated'; streamId: string }
  | { type: 'entry-added'; streamId: string; entryId: string }
  | { type: 'stream-deleted'; streamId: string }
  | { type: 'all-cleared' };

export type StoreListener = (event: StoreEvent) => void;

/** LLM insight result */
export interface LLMInsight {
  loading: boolean;
  result: string | null;
  error: string | null;
}
