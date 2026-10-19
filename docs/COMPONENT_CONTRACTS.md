# Shared component contracts

## DREAM.EXE Stage 1 replacement contract
The operator explicitly authorized a from-scratch DREAM.EXE rebuild on `feat/stage3-visual`.
The former scroll-journey contracts below are historical and remain valid only for the
disconnected legacy components. The new runtime uses `src/os/DreamOS.tsx`, the central
registry in `src/apps/registry.ts`, and the window reducer in `src/state/windows.ts`.
See `docs/NAVIGATION_CONTRACT.md` for the authoritative new interfaces. B-owned
`src/components/interactive/` and `src/hooks/` are not modified or imported by this runtime.
The original source is preserved; no legacy implementation or screenshots serve as a design template.

## Tech
React + TypeScript, Motion for React, CSS variables from one global tokens.css. Prefer zero runtime dependencies beyond approved stack. Types are initially created in src/types.ts by Hermes A. Update this document before a breaking contract change.

## App owned by Hermes A
Shared app state: activeProject: "lullaby" | "nightlight" | "delivery" | null; mood: "day" | "night"; muted: boolean; secretOpen: boolean. App composes hero, origin scenes, project launcher, project panel, Goodnight.

## D1 components
DesktopShell({mood,children}); DesktopDock({activeProject,onOpenProject}); ProjectWindow({title,open,onClose,children}); Hero({mood,children}); OriginStory(); Goodnight({children}). Components should be keyboard operable; ProjectWindow handles Escape/focus if modal, otherwise use in-flow expanding panels.

## D2 components
PipCharacter({mood,interactive?}); LullabyLab({muted,onPlaySound?}); NightlightLab({muted,onPlaySound?}); DreamDelivery({muted,onPlaySound?}); MoodSwitch({mood,onChange}); AudioToggle({muted,onToggle}); SparkleTrail({enabled}); MoonSecret({onDiscover}).

## Audio ownership
One audio controller in src/hooks/useAudio.ts. Browser audio context must start on explicit user input; master mute state comes from App. Stop playback on close/unmount. Never start sound without a visible mute toggle.

## Interaction expectations
Pip: pointer tilt with touch fallback. Nightlight: relative-coordinate radial mask following pointer/touch, with button fallback. Dream route: SVG path in one fixed viewBox, star moving from nursery to selected house. Secret: 3 moon activations, plus visible hint for discovery.

## Integration protocol
Hermes B creates independently compiling components and exports them; Hermes A imports/components without rewriting B's source. If a prop or layout contract needs changing, record the proposal in PR and explicitly confirm. Hermes B can use its own demo/harness locally within owned files but must not create another app shell or design system.
