/**
 * The log() function — the primary API for Log-it.
 *
 * Replaces console.log() with a chainable function:
 *   log(value)
 *   log(value).name('myStream').color('#ff0000').element('btn1')
 *
 * Each unique call-site (or explicit .id()) creates a Stream.
 */

import { logStore } from './store';
import type { StreamConfig } from './types';

/** Auto-generate a stream ID from the call stack */
function getCallSiteId(): string {
  const err = new Error();
  const stack = err.stack || '';
  const lines = stack.split('\n');
  // Skip: Error, getCallSiteId, log function, user code wrapper
  // Find first line that's NOT from logit/
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.includes('/logit/') && !line.includes('log.ts')) {
      // Extract file:line:col
      const match = line.match(/(?:at\s+)?(?:.*\s+)?\(?(.+?):(\d+):(\d+)\)?$/);
      if (match) {
        return `${match[1]}:${match[2]}`;
      }
      return `stream-${i}`;
    }
  }
  return `stream-${Date.now()}`;
}

/** The chain builder returned by log() */
class LogChain {
  private streamId: string;
  private config: StreamConfig = {};

  constructor(value: unknown, callSiteId: string) {
    this.streamId = callSiteId;
    // Defer stream creation + entry addition
    queueMicrotask(() => {
      this.flush(value);
    });
  }

  private flush(value: unknown) {
    // Apply any config set via chaining
    const stream = logStore.getOrCreateStream(this.streamId, this.config);
    // Update config if stream already existed
    if (this.config.name && stream.name !== this.config.name) {
      logStore.updateStream(this.streamId, { name: this.config.name });
    }
    if (this.config.color && stream.color !== this.config.color) {
      logStore.updateStream(this.streamId, { color: this.config.color });
    }
    if (this.config.elementId) {
      logStore.attachToElement(this.streamId, this.config.elementId);
    }
    logStore.addEntry(this.streamId, value);
  }

  /** Set a custom ID for the stream (merges logs with same id) */
  id(streamId: string): this {
    this.streamId = streamId;
    return this;
  }

  /** Set the display name */
  name(name: string): this {
    this.config.name = name;
    return this;
  }

  /** Set the stream color */
  color(color: string): this {
    this.config.color = color;
    return this;
  }

  /** Attach to a page element by its id */
  element(elementId: string): this {
    this.config.elementId = elementId;
    return this;
  }
}

/**
 * The main log() function.
 * Usage: log(someValue).name('myLog').color('red')
 */
export function log(value: unknown): LogChain {
  const callSiteId = getCallSiteId();
  return new LogChain(value, callSiteId);
}

// Expose on window for use in demo apps
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).logit = log;
}
