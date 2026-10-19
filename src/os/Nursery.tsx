import { useEffect, useRef } from 'react'
import { art, icons } from '../assets/dream'
import type { AppProps } from '../apps/registry'
import type { Destination } from '../state/windows'
import { CourierGame, LullabyGame, NightlightGame } from './NurseryGames'
import './nursery.css'

type NurseryProps = Pick<AppProps, 'navigation' | 'muted' | 'toggleMute' | 'progress' | 'updateProgress' | 'playMelody' | 'reduced'> & { destination: Destination; stopSounds: () => void }
export function Nursery({ destination, navigation, muted, toggleMute, progress, updateProgress, playMelody, stopSounds, reduced }: NurseryProps) {
  const heading = useRef<HTMLHeadingElement>(null)
  const game = destination.kind === 'game' ? destination.game : null
  useEffect(() => { heading.current?.focus() }, [destination])
  const complete = progress.repaired.length === 3
  const title = game === 'lullaby' ? 'Lullaby music station' : game === 'nightlight' ? 'Nightlight star room' : game === 'courier' ? 'Dream Courier dispatch' : complete ? 'Goodnight, little dream engineer.' : 'Midnight Nursery'
  function repair() {
    if (!game || progress.repaired.includes(game)) return
    updateProgress({ type: 'repair', id: game })
    navigation.showNotification(progress.repaired.length === 2 ? '3/3 dreams repaired · Goodnight and sweetdreams.exe unlocked! ♡' : 'Dream repaired · One more little light is home. ✦')
  }
  return <section className={`dx-nursery dx-station-${game ?? 'welcome'}`} aria-label="Nursery experience" data-experience={game ?? 'nursery'}>
    <img className="dx-nursery-backdrop" src={game === 'nightlight' ? art.telescope : art.sweet} alt="" />
    <header><button className="dx-secondary" onClick={navigation.exitNursery}>← Return to computer</button><button className="dx-secondary" aria-pressed={!muted} onClick={toggleMute}>Sound {muted ? 'off' : 'on'}</button></header>
    <div className="dx-station-card"><span className="dx-eyebrow">MIDNIGHT NURSERY / {game ? 'DREAM REPAIR' : complete ? 'ALL DREAMS HOME' : 'WELCOME HOME'}</span><h1 ref={heading} tabIndex={-1}>{title}</h1><img className="dx-station-icon" src={game ? icons[game] : art.pip} alt={game ? `${title} illustration` : 'Pip welcomes you to the nursery'} />
      {destination.kind === 'game' && destination.game === 'lullaby' && <LullabyGame initial={destination.melody} muted={muted} playMelody={playMelody} stopSounds={stopSounds} onComplete={repair} />}
      {game === 'nightlight' && <NightlightGame onComplete={repair} />}
      {destination.kind === 'game' && destination.game === 'courier' && <CourierGame initial={destination.destination} reduced={reduced} onComplete={repair} />}
      {!game && <>{complete ? <div className="dx-goodnight" data-finale="unlocked"><img src={art.sweet} alt="Pip and dream friends resting together among soft clouds" /><h2>A song. A glow. A way home.</h2><p>All three dreams are tucked in. My lantern is getting sleepy, and so am I. Thank you for staying until the last little light came home. — Pip ♡</p><p>You were the fourth dream. You made this night kinder.</p><button className="dx-primary" onClick={() => { navigation.exitNursery(); navigation.openApp('sweet') }}>Open sweetdreams.exe ✦</button></div> : <p>Welcome to the place where I make the dreams you fall asleep inside. Choose an invention to visit its station.</p>}<nav className="dx-station-links" aria-label="Nursery stations"><button className="dx-secondary" onClick={() => navigation.enterNursery({ kind: 'game', game: 'lullaby', melody: 'moon' })}>Lullaby music station ♪</button><button className="dx-secondary" onClick={() => navigation.enterNursery({ kind: 'game', game: 'nightlight' })}>Nightlight star room ✧</button><button className="dx-secondary" onClick={() => navigation.enterNursery({ kind: 'game', game: 'courier', destination: 'cloud' })}>Courier · Cloud Cottage ✉</button></nav></>}
      <p className="dx-stage-boundary" role="status">{progress.repaired.length}/3 dreams repaired{game && progress.repaired.includes(game) ? ' · This dream is safely home. ✦' : ''}</p>
      {game && complete && <button className="dx-primary" onClick={() => navigation.enterNursery()}>Say goodnight ☾</button>}
      {game && <button className="dx-secondary" onClick={() => navigation.enterNursery()}>← Nursery entrance</button>}
    </div>
  </section>
}
