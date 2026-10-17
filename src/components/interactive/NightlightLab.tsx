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
  const [view, setView] = useState<'off' | 'beam' | 'full'>('off')

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
    setView('beam')
  }

  function toggle() {
    setView(value => value === 'off' ? 'beam' : 'off')
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
      setView('beam')
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
        className={`nightlight-lab__scene nightlight-lab__scene--${view}`}
        role="button"
        tabIndex={0}
        aria-label="Explore the nursery with your nightlight"
        aria-describedby={hintId}
        aria-pressed={view !== 'off'}
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
      <div className="nightlight-lab__controls">
        <button className="nightlight-lab__switch" type="button" aria-pressed={view !== 'off'} onClick={toggle}>
          {view === 'off' ? 'Turn on nightlight' : 'Turn off nightlight'}
        </button>
        <button className="nightlight-lab__reveal" type="button" aria-pressed={view === 'full'} onClick={() => setView(value => value === 'full' ? 'beam' : 'full')}>
          {view === 'full' ? 'Return to lantern' : 'Reveal whole room'}
        </button>
      </div>
      <p className="nightlight-lab__hint" id={hintId}>Move or tap to guide the lantern. Use arrow keys to move its light; Enter or Space to switch it on or off.</p>
    </section>
  )
}
