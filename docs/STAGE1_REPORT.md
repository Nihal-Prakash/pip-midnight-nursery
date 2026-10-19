# DREAM.EXE — Stage 1 delivery report

## Result

Implemented and exercised the from-scratch DREAM.EXE foundation on `feat/stage3-visual`. The new entry point replaces the old scroll runtime without rewriting other owners’ components. No merge, rebase, push, PR or production deployment was performed. Stage 2 is not started.

Preview: `http://127.0.0.1:4173` while the local preview process is running.

Run locally: `npm run dev -- --host 127.0.0.1`.
Production preview: `npm run build`, then `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`.

## Implemented

- CRT boot, loading/error sequence, immediate skip, repeat-visit bypass, replay and working mute on both boot and desktop.
- Supplied desktop/mobile wallpapers, all twelve supplied app icons, Pip artwork, native note/chrome and responsive taskbar.
- Central app registry and independent app destinations with intentionally limited Stage 1 content.
- Central window stacking/position/size, pointer and keyboard move/resize, focus, minimize/restore, maximize/restore, independent close and data-preserving Return Home.
- Full-width mobile sheets, retained window backstack, touch-friendly controls and scrollable desktop icons.
- Bounded RAF star trail, distinct pointer states, fine-pointer/reduced-motion guards and native pointer fallback.
- Start menu, actual local clock, synthesized user-gesture UI chimes, persistent preferences/diary, live notifications and a safe secret terminal command.
- Typed nursery/three-game handoff boundary. No fake gameplay completion.

## Actual verification results

- `npm run lint`: passed; 0 warnings, 0 errors across 29 files.
- `npm run typecheck`: passed (`tsc -b`).
- `npm run build`: passed; Vite production output, 434 modules transformed.
- Main JS: 392.96 kB, gzip 124.50 kB. CSS: 30.01 kB, gzip 7.84 kB. No extra runtime dependencies installed.
- `npm run test:stage1`: passed; reducer isolation/deduplication/stacking/bounds/restore and storage corruption/denial checks.
- `PLAYWRIGHT_MODULE=/tmp/dream-exe-qa/node_modules/playwright/index.mjs node scripts/check-stage1-browser.mjs`: passed against the actual production preview.
- Browser: Chromium 156.0.8078.4; 15 grouped behavioral checks passed. No page exceptions, console errors, failed requests or HTTP errors in the tested journeys.
- `git diff --check` / staged diff check: passed.
- Supplied runtime art was copied byte-for-byte and SHA-256 verified by `scripts/inventory-dream-assets.py`. Inventory records decoded dimensions, GLB contents, references, missing media and attribution limitations.

The browser check covers timed/skip/replay boot, all twelve apps, duplicate launch, multiple windows, pointer drag/resize, keyboard movement/resizing, maximize/restore, focus/cycling, minimize/restore, independent close, Start navigation, Return Home, settings, mute/AudioContext activation, effects, persistence, terminal secrets, notification dismissal, 390px/320px touch sheets, reduced motion and denied storage. Screenshot evidence is from the final application source state, after the final production build.

Verification found and fixed a transient duplicate-notification-control issue. The test harness also had two false-positive assumptions that were corrected: decorative clipped wallpaper overscan is not page overflow, and geometry/focus must be sampled after RAF/entrance animation settles.

## Evidence

15 PNG screenshots in `docs/evidence/dream-stage1/`, including:
- `boot-1440x900.png`, `desktop-1440x900.png`, `multiple-windows-1440x900.png`.
- `boot-390x844.png`, `desktop-390x844.png`, `window-390x844.png`.
- `boot-320x844.png`, `desktop-320x844.png`, `window-320x844.png`.
- Scrolled mobile desktops, all requested Start-menu sizes, and the terminal secret.

`boot-to-desktop-walkthrough.webm`: actual Chromium recording, 1440×900, 21.52 seconds; compressed VP9 for the repository, not synthetic footage. Includes boot → desktop and window interactions. Raw/failed-run recordings were moved outside the repository to `/tmp/dream-exe-qa-source-recordings/`.

`browser-report.json`: machine-readable passed checks, browser version, and error/request arrays.

To rerun browser checks without adding project dependencies:
1. `npm install --prefix /tmp/dream-exe-qa playwright`
2. `/tmp/dream-exe-qa/node_modules/.bin/playwright install chromium`
3. Build and start the preview as above.
4. `PLAYWRIGHT_MODULE=/tmp/dream-exe-qa/node_modules/playwright/index.mjs node scripts/check-stage1-browser.mjs`

Rerunning regenerates PNGs and an uncompressed browser WebM. Pillow is needed only to rerun the asset inventory; it is not a website dependency.

## Known limits

- Full mini-app functionality is Stage 2. The nursery, three repair games and 3D are Stage 3. Missing-dream status deliberately stays 0/3.
- Mobile checks use Chromium touch emulation, not physical hardware. Safari, Firefox and screen readers were not exercised. Subjective sound quality needs human listening; actual AudioContext activation and mute controls were exercised.
- Native arrow/grab/text cursors remain alongside the star enhancement as a failure-safe; the interface never relies on hidden native cursors.
- Desktop geometry and most app state persist only within the current session. Preferences, visited state and diary persist across reloads when storage is allowed.
- Supplied art licensing/creator attribution is not documented in the pack. Confirm before public distribution. Some supplied alpha edges are imperfect; the original art was not destructively altered.
- No supplied fonts/audio. System fonts and synthesized chimes are used. Two GLB models were inventoried, not shipped as 3D experiences.
- The mobile desktop scrolls to reach the last icon row; this is intentional, not a shrunken desktop.
- Original disconnected source is intentionally preserved; no other owner’s code is removed.

## Git and scope

Feature branch: `feat/stage3-visual`. The delivery commit can be identified with `git log -1 --format="%H %s" -- docs/STAGE1_REPORT.md`; its exact SHA is reported in the final handoff (a commit cannot contain its own hash).

The original untracked `Pip2.0 Assets/` directory remains untouched and uncommitted, including its nested repository. Only selected copied runtime artwork is included. No credentials, `.env`, node_modules, dist, nested repository or failed-run recordings are included.

## Exact changed files (60)

- `docs/ASSET_MANIFEST.md`
- `docs/COMPONENT_CONTRACTS.md`
- `docs/NAVIGATION_CONTRACT.md`
- `docs/PRODUCT_SPEC.md`
- `docs/STAGE1_REPORT.md`
- `docs/evidence/dream-stage1/boot-1440x900.png`
- `docs/evidence/dream-stage1/boot-320x844.png`
- `docs/evidence/dream-stage1/boot-390x844.png`
- `docs/evidence/dream-stage1/boot-to-desktop-walkthrough.webm`
- `docs/evidence/dream-stage1/browser-report.json`
- `docs/evidence/dream-stage1/desktop-1440x900.png`
- `docs/evidence/dream-stage1/desktop-320x844.png`
- `docs/evidence/dream-stage1/desktop-390x844.png`
- `docs/evidence/dream-stage1/desktop-scrolled-320x844.png`
- `docs/evidence/dream-stage1/desktop-scrolled-390x844.png`
- `docs/evidence/dream-stage1/multiple-windows-1440x900.png`
- `docs/evidence/dream-stage1/start-menu-1440x900.png`
- `docs/evidence/dream-stage1/start-menu-320x844.png`
- `docs/evidence/dream-stage1/start-menu-390x844.png`
- `docs/evidence/dream-stage1/terminal-secret-1440x900.png`
- `docs/evidence/dream-stage1/window-320x844.png`
- `docs/evidence/dream-stage1/window-390x844.png`
- `index.html`
- `package.json`
- `public/assets/dream/DREAM_APP_03_TELESCOPE_HERO_1024x768.png`
- `public/assets/dream/DREAM_APP_04_TOY_CABINET_HERO_1024x768.png`
- `public/assets/dream/DREAM_APP_05_DREAM_GALLERY_HERO_1024x768.png`
- `public/assets/dream/DREAM_APP_06_LOST_DREAMS_HERO_1024x768.png`
- `public/assets/dream/DREAM_APP_07_SWEETDREAMS_EXE_HERO_1024x768.png`
- `public/assets/dream/DREAM_OS_ICON_01_MY_DREAMS_256x256.png`
- `public/assets/dream/DREAM_OS_ICON_02_PIP_RESUME_256x256.png`
- `public/assets/dream/DREAM_OS_ICON_03_DREAM_DIARY_256x256.png`
- `public/assets/dream/DREAM_OS_ICON_04_LULLABY_LAB_256x256.png`
- `public/assets/dream/DREAM_OS_ICON_05_NIGHTLIGHT_EXE_256x256.png`
- `public/assets/dream/DREAM_OS_ICON_06_DREAM_COURIER_256x256.png`
- `public/assets/dream/DREAM_OS_ICON_07_TELESCOPE_256x256.png`
- `public/assets/dream/DREAM_OS_ICON_08_TOY_CABINET_256x256.png`
- `public/assets/dream/DREAM_OS_ICON_09_GALLERY_256x256.png`
- `public/assets/dream/DREAM_OS_ICON_10_TERMINAL_256x256.png`
- `public/assets/dream/DREAM_OS_ICON_11_SWEETDREAMS_EXE_256x256.png`
- `public/assets/dream/DREAM_OS_ICON_12_LOST_DREAMS_RECYCLE_BIN_256x256.png`
- `public/assets/dream/DREAM_OS_WALLPAPER_DESKTOP_1920x1080.jpg`
- `public/assets/dream/DREAM_OS_WALLPAPER_MOBILE_1080x1920.jpg`
- `public/assets/dream/DREAM_UI_BOOT_CONSTELLATION_SPINNER_512x512.png`
- `public/assets/dream/DREAM_UI_STICKER_05_PIP_SKULL_DOODLE_256x256.png`
- `public/assets/dream/pip-hero.webp`
- `public/assets/dream/pip-story.webp`
- `scripts/check-stage1-browser.mjs`
- `scripts/check-stage1.mjs`
- `scripts/inventory-dream-assets.py`
- `src/apps/registry.ts`
- `src/apps/views.tsx`
- `src/assets/dream.ts`
- `src/main.tsx`
- `src/os/AppWindow.tsx`
- `src/os/Boot.tsx`
- `src/os/Cursor.tsx`
- `src/os/DreamOS.tsx`
- `src/os/dream.css`
- `src/state/windows.ts`
