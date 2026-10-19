# DREAM.EXE — Stage 2 handoff

Branch: `feat/stage2-apps` (operator-assigned Hermes A). Stage 2 only; no merge,
push, rebase, deployment or Stage 3 game implementation.

## Delivered

Twelve individual app interiors, centralized typed navigation, exact nursery
station handoffs with melody/address and launcher restoration, versioned earned
progress, working preferences and confirmed reset. Stage 1 desktop composition,
wallpaper, window chrome, geometry reducer and cursor implementation are retained.

Source changes:
- `src/apps/views.tsx`, `registry.ts`, `content.ts`, `apps.css`: applications,
  catalog/story content, explicit shared interfaces and scoped interiors.
- `src/os/DreamOS.tsx`, `Nursery.tsx`: navigation, progression, audio, preferences
  and exact nursery landings. Boot/AppWindow accept the reduced-motion preference.
- `src/state/progress.ts`, `windows.ts`: validated save/reducer and typed handoffs.
- `package.json`, Stage 2 scripts, product/component/navigation contracts and this
  report: runnable checks and integration documentation.

No dependency added to the project. No B-owned components/hooks, asset files,
asset manifest or dirty nested asset repository changed. No ZIP is present in the
supplied archive: the already-extracted, Stage-1-inventoried artwork is reused.
No material/texture/animation-complete GLB was available in that inventory; the
cabinet intentionally uses three supplied illustrations, with rotation/reactions.

## Verification and evidence

Final run: lint passed with zero warnings/errors; typecheck and production build
passed; Stage 1 window/storage checks and Stage 2 progression/storage checks
passed. Chromium 156.0.8078.4 completed 32 navigation-matrix checks with no console
errors, runtime exceptions or failed requests. All twelve apps were exercised on
1440×900 desktop and 390×844 touch; 320×844 checks covered reduced motion and
corrupt/blocked storage. There are 37 real browser screenshots, including every
application at both primary sizes. Desktop/mobile contact-sheet review confirmed
the retained chrome and distinct interiors; human visual approval remains pending.

Reproduce from the project root:

```sh
npm run lint
npm run typecheck
npm run build
npm run test:stage1
npm run test:stage2
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
# In a second terminal, with Playwright installed outside the project:
PLAYWRIGHT_MODULE=/tmp/dream-stage2-qa/node_modules/playwright/index.mjs npm run test:stage2:browser
```

`DREAM_URL` can override the production-preview URL. Browser assertions generate
`docs/STAGE2_NAVIGATION_MATRIX.md` (expected/actual/return/status), plus the JSON
report and screenshots under `docs/evidence/dream-stage2/`. Each of the twelve
apps has desktop and 390px touch evidence; additional screenshots cover nursery
handoffs, gallery detail, settings, future unlocked secret state and 320px storage
fallbacks. The script fails on runtime/console errors, HTTP failures, image loading
failures or mismatched assertions. Assertions—not static claims—populate PASS rows.

## Stage boundary / known limitations

- The Lullaby/Nightlight/Courier nursery screens are functional, exact destination
  landings, explicitly labeled Stage 2 previews. Full repair gameplay belongs to
  Stage 3; previews never award fake repairs. The three-repair reward is tested
  using an explicitly seeded future-state save and the pure reducer.
- Completed activities, memory fragments, secrets, repairs and preferences persist.
  Partial toy/gallery exploration, in-progress constellation attempts and command
  history are component-session state. Transcript and app selections survive
  close/reopen in the OS session; the optional diary note survives reload.
- Long app content scrolls inside the existing Stage 1 window bounds. Mobile keeps
  the original full-width sheets and native touch/keyboard controls.
- Verification is Chromium/Linux and mobile emulation, not physical devices,
  Safari/Firefox, a screen reader audit, or subjective listening quality approval.
- Supplied illustration artist/license confirmation is still pending, as documented
  in the existing asset manifest and in-app credits. No new license claim is made.

## Stage 3 integration seam

Keep `Destination`'s stable invention IDs and selection payloads, and use
`navigation.exitNursery()` rather than resetting the OS. Replace the station
preview within `Nursery.tsx` with the approved immersive gameplay. Dispatch
`{ type: 'repair', id: 'lullaby' | 'nightlight' | 'courier' }` only after real
completion; the idempotent reducer updates stars, dashboard and final secret.
Do not mark memories or preview selections as repaired inventions.

Human approval is the next gate. Stage 3 has not been started.
