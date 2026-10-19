import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const out = 'docs/evidence/dream-stage3'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader'] })
const results = [], errors = []
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(process.env.DREAM_URL || 'http://127.0.0.1:4175')
  await page.getByRole('button', { name: 'Skip intro' }).click()
  await page.getByRole('button', { name: 'Open Terminal', exact: true }).click()
  await page.getByRole('textbox').fill('nursery')
  await page.getByRole('textbox').press('Enter')
  const room = page.getByRole('region', { name: 'Nursery experience' })
  await room.getByRole('button', { name: 'Say hello to nursery Pip' }).waitFor({ timeout: 3000 })
  await room.getByRole('button', { name: 'Skip animation', exact: true }).click()
  await room.getByRole('button', { name: 'Say hello to nursery Pip' }).click()
  assert.match(await room.locator('.dx-pip-dialogue').textContent(), /tiny|lantern|dream/i)
  await page.screenshot({ path: `${out}/desktop-world.png` })
  results.push('Nursery world and interactive Pip')
  assert.deepEqual(errors, [])
  await writeFile(`${out}/browser-report.json`, JSON.stringify({ results, errors }, null, 2))
} finally { await browser.close() }
console.log(results)
