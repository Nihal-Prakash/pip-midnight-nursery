import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import './NightlightLab.css'

export interface NightlightLabProps {
  muted: boolean
  onPlaySound?: () => void
}

export function NightlightLab({ muted, onPlaySound }: NightlightLabProps) {
  const scene = useRef<HTMLDivElement>(null)
  const point = useRef({ x: 50, y: 50 })
  const frame = useRef(0)
  const hintId = useId()
  const [lit, setLit] = useState(false)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  function updateLight(x: number, y: number) {
    point.current = { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      scene.current?.style.setProperty('--light-x', `${point.current.x}%`)
      scene.current?.style.setProperty('--light-y', `${point.current.y}%`)
      frame.current = 0
    })
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!scene.current) return
    const rect = scene.current.getBoundingClientRect()
    updateLight((event.clientX - rect.left) / rect.width * 100, (event.clientY - rect.top) / rect.height * 100)
    setLit(true)
  }

  function toggle() {
    setLit(value => !value)
    if (!muted) onPlaySound?.()
  }

  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 5
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
    }
    if (event.key in delta) {
      event.preventDefault()
      const [dx, dy] = delta[event.key]
      updateLight(point.current.x + dx, point.current.y + dy)
      setLit(true)
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      toggle()
    }
  }

  return (
    <section className="nightlight-lab" aria-label="Nightlight Collection">
      <p className="nightlight-lab__intro">A little light for the things that go bump in the night.</p>
      <div
        ref={scene}
        className={`nightlight-lab__scene${lit ? ' nightlight-lab__scene--lit' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Explore the nursery with your nightlight"
        aria-describedby={hintId}
        aria-pressed={lit}
        onPointerMove={move}
        onPointerDown={event => {
          if (event.pointerType === 'touch') event.currentTarget.setPointerCapture(event.pointerId)
          move(event)
        }}
        onKeyDown={keyDown}
      >
        <div className="nightlight-lab__room" aria-hidden="true" />
        <div className="nightlight-lab__beam" aria-hidden="true" />
        <span className="nightlight-lab__star" aria-hidden="true">✦</span>
      </div>
      <button className="nightlight-lab__switch" type="button" aria-pressed={lit} onClick={toggle}>
        {lit ? 'Turn off nightlight' : 'Turn on nightlight'}
      </button>
      <p className="nightlight-lab__hint" id={hintId}>Move or tap to reveal the nursery. Use arrow keys to move the light; Enter or Space to switch it on or off.</p>
    </section>
  )
}
