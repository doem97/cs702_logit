import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as T from '../tokens'

export default function SlideNav({ slides, current, goTo }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <div
        onClick={(e) => { e.stopPropagation(); setOpen(true) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          top: '24px',
          left: 0,
          width: '340px',
          height: '52px',
          zIndex: 200,
          cursor: 'pointer',
          background: hovered ? `${T.PRIMARY}0a` : 'transparent',
          borderRadius: '0 8px 8px 0',
          transition: 'background 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '12px',
        }}
        title="Navigate to any slide"
      >
        <motion.span
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          style={{
            fontFamily: T.FONT_BODY,
            fontSize: '0.6rem',
            color: `${T.PRIMARY}88`,
            letterSpacing: '0.08em',
            userSelect: 'none',
          }}
        >
          NAV
        </motion.span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#111',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '1.5rem',
                width: 'min(520px, 88vw)',
                maxHeight: '74vh',
                overflowY: 'auto',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{
                fontFamily: T.FONT_HEADING,
                fontWeight: 700,
                fontSize: '0.7rem',
                color: '#444',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                Navigate to Slide
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {slides.map((slide, i) => (
                  <SlideItem
                    key={slide.id}
                    slide={slide}
                    index={i}
                    isCurrent={i === current}
                    onClick={() => { goTo(i); setOpen(false) }}
                  />
                ))}
              </div>

              <div style={{
                marginTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '0.75rem',
                fontFamily: T.FONT_BODY,
                fontSize: '0.68rem',
                color: '#333',
                textAlign: 'center',
                letterSpacing: '0.06em',
              }}>
                ESC to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SlideItem({ slide, index, isCurrent, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.5rem 0.7rem',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        background: isCurrent
          ? `${T.PRIMARY}1a`
          : hovered
            ? 'rgba(255,255,255,0.04)'
            : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      <span style={{
        fontFamily: T.FONT_HEADING,
        fontSize: '0.62rem',
        color: isCurrent ? `${T.PRIMARY}99` : '#3a3a3a',
        minWidth: '22px',
        userSelect: 'none',
      }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span style={{
        fontFamily: T.FONT_BODY,
        fontSize: '0.88rem',
        color: isCurrent ? T.PRIMARY : '#888',
        fontWeight: isCurrent ? 600 : 400,
        flex: 1,
      }}>
        {slide.title}
      </span>
      {isCurrent && (
        <span style={{
          fontFamily: T.FONT_BODY,
          fontSize: '0.6rem',
          color: `${T.PRIMARY}80`,
          letterSpacing: '0.06em',
          userSelect: 'none',
        }}>
          current
        </span>
      )}
    </button>
  )
}
