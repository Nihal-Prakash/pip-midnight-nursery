# PipOS — Mandatory Project Instructions

This is the haX.baby 2026 Track 1 portfolio for Pip, the canonical skull baby Junior Dream Engineer at the Midnight Nursery. Deadline: 19 October 2026 17:17 IST.

## Read before writing any code
- docs/PRODUCT_FLOW.md
- docs/VISUAL_BIBLE.md
- docs/COMPONENT_CONTRACTS.md
- docs/ASSET_MANIFEST.md
- docs/INTEGRATION.md
- Your assigned docs/roles/ file (specified explicitly by the operator)

## Non-negotiable outcome
Build a single visually coherent website: a cozy, early-2000s magical computer called PipOS. Story progression: Welcome > Origin > Workshop > Goodnight. The workshop contains three projects: Lullaby Lab, Nightlight Collection, Dream Delivery. Avoid unrelated layouts/styles in different components.

## Track 1 canon
Pip retains name, baby age, skull face, friendly gentle personality, and profession as Junior Dream Engineer. Pip narrates the site. Required: character intro, >=3 projects, visual/scroll story, reactive immersion, mobile interaction, hidden Easter egg; credit all art/audio/libraries. If audible, always have a working mute control.

## Technical contract
React + TypeScript + Vite + Motion + CSS + SVG, frontend only. No new framework, UI library, backend, 3D or auth without explicit approval. Mobile is a first-class experience. Prefer semantic HTML, accessible buttons, reduced-motion fallback and high performance.

## Ownership and safety
- Hermes A: src/App.tsx, src/components/shell/, src/components/story/, src/styles/, src/types.ts, src/assets.ts, project integration, deployment.
- Hermes B: src/components/interactive/, src/hooks/ only; coordinate changes outside ownership with Hermes A via PR/issue.
- Asset operator: public/assets/, docs/art/ and docs/ASSET_MANIFEST.md asset status (never shared app source files).
- Shared source-of-truth files are controlled by Hermes A after initial sign-off. Propose changes, do not silently rewrite them.
- Work only in your feature branch; never push directly to main. Do not overwrite another owner's files.
- Do not modify `AGENTS.md` to remove restrictions. Do not commit secrets or .env files.

## Working method
Before implementation, list the intended files and interfaces. Work in small verifiable slices. Run npm run build and npm run lint before PR. Use placeholder assets with final filenames if needed. Every PR must include changed files, features demonstrated, mobile check, known issues, screenshots/preview when visual changes occur.

## Visual veto
If proposed code conflicts with docs/VISUAL_BIBLE.md or breaks the agreed journey, ask for explicit approval before modifying the visual language. Functional code with mismatched design is not done.
