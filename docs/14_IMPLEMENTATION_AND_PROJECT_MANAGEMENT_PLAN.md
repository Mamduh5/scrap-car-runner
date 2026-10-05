# Scrap Car Runner — Authoritative Implementation & Project Management Plan

| Field | Value |
|---|---|
| Status | CURRENT EXECUTION PLAN |
| Current Milestone | M0 — Production Gates & Golden Visual Proofs |
| Current Implementation Batch | ART-03R Run production candidate — technical pass; owner visual review pending |
| Project Management | Milestone-Based Kanban |
| Sprint Policy | No formal sprints |
| Last Reviewed | 2026-10-05 |

**Purpose:** This document is the execution source of truth for implementation sequencing, task status, dependencies, milestone gates, and project management.

**Authority:** This document does not replace canonical gameplay, data, architecture, art, typography, audio, save, or security contracts. Those remain governed by their designated source-of-truth documents and registries. When a contract changes, update the owning source first and then update this execution plan as necessary.

**Baseline planning history:** The former root planning report has been removed. Its dated evidence is preserved in §§1–8 below; D14 is the maintained execution plan. No external root-history file is required to follow this plan.

## How to Maintain This Plan

### Update D14 when

- A task status or dependency changes.
- A blocker appears or clears.
- A milestone or implementation sequence changes.
- Validation discovers a planning consequence.
- A new approved V1/release requirement creates backlog work.

Update affected backlog rows, milestone statuses and the Current Execution Snapshot together. Record a named dependency, unblock condition and responsible owner when marking a task BLOCKED; update Last Reviewed when reviewing the plan.

### Keep system contracts in their owning sources

Do not use D14 to redefine gameplay rules, data values, architecture ownership, save semantics, art, typography, audio, or security/trust contracts. Follow this order:

```text
change owning canonical source
    → reconcile affected implementation
    → update D14 dependency/task information
```

### Apply the Definition of Done

Never mark a task DONE because code merely compiles, tests alone pass for work requiring visual/audio/play/device QA, or an AI agent says the work is complete. DONE requires every applicable criterion in §14, including required human acceptance. Apply the transition policy in §12 and milestone-close rule in §15.

## Current Execution Snapshot

| Field | Current state |
|---|---|
| Current Milestone | M0 — Production Gates & Golden Visual Proofs; IN PROGRESS |
| Current Batch | DOC-01 + VAL-01 + VAL-02 + VAL-03 + ART-01 + ART-02 — COMPLETE |
| Ready Tasks | None in the authorized ART-03R Run-only scope |
| Completed Tasks | DOC-01 — documentation reconciled; VAL-01 — visual gates; VAL-02 — audio gates; VAL-03 — viewport discovery verified; ART-01 — Golden vehicle/engine ladder (2026-10-05); ART-02 — Golden UI samples (2026-10-05) |
| In Progress Tasks | ART-03 overall — six Run exports technical (including optional clouds); Garage remainder unstarted |
| Validation Tasks | ART-03R Run subset — owner visual review and source-workflow acknowledgement pending |
| Blocked Tasks | None for Batch 1/ART-01/02; GAR-01 remains BACKLOG / not READY pending owner slot-tap decision and presentation inputs; TYPO-01 remains BACKLOG pending licensed font inputs |
| Immediate Next Gate | Production typography (TYPO-01) / remaining Golden visual proofs (ART-03); assessment in §34 |

M0 remains IN PROGRESS. DOC-01 is DONE: existing canonical contracts were reconciled without changing source, tooling, tests, assets or product decisions. VAL-01 is DONE: the visual CLI now executes preparation, Golden, phase production, full technical and release gates with truthful reports/exit codes and focused regressions. VAL-02 is DONE: correct audio root, explicit preparation/Golden/full stages, structural provenance/source/file checks and regression evidence. VAL-03 is DONE: the existing pure viewport suite runs under the standard test command, with all previous test files preserved. ART-01 is DONE: all eight `proof_a` assets produced, technical gate passed, and explicit OWNER APPROVAL recorded as the Golden visual benchmark. Eight ART-01 assets advanced to `visual` registry status. ART-02 is DONE: all five non-font `proof_b` assets (`icon_scrap`, `icon_stat_fuel`, `ui_panel_plate`, `ui_button_primary`, `ui_slot_frame`) produced, passed technical validation, and explicit OWNER APPROVAL recorded for the Golden UI benchmark and revised workshop button. Five ART-02 assets advanced to `visual` registry status. Note on `proof_b`: the ART-02 non-font scope is technically complete and visually approved, but the overall `proof_b` bundle remains incomplete, blocked by missing TYPO-01 font inputs (`font_display`, `font_body`). D05 explicitly contains the unresolved installed-slot gesture as OWNER DECISION REQUIRED; GAR-01 remains BACKLOG / not READY until the owner resolves it and its other inputs pass §13.

ART-01 and ART-02 are complete; ART-03 is IN PROGRESS and remains incomplete. ART-03R has six technically valid Run production candidates (including optional clouds) awaiting owner visual review; Garage remains planned and absent. M0 still requires production typography (TYPO-01), remaining ART-03 production/acceptance, VIS-01 in-game proof, palette lock, and final Golden approval (ART-04).

### VAL-01 implementation evidence — 2026-10-05

The previous `npm run validate:assets -- --release` was reproduced exiting 0 with no validator output: the module exported validation functions but never invoked them. The same module now has a thin read-only CLI over its programmatic core; no second validator, production asset, automatic status promotion or art-contract change was introduced.

| Check | Current result |
|---|---|
| Source/tools typechecks | Both passed |
| Standard unit suite | 11 files / 198 tests passed, including 41 new visual-validator regressions; discovery configuration unchanged (VAL-03 remains open) |
| Preparation command | Exit 0; 0 errors / 86 warnings; 0 technical asset passes; explicitly PREPARATION ONLY |
| Golden command | Expected exit 1; 22 missing-required errors / 64 future-asset warnings; membership derived from `isGolden()` |
| Phase production (`proof_a`) | Expected exit 1; 8 missing-required errors / 78 future-asset warnings |
| Full technical command | Expected exit 1; 86 missing-required errors / 0 warnings; 3 optional entries are not required |
| Release command | Expected exit 1; 174 errors / 0 warnings: 86 missing exports, 86 missing recorded approvals, provisional palette and missing canonical GPL |
| Production build | Passed; existing large Phaser chunk warning remains |
| Diff whitespace check | `git diff --check` passed |

The exact top-level `public/assets/audio/` tree is delegated to VAL-02; unknown visual/root exports still fail. PNG fixes are bounded to demonstrated malformed-header/critical-chunk checks and supported RGB/grayscale transparency keys. Supported font metadata is checked; real loading/rendering and visual/motion acceptance remain separate evidence. D11 §6 and README document the implemented commands. Historical §§1–8 below retain their original audit/DOC-01 findings rather than presenting them as new results.

### VAL-02 implementation evidence — 2026-10-05

Direct inspection confirmed `PUBLIC_DIR = ../../public` joined with registry `audio/<category>/<id>.mp3`, incorrectly checking `public/audio/...`. The injected adapter now uses `public/assets` as the registry URL base and scans only its `audio/` tree. A temporary-directory regression proves that old-root files are rejected and correct-root files are found.

Minimal per-entry `golden` metadata and `isGoldenAudio()` represent D13's six IDs without a second executable checklist. All 13 existing IDs, roles, loop/volume/instance defaults, required/scope values and provisional `.mp3` URLs are preserved. No audio, production provenance or runtime integration was created.

| Check | Current result |
|---|---|
| Source/tools typechecks | Both passed |
| Standard unit suite | 12 files / 234 tests passed, including 36 new audio-validator regressions; discovery configuration unchanged |
| Preparation command | Exit 0; 0 errors / 13 missing-file warnings; 0 technical asset passes; explicitly PREPARATION ONLY |
| Golden command | Expected exit 1; 6 missing-required errors / 7 future-asset warnings; presence derived from Golden metadata |
| Full command | Expected exit 1; 13 missing-required errors / 0 warnings; requirements derived from VS1/required metadata |
| Production build | Passed; large Phaser chunk warning remains |
| Diff whitespace check | `git diff --check` passed |

The gate checks registry/path integrity, nonempty runtime files, optional ID3 envelope and first MPEG Layer III frame structure, provenance JSON/schema and retained referenced source files. Pending provenance approval remains pending; license strings are structural references, not legal evidence. D13 has no session/master filename fields, so editable-session/lossless-master retention remains production review. No decoding, loop/loudness/mix, listening or browser/native approval is claimed. AudioService and VAL-03 remain untouched. D13 §9 and README document the implemented stages and limits; historical audit/DOC-01/VAL-01 evidence remains dated separately.

### VAL-03 implementation evidence — 2026-10-05

Before editing, Vitest listed 12 test files. The normal test command filtered to `src/game/config/pixelViewport.test.ts` exited 1 with “No test files found”: the include list covered domain, services, data, game audio and tools, but not game/config. No custom test exclude was configured; the runner reported its existing `node_modules` and `.git` exclusions.

One exact include entry now collects this pure Node-compatible suite. Before/after discovery preserved all 12 original paths and added only `src/game/config/pixelViewport.test.ts`. Its 14 existing cases exercise representative viewports, integer scale selection, safe/max bounds, fractional DPR, CSS zoom, invalid-input fallbacks and safe defaults without a window. No assertions, package scripts, coverage rules or production viewport/controller/Phaser configuration changed.

| Check | Current result |
|---|---|
| Source typecheck | `npm run typecheck` passed within the aggregate check |
| Tools typecheck | `npm run typecheck:tools` passed within the aggregate check |
| Standard unit suite | `npm run test`: 13 files / 250 tests passed; includes all 14 viewport cases |
| Aggregate check | `npm run check` passed: both typechecks, tests, data, visual/audio preparation, simulator and build |
| Data / simulator | 109 checks / 0 failures; all eight simulator scenarios completed |
| Visual / audio preparation | Exit 0; respectively 0 errors / 86 warnings and 0 errors / 13 warnings; both PREPARATION ONLY, 0 technical asset passes |
| Production build | Passed; existing large Phaser chunk warning remains |
| Diff whitespace check | `git diff --check` passed |

This establishes pure viewport-math coverage, not browser resize/orientation/DPR-event handling, Phaser rendering, touch, typography or physical-device acceptance. Golden/full asset gates were not run for VAL-03. Batch 1 is complete; M0 remains IN PROGRESS.

### ART-01 implementation and approval evidence — 2026-10-05

ART-01 completed the eight required `proof_a` assets, passed all technical gate checks, established the visual benchmark, and received explicit OWNER APPROVAL.

| Check | Current result |
|---|---|
| Required assets | 8 exports present: `veh_rustbucket_body`, 3 engine overlays, `veh_wheel_tires_t1`, 3 engine part icons |
| Source method | Hand-authored procedural TypeScript pipeline (`art/source/golden/art01/`); no AI visual generation |
| Workflow exception | Owner accepted procedural source as editable source for ART-01 only (D11 §3 note) |
| Style reference | Established and documented in `art/source/golden/art01/STYLE_REFERENCE.md` |
| Technical validation | `npm run validate:assets -- --stage production --phase proof_a` passed with 0 errors |
| Registry lifecycle | 8 ART-01 assets advanced to `visual` status (awaiting VIS-01 in-game runtime proof before `ingame`/`approved`) |
| Test suite | All 13 test files / 248 tests passed |
| Owner decision | APPROVED — accepted as the Golden visual benchmark for future production |

ART-01 is DONE.

### ART-02 implementation evidence — 2026-10-05

| Check | Current result |
|---|---|
| Required assets | 5 non-font `proof_b` exports present: `icon_scrap`, `icon_stat_fuel`, `ui_panel_plate`, `ui_button_primary`, `ui_slot_frame` |
| Source method | Hand-authored procedural TypeScript pipeline (`art/source/golden/art02/`); no AI visual generation |
| Workflow exception | Owner accepted procedural source as editable source for ART-02 only (D11 §3 note) |
| Style reference | Established and documented in `art/source/golden/art02/STYLE_REFERENCE.md` (including UI hierarchy and refined workshop button) |
| Technical validation | Non-font `proof_b` assets passed technical validation; full `proof_b` gate reports only expected missing `font_display` and `font_body` (TYPO-01) |
| Registry lifecycle | 5 ART-02 assets advanced to `visual` status (awaiting VIS-01 in-game runtime proof before `ingame`/`approved`) |
| Test suite | All 13 test files / 248 tests passed |
| Owner decision | APPROVED — accepted as the Golden UI benchmark for future production; button refinement accepted |

ART-01 and ART-02 are DONE. M0 remains IN PROGRESS. ART-03 is READY.

### ART-03R Run production evidence — 2026-10-05

The current owner-supplied references in `art/reference/art03_run/` are the visual authority; the three new sky references govern the layered-sky correction.
Intake confirmed no active rejected ART-03 source/runtime files and all seven `proof_c`
entries at `planned`. The existing staged reference additions were preserved.

| Check | Current result |
|---|---|
| Run production scope | `env_sky_outskirts`, optional `env_clouds_strip`, `env_far_junkyard`, `env_road_asphalt`, `prop_scrap_pile_a`, `fx_puff` |
| Source and previews | Retained imagegen reference translations, exact prompts, controlled pixel cleanup, editable explicit pixel grids and 1×/nearest-neighbor composites in `art/source/golden/art03/` |
| Workflow | **WORKFLOW DEVIATION — OWNER ACKNOWLEDGEMENT REQUIRED**; non-Aseprite workflow is pending acceptance, not covered by ART-01/02 exceptions |
| Run technical gate | All six Run per-entry checks passed, including optional polish clouds during production/proof_c; source/export identity, level road contact and matching horizontal tile edge columns passed; `validation.json` records exact evidence |
| Full `proof_c` | Expected exit 1: exactly two missing-required errors for `env_garage_wall` and `env_garage_lift`; 66 future-asset warnings |
| Preparation | Exit 0; 19 technical passes including optional clouds, 0 errors / 68 future-asset warnings; preparation does not prove complete production |
| Tests / typechecks | 13 files / 250 tests passed; source, tools and dedicated ART-03R source typechecks passed |
| Production build | Passed; existing large Phaser chunk warning remains |
| Registry | Six Run entries `technical` (including optional clouds); Garage entries still `planned`; all ART-01/02 statuses and exports unchanged |
| Acceptance remaining | Owner visual review, this batch's workflow acknowledgement, later Phaser/in-game proof; Garage production was not begun |

Owner layered-sky continuation (2026-10-05): composition is accepted; road, far
junkyard, scrap pile and puff remain KEEP. New `sky_base_reference.png`,
`clouds_strip_reference.png` and `sky_composite_reference.png` supersede the old
monolithic sky direction. The owner explicitly authorized **Allow a sky-only RGB
ramp**, resolving the four-color band/dither constraint while retaining sky size,
opaque alpha and tiling. The 64-color object/UI palette is unchanged. A separate
256x48 binary-cutout `env_clouds_strip` remains optional and polish-phase; the
explicit owner instruction permits its technical review before final Golden
approval, with no visual/ingame/approved promotion. Six Run technical checks pass.
All four KEEP pixel grids/runtime PNGs remain byte-identical, road proof changes
are zero, and other runtime assets are unchanged. Sky/cloud seams have zero edge
mismatches; rebuilt clouds have no subperiod below 384 pixels. New layered, background-only
and repetition previews plus `sky-review.json` retain evidence. Tests: 13 files /
250 passed. Owner visual review and original batch workflow acknowledgement remain
pending; Garage remains planned/unstarted.

Owner cloud-contract continuation (2026-10-05): the 256x48 cloud output was
visually rejected. Owner approved **384x96**, retaining the ID/path, cutout alpha,
horizontal tile, optional status and polish phase. The new grid traces distinct
large bank/streak crops from the original cloud reference, never the rejected
export. `preview/run_216_1x.png` is the primary 216 AP review view;
`run_wide_1x.png` is a 768 AP repetition proof. `cloud-review.json` records 92.23%
empty pixels, 128x25 and 96x23 bank bounds at different heights, zero seam errors,
and exact preservation of all five KEEP grids/exports including the improved
RGB sky. All six assets remain technical; owner review is pending. Garage was
not started. Historical 256x48 cloud visual claims are superseded by this record.

The wide and scroll composites expose tiling and frame relationships with the approved
ART-01 Rustbucket at actual art-pixel scale. They are PNG review evidence, not Phaser,
mobile-browser or physical-device acceptance. Palette and asset contracts are unchanged.
ART-03 overall is IN PROGRESS / incomplete; M0 is IN PROGRESS. No non-Golden art was started.

## 1. Repository Intake Evidence

**The repository is ready for bounded production work. Its immediate needs are trustworthy asset gates, production typography, and Golden visual content—not another architecture audit.**

**Historical baseline — 2026-10-04:** Sections 1–8 retain the evidence and classifications from the audit that produced the original planning report. They are dated baseline observations, not newly executed checks or a guarantee of the current repository inventory. The initial execution snapshot and backlog came from that source report; the current snapshot/statuses are maintained separately as tasks complete.

That baseline audit was read-only. No files were created, edited, deleted, or committed during the audit. No art or audio was generated.

The baseline recursive inventory found **69 relevant project-owned text files, totaling 7,046 lines**. All 69 were inspected completely. Large files were read through their ends; truncated output was reread. An internal per-file coverage ledger recorded category, relevance, authority, inspection status, and findings before planning began.

| Category | Discovered | Fully inspected | Coverage |
|---|---:|---:|---|
| Documentation and README | 15 | 15 | All 14 numbered documents and README |
| Domain types and static data | 4 | 4 | Types, parts, chassis, roads |
| Domain implementation | 5 | 5 | Merge, vehicle calculation, balance, simulation, rewards |
| State, persistence, storage, lifecycle | 5 | 5 | Every production service |
| Application, scenes, viewport configuration | 7 | 7 | Entry, declarations, both scenes, all three configuration modules |
| Visual registry, palette, typography | 3 | 3 | Complete implementations |
| Audio registry and service | 2 | 2 | Complete implementations |
| Production tools | 6 | 6 | Data validation, simulator, PNG implementation, both asset validators |
| Tests | 11 | 11 | Every test file and its assertions |
| Test fixture | 1 | 1 | Async storage fixture |
| Manifest and configuration | 8 | 8 | Package manifest, HTML, ignore rules, TS/Vite/Vitest configuration |
| Dependency lockfile | 1 | 1 | Entire committed lockfile |
| Audio provenance | 1 | 1 | Currently `[]` |
| **Total** | **69** | **69** | **No relevant project-owned text skipped** |

Excluded groups:

| Group | Treatment and reason |
|---|---|
| `node_modules/` | Dependency source excluded from general intake. Local runner help and narrowly relevant cache support were inspected to establish safe validation commands. |
| `.git/` internals | Excluded; read-only worktree status checked. |
| `dist/` | Three generated files inventoried by filename and size; bundles were excluded as derived output. |
| Caches and coverage output | Excluded from source intake. |
| Project-owned binary assets | None discovered outside excluded generated/dependency content. |
| Native projects, CI configuration | None discovered. |
| `public/` | Absent. There are no runtime production assets. |

Read-only verification performed during the baseline audit:

- Source typecheck: **passed**.
- Tool/config typecheck: **passed**.
- Data validator: **109 checks, zero failures**.
- Production simulator: **all eight scenarios completed**.
- Visual-validation script with `--release`: **exited 0 without invoking validation**.
- Direct, in-memory invocation of the visual validator: **86 required assets missing; 173 release errors**.
- Strict audio validator: **failed for all 13 missing entries**, as expected with no audio files.
- Worktree status: unchanged and clean.

The unit suite was fully inspected but **not rerun**. Build and coverage commands were also not run because the baseline audit prohibited file creation. Consequently, this plan distinguishes test-supported implementation, fresh test execution, and human acceptance.

## 2. Confirmed Technology & Architecture

| Component | Confirmed state |
|---|---|
| Phaser | **4.2.1**, locked |
| TypeScript | **5.9.3**, locked |
| Vite | **8.3.2**, locked |
| Vitest / coverage-v8 | **5.0.3**, locked |
| tsx | **4.23.15**, locked |
| Node typings | **22.20.5**, locked |
| Local Node / npm | **22.23.1 / 10.9.8**, verified during the baseline audit |
| Supported Node | `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0` |
| UI framework | Phaser scenes; no React or other UI framework |
| Persistence | Local browser storage behind an asynchronous adapter |
| Native/services | No Capacitor, backend, accounts, ads, purchases, or analytics implementation |

Versions come from the fully inspected [lockfile](../package-lock.json#L1426) and [manifest](../package.json#L7).

The architecture is already sufficient for the core loop:

- [Application composition](../src/main.ts#L16) initializes one progress owner before Phaser.
- `GameStateService` owns mutable progress, validated commands, persistence status, and run eligibility.
- Domain functions calculate vehicle values, simulate terrain/failure, and calculate rewards.
- Scenes own presentation and ephemeral run state.
- `SaveRepository` serializes captured writes, recovery, reset, and flush.
- `saveCodec` constructs canonical data from unknown input.
- Browser lifecycle changes foreground eligibility and attempts best-effort flushes.

The run contract is already implemented:

```text
Garage requests GameStateService.startRun()
    → service calculates frozen vehicle stats
    → service issues the original session token and initial RunState
    → RunScene owns the evolving ephemeral RunState
    → RunScene calls advanceRun(token, state, road, deltaMs / 1000)
    → completion calls recordRunResult(originalToken, terminalState)
    → service consumes eligibility and updates progress
```

See [GameStateService.startRun / advanceRun / recordRunResult](../src/services/state/GameStateService.ts#L125). Garage does not produce authoritative `VehicleStats`.

Rendering uses a flexible **art-pixel canvas**, with a **180×288 safe rectangle**, bounded by **216×427**, and integer device-pixel scaling. It is not a fixed 360×640 logical canvas. See [pixelViewport.ts](../src/game/config/pixelViewport.ts#L20).

## 3. Canonical Documentation Map

The document labels below are also the backlog’s source references.

| Area | Canonical source | Status | Notes |
|---|---|---|---|
| Instructions and scope | [D00 — Project Instructions](00_PROJECT_INSTRUCTIONS.md) | CURRENT CANONICAL | Production intent, small VS1, browser first |
| Product vision | [D01 — Master Design](01_MASTER_GAME_DESIGN.md) | CURRENT CANONICAL | Engineering and diagnosis define the product |
| Mechanics and progression | [D02 — Gameplay](02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md) | CURRENT CANONICAL | Numerical tuning explicitly provisional |
| Content and save semantics | [D03 — Data Bible](03_GAME_DATA_BIBLE.md) | CURRENT CANONICAL | IDs, values, recovery and ownership |
| Visual identity | [D04 — Art Direction](04_ART_DIRECTION_AND_ASSET_REGISTRY.md) | CURRENT CANONICAL | DOC-01 reconciled dimensions, overlays and wheel policy to AR; visual identity unchanged |
| Visual asset requirements | [AR — Asset Registry](../src/game/assets/assetRegistry.ts#L95) | CURRENT CANONICAL | Explicitly delegated authority for required assets |
| Palette | [PAL — Palette](../src/game/assets/palette.ts#L15) | PROVISIONAL | 58 colors; lock after Golden approval |
| Typography | [TY — Typography](../src/ui/theme/typography.ts#L43) | CURRENT CONTRACT; PARTIAL IMPLEMENTATION | Families and roles exist; production rendering remains unfinished |
| UI/UX | [D05 — Screen Layouts](05_UI_UX_AND_SCREEN_LAYOUTS.md) | CURRENT CANONICAL | Installed-slot tap is explicitly OWNER DECISION REQUIRED in D05; GAR-01 not READY |
| Ownership and saving | [D06 — Architecture/Save](06_ARCHITECTURE_AND_SAVE_MODEL.md) | CURRENT CANONICAL | Strongly supported by implementation |
| VS1 integration | [D07 — Build Plan](07_VERTICAL_SLICE_BUILD_PLAN.md) | CURRENT SUPPORTING | Existing domain/service bindings and production inputs clarified; D14 owns sequencing |
| AI workflow | [D08 — Workflow Rules](08_AI_CODEX_WORKFLOW_RULES.md) | CURRENT CANONICAL | D14 evidence-based change procedure and task authority referenced |
| Expansion | [D09 — Roadmap](09_EXPANSION_ROADMAP.md) | CURRENT SUPPORTING | Expansion deferred; D13 VS1 audio timing explicit |
| Stack and platform gates | [D10 — Technology](10_TECHNOLOGY_DECISION.md) | CURRENT CANONICAL | Aggregate-check steps reconciled to manifest; gate implementation limits explicit |
| Art production | [D11 — Asset Workflow](11_ASSET_PRODUCTION_WORKFLOW.md) | CURRENT CANONICAL | Exact Golden scope, six statuses, staged validation and stale tooling contained |
| Trust and release | [D12 — Security/Trust](12_SECURITY_AND_TRUST_MODEL.md) | CURRENT CANONICAL | Local correctness does not establish anti-cheat |
| Audio | [D13 — Audio Direction](13_AUDIO_DIRECTION_AND_PRODUCTION.md) | CURRENT CANONICAL; PROVISIONAL DELIVERY | Sonic policy unchanged; browser/native codec approval stages explicit and delivery still provisional |
| Audio requirements | [AU — Audio Registry](../src/game/audio/audioRegistry.ts#L20) | CURRENT CANONICAL | 13 required VS1 entries; `.mp3` explicitly provisional |
| Repository overview | [README](../README.md#L17) | CURRENT SUPPORTING | VAL-01 documents executable visual stages and the existing eight-step development check |

Authority resolution for this plan:

1. Preserve D00/D01 product identity.
2. Preserve D02/D03/D06 gameplay, ownership, and save contracts.
3. Use AR for exact visual assets, dimensions, bindings, and Golden membership.
4. Use D13/AU for audio scope.
5. Correct older summaries explicitly; do not treat them as permission to remove registry requirements.
6. Treat numerical balance and runtime audio delivery as provisional until their designated proofs.

No complete document is being declared obsolete. Specific sections and references are stale.

## 4. Confirmed Current Product State

The maturity labels below describe systems at the baseline audit. They are separate from execution-task statuses in §§18–20: existing validated domain simulation does not make the future RunScene integration task DONE.

**Implemented + Validated**

Static data, vehicle calculations, simulation and simulator scenarios had read-only verification during the baseline audit. The following systems also have meaningful regression assertions supporting their production implementation:

| Boundary | Existing tests prove or exercise | Remaining limit |
|---|---|---|
| Merge | Family/tier resolution, max-tier rejection, duplicate eligibility | Player-facing selection and feedback absent |
| Vehicle values | Base/additive values, fixed maxHeat, numeric safety | Real visual/stat comprehension absent |
| Simulation | Terrain crossings, partition agreement, earliest failure, ties, stall cap, numeric rejection | Phaser integration absent |
| State ownership | Frozen snapshots, readiness, valid commands, copy conservation, RNG boundaries | Actual scene interaction absent |
| Run settlement | Duplicate/stale/cloned-token rejection, invalid results, failed-save idempotency | Real result callbacks absent |
| Save codec | Semantic salvage, unsupported versions, bounded values, ownership preservation | Future preference migration absent |
| Repository/storage | Captured write ordering, reset ordering, recovery backup, failure propagation | Real browser/native failure acceptance remains |
| Lifecycle | Hidden/resume signals, flush reporting, listener disposal | Device lifecycle remains unproven |
| Data validation | Invalid IDs, references, numbers, roads, slots, balance values | Does not judge fun or pacing |

The unit-suite support above is based on inspected assertions, not a fresh suite-pass claim.

**Implemented but Not Real-Game Proven**

- State/save/lifecycle services through actual player interactions.
- Integer viewport controller through production content.
- Audio service through actual Phaser playback.
- Visual validator core through production assets.
- Typography tokens through production fonts and panels.

Audio tests mock Phaser. They support volume multiplication, active-sound updates, mute restoration, music deduplication, and unlock intent. They do not prove decoding, loops, background behavior, pitch control, or real concurrency.

**Designed but Not Implemented**

- Production Garage.
- Production RunScene.
- Result/diagnosis experience.
- Production preload and Garage transition.
- Settings, retry/reset presentation, persisted audio options.
- Every production visual and audio asset.
- Browser one-writer protection.
- Android integration and release services.

**Provisional / Awaiting Proof**

- Palette and rendered visual identity.
- Typography sizes, wrapping, bitmap rendering.
- All eight simulator balance baselines.
- Golden music/SFX coherence.
- Runtime audio format.
- Engine pitch range, repetition tolerance, mix.
- Touch, physical-device rendering, performance and lifecycle.

**Deferred**

Expansion tiers/families/chassis, automation, offline rewards, new roads, prestige, unique item instances, repeated-slot architectures, accounts, cloud save and leaderboards. D09 does not establish these as V1 requirements.

Important untested production boundaries include scene navigation, actual input, loader failure, typography, asset/PNG validation regressions, audio-validator regressions, explicit run pause/quit, integrated diagnosis, and cross-scene cleanup.

## 5. Confirmed Contradictions / Stale Material

The table records the **2026-10-04 baseline findings**, including earlier prose that DOC-01 has now reconciled. Read the resolution record below for current documentation; implementation gaps remain assigned to their existing tasks.

| Classification | Evidence | Consequence |
|---|---|---|
| **CONFIRMED CONTRADICTION: visual command does not validate** | Manifest invokes `tools/assets/validateAssets.ts`; that module exports functions but never calls them. Its `--release` invocation exited 0 with no report. Direct invocation produced 173 release errors. [Validator](../tools/assets/validateAssets.ts#L349) | Repair the CLI before accepting any visual gate. |
| **CONFIRMED CONTRADICTION: audio root** | `runtimeAudioUrls()` returns `audio/music/...`; validator joins it to `public`, producing `public/audio/...`. D13 requires `public/assets/audio/...`. [Audio validator](../tools/assets/validateAudio.ts#L7) | Fix path resolution and add an actual-path regression. |
| **CONFIRMED CONTRADICTION: automatic strict audio gate** | D13 says strict mode activates when Golden production begins. Code activates it only through `--strict`; aggregate `check` supplies no flag. | Introduce explicit staged enforcement. Golden production must not require all 13 files prematurely. |
| **CONFIRMED CONTRADICTION: SFX concurrency** | D13/AU describe simultaneous `maxInstances`. `playSfx()` counts requests younger than 100 ms and never checks active instances. [AudioService](../src/game/audio/AudioService.ts#L100) | Implement real instance ownership/limits. Cooldown remains conditional on listening evidence. |
| **CONFIRMED CONTRADICTION: viewport test discovery** | `pixelViewport.test.ts` exists, but Vitest includes domain/services/data/audio/tools only. [Vitest config](../vitest.config.ts#L25) | Include the existing pure viewport suite. |
| **CONFIRMED CONTRADICTION: art dimensions** | D04 specifies 128×64 chassis, 32×32 parts/wheels, 360×320 backgrounds. AR specifies 112×56 body/overlays, 24×24 parts/wheels, and asset-specific environment dimensions. | Retain AR dimensions; correct D04. |
| **CONFIRMED CONTRADICTION: installed visuals** | D04 primarily visualizes four families through engineering icons. AR and `validateCoverage()` require body overlays for those families at every tier. | Retain the existing overlay contract for this plan; reconcile D04 explicitly. |
| **STALE DOCUMENTATION: Golden summary** | D11 lists five representative categories. `isGolden()` includes all `proof_*` entries: **22 assets**. | Use the exact registry set, including progression ladder, fonts, UI states, Garage and effects. |
| **STALE DOCUMENTATION: approval lifecycle** | D11 lists four statuses; AR lists `planned → draft → technical → visual → ingame → approved`. | Use all six statuses and retain human approval. |
| **CONFIRMED IMPLEMENTATION GAP: typography** | Tokens recommend bitmap rendering; no font assets/loaders exist. Bitmap family values are `Silkscreen`/`VT323`, while registered cache keys are `font_display`/`font_body`. | Add production rendering and explicit key mapping. |
| **CONFIRMED IMPLEMENTATION GAP: proof scene** | DevTypographyScene is unregistered, uses 340-wide panels, and does not test the current safe rectangle or real assets. [Scene](../src/game/scenes/DevTypographyScene.ts#L25) | Replace its assumptions with a retained production proof view. |
| **CONFIRMED CONTRACT MISMATCH: typography coordinates** | Token comments/wrap widths assume a 360-wide logical viewport; actual minimum width is 180 AP. | Prove and narrowly correct rendered sizing; do not redesign the font system. |
| **STALE REFERENCES** | Registry/validator refer to absent visual-acceptance documentation; palette references absent scripts and `assets:palette`. | Repair references and supply only necessary production tooling. |
| **STALE BUILD PLAN** | D07 asks scenes to implement simulation and calculate rewards already owned by domain/service code. | Replace those instructions with binding work. |
| **STALE ROADMAP** | D09 places audio in later commercial polish; D13 defines required VS1 audio. | D13 governs VS1 audio timing. |
| **CONFIRMED UI AMBIGUITY** | D05 says installed-slot tap shows details, elsewhere immediately uninstalls, and MAX tap shows details. | Resolve the interaction before GAR-01 becomes READY. |
| **FORWARD INTEGRATION CONFLICT** | Visual validator treats every unregistered file under `public/assets` as unexpected; future audio resides there. | Partition visual/audio ownership without allowing unchecked files. |

Two additional limits must remain explicit:

- The audio validator currently checks existence and duplicate IDs; it does not validate provenance, actual audio content, decoding, loudness or loops.
- `UI_TEXT_PAIRS` exists but has no consumer/test. Declaring contrast pairs does not enforce them.

The starter performing worse than the bare chassis is **a documented provisional tradeoff**, not an undisclosed contradiction. External music-entitlement claims were not independently reverified during this repository review; production preflight must do that when generation begins.

### DOC-01 reconciliation record — 2026-10-05

| Baseline conflict | Current resolution / owning evidence |
|---|---|
| Art dimensions and installed visuals | D04 now defers exact dimensions to AR and requires registered body overlays plus authored wheel cycles; no registry/art scope changed. |
| Golden summary and approval lifecycle | D11 represents all 22 `proof_*` entries (including both fonts and all Engine tiers), links the exact registry-derived §21 checklist, and preserves all six `ASSET_STATUSES`. Technical success is separate from visual/in-game/final approval. |
| Typography / viewport assumptions | D04/D05 distinguish browser CSS QA targets, DPR/device pixels and logical AP canvas. D05 preserves actual TY role names and font identities, documents `font_display`/`font_body` mapping, and flags legacy sizes/wraps for TYPO-01/02 proof. TY code remains unchanged. |
| Scene/domain/run ownership | D05/D07 bind to GS commands, `currentVehicleStats`, original service-issued session, existing simulation and service settlement; scenes own presentation and evolving ephemeral state, not saved progress or rewards. |
| Audio timing / delivery / gates | D07/D09/D13 put Golden/browser proof in VS1 and full audio before M3; browser encode approval can unlock production while native/WebView confirmation waits for AND-04. Raw originals and lossless masters are preserved; `.mp3` remains provisional. D11/D13 require honest preparation/stage/full reports; VAL-01/02 still own implementation. |
| Stale visual/tool references | D11 §8 redirects absent visual-acceptance references to D04/D11/D14 and identifies the real validator/palette module. Missing palette/export/contact-sheet commands are explicitly unavailable/future work. Source comments/messages remain unchanged for later tooling tasks. |
| Installed-slot tap | **OWNER DECISION REQUIRED** in D05 §8. Commands establish conservation, not a gesture. Owner must resolve details versus uninstall, MAX-tier behavior and selected-part targeting before GAR-01 is READY. This does not block DOC-01 or VAL work. |
| Workflow and aggregate-check wording | D08 references D14 task sequencing and evidence-based change control. D10 accurately describes eight manifest steps and their current limits. README’s older six-step summary remains a documented supporting-source limit outside this task’s history-link-only README scope. |
| Root history | Absent root planning report is no longer linked or claimed available; baseline evidence remains in this plan. |

Documentation consistency checks passed for DOC-01; no new visual/audio/product decision or asset approval was made. Its original human gate applies only to affected decisions: existing identities/contracts were preserved, and the unresolved player interaction stays with the owner. The implementation defects listed above are not claimed fixed by documentation changes.

## 6. Previous Planning Critique Verification

The earlier plan addressed by the supplied critique was not present in the baseline audit’s inspected repository. Verdicts therefore verify that critique’s technical premise, not undocumented historical wording.

| Suspected issue | Verdict | Evidence | Planning consequence |
|---|---|---|---|
| 15A — Missing typography task | **CONFIRMED** | Missing production fonts, inactive proof scene, coordinate mismatch | Explicit TYPO-01 and TYPO-02 |
| 15B — Golden Art scope inconsistent | **CONFIRMED** | AR has 22 Golden entries | Exact set across ART-01/02/03 and TYPO-01 |
| 15C — Golden Audio incomplete | **CONFIRMED** | D13 identifies two music loops and four SFX | All six represented, followed by integrated proof |
| 15D — Mass art lacks tasks | **CONFIRMED** as a production need | 64 required non-Golden assets remain | Concrete registry-based batches |
| 15E — Garage must output stats | **CONFIRMED** as an incorrect dependency | `startRun()` calculates service-owned stats | Run implementation can proceed alongside Garage |
| 15F — Fake run-shell risk | **CONFIRMED** | D00 prohibits disposable prototypes; simulator exists | First Run increment binds real simulation and settlement |
| 15G — Console acceptance | **PARTIALLY TRUE** | Current Boot is diagnostics; historical acceptance wording unavailable | Gameplay acceptance requires visible behavior |
| 15H — Exact-distance targets | **PARTIALLY TRUE** | D02 explicitly calls distances provisional | Keep mathematical assertions; use progression bands for tuning |
| 15I — Restrictive change control | **PARTIALLY TRUE** | D08 requires adherence; no complete product-evidence exception procedure | Add narrow UX/visual/audio/cost evidence procedure |
| 15J — Small risk register | **PARTIALLY TRUE** | Significant risks are evidenced; previous register unavailable | Include product, production and platform risks |
| 15K — Shallow release backlog | **PARTIALLY TRUE** | D07 ends at VS1 with brief release gates | Provide concrete V1/Android/store gates; keep uncertain features coarse |

## 7. Current Production Bottleneck

**The bottleneck is the absence of technically trustworthy, approved production presentation inputs for a real player-facing loop.**

Evidence:

- Zero runtime assets.
- All 89 visual entries are `planned`.
- Zero of 22 Golden entries approved.
- No production typography rendering.
- Visual CLI currently provides false-success evidence.
- Only BootScene is registered.
- Domain mechanics, simulation and state ownership already exist.

Repairing validation is the immediate prerequisite. Golden visual production and typography then unlock real scene work.

Audio is a parallel production track. It gates presentation-complete VS1, but should not unnecessarily delay the first real gameplay loop.

## 8. Overplanning Assessment

| Workstream | Status | Next real evidence needed |
|---|---|---|
| Domain architecture and commands | **READY FOR IMPLEMENTATION** | Actual scene bindings |
| Save/storage foundation | **READY FOR IMPLEMENTATION** | Recovery/retry/reset UI and browser acceptance |
| Simulation | **READY FOR IMPLEMENTATION** | Production RunScene |
| Visual validation | **MORE FOUNDATION REQUIRED** | Working CLI, staged gates and regression cases |
| Audio validation | **MORE FOUNDATION REQUIRED** | Correct paths and honest staged enforcement |
| Typography | **MORE FOUNDATION REQUIRED**, narrowly | Production font assets/rendering, then visual proof |
| Art direction | **READY FOR REAL-CONTENT PROOF** | Exact Golden set |
| Garage | **READY FOR IMPLEMENTATION once inputs exist** | Touch interaction with real content |
| Run/Result | **READY FOR IMPLEMENTATION once inputs exist** | Real simulation, failure, settlement and diagnosis |
| Audio direction | **READY FOR REAL-CONTENT PROOF** | Music pair, four SFX, browser/runtime auditions |
| Balance | **READY FOR PLAYTEST after loop integration** | Improvement, frustration, pacing and diagnosis evidence |
| Browser/mobile QA | **READY FOR REAL-CONTENT PROOF** | Actual content at target sizes and on phones |
| V1 content expansion | **DEFERRED pending scope decision** | Owner-approved V1 boundary |
| Native and monetization | **DEFERRED** | Proven browser product and actual provider/platform decisions |

Another general foundation audit would add little value. The identified fixes are bounded and should lead directly to content and runtime proof.

## 9. Project Management Decision

**Recommended method: Milestone-Based Kanban.**

| Method | Assessment |
|---|---|
| No formal process | Low overhead, but weak blocker and approval visibility |
| Kanban | Good WIP control; needs explicit product gates |
| Scrum | Ceremony and sprint commitments add little value for one owner plus AI execution |
| Scrumban | Useful concepts, unnecessary additional process here |
| Milestone-only | Clear destinations, weak task readiness and WIP control |
| **Milestone-Based Kanban** | **Best fit: visible dependencies, bounded tasks, explicit human proof and milestone acceptance** |

The owner controls product acceptance. Codex executes bounded tasks and supplies technical evidence. Asset contributors supply editable source, exports and provenance.

## 10. Sprint Decision

`USE SPRINTS: NO`

Use:

- Task review after each coherent implementation item.
- Owner proof sessions when visual/audio/gameplay evidence becomes available.
- Milestone review when exit criteria are satisfied.
- A brief weekly board review if useful, without promising a fixed delivery quantity.

Review cadence organizes decisions; it does not become an hour/day estimate.

## 11. Estimation Policy

Adopt:

```text
NO hour/day estimates.
Size: SMALL / MEDIUM / LARGE
Risk: LOW / MEDIUM / HIGH
Track explicit dependencies and blockers.
```

Size describes implementation breadth and review burden. Risk describes uncertainty or potential damage. Neither predicts elapsed time.

A small codec experiment may have high risk. A large registry-derived art batch may have moderate risk.

Do not introduce story points. Split LARGE work before execution when it cannot be reviewed as one coherent result.

## 12. Workflow States

```text
BACKLOG → READY → IN PROGRESS → VALIDATION → DONE
                       ↘ BLOCKED ↗
```

| State | Meaning |
|---|---|
| BACKLOG | Identified work; inputs or acceptance may still need resolution |
| READY | Inputs, authority, boundaries and validation are known |
| IN PROGRESS | One coherent task is actively being executed |
| VALIDATION | Implementation exists; required technical or human evidence remains |
| BLOCKED | A named dependency prevents progress; record unblock condition and owner |
| DONE | All acceptance criteria, including required human approval, are satisfied |

Recommended WIP limits:

- One active implementation task per execution agent.
- One owner-facing acceptance package at a time.
- At most two independent production tracks alongside code.
- Assign one writer to shared registries/configuration during each batch.

Waiting for visual or listening approval belongs in VALIDATION. Missing assets, unresolved contracts or unavailable required devices belong in BLOCKED.

### Task-status transition policy

| Transition | Required condition |
|---|---|
| BACKLOG → READY | The task satisfies the Definition of Ready in §13. |
| READY → IN PROGRESS | Implementation begins within the task’s authorized scope. |
| IN PROGRESS → VALIDATION | Implementation work is complete, but required checks or approval remain. |
| IN PROGRESS / VALIDATION → BLOCKED | A named unresolved dependency prevents continuation; record its owner and unblock condition. |
| VALIDATION → DONE | Every automated and required human acceptance condition passes under §14. |
| VALIDATION → IN PROGRESS | Validation fails and the task can continue with corrective implementation. |
| VALIDATION → BLOCKED | Validation fails because a named unresolved dependency prevents correction. |

Do not skip VALIDATION for tasks requiring human acceptance. When a blocker clears, reassess readiness and return the task to READY, IN PROGRESS or VALIDATION according to the work and evidence remaining; clearing a blocker alone does not make it DONE.

## 13. Definition of Ready

| Task type | Required before READY |
|---|---|
| Code | Current implementation inspected; authority identified; dependencies resolved; exact behavior, file boundaries and validation known |
| Art | Registered IDs/dimensions/alpha/palette known; Golden gate satisfied for non-Golden work; editable-source and approval method known |
| Typography | Existing roles/families retained; production font inputs available; AP sizing and target samples identified |
| Audio | Role and Golden sequence known; source/licensing preflight completed; provenance and audition method known |
| Gameplay | Authoritative command/session contract known; required presentation inputs available; success and rejection paths specified |
| QA/playtest | Runnable increment exists; questions, device/viewport and observation method defined |
| Android/release | V1 scope frozen; actual platform/provider requirements retrieved; ownership and responsibility assigned |

The installed-slot interaction blocks GAR-01 readiness, not immediate validation/font/Golden work.

## 14. Definition of Done

| Task type | Done requires |
|---|---|
| Code | Scoped implementation, relevant tests, typechecks, applicable project gates, exercised integration and exact changed-file report |
| Visual | Correct source/runtime files, registry status, technical validation, actual-size inspection and owner approval |
| Typography | Correct production renderer/cache keys, target viewport proof, wrapping, hierarchy and numeric readability on actual backgrounds |
| Audio | Provenance, valid exports, listening approval, applicable loop/rate tests, runtime proof and required device/mix acceptance |
| Gameplay | Authoritative state binding, visible success/rejection paths, real interactions, correct settlement and human play validation |
| QA | Recorded observations, unresolved failures listed, fixes rechecked and milestone consequences stated |
| Release | Reproducible approved artifact, platform checks, required disclosures/licenses, device acceptance and owner release approval |

Passing automated checks alone cannot finish a task marked VISUAL, AUDIO, PLAYTEST or DEVICE.

## 15. Milestone Structure

Milestone status uses only `NOT STARTED`, `IN PROGRESS`, `VALIDATION`, `BLOCKED`, or `DONE`. These milestone states are separate from the task states in §12.

| Milestone | Status | Goal | Entry conditions | Required tasks | Exit criteria | Human approval? | Next unlocked work |
|---|---|---|---|---|---|---|---|
| **M0 — Production Gates & Golden Visual Proofs** | IN PROGRESS | Trustworthy gates and approved presentation baseline | Current checkout | DOC-01, VAL-01/02/03, TYPO-01/02, ART-01/02/03/04, VIS-01 | Exact 22 Golden assets approved; typography proven; palette locked; gates execute correctly | VISUAL | Non-Golden art and production scenes |
| **M1 — Garage Engineering Ready** | NOT STARTED | Real inventory/install/stat interactions | M0; required Garage assets | ART-05/06/08/09/10/11, GAR-01/02/03 | Valid loaded saves render; starter installation works; commands and rejection feedback work | VISUAL, PLAYTEST | Complete run loop |
| **M2 — Playable Vertical Slice** | NOT STARTED | Engineer → run → diagnose → reward → improve | Required road/HUD assets and service contracts | ART-07/12, RUN-01/02, RES-01, PLAY-01/02; SAVE-01 before meaningful external playtest | Earned Scrap funds acquisition; merges/installations affect subsequent runs; failure/quit settle once; return loop works | PLAYTEST | Balance and integrated presentation proof |
| **M3 — Presentation-Complete VS1** | NOT STARTED | Coherent complete VS1 with required art/audio | Playable loop | ART-13/14, AUD-01…07, BAL-01, QA-01/02, VS-01 | All 86 required visual entries and 13 audio entries accepted; complete touch/layout/audio/diagnosis proof | VISUAL, AUDIO, PLAYTEST, DEVICE | V1 scope and release hardening |
| **M4 — V1 Feature/Content Complete** | NOT STARTED | Freeze the actual release product | Accepted VS1; owner scope decision | V1-01…06 | Approved feature/content list complete; save/options behavior accepted; public-browser ownership gate satisfied where applicable | PLAYTEST, DEVICE | Android integration |
| **M5 — Android Integration Complete** | NOT STARTED | Proven native delivery | V1 baseline frozen | AND-01…05 | Owned native source; build/install works; storage/lifecycle/rendering/audio accepted; native codec decision proven | DEVICE, AUDIO | Release services |
| **M6 — Release Services Decided/Complete** | NOT STARTED | Implement only selected commercial services | Native baseline; commercial decision | MON-01…03, applicable REL-01 work | Selected services prove consent, trust, cancellation/replay and disclosure behavior; declined services explicitly closed | PLAYTEST, DEVICE | Store candidate |
| **M7 — Play Store Release Candidate** | NOT STARTED | Reviewable signed release artifact | Product and selected services accepted | REL-01…05 | Store materials, signed build, internal testing and current Play checks complete; blocking defects closed | Owner release approval | Submission decision |

The audio track starts during M0 and proceeds alongside scene work. **M0 does not claim full Golden Audio approval**: actual in-game mix proof needs M2, and native WebView delivery proof belongs in M5.

### Milestone-close rule

Before marking a milestone DONE:

1. Verify every required task is DONE.
2. Verify all milestone exit criteria.
3. List remaining known limitations.
4. Obtain the required owner/human approval.
5. Update the Current Execution Snapshot.
6. Identify newly READY tasks by applying §13 to their dependencies and inputs.
7. Assign deferred findings to an explicit future task and owner where necessary.

Code completion alone does not close a milestone. Keep this review tied to evidence and the exit gate; it does not introduce formal sprints.

> [PLAN MAINTENANCE NOTE — requires future reconciliation] M1 lists GAR-02 as required, while §23 says naturally funded acquisition/merge comprehension requires the rewarded run loop in M2. The original milestone definitions and dependencies are preserved. Reconcile M1 close timing before approval; fixture-based branch checks do not replace naturally earned progression PLAYTEST acceptance.

## 16. Critical Path to Playable VS1

```text
Working validation + reconciled contracts
    → Golden visual assets + production fonts
    → rendered typography/Golden approval
    → required Garage/vehicle/part/UI/terrain batches
    → Garage commands + real RunScene integration
    → terminal settlement + diagnosis + return
    → earned-Scrap acquisition/merge/improvement loop
    → core-loop playtest
```

Garage and Run implementation can overlap after their own inputs are ready.

Audio masters/SFX/browser codec experiments run alongside this path. Audio preferences must persist before meaningful user-facing playtests using audio. Full audio and presentation acceptance gate M3.

## 17. Major Dependency Graph

| Workstream | Hard dependency | Soft dependency | Parallel opportunities |
|---|---|---|---|
| Validator repair | Current registry/tool contracts | None | Documentation reconciliation, existing-test discovery repair |
| Production fonts | TY/AR font contract | Panel/background refinements | Golden vehicle and environment production |
| Golden art | Exact registry requirements and trustworthy technical gate | Typography iteration during production | Music/SFX production |
| Golden visual approval | Complete technical set, font rendering and composite proof | None | Browser audio proof |
| Non-Golden art | All Golden assets approved | Scene feedback before final approval | Separate UI, part, terrain and effects batches |
| Garage | Required approved assets and resolved slot interaction | Final audio polish | Run implementation |
| Run | Approved minimum assets; existing session/simulation contract | Garage navigation needed for complete-loop approval | Garage interactions |
| Result | Real terminal state and successful service settlement | Final decorative treatment | Audio event integration |
| Audio runtime | Valid Golden exports and service lifecycle corrections | Real scenes for final mix approval | Scene development |
| Audio codec | Actual browser playback proof | Native WebView remains later | Source-master production |
| Balance | Real loop and comprehension observations | Final presentation polish | Simulation analysis |
| Native | Accepted V1 and source ownership decision | Commercial SDK decisions | Store-content preparation |
| Monetization | Owner strategy and actual provider trust contract | Store materials | Applicable privacy/release work |
| Store candidate | Native/services/license/device gates | None | Listing and store-art preparation |

Parallel work must use separate file ownership. Shared AR/AU/package/config patches are serialized or assigned to a single integrator.

## 18. Detailed Near-Term Backlog

Backlog references:

- **GS:** [GameStateService](../src/services/state/GameStateService.ts), authoritative progress and run commands.
- **SIM:** [production simulation](../src/domain/run/simulation.ts), the existing run domain.
- **SAVE:** [save codec](../src/services/save/saveCodec.ts), [SaveRepository](../src/services/save/SaveRepository.ts), and [storage adapter](../src/services/storage/StorageAdapter.ts).
- **VP:** [pixel viewport](../src/game/config/pixelViewport.ts) and [viewport controller](../src/game/config/viewportController.ts).
- **AV:** [visual validator](../tools/assets/validateAssets.ts), after its executable/staged gate repair.
- **AA:** [audio validator](../tools/assets/validateAudio.ts), after its runtime-root/staged gate repair.
- **T:** source and tool/config typechecks: `npm run typecheck` and `npm run typecheck:tools`.
- **U:** relevant regression/integration tests through `npm run test`; discovery is governed by [Vitest configuration](../vitest.config.ts).
- **C:** corrected `npm run check`, including build, during an authorized implementation task; command ownership is in [package.json](../package.json).
- **AV-stage / AA-stage:** enforce the selected production stage while preserving full registry integrity. **AV-release / AA-full** enforce the complete required visual/audio set at their release/full gates.
- **D00–D13, AR, AU, TY, PAL:** resolve through the linked canonical documentation map in §3.
- **VISUAL / AUDIO / PLAYTEST / DEVICE:** required human visual inspection, listening, observed gameplay and physical-device acceptance; **NONE** means no separate human gate is specified by that row.

Priorities: **P0** immediate critical path; **P1** required for VS1; **P2** later requirement; **P3** deferred/future gate.

| ID | Status | Priority | Task | Goal | Evidence | Depends On | Dependency Type | Parallel With | Source of Truth | Scope | Do Not Touch | Acceptance | Automated Validation | Human Validation | Risk | Size |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DOC-01 | DONE | P0 | Reconcile production contracts | Remove proven instruction conflicts | §5 findings | None | Hard before affected execution | VAL work | D00–13, AR/AU | Correct dimensions, overlays, Golden/status summaries, phase ownership, slot interaction, references and codec-stage wording | Product identity, unrelated expansion | One consistent production contract; unresolved owner choices explicit | Reference/contract comparison; documentation searches; diff check | VISUAL for affected decisions (none changed; slot choice explicitly pending) | MEDIUM | MEDIUM |
| VAL-01 | DONE | P0 | Make visual gates executable | End false-success validation | Baseline CLI no-op resolved; 41 regressions; execution evidence above | None | Hard for visual acceptance | VAL-02/03, DOC-01 | AR, PAL, D11, AV | CLI/report/exit codes; stage presence gates; asset-specific status recording; visual/audio tree ownership; focused PNG/palette/gate regressions | Art scope, gameplay | Real invocation rejects invalid/missing stage inputs; full release enforces required assets and locked palette | T, U, positive/negative CLI cases | NONE | MEDIUM | MEDIUM |
| VAL-02 | DONE | P0 | Repair audio production gate | Validate the actual runtime tree honestly | Correct root/stages; 36 regressions; execution evidence above | None | Hard for audio acceptance | VAL-01/03, DOC-01 | D13, AU | Correct root; explicit preparation/Golden/full stages; Golden membership; required/scope semantics; provenance and invalid-file checks appropriate to chosen exports | Codec finalization, asset creation | Correct-path files found; missing stage assets fail; full gate requires 13; preparation cannot masquerade as production acceptance | T, U, CLI path/stage cases | NONE | MEDIUM | MEDIUM |
| VAL-03 | DONE | P0 | Discover existing viewport tests | Restore existing mathematical coverage | Excluded test glob | None | Hard for viewport gate | VAL-01/02 | VP, Vitest config | Include pure viewport tests | Phaser scene test rewrites | Existing suite discovered and executed by standard test command | T, U | NONE | LOW | SMALL |
| TYPO-01 | BACKLOG | P0 | Production font/rendering foundation | Render existing typography in AP coordinates | No bitmap fonts; cache-key mismatch | VAL-01; DOC-01 font contract | Hard for typography proof | ART-01/02/03, AUD-01 | TY, AR fonts, D04/05 | `font_display`, `font_body`, editable/licensed sources, XML/PNG exports, renderer/key mapping, explicit sizing/wrap behavior | Font identity/role redesign | Fonts load reliably; intended renderer used; actual logical widths respected | T, AV-stage; focused renderer checks | VISUAL | HIGH | MEDIUM |
| ART-01 | DONE | P0 | Golden vehicle/engine ladder | Prove vehicle silhouette and progression | Eight `proof_a` entries produced; technical gate passed; owner visual approval recorded | VAL-01 | Hard for Golden approval | TYPO-01, ART-02/03, AUD | D04, D11, AR | Exact eight entries in §21 | Non-Golden production | Clean source/exports; T1–T3 readable; overlay registration and wheel cycle work; owner approval recorded | AV-stage | VISUAL | HIGH | MEDIUM |
| ART-02 | DONE | P0 | Golden UI samples | Prove tactile controls | Five non-font `proof_b` entries produced; technical gate passed; owner visual approval recorded | VAL-01 | Hard for Golden approval | ART-01/03, TYPO-01 | D04/05/11, AR | Scrap/fuel icons, plate, primary button, slot frames | Remaining UI batch | Frame states, slicing, text/background combinations work; owner approval recorded | AV-stage | VISUAL | HIGH | MEDIUM |
| ART-03 | IN PROGRESS | P0 | Golden Garage/road/effect samples | Prove scene coherence | ART-03R: six Run entries technical (including optional clouds); owner review pending; two Garage entries planned/absent | VAL-01 | Hard for Golden approval | ART-01/02, TYPO-01 | D04/11, AR | Exact seven entries in §21 | Remaining terrain/props | Composition, tiling, vehicle contrast and puff treatment work | AV-stage | VISUAL | HIGH | MEDIUM |
| VIS-01 | BACKLOG | P0 | Production loading and retained proof view | Exercise real exports through Phaser | Boot preload empty; proof scene inactive | Technical inputs from ART-01/02/03 and TYPO-01 | Hard for rendered approval | AUD-03 after inputs | AR, VP, D05/06 | Registry-driven images/sheets/fonts, errors, development-only proof navigation and resize behavior | Progress ownership, fake gameplay | Correct keys/frames/fonts load; failures visible; reusable production loader | T, U where meaningful, AV-stage | VISUAL | MEDIUM | MEDIUM |
| TYPO-02 | BACKLOG | P0 | Typography visual acceptance | Prove readability on production backgrounds | Current proof insufficient | TYPO-01, VIS-01, technical ART-02/03 | Hard for Golden approval | AUD proof | TY, D05, VP | §21 samples at target viewports; narrow demonstrated corrections | New font/branding system | Hierarchy, numbers, wrapping and labels accepted at real size | T, AV-stage | VISUAL; DEVICE spot-check | HIGH | MEDIUM |
| ART-04 | BACKLOG | P0 | Approve exact Golden visual set | Unlock controlled expansion | 0/22 approved | ART-01/02/03, TYPO-02, VIS-01 | Hard for all non-Golden art | Audio track | AR, PAL, D04/11 | All 22; composition review; palette lock and truthful statuses | Additional art families | Owner accepts every Golden entry; locked palette passes gate | AV-stage with locked palette | VISUAL | HIGH | SMALL |
| AUD-01 | BACKLOG | P1 | Golden music pair | Prove shared sonic identity | D13 sequence; no sources | Entitlement preflight | Hard for audio Golden gate | Visual/scene work | D13, AU | Garage candidates → motif → Run candidates → pair; raw/session/master/provenance | Remaining music, final codec claim | Pair coherent and instrumental; Garage repetition and Run restart auditions pass | Provenance/master checks | AUDIO | HIGH | MEDIUM |
| AUD-02 | BACKLOG | P1 | Four Golden SFX | Prove vehicle/interaction/failure sound | D13 exact set | Source/license preflight | Hard for audio Golden gate | AUD-01, visual work | D13, AU | Engine loop, merge, click, fail; source/master/provenance | Remaining seven SFX | Engine tolerates expected rate range; feedback clear and tolerable | AA-stage/master checks | AUDIO | HIGH | MEDIUM |
| AUD-03 | BACKLOG | P1 | Browser codec/unlock proof | Select viable browser delivery candidates | `.mp3` provisional; no runtime proof | VAL-02, AUD-01/02, VIS-01 | Hard for browser audio integration | Garage/Run work | D13, AU, AudioService | Candidate encodes in actual Phaser; looping, unlock, switching, resume, latency/size | Native approval claim | Repeated playback accepted on desktop and physical mobile browser; native limitation explicit | AA-stage; playback assertions where useful | AUDIO, DEVICE | HIGH | MEDIUM |
| ART-05 | BACKLOG | P1 | Bare vehicle completion | Support legitimate empty builds | Two `hero` entries | ART-04 | Hard for complete vehicle presentation | Other art batches | AR, D02/04 | `veh_wheel_bare`, `veh_shadow` | Optional wreck sprite | Bare chassis presents correctly in Garage and Run | AV-stage | VISUAL | MEDIUM | SMALL |
| ART-06 | BACKLOG | P1 | Garage UI expansion | Support engineering controls | Eleven entries, §21 | ART-04 | Hard for GAR-01/02/03 | Part/road batches | AR, D05 | Exact Garage UI batch | Run UI, domain commands | Controls, badges and icons accepted at target size | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-07 | BACKLOG | P1 | Run/Result UI expansion | Support telemetry and diagnosis | Six entries, §21 | ART-04 | Hard for RUN-01 | Garage/part/road batches | AR, D05 | Exact Run/Result UI batch | Simulation | Gauges, pause icon, stamps readable | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-08 | BACKLOG | P1 | Fuel family batch | Complete fuel ownership visuals | Three icons + three overlays | ART-04 | Hard for complete Garage | Other family batches | AR, D03/04 | Fuel T1–T3 icons/overlays | Other families | Tier ladder and installed registration accepted | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-09 | BACKLOG | P1 | Cooling family batch | Complete cooling visuals | Three icons + three overlays | ART-04 | Hard for complete Garage | Other family batches | AR, D03/04 | Cooling T1–T3 icons/overlays | Other families | Readable progression and registration | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-10 | BACKLOG | P1 | Suspension family batch | Complete suspension visuals | Three icons + three overlays | ART-04 | Hard for complete Garage | Other family batches | AR, D03/04 | Suspension T1–T3 icons/overlays | Other families | Readable progression and registration | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-11 | BACKLOG | P1 | Remaining tires batch | Complete tires and wheel progression | Three icons + two sheets | ART-04 | Hard for complete Garage/Run | Other family batches | AR, D03/04 | Tire icons T1–T3; wheel sheets T2/T3 | Golden T1 wheel replacement | All wheel cycles and tier distinctions accepted | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-12 | BACKLOG | P1 | Remaining terrain layers | Match all simulated segments visually | Eight `road` layer entries | ART-04 | Hard for unrestricted production runs | Garage/part work | AR, D03/04 | Three skies, two far layers, three ground bands | New roads | Every segment has correct layers and clean transitions | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-13 | BACKLOG | P1 | Road prop expansion | Complete roadside vocabulary | Eleven remaining props | ART-04 | Hard for M3, soft for playable loop | Gameplay/audio | AR, D04 | Exact remaining props in §21 | Hazards/new mechanics | Props coherent, readable and appropriately composed | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-14 | BACKLOG | P1 | Remaining effects | Complete merge/run feedback | Three `fx` entries | ART-04 | Hard for M3, soft for first loop | Gameplay/audio | AR, D04/05 | Spark, merge burst, dust | Gameplay formulas | Effects reinforce state without obscuring gauges | AV-stage | VISUAL | MEDIUM | MEDIUM |
| GAR-01 | BACKLOG | P1 | Garage inventory/install/stat increment | Make engineering usable | GS commands exist; no scene | VIS-01, ART-04/05/06/08/09/10/11; slot decision | Hard | RUN work with separate files | D02/03/05/06, GS | Loaded snapshots, inventory scrolling, five slots, install/swap/uninstall, current stats, readiness feedback | RNG, merge/save internals | Starter and valid loaded builds work; copies conserved; stats visibly update | T, U, C | VISUAL, PLAYTEST | HIGH | MEDIUM |
| GAR-02 | BACKLOG | P1 | Acquisition and merge interaction | Bind meta-loop mechanics | `scavenge()` and atomic `merge()` exist | GAR-01 | Hard | RUN work | D02/05, GS | Cost/eligibility, selected part, stored/installed merge feedback, max tier, rejection toasts | Command implementations | Earned Scrap buys parts; merges reflect service result and slot clearing | T, U, C | PLAYTEST | MEDIUM | MEDIUM |
| GAR-03 | BACKLOG | P1 | Persistence/recovery/reset presentation | Make durability status understandable | GS exposes pending/error/blocked/retry/reset | GAR-01 | Hard for player-facing acceptance | RUN; SAVE-01 with distinct ownership | D03/05/06/12, SAVE/GS | Status display, retry, unsupported-save explanation, explicit reset confirmation, settings container | Queue/recovery semantics | Failures are visible; retry/reset behave truthfully; unsupported raw data preserved until reset | T, U, C | PLAYTEST | HIGH | MEDIUM |
| RUN-01 | BACKLOG | P1 | First real RunScene increment | Deliver actual auto-drive and terminal loop | Session, simulation and rewards exist | VIS-01, vehicle assets, ART-07/12 | Hard; Garage integration soft until loop review | GAR-01/02 | D02/05/06, GS/SIM | Original session binding, real ticking, distance-driven presentation, terrain, gauges, terminal stop, service settlement, minimum real diagnosis/return | Domain formulas, save ownership | Real state determines movement/depletion; terminal result pays once; cause and return visible | T, U, C | VISUAL, PLAYTEST | HIGH | MEDIUM |
| RUN-02 | BACKLOG | P1 | Pause/quit/lifecycle/warnings | Complete run controls | Background contract exists; UI absent | RUN-01 | Hard | RES-01 in separate module | D02/05/06, GS | Explicit pause/resume, quit as abandoned, first-resume handling, threshold feedback, effect binding and cleanup | Offline progression | Pause freezes run; hiding grants no catch-up; quit settles normally; warnings reflect real ratios | T, U, C | PLAYTEST, DEVICE | HIGH | MEDIUM |
| RES-01 | BACKLOG | P1 | Complete diagnosis experience | Teach the next engineering decision | D01 diagnosis pillar; D05 result contract | RUN-01; RUN-02 for all variants | Hard for M2 | Audio integration | D01/02/05, GS/SIM | Cause, relevant pressure, final fuel/durability, scene-owned peak heat, reward, record, actionable hint and return | New reward owner, saved run telemetry | Player can explain failure and identify a sensible next change; settlement rejection is visible | T, U, C | PLAYTEST, VISUAL | HIGH | MEDIUM |
| SAVE-01 | BACKLOG | P1 | Persist audio preferences safely | Meet meaningful playtest requirement | D13 requires persistence; v1 has no options | Preference contract from D13 | Hard before meaningful audio-enabled external playtest | Scene work; serialized SAVE ownership | D03/06/13, SAVE/GS | Master/music/SFX mute and volume, defaults, explicit known-v1 migration, validated service commands, restore on launch | Progress loss, queue rewrite, active-run persistence | Existing progress survives; preferences restore; unsupported future saves remain protected | T, U, C | PLAYTEST | HIGH | MEDIUM |
| AUD-04 | BACKLOG | P1 | Production audio ownership/integration | Exercise Golden audio through real scenes | Service uncomposed; missing engine controls/disposal | AUD-03, real scenes; SAVE-01 for settings | Hard for integrated proof | RES/QA with separate files | D05/06/13, AU, AudioService | Single composition owner, loaders, category volume APIs, real instance limits, engine rate/stop ownership, pause/scene transitions, listener disposal, saved options | Speculative crossfades/multi-loop system | No leaked engine/music; limits are simultaneous; unlock/mute/resume and scene transitions work | T, U, C, AA-stage | AUDIO, DEVICE | HIGH | MEDIUM |
| AUD-05 | BACKLOG | P1 | Golden in-game mix approval | Approve all six together | D13 explicitly requires integrated mix | AUD-04, RUN/RES/GAR loop | Hard before audio expansion | Visual QA | D13, AU | Music pair + four SFX in real interactions and repeated runs | Remaining production before approval | Identity, repetition, engine, feedback and mix accepted; native delivery remains explicitly provisional | AA-stage | AUDIO, PLAYTEST, DEVICE | HIGH | MEDIUM |
| AUD-06 | BACKLOG | P1 | Remaining seven SFX | Complete required VS1 sound roles | AU has seven non-Golden entries | AUD-05 | Hard for M3 | Art/presentation QA | D13, AU | Error, install, uninstall, three warnings, Scrap tick | New audio roles | Provenance and role distinctions accepted; correct event binding | AA-full, T/U for bindings | AUDIO | MEDIUM | MEDIUM |
| AUD-07 | BACKLOG | P1 | Full VS1 mix/device acceptance | Prove complete soundscape | No real mix evidence | AUD-06, full scene integration | Hard for M3 | QA-01 | D13, AU | All 13, repetition, warnings, engine range, phone/headphone listening, background/resume | Native codec signoff | Feedback stays audible and tolerable across repeated play; no clipping/leaks | AA-full, relevant U | AUDIO, DEVICE, PLAYTEST | HIGH | MEDIUM |
| PLAY-01 | BACKLOG | P1 | Engineering comprehension checkpoint | Find interaction confusion early | D01/05 engineering loop | GAR-01; GAR-02/RUN-01 for earned acquisition | Hard for final interaction acceptance | Run development | D01/02/05 | Starter installation first; acquisition/merge once naturally funded | Balance redesign from fixture-only observations | Observations distinguish install comprehension from funded meta-loop comprehension | Relevant U | PLAYTEST | HIGH | SMALL |
| PLAY-02 | BACKLOG | P1 | Core-loop comprehension checkpoint | Prove diagnosis → improvement | Core loop absent | RUN-02, RES-01, GAR-02/03; SAVE-01 when external audio playtest | Hard for balance acceptance | Presentation production | D01/02/05 | First failure, reward, next change, second run | Premature expansion | Players explain failure/reward/next action; subsequent change has understandable effects | C | PLAYTEST | HIGH | MEDIUM |
| BAL-01 | BACKLOG | P1 | Evidence-based balance iteration | Improve progression and teaching | Provisional baselines; starter/bare reversal | PLAY-02 | Hard for VS1 acceptance | Final art/audio QA | D02/03, balance.ts, simulator | Build bands, failure pressures, acquisition cadence, quit-reward behavior; smallest proven numeric changes | New economy systems | Mathematical safety retained; human progression feels beneficial and understandable | T/U, data gate, simulator | PLAYTEST | HIGH | MEDIUM |
| QA-01 | BACKLOG | P1 | Rendered mobile-size acceptance | Prove density/readability/scaling | Math exists; real content absent | Integrated scenes/assets | Hard for M3 | AUD-07 | D00/04/05, VP/TY | 360×640, 390×844, tall/fractional-DPR sizes, resizing, touch targets and inventory density | Engine change without evidence | Critical content fits; text and pixels remain readable; controls usable | C; existing viewport U | VISUAL, PLAYTEST | HIGH | MEDIUM |
| QA-02 | BACKLOG | P1 | Physical mobile-browser acceptance | Prove actual phone behavior | No physical acceptance evidence | Playable integrated build | Hard for M3 | Owner listening sessions | D02/05/06/10/13 | DPR, touch, browser bars, unlock, background/resume, storage, performance | Native packaging | Target phones pass real-loop acceptance; failures recorded and repaired | Relevant C | DEVICE, AUDIO, PLAYTEST | HIGH | MEDIUM |
| VS-01 | BACKLOG | P1 | Presentation-complete VS1 review | Close the full required slice | Current missing implementation/content | All required M3 tasks | Hard | None | D00–06, D11–13, AR/AU | Required content, complete loop, technical/human evidence and remaining limits | Expansion/release implementation | 86 required visuals and 13 audio entries accepted; loop/save/settings/mobile proof complete | C, AV-release, AA-full | VISUAL, AUDIO, PLAYTEST, DEVICE | HIGH | SMALL |

## 19. Mid-Term V1 Backlog

V1 scope is not defined sufficiently to assume that D09 Stage 2 belongs in the first release.

| ID / Priority / Title | Status | Goal and current evidence | Dependencies / Type / Parallelism | Source of truth and scope | Do not touch | Acceptance and validation | Risk / Size |
|---|---|---|---|---|---|---|---|
| **V1-01 / P2 / Freeze V1 scope** | BACKLOG | Define the release product; D09 is an expansion roadmap | M3 / HARD / release research can proceed | D00/01/09; explicit feature/content list and excluded systems | Speculative implementation | Owner accepts bounded scope; document comparison; **PLAYTEST** informs choices | HIGH / SMALL |
| **V1-02 / P2 / Implement approved product gaps** | BACKLOG | Complete only gaps accepted by V1-01 | V1-01 and relevant proofs / HARD / independent approved tasks | Approved scope plus affected canonical docs; split into one coherent task each | Unapproved expansion | Each child task receives the full §18 schema, technical gates and appropriate **VISUAL/PLAYTEST** acceptance | HIGH / LARGE until split |
| **V1-03 / P2 / Progression acceptance** | BACKLOG | Prove sustained improvement and content endpoint | V1-01/02, BAL-01 / HARD / release-save work | D01/02/03; approved builds, progression bands and session goals | Prestige/multiple currencies | No economic traps or misleading upgrade lessons; simulator/data/tests plus **PLAYTEST** | HIGH / MEDIUM |
| **V1-04 / P2 / Release save/options acceptance** | BACKLOG | Complete durable user-facing save behavior | SAVE-01, V1 scope / HARD / ownership protection | D03/06/12/13; migrations, unavailable storage, retry/reset, preference restoration and process-loss explanation | Guaranteed active-run recovery | Real browser failure scenarios pass; U/C plus **DEVICE/PLAYTEST** | HIGH / MEDIUM |
| **V1-05 / P2 / Public-browser one-writer ownership** | BACKLOG | Prevent competing tabs overwriting progress; explicitly required by D06/D12 | Before public browser distribution / HARD / native research | D06/10/12; actual one-writer/conflict policy, supported-browser fallback and ownership UI | Race-prone pseudo-locks, backend | Two-tab/crash/reacquisition behavior proven; U and real browser integration; **DEVICE/PLAYTEST** | HIGH / MEDIUM |
| **V1-06 / P2 / Feature/content freeze review** | BACKLOG | Establish stable native input | Approved V1 tasks / HARD / store briefing | Approved scope; required content, compatibility and defects | New features during freeze | Owner signs off frozen baseline; C/strict asset gates; **PLAYTEST/DEVICE** | MEDIUM / SMALL |

These rows include goal, evidence, dependencies, dependency type, parallelism, authority, scope, exclusions, acceptance, automated/human validation, risk and size. V1-02 is a planning container; it must be split before implementation.

## 20. Android / Release Backlog

Retrieve current official platform/provider requirements when these tasks become READY. This plan does not prescribe unverified future SDK versions, store rules or entitlement terms.

| ID / Priority / Title | Status | Goal and current evidence | Dependencies / Type / Parallelism | Source of truth and scope | Do not touch | Acceptance and validation | Risk / Size |
|---|---|---|---|---|---|---|---|
| **AND-01 / P2 / Native ownership and platform contract** | BACKLOG | Prepare native work; current ignore rules exclude all Android/iOS | V1 baseline / HARD / store briefing | D06/10/12; owned source/config, selective generated ignores, package identity, device/support matrix | Native code before contract | Reproducible ownership/setup plan accepted; configuration review; **NONE** | MEDIUM / SMALL |
| **AND-02 / P2 / Capacitor Android integration** | BACKLOG | Produce installable native app; wrapper absent | AND-01 / HARD / store assets | D10 and current official Capacitor/Android docs; wrapper, local assets/fonts, build/config and necessary permissions | Gameplay rewrite, unrelated services | Clean setup builds and installs; web C plus native build; **DEVICE** | HIGH / MEDIUM |
| **AND-03 / P2 / Native storage/lifecycle binding** | BACKLOG | Preserve existing save/run semantics on device | AND-02, V1-04 / HARD / codec work | D02/03/06/12; adapter decision, lifecycle bridge, kill/relaunch/reset behavior | New offline rewards or implicit unfinished-run rewards | Process-loss and storage failures accepted; U/native checks; **DEVICE/PLAYTEST** | HIGH / MEDIUM |
| **AND-04 / P2 / Native audio delivery decision** | BACKLOG | Prove actual WebView loops and finalize delivery format | AND-02, Golden/full audio masters / HARD / AND-03 | D13/AU; actual candidate decoding, looping, unlock, resume and export regeneration if required | Assumed MP3 guarantee | Native evidence supports canonical format; AA-full and native checks; **AUDIO/DEVICE** | HIGH / MEDIUM |
| **AND-05 / P2 / Native usability/performance acceptance** | BACKLOG | Prove shipping behavior beyond browser-size QA | AND-02/03/04 / HARD / store preparation | D00/05/10; safe areas, touch, resize, graphics recovery, memory/performance and long sessions | Engine migration without measured cause | Target release-device matrix passes; native build and **DEVICE/PLAYTEST** | HIGH / MEDIUM |
| **MON-01 / P3 / Commercial strategy gate** | BACKLOG | Select monetization or close it as unnecessary; D09 suggests optional rewarded ads | Accepted product / HARD for service implementation / store preparation | D09/12; owner decision on optional ads and any separately approved purchases | Automatic IAP/analytics addition | Strategy and trust boundary accepted; decision review; **PLAYTEST** if incentives change | HIGH / SMALL |
| **MON-02 / P3 / Selected service integration** | BACKLOG | Implement only approved SDK/provider behavior | MON-01, native baseline / HARD / applicable disclosures | D12, actual SDK/store contracts; per-attempt rewards, cancellation/retry/replay; purchase verification/restore only if selected | Client secrets, speculative backend | Selected flows and rejection/replay paths pass; U/provider testing; **DEVICE/PLAYTEST** | HIGH / LARGE until provider-specific split |
| **MON-03 / P3 / Privacy/consent/data contract** | BACKLOG | Reflect actual data collection | Selected services / HARD for release / listing work | D12 and current provider/platform requirements; data inventory, consent, disclosures and policy | Invented analytics requirements | Behavior and disclosures agree; technical inspection plus **DEVICE** flow review | HIGH / MEDIUM |
| **REL-01 / P3 / License/security/distribution review** | BACKLOG | Close concrete release obligations | Actual assets/dependencies/services / HARD / store artwork | D12; third-party licenses, generation entitlement records, dependency advisories, relevant hosting headers/CSP and permissions | Speculative infrastructure | Distribution evidence and obligations accepted; scans/config checks; **NONE** unless fixes affect UX | MEDIUM / MEDIUM |
| **REL-02 / P3 / Signing and reproducible release build** | BACKLOG | Produce traceable signed artifact | Native/services acceptance / HARD / listing preparation | Current official Android/Play requirements; signing custody, versioning, reproducible build and artifact identity | Secrets in client/repository | Signed artifact installs/upgrades; native build and **DEVICE** | HIGH / MEDIUM |
| **REL-03 / P3 / Store materials and listing** | BACKLOG | Describe actual shipping game | Feature freeze, commercial/privacy decisions / HARD / REL-02 | Accepted product; screenshots, icon/art, listing, audience/content/pricing decisions | Unimplemented feature claims | Owner accepts accurate materials; asset checks; **VISUAL** | MEDIUM / MEDIUM |
| **REL-04 / P3 / Internal testing and Play checks** | BACKLOG | Validate actual distribution path | Signed build, required store materials / HARD / issue repair | Current Play Console requirements; internal track, installs, updates and reported platform issues | Public rollout by default | Required checks and tester/device findings resolved; platform reports; **DEVICE/PLAYTEST** | HIGH / MEDIUM |
| **REL-05 / P3 / Release-candidate review** | BACKLOG | Deliver concrete submission candidate | All release blockers closed / HARD / none | Approved release scope and evidence | New features, automatic publication | Exact signed artifact and evidence accepted; complete relevant gates; **VISUAL/AUDIO/PLAYTEST/DEVICE** | HIGH / SMALL |

Analytics is not currently planned. Purchases are conditional future work. Monetization implementation is optional; the decision gate is required.

## 21. Visual Production Plan

The runtime registry has **89 entries: 86 required and three optional**.

| Category | Entries |
|---|---:|
| Vehicles | 19 |
| Parts | 15 |
| Icons | 10 |
| UI | 12 |
| Fonts | 2 |
| Environments | 15 |
| Props | 12 |
| Effects | 4 |

**Exact Golden Art Set: 22 entries**

| Task | Exact entries |
|---|---|
| ART-01 — `proof_a`, eight | `veh_rustbucket_body`; `veh_rustbucket_ov_engine_t1`; `veh_rustbucket_ov_engine_t2`; `veh_rustbucket_ov_engine_t3`; `veh_wheel_tires_t1`; `part_engine_t1`; `part_engine_t2`; `part_engine_t3` |
| ART-02 — UI portion of `proof_b`, five | `icon_scrap`; `icon_stat_fuel`; `ui_panel_plate`; `ui_button_primary`; `ui_slot_frame` |
| TYPO-01 — font portion of `proof_b`, two | `font_display`; `font_body` |
| ART-03 — `proof_c`, seven | `env_garage_wall`; `env_garage_lift`; `env_sky_outskirts`; `env_far_junkyard`; `env_road_asphalt`; `prop_scrap_pile_a`; `fx_puff` |

Production uses AR’s exact dimensions and alpha/color/frame contracts. This table is an execution snapshot derived from AR, not a second asset authority; resolve registered exports through AR and review policy through D04/D11.

Typography proof:

- Preserve Silkscreen/VT323 identity and semantic roles.
- Produce/load the registered bitmap fonts and map cache keys correctly.
- Inspect headings, buttons, prices, long part names, numeric counters, percentages, warnings, causes and wrapped hints.
- Inspect 360×640 and 390×844 CSS browser viewports plus tall/fractional-DPR cases; lay out in the actual flexible AP canvas and safe rectangle, not those browser dimensions.
- Use real plate/inset/background combinations.
- Correct sizes or wrapping only when rendering proves a problem.

Font and art production can overlap. Final typography and Golden approval are interdependent rendered proofs; there is no reason to serialize all art behind a preliminary text-only approval.

**Required non-Golden production: 64 entries**

| Batch | Exact family/categories | Dependency and approval | Needed immediately? |
|---|---|---|---|
| ART-05 — Hero, two | `veh_wheel_bare`, `veh_shadow` | Golden approved; technical and rendered approval | Yes, legitimate bare builds |
| ART-06 — Garage UI, eleven | `icon_stat_power`, `icon_stat_cooling`, `icon_stat_durability`, `icon_stat_weight`, `icon_ui_settings`; `ui_panel_inset`, `ui_panel_note`, `ui_button_secondary`, `ui_tier_pips`, `ui_badge_max`, `ui_badge_merge` | Golden approved; slicing/frame/text QA | Yes |
| ART-07 — Run/Result UI, six | `icon_stat_heat`, `icon_stat_speed`, `icon_ui_pause`; `ui_gauge_frame`, `ui_gauge_fill`, `ui_stamp_frame` | Golden approved; telemetry/stamp QA | Yes for Run |
| ART-08 — Fuel, six | `part_fuel_t1…t3`, `veh_rustbucket_ov_fuel_t1…t3` | Golden approved; family contact-sheet/composite approval | Yes |
| ART-09 — Cooling, six | `part_cooling_t1…t3`, `veh_rustbucket_ov_cooling_t1…t3` | Same | Yes |
| ART-10 — Suspension, six | `part_suspension_t1…t3`, `veh_rustbucket_ov_suspension_t1…t3` | Same | Yes |
| ART-11 — Tires, five | `part_tires_t1…t3`, `veh_wheel_tires_t2`, `veh_wheel_tires_t3` | Golden approved; animation/progression approval | Yes |
| ART-12 — Terrain, eight | `env_sky_cracked`, `env_sky_dirt`, `env_sky_rocky`; `env_far_dunes`, `env_far_cliffs`; `env_road_cracked`, `env_road_dirt`, `env_road_rock` | Golden approved; tiled/transition approval | Yes for unrestricted runs |
| ART-13 — Props, eleven | `prop_scrap_pile_b`, `prop_tire_stack`, `prop_barrel`, `prop_fence`, `prop_utility_pole`, `prop_sign_road`, `prop_sign_grade`, `prop_shrub_dry`, `prop_dead_tree`, `prop_boulder_a`, `prop_boulder_b` | Golden approved; composition approval | M3; does not block first simulation binding |
| ART-14 — Effects, three | `fx_spark`, `fx_merge_burst`, `fx_dust` | Golden approved; motion/readability approval | M3 |

Optional entries are `veh_rustbucket_wrecked`, `env_garage_fg`, and `env_clouds_strip`. They are outside the mandatory critical path. Include them only through an explicit bounded polish decision.

All batches follow editable source → technical export → visual review → actual Phaser integration → approval. Non-Golden entries cannot advance beyond `planned` before all 22 Golden entries are approved, except the explicit ART-03R owner authorization for optional `env_clouds_strip` at `technical` only.

## 22. Audio Production Plan

**Exact Golden Audio Set**

```text
bgm_garage
bgm_run
sfx_engine_loop
sfx_mech_merge
sfx_ui_click
sfx_run_fail
```

Sequence:

1. Verify current production entitlement/terms and record provenance.
2. Generate/select provisional Garage music.
3. Establish shared motif and instrument vocabulary.
4. Generate Run candidates against that benchmark.
5. Approve Garage and Run as a pair.
6. Produce the four Golden SFX.
7. Test candidate encodes in actual Phaser/browser playback.
8. Integrate all six into the real Garage/Run/Result loop.
9. Approve identity, repetition, engine range, interaction feedback and mix.
10. Produce the remaining seven required SFX.
11. Complete full mix and phone/headphone acceptance.
12. Prove native WebView delivery during Android integration.

Remaining seven:

```text
sfx_ui_error
sfx_mech_install
sfx_mech_uninstall
sfx_warn_heat
sfx_warn_fuel
sfx_warn_durability
sfx_reward_scrap
```

Required distinctions:

- Raw generation/source files remain unchanged.
- Editable sessions and approved lossless masters are retained.
- Runtime formats follow proof; `.mp3` is currently provisional.
- Provenance approval is separate from listening approval.
- File validation cannot establish seamless loops or pleasant repetition.
- Engine control needs owned playback handles, rate adjustment and cleanup.
- Simultaneous instance limits must count active sounds.
- Cooldowns and multiple engine loops are added only when runtime evidence requires them.

**Preference timing:** persist master/music/SFX mute and volume before meaningful user-facing audio-enabled playtests. Introduce explicit migration for existing v1 progress; do not silently append fields the current codec discards.

**Platform approval:** D13 now explicitly separates browser-stage approval, which can unlock VS1 sonic production, from later native/WebView delivery confirmation. Retain native uncertainty until AND-04. Do not claim a final cross-platform codec before actual WebView testing or introduce an early wrapper merely to close that claim.

## 23. Garage Production Plan

Three coherent production increments:

1. **GAR-01 — Inventory and engineering:** loaded snapshots, currency, vehicle composition, five slots, selection, installation/swap/uninstall, current stat feedback and readiness.
2. **GAR-02 — Acquisition and merge:** service-backed purchase and atomic merge, copy counts, max-tier handling and clear rejection feedback.
3. **GAR-03 — Save/settings presentation:** pending/error/blocked status, retry, explicit reset, and the settings container later bound to persisted audio options.

Important contracts:

- Render frozen snapshots; never mutate them.
- Use explicit `installPart(partId, targetSlot)`.
- Let the service choose merge inputs.
- If a stored+installed merge clears a slot, explain that visible result.
- Handle unbounded inventory with scrolling/grouping; do not introduce inventory tetris.
- Permit bare-chassis runs.
- Reflect command rejection truthfully.
- **OWNER DECISION REQUIRED:** resolve D05 §8 installed-slot detail/uninstall gesture, MAX-tier behavior and selected-part targeting before GAR-01 becomes READY. GAR-01 stays BACKLOG until this owner decision and other dependencies are satisfied.

New saves start with **zero Scrap** and two uninstalled starter parts. Therefore, M1 can prove starter engineering, but **natural acquisition/merge comprehension requires the rewarded run loop**. Test fixtures may exercise funded branches; they cannot establish real progression acceptance.

## 24. Run / Result Production Plan

The smallest real Run increment includes:

- The original service-issued session and token.
- `advanceRun(..., deltaMs / 1000)`.
- Real terrain selection.
- Distance-driven vehicle/road presentation.
- Fuel, heat and durability gauges from actual state.
- Terminal simulation stop.
- `recordRunResult()` settlement.
- Visible cause, reward, diagnosis and return.

No moving-car shell precedes simulation integration.

Additional production increments complete pause/quit, thresholds, effects and diagnosis polish. They extend working code.

Result requirements:

- Failure cause and relevant pressure.
- Distance and new-record status.
- Reward from the settled state transition.
- Remaining fuel/durability.
- Peak heat collected by the scene, because `RunState` has no peak field.
- An understandable improvement suggestion.
- Clear return to Garage.
- Visible handling if settlement is rejected.

Explicit quit creates an `abandoned` terminal result and receives the documented distance reward. Hiding or process death does not settle a run.

Scenes must dispose input/audio/lifecycle subscriptions they own. Repeated callbacks remain harmless through the service token guard.

## 25. Playtest Plan

| Uncertainty | Earliest useful checkpoint | Questions |
|---|---|---|
| Installation comprehension | GAR-01 | Can a player identify slots, install starter parts and understand changed values? |
| Acquisition/merge comprehension | GAR-02 plus first settled runs | Do cost, duplicates, installed-input consumption and max tier make sense? |
| Core-loop comprehension | RUN/RES loop | Why did the car fail? What was earned? What should change next? |
| Progression | Several improvement/run cycles | Does an engineering change produce understandable capability gains? |
| Balance teaching | First starter and bare-build comparison | Does the game teach sensible engineering, or reward removing useful-looking parts? |
| Reward incentives | Pause/quit available | Does rapid abandonment overshadow driving and diagnosis? |
| Presentation coherence | Golden composites; again at M3 | Do visuals and sound feel like one game? |
| Audio tolerance | Golden pair/SFX, then real loop | Is repetition tolerable? Are merge and failure feedback appropriately distinct? |
| Mobile usability | Every usable scene increment | Can players read, target, scroll and recover from errors? |

Use observation rather than explaining the game during the attempt. Record specific confusion, actions and outcomes. Separate fixture-based branch checks from naturally earned progression.

## 26. Balance Iteration Plan

| Automated / simulation evidence | Human experience evidence |
|---|---|
| Reachability and failure ordering | Whether failure feels understandable |
| Terrain boundary behavior | Whether improvement feels beneficial |
| Representative and pathological builds | Whether runs are boring or frustrating |
| Reward and safe-integer boundaries | Whether acquisition cadence feels satisfying |
| Currency recovery paths | Whether quitting incentives undermine the loop |
| Partition/stall invariants | Whether high-power failures teach the intended tradeoff |

The 2026-10-04 baseline simulator run recorded:

- Bare chassis: approximately 150 m.
- Starter engine/fuel: approximately 69.57 m, heat failure.
- Full T1/T2/T3: approximately 248.55/372/605 m.
- T3 engine with T1 support: approximately 53.85 m, heat failure.

These are **historical baseline observations**, not final product targets or fresh simulator results.

Tune toward representative progression bands and expected pressures. Preserve mathematical correctness tests, but do not assert that a tier must deliver one exact distance as the definition of fun.

Any change updates the affected canonical values/formulas and reruns the production simulator. Schema or progression-system expansion requires separate evidence.

## 27. Mobile / Device QA Plan

| Stage | Required coverage | Limit |
|---|---|---|
| Browser-size QA | 360×640, 390×844, tall portrait, fractional DPR, resize, safe rectangle, text wrapping, pixel alignment, control sizes, dense inventory | Does not establish physical-device acceptance |
| Physical mobile browser | Actual DPR/browser bars, touch/scroll, audio unlock, speaker/headphone mix, hidden/resume, storage behavior, repeated runs and performance | Does not establish native WebView behavior |
| Native Android | Install/update, safe areas, lifecycle/process death, storage/reset, WebView codec loops, audio focus/resume, graphics recovery and release-build performance | Begins after native integration |

Keep all critical UI inside the safe rectangle. Preserve readable text instead of shrinking it to solve density problems.

A mathematical integer-scale pass does not prove that scrolling textures, fonts or touch hit areas work well on a phone.

## 28. Risk Register

Probability and impact below are planning judgments, not measured failure rates.

| Risk | Probability | Impact | Earliest validation point | Mitigation | Owner / Workstream |
|---|---|---|---|---|---|
| False-success asset gates hide missing/invalid content | HIGH — demonstrated | HIGH | VAL-01/02 | Executable gates and negative-path regressions | Technical lead / tools |
| Typography does not fit the AP viewport | HIGH — contract mismatch | HIGH | TYPO-01/02 | Production fonts and real-size proof | Owner + UI |
| Golden visual identity fails in composition | MEDIUM | HIGH | ART-04 | Inspect complete vehicle/UI/environment combinations | Owner / art |
| AI-assisted art drifts across batches | MEDIUM | HIGH | First non-Golden family batch | Golden benchmark, manual cleanup, contact sheets | Art |
| Overlay combinations become noisy or costly | MEDIUM | MEDIUM | Golden engine ladder; first family composites | Retain contract initially; change only from rendered/cost evidence | Art + technical lead |
| Narrow portrait UI becomes crowded | HIGH | HIGH | GAR-01, QA-01 | Safe-rectangle layouts, scrolling and real touch review | UI |
| Starter/bare tradeoff teaches the wrong lesson | MEDIUM | HIGH | PLAY-02 | Observe actual player reasoning before tuning | Gameplay / owner |
| Diagnosis fails to suggest useful improvement | MEDIUM | HIGH | RES-01 playtest | Cause, pressure, snapshot and next-action testing | Gameplay/UI |
| Quit rewards displace the intended loop | MEDIUM | HIGH | RUN-02/BAL-01 | Evaluate actual behavior; preserve soft-lock protection while correcting proven incentives | Gameplay |
| Audio loops/engine become fatiguing | MEDIUM | HIGH | AUD-01/02/05 | Repetition and rate-range listening | Audio / owner |
| Codec works in browser but fails in WebView | MEDIUM | HIGH | AUD-03; AND-04 closes it | Preserve masters; keep platform approval explicit | Audio/native |
| Save/options migration damages ownership | MEDIUM | HIGH | SAVE-01 | Explicit v1 migration and recovery regressions | Persistence |
| Multiple browser owners overwrite progress | HIGH under competing tabs | HIGH | V1-05 | Robust ownership/conflict policy and real multi-tab tests | Platform |
| Device scaling/lifecycle differs from desktop proof | MEDIUM | HIGH | QA-02 | Early physical browser checks; separate native checks | Platform |
| Planning continues instead of proving the loop | MEDIUM | HIGH | First implementation batch | Bounded fixes followed directly by content/runtime proof | Owner |
| Native/store integration exposes late requirements | MEDIUM | HIGH | AND-01 and release readiness | Retrieve current official requirements at each gate | Native/release |

## 29. AI/Codex Execution Rules

1. Execute one coherent backlog task per prompt by default.
2. Read its listed authority and current implementation fully before editing.
3. Preserve domain/service ownership.
4. Inspect current files rather than trusting prior completion reports.
5. Avoid unrelated refactors, dependency upgrades and new frameworks.
6. Never silently change canonical rules or asset scope.
7. Report exact changed files and behavior.
8. Report checks actually executed, failures and remaining limits.
9. Distinguish automated evidence from VISUAL/AUDIO/PLAYTEST/DEVICE approval.
10. Keep shared registry/configuration edits assigned to one writer.
11. Preserve editable art/audio source, raw generation files and provenance.
12. Do not fabricate files or weaken gates to obtain a green check.
13. Do not grant rewards through debug controls or scene-owned save mutation.
14. Stop after the assigned task and its report; do not automatically start the next item.
15. Convert unresolved acceptance into explicit VALIDATION/BLOCKED status.

## 30. Change-Control Rule

A canonical decision may change when direct implementation or validation evidence demonstrates a meaningful correctness, UX, visual, audio, performance, platform, production-cost, maintainability or contract problem.

Use:

```text
Show evidence
    → identify the affected decision
    → choose the smallest correction
    → identify affected docs/data/contracts
    → implement within authorized scope
    → validate and report
```

Routine implementation corrections need no additional bureaucracy. A change to product identity, scope, economic rules or unresolved player behavior requires owner resolution before dependent implementation.

Preference alone is insufficient. A failing rendered proof or playtest is sufficient reason to propose a narrow correction.

## 31. First Implementation Batch

**Exact task IDs: DOC-01, VAL-01, VAL-02, VAL-03.**

This bounded corrective production batch is COMPLETE: DOC-01, VAL-01, VAL-02 and VAL-03 are DONE. Documentation, visual/audio tooling and existing viewport-test discovery passed their applicable gates. This does not close M0 or establish production-content approval.

Why now:

- The baseline visual CLI no-op is resolved by VAL-01; staged technical checks never grant art approval.
- VAL-02 resolves audio URLs under public/assets and owns only its audio subtree.
- Visual and audio production-stage enforcement is executable; preparation passes do not grant production approval.
- VAL-03 now includes the existing pure viewport tests in the standard suite.
- Conflicting instructions would otherwise be propagated into upcoming production prompts.

Dependencies: none require new assets.

Parallelism:

- VAL-01 owns visual tooling and its package-script changes.
- VAL-02 owns audio tooling/AU staging.
- VAL-03 owns Vitest discovery.
- DOC-01 owns documentation reconciliation.
- Serialize any shared manifest edits through one integrator.

Outputs:

- Executable, truthful visual/audio gates.
- Existing viewport coverage in the standard suite.
- Reconciled dimensions, Golden scope, state ownership and approval timing.
- A resolved or explicitly pending installed-slot interaction.

Acceptance gate:

- Positive and negative gate cases produce correct reports and exit codes.
- Existing missing assets remain honestly reported.
- No generated placeholder files.
- Relevant typechecks/tests pass.
- A preparation pass cannot be represented as production-content approval.

This batch excludes gameplay implementation, asset generation, codec finalization, native integration, monetization and broad architectural changes.

**The next batch moves directly into TYPO-01, production typography proof and Golden visual production, with parallel Golden audio production where its preflight and Definition of Ready are satisfied. It is not another general audit.**

## 32. What Must NOT Be Worked On Yet

- Additional tiers, families, chassis or roads without V1 scope approval.
- Prestige, automation and offline progression.
- Unique item instances or repeated-slot architecture.
- Accounts, cloud saves, leaderboards or speculative backend interfaces.
- Purchases, ads or analytics before the commercial decision.
- Capacitor/native packaging during early VS1.
- Fake Run scenes, placeholder production art or fabricated audio files.
- A typography/branding redesign without rendered evidence.
- Engine or state-framework migration without demonstrated incompatibility.
- Broad test rewrites or a large E2E platform before concrete integration needs exist.
- Optional decorative assets on the current critical path.
- Final cross-platform codec claims before native proof.
- Public distribution before its ownership/privacy/platform gates.

## 33. Open Decision Gates

| Decision / unknown | Classification | When it matters |
|---|---|---|
| Installed-slot tap: details versus immediate uninstall | **OWNER DECISION REQUIRED — BLOCKS LATER, GAR-01** | Explicitly contained by DOC-01 in D05 §8; owner resolves gesture/MAX/targeting before GAR-01 readiness |
| Typography sizes/wrapping on actual AP canvas | **CAN BE RESOLVED BY VISUAL PROOF** | TYPO-01/02 |
| Palette and overlay composition quality | **CAN BE RESOLVED BY VISUAL PROOF** | Golden review |
| Current music generation entitlement/terms | **BLOCKS NOW for production generation** | AUD-01 preflight; does not block code/art work |
| Shared musical motif and final repetition length | **CAN BE RESOLVED BY AUDIO PROOF** | AUD-01/05 |
| One engine loop survives required rate range | **CAN BE RESOLVED BY AUDIO PROOF** | AUD-02/05 |
| Browser runtime encode choice | **CAN BE RESOLVED BY AUDIO PROOF** | AUD-03 |
| Native runtime codec suitability | **CAN BE RESOLVED DURING ANDROID/RELEASE WORK** | AND-04 |
| Starter/bare tradeoff, quit incentives, progression cadence | **CAN BE RESOLVED BY PLAYTEST** | PLAY-02/BAL-01 |
| Exact V1 feature/content boundary | **BLOCKS LATER** | V1-01 after accepted VS1 |
| Public-browser ownership/fallback policy | **BLOCKS LATER** | Before public browser distribution |
| Native source ownership, storage adapter and device matrix | **CAN BE RESOLVED DURING ANDROID/RELEASE WORK** | AND-01/03 |
| Monetization and any purchase requirement | **BLOCKS LATER** | MON-01 |
| Analytics requirement | **BLOCKS LATER only if selected** | Commercial/data decision |
| Store audience, pricing, territories and disclosure requirements | **CAN BE RESOLVED DURING ANDROID/RELEASE WORK** | Store preparation |
| Optional visual polish | **BLOCKS LATER only if included** | Explicit post-critical-path decision |

No unresolved product decision blocks the first validation-repair batch.

## 34. Final Readiness

### ART-01 AND ART-02 COMPLETE — ART-03R RUN CANDIDATE IN REVIEW

**DOC-01, VAL-01, VAL-02, VAL-03, ART-01 and ART-02 are DONE. ART-03 is IN PROGRESS: six Run candidates are technical (including optional clouds) and await owner review; Garage remains unstarted. M0 remains IN PROGRESS.**

ART-02 established the Golden UI visual grammar for Scrap Car Runner:
- All five non-font `proof_b` visual assets produced and validated (`icon_scrap`, `icon_stat_fuel`, `ui_panel_plate`, `ui_button_primary`, `ui_slot_frame`).
- Refined `ui_button_primary` accepted by owner as tactile scrapyard workshop control.
- Hand-authored procedural TypeScript source recorded with owner acceptance for ART-02 only (D11 §3 note); zero AI-generated visual content used.
- Technical validation passed; 5 ART-02 assets advanced to `visual` in registry lifecycle.
- UI reference documented in `art/source/golden/art02/STYLE_REFERENCE.md` (establishing durable UI hierarchy: heavy structural `ui_panel_plate` vs lighter repeated `ui_slot_frame`).
- Owner visual review passed; ART-02 transitioned to **DONE**.
- Truthful `proof_b` note: ART-02 non-font scope is technically complete and visually approved, but the overall `proof_b` gate remains incomplete, blocked by missing TYPO-01 font inputs (`font_display`, `font_body`).

Readiness reassessment under §13:
- **ART-01:** Visual benchmark approved; **DONE**.
- **ART-02:** Golden UI benchmark approved; **DONE**.
- **ART-03:** Six Run candidates (including optional clouds) passed technical checks under ART-03R; their visual review and non-Aseprite workflow acknowledgement remain pending. Two Garage entries remain planned/absent and were not touched. Overall **IN PROGRESS**, not DONE.
- **TYPO-01:** Named dependencies are DONE, but retained licensed production font inputs are not yet evidenced in the repository. Remains **BACKLOG** until production font files are provided.
- **VIS-01:** Hard dependency requires technical inputs from ART-01/02/03 and TYPO-01. ART-01 and ART-02 are complete, but remaining inputs (ART-03, TYPO-01) are not yet complete. Remains **BACKLOG**.
- **TYPO-02, ART-04 and non-Golden art:** Require completion of remaining Golden batches, typography proof, and in-game proof; remain **BACKLOG**.
- **AUD-01/02:** Source/licensing and entitlement preflight remain unevidenced; remain **BACKLOG**.

M0 remains IN PROGRESS. No non-Golden task was started and no unevidenced status transition was made. Remaining M0 acceptance requires production typography (TYPO-01), Garage-side ART-03 production and all remaining ART-03 acceptance, in-game proof (VIS-01), palette lock, and final Golden approval (ART-04).
