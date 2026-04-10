/**
 * Log-it: Interactive, Structured, and Visual Logs for Programming
 *
 * A reproduction of the CHI '23 paper by Jiang, Sun, and Xia.
 * With extensions: LLM-Powered Log Insight & Timeline Sparkline.
 *
 * Core API (UI-independent):
 *   import { log, logStore } from './logit';
 *
 *   log(someValue).name('myStream').color('#ff0000');
 */

export { log } from './log';
export { logStore } from './store';
export { useLogStreams, useLogStream, useStreamActions } from './hooks';
export type { StreamState, LogEntry, StreamConfig, LLMInsight } from './types';
