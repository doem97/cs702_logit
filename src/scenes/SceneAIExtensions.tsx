import { useState, useRef, useCallback, useEffect } from 'react';
import { log } from '../logit';

export function SceneAIExtensions() {
  const [tracking, setTracking] = useState(false);
  const zoneRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPos = useRef<{ x: number; y: number; clientX: number; clientY: number } | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!zoneRef.current) return;
    const rect = zoneRef.current.getBoundingClientRect();
    lastPos.current = {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
      clientX: e.clientX,
      clientY: e.clientY,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    lastPos.current = null;
  }, []);

  useEffect(() => {
    const zone = zoneRef.current;
    if (!tracking) {
      if (timerRef.current) clearInterval(timerRef.current);
      zone?.removeEventListener('mousemove', handleMouseMove);
      zone?.removeEventListener('mouseleave', handleMouseLeave);
      return;
    }

    zone?.addEventListener('mousemove', handleMouseMove);
    zone?.addEventListener('mouseleave', handleMouseLeave);
    timerRef.current = setInterval(() => {
      if (lastPos.current) {
        log(lastPos.current).name('Mouse Position').color('#FFD54F');
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      zone?.removeEventListener('mousemove', handleMouseMove);
      zone?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [tracking, handleMouseMove, handleMouseLeave]);

  const toggle = useCallback(() => setTracking(v => !v), []);

  return (
    <div className="min-h-full px-8 py-10 bg-surface">
      <div className="mb-2">
        <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
          Scene 05
        </span>
      </div>
      <h1 className="font-headline text-5xl font-semibold tracking-[-0.02em] text-on-surface mb-4 leading-none">
        AI-Powered<br /><span className="font-light text-on-surface-variant">Extensions</span>
      </h1>
      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-3 max-w-md">
        Beyond the original paper — a timeline sparkline and AI analysis engine
        built on top of the Log-it core.
      </p>
      <div className="flex items-center gap-2 mb-8">
        <span className="font-label text-[10px] font-semibold text-secondary uppercase tracking-wide
          bg-secondary-container/40 px-2 py-0.5 rounded-full">
          Our Contribution
        </span>
        <span className="font-label text-[10px] text-on-surface-variant">Not in the original CHI '23 paper</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={toggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-label text-xs font-medium
            active:scale-95 transition-all duration-200
            ${tracking
              ? 'bg-error/10 text-error border border-error/20 hover:bg-error/20'
              : 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm'
            }`}
        >
          <span className="material-symbols-outlined text-[14px]">{tracking ? 'stop' : 'play_arrow'}</span>
          {tracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
        {tracking && (
          <span className="flex items-center gap-1.5 font-label text-[10px] text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
            Recording at ~10fps
          </span>
        )}
      </div>

      <div
        ref={zoneRef}
        className={`rounded-xl border-2 border-dashed flex items-center justify-center mb-10
          transition-all duration-200
          ${tracking
            ? 'border-yellow-400/50 bg-yellow-50/20 cursor-crosshair'
            : 'border-outline-variant/30 bg-surface-container/30'
          }`}
        style={{ height: 200 }}
      >
        {!tracking ? (
          <div className="text-center pointer-events-none">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant/20">mouse</span>
            <div className="font-label text-[11px] text-on-surface-variant/40 mt-2">Mouse Tracking Zone</div>
            <div className="font-body text-[10px] text-on-surface-variant/30 mt-1">
              Start tracking, then move your cursor here
            </div>
          </div>
        ) : (
          <div className="text-center pointer-events-none">
            <span className="material-symbols-outlined text-[24px] text-yellow-500/50 animate-pulse">my_location</span>
            <div className="font-label text-[11px] text-yellow-600/60 mt-1">Tracking active — move your cursor</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg">
        {[
          { icon: 'show_chart', title: 'Timeline Sparkline', badge: 'New', desc: 'A mini chart shows when logs fired. Numeric streams render as a line chart.' },
          { icon: 'bar_chart', title: 'Bar Chart View', badge: null, desc: 'Switch to Bar view in the stream controls to see proportional values.' },
          { icon: 'auto_awesome', title: 'LLM Insight', badge: 'New', desc: 'Click "Explain" in any stream for heuristic or OpenAI-powered analysis.' },
        ].map(f => (
          <div key={f.title} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[20px] text-primary">{f.icon}</span>
              {f.badge && (
                <span className="font-label text-[9px] font-semibold text-secondary bg-secondary-container/40 px-1.5 py-0.5 rounded-full">
                  {f.badge}
                </span>
              )}
            </div>
            <div className="font-label text-xs font-semibold text-on-surface mb-1">{f.title}</div>
            <div className="font-body text-[11px] text-on-surface-variant leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
