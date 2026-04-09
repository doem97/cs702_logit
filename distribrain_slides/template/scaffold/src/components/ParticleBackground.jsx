import { useEffect, useRef } from 'react'
import * as T from '../tokens'

const DEFAULT_COLORS = {
  primary: T.PRIMARY,
  secondary: T.SECONDARY,
  tertiary: T.TERTIARY,
  white: '#ffffff',
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [255, 255, 255]
}

export default function ParticleBackground({
  count = 140,
  connectionDistance = 130,
  speed = 0.35,
  colors = DEFAULT_COLORS,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const colorKeys = Object.keys(colors)
    const colorMap = {}
    for (const key of colorKeys) {
      colorMap[key] = hexToRgb(colors[key])
    }

    const particles = Array.from({ length: count }, () => {
      const colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)]
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2.0 + 0.4,
        dx: (Math.random() - 0.5) * speed,
        dy: (Math.random() - 0.5) * speed,
        alpha: Math.random() * 0.5 + 0.15,
        color: colorKey,
      }
    })

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const ddx = particles[i].x - particles[j].x
          const ddy = particles[i].y - particles[j].y
          const dist = Math.sqrt(ddx * ddx + ddy * ddy)
          if (dist < connectionDistance) {
            const fade = 1 - dist / connectionDistance
            const ci = colorMap[particles[i].color]
            const cj = colorMap[particles[j].color]
            const mr = Math.round((ci[0] + cj[0]) / 2)
            const mg = Math.round((ci[1] + cj[1]) / 2)
            const mb = Math.round((ci[2] + cj[2]) / 2)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${mr},${mg},${mb},${0.08 * fade})`
            ctx.lineWidth = 0.6
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        const [r, g, b] = colorMap[p.color]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    const handleResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [count, connectionDistance, speed, colors])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
