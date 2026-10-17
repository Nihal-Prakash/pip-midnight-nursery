import { useEffect, useId, useRef, useState } from 'react'
import { useAudio, type Note } from '../../hooks/useAudio'
import './LullabyLab.css'

export interface LullabyLabProps {
  muted: boolean
  onPlaySound?: () => void
}

const melodies: { name: string; notes: readonly Note[] }[] = [
  { name: 'Moonbeam', notes: [392, 440, 523.25, 440, 392, 329.63, 349.23, 392].map(frequency => ({ frequency, duration: 0.42 })) },
  { name: 'Cloud Drift', notes: [329.63, 392, 440, 0, 440, 392, 329.63, 261.63].map(frequency => ({ frequency, duration: 0.5 })) },
  { name: 'Little Star', notes: [261.63, 261.63, 392, 392, 440, 440, 392, 0].map(frequency => ({ frequency, duration: 0.38 })) },
]

export function LullabyLab({ muted, onPlaySound }: LullabyLabProps) {
  const { playLoop, stop } = useAudio(muted)
  const request = useRef(0)
  const group = useId()
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => () => { request.current++ }, [])

  function halt() {
    request.current++
    stop()
    setPlaying(false)
  }

  async function start(index: number) {
    const token = ++request.current
    setError(false)
    const started = await playLoop(melodies[index].notes)
    if (token !== request.current) return
    setPlaying(started)
    setError(!started)
    if (started && !muted) onPlaySound?.()
  }

  return (
    <section className="lullaby-lab" aria-label="Lullaby Lab">
      <div className={`lullaby-lab__stage${playing ? ' lullaby-lab__stage--playing' : ''}`}>
        <span className="lullaby-lab__note lullaby-lab__note--one" aria-hidden="true">♪</span>
        <span className="lullaby-lab__note lullaby-lab__note--two" aria-hidden="true">♫</span>
        <div className="lullaby-lab__box" aria-hidden="true">
          <span className="lullaby-lab__star">✦</span>
          <span className="lullaby-lab__key" />
        </div>
      </div>
      <p className="lullaby-lab__intro">Wind up a little dream for the nursery.</p>
      <fieldset className="lullaby-lab__choices">
        <legend>Choose a lullaby</legend>
        {melodies.map((melody, index) => (
          <label key={melody.name} className="lullaby-lab__choice">
            <input type="radio" name={group} value={melody.name} checked={selected === index}
              onChange={() => { setSelected(index); if (playing) void start(index) }} />
            {melody.name}
          </label>
        ))}
      </fieldset>
      <div className="lullaby-lab__controls">
        <button type="button" onClick={() => void start(selected)} disabled={playing}>Play</button>
        <button type="button" onClick={halt} disabled={!playing}>Stop</button>
        <span role="status">{error ? 'Audio is unavailable in this browser.' : playing ? muted ? 'Playing silently · unmute to hear' : 'Playing softly' : 'Ready to wind up'}</span>
      </div>
      <p className="lullaby-lab__hint">{muted ? 'Sound is muted. Use the PipOS sound toggle to listen.' : 'Keep the PipOS sound toggle nearby to mute at any time.'}</p>
    </section>
  )
}
