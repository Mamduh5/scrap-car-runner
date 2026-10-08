# VIS-01 integrated Golden runtime proof — 2026-10-08

**VIS-01 INTEGRATED GOLDEN RUNTIME PROOF — READY FOR OWNER REVIEW**

Runtime implementation and evidence are complete. VIS-01 remains **IN PROGRESS pending owner integrated visual acceptance**, required by D14 §§12/14. No technical visual blocker remains. ART-04 is not started and M0 remains IN PROGRESS.

## 1. VIS-01 Definition

Current D14 §18 title: **Production loading and retained proof view**. Goal: **Exercise real exports through Phaser**. Exact acceptance: **Correct keys/frames/fonts load; failures visible; reusable production loader**. Included: **Registry-driven images/sheets/fonts, errors, development-only proof navigation and resize behavior**. Excluded: **Progress ownership, fake gameplay**. Gates: **T, U where meaningful, AV-stage**; human acceptance: **VISUAL**.

These criteria were reported before editing. Existing D14 had malformed task/status cells and stale missing-font/empty-preload summaries. This task corrects the affected VIS/M0/ART-04/typography summaries; unrelated malformed backlog rows are outside scope. TYPO-01/02 completion follows the current owner's task context; their historical proofs remain unchanged.

## 2. Proof Scene

`src/game/scenes/DevVisualProofScene.ts`, served by the separate development-only `visual-proof.html` / `src/game/dev/visualProof.ts` entry. It shares `phaserConfig`, `attachPixelViewport` and the new reusable `loadProductionAssets` with production Boot. It initializes no GameStateService, storage/save, simulation or gameplay. No new production scenes are registered.

States: Garage, Run, vehicle, UI, seams. Keys **1–5** select states, **G** toggles guides, **Space** cycles authored wheel/puff frames and whole-pixel proof scroll. The capture runner controls states deterministically. Mail is omitted because no approved asset exists.

Reproduce: `npm run dev -- --host 127.0.0.1`, then open `http://127.0.0.1:8080/visual-proof.html`. Capture with `node --import tsx/esm tools/assets/visualProof.mjs`. Do not replace the preservation baseline; `--baseline` was used once before producing evidence.

## 3. Garage Proof

Production wall, separate lift, Rustbucket body, Engine T1 and T1 wheels. Maximum-canvas registration exactly follows retained Garage evidence: wall `(0,0)`, car `(52,227)`, lift `(40,281)`, wheel centers `(78,271)/(138,271)`. Safe composition translates these to car `(34,158)` and lift `(22,212)`; no rescaling or baked car. Authored visible tread meets the retained roller contact row. Rustbucket, canopy/lamp and small telemetry remain readable at 1×.

## 4. Run Proof

Production sky → optional clouds → far junkyard → asphalt → Scrap Pile → body/Engine T2 → wheels → tinted puff → runtime UI. Tile placement and critical positions are integral. Road top is safe-relative `y214`; body origin `(20,159)` places the visible tread immediately above the road. Scrap Pile is readable as distant roadside dressing, separated from the car silhouette. The full canvas extends noncritical top/ground bleed by repeating source edge rows, preserving the authored texture scale and horizon.

## 5. Vehicle Proof

Base plus Engine T1/T2/T3 use identical 112×56 registration at unit scale. All four 24×24 T1 wheel frames appear at body-relative centers `(26,44)/(86,44)`. Four retained vehicle states and four Run states show the authored wheel/puff cycles. No drift, filtering, alpha fringe or registration mismatch observed. No code rotation or substituted bare-wheel art.

## 6. UI / Typography Context

Actual `font_display` and `font_body` at existing native 16px typography tokens. Scrap and Fuel icons, sliced plate, all three primary-button states, all four slot states, and Engine T1–T3 icons render from production files. Garage/Run HUD labels and dark-panel samples remain readable at 1×. Values are static examples, not gameplay statistics. This does not repeat or modify TYPO-02's 21-sample proof.

## 7. Safe-Area Result

Centered **180×288**, maximum **216×427**, verified against current `pixelViewport.ts`. At maximum the safe origin is `(18,69)`; all critical sprite/text bounds stay inside it. Garage/Run maximum captures cropped there exactly equal the safe-size captures: **zero pixel mismatches**. Noncritical atmospheric/shelter/ground extension can crop. Live resize checks include 360×640 DPR1, 390×844 DPR3 and 393×852 DPR2.75, covering logical 180×320, 195×422 and 180×390 respectively.

## 8. Tiling / Seam Result

| Asset | Authored tile | Runtime result |
|---|---|---|
| `env_sky_outskirts` | 16×300 | Adjacent whole-pixel copies; no visible join; matching source edges |
| `env_clouds_strip` | 384×96 | Optional; wrap join exposed inside viewport; no seam or opaque strip |
| `env_far_junkyard` | 256×96 | No gap, overlap or visible wrap seam |
| `env_road_asphalt` | 64×48 | Full-resolution repetition and contact; no seam |

Eight controlled phases per asset include offsets around 64/256/384 wrap boundaries. Copies exist on both sides of the canvas and connect exactly by their source width. Source edge checks find zero mismatched rows; this supplements actual runtime inspection rather than replacing it.

## 9. Filtering / Pixel Integrity

Actual renderer: **Phaser WebGL**. All 23 texture/font entries have nearest filtering and expected frame dimensions. `pixelArt` gives antialias false and roundPixels true; CSS uses pixelated rendering; integer device zoom and critical sprite transforms pass. Exact safe-size **3× runtime screenshots replicate every 1× pixel**, with zero mismatches. Fractional-DPR checks allow only the browser's 1/64 CSS-pixel layout quantization and independently check exact integer device zoom.

Two demonstrated proof-composition bugs were corrected: full images now explicitly use `__BASE` after edge-row frames are added (Phaser otherwise chooses the new default row frame), and horizontal tiles anchor to the safe rectangle on resize. No accepted source texture was defective or changed.

## 10. Runtime Evidence

Start with [review.html](review.html), supporting actual 1× / integer 3× inspection and controlled wheel/puff frames. [review/owner-review.png](review/owner-review.png) is its browser-rendered contact sheet. All primary evidence is captured directly from the Phaser canvas; no Node/canvas mockup is used.

Required captures, relative to this directory:

- `review/garage-clean-180x288.png`
- `review/garage-guided-180x288.png`
- `review/garage-clean-216x427.png`
- `review/run-clean-180x288.png`
- `review/run-guided-180x288.png`
- `review/run-clean-216x427.png`

Additional exact paths are listed in [FILES.json](FILES.json): 3× Garage/Run captures, four vehicle frames, four Run cycles, UI context and four isolated tile joins. [runtime-evidence.json](runtime-evidence.json) retains all 61 runtime reports, real production requests, failed-load visibility, filter/frame/transform/bounds/tile/resize checks and pixel-replication results. No screenshot baseline regression suite was added.

## 11. Lifecycle Impact

**None.** All 22 Golden entries and optional clouds remain `visual`. D11 §7 allows `ingame` after real loading, frames/fonts, composition/motion and viewport evidence; this package supplies that evidence for required Golden entries, but does not automatically promote lifecycle metadata ahead of owner review. The cloud exception independently allows only technical/visual before Golden approval. No `approved` change and no palette lock.

## 12. Files Changed

Modified: `src/game/scenes/BootScene.ts`, `docs/14_IMPLEMENTATION_AND_PROJECT_MANAGEMENT_PLAN.md`.

Created code/entry/tooling: `src/game/assets/loadProductionAssets.ts`, `src/game/dev/visualProof.ts`, `src/game/scenes/DevVisualProofScene.ts`, `visual-proof.html`, `tools/assets/visualProof.mjs`, `tools/assets/loadProductionAssets.test.ts`.

Created evidence: this directory's report, review page, checks, runtime evidence, preservation baseline, file manifest and screenshots. [FILES.json](FILES.json) records every exact path. No unrelated gameplay/service/domain/data, accepted production PNG, typography proof, font generator, Garage concept/master or palette change. **190 pre-existing art/runtime files remain byte-identical.**

## 13. Validation

| Command | Exit |
|---|---:|
| `git diff --check` | 0 |
| `npm run check` | 0 |
| `npm run validate:assets:golden` | 0 |
| `npm run validate:assets -- --stage production --phase proof_a` | 0 |
| Same command, `proof_b` | 0 |
| Same command, `proof_c` | 0 |
| `node --import tsx/esm tools/assets/visualProof.mjs` | 0 |

14 test files / **253 tests**; both typechecks, data/preparation assets/audio, simulation and build pass. Three new loader regressions test canonical dispatch, lifecycle eligibility and failure diagnostics/listener cleanup without importing Phaser into Vitest. Golden gate: **22 required present, 23 technical passes including optional clouds, zero errors**. Existing future-asset warnings and Phaser bundle-size warning remain. The dev proof entry/scene is excluded from the production build. [checks.json](checks.json) retains exit codes.

## 14. VIS-01 Status

**IN PROGRESS — required owner integrated visual acceptance pending.** Runtime technical/composition evidence is complete; no missing asset, critical clipping, seam or unresolved filtering/scaling defect remains. D14 §14 requires **“actual-size inspection and owner approval”** for visual work, and §12 reserves DONE for all required approval. Owner review judges prominence, contact, depth, landmark/puff visibility and typography contrast using the compact retained page.

## 15. Remaining M0 Gates

TYPO-01/02 and ART-01/02/03 remain complete per current task context. Remaining: owner integrated visual acceptance of VIS-01, then the separate ART-04 owner acceptance of all 22 Golden entries, truthful lifecycle recording and palette lock. Historical Run source-workflow acknowledgement remains separately recorded; accepted Garage fidelity debt is not reopened. **ART-04 remains BACKLOG; M0 remains IN PROGRESS.**

## 16. Final Status

### VIS-01 INTEGRATED GOLDEN RUNTIME PROOF — READY FOR OWNER REVIEW

No ART-04, gameplay, save, Mail, navigation, art generation or Garage polish work begins.
