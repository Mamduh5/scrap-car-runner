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

No other assets can progress beyond `planned` until the Golden Set reaches `approved`, except the explicitly owner-authorized optional ART-03R cloud review described below.

## 3. Asset Source Structure

Assets are strictly separated into *Source* (editable) and *Runtime* (imported by Phaser):

- **Source:** `art/source/` (Contains `.aseprite`, concept art, palette files).
- **Runtime:** `public/assets/<category>/<id>.png`, plus `<id>.xml` for bitmap fonts. Use registry `runtimeFiles()` / `runtimeUrl()`; sheet exports are one horizontal strip with registered frames and no margin/spacing. Audio has separate ownership under `public/assets/audio/` (D13).

### ART-01 Source Workflow Exception (Owner Accepted — 2026-10-05)

The owner reviewed the ART-01 Golden benchmark (`proof_a` — 8 assets) and explicitly accepted its source-authoring deviation:
- **Authoring method:** Hand-authored procedural TypeScript source pipeline (`art/source/golden/art01/*.ts`).
- **AI content:** Zero AI-generated visual content was used.
- **Accepted editable source:** Procedural `.ts` code serves as the accepted editable production source for this batch because it delivers deterministic palette mapping, exact cutout alpha, reproducible exports, and mathematical overlay registration.
- **Scope of exception:** This owner decision applies to **ART-01 only**. It does NOT waive future source/editability requirements globally or establish a policy replacing Aseprite for future visual batches. Future visual tasks choose their authoring method based on asset requirements, D11, the Golden visual benchmark, and production evidence.

### ART-02 Source Workflow Exception (Owner Accepted — 2026-10-05)

The owner reviewed the ART-02 Golden UI benchmark (non-font `proof_b` — 5 assets: `icon_scrap`, `icon_stat_fuel`, `ui_panel_plate`, `ui_button_primary`, `ui_slot_frame`) and explicitly accepted its source-authoring deviation:
- **Authoring method:** Hand-authored procedural TypeScript pixel-art source pipeline (`art/source/golden/art02/*.ts`).
- **AI content:** Zero AI-generated visual content was used.
- **Accepted editable source:** Procedural `.ts` code serves as the accepted editable production source for this batch because it delivers deterministic palette mapping, exact binary alpha, precise nine-slice construction, reproducible exports, and predictable state/frame generation.
- **Scope of exception:** This owner decision applies to **ART-02 only**. It does NOT create a universal policy replacing Aseprite, modify the previously recorded ART-01-only exception, automatically authorize ART-03 or future batches to use the same workflow, or waive future editable-source requirements. Future batches must still follow D11 or receive their own explicit owner acknowledgement where necessary.


### ART-03R Golden Run Visual Approval (Owner Accepted — 2026-10-05)

The owner explicitly accepts the current six Run-side assets as the **Golden Run
environment visual benchmark**: `env_sky_outskirts`, `env_clouds_strip`,
`env_far_junkyard`, `env_road_asphalt`, `prop_scrap_pile_a`, `fx_puff`. Exactly these
entries advance from `technical` to `visual` under §7. They are not `ingame` or
`approved`; VIS-01 still owns real Phaser evidence. Garage wall/lift remain
planned/absent, ART-03 overall is IN PROGRESS, and M0 is IN PROGRESS.

- **Retained editable source:** Six explicit pixel grids plus the maintained
  TypeScript codec/recipes in `art/source/golden/art03/`. Four reference-led
  imagegen masters and their exact prompts remain for translation provenance.
  No unedited generation is a runtime export. The original non-Aseprite source
  deviation is documented; separate workflow acknowledgement remains pending.
  Visual approval does not create an ART-03 or global source-method waiver.
- **Cloud contract:** Existing optional ID/path, 384×96, cutout alpha, `tileX: true`,
  polish phase. Explicit owner authorization allows only this contract at
  `technical` or `visual` before full Golden approval; other non-Golden entries
  remain gated. It remains outside the 22 required Golden entries.
- **Sky contract:** Only `env_sky_outskirts` uses the owner-authorized reference RGB
  row ramp in [skyRamp.ts](../src/game/assets/skyRamp.ts). Its 16×300 opaque tile
  contract remains intact. Other art keeps palette/grayscale rules; arbitrary RGB
  is not generally permitted and the master palette remains provisional.
- **Approval evidence:** [Owner record](../art/source/golden/art03/owner-approval.json)
  seals the six accepted runtime exports, editable grids, eight approved references
  and compact final proofs. Current technical evidence is
  [validation.json](../art/source/golden/art03/validation.json); current cloud/hash
  evidence is [cloud-review.json](../art/source/golden/art03/cloud-review.json).

## 4. Animation Strategy

- **Runtime Transforms:** Chassis bounce may use Phaser transforms/tweens. Wheels use the registered authored four-frame cycles; do not rotate low-resolution wheel textures in code.
- **Sprite Sheets:** For complex deformations (smoke, engine vibrations), export strict horizontal sprite sheets from Aseprite.

## 5. Shader Strategy

- **Policy:** Shaders are for **optional visual enhancement only**.
- Gameplay must never depend on a shader for readability.

## 6. Technical Validation (The Gate)

No asset reaches `technical` without asset-specific technical evidence, and technical success does not mean art approval.

The executable, read-only gate is `tools/assets/validateAssets.ts`. CLI parsing/reporting wraps the same injected-file-access `validateAssets()` core used by tests and programmatic callers. Reports identify stage, root, scope, enforced presence, missing inputs, per-entry technical results/recorded status, errors and warnings. Exit 0 means the requested scope passed; exit 1 means invalid arguments, failed checks or filesystem errors. `--help` prints usage without running validation.

### Commands and implemented stages

| Stage | Command | Enforced contract |
|---|---|---|
| Preparation (default) | `npm run validate:assets` | Full registry/data/palette integrity and present-file checks. Missing planned/draft future assets are reported as warnings. This pass does not establish production presence or approval. |
| Golden | `npm run validate:assets:golden` | Presence and technical validity of required entries derived from `isGolden()` (currently 22), plus full registry integrity and all present visual exports. Unselected future batches may remain absent. |
| Phase production | `npm run validate:assets -- --stage production --phase proof_a` | Presence for required entries in one registered phase. Replace `proof_a` with the actual phase from `ASSET_PHASES`. This does not override the Golden approval gate. |
| Full technical | `npm run validate:assets:full` | Presence and technical validity of every required registered visual entry (currently 86). This does not grant or replace visual/in-game/final approval. |
| Release | `npm run validate:assets:release` | Full technical requirements, every required entry recorded as `approved`, locked palette and canonical GPL export. Existing approval records are checked, never granted. |

Equivalent stage syntax is `--stage preparation|golden|production|full|release`. The programmatic API retains `strict` for full technical mode; supported CLI aliases `--allow-missing`, `--golden`, `--strict` and `--release` select one corresponding stage. Unknown/repeated/conflicting options, unknown phases and invalid stage/phase combinations fail. `--root <project root>` selects the root for `public/assets/` and `art/palette/` without changing canonical registry/data; it is useful for controlled filesystem checks. Ordinary `npm run check` uses preparation, not release.

All stages preserve registry/data coverage and reject unexpected files, malformed PNGs, wrong dimensions/frames, alpha/margin violations, forbidden color-management chunks and invalid supported bitmap-font metadata. Present optional exports are validated; absent optional entries are not required. Any asset recorded as `technical` or later must retain its exports even outside the selected presence batch. A partial font PNG/XML pair fails. No stage changes registry status or creates assets.

Palette colors come from `palette.ts`. A provisional palette may still change through Golden review; it is not automatically locked by technical success. Provisional off-palette draft pixels are warnings **only during preparation**, reported as `attention`, not a technical pass. Golden/phase/full/release production checks reject off-palette pixels; recorded technical-or-later exports and locked-palette preparation also reject them. Registered grayscale assets are checked for grayscale instead of palette membership. The narrowly registered ART-03R sky-ramp checks each pixel against its declared reference row color; it does not bypass color validation for other assets. Fully transparent pixels do not produce color violations; registered soft alpha is respected.

An existing `art/palette/scrap-master.gpl` is compared with `palette.ts` `renderGpl()` in every stage; stale text fails. Release also requires that export to exist. Other stages do not require the absent export. The gate does not generate it; palette export automation remains future tooling.

The visual gate validates registry category exports and rejects unknown root/category paths. The exact top-level `audio/` directory is delegated to audio validation and not traversed by the visual filesystem adapter; there is no general unknown-file ignore rule. Only literal `.gitkeep` placeholders are exempt from file hygiene. VAL-02 still owns audio enforcement.

Automated checks cannot judge artistic quality, actual glyph readability, seamless visual tiling or Phaser composition/motion. Bitmap-font checks establish the PNG/XML pair, referenced page, atlas size and glyph presence; real loading/rendering remains TYPO/VIS work. A preparation pass MUST NOT be representable as production approval. Asset-specific results are read-only evidence, not lifecycle promotion.

## 7. Approval Pipeline

[ASSET_STATUSES](../src/game/assets/assetRegistry.ts) defines the sequence:

`planned → draft → technical → visual → ingame → approved`

1. `planned`: Requirement registered; production work has not advanced.
2. `draft`: File/source created; technical acceptance has not yet been established. File existence is not validation.
3. `technical`: Applicable asset-specific export checks passed; ready for visual review.
4. `visual`: Actual-size art-direction review passed, including progression and relevant combinations.
5. `ingame`: Real Phaser loading, frames/fonts, composition/motion and viewport behavior proved.
6. `approved`: Required technical, visual and in-game evidence accepted by the owner; final asset approval recorded truthfully.

Do not collapse file creation, technical validation, visual review, in-game proof and final approval. The palette remains provisional until Golden approval; full production approval requires its lock. D14 §21 governs batch sequencing, and every non-Golden entry stays `planned` until all 22 Golden entries are `approved`, except the bounded optional ART-03R cloud technical/visual authorization above.

## 8. Stale source/tool references

There is no `docs/13_VISUAL_QUALITY_AND_ART_ACCEPTANCE.md`; D13 is audio direction. Visual identity is D04, approval lifecycle is this document, and execution/proof requirements are D14. VAL-01 corrected the registry/validator/palette references. D04 §6’s no-op-command wording records the pre-VAL-01 limitation; the executable commands/stages above supersede that tooling statement without changing art direction.

`tools/validate-assets.ts`, `tools/contact-sheet.ts`, `tools/write-palette.ts` and the `assets:palette` package script are absent. The actual visual gate is `tools/assets/validateAssets.ts`; `palette.ts` supplies canonical GPL text through `renderGpl()`, but no export CLI exists. Contact-sheet/export automation remains future tooling. No production assets or palette export were generated by VAL-01.
