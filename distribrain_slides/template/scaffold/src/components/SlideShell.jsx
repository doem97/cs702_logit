import * as T from '../tokens'

export default function SlideShell({
  children,
  glows = [],
  style = {},
}) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: T.BG,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: T.FONT_BODY,
        ...style,
      }}
    >
      {glows.map((glow, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: glow.top ?? '50%',
            left: glow.left ?? '50%',
            right: glow.right,
            bottom: glow.bottom,
            transform: glow.transform ?? 'translate(-50%, -50%)',
            width: glow.width ?? '500px',
            height: glow.height ?? '500px',
            background: `radial-gradient(ellipse at center, ${glow.color ?? 'rgba(245,158,11,0.08)'} 0%, transparent ${glow.spread ?? '70%'})`,
            pointerEvents: 'none',
            borderRadius: '50%',
          }}
        />
      ))}

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: '1400px',
          padding: '3rem 4rem',
          boxSizing: 'border-box',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}
