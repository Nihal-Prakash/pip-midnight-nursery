"""Inventory the supplied extracted pack; copy only selected, unchanged runtime art."""
from pathlib import Path
import hashlib
import json
import shutil
import struct
import xml.etree.ElementTree as ET
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / 'Pip2.0 Assets'
FINAL = PACK / 'Final assets'
OUT = ROOT / 'public/assets/dream'
OUT.mkdir(parents=True, exist_ok=True)
selected = set()
for pattern in ['DREAM_OS_ICON_*_256x256.png', 'DREAM_OS_WALLPAPER_*', 'DREAM_APP_*_HERO_*', 'DREAM_UI_STICKER_05_*', 'DREAM_UI_BOOT_CONSTELLATION_*']:
    selected.update(FINAL.glob(pattern))
for p in selected:
    shutil.copy2(p, OUT / p.name)
for name in ['pip-hero.webp', 'pip-story.webp']:
    p = PACK / 'pip-midnight-nursery/public/assets/character' / name
    selected.add(p)
    shutil.copy2(p, OUT / name)

lines = ['# DREAM.EXE — verified asset inventory', '',
    'Stage 1 source: `Pip2.0 Assets/`. No ZIP archives are present in this supplied directory; it is already extracted. The nested repository is treated as an artwork archive only, not application source. Original files are not modified.', '',
    'This manifest supersedes the old planned-filename manifest for the operator-authorized DREAM.EXE rebuild. Runtime files are exact byte-for-byte copies in `public/assets/dream/`; SHA-256 checks are made by this script. No resampling or aspect-ratio changes. Wallpapers use intentional cover framing; illustrations/icons use contain.', '',
    '## Provenance and limitations', '',
    '- Artwork supplied by the operator. Underlying artist/generation provenance and redistribution license are not included; confirm before public distribution. Character canon belongs to haX.baby: https://hax.baby/baby/assets/track1-pip-asset-pack.zip . No claim that all supplied derivative art is official.',
    '- Reference sheets, popup/toast mockups and labeled mini-app artwork contain baked interface text. They are references/illustrations, never interactive chrome. All working titles, buttons, labels, progress and notifications are HTML/CSS.',
    '- Some sticker cutouts retain dark backplates/neighbor fragments. Use only the clean Pip doodle; other ornaments are CSS/native glyphs. Icon dark rounded backplates are preserved intact.',
    '- Pip hero has imperfect alpha edges. Preserved as supplied, not destructively cleaned.',
    '- No supplied fonts or audio found. System Georgia/monospace/sans-serif fallbacks; optional UI chime synthesized via Web Audio, default muted. No external font requests.',
    '- No standalone My Dreams, About Pip, Dream Diary, Lullaby Lab, Nightlight or Courier hero exports in the Final assets set. Purpose-built HTML content and supplied icons fill these destinations; full apps are Stage 2.',
    '- Toy Cabinet thumbnail absent; use its existing icon. Nursery/game environments and layered scene art are pending Stage 3.',
    '- Models are inventoried but not shipped or rendered in Stage 1. Neither GLB contains textures or animation; inspect framing/materials in Stage 3 before choosing a renderer. No Three.js dependency added.', '',
    '## Actual files', '',
    'Paths below are relative to `Pip2.0 Assets/`. Dimensions are decoded from content, not inferred from filenames.', '',
    '| Actual path | Format | Dimensions / model contents | Intended use / status |',
    '|---|---|---|---|']
exts = {'.png','.jpg','.jpeg','.webp','.svg','.glb','.blend','.ttf','.woff','.woff2','.wav','.mp3','.ogg','.zip'}
for p in sorted(PACK.rglob('*')):
    if not p.is_file() or '.git' in p.parts or p.suffix.lower() not in exts:
        continue
    ext = p.suffix.lower()
    dimensions = 'Source file'
    if ext in {'.png','.jpg','.jpeg','.webp'}:
        with Image.open(p) as im:
            dimensions = f'{im.width} × {im.height}; {im.mode}'
    elif ext == '.svg':
        tree = ET.parse(p).getroot()
        dimensions = 'viewBox ' + tree.attrib.get('viewBox','unspecified')
    elif ext == '.glb':
        data = p.read_bytes()
        length, kind = struct.unpack_from('<II', data, 12)
        assert kind == 0x4E4F534A
        model = json.loads(data[20:20+length])
        dimensions = f"glTF {model['asset']['version']}; {len(model.get('meshes', []))} meshes; {len(model.get('materials', []))} materials; {len(model.get('textures', []))} textures; {len(model.get('animations', []))} animations"
    if p in selected:
        assert hashlib.sha256(p.read_bytes()).digest() == hashlib.sha256((OUT / p.name).read_bytes()).digest()
        use = 'Runtime: ' + ('app icon' if '_ICON_' in p.name else 'wallpaper' if 'WALLPAPER' in p.name else 'Pip illustration' if p.name.startswith('pip-') else 'decorative artwork / app preview')
    elif 'SHEET' in p.name or 'SYSTEM' in p.name or 'REFERENCE' in p.name or 'TERMINAL_WINDOW' in p.name:
        use = 'Visual reference only; implement real HTML/CSS'
    elif ext in {'.glb','.blend'}:
        use = 'Stage 3 model / editable source; not shipped'
    elif '_TOAST_' in p.name or '_STICKY_' in p.name or '_BOOT_PROGRESS_' in p.name:
        use = 'Reference only; native HTML/CSS replacement'
    elif '_CRT_' in p.name:
        use = 'Available overlay; lightweight CSS replacement used'
    else:
        use = 'Available source artwork; not shipped in Stage 1'
    lines.append(f'| `{p.relative_to(PACK)}` | {ext[1:].upper()} | {dimensions} | {use} |')
lines += ['', '## Reproduce', '', '`python scripts/inventory-dream-assets.py` (requires Pillow; build does not). It inventories the archive and verifies unchanged runtime copies. Missing original files are errors, never invented filenames.', '']
(ROOT / 'docs/ASSET_MANIFEST.md').write_text('\n'.join(lines))
print(f'Inventoried artwork; copied and hash-verified {len(selected)} runtime assets.')
