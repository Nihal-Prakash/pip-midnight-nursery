import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { art } from '../assets/dream'

export function Boot({ onEnter, muted, onToggleMute }: { onEnter: () => void; muted: boolean; onToggleMute: () => void }) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (reduced) return
    const start = performance.now()
    const timer = window.setInterval(() => {
      const next = Math.min(100, Math.round((performance.now() - start) / 36))
      setProgress(next)
      if (next === 100) clearInterval(timer)
    }, 90)
    return () => clearInterval(timer)
  }, [reduced])
  const value = reduced ? 100 : progress
  const ready = value === 100
  return <motion.main className="dx-boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: reduced ? 1 : 1.035, filter: reduced ? 'none' : 'blur(12px)' }} transition={{ duration: reduced ? 0 : .55 }} aria-labelledby="boot-title">
    <div className="dx-boot-top"><span>MN PERSONAL COMPUTER SYSTEM</span><div className="dx-boot-actions"><button className="dx-quiet" onClick={onToggleMute} aria-label={muted ? 'Unmute sounds' : 'Mute sounds'} aria-pressed={!muted}>Sound {muted ? 'off' : 'on'}</button><button className="dx-quiet" onClick={onEnter}>Skip intro ↗</button></div></div>
    <div className="dx-crt"><div className="dx-boot-corner">DREAM BIOS v.01<br />MEMORY: INFINITE POSSIBILITIES</div><span className="dx-boot-star star-a" aria-hidden="true">✦</span><span className="dx-boot-star star-b" aria-hidden="true">✧</span><span className="dx-boot-star star-c" aria-hidden="true">✦</span><div className="dx-boot-emblem"><span aria-hidden="true">☾</span><img src={art.sticker} alt="Pip’s friendly little skull face" /></div><p className="dx-eyebrow">A MIDNIGHT NURSERY OPERATING SYSTEM</p><h1 id="boot-title">DREAM<span>.EXE</span></h1><p className="dx-boot-tagline">For the things you dream of after dark.</p><div className="dx-boot-loader"><div className="dx-boot-load-label"><span>{ready ? 'DREAM INTEGRITY CHECK FAILED' : 'Waking up the stars…'}</span><span>{value}%</span></div><progress max="100" value={value} aria-label="Starting DREAM.EXE" /></div><div className="dx-boot-result" aria-live="polite">{ready ? <><p><span aria-hidden="true">⚠</span> ERROR: THREE DREAMS HAVE ESCAPED.</p><span>It’s okay. We can bring them home.</span><button className="dx-primary" onClick={onEnter}>ENTER DREAM.EXE <span aria-hidden="true">↗</span></button></> : <p>Checking lullabies. Counting sheep. Please stay soft.</p>}</div><div className="dx-crt-footer"><span>☾ MADE OF MOONLIGHT</span><span>EST. AFTER BEDTIME</span></div></div>
    <div className="dx-boot-bottom"><span>© MIDNIGHT NURSERY</span><span>A SMALL COMPUTER. A VERY BIG NIGHT.</span><span>✦</span></div>
  </motion.main>
}
