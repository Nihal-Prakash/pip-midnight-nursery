import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import './PipCharacter.css'

export interface PipCharacterProps {
  mood: 'day' | 'night'
  interactive?: boolean
}

export function PipCharacter({ mood, interactive = true }: PipCharacterProps) {
  const figure = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [reacting, setReacting] = useState(false)
  const [imageReady, setImageReady] = useState(true)

  useEffect(() => () => clearTimeout(timer.current), [])

  function react() {
    if (!interactive) return
    setReacting(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setReacting(false), 650)
  }

  function tilt(event: PointerEvent<HTMLElement>) {
    if (!interactive || !figure.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    figure.current.style.setProperty('--pip-tilt-x', `${((event.clientY - bounds.top) / bounds.height - 0.5) * -12}deg`)
    figure.current.style.setProperty('--pip-tilt-y', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}deg`)
  }

  function resetTilt() {
    figure.current?.style.setProperty('--pip-tilt-x', '0deg')
    figure.current?.style.setProperty('--pip-tilt-y', '0deg')
  }

  const Element = interactive ? 'button' : 'div'
  return (
    <Element
      className={`pip-character pip-character--${mood}${reacting ? ' pip-character--reacting' : ''}`}
      {...(interactive ? { type: 'button' as const, 'aria-label': 'Say hello to Pip', onClick: react } : {})}
      onPointerMove={tilt}
      onPointerLeave={resetTilt}
      onPointerUp={resetTilt}
    >
      <span ref={figure} className="pip-character__figure" style={{ '--pip-tilt-x': '0deg', '--pip-tilt-y': '0deg' } as CSSProperties}>
        <span className="pip-character__placeholder" aria-hidden="true"><span className="pip-character__eyes" /></span>
        {imageReady && <img src="/assets/character/pip-hero.webp" alt="" draggable={false} onError={() => setImageReady(false)} />}
      </span>
      {interactive && <span className="pip-character__hint" aria-hidden="true">Tap to say hi ✦</span>}
    </Element>
  )
}
