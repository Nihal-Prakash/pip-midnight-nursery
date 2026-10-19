import { useEffect, useRef } from 'react'

export function Cursor({ enabled }: { enabled: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const media = matchMedia('(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)')
    const el = root.current
    if (!el || !enabled) return
    let stop = () => {}
    function setup() {
      stop()
      if (!media.matches || !el) return
      const dots = [...el.querySelectorAll<HTMLElement>('i')]
      let frame = 0
      let last = 0
      let index = 0
      let x = -100, y = -100
      const ages = dots.map(() => 0)
      function draw(now: number) {
        el!.style.setProperty('--pointer-x', `${x}px`)
        el!.style.setProperty('--pointer-y', `${y}px`)
        if (now - last < 320) {
          dots.forEach((dot, i) => { dot.style.opacity = String(Math.max(0, 1 - (now - ages[i]) / 320)) })
          frame = requestAnimationFrame(draw)
        } else { frame = 0; dots.forEach(dot => { dot.style.opacity = '0' }) }
      }
      function move(event: PointerEvent) {
        if (event.pointerType === 'touch') return
        x = event.clientX; y = event.clientY
        const target = event.target instanceof Element ? event.target : null
        el!.dataset.mode = target?.closest('[data-secret]') ? 'secret' : target?.closest('[data-drag]') ? 'drag' : target?.closest('button,a,input,textarea,summary,[role="button"]') ? 'active' : 'normal'
        el!.style.opacity = '1'
        const now = performance.now()
        if (now - last > 22) {
          const dot = dots[index]
          dot.style.transform = `translate3d(${x}px,${y}px,0)`
          ages[index] = now; index = (index + 1) % dots.length; last = now
        }
        if (!frame) frame = requestAnimationFrame(draw)
      }
      function leave() { el!.style.opacity = '0' }
      window.addEventListener('pointermove', move, { passive: true })
      document.documentElement.addEventListener('pointerleave', leave)
      window.addEventListener('blur', leave)
      stop = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('pointermove', move)
        document.documentElement.removeEventListener('pointerleave', leave)
        window.removeEventListener('blur', leave)
        el.style.opacity = '0'
      }
    }
    setup(); media.addEventListener('change', setup)
    return () => { stop(); media.removeEventListener('change', setup) }
  }, [enabled])
  // Keep the native pointer: decorative enhancement can never strand the user.
  return <div className="dx-cursor" ref={root} aria-hidden="true"><span>✦</span>{Array.from({ length: 8 }, (_, i) => <i key={i}>✧</i>)}</div>
}
