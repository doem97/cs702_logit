/*
 * Slide registry — AI: add entries here as slides are created.
 *
 * Each slide is a lazy-loaded React component.
 * Pattern:
 *   const S00 = lazy(() => import('./S00'))
 *   ...
 *   export const slides = [
 *     { component: S00, id: 'S00', title: 'Title Slide' },
 *     ...
 *   ]
 */

import { lazy } from 'react'

const S00 = lazy(() => import('./S00'))

export const slides = [
  { component: S00, id: 'S00', title: 'Title' },
]

export default slides
