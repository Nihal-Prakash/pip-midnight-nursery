# Stage 3 visual and integration audit

Branch: `feat/stage3-visual`, base: `origin/master` (6ad7afb). No branches merged or rebased.

## Evidence

- Actual integrated application at 1440×900: `desktop-{welcome,origin,workshop,lullaby,nightlight,delivery,goodnight}.png` and `desktop-contact-sheet.png` in this directory.
- Actual integrated application at 390×844: `mobile-{welcome,origin,workshop,lullaby,nightlight,delivery,goodnight}.png` and `mobile-contact-sheet.png`.
- Stage 2 baseline from a detached worktree of `origin/master`: `{desktop,mobile}-before-{welcome,workshop}.png`. The baseline workshop image shows the noninteractive Lullaby preview; the Stage 3 frame shows the working controls in the same window. The welcome layout remains intentionally recognizable; Stage 3 makes the portrait interactive and adds the Goodnight cameo, not a wholesale redesign.
- `walkthrough.webm`: actual continuous Chromium capture, 1280×720, 17.08 seconds, from Welcome through Origin, three project windows, and the third moon wish. No synthetic frames.
- `runtime-check.json`: Chromium checks at 1440×900, 768×1024, 390×844, and 320×700. Captures were made with reduced motion enabled; the recording used normal motion.

## Visual judgment

- **Consistency:** the three B-owned projects are mounted inside the existing single porcelain/plum window rather than inside second framed cards. Launcher, panels, and copy use the same cream/lavender/blush palette; Nightlight and Dream Delivery retain a midnight scene inside that frame.
- **Lighting:** the first Origin star becomes Pip's lantern and then a constellation; the Nightlight room reuses the warm light motif. Warm star and moon glows connect the hero and the final scene. No particle layer or scroll hijacking was added.
- **Typography:** the existing serif scene headings and system-sans UI/copy remain. Project chrome adopts the existing window-bar scale. Font-family licensing is not finalized in the visual bible; only local system fonts are used.
- **Section transitions:** original gradient handoffs and star motifs stay intact. Windows retain a short Motion entrance but close immediately so interactive audio cannot linger in an exit animation; Origin scenes retain their in-view entrances. Reduced-motion preference disables entrances/animation and smooth scrolling.
- **Character:** the interactive Pip occupies the established hero portrait area. Since the B component's final URL is absent, A-owned CSS shows the checked-in official portrait as its fallback. The same portrait appears as a small dimmed Goodnight cameo. It has an opaque warm background and embedded “Pip” lettering; no new character artwork was introduced. The cameo evokes sleep but uses the awake-eyed official image, not a distinct approved sleeping pose.
- **Mobile composition:** full-width project panels and fixed bottom launcher were exercised at 390 and 320 px. No horizontal overflow in any of the four checked widths; the launcher remains clickable from Goodnight and moves focus into the panel. Fixed settings controls may temporarily cover the lower-left of the Goodnight secret note; scrolling exposes all text. This is a remaining polish issue, not a hidden control.
- **Missing artwork:** all 16 paths in `docs/ASSET_MANIFEST.md` are absent from `public/assets/`. Official local portrait, CSS lantern/musicbox and the B-owned room SVG stand in; B's inline SVG map stands in for final dream-map art. Final art format/transparency/crops cannot be signed off before delivery. No generated images were substituted.

## Integrated behavior and verification

App continues to own `activeProject`, `mood`, `muted`, `secretOpen`. Mounted components: `PipCharacter`, `LullabyLab`, `NightlightLab`, `DreamDelivery`, `MoonSecret`, `AudioToggle`. One project mounts at a time; closing via button or Escape removes it and returns focus to its launcher. Lullaby Web Audio context was observed `closed` after the project closed; mute toggles the running loop. Nightlight button and arrow-key beam, Dream Delivery house/route, day/night toggle, and three-wish reveal were exercised. One visible mute control and one visible moon/reveal are present. Interactive markup smoke test passed. Chromium reported no uncaught JS errors or console errors; see the network caveat below.

## Asset/B-owner follow-up — blocking clean-network acceptance

The B-owned `PipCharacter.tsx:55` unconditionally requests `/assets/character/pip-hero.webp`, and `DreamDelivery.tsx:68` unconditionally requests `/assets/projects/dream-map.svg`. On the Vite dev server missing files return the HTML SPA fallback with HTTP 200, *not image content*. Every viewport made both invalid-content requests even though CSS/React display fallbacks look correct. Thus “no broken asset URLs” is **not yet met**. Exact requested B change: gate each optional final image on a known available asset (or import a shipped local fallback); do not request the final URL until the asset-operator delivery exists. Keep the SVG fallback map and official-character fallback visible without a failed request. B-owned CSS also names absent `musicbox.webp`, `nightlight-room.webp`, and `secret-dream.webp`; A-owned scoped overrides prevent browser CSS requests in current scenes, but Vite still emits unresolved-URL warnings during build. B should gate those backgrounds when art lands. `MoonSecret` also owns a decorative reveal div; A hides that div to keep App's `secretOpen` note as the single visible reveal. Preferred B contract change if touched later: allow the reveal decoration to be disabled by prop, keeping the three-wish callback intact. No B source files or hooks were edited here.

No final Gemini asset, sleeping pose, real touch-device gesture, or final deployment was visually verified. The Playwright touch-sized viewport is not a physical-device touch test.
