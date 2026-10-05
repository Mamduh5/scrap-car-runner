# Asset Production Workflow

This document defines the canonical strategy for generating, validating, and importing production visual assets for Scrap Car Runner.

## 1. AI-Assisted Art Pipeline

AI cannot output production-ready pixel art directly. The workflow is strictly quality-gated:

1. **Canonical Briefing:** Write a brief utilizing the visual pillars ("chunky handmade scrapyard").
2. **AI Generation (Concept):** Generate reference material or pseudo-pixel drafts.
3. **Manual Pixel-Art Cleanup:** The AI output MUST be manually traced/redrawn in Aseprite to align to the master palette in `src/game/assets/palette.ts` for palette-mode assets; preserve registered grayscale/tint contracts for fonts and selected effects.
4. **Export:** Export as strict indexed/RGB `.png` (no color management chunks).

**Forbidden:** Dropping unedited AI outputs into the game.

## 2. The Golden Reference Set

Before full production begins, a **Golden Set** of assets must be fully produced and approved.
These assets act as the baseline against which all future assets are measured.

Golden membership is defined solely by `isGolden()` in [assetRegistry.ts](../src/game/assets/assetRegistry.ts): every `proof_*` entry. The current required set is **22 entries**, not five representative examples. The exact ID checklist is the registry-derived execution snapshot in [D14 §21](14_IMPLEMENTATION_AND_PROJECT_MANAGEMENT_PLAN.md#21-visual-production-plan); the registry takes precedence if that snapshot drifts.

- **`proof_a` — eight:** Rustbucket base body; all Engine T1/T2/T3 installed overlays; T1 tire wheel sheet; all Engine T1/T2/T3 inventory icons. Both progression ladders must be produced, not one representative tier.
- **`proof_b` — seven:** Scrap and Fuel-stat icons; plate panel; primary button (normal, pressed, disabled); slot frame (idle, selected, valid target, blocked/disabled); both registered bitmap fonts `font_display` and `font_body`. Sheet states are frames within entries, not additional Golden assets.
- **`proof_c` — seven:** Garage wall and lift; Outskirts sky, Junkyard far layer and Asphalt road; Scrap pile A; Puff effect sheet. These cover Garage composition, road layers/tiling and effect motion.

No other assets can progress beyond the `planned` state until the Golden Set reaches `approved` status.

## 3. Asset Source Structure

Assets are strictly separated into *Source* (editable) and *Runtime* (imported by Phaser):

- **Source:** `art/source/` (Contains `.aseprite`, concept art, palette files).
- **Runtime:** `public/assets/<category>/<id>.png`, plus `<id>.xml` for bitmap fonts. Use registry `runtimeFiles()` / `runtimeUrl()`; sheet exports are one horizontal strip with registered frames and no margin/spacing. Audio has separate ownership under `public/assets/audio/` (D13).

## 4. Animation Strategy

- **Runtime Transforms:** Chassis bounce may use Phaser transforms/tweens. Wheels use the registered authored four-frame cycles; do not rotate low-resolution wheel textures in code.
- **Sprite Sheets:** For complex deformations (smoke, engine vibrations), export strict horizontal sprite sheets from Aseprite.

## 5. Shader Strategy

- **Policy:** Shaders are for **optional visual enhancement only**.
- Gameplay must never depend on a shader for readability.

## 6. Technical Validation (The Gate)

No asset reaches `technical` without asset-specific technical evidence, and technical success does not mean art approval.

Current tool: `tools/assets/validateAssets.ts`. The registered `npm run validate:assets` command currently does not invoke validation; VAL-01 owns its repair. Do not use a zero exit from that command as production evidence until VAL-01 acceptance passes.

The technical contract covers registry integrity/data coverage, exact image/sheet dimensions, per-entry alpha/color/margin/frame contracts, palette membership for palette-mode assets and bitmap font files. Grayscale/soft-alpha exceptions are explicit registry contracts, not permission to weaken other entries. Automated checks do not judge artistic quality, contrast in composition or actual Phaser rendering.

### Staged validation expectations (VAL-01 implementation)

- **Preparation:** Check available contract/input integrity and report missing production files honestly. A preparation pass neither proves asset presence nor advances asset approval.
- **Stage-specific production:** Enforce required inputs for the selected production batch, including exact Golden membership where applicable, while preserving full registry/data integrity. Missing/invalid stage inputs fail; unrelated future batches remain outside that stage’s presence requirement.
- **Full/release:** Enforce the complete required registry set, applicable approval statuses and locked palette. Optional entries do not silently become required.

These are acceptance contracts; VAL-01 owns command/report/staging details. Reports must state the scope proven. A preparation pass MUST NOT be representable as production approval.

## 7. Approval Pipeline

[ASSET_STATUSES](../src/game/assets/assetRegistry.ts) defines the sequence:

`planned → draft → technical → visual → ingame → approved`

1. `planned`: Requirement registered; production work has not advanced.
2. `draft`: File/source created; technical acceptance has not yet been established. File existence is not validation.
3. `technical`: Applicable asset-specific export checks passed; ready for visual review.
4. `visual`: Actual-size art-direction review passed, including progression and relevant combinations.
5. `ingame`: Real Phaser loading, frames/fonts, composition/motion and viewport behavior proved.
6. `approved`: Required technical, visual and in-game evidence accepted by the owner; final asset approval recorded truthfully.

Do not collapse file creation, technical validation, visual review, in-game proof and final approval. The palette remains provisional until Golden approval; full production approval requires its lock. D14 §21 governs batch sequencing, and every non-Golden entry stays `planned` until all 22 Golden entries are `approved`.

## 8. Stale source/tool references

There is no `docs/13_VISUAL_QUALITY_AND_ART_ACCEPTANCE.md`; D13 is audio direction. Visual identity is D04, approval lifecycle is this document, and execution/proof requirements are D14. Legacy references in registry/validator/palette comments do not establish another visual contract.

`tools/validate-assets.ts`, `tools/contact-sheet.ts`, `tools/write-palette.ts`, the `assets:palette` package script and `art/palette/scrap-master.gpl` are absent. The real visual validator module is `tools/assets/validateAssets.ts`; `palette.ts` defines colors and provides `renderGpl()`, but no export CLI exists. Contact-sheet/export automation is future tooling, not a usable current command. VAL-01 owns necessary gate/palette tooling and correction of stale tool/comment references within its scope. DOC-01 does not create those tools or edit source comments.
