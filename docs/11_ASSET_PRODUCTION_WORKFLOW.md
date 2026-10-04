# Asset Production Workflow

This document defines the canonical strategy for generating, validating, and importing production visual assets for Scrap Car Runner.

## 1. AI-Assisted Art Pipeline

AI cannot output production-ready pixel art directly. The workflow is strictly quality-gated:

1. **Canonical Briefing:** Write a brief utilizing the visual pillars ("chunky handmade scrapyard").
2. **AI Generation (Concept):** Generate reference material or pseudo-pixel drafts.
3. **Manual Pixel-Art Cleanup:** The AI output MUST be manually traced/redrawn in Aseprite to align to the 9-ramp master palette (`src/game/assets/palette.ts`).
4. **Export:** Export as strict indexed/RGB `.png` (no color management chunks).

**Forbidden:** Dropping unedited AI outputs into the game.

## 2. The Golden Reference Set

Before full production begins, a **Golden Set** of assets must be fully produced and approved.
These assets act as the baseline against which all future assets are measured.

The golden set (defined in `assetRegistry.ts` via the `isGolden()` rule) includes:
- 1 Chassis (Rustbucket)
- 1 Set of Tires
- 1 Part Icon
- 1 UI Panel (9-slice)
- 1 Road Segment (Sky, Far, Ground)

No other assets can progress beyond the `planned` state until the Golden Set reaches `approved` status.

## 3. Asset Source Structure

Assets are strictly separated into *Source* (editable) and *Runtime* (imported by Phaser):

- **Source:** `art/source/` (Contains `.aseprite`, concept art, palette files).
- **Runtime:** `public/assets/` (Optimized, flat `.png` files).

## 4. Animation Strategy

- **Runtime Transforms First:** Simple animations (e.g., wheel rotation, chassis bounce) must be handled via Phaser 4 Tweens.
- **Sprite Sheets:** For complex deformations (smoke, engine vibrations), export strict horizontal sprite sheets from Aseprite.

## 5. Shader Strategy

- **Policy:** Shaders are for **optional visual enhancement only**.
- Gameplay must never depend on a shader for readability.

## 6. Technical Validation (The Gate)

No asset enters production without passing the automated technical validator.

Run: `npm run validate:assets`

The validator strictly checks:
- Exact dimensions against `assetRegistry.ts`.
- Alpha contracts (e.g., cutout transparency vs opaque).
- 100% adherence to the master palette.
- Proper margins and frame counts.
- 100% asset coverage for all parts and chassis defined in `src/data/`.

## 7. Approval Pipeline

Every asset follows this lifecycle in the `assetRegistry.ts`:
1. `planned` -> Defined, but file does not exist.
2. `draft` -> File exists, but fails technical checks.
3. `technical` -> Passes `validate:assets`, ready for visual QA.
4. `approved` -> Art direction approved, ready for release.
