import './AudioToggle.css'

export interface AudioToggleProps {
  muted: boolean
  onToggle: () => void
}

export function AudioToggle({ muted, onToggle }: AudioToggleProps) {
  return (
    <button className="audio-toggle" type="button" aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={!muted} onClick={onToggle}>
      <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h6l7-6v20l-7-6H5z" />
        {muted ? <path d="m23 12 6 8m0-8-6 8" /> : <><path d="M23 12q4 4 0 8" /><path d="M26 8q8 8 0 16" /></>}
      </svg>
      <span>{muted ? 'Sound off' : 'Sound on'}</span>
    </button>
  )
}
