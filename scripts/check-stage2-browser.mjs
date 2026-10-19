import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.DREAM_URL || 'http://127.0.0.1:4174'
const out = resolve('docs/evidence/dream-stage2')
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
const rows = [], errors = [], requests = []
const apps = [['dreams','My Dreams'], ['about','About Pip'], ['diary','Dream Diary'], ['lullaby','Lullaby Lab'], ['nightlight','Nightlight.exe'], ['courier','Dream Courier'], ['telescope','Telescope'], ['cabinet','Toy Cabinet'], ['gallery','Dream Gallery'], ['terminal','Terminal'], ['sweet','sweetdreams.exe'], ['lost','Lost Dreams']]
function pass(control, expected, actual, back, mode) { rows.push({ control, expected, actual, back, mode, status: 'PASS' }); console.log(`PASS ${mode}: ${control}`) }
function monitor(page) {
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('response', r => { if (r.status() >= 400) requests.push(`${r.status()} ${r.url()}`) })
  page.on('requestfailed', r => { if (!r.failure()?.errorText.includes('ERR_ABORTED')) requests.push(`${r.url()} ${r.failure()?.errorText}`) })
}
async function ready(page) { await page.locator('.dx-desktop').waitFor(); await page.waitForTimeout(700) }
async function shot(page, name) {
  await page.waitForFunction(() => [...document.images].filter(i => i.getBoundingClientRect().width).every(i => i.complete && i.naturalWidth > 0))
  await page.mouse.move(2, 2); await page.waitForTimeout(220)
  await page.screenshot({ path: `${out}/${name}.png` })
}
async function saved(page) { return page.evaluate(() => {
  const p = JSON.parse(localStorage.getItem('dream-exe:progress'))
  // Progress is a set of IDs; the storage validator may canonicalize their order.
  for (const key of ['repaired', 'fragments', 'activities', 'secrets']) p[key].sort()
  return p
}) }
async function exercise(width, touch = false) {
  const mode = touch ? `touch-${width}` : 'desktop'
  const ctx = await browser.newContext({ viewport: { width, height: touch ? 844 : 900 }, hasTouch: touch, isMobile: touch })
  await ctx.addInitScript(() => {
    window.__audio = []; window.__gains = []; window.__notes = []
    const Native = window.AudioContext
    if (Native) window.AudioContext = class extends Native {
      constructor(...args) { super(...args); window.__audio.push(this) }
      createGain() { const gain = super.createGain(); window.__gains.push(gain); return gain }
      createOscillator() { const osc = super.createOscillator(); window.__notes.push(osc); return osc }
    }
  })
  const p = await ctx.newPage(); monitor(p); await p.goto(base)
  await p.getByRole('button', { name: 'ENTER DREAM.EXE' }).waitFor()
  assert.equal(await p.locator('progress').getAttribute('value'), '100')
  await p.getByRole('button', { name: 'ENTER DREAM.EXE' }).click(); await ready(p)
  assert.deepEqual((await saved(p)).repaired, []); assert.equal(await p.evaluate(() => window.__audio.length), 0)
  await shot(p, `${mode}-desktop`)
  const click = async locator => touch ? locator.tap() : locator.click()
  const button = (root, name) => root.getByRole('button', { name, exact: true })
  async function open(id) { const label = apps.find(a => a[0] === id)[1]; await click(button(p, `Open ${label}`)); const w = p.locator(`#window-${id}`); await w.waitFor(); return w }
  async function close(id) { const label = apps.find(a => a[0] === id)[1]; await click(button(p.locator(`#window-${id}`), `Close ${label}`)); await p.locator(`#window-${id}`).waitFor({ state: 'detached' }) }
  async function screenshot(id) { await p.locator(`#window-${id} .dx-window-content`).evaluate(el => { el.scrollTop = 0 }); await shot(p, `${mode}-${id}`) }
  let w = await open('dreams')
  if (!touch) {
    await p.waitForTimeout(220)
    const title = w.locator('.dx-titlebar'), original = await w.boundingBox(), box = await title.boundingBox()
    await p.mouse.move(box.x + 120, box.y + 20); await p.mouse.down(); await p.mouse.move(box.x + 200, box.y + 50, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(100)
    assert.ok((await w.boundingBox()).x > original.x + 60)
    await title.focus(); const moved = await w.boundingBox(); await title.press('Shift+ArrowRight'); await p.waitForTimeout(100); assert.equal((await w.boundingBox()).width, moved.width + 20)
    const normal = await w.boundingBox(); await click(button(w, 'Maximize My Dreams')); await p.waitForTimeout(100); assert.ok((await w.boundingBox()).width > 1400)
    await click(button(w, 'Restore My Dreams')); await p.waitForTimeout(100); assert.deepEqual(await w.boundingBox(), normal)
    await click(button(p, 'Return Home')); await click(button(p, 'Restore My Dreams')); await close('dreams')
    await button(p, 'Open My Dreams').hover(); await p.waitForTimeout(50); assert.equal(await p.locator('.dx-cursor').getAttribute('data-mode'), 'active'); assert.equal(await p.locator('.dx-cursor i').count(), 8)
    w = await open('dreams')
    pass('Stage 1 shell regression', 'Preserve drag, keyboard resize, maximize/restore, home and cursor', 'Real pointer drag and geometry restoration passed; eight-particle active cursor remains', 'Home minimizes and restores without reconstruction', mode)
  }
  assert.equal(await w.getByRole('progressbar').getAttribute('value'), '0')
  for (const [id, name] of [['lullaby','Lullaby Lab'], ['nightlight','Nightlight.exe'], ['courier','Dream Courier']]) {
    await click(w.getByRole('button', { name: new RegExp(`Visit ${name.replace('.', '\\.')}`) })); await p.locator(`#window-${id}`).waitFor(); await close(id)
    assert.equal(await w.getAttribute('data-focused'), 'true')
  }
  await screenshot('dreams'); await close('dreams')
  pass('My Dreams invention links', 'Three distinct app destinations and real zero state', 'Each opened its own app; 0 repairs', 'Closing restores My Dreams', mode)
  w = await open('about'); assert.match(await w.textContent(), /Curious, kind, sleepy and imaginative/); assert.match(await w.textContent(), /Qualifications/)
  await screenshot('about'); await click(w.getByRole('button', { name: /Read my dream diary/ })); await close('diary'); await close('about')
  pass('About Pip', 'Canonical résumé, artwork, diary link', 'Character, origin, qualifications and diary destination present', 'Diary closes back to résumé; résumé closes to desktop', mode)
  w = await open('diary'); const titles = []
  for (let i = 0; i < 4; i++) { titles.push(await w.locator('h2').textContent()); assert.match(await w.locator('.dx-page-nav').textContent(), new RegExp(`Page ${i + 1} / 4`)); if (i < 3) await click(w.getByRole('button', { name: /Next page/ })) }
  assert.equal(new Set(titles).size, 4); assert.ok(await w.getByRole('button', { name: /Next page/ }).isDisabled())
  await click(w.getByRole('button', { name: /Previous page/ })); assert.equal(await w.locator('h2').textContent(), titles[2]); await click(w.getByRole('button', { name: /Next page/ }))
  await click(w.getByRole('button', { name: /Help find/ })); await close('dreams')
  await w.getByText('Leave a note for Pip', { exact: true }).click(); await w.getByLabel('Leave a little note for the night shift').fill('A browser-tested goodnight.')
  await screenshot('diary'); await close('diary'); assert.ok((await saved(p)).activities.includes('diary'))
  pass('Dream Diary', 'Four pages, animated changes, previous/next boundaries and help link', 'Four unique titles, page counts, disabled end, note written, activity earned', 'Help opens My Dreams; close returns to diary', mode)
  w = await open('lullaby')
  await click(w.getByRole('button', { name: /Raindrop Reverie/ })); await click(w.getByRole('button', { name: /Preview melody/ })); assert.match(await w.locator('.dx-feedback').textContent(), /Silent score: Raindrop/)
  await click(button(w, 'Sound off')); await click(w.getByRole('button', { name: /Preview melody/ })); await p.waitForTimeout(150)
  assert.equal(await p.evaluate(() => window.__audio.length), 1)
  assert.equal(await p.evaluate(() => window.__notes.some(n => n.frequency.value === 440)), true)
  await click(button(w, 'Sound on')); await p.waitForFunction(() => window.__gains[0].gain.value === 0)
  await screenshot('lullaby'); await click(w.getByRole('button', { name: /Enter Lullaby experience/ }))
  assert.equal(await p.locator('.dx-nursery').getAttribute('data-experience'), 'lullaby'); assert.match(await p.locator('.dx-nursery').textContent(), /Raindrop Reverie/)
  assert.equal(await p.locator('.dx-desktop').getAttribute('inert'), '')
  await shot(p, `${mode}-lullaby-handoff`); await click(button(p, '← Return to computer'))
  await p.waitForFunction(() => document.activeElement.textContent.includes('Enter Lullaby experience'))
  assert.equal(await w.getAttribute('data-focused'), 'true'); assert.equal(await w.getByRole('button', { name: /Raindrop Reverie/ }).getAttribute('aria-pressed'), 'true'); await close('lullaby')
  pass('Lullaby Lab', 'Melody selection, audio preview, exact handoff', 'Raindrop notes created on single AudioContext; master mute zero; melody retained in station', 'Return restores Lullaby selection/window', mode)
  w = await open('nightlight'); await click(button(w, 'Turn light on')); assert.equal(await w.locator('.dx-nightlight').getAttribute('data-lit'), 'true')
  await click(button(w, 'Turn light off')); assert.equal(await w.locator('.dx-nightlight').getAttribute('data-lit'), 'false'); await click(button(w, 'Turn light on'))
  await screenshot('nightlight'); await click(w.getByRole('button', { name: /Enter Nightlight/ })); assert.equal(await p.locator('.dx-nursery').getAttribute('data-experience'), 'nightlight')
  await shot(p, `${mode}-nightlight-handoff`); await p.keyboard.press('Escape'); await w.waitFor(); assert.equal(await w.locator('.dx-nightlight').getAttribute('data-lit'), 'true'); await close('nightlight')
  pass('Nightlight.exe', 'Light on/off and explicit Nightlight entry', 'Light state/visual changed; arrived at Nightlight star room, not Lullaby', 'Escape restores original light preview', mode)
  w = await open('courier')
  for (const [id, name] of [['cloud','Cloud Cottage'], ['moon','Moon House'], ['starry','Starry Nook']]) {
    await click(w.getByRole('button', { name: new RegExp(`^.*${name}.*SELECT`) })); await click(w.getByRole('button', { name: new RegExp(`Begin delivery to ${name}`) }))
    assert.equal(await p.locator('.dx-nursery').getAttribute('data-experience'), 'courier'); assert.match(await p.locator('.dx-address-tag').textContent(), new RegExp(id.toUpperCase()))
    await click(button(p, '← Return to computer')); assert.equal(await w.getByRole('button', { name: new RegExp(`^.*${name}.*SELECT`) }).getAttribute('aria-pressed'), 'true')
  }
  await screenshot('courier'); await close('courier')
  pass('Dream Courier: all three addresses', 'Pass selected address into courier station', 'Cloud Cottage, Moon House and Starry Nook arrived with exact destination IDs', 'Each return retains selected address', mode)
  w = await open('telescope'); await click(button(w, 'Star 3')); assert.match(await w.locator('.dx-feedback').textContent(), /Not that star yet/)
  assert.equal(await w.locator('.dx-star-field [aria-pressed="true"]').count(), 0)
  for (let n = 1; n <= 5; n++) await (touch ? button(w, `Star ${n}`).tap() : button(w, `Star ${n}`).press('Enter'))
  assert.equal(await w.locator('.dx-star-field [aria-pressed="true"]').count(), 5); assert.match(await w.locator('.dx-feedback').textContent(), /starlight/)
  await screenshot('telescope'); await click(w.getByRole('button', { name: /Replay \/ reset/ })); assert.equal(await w.locator('.dx-star-field [aria-pressed="true"]').count(), 0)
  for (let n = 1; n <= 5; n++) await click(button(w, `Star ${n}`))
  assert.equal((await saved(p)).activities.filter(x => x === 'telescope').length, 1); await close('telescope'); w = await open('telescope'); assert.equal(await w.locator('.dx-star-field [aria-pressed="true"]').count(), 5); await close('telescope')
  pass('Telescope puzzle', 'Correct/incorrect feedback, five connected stars, clue, replay', 'Keyboard/tap completes; wrong star keeps thread; five stars awarded once; reopen complete', 'Replay keeps earned progress; close returns desktop', mode)
  w = await open('cabinet'); const toySources = [], reactions = []
  for (const [name, action] of [['Pocket Moon','Wake the moon'], ['Clockwork Cricket','Wind the cricket'], ['Postbird','Ask for a delivery']]) {
    await click(button(w, name)); toySources.push(await w.locator('.dx-toy-inspection > img').getAttribute('src')); await click(w.getByRole('button', { name: /Rotate toy/ })); assert.match(await w.locator('.dx-toy-inspection > img').getAttribute('style'), /30deg/)
    await click(button(w, action)); reactions.push(await w.locator('.dx-feedback').textContent())
  }
  assert.equal(new Set(toySources).size, 3); assert.equal(new Set(reactions).size, 3); await screenshot('cabinet'); await close('cabinet')
  assert.ok((await saved(p)).activities.includes('cabinet'))
  pass('Toy Cabinet', 'Three unique inspectable toys, rotation and reactions', 'Three distinct image URLs/reactions; all rotated; activity earned', 'Each selection stays inside cabinet; close returns desktop', mode)
  w = await open('gallery'); assert.equal(await w.locator('.dx-gallery-grid button').count(), 6)
  const records = [], pictures = [], treatments = []
  for (let i = 0; i < 6; i++) {
    await click(w.locator('.dx-gallery-grid button').nth(i)); records.push(await w.locator('h2').textContent()); pictures.push(await w.locator('.dx-scene-art').getAttribute('src')); treatments.push(await w.locator('.dx-gallery-detail').getAttribute('data-tint'))
    assert.ok((await w.locator('.dx-gallery-detail > p').textContent()).length > 60)
    await click(w.getByRole('button', { name: /Next dream/ })); await click(w.getByRole('button', { name: /Previous dream/ })); assert.equal(await w.locator('h2').textContent(), records[i])
    if (i === 3) await shot(p, `${mode}-gallery-detail`)
    await click(w.getByRole('button', { name: /All dreams/ }))
  }
  assert.equal(new Set(records).size, 6); assert.equal(new Set(pictures).size, 6); assert.equal(new Set(treatments).size, 6)
  await screenshot('gallery'); await close('gallery'); assert.ok((await saved(p)).activities.includes('gallery'))
  pass('Dream Gallery: six records', 'Individual artwork/story/treatment, next/previous and grid back', 'Six distinct titles/images/tints; next then previous restores correct record', 'All dreams restores grid; close returns desktop', mode)
  w = await open('terminal')
  async function command(text) { await w.getByLabel('PIP:~>').fill(text); await w.getByLabel('PIP:~>').press('Enter') }
  await command('help'); assert.match(await w.locator('pre').textContent(), /sweetdreams.exe.*reboot/)
  await command('pip'); assert.match(await w.locator('pre').textContent(), /Junior Dream Engineer/)
  for (const [text, id] of [['about','about'], ['dreams','dreams'], ['diary','diary'], ['gallery','gallery'], ['telescope','telescope'], ['cabinet','cabinet'], ['sweetdreams.exe','sweet']]) {
    await command(text); await p.locator(`#window-${id}`).waitFor(); await close(id); assert.equal(await w.getAttribute('data-focused'), 'true')
  }
  await command('nursery'); assert.equal(await p.locator('.dx-nursery').getAttribute('data-experience'), 'nursery')
  await click(button(p, 'Nightlight star room ✧')); assert.equal(await p.locator('.dx-nursery').getAttribute('data-experience'), 'nightlight'); await click(button(p, '← Nursery entrance')); await click(button(p, '← Return to computer'))
  await command('starlight'); await command('starlight'); assert.equal((await saved(p)).secrets.length, 1)
  await command('not-a-command'); assert.match(await w.locator('pre').textContent(), /Unknown command.*not-a-command/)
  await command('constructor'); assert.match(await w.locator('pre').textContent(), /Unknown command.*constructor/)
  await command('status'); assert.match(await w.locator('pre').textContent(), /0\/3 dreams repaired · 5 stars collected/)
  await w.getByLabel('PIP:~>').press('ArrowUp'); assert.equal(await w.getByLabel('PIP:~>').inputValue(), 'status'); await w.getByLabel('PIP:~>').press('ArrowUp'); assert.equal(await w.getByLabel('PIP:~>').inputValue(), 'constructor'); await w.getByLabel('PIP:~>').press('ArrowDown'); assert.equal(await w.getByLabel('PIP:~>').inputValue(), 'status'); await w.getByLabel('PIP:~>').press('ArrowDown'); assert.equal(await w.getByLabel('PIP:~>').inputValue(), '')
  await command('clear'); assert.equal(await w.locator('pre').textContent(), '')
  await command('status'); await screenshot('terminal'); await command('reboot'); await p.locator('.dx-boot').waitFor(); await click(p.getByRole('button', { name: /Skip intro/ })); await ready(p); w = p.locator('#window-terminal'); assert.match(await w.locator('pre').textContent(), /Your windows and saved progress are safe/); await close('terminal')
  pass('DreamShell: all commands + history', 'Distinct output, real app launches/status, secret, clear, reboot', 'Every requested command exercised; history up/down; unknown and prototype names safe; starlight idempotent', 'Launched apps/nursery restore terminal; reboot retains windows/transcript/progress', mode)
  w = await open('sweet'); assert.equal(await w.locator('.dx-secret').getAttribute('data-unlocked'), 'false'); assert.match(await w.textContent(), /Starlight note found/)
  await screenshot('sweet'); await click(w.getByRole('button', { name: /Enter the nursery/ })); await click(button(p, '← Return to computer')); await close('sweet')
  pass('sweetdreams.exe locked + alternate secret', 'Three-dream clue; alternate Easter egg without bypassing repair lock', 'File locked at zero repairs; starlight note persisted; nursery route works', 'Nursery returns to secret app; close returns desktop', mode)
  w = await open('lost'); for (const action of ['Warm the spark', 'Turn the key', 'Unfold the letter']) await click(button(w, action))
  assert.equal(await w.locator('[data-recovered="true"]').count(), 3); await screenshot('lost'); await close('lost'); w = await open('lost'); assert.equal(await w.locator('[data-recovered="true"]').count(), 3); await close('lost')
  pass('Lost Dreams', 'Recover three fragments independently; unique story and saved state', 'Three individual actions reveal stories; close/reopen remains recovered', 'Close returns desktop', mode)
  const before = await saved(p); assert.equal(before.activities.length, 5); assert.equal(before.repaired.length, 0)
  await p.reload(); await ready(p); assert.deepEqual(await saved(p), before)
  w = await open('lost'); assert.equal(await w.locator('[data-recovered="true"]').count(), 3); await close('lost')
  w = await open('diary'); await w.getByText('Leave a note for Pip', { exact: true }).click(); assert.equal(await w.getByLabel('Leave a little note for the night shift').inputValue(), 'A browser-tested goodnight.'); await close('diary')
  await click(button(p, 'Start')); await click(p.getByRole('button', { name: /Settings & credits/ })); w = p.locator('#window-settings')
  await click(button(w, 'Reduced animation')); assert.equal(await p.locator('.dream-os').getAttribute('data-reduced'), 'true')
  await click(button(w, 'Background effects')); assert.equal(await p.locator('.dream-os').getAttribute('data-effects'), 'false')
  await w.getByLabel('Quality preference').selectOption('low'); assert.equal(await p.locator('.dream-os').getAttribute('data-quality'), 'low')
  await click(button(w, 'Reset saved dream progress')); await click(button(w, 'Keep my progress')); assert.deepEqual(await saved(p), before)
  await shot(p, `${mode}-settings`)
  await click(button(w, 'Reset saved dream progress')); await click(button(w, 'Yes, reset progress')); assert.equal((await saved(p)).fragments.length, 0); assert.equal((await saved(p)).activities.length, 0)
  await p.reload(); await ready(p); assert.equal(await p.locator('.dream-os').getAttribute('data-quality'), 'low'); assert.equal(await p.locator('.dream-os').getAttribute('data-effects'), 'false'); assert.equal(await p.locator('.dream-os').getAttribute('data-reduced'), 'true'); assert.equal((await saved(p)).secrets.length, 0)
  w = await open('diary'); await w.getByText('Leave a note for Pip', { exact: true }).click(); assert.equal(await w.getByLabel('Leave a little note for the night shift').inputValue(), 'A browser-tested goodnight.'); await close('diary')
  pass('Persistence + Settings', 'Save earned activity/fragments/secret and preferences; confirmed reset', 'Reload kept all five activities and memories; cancel preserved; confirm reset progress only; preferences/note retained', 'Settings and apps remain usable without reboot/navigation resets', mode)
  assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  for (const [id, label] of apps) {
    w = await open(id); await p.waitForTimeout(200)
    assert.equal(await w.locator('.dx-window-content').evaluate(el => el.scrollWidth <= el.clientWidth), true, `${mode} ${id} content overflow`)
    await click(button(w, `Minimize ${label}`)); await click(button(p, `Restore ${label}`)); await close(id)
  }
  pass('All twelve window controls / layout', 'Minimize, restore, close; no horizontal overflow', 'Each app passed with native mouse or touch controls', 'Desktop restored with retained central progress', mode)
  await ctx.close()
}
let failure
try {
  await exercise(1440)
  await exercise(390, true)
  // Future Stage 3 completion is deliberately a fixture, never a Stage 2 repair button.
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await ctx.addInitScript(() => { localStorage.setItem('dream-exe:visited', 'true'); localStorage.setItem('dream-exe:progress', JSON.stringify({ version: 1, repaired: ['lullaby','nightlight','courier'], fragments: [], activities: [], secrets: [] })) })
  const p = await ctx.newPage(); monitor(p); await p.goto(base); await ready(p); await p.getByRole('button', { name: 'Open sweetdreams.exe', exact: true }).click()
  assert.equal(await p.locator('.dx-secret').getAttribute('data-unlocked'), 'true'); assert.match(await p.locator('#window-sweet').textContent(), /You were the fourth dream/); assert.ok((await saved(p)).secrets.includes('sweetdreams')); await shot(p, 'desktop-sweet-unlocked-fixture')
  await p.keyboard.press('Escape'); await p.getByRole('button', { name: 'Open My Dreams', exact: true }).click(); assert.equal(await p.getByRole('progressbar').getAttribute('value'), '3')
  pass('Future completion fixture', 'Unlock only after three unique repaired dreams', 'Loaded validated three-repair save; visual reward + dashboard 3/3 + persisted secret', 'Close reward returns desktop', 'fixture / not Stage 3 gameplay')
  await ctx.close()
  for (const blocked of [false, true]) {
    const c = await browser.newContext({ viewport: { width: 320, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' })
    await c.addInitScript(block => { if (block) { Storage.prototype.getItem = () => { throw Error('denied') }; Storage.prototype.setItem = () => { throw Error('quota') } } else { localStorage.setItem('dream-exe:progress', '{bad'); localStorage.setItem('dream-exe:quality', '"invalid"') } }, blocked)
    const q = await c.newPage(); monitor(q); await q.goto(base); await q.getByRole('button', { name: 'ENTER DREAM.EXE' }).waitFor({ timeout: 2000 }); await q.getByRole('button', { name: 'ENTER DREAM.EXE' }).tap(); await ready(q)
    await q.getByRole('button', { name: 'Open Lost Dreams', exact: true }).tap(); await q.getByRole('button', { name: 'Warm the spark', exact: true }).tap(); assert.equal(await q.locator('[data-recovered="true"]').count(), 1)
    assert.equal(await q.locator('.dream-os').getAttribute('data-reduced'), 'true'); assert.equal(await q.locator('.dream-os').getAttribute('data-quality'), 'full'); assert.equal(await q.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    await shot(q, `touch-320-${blocked ? 'blocked' : 'corrupt'}-storage`)
    pass(blocked ? 'Blocked/quota storage' : 'Corrupt storage', 'Clean fallback, usable recovery, OS reduced motion, 320px layout', 'Recovery works in memory; boot immediately ready; no overflow', 'Window closes normally; no storage exception escapes', 'touch-320')
    await c.close()
  }
  assert.deepEqual(errors, [], 'Browser runtime/console errors'); assert.deepEqual(requests, [], 'Failed requests')
} catch (e) { failure = e; console.error(e) }
finally {
  await writeFile(`${out}/browser-report.json`, JSON.stringify({ base, browser: browser.version(), rows, errors, requests, failure: failure?.stack ?? null }, null, 2))
  const table = ['# Stage 2 navigation matrix', '', 'Generated by scripts/check-stage2-browser.mjs against the production preview. PASS rows follow actual browser assertions, not static inspection. The three-repair case is explicitly seeded future-state coverage; no Stage 3 gameplay is claimed.', '', '| App or control | Expected action | Actual result | Return behavior | Input / scope | Status |', '|---|---|---|---|---|---|', ...rows.map(r => `| ${[r.control,r.expected,r.actual,r.back,r.mode,r.status].map(s => s.replaceAll('|', '/')).join(' | ')} |`), '', failure ? `INCOMPLETE: ${failure.message}` : 'All assertions passed. No console/runtime errors or failed requests.']
  await writeFile(resolve('docs/STAGE2_NAVIGATION_MATRIX.md'), table.join('\n') + '\n')
  await browser.close()
}
if (failure) process.exitCode = 1
