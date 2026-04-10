const SCENES = [
  { id: 1, label: 'Scene 01', icon: 'view_stream' },
  { id: 2, label: 'Scene 02', icon: 'account_tree' },
  { id: 3, label: 'Scene 03', icon: 'location_on' },
  { id: 4, label: 'Scene 04', icon: 'filter_list' },
  { id: 5, label: 'Scene 05', icon: 'auto_awesome' },
] as const;

interface SidebarProps {
  activeScene: number;
  onSceneChange: (n: number) => void;
}

export function Sidebar({ activeScene, onSceneChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-sidebar flex flex-col
      bg-surface-container-low pt-6 pb-4 z-40">
      <div className="px-4 mb-3">
        <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
          Scenes
        </span>
      </div>
      <nav className="flex flex-col gap-0.5 flex-1">
        {SCENES.map(scene => {
          const active = activeScene === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => onSceneChange(scene.id)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5
                transition-colors duration-200 border-l-2
                ${active
                  ? 'bg-surface-container text-on-surface border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container/60 border-transparent'
                }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${active ? 'text-primary' : ''}`}>
                {scene.icon}
              </span>
              <span className="font-label text-[11px] font-medium">{scene.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="px-4 pt-4 border-t border-outline-variant/20">
        <a
          href="https://cs702pre.distribrain.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">slideshow</span>
          <span className="font-label text-[11px]">Slides</span>
        </a>
      </div>
    </aside>
  );
}
