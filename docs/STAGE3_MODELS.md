# Stage 3 — Dream Atlas model audit

## Result and integration

`DreamAtlas({ reduced: boolean })` is exported both named and default from
`src/components/interactive/DreamAtlas.tsx`. Parent owns the nursery-only lazy
import. It uses Three.js, GLTFLoader and OrbitControls, without R3F or another
framework. Pass the effective OS/user reduced-motion setting.

**Neither supplied GLB is available. No model geometry, materials, skinning,
textures or animation have been inspected for those missing files.** The old
ASSET_MANIFEST mesh counts and absence-of-animation claims cannot be independently
verified from this checkout and are not presented as new audit findings.

| Requested asset | Actual availability | Runtime behavior |
| --- | --- | --- |
| `Pip2.0 Assets/pip-midnight-nursery/music.glb` | Missing | Disabled “Supplied music box · unavailable”; null URL, no request |
| `Pip2.0 Assets/pip-midnight-nursery/pip.glb` | Missing | Disabled “Supplied Pip · unavailable”; null URL, no request |
| Music-box study | Original procedural geometry | Real WebGL meshes, explicitly not the supplied GLB |
| Starlight globe | Original procedural geometry | Real WebGL meshes; no claim of reconstructing Pip |

The procedural studies have no skeletal rig or animation clips. The Play control
is accurately labeled **turntable**, rotating the entire group, not claiming
character animation. No replacement Pip character is fabricated.

## Recovery evidence

The archive directory is an empty Git gitlink at
`489fa664b289427173b6c0053921562977e24bce`, not a directory containing model bytes.
`git cat-file -t` cannot find that commit in the local object database.

Read-only GitHub API queries to both `ayush-gupta78/pip-midnight-nursery` and
`Nihal-Prakash/pip-midnight-nursery` returned:

- Exact gitlink tree: 61 entries, not truncated; no `.glb` files.
- HEAD tree: 279 entries, not truncated; no `.glb` files.
- Commit history filtered to `music.glb` and `pip.glb`: empty arrays.

No branch/reset/merge/submodule initialization or archive edits were performed.
No model binary was recovered or manufactured. To enable originals later, supply
the actual GLBs, inspect them, copy only verified bytes into
`public/assets/dream/models/`, and explicitly set their URLs in
`src/assets/models.ts`. Keep any material changes clearly distinguished from
original material metadata.

### Genuine clean artwork recovered

These files were available at the exact remote gitlink commit and copied without
conversion to `public/assets/dream/`. Each copied file's Git blob SHA-1 was
recomputed from `blob <byteLength>\0` plus bytes and matched the remote tree:

| Runtime basename | Source path below gitlink commit | Bytes | Verified Git blob |
| --- | --- | ---: | --- |
| `nightlight-room.webp` | `public/assets/projects/nightlight-room.webp` | 210634 | `1af5c9089a0fde3af5b9c6efd6e3f38080143c59` |
| `musicbox.webp` | `public/assets/projects/musicbox.webp` | 37250 | `deb5d9ec178d730bd08ea0d3756c86df3c2d86be` |
| `origin-workshop.webp` | `public/assets/scenes/origin-workshop.webp` | 128502 | `0cc51a93651eafd8c3da9ece2dc86043e75458ce` |
| `secret-dream.webp` | `public/assets/easter-egg/secret-dream.webp` | 133992 | `3da315a8990ff704234cf87e8e982a9a3ce367e5` |
| `dream-map.svg` | `public/assets/projects/dream-map.svg` | 7519 | `965305d83e6817eab4d670512a8bd5b77770717f` |

Source URL prefix:
`https://raw.githubusercontent.com/ayush-gupta78/pip-midnight-nursery/489fa664b289427173b6c0053921562977e24bce/`.
Recovery establishes byte provenance, not artwork licensing. Existing manifest
license/provenance limitations remain. `src/assets/dream.ts` remains parent-owned.

## Viewer behavior and lifecycle

- Native selection buttons; missing originals remain visibly unavailable.
- Drag orbit, wheel/pinch zoom; explicit left/right/up/down, zoom and reset buttons.
- Canvas keyboard: arrows orbit, `+`/`-` zoom, `Home` resets; no Escape interception.
- No automatic playback on mount. Reduced motion disables playback but preserves
  all manual controls. Normal-motion playback starts only on an explicit press.
- Genuine GLB support uses GLTFLoader; only validated nonempty positive-duration
  clips enable “animation” (first clip). Otherwise the label remains “turntable”.
- On-demand rendering when idle; RAF only during playback, suspended while hidden.
- Capped DPR, ResizeObserver, bounded 12-second model load timeout and abort on
  selection/unmount. Late GLTF completions are disposed rather than attached.
- WebGL initialization failure and context loss have useful status and retry UI.
- Disposal covers controls/listeners, observer, pending RAF/fetch/timeout,
  animation mixer, geometry, materials, material textures/image bitmaps, skin
  skeletons, renderer and WebGL context. No audio is created by the Atlas.

## Reproducible checks

```sh
python scripts/inspect-stage3-models.py --self-test
python scripts/inspect-stage3-models.py
# When genuine models arrive:
python scripts/inspect-stage3-models.py public/assets/dream/models/music.glb public/assets/dream/models/pip.glb
npm run build
npm run lint
```

The stdlib-only inspector decodes binary accessor data, rather than trusting
JSON min/max. It checks finite values, view/stride bounds, index ranges and
attribute counts; reports material/texture/image metadata; checks node skin plus
JOINTS_0/WEIGHTS_0 linkage, joint ranges and usable weights; reports animation
channels/samplers after checking timelines and output presence. Unsupported
required extensions, sparse accessors and nonstandard matrix layouts fail
explicitly instead of reporting a successful audit. It is a focused audit, not
a complete glTF conformance validator or a substitute for browser rendering.

Its self-test was run red before implementation, then green: a synthetic triangle
fixture decodes, while a nonfinite float and an out-of-range index are rejected.
These synthetic bytes are test fixtures only, never supplied/replacement artwork.
The default run accurately reports both requested GLBs as missing.

Browser harness (local QA artifact outside the repository ownership boundary):

```sh
node "$TMPDIR/dream-stage3-qa/check-atlas.mjs"
```

It uses the installed scratch Playwright package, a standalone intercepted HTML
fixture, the real component served by Vite at `127.0.0.1:4175`, and system Chromium
with SwiftShader WebGL. The fixture is not shipped as another app shell.

Verified at 1440×900 and 390×844: actual canvas image changes on rotation/zoom and
selection; reset reproduces the initial image; reduced-motion image stays still;
keyboard Home works; desktop mouse orbit and browser CDP touch pinch change the
view; normal-motion play/pause changes/stops the image; context-loss retry works;
unmount removes the canvas; no missing GLB requests or page exceptions. Mobile
has no horizontal overflow. Screenshots were visually inspected at:
`$TMPDIR/dream-stage3-qa/atlas-desktop.png` and `atlas-mobile.png` (local paths,
not uploaded attachments). Physical device, Safari and screen-reader QA remain
unverified. The supplied-GLB loading/animation path cannot be verified without
those files; procedural rendering success is not evidence that missing GLBs work.
