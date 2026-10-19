import { useState } from 'react'
import { art, icons } from '../assets/dream'
import type { AppProps } from './registry'

const PreviewLabel = () => <span className="dx-preview-label">✧ Stage 1 preview · full application in Stage 2</span>

export function MyDreams({ launch }: AppProps) {
  return <div className="dx-app-page"><span className="dx-eyebrow">DREAM RECOVERY / 000</span><h2>Three little runaways.</h2><p>I left the window open. Just a crack. Now three of my dreams are somewhere out there. Will you help me bring them home?</p><div className="dx-dream-list">{([
    ['lullaby', '01', 'The dream that lost its song', 'Find its melody in Lullaby Lab.'],
    ['nightlight', '02', 'The dream afraid of the dark', 'A little glow from Nightlight.exe.'],
    ['courier', '03', 'The dream that forgot the way', 'Give it a home with Dream Courier.'],
  ] as const).map(([id, n, title, subtitle]) => <button key={id} onClick={() => launch(id)}><img src={icons[id]} alt="" /><span><small>DREAM {n} · MISSING</small><strong>{title}</strong><span>{subtitle}</span></span><b aria-hidden="true">↗</b></button>)}</div><div className="dx-app-footnote">0 / 3 repaired · Repair mechanics arrive in Stage 3. No pretend progress.</div></div>
}
export function AboutPip({ launch }: AppProps) {
  return <div className="dx-about dx-app-page"><div><span className="dx-eyebrow">MIDNIGHT NURSERY / PERSONNEL FILE</span><h2>Small skull.<br />Big dreams.</h2><p>Hi, I’m Pip! A baby, a friendly skull face, and the nursery’s Junior Dream Engineer.</p><p>I make little things for big feelings: a song for a worried heart, a light for a lonely room, a dream to find your way home.</p><button className="dx-primary" onClick={() => launch('diary')}>Read my dream diary <span>↗</span></button></div><img src={art.pip} alt="Pip, a smiling skull-faced baby in cream pajamas, waving from a cloud" /></div>
}
export function DreamDiary({ data, setData }: AppProps) {
  return <div className="dx-app-page dx-diary"><span className="dx-eyebrow">PIP’S DIARY / ENTRY 001</span><h2>Dear almost-asleep,</h2><p>Tonight I made a dream so soft I nearly fell asleep inside it. Then the music box hiccupped, the nightlight blinked, and… three dreams slipped away.</p><p>I’m only a junior engineer. But maybe fixing things starts with asking for a little help.</p><span className="dx-signature">With stardust, Pip ♡</span><label htmlFor="dream-note">Leave a little note for the night shift</label><textarea id="dream-note" maxLength={2000} value={data} onChange={e => setData(e.target.value)} placeholder="Tonight, I’m dreaming of…" /><small>Saved on this device when storage is available. No account, no upload.</small></div>
}
export function LullabyLab({ requestDestination }: AppProps) {
  return <div className="dx-app-page dx-invention"><span className="dx-eyebrow">INVENTION NO. 01 / SOUND</span><img className="dx-invention-icon" src={icons.lullaby} alt="A tiny magical music box" /><h2>A song to come home to.</h2><p>The winding key is waiting. Soon you’ll piece together a lullaby and help the first dream remember its melody.</p><PreviewLabel /><button className="dx-primary" onClick={() => requestDestination({ kind: 'game', game: 'lullaby' })}>Inspect the music box <span>♪</span></button></div>
}
export function Nightlight({ requestDestination }: AppProps) {
  return <div className="dx-app-page dx-invention"><span className="dx-eyebrow">INVENTION NO. 02 / LIGHT</span><img className="dx-invention-icon" src={icons.nightlight} alt="A warm star inside a little lantern" /><h2>Bravery comes in small glows.</h2><p>One little dream is hiding in the shadows. Your lantern will uncover the nursery’s hidden wonders, one soft light at a time.</p><PreviewLabel /><button className="dx-primary" onClick={() => requestDestination({ kind: 'game', game: 'nightlight' })}>Inspect the lantern <span>✦</span></button></div>
}
export function DreamCourier({ requestDestination }: AppProps) {
  return <div className="dx-app-page dx-invention"><span className="dx-eyebrow">INVENTION NO. 03 / DELIVERY</span><img className="dx-invention-icon" src={icons.courier} alt="A winged envelope with a golden seal" /><h2>Someone is waiting for this dream.</h2><p>Address: somewhere past the moon. Soon you’ll chart a path through the stars and deliver a wandering dream to its sleeping owner.</p><PreviewLabel /><button className="dx-primary" onClick={() => requestDestination({ kind: 'game', game: 'courier' })}>Check the delivery route <span>↗</span></button></div>
}
export function Telescope({ data, setData }: AppProps) {
  const names = ['The Sleepy Bear', 'The Paper Moon', 'The Lost Little Star']
  const index = Number(data) || 0
  return <div className="dx-app-page"><span className="dx-eyebrow">OBSERVATORY / SKY LOG</span><h2>Look a little further.</h2><img className="dx-scene-art" src={art.telescope} alt="A violet telescope and a deep purple sky, supplied concept artwork" /><div className="dx-inline"><span>Viewing: <strong>{names[index % names.length]}</strong></span><button className="dx-secondary" onClick={() => setData(String((index + 1) % names.length))}>Next constellation ↗</button></div><PreviewLabel /></div>
}
export function ToyCabinet({ data, setData }: AppProps) {
  return <div className="dx-app-page"><span className="dx-eyebrow">KEEPSAKES / HANDLE WITH LOVE</span><h2>Everything has a story.</h2><img className="dx-scene-art" src={art.cabinet} alt="A warm toy lantern on Pip’s wooden workbench" /><button className="dx-secondary" onClick={() => setData(data ? '' : 'Pip’s very first lantern. It was supposed to hold a star. It held a firefly instead. Still counts.')}>{data ? 'Put the keepsake back' : 'Read the lantern’s tag'}</button>{data && <p>{data}</p>}<PreviewLabel /></div>
}
export function DreamGallery({ data, setData }: AppProps) {
  const picture = data === 'nursery' ? art.sweet : art.gallery
  return <div className="dx-app-page"><span className="dx-eyebrow">MEMORIES / NOT FOR DELETION</span><h2>Wish you were dreaming here.</h2><img className="dx-scene-art" src={picture} alt={data === 'nursery' ? 'Pip and soft ghost friends in a pastel cloud nursery' : 'Pip working at a glowing dream-making desk'} /><div className="dx-inline"><span>{data === 'nursery' ? '02 / The company we keep' : '01 / A very late night at the desk'}</span><button className="dx-secondary" onClick={() => setData(data === 'nursery' ? '' : 'nursery')}>Next postcard →</button></div><PreviewLabel /></div>
}
export function Terminal({ data, setData, launch, notify }: AppProps) {
  const [command, setCommand] = useState('')
  function submit() {
    const input = command.trim().toLowerCase()
    if (!input) return
    let response = 'Unknown command. Try help. (This is a fictional terminal; no shell commands execute.)'
    if (input === 'help') response = 'help · whoami · dreams · nursery · starlight · clear'
    if (input === 'whoami') response = 'Pip / baby skull / Junior Dream Engineer / Midnight Nursery'
    if (input === 'dreams') { response = 'Opening dream recovery…'; launch('dreams') }
    if (input === 'nursery') { response = 'Opening sweetdreams.exe…'; launch('sweet') }
    if (input === 'starlight') { response = 'SECRET FOUND: Even the smallest light can lead someone home. — Pip'; notify('Secret found · A tiny star has been left in your terminal.') }
    setData(input === 'clear' ? '' : `${data}\nPIP:~> ${command.trim()}\n${response}`.slice(-8000))
    setCommand('')
  }
  return <div className="dx-terminal"><p>DREAM.EXE [version 0.1]<br />Midnight Nursery Personal Computer<br />Type “help” to look around.</p><pre role="log" aria-live="polite">{data || 'All systems dreaming. Three dreams unaccounted for.'}</pre><form onSubmit={e => { e.preventDefault(); submit() }}><label htmlFor="terminal-command">PIP:~&gt;</label><input id="terminal-command" autoComplete="off" spellCheck={false} maxLength={120} value={command} onChange={e => setCommand(e.target.value)} /><button type="submit" aria-label="Run command">↵</button></form><small>Hint: the computer has a soft spot for starlight.</small></div>
}
export function SweetDreams({ requestDestination }: AppProps) {
  return <div className="dx-app-page"><span className="dx-eyebrow">SWEETDREAMS.EXE / PORTAL</span><h2>On the other side of sleep.</h2><img className="dx-scene-art" src={art.sweet} alt="A dreamy nursery with Pip and gentle ghost friends among pastel clouds" /><p>This is where my dreams begin. The immersive nursery opens in Stage 3.</p><button className="dx-primary" onClick={() => requestDestination({ kind: 'nursery' })}>Check the nursery portal <span>✧</span></button></div>
}
export function LostDreams({ launch }: AppProps) {
  return <div className="dx-app-page"><span className="dx-eyebrow">LOST & FOUND / DO NOT EMPTY</span><h2>Lost isn’t the same as gone.</h2><img className="dx-scene-art" src={art.lost} alt="A cozy nursery corner with a basket and a small star-holding toy" /><p>No dreams have been recovered yet. I’m keeping a soft place for them, just in case.</p><button className="dx-secondary" onClick={() => launch('dreams')}>Open the missing-dream files →</button></div>
}
export function Settings({ muted, toggleMute, effects, toggleEffects, replayIntro }: AppProps) {
  return <div className="dx-app-page"><span className="dx-eyebrow">DREAM.EXE / PREFERENCES</span><h2>A little more you.</h2><div className="dx-settings-row"><span><strong>Interface sounds</strong><small>Soft, synthesized chimes. No autoplay.</small></span><button className="dx-secondary" onClick={toggleMute} aria-pressed={!muted}>{muted ? 'Off' : 'On'}</button></div><div className="dx-settings-row"><span><strong>Magical effects</strong><small>Star pointer and gentle atmosphere.</small></span><button className="dx-secondary" onClick={toggleEffects} aria-pressed={effects}>{effects ? 'On' : 'Off'}</button></div><p className="dx-app-footnote">Your device’s reduced-motion preference always wins. Touch devices keep their native pointer behavior.</p><button className="dx-secondary" onClick={replayIntro}>Replay the boot sequence ↺</button><details className="dx-credits"><summary>Credits & system information</summary><p>DREAM.EXE · Stage 1 foundation. Pip character canon: <a href="https://hax.baby/" target="_blank" rel="noreferrer">haX.baby</a>. Illustrations supplied by the project operator; original artist/license confirmation pending. UI built with React, TypeScript, Vite, Motion and CSS. System fonts. Chimes synthesized with Web Audio; no recorded audio.</p></details></div>
}
