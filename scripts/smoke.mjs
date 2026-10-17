import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
  const html = renderToStaticMarkup(createElement(App))
  for (const id of ['welcome', 'origin', 'workshop', 'goodnight']) {
    assert.match(html, new RegExp(`id="${id}"`))
  }
  for (const title of ['Lullaby Lab', 'Nightlight Collection', 'Dream Delivery']) {
    assert.ok(html.includes(title), `${title} launcher missing`)
  }
  assert.match(html, /aria-label="Enable sound"/)
  assert.match(html, /aria-label="Look behind the moon"/)
  console.log('PipOS shell smoke passed')
} finally {
  await vite.close()
}
