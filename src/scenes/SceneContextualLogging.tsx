import { useState, useRef, useCallback } from 'react';
import { log, useLogStreams } from '../logit';
import { StreamCard } from '../components/StreamCard';

export function SceneContextualLogging() {
  const [boxSize, setBoxSize] = useState({ width: 200, height: 120 });
  const boxRef = useRef<HTMLDivElement>(null);

  const capture = useCallback((width: number, height: number) => {
    if (!boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    log({
      tagName: 'DIV', id: 'debug-target',
      x: Math.round(r.x), y: Math.round(r.y),
      width: Math.round(width), height: Math.round(height),
      top: Math.round(r.top), left: Math.round(r.left),
      visible: true,
    }).name('Element Info').color('#81C784').element('debug-target');
  }, []);

  const logInfo = useCallback(() => {
    capture(boxSize.width, boxSize.height);
  }, [capture, boxSize]);

  const resizeAndLog = useCallback(() => {
    const w = Math.floor(Math.random() * 200) + 120;
    const h = Math.floor(Math.random() * 120) + 80;
    setBoxSize({ width: w, height: h });
    requestAnimationFrame(() => capture(w, h));
  }, [capture]);

  const allStreams = useLogStreams();
  const attachedStream = allStreams.find(s => s.attachedElementId === 'debug-target');

  return (
    <div className="min-h-full px-8 py-10 bg-surface">
      <div className="mb-2">
        <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
          Scene 03
        </span>
      </div>
      <h1 className="font-headline text-5xl font-semibold tracking-[-0.02em] text-on-surface mb-4 leading-none">
        Contextual<br /><span className="font-light text-on-surface-variant">Logging</span>
      </h1>
      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6 max-w-md">
        Log output can be spatially attached to a page element. The stream
        appears right next to the element being debugged — and follows it if
        it moves.
      </p>

      {/* Buttons first — stable, never shift */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={logInfo}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-label text-xs font-medium
            bg-surface-container-lowest border border-outline-variant/20 text-on-surface
            hover:bg-surface-container active:scale-95 transition-all duration-200">
          <span className="material-symbols-outlined text-[14px]">info</span>
          Log Element Info
        </button>
        <button
          type="button"
          onClick={resizeAndLog}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-label text-xs font-medium
            bg-surface-container-lowest border border-outline-variant/20 text-on-surface
            hover:bg-surface-container active:scale-95 transition-all duration-200">
          <span className="material-symbols-outlined text-[14px]">aspect_ratio</span>
          Resize & Log
        </button>
      </div>

      {/* Demo area: target element + attached stream side-by-side */}
      <div className="flex items-start gap-4 mb-10">
        <div
          id="debug-target"
          ref={boxRef}
          className="bg-surface-container rounded-xl border-2 border-dashed border-outline-variant/30
            flex items-center justify-center transition-all duration-300 flex-shrink-0"
          style={{ width: boxSize.width, height: boxSize.height }}
        >
          <div className="text-center pointer-events-none">
            <span className="material-symbols-outlined text-[24px] text-on-surface-variant/20">crop_free</span>
            <div className="font-label text-[10px] text-on-surface-variant/30 mt-1">Target Element</div>
            <div className="font-mono text-[9px] text-on-surface-variant/20">{boxSize.width} × {boxSize.height}</div>
          </div>
        </div>
        {attachedStream ? (
          <div className="w-72 flex-shrink-0 shadow-lg rounded-xl overflow-hidden">
            <StreamCard stream={attachedStream} />
          </div>
        ) : (
          <div className="flex items-center gap-2 self-center text-on-surface-variant/30">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span className="font-label text-[11px]">stream appears here</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg">
        {[
          { icon: 'location_on', title: 'Element Attachment', desc: 'log().element("id") ties output to a DOM element spatially.' },
          { icon: 'follow_the_signs', title: 'Live Tracking', desc: 'The stream follows the element position via requestAnimationFrame.' },
          { icon: 'filter_alt', title: 'Property Highlight', desc: 'Double-click "width" to track it across all resize events.' },
        ].map(f => (
          <div key={f.title} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10">
            <span className="material-symbols-outlined text-[20px] text-primary mb-2 block">{f.icon}</span>
            <div className="font-label text-xs font-semibold text-on-surface mb-1">{f.title}</div>
            <div className="font-body text-[11px] text-on-surface-variant leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
