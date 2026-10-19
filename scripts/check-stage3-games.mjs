import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

assert.ok(existsSync(new URL('../src/components/interactive/DreamGames.tsx', import.meta.url)), 'Stage 3 game components must exist')
const fixture = `
import React from 'react'; import { createRoot } from 'react-dom/client'; import { flushSync } from 'react-dom';
import * as games from '/src/components/interactive/DreamGames.tsx'; import '/src/os/dream.css';
const root = createRoot(document.getElementById('fixture'));
window.stats = { repairs: 0, stops: 0, scores: [] };
window.mountGame = (name, props = {}) => flushSync(() => root.render(React.createElement(games[name], { initialMelody: 'rain', initialDestination: 'moon', muted: true, reduced: false, ...props, onComplete: () => window.stats.repairs++, stopSounds: () => window.stats.stops++, playMelody: notes => window.stats.scores.push(notes) })));
window.clearGame = () => flushSync(() => root.render(null));
window.resetStats = () => { window.stats = { repairs: 0, stops: 0, scores: [] }; };
`
const server = await createServer({ server: { host: '127.0.0.1', port: 0 }, plugins: [{
  name: 'stage3-game-check-fixture',
  resolveId(id) { if (id === '/__game-check.js') return '\0stage3-game-check' },
  load(id) { if (id === '\0stage3-game-check') return fixture },
  configureServer(vite) { vite.middlewares.use(async (req, res, next) => {
    if (req.url !== '/__game-check') return next()
    res.setHeader('Content-Type', 'text/html')
    res.end(await vite.transformIndexHtml('/__game-check', '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><main class="dream-os" style="padding:24px;min-height:100vh"><div id="fixture"></div></main><script type="module" src="/__game-check.js"></script></body></html>'))
  }) },
}] })
let browser
try {
  await server.listen()
  const { LullabyGame, NightlightGame, CourierGame } = await server.ssrLoadModule('/src/components/interactive/DreamGames.tsx')
  let repairs = 0
  const html = renderToStaticMarkup(createElement(LullabyGame, { initialMelody: 'rain', muted: true, reduced: true, playMelody() {}, stopSounds() {}, onComplete() { repairs++ } }))
  assert.match(html, /Raindrop Reverie/)
  assert.match(html, /Wind the key/)
  assert.match(html, /disabled=""[^>]*>Play score/)
  assert.equal(repairs, 0, 'Opening a station must not repair a dream')
  console.log('PASS Lullaby tracer: selected melody, winding gate, no preview repair')
  assert.equal(typeof NightlightGame, 'function', 'Nightlight must be a playable exported component')
  const night = renderToStaticMarkup(createElement(NightlightGame, { reduced: true, onComplete() { repairs++ } }))
  assert.equal((night.match(/class="dx-game-hidden-star"/g) ?? []).length, 3)
  assert.equal((night.match(/disabled=""/g) ?? []).length, 3, 'All hidden stars start unavailable outside the lamp')
  assert.equal(repairs, 0)
  console.log('PASS Nightlight tracer: three hidden targets, no opening repair')
  assert.equal(typeof CourierGame, 'function', 'Courier must be a playable exported component')
  const courier = renderToStaticMarkup(createElement(CourierGame, { initialDestination: 'moon', reduced: false, onComplete() { repairs++ } }))
  assert.match(courier, /Moon House/)
  assert.match(courier, /Pocket-lantern dream/)
  assert.match(courier, /disabled=""[^>]*>Send dream/)
  assert.equal(repairs, 0)
  console.log('PASS Courier tracer: destination handoff, parcel decision, no preview repair')
  if (process.argv.includes('--browser')) {
    const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
    browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) })
    const errors = []
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
    const url = `http://127.0.0.1:${server.httpServer.address().port}/__game-check`
    await page.goto(url)
    await page.waitForFunction(() => !!window.mountGame)
    await page.clock.install()
    const button = name => page.getByRole('button', { name, exact: true })
    const mount = async (name, props = {}) => page.evaluate(({ name, props }) => { window.clearGame(); window.resetStats(); window.mountGame(name, props) }, { name, props })
    const advance = async ms => { await page.clock.runFor(ms); await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve))) }
    const repairs = () => page.evaluate(() => window.stats.repairs)
    const wind = async () => { for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /Wind the key/ }).click() }
    const shot = async name => { if (process.env.GAME_SHOTS) await page.screenshot({ path: `${process.env.GAME_SHOTS}/${name}.png`, fullPage: true }) }
    await mount('LullabyGame')
    assert.ok(await button('Play score').isDisabled())
    await wind(); await button('Play score').click()
    assert.equal(await repairs(), 0)
    assert.deepEqual(await page.evaluate(() => window.stats.scores[0]), Array(4).fill([440, 392, 330, 294]).flat())
    await button('Stop').click(); await advance(5000); assert.equal(await repairs(), 0)
    await button('Play score').click(); await button('Cloud Nine').click(); await advance(5000)
    assert.equal(await repairs(), 0); assert.ok(await button('Play score').isDisabled())
    await wind(); await button('Play score').click(); await advance(1000)
    assert.equal(await repairs(), 0, 'A partial score cannot repair the dream')
    await page.evaluate(() => window.mountGame('LullabyGame', { muted: false })) // callbacks deliberately change identity
    await advance(4000); assert.equal(await repairs(), 1)
    await advance(5000); assert.equal(await repairs(), 1)
    await shot('lullaby-desktop')
    await button('Rewind & replay').click(); await wind(); await button('Play score').click()
    const stops = await page.evaluate(() => window.stats.stops)
    await page.evaluate(() => window.clearGame()); await advance(5000)
    assert.equal(await repairs(), 1); assert.ok(await page.evaluate(() => window.stats.stops) > stops)
    console.log('PASS browser Lullaby: winding, finite score, shared notes, Stop, selection cancellation, callback changes, replay/unmount cleanup')

    await mount('NightlightGame')
    assert.equal(await page.locator('.dx-game-hidden-star:enabled').count(), 0)
    const room = page.getByRole('group', { name: 'Lantern search room' })
    await room.focus(); for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowUp')
    assert.ok(await button('Gather Moon star').isEnabled())
    await page.keyboard.press('Enter'); await page.keyboard.press('Enter'); assert.equal(await repairs(), 0)
    assert.equal(await page.getByRole('progressbar').getAttribute('value'), '1')
    for (const [name, x, y] of [['Shelf star', .2, .34], ['Bedside star', .78, .70]]) {
      const rect = await room.boundingBox(); await page.mouse.move(rect.x + rect.width * x, rect.y + rect.height * y); await advance(40)
      await button(`Gather ${name}`).click()
    }
    assert.equal(await repairs(), 1); assert.equal(await page.getByRole('progressbar').getAttribute('value'), '3')
    await shot('nightlight-desktop')
    await button('Hide the stars & replay').click(); assert.equal(await page.getByRole('progressbar').getAttribute('value'), '0')
    await page.setViewportSize({ width: 390, height: 844 })
    const rect = await room.boundingBox(); await page.mouse.move(rect.x + rect.width * .2, rect.y + rect.height * .34); await advance(40)
    assert.ok(await button('Gather Shelf star').isEnabled())
    assert.deepEqual(await page.locator('.dx-game-room img').evaluateAll(images => images.map(image => [image.src, image.getBoundingClientRect().width, image.getBoundingClientRect().height])), await page.locator('.dx-game-room img').evaluateAll(images => images.map(() => [images[0].src, images[0].getBoundingClientRect().width, images[0].getBoundingClientRect().height])))
    await shot('nightlight-mobile-search')
    console.log('PASS browser Nightlight: keyboard, pointer, hidden targets, deduplication, reward/replay, resized aligned art')

    await page.setViewportSize({ width: 1440, height: 900 }); await mount('CourierGame')
    await button('Cloud-sheep dream').click(); await button('Send dream').click(); await advance(2000)
    assert.match(await page.locator('.dx-game-status').textContent(), /Nothing sent/)
    assert.equal(await repairs(), 0)
    await button('Pocket-lantern dream').click(); await button('Send dream').click()
    await button('Visit Cloud Cottage').click(); await advance(2500)
    assert.equal(await page.getByRole('progressbar').getAttribute('value'), '0')
    await button('Cloud-sheep dream').click(); await button('Send dream').click(); await button('Recall parcel').click(); await advance(2500)
    assert.equal(await page.getByRole('progressbar').getAttribute('value'), '0')
    for (const [i, [house, parcel]] of [['Cloud Cottage', 'Cloud-sheep dream'], ['Moon House', 'Pocket-lantern dream'], ['Starry Nook', 'Friendly-letter dream']].entries()) {
      await button(`Visit ${house}`).click(); await button(parcel).click(); await button('Send dream').click()
      assert.equal(await repairs(), 0)
      if (i === 0) { await shot('courier-in-flight'); await page.evaluate(() => window.mountGame('CourierGame')) }
      await advance(2000); assert.equal(await page.getByRole('progressbar').getAttribute('value'), String(i + 1))
    }
    assert.equal(await repairs(), 1); assert.ok(await button('Send dream').isDisabled())
    await shot('courier-desktop')
    await button('Replay deliveries').click(); await button('Friendly-letter dream').click(); await button('Send dream').click()
    await page.evaluate(() => window.clearGame()); await advance(2500); assert.equal(await repairs(), 1)
    console.log('PASS browser Courier: clue/parcel matching, recall, rapid address cancellation, all three receipts, callback changes, replay/unmount')

    const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' })
    const mobile = await touch.newPage(); mobile.on('pageerror', error => errors.push(error.message))
    await mobile.goto(url); await mobile.waitForFunction(() => !!window.mountGame)
    await mobile.evaluate(() => window.mountGame('NightlightGame', { reduced: true }))
    const touchRoom = mobile.locator('.dx-game-room'); await touchRoom.scrollIntoViewIfNeeded()
    const bounds = await touchRoom.boundingBox()
    await mobile.evaluate(() => { window.touchLog = []; for (const type of ['pointerdown', 'pointerup', 'click']) document.addEventListener(type, event => window.touchLog.push([type, event.target.className, event.target.disabled, event.clientX, event.clientY]), true) })
    const cdp = await touch.newCDPSession(mobile)
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: bounds.x + bounds.width * .5, y: bounds.y + bounds.height * .5 }] })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: bounds.x + bounds.width * .2, y: bounds.y + bounds.height * .34 }] })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await mobile.getByRole('button', { name: 'Gather Shelf star' }).tap()
    await mobile.waitForTimeout(450)
    console.log('TOUCH PROBE', await mobile.evaluate(() => ({ events: window.touchLog, room: document.querySelector('.dx-game-room').style.cssText, status: document.querySelector('.dx-game-status').textContent, found: document.querySelector('progress').value })))
    assert.equal(await mobile.getByRole('progressbar').getAttribute('value'), '1')
    for (const name of ['LullabyGame', 'CourierGame']) {
      await mobile.evaluate(name => { window.clearGame(); window.mountGame(name, { reduced: true }) }, name)
      assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} must fit mobile`)
      if (name === 'CourierGame') {
        await mobile.getByRole('button', { name: 'Pocket-lantern dream', exact: true }).tap()
        await mobile.getByRole('button', { name: 'Send dream', exact: true }).tap()
        assert.equal(await mobile.locator('animateMotion').count(), 0)
        await mobile.waitForTimeout(350)
        assert.equal(await mobile.getByRole('progressbar').getAttribute('value'), '1')
      }
      if (process.env.GAME_SHOTS) await mobile.screenshot({ path: `${process.env.GAME_SHOTS}/${name}-mobile.png`, fullPage: true })
    }
    assert.deepEqual(errors, [])
    console.log('PASS browser mobile: real CDP touch drag/capture + tap, reduced-motion delivery, no horizontal overflow or failed requests')
    await touch.close(); await context.close()
  } else console.log('Browser checks: PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/check-stage3-games.mjs --browser')
} finally { await browser?.close(); await server.close() }
