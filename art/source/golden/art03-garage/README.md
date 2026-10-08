# ART-03 Garage production candidates

**READY FOR OWNER VISUAL REVIEW — 2026-10-08.** Both registry statuses remain `planned`; ART-03 Garage and M0 remain IN PROGRESS.

[Review page](review.html) · [Report](REPORT.md) · [Validation](validation.json) · [Preparation plan](../art03-garage-concept/production-preparation/PLAN.md)

## Authority and editable sources

The owner-selected [garage-b-tight](../art03-garage-concept/single-image-review/garage-b-tight.png) is the sole composition reference. Concept exploration remains closed. The recovery request explicitly authorizes Aseprite CLI + Lua pixel authoring; it supersedes the previous GUI-only blocker assumption for this pass.

- [env_garage_wall.aseprite](env_garage_wall.aseprite): 216×427, seven editable layers: sky, distant yard, rear fence, ground, supports/beams, patched roof, hanging lamp.
- [env_garage_lift.aseprite](env_garage_lift.aseprite): 136×20, two editable layers: bridge/braces and rollers.
- [author.lua](author.lua): retained first-pass drawing recipe. Coordinates are hand-specified pixel clusters traced from the selected composition. Aseprite performs the pixel drawing, layering, master save and export. No image generation, random texture, automatic nearest-color quantization or external raster authoring.
- [palette.lua](palette.lua): mechanically derived canonical swatches from palette.ts; no palette expansion.
- [tool-verification.json](tool-verification.json): Aseprite/PixelLab probe evidence and exact capability limits.

**Editable masters are authoritative after creation.** Re-running author.lua deliberately replaces them. Use export.ps1 for normal export of later Aseprite edits. Preparation/review helpers do not author production pixels.

## Intentional palette mapping

| Reference material | Canonical mapping | Cleanup |
|---|---|---|
| Smooth blue daylight / pale horizon | sky_outskirts_0..3 | Broad stepped opaque bands; no RGB ramp or noisy dithering |
| Patched gray/brown canopy | steel_0..2, dust_0..1, rust_1, ink_2 | Measured stepped plate contours, sparse seams, coherent patches; two retained right-hand daylight gaps |
| Distant yard | steel_2..3 against sky_outskirts_2 | Simplified shelter/salvage silhouettes; no texture noise |
| Rear panel fence | dust_0, steel_0..2, sparse dust_1 | Continuous boards restored behind vehicle/exhaust occlusion |
| Ground | steel_0, peripheral dust_0 and ink_2 | Quiet continuous apron; no purple UI band, rig or car shadow baked in |
| Lamp | steel/ink housing, dust_1/3/4 light | Small opaque clusters, no smooth glow or animation |
| Roller rig | steel, rust and ink ramps; sparse yellow_0/dust accents | 10px visible profile in 20px cutout canvas; end caps and contact bands |

Wall uses 14 canonical colors. Lift uses 12. Teal is reserved for the real vehicle. Right/upper-right material highlights follow the ART-01 vehicle; background contrast and detail stay subordinate.

## Registration and semantic ownership

Full canvas 216×427; centered safe crop (18,69,180,288); selected 180×218 core origin (18,104). Body/engine origin (52,227). T1 24×24 wheel frame origins (66,259) and (126,259); centers (78,271)/(138,271). Lift origin (40,281); top contact y281. Rig visible bounds x1..134/y0..9, with ten fully transparent bottom rows.

Wall has opaque ground/fence behind the independent rig and vehicle. Neither export includes any car, wheel, engine, exhaust, telemetry, HUD, navigation, checkpoints or text. The production Lua never reads vehicle pixels. [Layered review composition](review/composition.aseprite) holds read-only copies of the exact approved vehicle exports separately, with hidden guides. Its flattened pixels equal the clean review.

The 12 engine-tier/wheel-frame combinations in [contact evidence](composition-validation.json) preserve all vehicle pixels and have tread/roller contact. [Contact sheet](review/engine-wheel-contact.png): columns Engine T1–T3, rows wheel frames 0–3. No runtime animation or exhaust effect is implemented.

## Reproduction

Run from repository root:

```powershell
# Normal candidate export: reads masters, never reauthors them.
& art/source/golden/art03-garage/export.ps1
node --import tsx/esm art/source/golden/art03-garage/review.ts
node --import tsx/esm art/source/golden/art03-garage/verify.ts
npx tsc -p art/source/golden/art03-garage/tsconfig.json --noEmit
npm run validate:assets -- --stage production --phase proof_c
npm run check
```

export.ps1 accepts `-Aseprite <path>`. It uses a temporary process-local preferences directory to avoid loading user extensions. This follows the [official preferences-folder mechanism](https://www.aseprite.org/docs/preferences-folder/). Pixel/layer APIs follow the official [Image](https://www.aseprite.org/api/image) and [Sprite](https://www.aseprite.org/api/sprite) documentation.

For deliberate first-pass regeneration only, pass absolute `out` to author.lua using Aseprite `--batch --script-param out=... --script .../author.lua`. prepare.ts creates reference guides and palette.lua; it never replaces an existing preservation baseline. review-masters.lua takes absolute `root` and `out`; verify-masters.lua takes absolute `out` and `runtime` and proves reopened-master/export equality.

## Review limits

Safe crop first: inspect car dominance, roof/lamp identity, wheel contact, palette translation, extra safe-area head/floor space and provisional UI breathing room. Full canvas has intentionally non-critical atmosphere above and ground below. Guides are reservations only, not accepted controls or touch targets. No owner visual approval, Phaser/viewport/motion proof or final asset acceptance is implied.

## Repository gate conflict retained explicitly

Pixel dimensions, opacity/cutout, canonical palette and reopened-master/export equality pass. The actual project asset validator rejects runtime files recorded as planned with two status-mismatch errors. Therefore both production proof_c validation and npm run check currently exit 1. Registry statuses are intentionally unchanged because the owner said not to promote lifecycle. No validation rule was weakened. Typechecks, all 250 tests, data checks, separately run audio/simulation/build and source checks pass. The normal next evidence-based status would be draft or technical under D11, but that transition was not performed.
