import { useEffect, useRef } from 'react'
import { art, icons } from '../assets/dream'
import { destinations, melodies } from '../apps/content'
import type { Navigation } from '../apps/registry'
import type { Destination } from '../state/windows'

// Stage 2 owns exact station handoff and return; Stage 3 supplies repair gameplay here.
export function Nursery({ destination, navigation, muted, toggleMute }: { destination: Destination; navigation: Navigation; muted: boolean; toggleMute: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null)
  const game = destination.kind === 'game' ? destination.game : null
  useEffect(() => { heading.current?.focus() }, [destination])
  const title = game === 'lullaby' ? 'Lullaby music station' : game === 'nightlight' ? 'Nightlight star room' : game === 'courier' ? 'Dream Courier dispatch' : 'Midnight Nursery'
  return <section className={`dx-nursery dx-station-${game ?? 'welcome'}`} aria-label="Nursery experience" data-experience={game ?? 'nursery'}>
    <img className="dx-nursery-backdrop" src={game === 'nightlight' ? art.telescope : art.sweet} alt="" />
    <header><button className="dx-secondary" onClick={navigation.exitNursery}>← Return to computer</button><button className="dx-secondary" aria-pressed={!muted} onClick={toggleMute}>Sound {muted ? 'off' : 'on'}</button></header>
    <div className="dx-station-card"><span className="dx-eyebrow">MIDNIGHT NURSERY / {game ? 'INVENTION HANDOFF' : 'WELCOME HOME'}</span><h1 ref={heading} tabIndex={-1}>{title}</h1><img className="dx-station-icon" src={game ? icons[game] : art.pip} alt={game ? `${title} illustration` : 'Pip welcomes you to the nursery'} />
      {destination.kind === 'game' && destination.game === 'lullaby' && <><h2>{melodies.find(m => m.id === destination.melody)?.name}</h2><p>Your selected melody is on the music stand. This is the Lullaby station, where the dream that lost its song will be repaired.</p></>}
      {game === 'nightlight' && <><h2>A room waiting for a little light.</h2><p>You have arrived at Nightlight, not the music box. The hidden-stars experience will live here, helping a frightened dream become brave.</p></>}
      {destination.kind === 'game' && destination.game === 'courier' && <><h2>Delivery to {destinations.find(d => d.id === destination.destination)?.name}</h2><p>Your chosen address is safely on the envelope. The route and delivery completion will begin here.</p><span className="dx-address-tag">DESTINATION / {destination.destination.toUpperCase()}</span></>}
      {!game && <><p>Welcome to the place where I make the dreams you fall asleep inside. Choose an invention to visit its station.</p><nav className="dx-station-links" aria-label="Nursery stations"><button className="dx-secondary" onClick={() => navigation.enterNursery({ kind: 'game', game: 'lullaby', melody: 'moon' })}>Lullaby music station ♪</button><button className="dx-secondary" onClick={() => navigation.enterNursery({ kind: 'game', game: 'nightlight' })}>Nightlight star room ✧</button><button className="dx-secondary" onClick={() => navigation.enterNursery({ kind: 'game', game: 'courier', destination: 'cloud' })}>Courier · Cloud Cottage ✉</button></nav></>}
      <p className="dx-stage-boundary">Stage 2 station preview. Full immersive repair gameplay arrives in Stage 3. No dream is marked repaired here.</p>
      {game && <button className="dx-secondary" onClick={() => navigation.enterNursery()}>← Nursery entrance</button>}
    </div>
  </section>
}
