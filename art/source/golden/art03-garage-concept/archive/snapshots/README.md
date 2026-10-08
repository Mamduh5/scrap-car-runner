# Garage Golden art direction / concept pass — 2026-10-07

**COMPOSITION REFERENCE ACCEPTED · CONCEPT EXPLORATION CLOSED · PRODUCTION PREPARATION ONLY**

## Current owner decision — selected reference, 2026-10-08

The owner accepts [garage-b-tight](single-image-review/garage-b-tight.png) as the **selected Garage composition reference**. Concept exploration stops. The authorized next work is [production-preparation planning](production-preparation/PLAN.md) for `env_garage_wall` and `env_garage_lift`, supported by [read-only inspection](production-preparation/inspection.json). The 540×654 selected PNG is an exact 3× display of 180×218; it is immutable composition authority, not a runtime export. The [review page](review.html) retains the single selected image. Prior candidates/reports remain history. Production files and lifecycle/task states are unchanged.

The initial-pass report below is retained as history. Its earlier conditional recommendation of C is superseded by the owner's B selection. Original A/B/C PNGs, prompts and initial validation remain unchanged.

## Initial concept pass record

The [previous comparison](review-history.html) retains the B refinement review as dated history; its pending-direction language describes the earlier gate and is superseded by the current owner decision above. These are review artifacts, not game assets. [prompts.json](prompts.json) retains the initial exact built-in imagegen prompts; [validation.json](validation.json) records the initial checks and protected-file hashes.

## 1. Documents and assets reviewed

Read completely before editing: D00 Project Instructions, D04 Art Direction/Asset Registry, D05 UI/UX, D07 Vertical Slice Build Plan, D11 Asset Production Workflow and D14 Implementation/Project Management Plan. Also read D08 workflow rules.

Inspected the canonical `src/game/assets/assetRegistry.ts`, `palette.ts`, `pixelViewport.ts` and foundation `BootScene.ts`; ART-01/02 style references and provenance; ART-03R README, provenance, retained prompts, existing build/preview recipe and pixel codec. Compared ART-01 vehicle ladder and part/wheel contact sheets, ART-02 UI contact sheet, ART-03R maximum Run, asset contact, scroll/frame and wide-repeat previews and the accepted sky-composite reference. Approval records and protected source/runtime files were retained and hash-checked.

No GarageScene, Garage editable art, Garage runtime images or earlier Garage concept files were found before this pass. Boot remains foundation diagnostics; the typography sample's “Garage” heading is not a Garage implementation.

## 2. Current Garage asset contract

The registry remains the sole exact asset authority; this table records the audited contract, not a new definition.

| ID | Registry contract | Chosen brief interpretation |
|---|---|---|
| `env_garage_wall` | Required `proof_c` Golden image; 216×427; opaque; palette; margin 0; no tiling/bindings; `planned`, export absent | Service-bay backdrop: overhang/frame/lamp, short rear structure, open-air gaps, subdued surroundings and calm lower area |
| `env_garage_lift` | Required `proof_c` Golden image; 136×20; cutout alpha; palette; margin 0; no tiling/bindings; `planned`, export absent | Low improvised roller/test platform under the active car; not a mandatory raised hydraulic lift |
| `env_garage_fg` | Optional `polish` image; 216×64; cutout alpha; palette; `planned`, export absent | Deferred. Not needed to establish this concept, and no optional production authorized |

The car reuses the registered 112×56 body and installed overlays, with 24×24 authored wheel frames. Only equipped parts affect its installed appearance. Preserve the body/overlay registration and wheel centres (26,44) and (86,44); never generate a replacement vehicle for Garage. The concept gauges are static illustrative cues, not telemetry or registered new assets.

The maximum canvas is 216×427 with a centred 180×288 safe rectangle. This review uses 216×288 reference-size studies and 180-wide centre crops; it does not establish the maximum-height composition. Future backdrop art must carry decorative bleed, while critical car/status/navigation/HUD composition must fit or re-anchor with the safe area. A 216×427 export alone would not prove that behavior.

## 3. Conflicts and terminology

- D04 §4 previously called for heavy UI overlays to convey workshop identity. That conflicts with the owner-directed hero-car presentation and D05 §20's small Fuel / Heat / Speed set. Corrected that sentence; no UI implementation changed.
- `wall` and `lift` are durable asset IDs, not literal architectural requirements. Added D04 §7's service-bay/test-platform interpretation without renaming IDs, changing dimensions or weakening export requirements.
- Garage is a live inspection/home view. A parked car, enclosed workshop, full highway, inventory grid, five fixed equipment slots, DRIVE control and checkpoint selector are not the scene brief.
- D11's accepted procedural authoring exceptions apply to ART-01/02 only; ART-03R visual acceptance does not waive Garage's source workflow. These generated references receive no exception. Production still needs D11 manual source/cleanup/export or a separately acknowledged source method.
- ART-03R's sky RGB ramp exception is sky-only. Garage palette-mode exports cannot inherit that exception. Concept references are not claimed palette-compliant.
- D04 §6 contains a known pre-VAL-01 no-op-validator statement, explicitly superseded by D11 §8. This pass used the executable current gate; unrelated tool-history prose was not rewritten.

## 4. Concept directions explored

| Pass | What was explored | Assessment |
|---|---|---|
| [A — patched lean-to](direction-a.png) | Heavy patched corrugated shelter, open scrapyard view, active car on roller bed, status embedded into rig | The identity reads, but the roof and edge clutter compete. Too much scenery/material noise; embedded meters overcommit their relationship to environment art. Reject as production basis. |
| [B — roadside canopy](direction-b.png) | Thinner shelter, short rear panel, clearer roller positions, three separate small signals | Better structural balance and testing cue. Large blue sky, distant silhouettes and floor cracks still resemble the Run panorama and pull attention away from inspection. |
| [C — quiet service-bay refinement](direction-c.png) | Targeted imagegen edit of B: subdued thinner roof, removed panorama, pale quiet opening, restrained floor | Best hero contrast and quiet shelter. Excess pale headroom is empty in the wrong way; the opening can read as a flat wall. Some floor texture and generated shading remain. Preferred conditional basis, not accepted direction. |

All three are unchanged generated 1086×1448 PNG references. No explanatory labels or title/logo are baked into the artwork. The review page supplies external descriptions. Generated car proportions/details drift from the approved body/overlays; the references are not replacements for accepted ART-01 pixels.

## 5. Recommendation

Use **C's value hierarchy and thin patched shelter** as the next composition basis, keeping **B's unmistakable outdoor gaps**. The teal car, dark wheel silhouette and small roller contact shapes should draw the first look. The roof/lamp establish a makeshift service station without taking over the middle. Keep a short uneven rear service panel, with clearly visible open sides and only restrained outdoor context.

Bring the shelter/lamp framing closer to the active car to remove excess headroom; show it with the exact accepted car at native size. Keep signals small, separate from backdrop/platform exports, with no baked words or final UI commitment. The exact generation did not reliably obey requested car proportions or grid, so a further exact-car composition study is needed before tracing environment production.

Scrap top-left, Mail top-right and Workshop / Garage / Scavenge left/centre/right are conceptual reservations only. No new Mail icon, glyph, nav bar, equipped panel, input gesture, hit area or animation timing was selected. The rig supports testing in place; it is not a new gameplay mechanism or a stopped/parked simulation state.

## 6. Is it strong enough to continue?

**Strong enough for owner discussion; not strong enough for production.** Small-size viewing confirms a readable car and a calmer C hierarchy, but does not resolve the wall-like opening, excessive headroom, exact-car registration or full maximum-canvas composition. AI shading/pixel texture and proportions are still reference quality, not strict Golden pixels.

Stop here for owner review. Review should resolve whether C's quiet shelter is the desired starting point and how the rear structure/open gaps should communicate outdoors. No production batch is implicitly authorized by this report. No owner acceptance was received during this pass.

## 7. Exact files created / changed

Created in `art/source/golden/art03-garage-concept/`:

- `direction-a.png`
- `direction-b.png`
- `direction-c.png`
- `prompts.json`
- `review.html`
- `README.md`
- `validation.json`

Changed:

- `docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md`: corrected heavy-overlay Garage wording and added bounded half-open/test-platform brief.
- `docs/14_IMPLEMENTATION_AND_PROJECT_MANAGEMENT_PLAN.md`: recorded current concept activity, owner-review limits and the existing ART-03 planning consequence; all task/milestone statuses preserved.

No registry, palette, runtime asset, approved Run source/reference/preview, gameplay or package/config change. Project-check build output and temporary command logs are derived verification output, not new art deliverables.

## 8. Validation run

- `npm.cmd run check`: passed, exit 0. Both typechecks, 13 test files / 250 tests, 109 data checks / zero failures, preparation visual/audio validation, eight simulator scenarios and build. Visual preparation: 19 present-file technical passes / zero errors / 68 future warnings; audio: zero errors / 13 future warnings. Existing large Phaser build-chunk warning remains.
- `npm.cmd run validate:assets -- --stage production --phase proof_c`: expected exit 1, exactly two errors for absent `env_garage_wall` and `env_garage_lift`; 19 technical passes / 66 future warnings. Concept PNGs cannot satisfy this gate and were not put in `public/assets`.
- Hash preservation: 117 protected pre-existing files across ART-01/02/03 source, accepted Run references, `public/assets` and `src`; zero changed/missing files. The validation record retains their before/after hashes.
- D14 task/milestone status comparison: unchanged. No new task ID or status promotion.
- `git diff --check`: passed. Local links and reference PNG dimensions checked.
- Chrome visual inspection: 216×288 reference-size studies, 180-wide centre crops, 2× display controls and accepted car/UI native-size swatches. All 10 images loaded; 2× viewports measured 432×576. Car remains visible in narrow crops, but decorative posts/lamp frame can fall outside them. Native swatches visibly reinforce the generated-car drift.
- No Aseprite cleanup, production palette/alpha acceptance, 216×427 exact-car proof, Phaser loading/motion, touch/device QA or owner visual acceptance performed. Browser reference-size review is not strict 1× production-pixel proof.

The local review can be opened directly from its file path. For an HTTP preview, from repository root run `python -m http.server 4174 --bind 127.0.0.1` and open `/art/source/golden/art03-garage-concept/review.html` on that localhost server. It has no dependency on the game build.

## 9. Project-plan / status impact

Garage concepting has begun; Garage runtime production has not. Both required Garage assets remain `planned` and absent. ART-03 overall remains IN PROGRESS; M0 remains IN PROGRESS. Accepted ART-03R entries retain `visual` and their bytes/evidence; no `ingame` or `approved` state is inferred. GAR-01, VIS-01, TYPO, ART-04 and other tasks retain their existing readiness/status boundaries.

The owner-directed service-bay interpretation is recorded as a brief. The reference recommendation itself is still unaccepted, and cannot close Golden, palette, source-method or in-game gates.

## 10. Final status

**CONCEPT ONLY / READY FOR OWNER REVIEW / NOT READY FOR PRODUCTION.** Three bounded references and an honest comparison exist. Production continuation requires a stronger exact-car composition and owner review of the remaining environment ambiguity.
