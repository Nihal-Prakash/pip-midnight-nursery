import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { projects } from '../../types'
import type { Mood, Project } from '../../types'

type ShellProps = { mood: Mood; children: ReactNode }

export function DesktopShell({ mood, children }: ShellProps) {
  return (
    <div className={`pip-os pip-os--${mood}`}>
      <header className="menu-bar" aria-label="PipOS menu bar">
        <a href="#welcome" className="brand"><span aria-hidden="true">✦</span> PipOS <span className="brand-version">01</span></a>
        <nav aria-label="Story chapters">
          <a href="#origin">Origin</a>
          <a href="#workshop">Workshop</a>
          <a href="#goodnight">Goodnight</a>
        </nav>
        <span className="menu-clock" aria-hidden="true"><span className="clock-light" /> ☾ Midnight Nursery</span>
      </header>
      <main>{children}</main>
    </div>
  )
}

export function DesktopDock({ activeProject, onOpenProject }: {
  activeProject: Project | null
  onOpenProject: (project: Project) => void
}) {
  return (
    <nav className="dock" aria-label="Project launcher">
      {projects.map(({ id, title }) => (
        <button
          className={`dock-button ${activeProject === id ? 'dock-button--active' : ''}`}
          id={`launch-${id}`}
          key={id}
          type="button"
          aria-controls={activeProject === id ? 'project-panel' : undefined}
          aria-expanded={activeProject === id}
          onClick={() => onOpenProject(id)}
        >
          <span className={`dock-icon dock-icon--${id}`} aria-hidden="true">{id === 'lullaby' ? '♫' : id === 'nightlight' ? '✧' : '✉'}</span>
          <span>{title}</span>
          <span className="dock-caption" aria-hidden="true">open window ↗</span>
        </button>
      ))}
    </nav>
  )
}

export function ProjectWindow({ title, open, onClose, children }: {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  const reducedMotion = useReducedMotion()
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.section
          className="window project-window"
          id="project-panel"
          aria-labelledby="project-window-title"
          tabIndex={-1}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: 8 }}
          transition={{ duration: reducedMotion ? 0 : .24 }}
        >
          <div className="window-bar">
            <span className="window-lights" aria-hidden="true"><i /><i /><i /></span>
            <span id="project-window-title">{title}</span>
            <span className="window-bar-end" aria-hidden="true">pip://workshop</span>
            <button type="button" className="window-close" onClick={onClose} aria-label={`Close ${title}`}>×</button>
          </div>
          <div className="window-body">{children}</div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

export function Hero({ mood, children }: { mood: Mood; children: ReactNode }) {
  return <section id="welcome" className={`hero-scene hero-scene--${mood}`} aria-labelledby="welcome-title">{children}</section>
}
