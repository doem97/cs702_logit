import * as T from '../tokens'

export default function SlideCounter({ current, total }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.5rem',
        zIndex: 100,
        pointerEvents: 'none',
        fontFamily: T.FONT_HEADING,
        fontSize: '0.95rem',
        color: T.TEXT_MUTED,
        letterSpacing: '0.1em',
        userSelect: 'none',
      }}
    >
      {String(current + 1).padStart(2, '0')}
      <span style={{ color: T.TEXT_DIM, margin: '0 4px' }}>/</span>
      {String(total).padStart(2, '0')}
    </div>
  )
}
