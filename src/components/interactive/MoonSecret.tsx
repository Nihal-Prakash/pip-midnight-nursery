import { useRef, useState } from 'react'
import './MoonSecret.css'

export interface MoonSecretProps {
  onDiscover: () => void
}

export function MoonSecret({ onDiscover }: MoonSecretProps) {
  const wishes = useRef(0)
  const [count, setCount] = useState(0)

  function wish() {
    if (wishes.current >= 3) return
    wishes.current++
    setCount(wishes.current)
    if (wishes.current === 3) onDiscover()
  }

  return (
    <section className="moon-secret" aria-label="A secret in the moon">
      <button className="moon-secret__moon" type="button" onClick={wish}
        aria-label={count === 3 ? 'The secret moon dream is open' : 'Make a wish on the moon'}
        aria-disabled={count === 3}>
        <span className="moon-secret__disc" aria-hidden="true" />
        <span className="moon-secret__spark" aria-hidden="true">✦</span>
      </button>
      <p className="moon-secret__hint">The moon remembers three little wishes.</p>
      <p className="moon-secret__status" role="status">{count === 3 ? 'A secret dream, just for you ✦' : count > 0 ? `${3 - count} ${count === 2 ? 'wish' : 'wishes'} to go…` : 'Try tapping the moon.'}</p>
      {count === 3 && <div className="moon-secret__dream" role="img" aria-label="A soft secret dream among the stars">✦ &nbsp; ☾ &nbsp; ✦</div>}
    </section>
  )
}
