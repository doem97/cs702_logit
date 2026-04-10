export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center px-6 gap-8
      bg-surface-container-lowest/80 backdrop-blur-[32px]
      border-b border-outline-variant/10">
      <span className="font-headline text-sm font-semibold tracking-widest uppercase text-on-surface">
        Log-it
      </span>
      <nav className="flex items-center gap-6 ml-4">
        <button className="font-label text-xs font-medium text-on-surface border-b border-on-surface pb-0.5">
          Live Feed
        </button>
        <button className="font-label text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors duration-200">
          Archive
        </button>
        <button className="font-label text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors duration-200">
          Analytics
        </button>
      </nav>
      <div className="ml-auto flex items-center gap-3 text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px]">notifications</span>
        <span className="material-symbols-outlined text-[18px]">settings</span>
        <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center">
          <span className="material-symbols-outlined text-[14px]">person</span>
        </div>
      </div>
    </header>
  );
}
