/*
 * S00 — Title Slide (placeholder)
 *
 * AI: Replace this with the actual title slide content.
 * Use ParticleBackground for a cinematic opening.
 * Use TypewriterText for the main title.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import TypewriterText from '../components/TypewriterText'
import ParticleBackground from '../components/ParticleBackground'
import * as T from '../tokens'

export default function S00() {
  const [titleDone, setTitleDone] = useState(false)

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: T.BG,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <ParticleBackground />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'clamp(1rem, 2vw, 1.8rem)',
          padding: '0 2rem',
        }}
      >
        <h1
          style={{
            fontFamily: T.FONT_HEADING,
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          <TypewriterText
            text="Your Presentation Title"
            speed={60}
            delay={300}
            style={{
              background: `linear-gradient(120deg, ${T.TERTIARY} 0%, ${T.PRIMARY} 50%, ${T.SECONDARY} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            onComplete={() => setTitleDone(true)}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={titleDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{
            fontFamily: T.FONT_BODY,
            fontWeight: 300,
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            color: T.TEXT_MUTED,
            letterSpacing: '0.04em',
            margin: 0,
          }}
        >
          Subtitle goes here
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={titleDone ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
          style={{
            width: 'clamp(120px, 15vw, 200px)',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${T.PRIMARY}, transparent)`,
            transformOrigin: 'center',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={titleDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 1.2 }}
          style={{
            fontFamily: T.FONT_HEADING,
            fontWeight: 600,
            fontSize: 'clamp(0.85rem, 1.4vw, 1.15rem)',
            letterSpacing: '0.08em',
            margin: 0,
            color: T.TEXT,
          }}
        >
          Speaker Name &middot; Event &middot; Date
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          bottom: 'clamp(1.5rem, 3vh, 2.5rem)',
          fontFamily: T.FONT_HEADING,
          fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
          color: T.TEXT_DIM,
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 2,
        }}
      >
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4], x: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: T.PRIMARY }}
        >
          &rarr;
        </motion.span>
        <span>to continue</span>
      </motion.div>
    </div>
  )
}
