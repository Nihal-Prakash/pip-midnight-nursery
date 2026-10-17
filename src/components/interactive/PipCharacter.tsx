import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import styles from './PipCharacter.module.css'

export type PipCharacterProps = { mood: 'day' | 'night'; interactive?: boolean }

const art = '/assets/character/pip-hero.webp'

export function PipCharacter({ mood, interactive = true }: PipCharacterProps) {
  const reducedMotion = useReducedMotion()
  const figure = useRef<HTMLSpanElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const greetingFrame = useRef<number | null>(null)
  const [hasArt, setHasArt] = useState(false)
  const [waving, setWaving] = useState(false)

  useEffect(() => {
    const image = new Image()
    image.onload = () => setHasArt(true)
    image.src = art
    return () => { image.onload = null }
  }, [])
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
    if (greetingFrame.current !== null) cancelAnimationFrame(greetingFrame.current)
  }, [])

  function follow(event: PointerEvent<HTMLButtonElement>) {
    if (reducedMotion || !interactive || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1))
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))
    figure.current?.style.setProperty('--pip-tilt', `${x * 3}deg`)
    figure.current?.style.setProperty('--pip-rise', `${y * 4}px`)
    button.current?.style.setProperty('--pip-star-x', `${x * 10}px`)
  }

  function reset() {
    figure.current?.style.removeProperty('--pip-tilt')
    figure.current?.style.removeProperty('--pip-rise')
    button.current?.style.removeProperty('--pip-star-x')
  }

  function greet() {
    if (reducedMotion) return
    setWaving(false)
    if (greetingFrame.current !== null) cancelAnimationFrame(greetingFrame.current)
    greetingFrame.current = requestAnimationFrame(() => {
      setWaving(true)
      greetingFrame.current = null
    })
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setWaving(false), 680)
  }

  return (
    <button
      ref={button}
      type="button"
      className={`${styles.character} ${mood === 'night' ? styles.night : ''} ${waving ? styles.waving : ''}`}
      aria-label="Say hello to Pip"
      onPointerMove={follow}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onClick={greet}
      disabled={!interactive}
    >
      <span ref={figure} className={styles.figure} style={{ '--pip-tilt': '0deg' } as CSSProperties}>
        {hasArt ? <img className={styles.portrait} src={art} alt="" draggable={false} /> : (
          <svg className={styles.portrait} viewBox="0 0 340 410" fill="none" aria-hidden="true">
            <ellipse cx="170" cy="365" rx="112" ry="28" fill="#81638E" opacity=".16" />
            <path d="M104 331c2-55 32-84 66-84s65 29 67 84l-30 31H130z" fill="#C9B6E7" stroke="#81638E" strokeWidth="5" />
            <path d="M118 312c33 16 71 16 104 0" stroke="#FFF4E7" strokeWidth="7" strokeLinecap="round" />
            <path d="M91 171c0-54 36-91 79-91s79 37 79 91v41c0 24-12 43-32 49l-8 21h-78l-8-21c-20-6-32-25-32-49z" fill="#FFF4E7" stroke="#81638E" strokeWidth="5" />
            <path d="M92 158c-4-65 36-120 85-120 25 0 43 12 57 36-35-8-58 19-76 48-22 35-42 38-66 36z" fill="#81638E" stroke="#81638E" strokeWidth="5" />
            <path d="M94 150c30-2 48-27 67-56 18-27 38-35 64-30" stroke="#F5C9DC" strokeWidth="9" strokeLinecap="round" />
            <circle cx="231" cy="67" r="16" fill="#FFE5A0" />
            <path d="M125 184c0-9 6-15 13-15s13 6 13 15m39 0c0-9 6-15 13-15s13 6 13 15" stroke="#25233F" strokeWidth="5" strokeLinecap="round" />
            <path d="M165 202l-5 9h10zm-17 21c12 12 31 13 44 0" fill="#F5C9DC" stroke="#81638E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="113" cy="206" r="9" fill="#F5C9DC" opacity=".8" /><circle cx="227" cy="206" r="9" fill="#F5C9DC" opacity=".8" />
            <path d="M111 286c-29 5-39 24-36 43m154-43c29 5 39 24 36 43" stroke="#FFF4E7" strokeWidth="18" strokeLinecap="round" />
            <path d="M237 321h30l-6 32h-18z" fill="#FFE5A0" stroke="#81638E" strokeWidth="4" />
            <path d="M245 317c0-12 14-12 14 0" stroke="#81638E" strokeWidth="4" />
            <path d="M252 327l3 8-3 5-3-5z" fill="#FFF4E7" />
          </svg>
        )}
      </span>
      <span className={`${styles.star} ${styles.starOne}`} aria-hidden="true">✦</span>
      <span className={`${styles.star} ${styles.starTwo}`} aria-hidden="true">✧</span>
      <span className={`${styles.star} ${styles.starThree}`} aria-hidden="true">·</span>
    </button>
  )
}
