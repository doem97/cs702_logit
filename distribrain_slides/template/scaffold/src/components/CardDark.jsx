import { motion } from 'framer-motion'
import * as T from '../tokens'

export default function CardDark({ children, style = {}, hover = true, glow = false }) {
  const baseStyle = {
    background: T.BG_CARD,
    border: `1px solid ${T.BORDER_SUBTLE}`,
    borderRadius: '12px',
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
    ...(glow ? { boxShadow: T.PRIMARY_GLOW } : {}),
    ...style,
  }

  return (
    <motion.div
      style={baseStyle}
      whileHover={hover ? { scale: 1.02, borderColor: T.PRIMARY_BORDER } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
