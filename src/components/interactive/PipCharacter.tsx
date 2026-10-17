import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import pipPortrait from '../../assets/pip-portrait.png'
import './PipCharacter.css'

export interface PipCharacterProps {
  mood: 'day' | 'night'
  interactive?: boolean
}

export function PipCharacter({ mood, interactive = true }: PipCharacterProps) {
  const figure = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [reacting, setReacting] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>('/assets/character/pip-hero.webp')

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
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1))
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
    figure.current.style.setProperty('--pip-tilt-x', `${-y * 5}deg`)
    figure.current.style.setProperty('--pip-tilt-y', `${x * 5}deg`)
    figure.current.style.setProperty('--pip-offset-x', `${x * 7}px`)
    figure.current.style.setProperty('--pip-offset-y', `${y * 7}px`)
  }

  function resetTilt() {
    figure.current?.style.setProperty('--pip-tilt-x', '0deg')
    figure.current?.style.setProperty('--pip-tilt-y', '0deg')
    figure.current?.style.setProperty('--pip-offset-x', '0px')
    figure.current?.style.setProperty('--pip-offset-y', '0px')
  }

  const Element = interactive ? 'button' : 'div'
  return (
    <Element
      className={`pip-character pip-character--${mood}${reacting ? ' pip-character--reacting' : ''}`}
      {...(interactive ? { type: 'button' as const, 'aria-label': 'Say hello to Pip', onClick: react } : {})}
      onPointerMove={tilt}
      onPointerLeave={resetTilt}
      onPointerUp={resetTilt}
      onPointerCancel={resetTilt}
    >
      <span ref={figure} className="pip-character__figure" style={{ '--pip-tilt-x': '0deg', '--pip-tilt-y': '0deg', '--pip-offset-x': '0px', '--pip-offset-y': '0px' } as CSSProperties}>
        <span className="pip-character__art">
          {!imageSrc && <span className="pip-character__placeholder" aria-hidden="true"><span className="pip-character__eyes" /></span>}
          {imageSrc && <img src={imageSrc} className={imageSrc === pipPortrait ? 'pip-character__portrait' : undefined} alt="" draggable={false} onError={() => setImageSrc(imageSrc === '/assets/character/pip-hero.webp' ? pipPortrait : null)} />}
        </span>
        <span className="pip-character__spark pip-character__spark--one" aria-hidden="true">✦</span>
        <span className="pip-character__spark pip-character__spark--two" aria-hidden="true">✧</span>
      </span>
      {interactive && <span className="pip-character__hint" aria-hidden="true">Tap to say hi ✦</span>}
    </Element>
  )
}
