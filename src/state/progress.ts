import type { ExperienceId } from './windows'

export const activities = ['telescope', 'diary', 'cabinet', 'gallery', 'lost'] as const
export type Activity = typeof activities[number]
export type FragmentId = 'spark' | 'key' | 'letter'
export type Progress = {
  version: 1
  repaired: ExperienceId[]
  fragments: FragmentId[]
  activities: Activity[]
  secrets: ('starlight' | 'sweetdreams')[]
}
export type ProgressAction = { type: 'repair'; id: ExperienceId } | { type: 'recover'; id: FragmentId } | { type: 'activity'; id: Activity } | { type: 'secret'; id: 'starlight' } | { type: 'reset' }
export const freshProgress = (): Progress => ({ version: 1, repaired: [], fragments: [], activities: [], secrets: [] })
export const starsCollected = (p: Progress) => (p.activities.includes('telescope') ? 5 : 0) + p.repaired.length

// Explicit allowlists at the storage boundary; unknown values never become earned progress.
export function parseProgress(raw: string | null): Progress {
  try {
    const p = JSON.parse(raw ?? 'null')
    if (!p || p.version !== 1) return freshProgress()
    const pick = <T extends string>(value: unknown, allowed: readonly T[]): T[] => Array.isArray(value) ? allowed.filter(id => value.includes(id)) : []
    const repaired = pick(p.repaired, ['lullaby', 'nightlight', 'courier'] as const)
    return {
      version: 1, repaired,
      fragments: pick(p.fragments, ['spark', 'key', 'letter'] as const),
      activities: pick(p.activities, activities),
      secrets: [...pick(p.secrets, ['starlight'] as const), ...(repaired.length === 3 ? ['sweetdreams' as const] : [])],
    }
  } catch { return freshProgress() }
}
export function loadProgress(): Progress {
  try { return parseProgress(localStorage.getItem('dream-exe:progress')) } catch { return freshProgress() }
}
export function saveProgress(progress: Progress) {
  try { localStorage.setItem('dream-exe:progress', JSON.stringify(progress)) } catch { /* Storage denied/full: retain the working in-memory session. */ }
}
export function progressReducer(p: Progress, action: ProgressAction): Progress {
  if (action.type === 'reset') return freshProgress()
  const next = { ...p }
  if (action.type === 'repair' && !p.repaired.includes(action.id)) next.repaired = [...p.repaired, action.id]
  if (action.type === 'recover' && !p.fragments.includes(action.id)) next.fragments = [...p.fragments, action.id]
  if (action.type === 'activity' && !p.activities.includes(action.id)) next.activities = [...p.activities, action.id]
  if (action.type === 'secret' && !p.secrets.includes(action.id)) next.secrets = [...p.secrets, action.id]
  if (next.fragments.length === 3 && !next.activities.includes('lost')) next.activities = [...next.activities, 'lost']
  if (next.repaired.length === 3 && !next.secrets.includes('sweetdreams')) next.secrets = [...next.secrets, 'sweetdreams']
  return next
}
