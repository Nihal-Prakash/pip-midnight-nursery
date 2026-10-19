import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { art, icons } from '../../assets/dream'
import { destinations, melodies } from '../../apps/content'
import type { DeliveryId, MelodyId } from '../../state/windows'
import './DreamGames.css'

const routes: Record<DeliveryId, { x: number; y: number; path: string; parcel: string; hint: string }> = {
  cloud: { x: 135, y: 145, path: 'M360 330 C300 300 95 300 135 145', parcel: 'Cloud-sheep dream', hint: 'A soft flock to bring the shepherd’s sheep home.' },
  moon: { x: 360, y: 90, path: 'M360 330 C455 240 265 200 360 90', parcel: 'Pocket-lantern dream', hint: 'A little light for the keeper who lights everyone else’s way.' },
  starry: { x: 585, y: 145, path: 'M360 330 C410 285 630 285 585 145', parcel: 'Friendly-letter dream', hint: 'A warm reply for the astronomer waiting by the window.' },
}

export type CourierGameProps = { initialDestination: DeliveryId; reduced: boolean; onComplete: () => void }

export function CourierGame({ initialDestination, reduced, onComplete }: CourierGameProps) {
  const [selected, setSelected] = useState(initialDestination)
  const [parcel, setParcel] = useState<DeliveryId | null>(null)
  const [delivered, setDelivered] = useState<DeliveryId[]>([])
  const [flying, setFlying] = useState(false)
  const [message, setMessage] = useState('Read the address, choose a dream, then send it along the starlight path.')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const receipt = useRef(new Set<DeliveryId>())
  const complete = useRef(onComplete)
  useEffect(() => { complete.current = onComplete }, [onComplete])
  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = undefined
    setFlying(false)
    setSelected(initialDestination)
    setParcel(null)
  }, [initialDestination])
  useEffect(() => () => clearTimeout(timer.current), [])
  function cancel() { clearTimeout(timer.current); timer.current = undefined; setFlying(false) }
  function select(id: DeliveryId) {
    cancel()
    setSelected(id)
    setParcel(null)
    setMessage(receipt.current.has(id) ? 'This doorstep is already glowing. Try another address, or replay the round.' : 'Read the recipient’s clue and pack the dream they need.')
  }
  function send() {
    cancel()
    if (!parcel || receipt.current.has(selected)) return
    if (parcel !== selected) {
      setMessage('Not quite the dream they need. Nothing sent — read the clue and try another parcel.')
      return
    }
    setFlying(true)
    setMessage('One carefully wrapped dream is on its way…')
    timer.current = setTimeout(() => {
      timer.current = undefined
      setFlying(false)
      receipt.current.add(selected)
      setDelivered([...receipt.current])
      if (receipt.current.size === destinations.length) {
        setMessage('✦ Every doorstep is glowing. Three dreams delivered; one lost dream repaired.')
        complete.current()
      } else setMessage(`Delivered to ${destinations.find(item => item.id === selected)?.name}. Choose the next sleepy doorstep.`)
    }, reduced ? 250 : 1800)
  }
  const destination = destinations.find(item => item.id === selected) ?? destinations[0]
  return <section className="dx-game dx-game-courier" data-reduced={reduced} aria-label="Dream parcel delivery">
    <div className="dx-game-map">
      <svg viewBox="0 0 720 400" aria-hidden="true">
        <path className="dx-game-cloud-bank" d="M0 345 Q40 310 88 335 Q130 285 190 325 Q240 285 290 330 Q350 295 410 330 Q480 295 540 330 Q600 290 650 325 Q690 310 720 335 V400 H0Z" />
        <g className="dx-game-map-stars"><path d="M60 60v12m-6-6h12M255 155v10m-5-5h10M480 55v14m-7-7h14M665 230v10m-5-5h10M70 250v8m-4-4h8" /><circle cx="205" cy="65" r="2" /><circle cx="470" cy="190" r="2" /><circle cx="645" cy="78" r="2" /></g>
        {destinations.map(item => <path key={item.id} className="dx-game-route" data-delivered={delivered.includes(item.id)} data-selected={selected === item.id} d={routes[item.id].path} />)}
        <circle className="dx-game-post-office" cx="360" cy="330" r="20" /><text x="360" y="336" textAnchor="middle" className="dx-game-map-symbol">✉</text>
        {flying && (reduced ? <circle cx={routes[selected].x} cy={routes[selected].y} r="9" className="dx-game-postbird" /> : <g key={selected} className="dx-game-postbird"><circle r="8" /><path d="M-13 0 0-7 13 0 0 7Z" /><animateMotion dur="1.8s" path={routes[selected].path} fill="freeze" /></g>)}
      </svg>
      {destinations.map(item => <button type="button" key={item.id} className="dx-game-house" aria-pressed={selected === item.id} aria-label={`Visit ${item.name}`} style={{ left: `${routes[item.id].x / 720 * 100}%`, top: `${routes[item.id].y / 400 * 100}%` }} onClick={() => select(item.id)} data-delivered={delivered.includes(item.id)}>
        <svg viewBox="0 0 90 90" aria-hidden="true"><path className="dx-game-roof" d="M6 38 45 7 84 38Z" /><path className="dx-game-house-wall" d="M15 38h60v44H15Z" /><rect x="34" y="52" width="22" height="30" rx="11" /><path d="M22 43h9v12h-9zm37 0h9v12h-9z" /><text x="45" y="33" textAnchor="middle">{item.symbol}</text></svg>
        <span>{item.name}</span><small>{delivered.includes(item.id) ? '✓ Delivered' : selected === item.id ? 'Selected address' : 'Choose address'}</small>
      </button>)}
      <span className="dx-game-map-origin">MIDNIGHT POST</span>
    </div>
    <div className="dx-game-address"><span className="dx-game-postmark" aria-hidden="true">☾<small>NIGHT MAIL</small></span><div><strong>To: {destination.name}</strong><p>{destination.description}</p></div></div>
    <fieldset className="dx-game-parcels"><legend>Which dream belongs at this doorstep?</legend>{destinations.map(item => <button type="button" className="dx-secondary" key={item.id} aria-pressed={parcel === item.id} onClick={() => { cancel(); setParcel(item.id); setMessage(routes[item.id].hint) }}><span aria-hidden="true">✉</span>{routes[item.id].parcel}</button>)}</fieldset>
    <div className="dx-game-controls"><button type="button" className="dx-primary" disabled={!parcel || flying || delivered.includes(selected)} onClick={send}>Send dream</button><button type="button" className="dx-secondary" disabled={!flying} onClick={() => { cancel(); setMessage('Parcel recalled. Choose an address and try again.') }}>Recall parcel</button><button type="button" className="dx-secondary" onClick={() => { cancel(); receipt.current.clear(); setDelivered([]); setParcel(null); setMessage('The postbag is full again. Deliver the right dream to all three homes.') }}>Replay deliveries</button></div>
    <progress aria-label="Dreams delivered" max={3} value={delivered.length} />
    <p className="dx-game-status" role="status">{delivered.length}/3 delivered. {message}</p>
  </section>
}

const hiddenStars = [
  { x: 20, y: 34, name: 'Shelf star', clue: 'A little courage, tucked beside the shelf.' },
  { x: 50, y: 21, name: 'Moon star', clue: 'A little company, beside the sleeping moon.' },
  { x: 78, y: 70, name: 'Bedside star', clue: 'A little warmth, waiting by the bed.' },
]
const nearStar = (spot: { x: number; y: number }, star: { x: number; y: number }) => Math.hypot(spot.x - star.x, (spot.y - star.y) * .75) <= 12

export type NightlightGameProps = { reduced: boolean; onComplete: () => void }

export function NightlightGame({ reduced, onComplete }: NightlightGameProps) {
  const [spot, setSpot] = useState({ x: 50, y: 50 })
  const [found, setFound] = useState<number[]>([])
  const [message, setMessage] = useState('Three shy stars are hiding. Try the shelf, the moon, and the bedside.')
  const collected = useRef(new Set<number>())
  const room = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const pendingSpot = useRef(spot)
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  function move(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    pendingSpot.current = { x: Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)), y: Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100)) }
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => setSpot(pendingSpot.current))
  }
  function collect(index: number) {
    if (!nearStar(spot, hiddenStars[index]) || collected.current.has(index)) return
    collected.current.add(index)
    setFound([...collected.current])
    if (collected.current.size === hiddenStars.length) {
      setMessage('✦ All three stars are home. The dark feels friendly again. One dream repaired.')
      onComplete()
    } else setMessage(hiddenStars[index].clue)
    room.current?.focus({ preventScroll: true })
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return
    const directions: Record<string, [number, number]> = { ArrowLeft: [-5, 0], ArrowRight: [5, 0], ArrowUp: [0, -5], ArrowDown: [0, 5] }
    const direction = directions[event.key]
    if (direction) {
      event.preventDefault()
      cancelAnimationFrame(frame.current)
      setSpot(current => ({ x: Math.max(0, Math.min(100, current.x + direction[0])), y: Math.max(0, Math.min(100, current.y + direction[1])) }))
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const index = hiddenStars.findIndex((star, i) => nearStar(spot, star) && !collected.current.has(i))
      if (index !== -1) collect(index)
    }
  }
  const done = found.length === hiddenStars.length
  return <section className="dx-game dx-game-nightlight" data-reduced={reduced} aria-label="Hidden-star search">
    <p>Move your lantern with a finger or pointer. Keyboard: focus the room, use arrow keys, then Enter to gather a nearby star.</p>
    <div ref={room} className="dx-game-room" data-complete={done} tabIndex={0} role="group" aria-label="Lantern search room" onKeyDown={keyboard} onPointerMove={move} onPointerDown={event => {
      if ((event.target as HTMLElement).closest('button')) return
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.focus({ preventScroll: true })
      move(event)
    }} onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }} onPointerCancel={() => cancelAnimationFrame(frame.current)} style={{ '--dx-game-x': `${spot.x}%`, '--dx-game-y': `${spot.y}%` } as CSSProperties}>
      <img className="dx-game-room-base" src={art.lost} alt="A cozy nursery with a shelf, a moonlit window and a bedside toy" draggable={false} />
      <img className="dx-game-room-light" src={art.lost} alt="" aria-hidden="true" draggable={false} />
      <span className="dx-game-lantern" aria-hidden="true">✧</span>
      {hiddenStars.map((star, index) => <button type="button" key={star.name} className="dx-game-hidden-star" style={{ left: `${star.x}%`, top: `${star.y}%` }} data-visible={nearStar(spot, star) || found.includes(index)} data-found={found.includes(index)} disabled={!nearStar(spot, star) || found.includes(index)} aria-label={`Gather ${star.name}`} onClick={() => collect(index)}>✦</button>)}
    </div>
    <div className="dx-game-search-readout"><strong>{found.length} / 3 stars gathered</strong><span role="status">{done ? 'The nursery is glowing.' : hiddenStars.filter((star, index) => nearStar(spot, star) && !found.includes(index)).map(star => `${star.name} in reach — Enter or tap to gather.`).join(' ') || `Lantern: ${Math.round(spot.x)}% across, ${Math.round(spot.y)}% down.`}</span></div>
    <progress aria-label="Stars gathered" max={3} value={found.length} />
    <p className="dx-game-status" role="status">{message}</p>
    <button type="button" className="dx-secondary dx-game-replay" onClick={() => { cancelAnimationFrame(frame.current); collected.current.clear(); setFound([]); setSpot({ x: 50, y: 50 }); setMessage('Three shy stars are hiding again. Try the shelf, the moon, and the bedside.'); room.current?.focus({ preventScroll: true }) }}>Hide the stars & replay</button>
  </section>
}

export type LullabyGameProps = {
  initialMelody: MelodyId
  muted: boolean
  reduced: boolean
  playMelody: (notes: number[]) => void
  stopSounds: () => void
  onComplete: () => void
}

export function LullabyGame({ initialMelody, muted, reduced, playMelody, stopSounds, onComplete }: LullabyGameProps) {
  const [selected, setSelected] = useState(initialMelody)
  const [turns, setTurns] = useState(0)
  const [beat, setBeat] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const callbacks = useRef({ stopSounds, onComplete })
  useEffect(() => { callbacks.current = { stopSounds, onComplete } }, [stopSounds, onComplete])
  const melody = melodies.find(item => item.id === selected) ?? melodies[0]
  // Four phrases; the shared audio coordinator schedules one note every 240ms.
  const score = Array.from({ length: 4 }, () => melody.notes).flat()
  function cancel() {
    clearInterval(timer.current)
    timer.current = undefined
    callbacks.current.stopSounds()
    setPlaying(false)
    setBeat(0)
  }
  function reset(id = selected) {
    cancel()
    setSelected(id)
    setTurns(0)
    setDone(false)
  }
  useEffect(() => {
    clearInterval(timer.current)
    timer.current = undefined
    callbacks.current.stopSounds()
    setSelected(initialMelody)
    setTurns(0)
    setBeat(0)
    setPlaying(false)
    setDone(false)
  }, [initialMelody])
  useEffect(() => () => { clearInterval(timer.current); callbacks.current.stopSounds() }, [])
  function play() {
    if (turns < 3 || done || timer.current !== undefined) return
    cancel()
    setPlaying(true)
    playMelody(score)
    let elapsed = 0
    timer.current = setInterval(() => {
      elapsed++
      setBeat(elapsed)
      if (elapsed === score.length) {
        clearInterval(timer.current)
        timer.current = undefined
        setPlaying(false)
        setDone(true)
        callbacks.current.stopSounds()
        callbacks.current.onComplete()
      }
    }, 240)
  }
  return <section className="dx-game dx-game-lullaby" data-reduced={reduced} aria-label="Music-box workshop">
    <div className="dx-game-choices" aria-label="Choose a melody">{melodies.map(item => <button type="button" className="dx-secondary" key={item.id} aria-pressed={selected === item.id} onClick={() => reset(item.id)}>{item.name}</button>)}</div>
    <div className="dx-game-music-scene" data-playing={playing}>
      <img className="dx-game-workbench" src={art.cabinet} alt="Pip’s warm, lantern-lit workbench" />
      <div className="dx-game-musicbox">
        <span className="dx-game-music-spark" aria-hidden="true">♫</span>
        <img src={icons.lullaby} alt="A little clockwork music box" />
        <button type="button" className="dx-secondary dx-game-winder" disabled={playing || done || turns === 3} onClick={() => setTurns(value => Math.min(3, value + 1))}>
          <span aria-hidden="true" style={{ transform: `rotate(${turns * 120}deg)` }}>⚿</span> Wind the key <small>{turns}/3</small>
        </button>
      </div>
      <div className="dx-game-score" aria-hidden="true">{score.map((note, index) => <i key={index} data-played={index < beat} data-current={playing && index === beat} style={{ height: `${18 + (note - 260) / 9}px` }} />)}</div>
    </div>
    <div className="dx-game-caption"><strong>{melody.name}</strong><p>{melody.description} Wind three gentle turns, then let the whole song finish.</p></div>
    <div className="dx-game-controls"><button type="button" className="dx-primary" disabled={turns < 3 || playing || done} onClick={play}>Play score</button><button type="button" className="dx-secondary" disabled={!playing} onClick={cancel}>Stop</button><button type="button" className="dx-secondary" onClick={() => reset()}>Rewind & replay</button></div>
    <progress aria-label="Song progress" max={score.length} value={beat} />
    <p className="dx-game-status" role="status">{done ? '✦ The song is whole again. One dream repaired.' : playing ? `Playing the full score${muted ? ' — silent notes, same magic' : ''}.` : turns < 3 ? `${3 - turns} gentle turns until the music box is ready.` : 'Ready. Play the complete score to mend the song.'}</p>
  </section>
}
