import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { art, icons } from '../assets/dream'
import type { Navigation } from '../apps/registry'
import type { Destination, ExperienceId } from '../state/windows'
import type { Progress, ProgressAction } from '../state/progress'
import { CourierGame, LullabyGame, NightlightGame } from '../components/interactive/DreamGames'
import './nursery.css'

const DreamAtlas = lazy(() => import('../components/interactive/DreamAtlas').then(m => ({ default: m.DreamAtlas })))
const stations = [
  { id: 'lullaby', title: 'Lullaby Lab', subtitle: 'Give a dream its song', symbol: '♫' },
  { id: 'nightlight', title: 'Nightlight.exe', subtitle: 'Find three little lights', symbol: '✧' },
  { id: 'courier', title: 'Dream Courier', subtitle: 'Carry a dream home', symbol: '✉' },
] as const
const encouragement = {
  lullaby: 'Wind my little invention, then let the whole song find its way home.',
  nightlight: 'The dark is only a room waiting for a friend. Look for three shy stars.',
  courier: 'Every address needs a different kind of dream. Read the little wishes first.',
}
const greetings = ['I am tiny, but together we can do very big dreaming.', 'My lantern runs on kindness. And possibly biscuits.', 'A dream does not need to be perfect. It just needs somewhere soft to land.']

export function Nursery({ destination, navigation, muted, toggleMute, progress, updateProgress, reduced, ambient, playMelody, stopSounds }: {
  destination: Destination; navigation: Navigation; muted: boolean; toggleMute: () => void
  progress: Progress; updateProgress: (action: ProgressAction) => void; reduced: boolean; ambient: boolean
  playMelody: (notes: number[]) => void; stopSounds: () => void
}) {
  const heading = useRef<HTMLHeadingElement>(null)
  const scene = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const previousRepairs = useRef(progress.repaired.length)
  const soundStop = useRef(stopSounds)
  soundStop.current = stopSounds
  const [entering, setEntering] = useState(!reduced)
  const [atlas, setAtlas] = useState(false)
  const [reaction, setReaction] = useState(0)
  const [dialogue, setDialogue] = useState('Welcome inside my computer. This is where the dreams begin. Will you help me mend three?')
  const [finale, setFinale] = useState<'off' | 'joy' | 'sleep'>('off')
  const game = destination.kind === 'game' ? destination.game : null
  const allRepaired = progress.repaired.length === 3
  const title = atlas ? '3D Dream Atlas' : game === 'lullaby' ? 'Lullaby music station' : game === 'nightlight' ? 'Nightlight star room' : game === 'courier' ? 'Dream Courier dispatch' : 'Midnight Nursery'
  useEffect(() => { const timer = setTimeout(() => setEntering(false), reduced ? 0 : 1800); return () => clearTimeout(timer) }, [reduced])
  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
    return () => soundStop.current()
  }, [destination, atlas])
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  useEffect(() => {
    if (progress.repaired.length === 3 && previousRepairs.current < 3) setFinale('joy')
    previousRepairs.current = progress.repaired.length
  }, [progress.repaired.length])
  useEffect(() => {
    if (finale !== 'joy') return
    soundStop.current()
    const timer = setTimeout(() => setFinale('sleep'), reduced ? 0 : 4500)
    return () => clearTimeout(timer)
  }, [finale, reduced])

  function openStation(id: ExperienceId) {
    setAtlas(false)
    setDialogue(encouragement[id])
    navigation.enterNursery(id === 'lullaby' ? { kind: 'game', game: id, melody: 'moon' } : id === 'courier' ? { kind: 'game', game: id, destination: 'cloud' } : { kind: 'game', game: id })
  }
  function complete(id: ExperienceId) {
    updateProgress({ type: 'repair', id })
    setDialogue(id === 'lullaby' ? 'You found its song! Listen… the whole nursery is humming with you.' : id === 'nightlight' ? 'Three brave little lights. Nobody has to be afraid of the dark alone.' : 'Home at last! A very small delivery can make a very big difference.')
    setReaction(v => v + 1)
    if (!progress.repaired.includes(id)) navigation.showNotification(`${stations.find(s => s.id === id)?.title} · Dream repaired. A star is shining again!`)
  }
  function closeActivity() { setAtlas(false); navigation.enterNursery() }

  return <section className="dx-nursery dx-world" aria-label="Nursery experience" data-experience={game ?? 'nursery'} data-entering={entering} data-warmth={progress.repaired.length} data-ambient={ambient}>
    {entering && <button className="dx-secondary dx-portal-skip" onClick={() => setEntering(false)}>Skip animation</button>}
    <div className="dx-world-shell" inert={finale !== 'off'}>
      <header className="dx-world-header"><button className="dx-secondary" onClick={navigation.exitNursery}>← Return to computer</button><span className="dx-world-path">DREAM.EXE / THROUGH THE LOOKING GLASS</span><button className="dx-secondary" aria-pressed={!muted} onClick={toggleMute}>Sound {muted ? 'off' : 'on'}</button></header>
      <div className="dx-world-title"><span className="dx-eyebrow">PIP’S INNER WORLD · JUNIOR DREAM ENGINEER AT WORK</span><h1 ref={heading} tabIndex={-1}>{title}</h1><p>{game ? encouragement[game] : 'A little beyond the screen. A little before sleep.'}</p></div>
      <div className="dx-repair-track" aria-label={`${progress.repaired.length} of 3 dreams repaired`}><span className="dx-eyebrow">DREAM REPAIR</span>{stations.map(s => <span key={s.id} data-repaired={progress.repaired.includes(s.id)} title={`${s.title}: ${progress.repaired.includes(s.id) ? 'repaired' : 'missing'}`} aria-label={`${s.title} ${progress.repaired.includes(s.id) ? 'repaired' : 'missing'}`}>✦</span>)}<strong>{progress.repaired.length} / 3</strong>{allRepaired && <button className="dx-secondary" onClick={() => setFinale('joy')}>Open the final dream ☾</button>}</div>
      <div className="dx-world-stage" ref={scene} onPointerMove={e => {
        if (!ambient || e.pointerType === 'touch') return
        const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5
        cancelAnimationFrame(frame.current)
        frame.current = requestAnimationFrame(() => { scene.current?.style.setProperty('--world-x', `${x * 16}px`); scene.current?.style.setProperty('--world-y', `${y * 12}px`); scene.current?.style.setProperty('--pip-tilt', `${x * 9}deg`) })
      }} onPointerLeave={() => { cancelAnimationFrame(frame.current); scene.current?.style.setProperty('--world-x', '0px'); scene.current?.style.setProperty('--world-y', '0px'); scene.current?.style.setProperty('--pip-tilt', '0deg') }}>
        <div className="dx-room-layer" aria-hidden="true"><img src={art.lost} alt="" /><div className="dx-room-warmth" /></div>
        <div className="dx-sky-layer" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${(i * 37 + 7) % 96}%`, top: `${(i * 17 + 5) % 70}%`, '--delay': `${i % 5 * -.7}s` } as CSSProperties}>✦</i>)}</div>
        <div className="dx-cloud-layer" aria-hidden="true"><i /><i /><i /></div>
        <div className="dx-scene-contents" inert={!!game || atlas || finale !== 'off'}>
          <button className="dx-room-moon" aria-label="Whisper to the moon" onClick={() => allRepaired ? setFinale('joy') : setDialogue('The moon is keeping one last dream safe. Bring all three little stars home to open it.')}>☾</button>
          <nav className="dx-world-stations" aria-label="Nursery stations">{stations.map(s => <button className={`dx-world-station dx-world-station-${s.id}`} key={s.id} onClick={() => openStation(s.id)}><img src={icons[s.id]} alt="" /><span><small>{progress.repaired.includes(s.id) ? '✦ REPAIRED · PLAY AGAIN' : `${s.symbol} DREAM MISSING`}</small><strong>{s.title}</strong><em>{s.subtitle} ↗</em></span></button>)}</nav>
          <div className="dx-nursery-pip"><button className="dx-pip-portrait" aria-label="Say hello to nursery Pip" onClick={() => { setDialogue(greetings[reaction % greetings.length]); setReaction(v => v + 1) }}><img src={art.pip} alt="Pip, your friendly skull-faced baby dream engineer" /><span key={reaction} aria-hidden="true">♡</span></button><span className="dx-pip-tap">Pip is here. Tap to say hello.</span></div>
          <button className="dx-atlas-launch dx-secondary" onClick={() => setAtlas(true)}>✧ Open 3D Dream Atlas</button>
        </div>
        {(game || atlas) && <section className="dx-activity-window" aria-label={title} inert={finale !== 'off'}><div className="dx-activity-bar"><span>✦ {title}</span><button className="dx-secondary" onClick={closeActivity} aria-label="Close current activity">× Close activity</button></div>
          {atlas ? <Suspense fallback={<p className="dx-atlas-loading" role="status">Opening the atlas…</p>}><DreamAtlas reduced={reduced} /></Suspense> : destination.kind === 'game' && (destination.game === 'lullaby' ? <LullabyGame initialMelody={destination.melody} muted={muted} reduced={reduced} playMelody={playMelody} stopSounds={stopSounds} onComplete={() => complete('lullaby')} /> : destination.game === 'nightlight' ? <NightlightGame reduced={reduced} onComplete={() => complete('nightlight')} /> : <CourierGame initialDestination={destination.destination} reduced={reduced} onComplete={() => complete('courier')} />)}
        </section>}
      </div>
      <div className="dx-pip-dialogue" role="status"><img src={art.sticker} alt="" /><p><strong>Pip says</strong>{dialogue}</p></div>
      <nav className="dx-world-navigation" aria-label="Explore the nursery"><button className="dx-secondary" onClick={closeActivity}>Nursery entrance</button>{stations.map(s => <button className="dx-secondary" key={s.id} aria-current={game === s.id ? 'page' : undefined} onClick={() => openStation(s.id)}>{s.symbol} {s.title}</button>)}<button className="dx-secondary" onClick={() => { soundStop.current(); setAtlas(true) }}>3D Atlas</button></nav>
      <p className="dx-world-credit">Artwork supplied by the operator · Pip / haX.baby · Interface: React, Motion & CSS · Atlas: Three.js · Melodies: Web Audio synthesis</p>
    </div>
    {finale !== 'off' && <section className="dx-finale" role="dialog" aria-modal="true" aria-label="The final dream" data-phase={finale} onKeyDown={e => {
      if (e.key !== 'Tab') return
      const buttons = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('button')]
      const first = buttons[0], last = buttons.at(-1)
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
    }}>
      <div className="dx-finale-stars" aria-hidden="true">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ left: `${i * 37 % 100}%`, top: `${i * 23 % 100}%`, '--delay': `${i % 7 * .12}s` } as CSSProperties}>✦</i>)}</div>
      <div className="dx-finale-card"><span className="dx-eyebrow">SWEETDREAMS.EXE · THREE LITTLE MIRACLES</span><img className="dx-finale-pip" src={art.pip} alt={finale === 'joy' ? 'Pip is overjoyed that the dreams are home' : 'Pip settles down for a well-earned rest'} /><h2>{finale === 'joy' ? 'You brought them all home.' : 'One last dream. Just for you.'}</h2><p>{finale === 'joy' ? 'A song. A little courage. A way home. Look at all the light we made together!' : 'May you always find a song in the quiet, a friend in the dark, and a soft place to land. Goodnight, dream engineer. — Pip ♡'}</p><div>{finale === 'joy' && <button autoFocus className="dx-secondary" onClick={() => setFinale('sleep')}>Skip to goodnight</button>}<button autoFocus={finale === 'sleep'} className="dx-primary" onClick={() => { setFinale('off'); closeActivity(); requestAnimationFrame(() => heading.current?.focus()) }}>Continue exploring</button><button className="dx-secondary" onClick={() => setFinale('joy')}>Replay ending</button></div><small>Your three repaired dreams are saved. The secret in sweetdreams.exe is now yours.</small></div>
    </section>}
  </section>
}
