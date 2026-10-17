import { useCallback, useEffect, useRef } from 'react'

export interface Note { frequency: number; duration: number }

// Mount once per audible project. Call playLoop only from a user gesture;
// App owns muted and renders AudioToggle. stop() is safe on close/unmount.
export function useAudio(muted: boolean) {
  const context = useRef<AudioContext | null>(null)
  const master = useRef<GainNode | null>(null)
  const voices = useRef<Set<OscillatorNode>>(new Set())
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const generation = useRef(0)

  const stop = useCallback(() => {
    generation.current++
    clearTimeout(timer.current)
    voices.current.forEach(voice => {
      try { voice.stop() } catch { /* an already-ended note */ }
      voice.disconnect()
    })
    voices.current.clear()
  }, [])

  useEffect(() => {
    if (context.current && master.current) {
      master.current.gain.setTargetAtTime(muted ? 0 : 0.14, context.current.currentTime, 0.02)
    }
  }, [muted])

  useEffect(() => () => {
    stop()
    const audio = context.current
    context.current = null
    master.current = null
    if (audio) void audio.close()
  }, [stop])

  const playLoop = useCallback(async (notes: readonly Note[]) => {
    stop()
    if (!notes.length || typeof window === 'undefined' || !window.AudioContext) return false
    const token = generation.current
    try {
      if (!context.current) {
        context.current = new AudioContext()
        master.current = context.current.createGain()
        master.current.gain.value = muted ? 0 : 0.14
        master.current.connect(context.current.destination)
      }
      const audio = context.current
      await audio.resume()
      if (generation.current !== token || !master.current) return false

      const schedule = () => {
        if (generation.current !== token || !master.current) return
        let at = audio.currentTime + 0.03
        for (const note of notes) {
          if (note.frequency > 0) {
            const voice = audio.createOscillator()
            const envelope = audio.createGain()
            voice.type = 'sine'
            voice.frequency.value = note.frequency
            envelope.gain.setValueAtTime(0.0001, at)
            envelope.gain.exponentialRampToValueAtTime(0.42, at + 0.025)
            envelope.gain.exponentialRampToValueAtTime(0.0001, at + note.duration * 0.9)
            voice.connect(envelope).connect(master.current)
            voices.current.add(voice)
            voice.onended = () => { voices.current.delete(voice); voice.disconnect(); envelope.disconnect() }
            voice.start(at)
            voice.stop(at + note.duration)
          }
          at += note.duration
        }
        timer.current = setTimeout(schedule, (at - audio.currentTime - 0.03) * 1000)
      }
      schedule()
      return true
    } catch {
      stop()
      return false
    }
  }, [muted, stop])

  return { playLoop, stop }
}
