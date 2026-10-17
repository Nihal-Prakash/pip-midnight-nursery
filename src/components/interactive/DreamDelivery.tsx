import { useEffect, useId, useRef, useState } from 'react'
import './DreamDelivery.css'

export interface DreamDeliveryProps {
  muted: boolean
  onPlaySound?: () => void
}

const destinations = [
  { name: 'Cloud Cottage', x: 216, y: 170, path: 'M 448 386 C 344 330 293 248 216 170' },
  { name: 'Moon House', x: 680, y: 145, path: 'M 448 386 C 490 235 582 205 680 145' },
  { name: 'Starry Nook', x: 735, y: 345, path: 'M 448 386 C 540 432 649 392 735 345' },
] as const

export function DreamDelivery({ muted, onPlaySound }: DreamDeliveryProps) {
  const route = useRef<SVGPathElement>(null)
  const star = useRef<SVGGElement>(null)
  const id = useId().replaceAll(':', '')
  const [selected, setSelected] = useState<number | null>(null)
  const [run, setRun] = useState(0)
  const [delivered, setDelivered] = useState(false)
  const [artReady, setArtReady] = useState(true)

  useEffect(() => {
    if (selected === null || !route.current || !star.current) return
    const path = route.current
    const marker = star.current
    const length = path.getTotalLength()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let start: number | undefined
    const travel = (time: number) => {
      start ??= time
      const progress = reduced ? 1 : Math.min(1, (time - start) / 1800)
      const eased = 1 - (1 - progress) ** 3
      const point = path.getPointAtLength(length * eased)
      marker.setAttribute('transform', `translate(${point.x} ${point.y})`)
      if (progress < 1) frame = requestAnimationFrame(travel)
      else setDelivered(true)
    }
    frame = requestAnimationFrame(travel)
    return () => cancelAnimationFrame(frame)
  }, [selected, run])

  function deliver(index: number) {
    setSelected(index)
    setDelivered(false)
    setRun(value => value + 1)
    if (!muted) onPlaySound?.()
  }

  return (
    <section className="dream-delivery" aria-label="Dream Delivery">
      <p className="dream-delivery__intro">Where should Pip send tonight’s dream?</p>
      <div className="dream-delivery__map">
        <svg viewBox="0 0 900 500" role="img" aria-label="Night nursery and three destination houses">
          <defs>
            <radialGradient id={`${id}-sky`}><stop stopColor="#81638E" /><stop offset="1" stopColor="#25233F" /></radialGradient>
            <filter id={`${id}-glow`} x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="7" /></filter>
          </defs>
          <rect width="900" height="500" fill={`url(#${id}-sky)`} />
          <g className="dream-delivery__scenery" aria-hidden="true">
            <path d="M0 405 Q 150 348 280 410 T 560 400 T 900 415 V500 H0Z" fill="#81638E" />
            <path d="M0 460 Q 260 390 450 465 T900 440 V500 H0Z" fill="#25233F" opacity=".55" />
            <circle cx="106" cy="74" r="38" fill="#FFE5A0" />
            <g fill="#FFE5A0"><circle cx="320" cy="84" r="3"/><circle cx="530" cy="58" r="2"/><circle cx="819" cy="80" r="4"/><circle cx="795" cy="236" r="2"/></g>
          </g>
          {artReady && <image href="/assets/projects/dream-map.svg" width="900" height="500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" onError={() => setArtReady(false)} />}
          {destinations.map((house, index) => (
            <g key={house.name} transform={`translate(${house.x} ${house.y})`} className={selected === index ? 'dream-delivery__house--selected' : ''} aria-hidden="true">
              <path d="M-28 0 L0 -28 28 0 V30 H-28Z" fill="#FFF4E7" stroke="#81638E" strokeWidth="4" />
              <path d="M-9 30 V6 H9 V30" fill="#C9B6E7" />
              <circle cx="0" cy="-4" r="5" fill="#FFE5A0" />
            </g>
          ))}
          <g transform="translate(448 386)" aria-hidden="true">
            <path d="M-40 0 L0 -38 40 0 V35 H-40Z" fill="#F5C9DC" stroke="#81638E" strokeWidth="4" />
            <circle cy="-6" r="10" fill="#FFE5A0" />
          </g>
          {selected !== null && <>
            <path ref={route} d={destinations[selected].path} className="dream-delivery__route" fill="none" stroke="#FFE5A0" strokeWidth="3" strokeDasharray="5 9" />
            <g ref={star} transform="translate(448 386)" aria-hidden="true">
              <circle r="15" fill="#FFE5A0" opacity=".8" filter={`url(#${id}-glow)`} />
              <circle r="7" fill="#FFE5A0" />
            </g>
          </>}
        </svg>
      </div>
      <div className="dream-delivery__choices" aria-label="Choose a destination">
        {destinations.map((house, index) => <button key={house.name} type="button" aria-pressed={selected === index} onClick={() => deliver(index)}>{house.name}</button>)}
      </div>
      <p className="dream-delivery__status" role="status">{selected === null ? 'Choose a house to send a dream.' : delivered ? `Dream delivered to ${destinations[selected].name}. Choose again to replay!` : `Dream on its way to ${destinations[selected].name}…`}</p>
    </section>
  )
}
