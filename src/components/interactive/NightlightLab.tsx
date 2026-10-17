import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import './NightlightLab.css'

export interface NightlightLabProps {
  muted: boolean
  onPlaySound?: () => void
}

export function NightlightLab({ muted, onPlaySound }: NightlightLabProps) {
  const scene = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState(false)
  const [point, setPoint] = useState({ x: 50, y: 50 })

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!scene.current) return
    const rect = scene.current.getBoundingClientRect()
    setPoint({
      x: Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)),
      y: Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100)),
    })
    if (event.pointerType !== 'mouse') setLit(true)
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
      setPoint(({ x, y }) => ({ x: Math.max(0, Math.min(100, x + dx)), y: Math.max(0, Math.min(100, y + dy)) }))
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
        aria-label="Explore the nursery with your nightlight. Use arrow keys to move the light, Enter or Space to switch it on or off."
        aria-pressed={lit}
        onPointerMove={move}
        onPointerDown={event => { move(event); if (event.pointerType === 'mouse') setLit(true) }}
        onKeyDown={keyDown}
        style={{ '--light-x': `${point.x}%`, '--light-y': `${point.y}%` } as CSSProperties}
      >
        <div className="nightlight-lab__room" aria-hidden="true" />
        <div className="nightlight-lab__beam" aria-hidden="true" />
        <span className="nightlight-lab__star" aria-hidden="true">✦</span>
      </div>
      <button className="nightlight-lab__switch" type="button" aria-pressed={lit} onClick={toggle}>
        {lit ? 'Turn off nightlight' : 'Turn on nightlight'}
      </button>
      <p className="nightlight-lab__hint">Click or tap in the room, then move to explore. On a keyboard, use the arrow keys.</p>
    </section>
  )
}
