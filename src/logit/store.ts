/**
 * Central store for all log streams.
 * This is the "global directory" described in the paper (Section 5).
 */

import { v4 as uuidv4 } from 'uuid';
import type { LogEntry, StreamState, StoreEvent, StoreListener, StreamConfig } from './types';
import { getStreamColor, setStreamColor } from './colors';

class LogStore {
  private streams: Map<string, StreamState> = new Map();
  private listeners: Set<StoreListener> = new Set();

  subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: StoreEvent) {
    this.listeners.forEach((fn) => fn(event));
  }

  /** Get or create a stream */
  getOrCreateStream(id: string, config: StreamConfig = {}): StreamState {
    if (this.streams.has(id)) {
      return this.streams.get(id)!;
    }
    const color = config.color || getStreamColor(id);
    if (config.color) setStreamColor(id, config.color);

    const stream: StreamState = {
      id,
      name: config.name || id,
      color,
      entries: [],
      paused: false,
      collapsed: false,
      viewMode: 'list',
      sliderIndex: 0,
      highlightedPaths: [],
      collectedPaths: [],
      expandedPaths: [],
      attachedElementId: config.elementId || null,
      createdAt: Date.now(),
      config,
    };
    this.streams.set(id, stream);
    this.emit({ type: 'stream-created', streamId: id });
    return stream;
  }

  /** Add an entry to a stream */
  addEntry(streamId: string, value: unknown): LogEntry | null {
    const stream = this.streams.get(streamId);
    if (!stream || stream.paused) return null;

    const entry: LogEntry = {
      id: uuidv4(),
      value: deepClone(value),
      timestamp: Date.now(),
      preview: formatPreview(value),
    };
    stream.entries.push(entry);
    // Auto-advance slider to latest
    stream.sliderIndex = stream.entries.length - 1;
    this.emit({ type: 'entry-added', streamId, entryId: entry.id });
    return entry;
  }

  getStream(id: string): StreamState | undefined {
    return this.streams.get(id);
  }

  getAllStreams(): StreamState[] {
    return Array.from(this.streams.values());
  }

  updateStream(id: string, partial: Partial<StreamState>) {
    const stream = this.streams.get(id);
    if (!stream) return;
    Object.assign(stream, partial);
    if (partial.color) setStreamColor(id, partial.color);
    this.emit({ type: 'stream-updated', streamId: id });
  }

  deleteStream(id: string) {
    this.streams.delete(id);
    this.emit({ type: 'stream-deleted', streamId: id });
  }

  clearAll() {
    this.streams.clear();
    this.emit({ type: 'all-cleared' });
  }

  /** Toggle pause */
  togglePause(id: string) {
    const stream = this.streams.get(id);
    if (!stream) return;
    stream.paused = !stream.paused;
    this.emit({ type: 'stream-updated', streamId: id });
  }

  /** Toggle collapse */
  toggleCollapse(id: string) {
    const stream = this.streams.get(id);
    if (!stream) return;
    stream.collapsed = !stream.collapsed;
    this.emit({ type: 'stream-updated', streamId: id });
  }

  /** Set view mode */
  setViewMode(id: string, mode: 'list' | 'slider' | 'bar') {
    const stream = this.streams.get(id);
    if (!stream) return;
    stream.viewMode = mode;
    this.emit({ type: 'stream-updated', streamId: id });
  }

  /** Set slider index */
  setSliderIndex(id: string, index: number) {
    const stream = this.streams.get(id);
    if (!stream) return;
    stream.sliderIndex = Math.max(0, Math.min(index, stream.entries.length - 1));
    this.emit({ type: 'stream-updated', streamId: id });
  }

  /** Toggle a property highlight path (synchronized across stream) */
  toggleHighlightPath(id: string, path: string) {
    const stream = this.streams.get(id);
    if (!stream) return;
    const idx = stream.highlightedPaths.indexOf(path);
    if (idx >= 0) {
      stream.highlightedPaths.splice(idx, 1);
    } else {
      // Single highlight replaces previous
      stream.highlightedPaths = [path];
    }
    this.emit({ type: 'stream-updated', streamId: id });
  }

  /** Toggle a collected property path (multi-select with right-click) */
  toggleCollectedPath(id: string, path: string) {
    const stream = this.streams.get(id);
    if (!stream) return;
    const idx = stream.collectedPaths.indexOf(path);
    if (idx >= 0) {
      stream.collectedPaths.splice(idx, 1);
    } else {
      stream.collectedPaths.push(path);
    }
    this.emit({ type: 'stream-updated', streamId: id });
  }

  /** Toggle expanded path */
  toggleExpandedPath(id: string, path: string) {
    const stream = this.streams.get(id);
    if (!stream) return;
    const idx = stream.expandedPaths.indexOf(path);
    if (idx >= 0) {
      stream.expandedPaths.splice(idx, 1);
    } else {
      stream.expandedPaths.push(path);
    }
    this.emit({ type: 'stream-updated', streamId: id });
  }

  /** Attach stream to a page element */
  attachToElement(streamId: string, elementId: string | null) {
    const stream = this.streams.get(streamId);
    if (!stream) return;
    stream.attachedElementId = elementId;
    this.emit({ type: 'stream-updated', streamId });
  }
}

// Deep clone helper
function deepClone<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
}

// Format a preview string for a value
function formatPreview(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return `Array(${value.length})`;
  if (typeof value === 'object') {
    const keys = Object.keys(value as object);
    if (keys.length <= 3) return `{${keys.join(', ')}}`;
    return `{${keys.slice(0, 3).join(', ')}, ...}`;
  }
  return String(value);
}

/** Singleton store instance */
export const logStore = new LogStore();
