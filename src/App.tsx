import { useEffect, useState } from 'react'
import pipPortrait from './assets/pip-portrait.png'
import { assets } from './assets'
import { DesktopDock, DesktopShell, Hero, ProjectWindow } from './components/shell'
import { Goodnight, OriginStory } from './components/story'
import { projects } from './types'
import type { Mood, Project } from './types'
import './App.css'

function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [mood, setMood] = useState<Mood>('day')
  const [muted, setMuted] = useState(true)
  const [secretOpen, setSecretOpen] = useState(false)
  const project = projects.find(({ id }) => id === activeProject)

  useEffect(() => {
    if (!activeProject) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setActiveProject(null)
      requestAnimationFrame(() => document.getElementById(`launch-${activeProject}`)?.focus())
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeProject])

  useEffect(() => {
    if (!activeProject) return
    const frame = requestAnimationFrame(() => {
      const panel = document.getElementById('project-panel')
      panel?.focus({ preventScroll: true })
      panel?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 600px)').matches ? 'instant' : 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [activeProject])

  function openProject(id: Project) {
    setActiveProject(id)
  }

  function closeProject() {
    const launcher = activeProject
    setActiveProject(null)
    requestAnimationFrame(() => document.getElementById(`launch-${launcher}`)?.focus())
  }

  return (
    <DesktopShell mood={mood}>
      <Hero mood={mood}>
        <div className="hero-copy">
          <span className="eyebrow">A tiny computer for very big dreams</span>
          <h1 id="welcome-title">Hello, I’m <em>Pip.</em></h1>
          <p>I’m the Midnight Nursery’s baby skull-faced Junior Dream Engineer. I build the dreams you fall asleep inside.</p>
          <a className="primary-link" href="#origin">Come see my story <span aria-hidden="true">↓</span></a>
          <span className="hero-scroll-note">01 / 04 · scroll to begin</span>
        </div>
        <div className="hero-portrait" data-final-asset={assets.pipHero}>
          {/* PipCharacter integration: replace this official portrait, not the surrounding composition. */}
          <img src={pipPortrait} width="682" height="1024" alt="Pip, a smiling baby with a skull face and starry sleeping cap, holding a glowing lantern" />
        </div>
        <span className="hero-note" aria-hidden="true">✦ gently made after bedtime ✦</span>
      </Hero>

      <OriginStory />

      <section id="workshop" className="workshop-scene" aria-labelledby="workshop-title">
        <div className="section-heading">
          <span className="eyebrow">03 / Pip’s workshop</span>
          <h2 id="workshop-title">A desk full of little wonders.</h2>
          <p>Pick a project from the launcher. I made each one for a different kind of night.</p>
        </div>
        <div className="workshop-desk">
          <div className="workshop-intro window">
            <div className="window-bar"><span className="window-lights" aria-hidden="true"><i /><i /><i /></span><span>a note from pip.txt</span><span className="window-bar-end">✦</span></div>
            <div className="window-body"><span className="desk-star" aria-hidden="true">✦</span><p>Some nights need a song. Some need a little light. And some just need a dream delivered right to the door.</p><span className="desk-signature">— Pip ☾</span></div>
          </div>
          <DesktopDock activeProject={activeProject} onOpenProject={openProject} />
          <ProjectWindow title={project?.title ?? ''} open={project !== undefined} onClose={closeProject}>
            {/* LullabyLab / NightlightLab / DreamDelivery integration: swap only this preview. */}
            <div className={`project-preview project-preview--${activeProject}`} data-final-asset={activeProject === 'lullaby' ? assets.musicbox : activeProject === 'nightlight' ? assets.nightlightRoom : assets.dreamMap}>
              <span className="project-preview-art" aria-hidden="true">{activeProject === 'lullaby' ? '♫' : activeProject === 'nightlight' ? '✧' : '✉'}</span>
              <div><span className="eyebrow">From Pip’s desk · {activeProject === 'lullaby' ? '01' : activeProject === 'nightlight' ? '02' : '03'}</span><h3>{project?.title}</h3><p>{project?.description}</p><p className="project-status">Pip is putting the finishing touches on this little wonder. ✦</p></div>
            </div>
          </ProjectWindow>
        </div>
      </section>

      <Goodnight>
        {/* MoonSecret integration: this discoverable in-flow note is the temporary stand-in. */}
        <button className="moon-button" type="button" onClick={() => setSecretOpen(!secretOpen)} aria-expanded={secretOpen} aria-controls="secret-dream" aria-label="Look behind the moon">☾</button>
        <span className="moon-hint">Psst… have you looked behind the moon?</span>
        <p id="secret-dream" className="secret-note" hidden={!secretOpen}>✦ Dear dreamer, the first star I ever fixed is yours to keep. If tonight feels dark, remember: even a tiny light can find its way home. — Pip</p>
        <footer className="credits">Made for <a href="https://hax.baby/" target="_blank" rel="noreferrer">haX.baby</a> · Pip portrait: <a href="https://hax.baby/baby/assets/pip_portrait.png" target="_blank" rel="noreferrer">official haX.baby character art</a> · Interface built with React, Vite &amp; CSS · <a href="#welcome">Back to top ↑</a></footer>
      </Goodnight>

      <div className="shell-controls" aria-label="PipOS settings">
        {/* MoodSwitch / AudioToggle integration: App remains the owner of both states. */}
        <button className="mood-toggle" type="button" onClick={() => setMood(mood === 'day' ? 'night' : 'day')} aria-pressed={mood === 'night'} aria-label={mood === 'day' ? 'Dim the nursery' : 'Brighten the nursery'}>{mood === 'day' ? '☾ Dim lights' : '✦ Lights on'}</button>
        <button className="sound-toggle" type="button" onClick={() => setMuted(!muted)} aria-pressed={!muted} aria-label={muted ? 'Enable sound' : 'Mute sound'} title="Sound will be available when the interactive projects arrive">{muted ? '♪ Sound off' : '♫ Sound on'}</button>
      </div>
    </DesktopShell>
  )
}

export default App