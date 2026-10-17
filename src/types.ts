export type Mood = 'day' | 'night'
export type Project = 'lullaby' | 'nightlight' | 'delivery'

export const projects: { id: Project; title: string; description: string }[] = [
  { id: 'lullaby', title: 'Lullaby Lab', description: 'A little melody for a sleepy mind.' },
  { id: 'nightlight', title: 'Nightlight Collection', description: 'A warm glow for the things hiding in the dark.' },
  { id: 'delivery', title: 'Dream Delivery', description: 'A dream for every house beneath the stars.' },
]
