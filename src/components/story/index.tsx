import type { ReactNode } from 'react'

export function OriginStory() {
  return (
    <section id="origin" className="origin-story" aria-labelledby="origin-title">
      <div className="section-heading">
        <span className="eyebrow">02 / a little backstory</span>
        <h2 id="origin-title">Every dream starts somewhere.</h2>
        <p>Scroll through the stars with me.</p>
      </div>
      <div className="origin-beats">
        <article className="story-beat">
          <div className="story-art story-art--star" aria-hidden="true"><span>✦</span></div>
          <div className="story-copy"><span className="eyebrow">01 · the first star</span><h3>It was a little too dark.</h3><p>One night, I found a star that had forgotten how to shine.</p></div>
        </article>
        <article className="story-beat">
          <div className="story-art story-art--lantern" aria-hidden="true"><span>✧</span><span className="lantern-handle">⌒</span></div>
          <div className="story-copy"><span className="eyebrow">02 · the first light</span><h3>So I made a light.</h3><p>Small enough to hold. Warm enough to make the dark feel kind.</p></div>
        </article>
        <article className="story-beat">
          <div className="story-art story-art--sky" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span><span>✧</span><span>✦</span></div>
          <div className="story-copy"><span className="eyebrow">03 · the nursery</span><h3>Then the sky joined in.</h3><p>Now I help the Midnight Nursery find its way into dreams, one star at a time.</p></div>
        </article>
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
