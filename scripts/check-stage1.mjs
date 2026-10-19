import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// No test framework: transpile the pure reducer with the existing TS compiler.
const code = ts.transpile(readFileSync(new URL('../src/state/windows.ts', import.meta.url), 'utf8'), { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ES2022 })
const { windowsReducer: reduce, readPreference, savePreference } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
const viewport = { width: 1440, height: 900 }, size = { width: 600, height: 480 }
const open = (state, id) => reduce(state, { type: 'open', id, size, viewport })
let state = open([], 'dreams')
state = open(state, 'diary')
assert.equal(state.length, 2)
state = open(state, 'dreams')
assert.equal(state.length, 2, 'double activation cannot duplicate windows')
assert.equal(state.at(-1).id, 'dreams')
state = reduce(state, { type: 'move', id: 'dreams', x: -900, y: 9999, viewport })
assert.equal(state.at(-1).x, 12)
assert.ok(state.at(-1).y + state.at(-1).height <= viewport.height - 68)
const beforeMax = { ...state.at(-1) }
state = reduce(state, { type: 'maximize', id: 'dreams' })
state = reduce(state, { type: 'maximize', id: 'dreams' })
assert.deepEqual(state.at(-1), beforeMax, 'maximize restores exact geometry')
state = reduce(state, { type: 'minimize', id: 'dreams' })
assert.equal(state.at(-1).minimized, true)
state = open(state, 'dreams')
assert.equal(state.at(-1).minimized, false)
state = reduce(state, { type: 'resize', id: 'dreams', width: -10, height: -20, viewport })
assert.equal(state.at(-1).width, 340)
assert.equal(state.at(-1).height, 280)
state = reduce(state, { type: 'close', id: 'dreams' })
assert.deepEqual(state.map(w => w.id), ['diary'], 'close affects only its target')
assert.equal(reduce(state, { type: 'home' })[0].minimized, true)
assert.equal(reduce(state, { type: 'fit', viewport: { width: 320, height: 844 } })[0].width, 600, 'mobile keeps desktop restore geometry')
state = reduce(state, { type: 'fit', viewport: { width: 800, height: 600 } })
assert.ok(state[0].x + state[0].width <= 788)
assert.ok(state[0].y + state[0].height <= 532)
const store = new Map()
globalThis.localStorage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) }
assert.equal(readPreference('muted', true), true)
savePreference('muted', false)
assert.equal(readPreference('muted', true), false)
store.set('dream-exe:muted', '{broken')
assert.equal(readPreference('muted', true), true)
store.set('dream-exe:muted', '"wrong type"')
assert.equal(readPreference('muted', true), true)
globalThis.localStorage = { getItem() { throw Error('blocked') }, setItem() { throw Error('full') } }
assert.equal(readPreference('muted', true), true)
assert.doesNotThrow(() => savePreference('muted', false))
console.log('PASS: window isolation, duplicate launch, stacking, move bounds, resize bounds, maximize/restore, minimize/restore, home, viewport fitting, storage corruption and denial.')
