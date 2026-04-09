/* Shared Framer Motion animation presets for slides */

const EASE = [0.22, 1, 0.36, 1]

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
})

export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, ease: EASE, delay },
})

export const slideInLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
})

export const slideInRight = (delay = 0) => ({
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
})

export const slideInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
})

export const springPop = (delay = 0, stiffness = 200, damping = 16) => ({
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: 'spring', stiffness, damping, delay },
})

export const scaleX = (delay = 0) => ({
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 0.5, ease: EASE, delay },
})

export const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: EASE, delay },
})

export const SLIDE_TRANSITION = {
  duration: 0.4,
  ease: EASE,
}
