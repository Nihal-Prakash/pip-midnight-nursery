import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { assets } from '../../assets'

export function OriginStory() {
  const reducedMotion = useReducedMotion()
  const entrance = reducedMotion ? undefined : { opacity: 1, y: 0 }
  const initial = reducedMotion ? false : { opacity: .72, y: 22 }

  return (
    <section id="origin" className="origin-story" aria-labelledby="origin-title">
      <div className="section-heading">
        <span className="eyebrow">02 / a little backstory</span>
        <h2 id="origin-title">Every dream starts somewhere.</h2>
        <p>Scroll through the stars with me.</p>
      </div>
      <div className="origin-beats">
        <motion.article className="story-beat" initial={initial} whileInView={entrance} viewport={{ once: true, amount: .24 }} transition={{ duration: .65 }}>
          <div className="story-art story-art--star" data-final-asset={assets.originStar} aria-hidden="true"><span className="story-glow" /><span className="story-orbit">· · ✧ · ·</span><motion.span className="story-light" initial={reducedMotion ? false : { opacity: .3, scale: .7 }} whileInView={reducedMotion ? undefined : { opacity: .7, scale: 1 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .75 }}>✦</motion.span></div>
          <div className="story-copy"><span className="eyebrow">01 · the first star</span><h3>It was a little too dark.</h3><p>One night, I found a star that had forgotten how to shine.</p></div>
        </motion.article>
        <motion.article className="story-beat" initial={initial} whileInView={entrance} viewport={{ once: true, amount: .24 }} transition={{ duration: .65 }}>
          <div className="story-art story-art--lantern" data-final-asset={assets.originWorkshop} aria-hidden="true"><span className="story-glow" /><span className="lantern-handle">⌒</span><span className="lantern-glass">✦</span><span className="lantern-foot" /></div>
          <div className="story-copy"><span className="eyebrow">02 · the first light</span><h3>So I made a light.</h3><p>Small enough to hold. Warm enough to make the dark feel kind.</p></div>
        </motion.article>
        <motion.article className="story-beat" initial={initial} whileInView={entrance} viewport={{ once: true, amount: .24 }} transition={{ duration: .65 }}>
          <div className="story-art story-art--sky" aria-hidden="true"><span className="story-glow" /><svg viewBox="0 0 400 240" fill="none" preserveAspectRatio="xMidYMid meet"><path d="M50 145 127 67 201 135 281 48 355 157 201 135 127 67" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 8"/><g fill="currentColor"><circle cx="50" cy="145" r="5"/><circle cx="127" cy="67" r="7"/><circle cx="201" cy="135" r="10"/><circle cx="281" cy="48" r="5"/><circle cx="355" cy="157" r="7"/></g></svg><span className="story-light">✦</span></div>
          <div className="story-copy"><span className="eyebrow">03 · the nursery</span><h3>Then the sky joined in.</h3><p>Now I help the Midnight Nursery find its way into dreams, one star at a time.</p></div>
        </motion.article>
      </div>
    </section>
  )
}

export function Goodnight({ children }: { children: ReactNode }) {
  return (
    <section id="goodnight" className="goodnight-scene" aria-labelledby="goodnight-title">
      <div className="goodnight-stars" aria-hidden="true">✧ &nbsp; · &nbsp; ✦ &nbsp; · &nbsp; ✧</div>
      <span className="eyebrow">04 / lights out</span>
      <h2 id="goodnight-title">Goodnight, little dreamer.</h2>
      <p>My eyes are getting sleepy. That’s all from my workshop tonight. I’ll leave a light on for you. <span aria-hidden="true">☾</span></p>
      {children}
    </section>
  )
}
