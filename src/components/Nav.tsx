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

      {/* Right: course info + authors */}
      <div className="ml-auto flex items-center gap-5">
        <div className="flex items-center gap-2 font-label text-[11px] text-on-surface-variant">
          <span>CHI '23 Reproduction</span>
          <span className="text-outline-variant/50">·</span>
          <span>CS702</span>
        </div>

        <div className="w-px h-4 bg-outline-variant/30" />

        <div className="flex items-center gap-2 font-label text-[11px] text-on-surface-variant/55">
          <span>Zichen TIAN</span>
          <span className="text-outline-variant/40">·</span>
          <span>Huihui HUANG</span>
          <span className="text-outline-variant/40">·</span>
          <span>Ni ZHANG</span>
        </div>
      </div>
    </header>
  );
}
