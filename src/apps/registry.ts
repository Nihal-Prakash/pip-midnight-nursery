import type { ComponentType } from 'react'
import { icons } from '../assets/dream'
import type { AppId, Destination } from '../state/windows'
import type { Progress, ProgressAction } from '../state/progress'
import type { DreamId } from './content'
import { AboutPip, DreamDiary, DreamGallery, DreamCourier, LostDreams, LullabyLab, MyDreams, Nightlight, Settings, SweetDreams, Telescope, Terminal, ToyCabinet } from './views'

export type Navigation = {
  openApp: (id: AppId) => void
  closeApp: (id: AppId) => void
  focusWindow: (id: AppId) => void
  enterNursery: (destination?: Destination) => void
  exitNursery: () => void
  openDreamDetail: (id: DreamId) => void
  launchTerminalCommand: (command: string) => string
  showNotification: (message: string) => void
}
export type AppProps = {
  data: string
  setData: (value: string) => void
  navigation: Navigation
  progress: Progress
  updateProgress: (action: ProgressAction) => void
  muted: boolean
  toggleMute: () => void
  effects: boolean
  toggleEffects: () => void
  reduced: boolean
  reducedPreference: boolean
  toggleReduced: () => void
  quality: 'full' | 'low'
  setQuality: (value: 'full' | 'low') => void
  playMelody: (notes: number[]) => void
  resetProgress: () => void
  replayIntro: () => void
}
export type AppDefinition = {
  id: AppId
  label: string
  icon: string
  launch: 'window'
  window: { width: number; height: number }
  component: ComponentType<AppProps>
  desktop: boolean
  description: string
}

export const apps: AppDefinition[] = [
  { id: 'dreams', label: 'My Dreams', icon: icons.dreams, launch: 'window', window: { width: 650, height: 520 }, component: MyDreams, desktop: true, description: 'Three dreams, waiting to come home.' },
  { id: 'about', label: 'About Pip', icon: icons.about, launch: 'window', window: { width: 610, height: 490 }, component: AboutPip, desktop: true, description: 'Meet your very small dream engineer.' },
  { id: 'diary', label: 'Dream Diary', icon: icons.diary, launch: 'window', window: { width: 570, height: 500 }, component: DreamDiary, desktop: true, description: 'Notes from the night shift.' },
  { id: 'lullaby', label: 'Lullaby Lab', icon: icons.lullaby, launch: 'window', window: { width: 570, height: 470 }, component: LullabyLab, desktop: true, description: 'A little melody for a restless dream.' },
  { id: 'nightlight', label: 'Nightlight.exe', icon: icons.nightlight, launch: 'window', window: { width: 570, height: 470 }, component: Nightlight, desktop: true, description: 'Even the smallest light matters.' },
  { id: 'courier', label: 'Dream Courier', icon: icons.courier, launch: 'window', window: { width: 570, height: 470 }, component: DreamCourier, desktop: true, description: 'Special deliveries for sleeping souls.' },
  { id: 'telescope', label: 'Telescope', icon: icons.telescope, launch: 'window', window: { width: 620, height: 520 }, component: Telescope, desktop: true, description: 'Some answers are written in stars.' },
  { id: 'cabinet', label: 'Toy Cabinet', icon: icons.cabinet, launch: 'window', window: { width: 620, height: 520 }, component: ToyCabinet, desktop: true, description: 'Tiny keepsakes. Very big feelings.' },
  { id: 'gallery', label: 'Dream Gallery', icon: icons.gallery, launch: 'window', window: { width: 640, height: 530 }, component: DreamGallery, desktop: true, description: 'Postcards from the other side of sleep.' },
  { id: 'terminal', label: 'Terminal', icon: icons.terminal, launch: 'window', window: { width: 600, height: 450 }, component: Terminal, desktop: true, description: 'A quiet conversation with the computer.' },
  { id: 'sweet', label: 'sweetdreams.exe', icon: icons.sweet, launch: 'window', window: { width: 620, height: 530 }, component: SweetDreams, desktop: true, description: 'The door to the Midnight Nursery.' },
  { id: 'lost', label: 'Lost Dreams', icon: icons.lost, launch: 'window', window: { width: 620, height: 520 }, component: LostDreams, desktop: true, description: 'Nothing loved is ever really lost.' },
  { id: 'settings', label: 'System Settings', icon: icons.terminal, launch: 'window', window: { width: 560, height: 490 }, component: Settings, desktop: false, description: 'Make yourself at home.' },
]
export function getApp(id: AppId): AppDefinition {
  return apps.find(app => app.id === id)!
}
