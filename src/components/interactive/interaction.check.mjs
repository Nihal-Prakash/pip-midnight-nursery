import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { PipCharacter } = await vite.ssrLoadModule('./src/components/interactive/PipCharacter.tsx')
  const { NightlightLab } = await vite.ssrLoadModule('./src/components/interactive/NightlightLab.tsx')
  const pip = renderToStaticMarkup(createElement(PipCharacter, { mood: 'night', interactive: false }))
  const room = renderToStaticMarkup(createElement(NightlightLab, { muted: true }))
  assert.match(pip, /pip-character--night/)
  assert.doesNotMatch(pip, /<button/)
  assert.match(room, /aria-pressed="false"/)
  assert.match(room, /Turn on nightlight/)
  console.log('Interaction markup checks passed')
} finally {
  await vite.close()
}
