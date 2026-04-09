import { useState, useEffect, useCallback, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { slides } from './slides/index.js'
import { SLIDE_TRANSITION } from './motionPresets'
import ProgressBar from './components/ProgressBar'
import SlideCounter from './components/SlideCounter'
import SlideNav from './components/SlideNav'
import * as T from './tokens'

const TOTAL = slides.length

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
}

/*
 * AI: Update BRAND_TITLE and BRAND_SUBTITLE below to match the talk.
 * These appear as a small fixed badge in the top-right corner.
 */
const BRAND_TITLE = 'Presentation'
const BRAND_SUBTITLE = 'Slides'

export default function App() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= TOTAL) return
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }, [current])

  const next = useCallback(() => goTo(current + 1), [goTo, current])
  const prev = useCallback(() => goTo(current - 1), [goTo, current])

  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prev()
          break
        case 'ArrowDown':
          e.preventDefault()
          next()
          break
        case 'ArrowUp':
          e.preventDefault()
          prev()
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev])

  const CurrentSlide = slides[current].component

  return (
    <div
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: T.BG }}
      onClick={next}
    >
      <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: T.BG }} />}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SLIDE_TRANSITION}
            style={{ position: 'absolute', inset: 0 }}
          >
            <CurrentSlide />
          </motion.div>
        </AnimatePresence>
      </Suspense>

      {/* Top-right brand mark — AI: customize BRAND_TITLE / BRAND_SUBTITLE above */}
      <motion.div
        initial={{ opacity: 0, y: -18, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        style={{
          position: 'fixed',
          top: '32px',
          right: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 100,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <span style={{
          fontFamily: T.FONT_HEADING,
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
        }}>
          <span style={{
            background: `linear-gradient(90deg, ${T.TERTIARY}, ${T.PRIMARY})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>{BRAND_TITLE}</span>
          {' '}
          <span style={{ color: T.TEXT_DIM }}>{BRAND_SUBTITLE}</span>
        </span>
      </motion.div>

      <SlideNav slides={slides} current={current} goTo={goTo} />
      <ProgressBar current={current} total={TOTAL} />
      <SlideCounter current={current} total={TOTAL} />
    </div>
  )
}
