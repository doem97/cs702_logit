/**
 * React hooks for the Log-it store.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { logStore } from './store';
import type { StreamState, StoreEvent } from './types';

/** Subscribe to all streams and re-render on changes */
export function useLogStreams(): StreamState[] {
  const [streams, setStreams] = useState<StreamState[]>(() => logStore.getAllStreams());
  const updateRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleEvent = (_event: StoreEvent) => {
      // Batch updates with a microtask to avoid excessive re-renders
      if (updateRef.current) clearTimeout(updateRef.current);
      updateRef.current = setTimeout(() => {
        setStreams([...logStore.getAllStreams()]);
      }, 16); // ~1 frame
    };
    const unsub = logStore.subscribe(handleEvent);
    return () => {
      unsub();
      if (updateRef.current) clearTimeout(updateRef.current);
    };
  }, []);

  return streams;
}

/** Subscribe to a specific stream */
export function useLogStream(streamId: string): StreamState | undefined {
  const [stream, setStream] = useState<StreamState | undefined>(
    () => logStore.getStream(streamId)
  );

  useEffect(() => {
    const handleEvent = (event: StoreEvent) => {
      if (
        (event.type === 'stream-updated' && event.streamId === streamId) ||
        (event.type === 'entry-added' && event.streamId === streamId) ||
        (event.type === 'stream-created' && event.streamId === streamId)
      ) {
        const s = logStore.getStream(streamId);
        if (s) setStream({ ...s, entries: [...s.entries] });
      }
      if (event.type === 'stream-deleted' && event.streamId === streamId) {
        setStream(undefined);
      }
    };
    const unsub = logStore.subscribe(handleEvent);
    return unsub;
  }, [streamId]);

  return stream;
}

/** Actions for a stream */
export function useStreamActions(streamId: string) {
  const togglePause = useCallback(() => logStore.togglePause(streamId), [streamId]);
  const toggleCollapse = useCallback(() => logStore.toggleCollapse(streamId), [streamId]);
  const deleteStream = useCallback(() => logStore.deleteStream(streamId), [streamId]);
  const setViewMode = useCallback(
    (mode: 'list' | 'slider' | 'bar') => logStore.setViewMode(streamId, mode),
    [streamId]
  );
  const setSliderIndex = useCallback(
    (index: number) => logStore.setSliderIndex(streamId, index),
    [streamId]
  );
  const toggleHighlightPath = useCallback(
    (path: string) => logStore.toggleHighlightPath(streamId, path),
    [streamId]
  );
  const toggleCollectedPath = useCallback(
    (path: string) => logStore.toggleCollectedPath(streamId, path),
    [streamId]
  );
  const toggleExpandedPath = useCallback(
    (path: string) => logStore.toggleExpandedPath(streamId, path),
    [streamId]
  );
  const attachToElement = useCallback(
    (elementId: string | null) => logStore.attachToElement(streamId, elementId),
    [streamId]
  );

  return {
    togglePause,
    toggleCollapse,
    deleteStream,
    setViewMode,
    setSliderIndex,
    toggleHighlightPath,
    toggleCollectedPath,
    toggleExpandedPath,
    attachToElement,
  };
}
