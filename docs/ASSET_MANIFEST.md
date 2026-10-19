# DREAM.EXE — verified asset inventory

Stage 1 source: `Pip2.0 Assets/`. No ZIP archives are present in this supplied directory; it is already extracted. The nested repository is treated as an artwork archive only, not application source. Original files are not modified.

This manifest supersedes the old planned-filename manifest for the operator-authorized DREAM.EXE rebuild. Runtime files are exact byte-for-byte copies in `public/assets/dream/`; SHA-256 checks are made by this script. No resampling or aspect-ratio changes. Wallpapers use intentional cover framing; illustrations/icons use contain.

## Provenance and limitations

- Artwork supplied by the operator. Underlying artist/generation provenance and redistribution license are not included; confirm before public distribution. Character canon belongs to haX.baby: https://hax.baby/baby/assets/track1-pip-asset-pack.zip . No claim that all supplied derivative art is official.
- Reference sheets, popup/toast mockups and labeled mini-app artwork contain baked interface text. They are references/illustrations, never interactive chrome. All working titles, buttons, labels, progress and notifications are HTML/CSS.
- Some sticker cutouts retain dark backplates/neighbor fragments. Use only the clean Pip doodle; other ornaments are CSS/native glyphs. Icon dark rounded backplates are preserved intact.
- Pip hero has imperfect alpha edges. Preserved as supplied, not destructively cleaned.
- No supplied fonts or audio found. System Georgia/monospace/sans-serif fallbacks; optional UI chime synthesized via Web Audio, default muted. No external font requests.
- No standalone My Dreams, About Pip, Dream Diary, Lullaby Lab, Nightlight or Courier hero exports in the Final assets set. Purpose-built HTML content and supplied icons fill these destinations; full apps are Stage 2.
- Toy Cabinet thumbnail absent; use its existing icon. Nursery/game environments and layered scene art are pending Stage 3.
- Models are inventoried but not shipped or rendered in Stage 1. Neither GLB contains textures or animation; inspect framing/materials in Stage 3 before choosing a renderer. No Three.js dependency added.

## Actual files

Paths below are relative to `Pip2.0 Assets/`. Dimensions are decoded from content, not inferred from filenames.

| Actual path | Format | Dimensions / model contents | Intended use / status |
|---|---|---|---|
| `Final assets/DREAM_APP_03_TELESCOPE_HERO_1024x768.png` | PNG | 1024 × 768; RGBA | Runtime: decorative artwork / app preview |
| `Final assets/DREAM_APP_03_TELESCOPE_THUMB_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_APP_04_TOY_CABINET_HERO_1024x768.png` | PNG | 1024 × 768; RGBA | Runtime: decorative artwork / app preview |
| `Final assets/DREAM_APP_05_DREAM_GALLERY_HERO_1024x768.png` | PNG | 1024 × 768; RGBA | Runtime: decorative artwork / app preview |
| `Final assets/DREAM_APP_05_DREAM_GALLERY_THUMB_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_APP_06_LOST_DREAMS_HERO_1024x768.png` | PNG | 1024 × 768; RGBA | Runtime: decorative artwork / app preview |
| `Final assets/DREAM_APP_06_LOST_DREAMS_THUMB_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_APP_07_SWEETDREAMS_EXE_HERO_1024x768.png` | PNG | 1024 × 768; RGBA | Runtime: decorative artwork / app preview |
| `Final assets/DREAM_APP_07_SWEETDREAMS_EXE_THUMB_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_OS_ERROR_POPUP_SYSTEM_1024x1024.jpg` | JPG | 1024 × 1024; RGB | Visual reference only; implement real HTML/CSS |
| `Final assets/DREAM_OS_ICON_01_MY_DREAMS_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_02_PIP_RESUME_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_03_DREAM_DIARY_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_04_LULLABY_LAB_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_05_NIGHTLIGHT_EXE_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_06_DREAM_COURIER_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_07_TELESCOPE_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_08_TOY_CABINET_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_09_GALLERY_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_10_TERMINAL_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_11_SWEETDREAMS_EXE_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_12_LOST_DREAMS_RECYCLE_BIN_256x256.png` | PNG | 256 × 256; RGBA | Runtime: app icon |
| `Final assets/DREAM_OS_ICON_FAMILY_SHEET_1920x1080.jpg` | JPG | 1920 × 1080; RGB | Visual reference only; implement real HTML/CSS |
| `Final assets/DREAM_OS_TASKBAR_DOCK_SYSTEM_1920x1080.jpg` | JPG | 1920 × 1080; RGB | Visual reference only; implement real HTML/CSS |
| `Final assets/DREAM_OS_TERMINAL_WINDOW_1024x1024.jpg` | JPG | 1024 × 1024; RGB | Visual reference only; implement real HTML/CSS |
| `Final assets/DREAM_OS_WALLPAPER_DESKTOP_1920x1080.jpg` | JPG | 1920 × 1080; RGB | Runtime: wallpaper |
| `Final assets/DREAM_OS_WALLPAPER_MOBILE_1080x1920.jpg` | JPG | 1080 × 1920; RGB | Runtime: wallpaper |
| `Final assets/DREAM_OS_WINDOW_CHROME_SYSTEM_1920x1080.jpg` | JPG | 1920 × 1080; RGB | Visual reference only; implement real HTML/CSS |
| `Final assets/DREAM_UI_BOOT_CONSTELLATION_SPINNER_512x512.png` | PNG | 512 × 512; RGBA | Runtime: decorative artwork / app preview |
| `Final assets/DREAM_UI_BOOT_PROGRESS_BAR_1024x256.png` | PNG | 1024 × 256; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_BOOT_SCREEN_REFERENCE_1920x1080.jpg` | JPG | 1920 × 1080; RGB | Visual reference only; implement real HTML/CSS |
| `Final assets/DREAM_UI_CRT_SCANLINES_1024x1024.png` | PNG | 1024 × 1024; RGBA | Available overlay; lightweight CSS replacement used |
| `Final assets/DREAM_UI_CRT_SOFT_GLOW_1920x1080.png` | PNG | 1920 × 1080; RGBA | Available overlay; lightweight CSS replacement used |
| `Final assets/DREAM_UI_CRT_STATIC_NOISE_512x512.png` | PNG | 512 × 512; RGBA | Available overlay; lightweight CSS replacement used |
| `Final assets/DREAM_UI_CRT_VIGNETTE_1920x1080.png` | PNG | 1920 × 1080; RGBA | Available overlay; lightweight CSS replacement used |
| `Final assets/DREAM_UI_FILES_AND_FOLDERS_SHEET_1920x1080.jpg` | JPG | 1920 × 1080; RGB | Visual reference only; implement real HTML/CSS |
| `Final assets/DREAM_UI_FILE_ARCHIVE_BUNDLE_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_UI_FILE_CORRUPTED_SYSTEM_256x256.png` | PNG | 256 × 256; RGBA | Visual reference only; implement real HTML/CSS |
| `Final assets/DREAM_UI_FILE_FLOPPY_DISK_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_UI_FILE_NOTE_DOCUMENT_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_UI_FILE_SPECIAL_EXE_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_UI_FOLDER_CORRUPTED_SECRET_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_UI_FOLDER_MAGICAL_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_UI_FOLDER_NORMAL_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_UI_STICKER_01_TINY_STARS_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_UI_STICKER_02_SLEEPING_MOON_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_UI_STICKER_05_PIP_SKULL_DOODLE_256x256.png` | PNG | 256 × 256; RGBA | Runtime: decorative artwork / app preview |
| `Final assets/DREAM_UI_STICKER_06_CUTE_WARNING_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_UI_STICKER_07_PINK_BOW_256x256.png` | PNG | 256 × 256; RGBA | Available source artwork; not shipped in Stage 1 |
| `Final assets/DREAM_UI_STICKER_PACK_SHEET_1024x1024.jpg` | JPG | 1024 × 1024; RGB | Visual reference only; implement real HTML/CSS |
| `Final assets/DREAM_UI_STICKY_01_MUSICBOX_REMINDER_512x512.png` | PNG | 512 × 512; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_STICKY_02_DREAM_HIDING_512x512.png` | PNG | 512 × 512; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_STICKY_03_BEDTIME_CLOCK_512x512.png` | PNG | 512 × 512; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_STICKY_04_BLANK_CREAM_PEEL_512x512.png` | PNG | 512 × 512; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_STICKY_05_BLANK_BLUSH_PIN_512x512.png` | PNG | 512 × 512; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_STICKY_06_BLANK_LAVENDER_CLIP_512x512.png` | PNG | 512 × 512; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_STICKY_NOTES_FAMILY_SHEET_1920x1080.jpg` | JPG | 1920 × 1080; RGB | Visual reference only; implement real HTML/CSS |
| `Final assets/DREAM_UI_TOAST_01_DREAM_REPAIRED_512x256.png` | PNG | 512 × 256; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_TOAST_02_NEW_FILE_UNLOCKED_512x256.png` | PNG | 512 × 256; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_TOAST_03_PIP_HAPPY_512x256.png` | PNG | 512 × 256; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_TOAST_04_SECRET_FOUND_512x256.png` | PNG | 512 × 256; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_TOAST_MODULAR_SHELL_512x256.png` | PNG | 512 × 256; RGBA | Reference only; native HTML/CSS replacement |
| `Final assets/DREAM_UI_TOAST_SYSTEM_REFERENCE_1024x1024.jpg` | JPG | 1024 × 1024; RGB | Visual reference only; implement real HTML/CSS |
| `pip-midnight-nursery/Untitled.blend` | BLEND | Source file | Stage 3 model / editable source; not shipped |
| `pip-midnight-nursery/music.blend` | BLEND | Source file | Stage 3 model / editable source; not shipped |
| `pip-midnight-nursery/music.glb` | GLB | glTF 2.0; 3 meshes; 0 materials; 0 textures; 0 animations | Stage 3 model / editable source; not shipped |
| `pip-midnight-nursery/pip.glb` | GLB | glTF 2.0; 1 meshes; 0 materials; 0 textures; 0 animations | Stage 3 model / editable source; not shipped |
| `pip-midnight-nursery/public/assets/character/pip-hero.webp` | WEBP | 1024 × 1024; RGBA | Runtime: Pip illustration |
| `pip-midnight-nursery/public/assets/character/pip-story.webp` | WEBP | 1024 × 1024; RGBA | Runtime: Pip illustration |
| `pip-midnight-nursery/public/assets/easter-egg/secret-dream.webp` | WEBP | 1200 × 900; RGB | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/projects/dream-map.svg` | SVG | viewBox 0 0 1200 750 | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/projects/lantern.webp` | WEBP | 1024 × 914; RGB | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/projects/musicbox.webp` | WEBP | 1024 × 924; RGB | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/projects/nightlight-room.webp` | WEBP | 1920 × 1080; RGB | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/scenes/desktop-bg-mobile.webp` | WEBP | 1170 × 2080; RGB | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/scenes/desktop-bg.webp` | WEBP | 2880 × 1620; RGB | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/scenes/origin-star.svg` | SVG | viewBox 0 0 800 500 | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/scenes/origin-workshop.webp` | WEBP | 1600 × 900; RGB | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/ui/icon-delivery.svg` | SVG | viewBox 0 0 64 64 | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/ui/icon-lullaby.svg` | SVG | viewBox 0 0 64 64 | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/ui/icon-nightlight.svg` | SVG | viewBox 0 0 64 64 | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/ui/moon.svg` | SVG | viewBox 0 0 48 48 | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/assets/ui/star.svg` | SVG | viewBox 0 0 48 48 | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/favicon.svg` | SVG | viewBox 0 0 48 46 | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/public/icons.svg` | SVG | viewBox unspecified | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/src/assets/hero.png` | PNG | 343 × 361; P | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/src/assets/react.svg` | SVG | viewBox 0 0 256 228 | Available source artwork; not shipped in Stage 1 |
| `pip-midnight-nursery/src/assets/vite.svg` | SVG | viewBox 0 0 77 47 | Available source artwork; not shipped in Stage 1 |

## Reproduce

`python scripts/inventory-dream-assets.py` (requires Pillow; build does not). It inventories the archive and verifies unchanged runtime copies. Missing original files are errors, never invented filenames.
