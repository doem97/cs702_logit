import { useState, useEffect } from 'react'
import * as T from '../tokens'

export default function TypewriterText({
  text,
  speed = 60,
  delay = 0,
  style = {},
  className = '',
  onComplete,
  cursor = true,
  cursorColor = T.PRIMARY,
}) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let timeoutId
    let intervalId

    timeoutId = setTimeout(() => {
      let i = 0
      intervalId = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(intervalId)
          setDone(true)
          onComplete?.()
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [text, speed, delay])

  return (
    <span style={style} className={className}>
      {displayed}
      {cursor && !done && (
        <span
          style={{
            display: 'inline-block',
            width: '0.08em',
            height: '1.1em',
            background: cursorColor,
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
            animation: 'blink 1s step-end infinite',
          }}
        />
      )}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}
