# DREAM.EXE — Stage 1 product specification

## Authority and scope

The operator's DREAM.EXE Stage 1 brief explicitly authorizes replacing the old PipOS scroll-portfolio journey with an interactive fictional operating system. This document and NAVIGATION_CONTRACT.md supersede the historical runtime design in PRODUCT_FLOW.md and the historical contracts below the replacement notice in COMPONENT_CONTRACTS.md. VISUAL_BIBLE.md's canonical character, palette, coherent visual language and native interface text remain intact. The feature branch for this work is `feat/stage3-visual`; no merge, rebase, push or deployment is part of the delivery.

Implementation starts from the brief and supplied artwork, not from old application screenshots. Legacy components, styles, hooks and App.tsx are preserved but disconnected from the new entry point. Other owners' source files are untouched.

## Experience

DREAM.EXE is Pip's personal computer at the Midnight Nursery. Pip remains a friendly baby with a skull face and the profession Junior Dream Engineer. Three dreams have escaped. The visitor explores Pip's computer to learn about the three missing dreams and the inventions that will eventually repair them.

1. First visit: a CRT-framed computer boots, with real HTML logo text, flickering stars and a real progress element. The roughly 3.6-second sequence ends with `ERROR: THREE DREAMS HAVE ESCAPED.` and `ENTER DREAM.EXE`.
2. Skip intro is always immediately available. Entry records `visited`; subsequent visits start at the desktop. Settings can replay the intro. Reduced motion makes boot immediately ready.
3. Desktop: supplied cosmic wallpaper; twelve supplied illustrated icons arranged in two columns; a cream/lavender note window; Pip on a cloud; a handwritten-style music-box reminder; a glossy taskbar. All actions and text are native HTML/CSS.
4. Launch an app by click, double-click, tap, Enter or Space. Each app has one independent window. Repeated activation restores/focuses it instead of spawning duplicates.
5. Desktop windows support pointer drag, resize, focus, stacking, minimize/restore, maximize/restore and independent close. Keyboard alternatives are provided. Return Home minimizes windows without discarding their content.
6. Mobile: the wallpaper switches to the supplied portrait version. Desktop icons form a scrollable three-column arrangement. Windows become large fixed sheets above the taskbar; only the frontmost non-minimized sheet is exposed. The rest are retained and accessible through Start/taskbar. Dragging/maximizing is intentionally not offered on touch sheets.

## Application destinations

| App | Stage 1 content | Later scope |
|---|---|---|
| My Dreams | Three missing-dream dossiers; links to the three inventions; truthful 0/3 status | Real repair progression |
| About Pip | Canonical intro, supplied Pip illustration, diary link | Deeper story |
| Dream Diary | Pip's first entry and a device-local visitor note | Additional entries |
| Lullaby Lab | Purpose-built music-box invention preview | Full app in Stage 2; game in Stage 3 |
| Nightlight.exe | Purpose-built lantern invention preview | Full app in Stage 2; game in Stage 3 |
| Dream Courier | Purpose-built delivery invention preview | Full app in Stage 2; game in Stage 3 |
| Telescope | Supplied observatory artwork and three named sky-log selections | Interactive observatory |
| Toy Cabinet | Supplied workbench artwork and a toggleable keepsake tag | Collectibles |
| Dream Gallery | Two supplied art postcards, independently selected | Expanded collection |
| Terminal | Safe fictional command parser: help, whoami, dreams, nursery, starlight, clear | More story commands |
| sweetdreams.exe | Nursery artwork and explicit Stage 3 portal boundary | Immersive nursery |
| Lost Dreams | Supplied nursery art and a link to missing-dream files | Recovered dreams |

Settings is a thirteenth system-only destination, not an extra desktop icon. No mini-app claims a completed repair; future gameplay is not fabricated.

## Visual and interaction system

- Palette: cream `#FFF4E7`, blush `#F5C9DC`, lavender `#C9B6E7`, starlight `#FFE5A0`, plum `#81638E`, midnight `#25233F`, with tonal derivatives.
- Typography: local Georgia for expressive headings, Courier New/monospace for computer labels, Trebuchet MS/Arial/sans-serif for UI. System fallbacks, no font downloads or unverified font licenses.
- Chrome: the supplied reference sheets inform cream bodies, lavender title bars, gold/blush buttons, fine borders and inset highlights. Reference boards and baked controls are never used as working UI.
- Actual art filenames and decoded dimensions are in ASSET_MANIFEST.md. Runtime copies retain original bytes and aspect ratios. Wallpapers intentionally use cover framing; other illustrations use contain.
- Motion: Motion for entrance/boot transitions; CSS hover depth and sparse twinkle; small RAF wallpaper parallax. Reduced motion takes priority over preferences.
- Cursor: one bounded eight-particle RAF trail, distinct active/drag/secret modes, disabled for coarse pointers and reduced motion. Native pointer remains usable if enhancement fails.
- No Three.js, R3F, UI kit, particle engine, router, backend, auth, external fonts or production deployment. Existing runtime dependencies suffice.

## System behavior

Start exposes all applications, settings/credits and Return Home. Taskbar indicates running/minimized apps and restores focus. The clock is actual browser-local time, not a decorative fictional counter. Notifications are dismissible, announced through one live region and expire after six seconds; newer messages replace older ones.

Mute defaults on. Only user button interaction can activate Web Audio. A short synthesized UI chime uses one AudioContext and a master gain; mute silences that gain. There is no ambient audio or supplied recorded audio. Settings also toggles cursor/atmospheric effects. OS-level reduced-motion preference cannot be overridden.

## Accessibility and input

- Semantic buttons, headings, navigation, labeled non-modal dialogs, textarea, input and progress.
- Visible focus rings. First window focus goes to its titlebar; close/minimize transfers to the next visible window or the originating desktop launcher (Start for settings).
- Escape: dismiss Start first, otherwise close the front window. Alt+PageDown cycles visible windows.
- Focus titlebar, then Arrow keys to move; Shift+Arrow keys to resize. Buttons expose minimize/maximize/restore/close names. Titlebar double-click toggles maximize.
- Mobile sheets retain desktop rectangles for resizing back to desktop. Underlying desktop content and inactive sheets are inert while a mobile sheet is open. Taskbar/Start remain usable; no false modal focus trap.
- Touch buttons remain practical; core sheet controls are 42px square, taskbar controls at least 40–44px tall. No hover-only required action.

## Deliberate limits / handoff

- Stage 1 only. App contents are tailored previews; nursery, repairs, meaningful earned progression and 3D are later stages.
- Window geometry and app selections persist for the current OS session, including close/reopen for centrally stored app data. Only preferences, visited state and diary persist across reloads.
- Original art has some imperfect alpha edges. Other sticker exports contain neighboring fragments; these are not used. Rights/artist attribution for operator-supplied derivative artwork require confirmation before public release.
- Verification is Chromium on Linux, including touch and reduced-motion emulation. Physical mobile devices, Safari/Firefox, screen-reader behavior and subjective audio quality still need human validation.
- The mobile desktop intentionally scrolls; all twelve icons need not fit in the first viewport.
- Legacy disconnected source is retained to respect ownership, not offered as an alternate visual experience.

Stage 2 requires human approval. Do not extend the games or deploy on the strength of Stage 1 checks alone.
