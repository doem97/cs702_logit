import { useCallback } from 'react';
import { log } from '../logit';

function makeUserData() {
  return {
    user: {
      id: Math.floor(Math.random() * 9000) + 1000,
      profile: {
        name: 'Alice',
        email: 'alice@example.com',
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: { email: true, push: false, sms: true },
        },
      },
      stats: {
        loginCount: Math.floor(Math.random() * 100),
        lastActive: new Date().toISOString(),
        sessions: Math.floor(Math.random() * 10) + 1,
      },
    },
    metadata: { version: '2.1.0', region: 'us-west-2', timestamp: Date.now() },
  };
}

export function SceneExploreData() {
  const handleLog = useCallback(() => {
    log(makeUserData()).name('User Data').color('#F06292');
  }, []);

  return (
    <div className="min-h-full px-8 py-10 bg-surface">
      <div className="mb-2">
        <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
          Scene 02
        </span>
      </div>
      <h1 className="font-headline text-5xl font-semibold tracking-[-0.02em] text-on-surface mb-4 leading-none">
        Explore<br /><span className="font-light text-on-surface-variant">Your Data.</span>
      </h1>
      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8 max-w-md">
        Complex nested objects become navigable trees. Expand branches, focus
        on a single property across all entries, and step through history with
        change detection.
      </p>

      <div className="flex flex-col items-start gap-2 mb-10">
        <button
          type="button"
          onClick={handleLog}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-label text-sm font-medium
            bg-primary text-on-primary hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          Log Complex Object
        </button>
        <p className="font-label text-[11px] text-on-surface-variant/60">
          Click several times, then switch to Slider view →
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg">
        {[
          { icon: 'account_tree', title: 'Object Explorer', desc: 'Nested objects render as expandable/collapsible trees.' },
          { icon: 'filter_alt', title: 'Property Highlight', desc: 'Double-click any key to focus only that property across all entries.' },
          { icon: 'sync', title: 'Synchronized State', desc: 'Expanding a branch in one entry expands it everywhere.' },
          { icon: 'linear_scale', title: 'In-Place Sliding', desc: 'Slider view steps entry-by-entry with changed values highlighted.' },
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
