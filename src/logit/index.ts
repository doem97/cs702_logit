/**
 * Log-it: Interactive, Structured, and Visual Logs for Programming
 *
 * A reproduction of the CHI '23 paper by Jiang, Sun, and Xia.
 * With extensions: LLM-Powered Log Insight & Timeline Sparkline.
 *
 * Usage:
 *   import { log, LogPanel } from './logit';
 *
 *   // In your code:
 *   log(someValue).name('myStream').color('#ff0000');
 *
 *   // In your React app:
 *   <LogPanel position="right" width={400} />
 */

export { log } from './log';
export { logStore } from './store';
export { LogPanel } from './components/LogPanel';
export { StreamView } from './components/StreamView';
export { useLogStreams, useLogStream, useStreamActions } from './hooks';
export type { StreamState, LogEntry, StreamConfig, LLMInsight } from './types';

// Import styles
import './logit.css';
