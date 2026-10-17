# Asset pipeline and authoritative filenames

## Authoritative delivery path
All approved final assets live in public/assets/. No remote Gemini links in app code. Commit assets through assets/gemini PRs; keep a local source-art archive outside the app if source artwork is large.

## Manifest (initial set)
- character/pip-hero.webp: official-derived character art, transparent, portrait, high priority.
- character/pip-story.webp: consistent Pip pose, high priority.
- scenes/desktop-bg.webp: large desktop background, high priority.
- scenes/desktop-bg-mobile.webp: mobile-safe composition, high priority.
- scenes/origin-star.svg: simple editable star artwork, high priority.
- scenes/origin-workshop.webp: origin illustration, high priority.
- projects/musicbox.webp: lullaby illustration, high priority.
- projects/lantern.webp: lantern illustration, high priority.
- projects/nightlight-room.webp: ONE base illustration used for both light/dark rendering, high priority.
- projects/dream-map.svg: fixed-viewBox scene with anchor coordinates, high priority.
- ui/icon-lullaby.svg, ui/icon-nightlight.svg, ui/icon-delivery.svg: matching icon family, high priority.
- ui/star.svg, ui/moon.svg: small matching motifs.
- easter-egg/secret-dream.webp: secret illustration.

## Generation consistency protocol
Start with official Pip portrait and a single signed-off style reference. For EACH subsequent generated scene, reuse those inputs as references and reiterate consistent Pip anatomy, shape, cap, lighting, materials, edge treatment and palette. Reject inconsistent characters rather than trying to hide them in CSS.

## VERY IMPORTANT: Nightlight alignment
Do NOT ask Gemini to separately regenerate a dark and light room. Independent generation often shifts objects. Generate ONE light/base room scene. In CSS place that identical image as a masked bright layer over the same image darkened by CSS. This guarantees pixel alignment.

## Exports
No text or UI labels baked into art. Separate independently animated layers where practical. SVG for maps and icons; optimized WebP for backgrounds and raster figures. Document dimension or viewBox, transparency, version, source, and license/attribution. Keep image formats readable across target browsers.

## Gemini handoff
The operator reviews generation, renames file to manifest name, checks crop/transparency, previews on desktop/mobile, uploads via assets/gemini branch. Each asset PR includes a preview collage plus what it replaces. Hermes A merges, then Hermes B updates feature branch from main.

## Official reference pack
https://hax.baby/baby/assets/track1-pip-asset-pack.zip
https://hax.baby/baby/assets/pip_portrait.png
https://hax.baby/baby/assets/pip_avatar_cloud.png
https://hax.baby/baby/assets/pip_lullaby_box.png
https://hax.baby/baby/assets/pip_dream_lantern.png
