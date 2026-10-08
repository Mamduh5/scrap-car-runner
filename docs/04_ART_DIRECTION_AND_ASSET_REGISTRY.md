# Art Direction and Visual Identity

This document defines exactly what Scrap Car Runner looks like and constraints for creating assets. It governs visual identity for human and AI artists. Exact asset IDs, dimensions, bindings, required/optional status and Golden membership are defined by [assetRegistry.ts](../src/game/assets/assetRegistry.ts).

## 1. Visual Identity & Pillars

**Identity Statement:** 
> Chunky handmade scrapyard engineering + cheerful improvised machinery + dusty roadside travel + high-contrast readable mobile silhouettes + mechanical UI built from stamped plates, gauges, and workshop labels.

**Visual Pillars:**
1. **Chunky & Legible:** Pixel details must remain distinct on mobile. No single-pixel noise.
2. **Improvised & Scrappy:** Cars look patched together with asymmetrical bolts, rust, and exposed machinery.
3. **High-Contrast Lighting:** Silhouettes must pop against the background (use declared palette text/background pairs and prove readability; declaring a pair alone does not enforce contrast).
4. **Tactile UI:** UI isn't floating glass; it’s stamped metal, greasy paper, and analog gauges.

## 2. Forbidden Visuals (What NOT to do)

To maintain consistency, the following are **STRICTLY FORBIDDEN**:
- ❌ Generic cyberpunk (no neon glow/lasers).
- ❌ Realistic automotive photography or car-manufacturer styling.
- ❌ Muddy brown-on-brown environments (use the defined palette ramps for contrast).
- ❌ Glossy modern SaaS / smooth vector UI.
- ❌ Dirty AI-generated pseudo-pixel textures with anti-aliasing.
- ❌ Inconsistent perspectives (e.g., mixing top-down parts with side-view cars).

## 3. Pixel-Art Resolution Philosophy

We use strict integer scaling (`Phaser.Scale.NONE` with computed zoom based on DPR and safe area).

- **Art-pixel canvas:** Flexible logical dimensions, with critical content inside the centred safe rectangle. [pixelViewport.ts](../src/game/config/pixelViewport.ts) defines the 180×288 safe rectangle and 216×427 maximum canvas. Browser QA targets 360×640 and 390×844 are CSS viewport sizes, not logical art-pixel dimensions; device pixels depend on DPR.
- **Asset dimensions:** Author each registered image/sheet to its own registry contract. Body and overlays share a registration canvas; part icons, stat icons and wheel frames have distinct sizes. Environments have asset-specific dimensions and tiling rules, not one universal background size. Read `size`, `frame`, `frames`, `tileX` and `expectedFileSize()` in the registry; do not derive export dimensions from browser QA sizes.
- **Anti-aliasing:** ABSOLUTELY NONE. Strict nearest-neighbor rendering.
- **Color/alpha:** Follow each entry’s `color` and `alpha` contracts. Palette-mode assets use [palette.ts](../src/game/assets/palette.ts); grayscale assets (including fonts and selected effects) are tinted at runtime. Soft alpha is permitted only where registered. The palette remains provisional until Golden approval.
  - **ART-03R sky exception (owner-authorized 2026-10-05):** `env_sky_outskirts` alone uses the reference RGB row ramp declared in [skyRamp.ts](../src/game/assets/skyRamp.ts). Its size, opaque alpha and tiling remain unchanged; object/UI palette rules remain intact. The optional cloud strip retains canonical palette colors and cutout alpha.

## 4. Camera and Presentation Angle

- **Game/Road View:** Pure **Side View**. The car faces and travels right.
- **Garage View:** Same right-facing side view and shared equipped-car assets as Run. The Rustbucket is the visual hero, running/tested in place in a half-open scrapyard service bay. Sparse shelter structure and small nearby Fuel / Heat / Speed support the car; detailed engineering UI belongs to its own screens (D05 §20).
- **UI Parts:** Orthographic/flat presentation for inventory icons.

## 5. Installed-Part Visual Philosophy

**Strategy: Layered Visible Upgrades**
- **Base:** One `veh_rustbucket_body` is shared by Garage and Run.
- **Engine/Fuel/Cooling/Suspension:** Each family requires a visible installed overlay for every VS1 tier. Draw overlays in place on the same canvas as the body so layers register correctly. Inventory/engineering icons complement these overlays; they do not replace them.
- **Tires:** Equipping tires selects the corresponding tier’s authored four-frame wheel sheet. Bare builds use the registered bare wheel sheet. Do not rotate low-resolution wheel textures in code.
- **Composition:** Combine the base, selected overlays and wheel sheet. No full-car sprite for every possible build is required. Preserve silhouette and legibility across combinations; changes require rendered evidence under D14 change control.

## 6. Asset Registry

The source of truth for asset requirements is no longer this markdown file.
It has been moved to a machine-readable TypeScript registry:
`src/game/assets/assetRegistry.ts`

The registry defines naming, dimensions, alpha/color contracts and bindings to game data (`src/data/`). Technical checks live in `tools/assets/validateAssets.ts`; the current command does not execute them. VAL-01 in D14 owns executable/staged validation repair. Until that task passes, `npm run validate:assets` is not coverage or production-approval evidence. See D11 for staged validation and the six-step approval lifecycle.

## 7. Garage Golden concept brief — 2026-10-07

The owner-directed Garage concept pass interprets existing asset names without changing their registry contracts:

**Current owner decision (2026-10-08):** The owner accepts [garage-b-tight](../art/source/golden/art03-garage-concept/single-image-review/garage-b-tight.png) as the selected Garage composition reference. **Concept exploration is closed.** Preserve its canopy/lamp, open scrapyard, fence/horizon, distant yard, low rollers, continuous ground and exact complete car. The [production-preparation plan](../art/source/golden/art03-garage-concept/production-preparation/PLAN.md) inspects translation into the registered wall/lift assets before any production editing/export. The 180×218 reference is a 3× display study; the additional 70 safe-area rows, palette cleanup and separate cutout rig still require production translation. Reference acceptance is not asset lifecycle approval. The owner subsequently authorized non-GUI Aseprite CLI/Lua production. Separate layered masters and exact wall/lift candidate exports now exist: [production report](../art/source/golden/art03-garage/REPORT.md) and [review](../art/source/golden/art03-garage/review.html). Both registry statuses remain `planned`; owner production visual review is pending.

- `env_garage_wall`: an opaque service-bay backdrop, with a roof/overhang, sparse support frame, hanging task lamp and short rear workshop structure. Large open gaps and subdued outdoor light establish a covered roadside mechanic station; a full enclosed wall is not the brief.
- `env_garage_lift`: a low improvised test platform / roller bed supporting the active Rustbucket, rather than a mandatory hydraulic lift. Rollers align beneath the wheels; no explanatory text is baked into the art.
- Structure frames the upper area, the equipped Rustbucket dominates the middle, and the lower support/navigation area stays calm. Keep backdrop contrast below the car, reserve teal primarily for the hero, and avoid crowded junk, a duplicated highway, large titles/logos or decorative dashboards.
- Fuel / Heat / Speed remain small nearby UI, separate from environment exports. Scrap top-left, Mail top-right and Workshop / Garage / Scavenge order are conceptual reservations from D05; exact controls, glyphs, hit areas and layout remain open.

[Garage concept review package](../art/source/golden/art03-garage-concept/README.md) contains concept references and composition review only. Generated reference pixels are not production assets; neither Garage entry advances beyond `planned`. The current production sources/exports have technical evidence under the explicitly authorized CLI/Lua workflow; owner visual acceptance and later VIS-01 evidence remain outstanding. This brief authorizes no optional foreground production, gameplay or final UI implementation.
