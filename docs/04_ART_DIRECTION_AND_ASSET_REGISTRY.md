# Art Direction and Visual Identity

This document defines exactly what Scrap Car Runner looks like and constraints for creating assets. It acts as the source of truth for both human and AI artists.

## 1. Visual Identity & Pillars

**Identity Statement:** 
> Chunky handmade scrapyard engineering + cheerful improvised machinery + dusty roadside travel + high-contrast readable mobile silhouettes + mechanical UI built from stamped plates, gauges, and workshop labels.

**Visual Pillars:**
1. **Chunky & Legible:** Pixel details must remain distinct on mobile. No single-pixel noise.
2. **Improvised & Scrappy:** Cars look patched together with asymmetrical bolts, rust, and exposed machinery.
3. **High-Contrast Lighting:** Silhouettes must pop against the background (WCAG contrast minimums enforced via the palette).
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

- **UI Icons (Parts/Stats):** Authored at **32x32**.
- **Chassis Base:** Authored at **128x64** bounding box (leaves room for attachments).
- **Wheels/Tires:** Authored at **32x32** (for visibility against the dusty road).
- **Backgrounds:** Authored at **360x320** (tiled horizontally).
- **Anti-aliasing:** ABSOLUTELY NONE. Strict nearest-neighbor rendering.
- **Palette:** Assets must STRICTLY use colors from the 9-ramp master palette (`src/game/assets/palette.ts`).

## 4. Camera and Presentation Angle

- **Game/Road View:** Pure **Side View**. The car faces and travels right.
- **Garage View:** Same side view for the car to reuse assets, but UI overlays heavily to present the "workshop" feel.
- **UI Parts:** Orthographic/flat presentation for inventory icons.

## 5. Installed-Part Visual Philosophy

**Strategy: Selective Visible Upgrades**
Fully visualizing every tier of every part creates a combinatorial explosion. Therefore:
- **Tires:** Fully visible. Equipping tires changes the wheel sprites.
- **Engine/Cooling/Fuel/Suspension:** Visualized primarily in the Engineering UI as detailed 32x32 icons.
- **Chassis:** Defines the base `veh_[name]_body` sprite.

## 6. Asset Registry

The source of truth for asset requirements is no longer this markdown file.
It has been moved to a machine-readable TypeScript registry:
`src/game/assets/assetRegistry.ts`

This registry enforces naming, dimensions, alpha contracts, and binds assets directly to game data (`src/data/`). Run `npm run validate:assets` to verify coverage.
