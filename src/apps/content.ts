import { art, icons } from '../assets/dream'
import type { DeliveryId, MelodyId } from '../state/windows'

export const melodies: { id: MelodyId; name: string; description: string; notes: number[] }[] = [
  { id: 'moon', name: 'Moonmilk Waltz', description: 'Three soft steps around a sleepy moon.', notes: [262, 330, 392] },
  { id: 'rain', name: 'Raindrop Reverie', description: 'A tiny rainstorm tapping on a teacup.', notes: [440, 392, 330, 294] },
  { id: 'cloud', name: 'Cloud Nine', description: 'A floating melody with nowhere to hurry.', notes: [330, 392, 523, 392] },
]
export const destinations: { id: DeliveryId; name: string; symbol: string; description: string }[] = [
  { id: 'cloud', name: 'Cloud Cottage', symbol: '☁', description: 'For a cloud shepherd who has misplaced their sheep.' },
  { id: 'moon', name: 'Moon House', symbol: '☾', description: 'For the moonkeeper, who lights everyone’s way but their own.' },
  { id: 'starry', name: 'Starry Nook', symbol: '✦', description: 'For a small astronomer waiting for a friendly reply.' },
]
export const diaryPages = [
  { title: 'The star that forgot.', image: art.constellation, alt: 'A scattering of stars around a little moon', text: 'I found a star beneath my cot tonight. It remembered its name, its sky and its favorite cloud. But it had forgotten how to shine. I sat beside it so it would not have to be dark alone.', note: 'First discovery: company is a kind of light.' },
  { title: 'A home for a little glow.', image: art.cabinet, alt: 'Pip’s first warm lantern on a wooden workbench', text: 'I borrowed a jar, a winding key and a very patient firefly. My first lantern flickered more than it glowed. The lost star climbed inside anyway. “Not perfect,” it said, “but warm.” That was enough to try again.', note: 'First invention: the Almost-Perfect Lantern.' },
  { title: 'My first night shift.', image: art.gallery, alt: 'Pip at a magical dream-making desk', text: 'The Midnight Nursery offered me a desk and a title: Junior Dream Engineer! I am still a baby, so my stool has extra cushions. I stitch songs into clouds and send them to anyone who needs a softer night.', note: 'Qualifications: curiosity, kindness, and a very large nap.' },
  { title: 'Three empty places.', image: art.lost, alt: 'A nursery corner waiting for its missing dreams', text: 'Tonight three dreams escaped. One lost its song. One became afraid of the dark. One forgot the way home. I cannot mend them all by myself. Will you try my music box, lantern and delivery satchel? I will be right here.', note: 'If you are reading this, you are already helping. — Pip ♡' },
]
export const dreamRecords = [
  { id: 'night-shift', title: 'The desk beyond bedtime', image: art.gallery, alt: 'Pip working at a glowing desk', tint: 'lavender', story: 'Every drawer holds an unfinished wonder. Pip leaves one drawer empty for the idea that has not arrived yet.', label: '01 / NIGHT SHIFT' },
  { id: 'cloud-friends', title: 'The company we keep', image: art.sweet, alt: 'Pip with gentle ghost friends in a cloud nursery', tint: 'blush', story: 'The ghosts are not here to haunt anyone. They are the dreams of old friends, stopping by to make sure nobody falls asleep lonely.', label: '02 / TOGETHERNESS' },
  { id: 'first-light', title: 'A jar full of almost', image: art.cabinet, alt: 'A warm moon lantern on the workbench', tint: 'gold', story: 'The first lantern was meant to hold a star. It held a firefly instead. Pip wrote “successful prototype” on the label and made it a tiny pillow.', label: '03 / FIRST INVENTION' },
  { id: 'far-away', title: 'A reply from far away', image: art.telescope, alt: 'A telescope watching a violet night sky', tint: 'midnight', story: 'Pip blinked five times at a distant light. Five nights later, it blinked back. Some friendships simply have a little more distance to cross.', label: '04 / SKY MAIL' },
  { id: 'soft-place', title: 'A soft place to land', image: art.lost, alt: 'A cozy nursery basket and a star-holding toy', tint: 'cream', story: 'Nothing in this basket is rubbish. The torn blanket remembers a first nap. The bent star remembers being loved. Pip keeps a place for things that need another chance.', label: '05 / LOST & FOUND' },
  { id: 'small-engineer', title: 'The smallest engineer', image: art.story, alt: 'Pip, the nursery’s little skull-faced dream engineer', tint: 'rose', story: 'The workbench is too tall and the tools are too big. But when a dream asks for help, Pip never says “too small.” Only “let me get my stool.”', label: '06 / BEGINNINGS' },
] as const
export type DreamId = typeof dreamRecords[number]['id']
export const toys = [
  { name: 'Pocket Moon', image: icons.nightlight, description: 'A lantern toy with a sleepy moon inside. Pip’s first attempt at bottling courage.', action: 'Wake the moon', reaction: 'The moon yawns, then promises to stay awake until you are safely asleep.' },
  { name: 'Clockwork Cricket', image: icons.lullaby, description: 'A hand-wound music-box toy. Its little brass cricket knows precisely three notes and is very proud of them.', action: 'Wind the cricket', reaction: 'Ting, tink, ting! The cricket takes a very small bow.' },
  { name: 'Postbird', image: icons.courier, description: 'A paper bird with a star for a heart. Pip folds one whenever a friend feels too far away.', action: 'Ask for a delivery', reaction: 'The postbird flutters: “One pocket-sized hug, express delivery!”' },
]
export const fragments = [
  { id: 'spark', title: 'A dim little spark', clue: 'Warm it between your hands.', action: 'Warm the spark', story: 'Before I could build anything, I could sit beside someone. The star beneath my cot taught me that being there matters.' },
  { id: 'key', title: 'A bent winding key', clue: 'Turn it gently, not perfectly.', action: 'Turn the key', story: 'My first music box played one wrong note. The nursery kept that note. They said it sounded like someone learning.' },
  { id: 'letter', title: 'An undelivered letter', clue: 'Unfold the corner with the tiny heart.', action: 'Unfold the letter', story: '“Dear Pip, you do not have to be big to make someone feel safe.” My first letter from the Midnight Nursery. I read it every night.' },
] as const
