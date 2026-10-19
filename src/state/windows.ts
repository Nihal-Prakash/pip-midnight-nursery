export type AppId = 'dreams' | 'about' | 'diary' | 'lullaby' | 'nightlight' | 'courier' | 'telescope' | 'cabinet' | 'gallery' | 'terminal' | 'sweet' | 'lost' | 'settings'
export type Destination = { kind: 'nursery' } | { kind: 'game'; game: 'lullaby' | 'nightlight' | 'courier' }
export type Bounds = { width: number; height: number }
export type WindowState = { id: AppId; x: number; y: number; width: number; height: number; minimized: boolean; maximized: boolean }
export type WindowAction =
  | { type: 'open'; id: AppId; size: Bounds; viewport: Bounds }
  | { type: 'focus' | 'close' | 'minimize' | 'maximize'; id: AppId }
  | { type: 'move'; id: AppId; x: number; y: number; viewport: Bounds }
  | { type: 'resize'; id: AppId; width: number; height: number; viewport: Bounds }
  | { type: 'fit'; viewport: Bounds }
  | { type: 'home' }

function fit(w: WindowState, viewport: Bounds): WindowState {
  // Mobile sheets use CSS geometry; retain the desktop restore rectangle.
  if (viewport.width <= 700) return w
  const width = Math.min(w.width, viewport.width - 24)
  const height = Math.min(w.height, viewport.height - 112)
  return { ...w, width, height, x: Math.max(12, Math.min(w.x, viewport.width - width - 12)), y: Math.max(44, Math.min(w.y, viewport.height - height - 68)) }
}

// Array order is the single stacking authority. No unbounded z-index counter.
export function windowsReducer(state: WindowState[], action: WindowAction): WindowState[] {
  if (action.type === 'home') return state.map(w => ({ ...w, minimized: true }))
  if (action.type === 'fit') return state.map(w => fit(w, action.viewport))
  const current = state.find(w => w.id === action.id)
  switch (action.type) {
    case 'open': {
      const w = current ?? fit({ id: action.id, x: 300 + state.length % 5 * 26, y: 116 + state.length % 5 * 26, ...action.size, minimized: false, maximized: false }, action.viewport)
      return [...state.filter(w => w.id !== action.id), { ...w, minimized: false }]
    }
    case 'focus': return current ? [...state.filter(w => w.id !== action.id), { ...current, minimized: false }] : state
    case 'close': return state.filter(w => w.id !== action.id)
    case 'minimize': return state.map(w => w.id === action.id ? { ...w, minimized: true } : w)
    case 'maximize': return current ? [...state.filter(w => w.id !== action.id), { ...current, maximized: !current.maximized, minimized: false }] : state
    case 'move': return state.map(w => w.id === action.id && !w.maximized ? fit({ ...w, x: action.x, y: action.y }, action.viewport) : w)
    case 'resize': return state.map(w => w.id === action.id && !w.maximized ? fit({ ...w, width: Math.max(340, action.width), height: Math.max(280, action.height) }, action.viewport) : w)
  }
}

export function readPreference<T extends string | boolean>(key: string, fallback: T): T {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(`dream-exe:${key}`) ?? 'null')
    return typeof value === typeof fallback ? value as T : fallback
  } catch { return fallback }
}
export function savePreference(key: string, value: string | boolean) {
  try { localStorage.setItem(`dream-exe:${key}`, JSON.stringify(value)) } catch { /* Private browsing/storage-full: keep the live session usable. */ }
}
