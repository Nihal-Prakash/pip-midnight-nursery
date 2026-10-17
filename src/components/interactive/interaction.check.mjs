import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { PipCharacter } = await vite.ssrLoadModule('./src/components/interactive/PipCharacter.tsx')
  const { NightlightLab } = await vite.ssrLoadModule('./src/components/interactive/NightlightLab.tsx')
  const { LullabyLab } = await vite.ssrLoadModule('./src/components/interactive/LullabyLab.tsx')
  const { DreamDelivery } = await vite.ssrLoadModule('./src/components/interactive/DreamDelivery.tsx')
  const { MoonSecret } = await vite.ssrLoadModule('./src/components/interactive/MoonSecret.tsx')
  const { AudioToggle } = await vite.ssrLoadModule('./src/components/interactive/AudioToggle.tsx')
  const pip = renderToStaticMarkup(createElement(PipCharacter, { mood: 'night', interactive: false }))
  const room = renderToStaticMarkup(createElement(NightlightLab, { muted: true }))
  assert.match(pip, /pip-character--night/)
  assert.doesNotMatch(pip, /<button/)
  assert.match(room, /aria-pressed="false"/)
  assert.match(room, /Turn on nightlight/)
  assert.match(room, /Reveal whole room/)
  assert.equal((renderToStaticMarkup(createElement(LullabyLab, { muted: true })).match(/type="radio"/g) || []).length, 3)
  assert.equal((renderToStaticMarkup(createElement(DreamDelivery, { muted: true })).match(/aria-pressed="false"/g) || []).length, 3)
  assert.match(renderToStaticMarkup(createElement(MoonSecret, { onDiscover() {} })), /moon remembers three little wishes/)
  assert.match(renderToStaticMarkup(createElement(AudioToggle, { muted: true, onToggle() {} })), /Unmute sound/)
  console.log('Interaction markup checks passed')
} finally {
  await vite.close()
}
