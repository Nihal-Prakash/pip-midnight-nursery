import { useEffect, useReducer, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { apps, getApp } from '../apps/registry'
import { art } from '../assets/dream'
import { readPreference, savePreference, windowsReducer } from '../state/windows'
import type { AppId, WindowAction } from '../state/windows'
import { AppWindow } from './AppWindow'
import { Boot } from './Boot'
import { Cursor } from './Cursor'
import './dream.css'

export default function DreamOS() {
  const [boot, setBoot] = useState(() => !readPreference('visited', false))
  const [muted, setMuted] = useState<boolean>(() => readPreference('muted', true))
  const [effects, setEffects] = useState<boolean>(() => readPreference('effects', true))
  const [windows, rawDispatch] = useReducer(windowsReducer, [])
  const [appData, setAppData] = useState<Partial<Record<AppId, string>>>(() => ({ diary: readPreference('diary', '') }))
  const [viewport, setViewport] = useState({ width: innerWidth, height: innerHeight })
  const [startOpen, setStartOpen] = useState(false)
  const [clock, setClock] = useState(() => new Date())
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const menu = useRef<HTMLElement>(null)
  const startButton = useRef<HTMLButtonElement>(null)
  const desktop = useRef<HTMLElement>(null)
  const parallaxFrame = useRef(0)
  const audio = useRef<AudioContext | null>(null)
  const master = useRef<GainNode | null>(null)
  const reduced = useReducedMotion()
  const active = windows.findLast(w => !w.minimized)?.id
  const mobile = viewport.width <= 700

  useEffect(() => {
    const resize = () => { const size = { width: innerWidth, height: innerHeight }; setViewport(size); rawDispatch({ type: 'fit', viewport: size }) }
    window.addEventListener('resize', resize)
    const timer = setInterval(() => setClock(new Date()), 1000)
    return () => { window.removeEventListener('resize', resize); clearInterval(timer); cancelAnimationFrame(parallaxFrame.current) }
  }, [])
  useEffect(() => { savePreference('muted', muted); if (audio.current && master.current) master.current.gain.setValueAtTime(muted ? 0 : .035, audio.current.currentTime) }, [muted])
  useEffect(() => { savePreference('effects', effects) }, [effects])
  useEffect(() => () => { void audio.current?.close(); audio.current = null; master.current = null }, [])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    if (!startOpen) return
    menu.current?.querySelector<HTMLButtonElement>('button')?.focus()
    function outside(e: PointerEvent) {
      if (!menu.current?.contains(e.target as Node) && !startButton.current?.contains(e.target as Node)) setStartOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [startOpen])
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (boot) return
      if (e.key === 'Escape' && startOpen) { e.preventDefault(); setStartOpen(false); startButton.current?.focus(); return }
      if (e.key === 'Escape' && active) { e.preventDefault(); rawDispatch({ type: 'close', id: active }); requestAnimationFrame(() => { if (!document.querySelector('.dx-window:not([hidden])')) (document.getElementById(`launch-${active}`) ?? startButton.current)?.focus() }); return }
      if (e.altKey && e.key === 'PageDown') {
        const visible = windows.filter(w => !w.minimized)
        if (visible.length) { e.preventDefault(); rawDispatch({ type: 'focus', id: visible[0].id }) }
      }
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [active, boot, startOpen, windows])

  function notify(message: string) { setToast({ id: Date.now(), message }) }
  function dispatch(action: WindowAction) {
    rawDispatch(action)
    if (action.type === 'close' || action.type === 'minimize') requestAnimationFrame(() => {
      if (!document.querySelector('.dx-window:not([hidden])')) (document.getElementById(`launch-${action.id}`) ?? startButton.current)?.focus({ preventScroll: true })
    })
  }
  function launch(id: AppId) {
    const app = getApp(id)
    dispatch({ type: 'open', id, size: app.window, viewport })
    setStartOpen(false)
  }
  function enter() { savePreference('visited', true); setBoot(false) }
  function home() { dispatch({ type: 'home' }); setStartOpen(false); requestAnimationFrame(() => document.getElementById('launch-dreams')?.focus({ preventScroll: true })) }
  async function chime() {
    if (muted || !window.AudioContext) return
    try {
      if (!audio.current) { audio.current = new AudioContext(); master.current = audio.current.createGain(); master.current.gain.value = .035; master.current.connect(audio.current.destination) }
      const ctx = audio.current
      await ctx.resume()
      if (!master.current || ctx.state !== 'running') return
      const tone = ctx.createOscillator(), envelope = ctx.createGain()
      tone.frequency.value = 660
      envelope.gain.setValueAtTime(.001, ctx.currentTime)
      envelope.gain.exponentialRampToValueAtTime(.6, ctx.currentTime + .015)
      envelope.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .16)
      tone.connect(envelope).connect(master.current)
      tone.start(); tone.stop(ctx.currentTime + .18)
      tone.onended = () => { tone.disconnect(); envelope.disconnect() }
    } catch { notify('Sound is unavailable in this browser. Everything else still works.') }
  }
  return <MotionConfig reducedMotion="user"><div className="dream-os" data-effects={effects} onClickCapture={e => { if ((e.target as Element).closest('button')) void chime() }}>
    <AnimatePresence mode="wait">{boot ? <Boot key="boot" onEnter={enter} muted={muted} onToggleMute={() => setMuted(v => !v)} /> : <motion.main ref={desktop} key="desktop" className="dx-desktop" initial={{ opacity: 0, scale: reduced ? 1 : 1.025 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : .65 }} onPointerMove={e => {
      if (!effects || reduced || mobile || e.pointerType === 'touch') return
      const x = (e.clientX / viewport.width - .5) * 7, y = (e.clientY / viewport.height - .5) * 7
      cancelAnimationFrame(parallaxFrame.current)
      parallaxFrame.current = requestAnimationFrame(() => { desktop.current?.style.setProperty('--dx-px', `${x}px`); desktop.current?.style.setProperty('--dx-py', `${y}px`) })
    }}>
      <picture className="dx-wallpaper" aria-hidden="true"><source media="(max-width: 700px)" srcSet={art.mobile} /><img src={art.desktop} alt="" /></picture>
      <header className="dx-system-bar"><button className="dx-brand" onClick={home} aria-label="DREAM.EXE — Return Home"><span>✦</span> DREAM<span className="dx-brand-exe">.EXE</span></button><span className="dx-system-location">PIP’S PERSONAL COMPUTER <span>/</span> MIDNIGHT NURSERY</span><span className="dx-system-state"><i /> a little magic is running</span></header>
      <div className="dx-desktop-surface" inert={mobile && !!active}>
        <div className="dx-desktop-heading"><span className="dx-eyebrow">WELCOME TO MY LITTLE CORNER OF THE UNIVERSE</span><h1>Stay a little.<br /><em>Dream a lot.</em><span aria-hidden="true">✧</span></h1><p>I’m Pip. Junior Dream Engineer. Professional almost-asleep.</p></div>
        <nav className="dx-app-icons" aria-label="Desktop applications">{apps.filter(a => a.desktop).map(app => <button key={app.id} id={`launch-${app.id}`} className="dx-desktop-icon" onClick={() => launch(app.id)} title={`Open ${app.label}`} aria-label={`Open ${app.label}`}><span className="dx-icon-image"><img src={app.icon} alt="" draggable={false} />{windows.some(w => w.id === app.id) && <i aria-hidden="true" />}</span><span>{app.label}</span></button>)}</nav>
        <aside className="dx-note"><span className="dx-note-pin" aria-hidden="true">✦</span><span className="dx-note-label">a note to myself</span><p>don’t forget<br />to wind the<br /><em>music box!</em></p><button onClick={() => launch('lullaby')}>love, Pip ♡ <span>↗</span></button></aside>
        <section className="dx-welcome" aria-labelledby="welcome-title"><div className="dx-mini-title"><span><span aria-hidden="true">✉</span> a small favor.txt</span><span aria-hidden="true">☾</span></div><div className="dx-welcome-body"><span className="dx-alert-mark" aria-hidden="true">!</span><div><span className="dx-eyebrow">UH-OH. A LITTLE BEDTIME EMERGENCY.</span><h2 id="welcome-title">Three dreams slipped away.</h2><p>I was only looking away for a second.<br />Could you help me bring them home?</p><button className="dx-primary" onClick={() => launch('dreams')}>Let’s find those dreams <span aria-hidden="true">↗</span></button><span className="dx-welcome-hint">Start here. The rest is yours to explore.</span></div></div></section>
        <button className="dx-pip" onClick={() => launch('about')} aria-label="Say hello to Pip"><span className="dx-pip-orbit" aria-hidden="true">✦</span><img src={art.pip} alt="Pip, a friendly skull-faced baby, waving from a cloud" draggable={false} /><span className="dx-pip-caption">your tiny night-shift companion <span>♡</span></span></button>
        <div className="dx-desktop-footer"><span>✧ 12 little worlds. One very sleepy computer.</span><button data-secret onClick={() => { notify('Psst… type “starlight” in Terminal. Some things are better found than explained.'); launch('terminal') }} aria-label="A tiny secret star">✦</button><span>click an icon · make yourself at home</span></div>
      </div>
      {windows.map((state, i) => {
        const app = getApp(state.id), Content = app.component
        return <AppWindow key={state.id} app={app} state={state} focused={active === state.id} z={30 + i} viewport={viewport} dispatch={dispatch}><Content data={appData[state.id] ?? ''} setData={value => { setAppData(current => ({ ...current, [state.id]: value })); if (state.id === 'diary') savePreference('diary', value) }} launch={launch} requestDestination={destination => notify(destination.kind === 'nursery' ? 'The nursery portal is reserved for Stage 3. Your desktop is ready to explore.' : `${getApp(destination.game).label}: the repair game arrives in Stage 3. No dream has been marked repaired.`)} notify={notify} muted={muted} toggleMute={() => setMuted(m => !m)} effects={effects} toggleEffects={() => setEffects(v => !v)} replayIntro={() => { setStartOpen(false); setBoot(true) }} /></AppWindow>
      })}
      <AnimatePresence>{startOpen && <motion.nav ref={menu} className="dx-start-menu" aria-label="Start menu" id="dx-start-menu" initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onKeyDown={e => {
        const buttons = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('button')]
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (index + (e.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length; buttons[next]?.focus() }
      }}><div className="dx-start-heading"><img src={art.sticker} alt="" /><span><strong>Pip’s little universe</strong><small>Junior Dream Engineer · online, barely</small></span></div><div className="dx-start-apps">{apps.filter(a => a.desktop).map(app => <button key={app.id} onClick={() => launch(app.id)}><img src={app.icon} alt="" /><span>{app.label}</span></button>)}</div><div className="dx-start-actions"><button onClick={() => launch('settings')}>⚙ Settings & credits</button><button onClick={home}>⌂ Return Home</button></div></motion.nav>}</AnimatePresence>
      <footer className="dx-taskbar" aria-label="System taskbar"><button className="dx-start-button" ref={startButton} aria-expanded={startOpen} aria-controls="dx-start-menu" onClick={() => setStartOpen(v => !v)}><img src={art.sticker} alt="" /><span>Start</span><span aria-hidden="true">⌃</span></button><span className="dx-taskbar-divider" /><div className="dx-running-apps" aria-label="Running applications">{windows.length ? windows.map(w => <button key={w.id} title={`${w.minimized ? 'Restore' : 'Show'} ${getApp(w.id).label}`} aria-label={`${w.minimized ? 'Restore' : 'Show'} ${getApp(w.id).label}`} aria-pressed={active === w.id} onClick={() => dispatch({ type: 'focus', id: w.id })}><img src={getApp(w.id).icon} alt="" /><span>{getApp(w.id).label}</span><i data-minimized={w.minimized} /></button>) : <span className="dx-idle-taskbar">☾ no rush. dreams take their time.</span>}</div><div className="dx-system-tray"><button className="dx-tray-home" onClick={home} aria-label="Return Home" title="Return Home">⌂</button><button onClick={() => setMuted(v => !v)} aria-label={muted ? 'Unmute sounds' : 'Mute sounds'} aria-pressed={!muted} title={muted ? 'Sound off' : 'Sound on'}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" />{muted ? <path d="m16 9 6 6m0-6-6 6" /> : <><path d="M15 8q5 4 0 8M18 4q9 8 0 16" /></>}</svg></button><button className="dx-tray-settings" onClick={() => launch('settings')} aria-label="Open Settings" title="Settings">⚙</button><time dateTime={clock.toISOString()}>{clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}<small>local time <span>✦</span></small></time></div></footer>
    </motion.main>}</AnimatePresence>
    <div className="dx-toast-region" role="status" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait">{toast && <motion.div className="dx-toast" key="notification" initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><span aria-hidden="true">✦</span><p>{toast.message}</p><button onClick={() => setToast(null)} aria-label="Dismiss notification">×</button></motion.div>}</AnimatePresence></div>
    <Cursor enabled={effects} />
  </div></MotionConfig>
}
