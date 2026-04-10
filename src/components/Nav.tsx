export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center px-6
      bg-surface-container-lowest/80 backdrop-blur-[32px]
      border-b border-outline-variant/10">
      {/* Branding */}
      <span className="font-headline text-sm font-semibold tracking-widest uppercase text-on-surface">
        Log-it
      </span>
      <div className="w-px h-4 bg-outline-variant/40 mx-4" />
      <span className="font-body text-xs text-on-surface-variant">
        Interactive, Contextual &amp; Visual Logs
      </span>

      {/* Conference + course badges */}
      <div className="ml-auto flex items-center gap-2">
        <span className="font-label text-[10px] font-medium text-on-surface-variant
          bg-surface-container px-2.5 py-1 rounded-full border border-outline-variant/20">
          CHI '23 Reproduction
        </span>
        <span className="font-label text-[10px] font-medium text-secondary
          bg-secondary-container/50 px-2.5 py-1 rounded-full">
          CS702
        </span>
      </div>
    </header>
  );
}
