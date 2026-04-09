import * as T from '../tokens'

export default function SectionLabel({ children }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '2.5rem',
        left: '3.5rem',
        fontFamily: T.FONT_HEADING,
        fontSize: '0.8rem',
        color: '#666',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        zIndex: 10,
      }}
    >
      {children}
    </div>
  )
}
