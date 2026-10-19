import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
const code = ts.transpile(readFileSync(new URL('../src/state/progress.ts', import.meta.url), 'utf8'), { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ES2022 })
const { freshProgress, parseProgress, progressReducer: reduce, starsCollected, loadProgress, saveProgress } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
for (const raw of [null, 'null', '{broken', '[]', '{"version":2}', '"bad"']) assert.deepEqual(parseProgress(raw), freshProgress())
let p = parseProgress(JSON.stringify({ version: 1, repaired: ['lullaby', 'lullaby', 'invalid'], fragments: 23, activities: ['telescope', 'bogus'], secrets: ['sweetdreams', 'starlight', 'starlight'] }))
assert.deepEqual(p.repaired, ['lullaby']); assert.deepEqual(p.fragments, []); assert.deepEqual(p.secrets, ['starlight']); assert.equal(starsCollected(p), 6)
p = freshProgress()
p = reduce(p, { type: 'activity', id: 'telescope' }); p = reduce(p, { type: 'activity', id: 'telescope' })
assert.equal(starsCollected(p), 5); assert.equal(p.repaired.length, 0)
for (const id of ['spark', 'key', 'letter', 'spark']) p = reduce(p, { type: 'recover', id })
assert.equal(p.fragments.length, 3); assert.ok(p.activities.includes('lost'))
for (const id of ['lullaby', 'nightlight']) p = reduce(p, { type: 'repair', id })
assert.ok(!p.secrets.includes('sweetdreams'))
p = reduce(p, { type: 'repair', id: 'courier' }); p = reduce(p, { type: 'repair', id: 'courier' })
assert.equal(p.repaired.length, 3); assert.equal(starsCollected(p), 8); assert.deepEqual(p.secrets, ['sweetdreams'])
assert.deepEqual(parseProgress(JSON.stringify(p)), p)
const storage = new Map()
globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }
saveProgress(p); assert.deepEqual(loadProgress(), p)
p = reduce(p, { type: 'reset' }); saveProgress(p); assert.deepEqual(loadProgress(), freshProgress())
globalThis.localStorage = { getItem() { throw Error('denied') }, setItem() { throw Error('quota') } }
assert.deepEqual(loadProgress(), freshProgress()); assert.doesNotThrow(() => saveProgress(p))
console.log('PASS Stage 2: clean/corrupt/versioned storage, allowlists, deduplication, earned stars, recovery, three-dream unlock, idempotent completion, reload, reset, blocked/quota storage.')
