import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import styles from './NightlightLab.module.css'

export type NightlightLabProps = { muted: boolean; onPlaySound?: () => void }

const roomArt = '/assets/projects/nightlight-room.webp'

type Coordinates = { x: number; y: number }

function NurseryArt({ imageAvailable }: { imageAvailable: boolean }) {
  return (
    <div className={`${styles.artwork} ${imageAvailable ? styles.withImage : ''}`} aria-hidden="true">
      {!imageAvailable && <>
        <span className={styles.wallStars}>✦ &nbsp; · &nbsp; ✧ &nbsp; · &nbsp; ✦</span>
        <span className={styles.window}><span className={styles.moon}>☾</span><span className={styles.windowStars}>✧ · ✦</span></span>
        <span className={styles.shelf}><span>✧</span><span>▤</span><span>★</span></span>
        <span className={styles.bed}><span className={styles.pillow} /><span className={styles.blanket} /></span>
        <span className={styles.lamp}><span className={styles.shade} /><span className={styles.stem} /><span className={styles.base} /></span>
        <span className={styles.floor} />
      </>}
    </div>
  )
}

export function NightlightLab({ muted, onPlaySound }: NightlightLabProps) {
  const reducedMotion = useReducedMotion()
  const scene = useRef<HTMLDivElement>(null)
  const horizontal = useRef<HTMLInputElement>(null)
  const vertical = useRef<HTMLInputElement>(null)
  const frame = useRef<number | null>(null)
  const position = useRef<Coordinates>({ x: .5, y: .5 })
  const target = useRef<Coordinates>({ x: .5, y: .5 })
  const [imageAvailable, setImageAvailable] = useState(false)
  const [fullyLit, setFullyLit] = useState(false)

  useEffect(() => {
    const image = new Image()
    image.onload = () => setImageAvailable(true)
    image.src = roomArt
    return () => { image.onload = null }
  }, [])
  useEffect(() => () => { if (frame.current !== null) cancelAnimationFrame(frame.current) }, [])

  function paint() {
    const element = scene.current
    if (!element) return
    element.style.setProperty('--light-x', `${position.current.x * 100}%`)
    element.style.setProperty('--light-y', `${position.current.y * 100}%`)
  }

  function animate() {
    const dx = target.current.x - position.current.x
    const dy = target.current.y - position.current.y
    if (Math.abs(dx) + Math.abs(dy) < .002) {
      position.current = { ...target.current }
      paint()
      frame.current = null
      return
    }
    position.current = { x: position.current.x + dx * .22, y: position.current.y + dy * .22 }
    paint()
    frame.current = requestAnimationFrame(animate)
  }

  function aim(x: number, y: number) {
    target.current = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }
    if (horizontal.current) horizontal.current.value = String(Math.round(target.current.x * 100))
    if (vertical.current) vertical.current.value = String(Math.round((1 - target.current.y) * 100))
    if (reducedMotion) {
      position.current = { ...target.current }
      paint()
    } else if (frame.current === null) frame.current = requestAnimationFrame(animate)
  }

  function aimPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    aim((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height)
  }

  function startPointer(event: PointerEvent<HTMLDivElement>) {
    aimPointer(event)
    if (event.pointerType !== 'mouse') event.currentTarget.setPointerCapture(event.pointerId)
  }

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'touch' || event.buttons) aimPointer(event)
  }

  function toggleLight() {
    setFullyLit(value => !value)
    if (!muted) onPlaySound?.()
  }

  return (
    <section className={styles.lab} aria-label="Nightlight Collection">
      <p className={styles.hint}>Move the lantern around Pip’s nursery. What do you see in the dark?</p>
      <div
        ref={scene}
        className={`${styles.scene} ${fullyLit ? styles.fullyLit : ''}`}
        onPointerDown={startPointer}
        onPointerMove={movePointer}
        aria-label="Dark nursery. Move a pointer or drag a finger to reveal it. Use the controls below for keyboard access."
        role="img"
        style={{ '--light-x': '50%', '--light-y': '50%' } as CSSProperties}
      >
        <div className={`${styles.layer} ${styles.dark}`}><NurseryArt imageAvailable={imageAvailable} /></div>
        <div className={`${styles.layer} ${styles.lit}`}><NurseryArt imageAvailable={imageAvailable} /></div>
        <span className={styles.lightGlow} aria-hidden="true" />
      </div>
      <div className={styles.controls}>
        <button type="button" className={styles.reveal} onClick={toggleLight} aria-pressed={fullyLit}>
          {fullyLit ? 'Return to lantern' : 'Light up the whole room'} <span aria-hidden="true">✦</span>
        </button>
        <div className={styles.sliders}>
          <label>Lantern left / right<input ref={horizontal} type="range" min="0" max="100" defaultValue="50" onChange={event => aim(Number(event.currentTarget.value) / 100, target.current.y)} /></label>
          <label>Lantern up / down<input ref={vertical} type="range" min="0" max="100" defaultValue="50" onChange={event => aim(target.current.x, 1 - Number(event.currentTarget.value) / 100)} /></label>
        </div>
      </div>
    </section>
  )
}
