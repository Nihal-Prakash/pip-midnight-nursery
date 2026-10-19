# DREAM.EXE — navigation and state contract

## Entry and ownership

`index.html` → `src/main.tsx` → `src/os/DreamOS.tsx`.

DreamOS is the single system coordinator. There is no URL router: the website is one fictional desktop, not twelve independent pages. App windows are individual destinations inside it. Browser Back is not an app-window history operation. Original `src/App.tsx` and `src/components/` are not imported by the entry point.

Files:
- `src/apps/registry.ts`: app definitions and props.
- `src/apps/views.tsx`: twelve independent content components plus system settings.
- `src/state/windows.ts`: window reducer, public IDs/destination types and guarded localStorage helpers.
- `src/os/AppWindow.tsx`: reusable native chrome and pointer/keyboard geometry interactions.
- `src/os/Boot.tsx`: isolated opening sequence.
- `src/os/Cursor.tsx`: single coordinated pointer enhancement.
- `src/assets/dream.ts`: explicit original filenames, never guessed paths.
- `src/os/dream.css`: disciplined `dx-`/`dream-os` styling, no old styles imported.

## Registry contract

Each `AppDefinition` contains:
- `id: AppId` — stable key.
- `label: string` — accessible visible name.
- `icon: string` — verified supplied asset URL.
- `launch: 'window'` — all Stage 1 launchers open/focus a window.
- `window: { width, height }` — initial desktop bounds.
- `component: ComponentType<AppProps>` — distinct content implementation.
- `desktop: boolean` — twelve user apps true, settings false.
- `description: string` — brief statusbar description.

Stable IDs: `dreams`, `about`, `diary`, `lullaby`, `nightlight`, `courier`, `telescope`, `cabinet`, `gallery`, `terminal`, `sweet`, `lost`, `settings`.

Registry lookup is only called with the closed `AppId` union; user terminal text never indexes it dynamically. Future deep links must validate unknown IDs before lookup.

## App props

Each app receives `data`, `setData`, `launch`, `requestDestination`, `notify`, `muted`, `toggleMute`, `effects`, `toggleEffects`, `replayIntro`.

`data` is a small app-specific string, keyed by ID in the coordinator. The diary uses it as text; telescope uses an index; gallery uses a selection; cabinet uses tag visibility/text; terminal uses a bounded transcript. Data is independent of window mounting, so closing a window does not erase it during the session. Stage 2 can add typed app-specific structures when real functionality needs them; no speculative store is created now.

Apps must not mutate window geometry, duplicate global audio, create another cursor, use `window.location` for internal navigation, or mark a dream repaired from a preview. Use `launch(id)` for app-to-app navigation and `notify(message)` for bounded system feedback.

## Window state

`WindowState`: `{ id, x, y, width, height, minimized, maximized }`.

An ordered array is the stacking authority. The final non-minimized item is the active window. Rendered z-indices are derived from array index, not accumulated counters.

Reducer actions:
- `open { id, size, viewport }`: create once or restore an existing instance; move to front.
- `focus { id }`: restore/unminimize and move to front.
- `close { id }`: remove only that window, not its app data.
- `minimize { id }`: hide only that window.
- `maximize { id }`: toggle maximizing without mutating the stored normal rectangle.
- `move { id, x, y, viewport }`: clamp normal rectangle into usable desktop bounds.
- `resize { id, width, height, viewport }`: minimum 340×280 before viewport fitting.
- `fit { viewport }`: keep windows reachable when desktop viewport changes.
- `home`: minimize all; preserve state and running indicators.

Pointer capture and requestAnimationFrame handle dragging/resizing. The titlebar provides keyboard move/resize. Maximize geometry is responsive CSS; normal rectangle remains central reducer state. At ≤700px, CSS uses full-width fixed sheets and retains normal desktop geometry. Hidden/minimized sheets are inert and excluded from active focus.

Window content is non-modal. Focus and pointer capture bring a window forward. Focused app controls keep their focus; focus moves to the title only when it isn't already inside that window. Escape closes only the top window. Return Home focuses the first desktop launcher.

## Stage 3 reserved destination boundary

The exported discriminated union is:

`{ kind: 'nursery' } | { kind: 'game'; game: 'lullaby' | 'nightlight' | 'courier' }`

`requestDestination(destination)` is the only reserved nursery/game handoff. In Stage 1 it sends an explicit not-yet-available toast and does not fabricate navigation or earned progress. Stage 3 can replace that implementation with the actual nursery/game scene, return-home state and verified completion handling. No unused renderer or empty game directory is created now.

Suggested future constraint: a game completion should report the stable game ID, be idempotent, and update central repaired-dream state only after a real completion condition. This is a future contract recommendation, not implemented progression.

## Persistence

Guarded keys in localStorage:
- `dream-exe:visited`: boolean; skip first-visit boot when true.
- `dream-exe:muted`: boolean, default true.
- `dream-exe:effects`: boolean, default true.
- `dream-exe:diary`: string; textarea limit 2,000 characters.

Malformed JSON, wrong primitive types, denied storage and quota errors use safe in-session fallbacks. No user data is transmitted. No credentials or personal account data are stored. Desktop geometry, selections and terminal transcript reset on full reload. Terminal transcript is bounded at 8,000 characters; commands never execute a shell, evaluate JavaScript or inject HTML.

## Keyboard and mobile contracts

- Buttons: native Tab / Enter / Space behavior.
- Titlebar: Arrow keys move; Shift+Arrows resize.
- Escape: Start menu first, then active window.
- Alt+PageDown: cycle visible windows.
- Start: ArrowUp/ArrowDown, Home/End, Escape; native buttons rather than incomplete ARIA menu semantics.
- Touch: tap to open, fixed large sheets, minimize/close, horizontal running-app taskbar; no desktop-size window miniatures.
- Reduced motion: instant ready boot, disabled pointer trail/parallax/twinkles and interface animation.

## Verification and boundaries

`npm run test:stage1` exercises the pure reducer and storage guards without a new test framework. `scripts/check-stage1-browser.mjs` drives actual production-preview Chromium, captures required sizes and verifies interactions, image loading and console/network errors. It takes `DREAM_URL` (default localhost:4173) and optional `PLAYWRIGHT_MODULE` for an externally installed Playwright module; no runtime dependency is added.

Keep tests aligned to asynchronous React rendering and animation completion: immediate DOM sampling after focus restoration or entrance scaling is not a valid settled-state assertion. Desktop wallpaper deliberately overscans inside an overflow-hidden canvas; document and mobile horizontal overflow are separately checked.

No automated result substitutes for the operator's final visual approval, physical-device checks or distribution-rights confirmation.
