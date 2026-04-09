import { motion } from 'framer-motion'
import * as T from '../tokens'

export default function ProgressBar({ current, total }) {
  const progress = total > 1 ? (current / (total - 1)) * 100 : 100

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'rgba(255,255,255,0.08)',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${T.TERTIARY}, ${T.PRIMARY})`,
          boxShadow: `0 0 8px ${T.PRIMARY}cc`,
          transformOrigin: 'left',
        }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
