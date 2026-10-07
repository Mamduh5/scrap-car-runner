# Scrap Car Runner — Authoritative Implementation & Project Management Plan

| Field | Value |
|---|---|
| Status | CURRENT EXECUTION PLAN |
| Current Milestone | M0 — Production Gates & Golden Visual Proofs |
| Current Implementation Batch | ART-03R Golden Run benchmark — owner visually approved; six assets visual |
| Current Art Activity | Garage-side ART-03 final composition candidate — refined B visual direction accepted; exact-car 216×427 / safe 180×288 composition owner review pending; no production exports |
| Project Management | Milestone-Based Kanban |
| Sprint Policy | No formal sprints |
| Last Reviewed | 2026-10-07 |

**Purpose:** This document is the execution source of truth for implementation sequencing, task status, dependencies, milestone gates, and project management.

**Authority:** This document does not replace canonical gameplay, data, architecture, art, typography, audio, save, or security contracts. Those remain governed by their designated source-of-truth documents and registries. When a contract changes, update the owning source first and then update this execution plan as necessary.

**Baseline planning history:** The former root planning report has been removed. Its dated evidence is preserved in §§1–8 below; D14 is the maintained execution plan. No external root-history file is required to follow this plan.

## Owner-approved continuous idle correction — 2026-10-06
D01/D02/D03/D05/D06 now govern continuous auto-drive, fuel-limited automatic reset/refill/retry, physical checkpoints, repeat Scrap plus a one-time first-clear bonus, and Repeat OFF frontier advancement or Repeat ON looping a selected unlocked checkpoint. Farther normally rewards more per successful clear, not necessarily more Scrap/time. No required per-attempt Start Run, terminal result screen, Garage return, one-terminal-run/one-payout rule or forced highest-checkpoint farming.

Merge Board, Inventory and Equipped Parts are distinct. Only explicitly equipped parts affect active stats/installed visuals; merges cannot implicitly consume/change equipment. Garage home is a focused build overview with navigation; Top Merge Area / bottom finite progression-expandable Workbench is approved; exact workshop/Inventory visual layout, Workbench capacity values and expansion costs/milestones remain open; base Inventory is approved at 150 item instances (see the 2026-10-07 record). Most automation must originate from learned manual acquisition, merging or sorting/movement; automatic driving/retry is already baseline, while later automation unlocks remain TBD.

Simulation/progression/target/fuel/rewards are authoritative domain/service state independent of nearby visible road rendering. Passed visuals recycle/despawn without losing progression; distant future content is not rendered. Later mathematical/stateful offline calculation must not require every frame; exact formula/cap stays open.

**Documentation only:** No runtime/save/asset changes or implementation task completion. Sections 1–8 and the DOC-01 record retain dated audit/history, including obsolete discrete-run observations; they do not override this correction. Existing session APIs, distance/minimum payouts, equipped-input merge fallback and v1's missing board/checkpoint state require future adaptation. Preserve numeric safety, copy conservation, idempotency, storage recovery/error visibility and release safeguards.

**Status protection:** M0 remains IN PROGRESS. ART-03R Run benchmark remains owner-approved/visual with unchanged exports, references and lifecycle states; Garage ART-03 remains unfinished. TYPO/VIS/art/audio and all other task statuses are unchanged. This correction starts neither gameplay implementation nor merge-board redesign.

**Future readiness:** GAR-01/02 and RUN-01/02/RES-01 must resolve applicable owner decisions and command/schema adaptation under the existing Definition of Ready before implementation. Do not bind new UI directly to obsolete semantics. D02/D03/D05/D06 supply the open decisions; §33 maps their consequences. No new task is declared DONE or READY here.

## Owner-approved equipment specialization / road-region contract — 2026-10-06
D01/D02/D03 now record **Family + Type/Specialization + Tier + Tradeoffs + Compatibility** as a core gameplay contract. Tier strengthens a specific type; type determines suitability. A higher-tier wrong type can underperform a lower-tier suitable type on a checkpoint/farm route. Specialized equipment should usually solve a meaningful problem with meaningful weight/speed/fuel/off-terrain costs rather than becoming strictly better everywhere.

Engine roles include speed, acceleration/effective performance, hills and heavy resistance. Fuel Tank controls available fuel/attempt duration; no Fuel Tank type catalog is approved. Radiator supports sustained-load performance and Engine compatibility. Tires specialize by surface; Suspension by physical obstacle shape/load. Only equipped parts contribute, and Inventory retains useful alternative push/farm builds. Highest-progress and best-Scrap/time builds may differ; no presets or automatic loadout swaps are approved.

Fuel depletion is the normal automatic attempt ending. Severe Engine/Radiator incompatibility may cause critical overheating and catastrophic attempt failure/explosion before the target, then checkpoint reset/retry **without destroying or deleting owned/equipped parts**. Future UI should warn before or while running. Exact compatibility/heat/explosion formulas and warning/presentation details remain unresolved. Existing durability/breakdown simulation, additive tire/suspension buffers and registered durability visuals/audio are legacy foundation evidence or retained asset scope, not a mandatory global durability resource, per-part health/degradation system or new art requirement.

Multiple checkpoints belong to a Road Region / World Region. Milestones may change environment, terrain grammar, obstacle families, useful specializations and later acquisition opportunities. Reuse authored terrain/obstacle pieces; regions should alter build strategy, not merely scale numbers or require unique scenery per checkpoint. Names/counts/boundaries, formulas and checkpoint requirements remain open; no example range becomes balance/content data.

Core merging requires two copies with the **same Family + same Type/Specialization + same Tier**, producing one **next-tier part of the same family and type**. Different families, types or tiers are invalid inputs; matching family and tier alone is insufficient. Type is persistent gameplay identity: no generic, random or hybrid output and no cross-type fusion/recipe graph. Optional future transformation and detailed source catalogs remain open. Future acquisition considers family/type/region/unlocked specializations/player targeting; pools/drop rates/control/shop behavior are not selected. This records implications without starting board or acquisition design.

**Scope/status protection:** Documentation only; no runtime/schema/catalog/art changes, gameplay implementation or task completion. Existing five-family/three-tier VS1 production content, ART-03R visual approval/references/lifecycle states and unfinished Garage ART-03 remain intact; M0 stays IN PROGRESS. All task/milestone statuses remain unchanged. The generic family/tier-only baseline is incomplete for this design; future authorized work must resolve applicable type/compatibility/region inputs before implementation. No extra specialized catalog or new region/explosion asset batch is automatically authorized.

**Exclusions/open decisions:** No affixes, rarity power systems, runes, skill trees, character stats, random stat/quality rolls, legendary procs, equipment degradation or involuntary permanent destruction. Exact catalog/names/stats/weights, compatibility/heat/explosion/terrain/farming formulas, checkpoint requirements, region boundaries/names, merge interaction, board geometry, future Inventory expansion details, acquisition/drop systems, type unlocks and loadout preset systems remain unresolved (D02/D03 and §33).

## Owner-approved Scavenge / part-acquisition contract — 2026-10-06
D01/D02/D03 now approve **multiple Scavenge Sources** and **Scrap search investment**. Source controls possible/likely families/types and relative weighting; additional Scrap investment improves higher-tier odds while retaining source identity. Acquisition stays random but directable, normally without guaranteeing an exact desired item or tier. This resolves the earlier records' wholly undecided acquisition mechanism; exact catalogs/values/UI below remain open.

General / Normal Scavenge stays available, broadest in general part coverage, relatively inexpensive, useful for generic merge material/acquisition and relevant after specialized unlocks. Specialized sources provide narrower/biased targeting to solve equipment needs, typically at higher Scrap cost rather than universally better loot. Sources can share parts, potentially across every relevant source; Cooling can be broad with per-type weights later. Source examples are concepts, not final production catalogs/tables.

Scrap is the only approved acquisition currency. More pulls, better-targeted pulls and better-tier odds compete for Scrap; no region currency/tokens/chips are added. Checkpoint/region progression may unlock sources suited to new road problems, without locked numbers/mappings. A source can scale to higher tiers through progression/per-use investment; mandatory tier-numbered duplicates are not required. Permanent source upgrades are not current core and need separate future approval; exact scaling rules remain open.

Manual workflow teaches source, investment/cost and when to Scavenge. Future Auto Scavenger may automate selected source/investment with an optional Scrap spending limit; unlocks, limits and configuration UI remain unresolved. Preserve Family + Type + Tier + Tradeoff + Compatibility; distinct types feed future merging without assuming all Engine T1 parts are interchangeable. Core merge compatibility is now approved; board geometry and interaction remain open.

Scavenge is a focused screen/system accessible from Garage/hub, not controls permanently embedded in home. Future presentation communicates source identity/cost, equipment tendencies, investment choice and tier odds clearly; no final layout/reveal flow or UI production is authorized here. Domain/services own Scrap/eligibility/RNG/ownership transitions, not scenes.

**Open decisions:** Final source names/counts; source unlock checkpoints/regions/mappings; Scrap prices/cost multipliers; loot tables/family/type weights; tier probabilities; investment levels/UI; guaranteed/pity mechanics; duplicate protection; exact first-clear Scavenge interactions; animation/reveal flow; Auto Scavenger unlocks/spending limits; future secondary currencies. D03 adds only conceptual source/investment data, not runtime/save fields or production values.

**Documentation/status boundary:** The fixed-price generic random-T1 command remains unchanged foundation behavior requiring future adaptation, not the final acquisition contract. No gameplay, runtime schema/catalog/balance, art, new currency, merge-board redesign or Scavenge UI production. All task/milestone statuses remain unchanged: M0 IN PROGRESS, ART-03R visually approved with assets/references/lifecycle evidence intact, Garage ART-03 unfinished. Earlier dated scope/decision records remain history; this source/investment contract governs future acquisition wording.

## Owner-approved Inventory / capacity / Dismantle record — 2026-10-07
D01/D02/D03/D05/D06 approve general long-term Inventory with **150 item-instance base capacity**, separate from active Workbench and Equipped Parts. Parts do not stack; Scrap/future currencies consume no slots unless separately designed otherwise. Current organization is Family / Type or Specialization / Tier. Each Part has one authoritative location; leaving immediately frees Inventory capacity. Primary movement is drag-and-drop including direct Inventory↔Equipped where valid; detailed gestures/mobile UX remain open.

Valid atomic one-for-one equipment swaps remain allowed at full Inventory without increasing its count. Normal Unequip-to-Inventory requires room and is blocked when full, never redirected to Mail. Equipped→Workbench remains allowed with Workbench room regardless of Inventory count. Full Inventory blocks manual Scavenge without intentional Mail overflow. Normal Workbench merges remain allowed: two compatible instances become one higher-tier same-type Workbench instance with temporary feedback, reducing Workbench occupancy by one.

Unavoidable received item rewards that Inventory cannot accept may be safely held/delivered through Mail. Mail is a broader future Garage-accessible system, not deliberate overflow storage; complete reward list, capacity, expiry, claiming, notifications/types/attachments/inbox UI and broader functions remain open. Deliberate Dismantle permanently removes an unwanted Part, grants small Scrap and frees its occupied slot instead of valueless Delete. Exact formula/scaling/Scavenge-price relationship, invocation location (Inventory/Workbench/other views), bulk behavior, confirmation and buttons remain unresolved; return must avoid profitable reroll/exploit loops.

Future permanent progression capacity rewards and optional real-money capacity purchase are directions only. Precise rewards, maximum, paid amounts/bundles/prices and monetization implementation remain open; base playability needs neither expansion nor payment. No IAP/products/Play Billing/backend validation is added. Finite Inventory stays local-first, useful for gameplay, bounded state, usability, save discipline and extensibility; no server is required.

D03/D06 record eventual instance collection/capacity/location/Workbench/Equipped/separate-currency/future-upgrade requirements without choosing fields/IDs, altering runtime, implementing migrations or bumping save version. §§18/23/33 and D07 constrain future authorized adaptation. Inventory layout/filter/search, scavenged-result presentation, detailed drag/drop, Dismantle, Mail and expansion economics/UI choices remain open and gate applicable readiness. Earlier dated unique-instance deferral and capacity uncertainty are historical observations superseded at design level only.

**Documentation/status boundary:** All task/milestone statuses and ART-03R evidence remain unchanged; M0 IN PROGRESS, Garage unfinished. No gameplay, Inventory visual production, Mail, capacity expansion or monetization implementation begins. Same-family/type/tier merging, finite expandable Workbench, General/Specialized Scavenge, Scrap tier investment, equipment specialization, push/farm and continuous checkpoints are preserved.

## Owner-approved manual Scavenge / batch / atomic execution — 2026-10-07
D01/D02/D03/D05/D06 now record image/card-oriented source selection, one Part per unit and **x1 → x3 → x5 → x7** progression: x1 baseline, larger convenience batches later. Source controls family/type pool/weights; per-use Scrap investment improves tier odds without changing source identity; batch count alone adds no quality. General remains broad/relatively inexpensive and specialized targeting normally guarantees no exact Part.

Investment is remembered until changed, including after execution or unaffordability. Selection spends nothing and is not prepaid; never silently lower it or batch count. Global versus per-source memory remains open. At execution the state owner rechecks current source/batch validity/unlocks, whole-batch free Inventory capacity and complete current-cost Scrap affordability immediately before atomic commit. Stale selection/screen counts are never approval; continuous checkpoint/reward changes are respected. Failure consumes zero Scrap, rolls/generates zero loot and changes no Inventory items. Success deducts full cost and commits all results directly into Inventory as one action, never a partial batch or deliberate Mail overflow.

Reveal occurs after authoritative acquisition; all Parts occupy Inventory before/during animations. A checkpoint reward during reveal sees the entire batch and may use existing unavoidable-reward Mail safety if it cannot fit; Scavenge Parts remain in Inventory. Sequential reveal then summary is only a possible direction; exact reveal UX and source visual production remain open. Future Auto Scavenge must obey the same unlock/capacity/affordability/current-state rules. Permanent individual-source upgrades are not current core and need separate future approval.

D03 records eventual unlocks, source/batch selection, remembered investment and loot/tier rules without production fields/schema changes. D06 owns atomic gameplay authority under existing local-first/save-error safeguards. D07 and §§18/23/33 constrain future implementation. Catalogs, prices/multipliers/curves, pools/weights, batch unlock milestones/costs/mechanism, investment memory scope, cards/art/reveal and automation details remain open. Balance considers checkpoint farming, source/investment costs, Dismantle returns and approved sinks without profitable reroll loops.

**Status/scope:** Documentation only; no runtime/schema/save-version/balance/art/Scavenge UI or Auto Scavenge implementation. Every task/milestone status and historical audit record remains unchanged; M0 IN PROGRESS, Garage unfinished, ART-03R evidence intact. This supersedes destination and remembered-investment uncertainty at design level without claiming implementation complete.

## Owner-approved Garage / navigation / Repeat Checkpoint — 2026-10-07
D01/D02/D05 approve Garage as the central live inspection/home hub. The current equipped Rustbucket appears running/tested in place, not parked or with the full highway duplicated. Only Fuel / Heat / Speed are current near-car live status; normal simulation continues across Garage/Workshop/Inventory/Scavenge and Parts may change while running, with exact application timing still open.

Exactly Workshop (left) / Garage (center/home) / Scavenge (right) are consistent universal primary destinations. Tap/select the active Garage car enters Run directly without mandatory popup; Run is secondary and owns actual highway/checkpoint/Repeat controls. Inventory stays secondary item/equipment management with contextual Workshop/Scavenge access; any Garage equipped summary is optional with visibility/placement/interaction unresolved, not a required five-slot panel or direct Garage gesture.

Repeat OFF advances automatically from the current frontier toward new checkpoints. Repeat ON loops a selected already unlocked checkpoint, earlier or highest, without advancing beyond it, paying normal repeat rewards and automatic reset/refill. Inspecting/selecting old checkpoints while OFF cannot rewind advancement or create a third replay mode. No formal Farm/Push modes or required mode buttons; push/farm build philosophies remain intact. Exact checkpoint selector, Repeat styling/copy/control timing and detailed Run UI stay open.

Scrap is persistently top-left and recognizable Mail access top-right in the conceptual global HUD; exact geometry/icon/vertical alignment is open. Mail may later serve rewards/unavoidable overflow, patches/update logs, announcements and gifts/messages without designing inbox/expiry/claims/tabs/notification counts/announcement behavior. No large game-title/logo or decorative Garage heading is required; branding primarily belongs to store/app-icon/loading/splash surfaces.

D03/D06 record eventual active car, live Fuel/Heat/Speed, current frontier, selected repeat checkpoint and Repeat ON/OFF requirements without schema fields, save version, migrations or multi-car state. One active car/one continuous run is current core; multiple cars/runs and horizontal switching/scrolling with per-car build/run state are future possibilities only. Practical extensibility imposes no current fleet/economy/save/UI requirement.

D07 and §§18/23/24/33 constrain future implementation and preserve remaining Garage art/layout/test cues/gauges/nav artwork/HUD offsets, Inventory access, equipped-summary interaction, Run/Repeat UI, Mail and future switching decisions. **Documentation/status boundary:** no gameplay/runtime/schema/art/Garage visual production/Mail/fleet work or task promotion. M0 stays IN PROGRESS; ART-03R benchmark remains visually approved with evidence unchanged; Garage-side ART-03 remains unfinished. Historical audit sections retain their dated evidence.

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
| In Progress Tasks | ART-03 overall — six Run exports visually approved (including optional clouds); Garage concept pass exists, production remainder unstarted |
| Validation Tasks | ART-03R Run visual review complete; source-workflow acknowledgement and VIS-01 evidence remain separate; Garage refined B direction accepted, final composition owner review pending |
| Blocked Tasks | None for Batch 1/ART-01/02; GAR-01 remains BACKLOG / not READY pending owner slot/move/equip decisions, applicable state adaptation and presentation inputs; future GAR/RUN dependencies updated in §18; TYPO-01 remains BACKLOG pending licensed font inputs |
| Immediate Next Gate | Production typography (TYPO-01) / remaining Golden visual proofs (ART-03); assessment in §34 |

M0 remains IN PROGRESS. DOC-01 is DONE: existing canonical contracts were reconciled without changing source, tooling, tests, assets or product decisions. VAL-01 is DONE: the visual CLI now executes preparation, Golden, phase production, full technical and release gates with truthful reports/exit codes and focused regressions. VAL-02 is DONE: correct audio root, explicit preparation/Golden/full stages, structural provenance/source/file checks and regression evidence. VAL-03 is DONE: the existing pure viewport suite runs under the standard test command, with all previous test files preserved. ART-01 is DONE: all eight `proof_a` assets produced, technical gate passed, and explicit OWNER APPROVAL recorded as the Golden visual benchmark. Eight ART-01 assets advanced to `visual` registry status. ART-02 is DONE: all five non-font `proof_b` assets (`icon_scrap`, `icon_stat_fuel`, `ui_panel_plate`, `ui_button_primary`, `ui_slot_frame`) produced, passed technical validation, and explicit OWNER APPROVAL recorded for the Golden UI benchmark and revised workshop button. Five ART-02 assets advanced to `visual` registry status. Note on `proof_b`: the ART-02 non-font scope is technically complete and visually approved, but the overall `proof_b` bundle remains incomplete, blocked by missing TYPO-01 font inputs (`font_display`, `font_body`). D05 explicitly contains the unresolved installed-slot gesture as OWNER DECISION REQUIRED; GAR-01 remains BACKLOG / not READY until the owner resolves it and its other inputs pass §13.

ART-01 and ART-02 are complete; ART-03 is IN PROGRESS and remains incomplete. ART-03R has six owner-visually-approved Run assets (including optional clouds), recorded at visual; Garage runtime exports remain planned and absent. The 2026-10-07 Garage concept pass below is separate review material. M0 still requires production typography (TYPO-01), remaining ART-03 production/acceptance, VIS-01 in-game proof, palette lock, and final Golden approval (ART-04).

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

### Core merge compatibility design record — owner-approved 2026-10-06

Core merging requires two copies with the **same Family + same Type/Specialization + same Tier**, producing one **next-tier part of the same family and type**. Different families, types or tiers are invalid inputs; matching family and tier alone is insufficient. Type is persistent gameplay identity: no generic, random or hybrid output and no cross-type fusion/recipe graph.

This supersedes earlier uncertainty about core matching/cross-type fusion; optional future transformation remains separate. GAR-02 uses deterministic same-line progression; PLAY-01 checks matching-type comprehension. General/specialized Scavenge and Scrap tier investment are unchanged. No new task, gameplay, schema, balance, board/UI, art or automation work begins; all task/milestone statuses and ART-03R assets/references/lifecycle evidence remain unchanged.

Direct merging of equipped parts is currently disfavored / expected to require unequipping first, but final interaction behavior depends on Merge Board design. This is pending, not a locked equipped-input prohibition or mandatory unequip workflow. Merging must not unexpectedly modify the running vehicle.

Workbench / Merge Board is finite and expandable through progression; successful normal merge results belong on the Workbench. Exact geometry/visual arrangement, starting and maximum capacity/slot count, expansion costs/milestones, variable-size parts, interaction gesture/workflow, result placement cell, detailed Workbench full-space handling and transfer UX remain unresolved; Inventory capacity and full-Inventory rules are approved in the Inventory contract in D02. Direct equipped-part merging and whether unequip is required await board design; equipment application timing remains open. Future max-tier handling beyond the existing generic VS1 Tier 3 rejection, special transformation-component rules/future type transformation, detailed Multi-Merge and Auto-Merge rules/unlocks/scope/targeting/configuration remain open.

Special transformation components are an **optional future extension**, outside core merging and not required for VS1 or initial board design. Engine + special modification component → modified/specialized Engine is conceptual only; no component catalog, recipes, transformation rules, acquisition, balance, UI or unlocks are defined.

### Merge Workshop structure / Inventory record — owner-approved 2026-10-06

The Merge screen has **TOP: Merge Area** and **BOTTOM: Workbench / Merge Board**. The Workbench is persistent, finite active engineering space, expandable through progression. Inventory remains separate general long-term item/part storage, capable of future content beyond car parts; it is neither only spare car-part storage nor merely Workbench overflow. Equipped Parts remain the current Rustbucket build and the only installed contributions to stats/visuals.

The Merge Area prepares/performs **Input A + Input B + merge action**; it is interaction space, not permanent storage or a fourth persistent location. A successful normal manual merge consumes two compatible Workbench parts and creates one next-tier same-type Workbench part. Show the new part through temporary result/reward presentation (for example Road Tire T1 + Road Tire T1 → Road Tire T2). Feedback is not authoritative storage. No permanently occupied Result/output slot is required, and no automatic Inventory transfer is implied. Exact destination cell, user-selected placement and presentation remain open.

Workbench expansion is gameplay progression: active engineering capacity, separate from Inventory storage capacity. It supports parallel chains/projects, reduced workspace pressure and future automation capacity; no balance values are chosen. Normal manual pair merging comes first. **Multi-Merge** is approved only as a potential later progression/convenience unlock for processing several compatible pairs more efficiently. **Auto-Merge** is approved as later idle automation of learned manual merging. Both must build on the Workbench workflow and preserve its meaning rather than bypass it. Neither is initial core behavior; rules, unlocks and implementation remain deferred.

This supersedes earlier blanket uncertainty about finite/expandable capacity and output destination. GAR-02 applies the workshop structure and Workbench output contract after remaining interaction/state inputs are resolved; D07/D03/D05/D06 describe functional, presentation and persistence requirements. D02 lists detailed open decisions; §33 preserves readiness gates. No new implementation task, task/milestone promotion, runtime/schema/save-version/balance change, art production or final visual styling. ART-03R approval/assets/references/lifecycle evidence and Garage’s unfinished status remain unchanged.

### ART-03R Golden Run approval and hygiene evidence — 2026-10-05

The owner explicitly approved the current six Run assets as the Golden Run
environment visual benchmark. Exactly `env_sky_outskirts`, optional
`env_clouds_strip`, `env_far_junkyard`, `env_road_asphalt`, `prop_scrap_pile_a` and
`fx_puff` are `visual`. This records actual owner acceptance, not automatic
approval from tests. No entry advances to `ingame` or `approved`.

| Check | Current result |
|---|---|
| Owner visual decision | Accepted current six Run assets as Golden Run environment benchmark; `art/source/golden/art03/owner-approval.json` records immutable pixel/source/reference/proof hashes |
| Runtime/source identity | Six explicit grids reproduce current PNG bytes in memory; no art or retained preview regenerated during hygiene |
| References | All eight approved files under `art/reference/art03_run/` retained; base sky, clouds and composite are separate current authorities |
| Current masters | Road (already cropped), far, prop and puff consumed by retained translation recipe/provenance; obsolete source iterations excluded |
| Source workflow | Maintained explicit grids and controlled imagegen/master translation documented; non-Aseprite workflow acknowledgement remains separately pending, without a general waiver |
| Cloud contract | Owner-approved 384×96 / cutout / tileX / optional / polish; bounded technical/visual exception only, no Golden membership change |
| Sky exception | Only Outskirts base atmosphere uses the owner-authorized RGB row ramp; 16×300 / opaque / tileX retained; other palette rules and provisional master unchanged |
| Final evidence | Primary 216 AP Run, minimum 180 AP, maximum 216×427 AP, 768 AP repetition, scroll/frame contact, background-only, cloud-repeat and asset contact proofs retained byte-identical |
| Run technical gate | Six per-entry passes; `validation.json` and `cloud-review.json` record current results and sealed approval integrity |
| Full proof_c | Expected failure only for absent Garage wall/lift: two errors, 66 future warnings |
| Tests / typechecks | 13 files / 250 tests; source, tools and dedicated ART-03 source typechecks pass |
| Registry and task status | Six Run entries visual; Garage planned/not started; ART-03 overall IN PROGRESS / incomplete; M0 IN PROGRESS |
| Remaining acceptance | Separate source-workflow acknowledgement, VIS-01 loading/motion/viewport evidence, palette lock and final Golden approval; Garage production not begun |

Obsolete comparisons and duplicate enlargements were removed after repairing
source/provenance references. Current production exports, editable grids, four
masters, all approved creative references and retained proof PNGs are unchanged.
No new canonical task ID, Garage art, or broader non-Golden batch was created.

### Garage-side ART-03 concept pass — 2026-10-07

Owner-authorized art direction/concept work only. D04 §7 now interprets the existing `env_garage_wall` as a half-open service-bay backdrop and `env_garage_lift` as a low improvised roller/test platform. Registry IDs, dimensions, alpha/color requirements, Golden membership and statuses are unchanged.

[Initial review package](../art/source/golden/art03-garage-concept/README.md): three retained imagegen references, exact prompts and a local comparison page with 216×288 size studies, 180-wide centre crops and accepted ART-01/02 native pixels. Initial assessment: A is too heavy/cluttered; B is busier but clearly outdoors; C gives quieter car separation but has excessive blank headroom and an ambiguous wall-like pale opening. The initial conditional recommendation of C is superseded by the owner's B selection below.

**Owner-accepted visual direction: refined Concept B.** The owner accepted the [B follow-up](../art/source/golden/art03-garage-concept/b-refinement/REPORT.md): its canopy/lamp, blue open air, subdued scrapyard, short rear panel and low rollers stay. C supplied restraint only. No competing directions or material redesign. The [single final composition candidate](../art/source/golden/art03-garage-concept/final-composition/REPORT.md) uses native approved Rustbucket pixels, tighter critical-crop sky/floor and clean/guided 216×427 plus centred 180×288 evidence. Composition approval and production authorization are pending; direction acceptance changes no registry lifecycle state.

**GARAGE COMPOSITION FINAL CANDIDATE — READY FOR OWNER REVIEW.** Exact approved car pixels and the real canvas/safe crop are now demonstrated in review artifacts. The environment remains generated reference material, not a cleaned palette-compliant registered source. Stop before production; no runtime exports, final UI, gameplay, optional foreground production, source-method waiver or asset/in-game/final approval. ART-03 and M0 stay IN PROGRESS; every task/milestone status remains unchanged. ART-03R retained files remain protected.

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
| **M1 — Garage Engineering Ready** | NOT STARTED | Focused Garage overview and explicit equipment/part-location interactions | M0; required Garage assets | ART-05/06/08/09/10/11, GAR-01/02/03 | Valid loaded saves render; starter installation works; commands and rejection feedback work | VISUAL, PLAYTEST | Complete run loop |
| **M2 — Playable Vertical Slice** | NOT STARTED | Continuous attempts/checkpoints → repeat rewards → engineer → improve/push/farm | Required road/HUD assets and service contracts | ART-07/12, RUN-01/02, RES-01, PLAY-01/02; SAVE-01 before meaningful external playtest | Repeat Scrap funds acquisition; first-clear bonus settles once; automatic fuel reset/refill/retry works; earlier farm selection persists; merges preserve equipment and explicit equip improves capability | PLAYTEST | Balance and integrated presentation proof |
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
    → checkpoint settlement + automatic retry + useful diagnostics
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
| Garage | Required approved assets; resolved slot/move/equip and applicable part-state contracts | Final audio polish | Run implementation |
| Run | Approved minimum assets; resolved checkpoint/fuel/reward contracts and continuous domain/service/save adaptation | Garage navigation needed for complete-loop approval | Garage interactions |
| Checkpoint feedback/diagnosis | Real continuous attempt/clear state and authoritative idempotent reward settlement | Final decorative treatment | Audio event integration |
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
| ART-03 | IN PROGRESS | P0 | Golden Garage/road/effect samples | Prove scene coherence | ART-03R: six Run entries visual (including optional clouds); owner visual approval recorded; two Garage entries planned/absent; refined B direction accepted, single exact-car final composition owner review pending | VAL-01 | Hard for Golden approval | ART-01/02, TYPO-01 | D04/11, AR | Exact seven entries in §21 | Remaining terrain/props | Composition, tiling, vehicle contrast and puff treatment work | AV-stage | VISUAL | HIGH | MEDIUM |
| VIS-01 | BACKLOG | P0 | Production loading and retained proof view | Exercise real exports through Phaser | Boot preload empty; proof scene inactive | Technical inputs from ART-01/02/03 and TYPO-01 | Hard for rendered approval | AUD-03 after inputs | AR, VP, D05/06 | Registry-driven images/sheets/fonts, errors, development-only proof navigation and resize behavior | Progress ownership, fake gameplay | Correct keys/frames/fonts load; failures visible; reusable production loader | T, U where meaningful, AV-stage | VISUAL | MEDIUM | MEDIUM |
| TYPO-02 | BACKLOG | P0 | Typography visual acceptance | Prove readability on production backgrounds | Current proof insufficient | TYPO-01, VIS-01, technical ART-02/03 | Hard for Golden approval | AUD proof | TY, D05, VP | §21 samples at target viewports; narrow demonstrated corrections | New font/branding system | Hierarchy, numbers, wrapping and labels accepted at real size | T, AV-stage | VISUAL; DEVICE spot-check | HIGH | MEDIUM |
| ART-04 | BACKLOG | P0 | Approve exact Golden visual set | Unlock controlled expansion | 0/22 approved | ART-01/02/03, TYPO-02, VIS-01 | Hard for all non-Golden art | Audio track | AR, PAL, D04/11 | All 22; composition review; palette lock and truthful statuses | Additional art families | Owner accepts every Golden entry; locked palette passes gate | AV-stage with locked palette | VISUAL | HIGH | SMALL |
| AUD-01 | BACKLOG | P1 | Golden music pair | Prove shared sonic identity | D13 sequence; no sources | Entitlement preflight | Hard for audio Golden gate | Visual/scene work | D13, AU | Garage candidates → motif → Run candidates → pair; raw/session/master/provenance | Remaining music, final codec claim | Pair coherent and instrumental; Garage repetition and Run restart auditions pass | Provenance/master checks | AUDIO | HIGH | MEDIUM |
| AUD-02 | BACKLOG | P1 | Four Golden SFX | Prove vehicle/interaction/failure sound | D13 exact set | Source/license preflight | Hard for audio Golden gate | AUD-01, visual work | D13, AU | Engine loop, merge, click, fail; source/master/provenance | Remaining seven SFX | Engine tolerates expected rate range; feedback clear and tolerable | AA-stage/master checks | AUDIO | HIGH | MEDIUM |
| AUD-03 | BACKLOG | P1 | Browser codec/unlock proof | Select viable browser delivery candidates | `.mp3` provisional; no runtime proof | VAL-02, AUD-01/02, VIS-01 | Hard for browser audio integration | Garage/Run work | D13, AU, AudioService | Candidate encodes in actual Phaser; looping, unlock, switching, resume, latency/size | Native approval claim | Repeated playback accepted on desktop and physical mobile browser; native limitation explicit | AA-stage; playback assertions where useful | AUDIO, DEVICE | HIGH | MEDIUM |
| ART-05 | BACKLOG | P1 | Bare vehicle completion | Support legitimate empty builds | Two `hero` entries | ART-04 | Hard for complete vehicle presentation | Other art batches | AR, D02/04 | `veh_wheel_bare`, `veh_shadow` | Optional wreck sprite | Bare chassis presents correctly in Garage and Run | AV-stage | VISUAL | MEDIUM | SMALL |
| ART-06 | BACKLOG | P1 | Garage UI expansion | Support engineering controls | Eleven entries, §21 | ART-04 | Hard for GAR-01/02/03 | Part/road batches | AR, D05 | Exact Garage UI batch | Run UI, domain commands | Controls, badges and icons accepted at target size | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-07 | BACKLOG | P1 | Run/checkpoint feedback UI expansion | Support telemetry and diagnosis | Six entries, §21 | ART-04 | Hard for RUN-01 | Garage/part/road batches | AR, D05 | Exact registered Run/feedback UI batch | Simulation | Gauges, pause icon, stamps readable | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-08 | BACKLOG | P1 | Fuel family batch | Complete fuel ownership visuals | Three icons + three overlays | ART-04 | Hard for complete Garage | Other family batches | AR, D03/04 | Fuel T1–T3 icons/overlays | Other families | Tier ladder and installed registration accepted | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-09 | BACKLOG | P1 | Cooling family batch | Complete cooling visuals | Three icons + three overlays | ART-04 | Hard for complete Garage | Other family batches | AR, D03/04 | Cooling T1–T3 icons/overlays | Other families | Readable progression and registration | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-10 | BACKLOG | P1 | Suspension family batch | Complete suspension visuals | Three icons + three overlays | ART-04 | Hard for complete Garage | Other family batches | AR, D03/04 | Suspension T1–T3 icons/overlays | Other families | Readable progression and registration | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-11 | BACKLOG | P1 | Remaining tires batch | Complete tires and wheel progression | Three icons + two sheets | ART-04 | Hard for complete Garage/Run | Other family batches | AR, D03/04 | Tire icons T1–T3; wheel sheets T2/T3 | Golden T1 wheel replacement | All wheel cycles and tier distinctions accepted | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-12 | BACKLOG | P1 | Remaining terrain layers | Match all simulated segments visually | Eight `road` layer entries | ART-04 | Hard for unrestricted production runs | Garage/part work | AR, D03/04 | Three skies, two far layers, three ground bands | New roads | Every segment has correct layers and clean transitions | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-13 | BACKLOG | P1 | Road prop expansion | Complete roadside vocabulary | Eleven remaining props | ART-04 | Hard for M3, soft for playable loop | Gameplay/audio | AR, D04 | Exact remaining props in §21 | Hazards/new mechanics | Props coherent, readable and appropriately composed | AV-stage | VISUAL | MEDIUM | MEDIUM |
| ART-14 | BACKLOG | P1 | Remaining effects | Complete merge/run feedback | Three `fx` entries | ART-04 | Hard for M3, soft for first loop | Gameplay/audio | AR, D04/05 | Spark, merge burst, dust | Gameplay formulas | Effects reinforce state without obscuring gauges | AV-stage | VISUAL | MEDIUM | MEDIUM |
| GAR-01 | BACKLOG | P1 | Garage overview/equipment increment | Make the equipped build understandable | GS commands exist; active-run block needs adaptation | VIS-01, ART-04/05/06/08/09/10/11; applicable item-flow interactions and optional Garage summary decisions if included; applicable three-location command/save adaptation; Applicable type/compatibility display contracts when introduced | Hard | RUN work with separate files | D02/03/05/06, GS | Central live home/inspection hub; running/test-in-place equipped Rustbucket with Fuel / Heat / Speed; persistent top-left Scrap/top-right Mail access; universal Workshop / Garage / Scavenge primary navigation; car tap/select→Run directly; secondary Inventory/item-flow equipment management; any Garage summary/interaction unresolved; explicit applicable equip/unequip feedback/readiness; Distinguish family/type/tier, useful alternative Inventory equipment and dangerous Engine/Radiator warnings under resolved UI contracts; no automatic highest-tier recommendation | Board/layout invention, RNG, mandatory Garage five-slot panel/direct gestures, large title/logo, full road/checkpoint selector, fleet or Mail system design | Loaded/starter builds work; only equipment changes stats/visuals; instances conserved; valid atomic count-neutral swaps allowed at full Inventory; normal Unequip-to-Inventory requires room and never uses Mail; Equipped-to-Workbench allowed with room; normal driving continues across management views and Parts may change while running; Run is not primary nav, Inventory stays secondary; When types are introduced, suitability/tradeoffs are understandable without implying universal tier superiority; no preset/auto-swap feature is inferred | T, U, C | VISUAL, PLAYTEST | HIGH | MEDIUM |
| GAR-02 | BACKLOG | P1 | Manual Scavenge and merge integration | Teach source/investment choices before automation | Current generic command lacks source/investment/type support; equipped-input merge fallback conflicts | GAR-01; resolved source catalog/unlocks/costs/pools/weights/tier-investment contracts; approved core compatibility plus resolved workshop capacity values/expansion/equipped-input/result-cell/transfer rules; resolved applicable batch unlocks, investment memory scope and source-card/reveal inputs; command/save adaptation; applicable Dismantle refund/location/UX decisions | Hard | RUN work | D02/03/05/06, GS | Focused Scavenge from Garage/hub; image/card-oriented source identity after resolved visual inputs; source/unlocked batch/remembered per-use investment; fresh authoritative source/batch/capacity/full-cost checks; atomic full-batch Inventory commit before reveal; General relevance; specialized targeting; finite expandable Workbench and general Inventory with 150 non-stacking item-instance base slots, currencies outside capacity and Family/Type/Tier organization; entire batch must fit current Inventory without Mail overflow; x1 first and later x3→x5→x7 convenience; Dismantle cleanup for small Scrap after refund/location/UX decisions; same-family/type/tier deterministic next-tier same-type results on Workbench, temporary manual result feedback and clear invalid-input errors | Invented names/prices/drop rates/UI, new currency, automation implementation, permanent source upgrades, board geometry, Mail design, expansion/monetization implementation | Source controls family/type pool and weights; investment improves tier odds without erasing source identity; randomness remains; one Part/unit; no batch-only odds bonus; selection spends nothing and investment persists without auto-downgrade; failed checks consume zero Scrap, roll zero loot and change zero Inventory items; no partial batch; checkpoint changes before execution and ownership before/during reveal validated; General stays useful; no unexpected equipment changes, unlike-type merges, core fusion or random merge outputs; two-to-one Workbench ownership independent of full Inventory; no permanent Result storage or initial Multi-Merge/Auto-Merge | T, U, C | PLAYTEST | MEDIUM | MEDIUM |
| GAR-03 | BACKLOG | P1 | Persistence/recovery/reset presentation | Make durability status understandable | GS exposes pending/error/blocked/retry/reset | GAR-01 | Hard for player-facing acceptance | RUN; SAVE-01 with distinct ownership | D03/05/06/12, SAVE/GS | Status display, retry, unsupported-save explanation, explicit reset confirmation, settings container | Queue/recovery semantics | Failures are visible; retry/reset behave truthfully; unsupported raw data preserved until reset | T, U, C | PLAYTEST | HIGH | MEDIUM |
| RUN-01 | BACKLOG | P1 | Continuous RunScene and attempt cycle | Deliver auto-drive/checkpoints/automatic retry | Existing session/simulation/rewards need adaptation | VIS-01, vehicle assets, ART-07/12; resolved checkpoint/fuel/reward/reset and target contracts; domain/service/save adaptation; Resolved applicable type/terrain/Engine-Radiator compatibility contracts; region/checkpoint scope | Hard; Garage navigation soft until loop review | GAR-01/02 | D02/03/05/06, GS/SIM | Authoritative attempt/clear settlement; fuel stop/reset/refill/retry; physical landmarks; Repeat OFF frontier advancement / Repeat ON selected-checkpoint loop; bounded nearby rendering; Performance emerges from equipped type/tier/tradeoffs/compatibility and conditions; mechanical region transitions reuse authored pieces; catastrophic overheating retries with equipment intact | Invented balance/offline formula, scene-owned saves/rewards, ART-03R redo | Automatic attempts without manual launch/result/Garage gates; Repeat OFF advances from frontier; Repeat ON loops selected unlocked earlier/highest checkpoint; no formal Farm/Push modes or old-checkpoint rewind while OFF; repeat Scrap and first-clear bonus settle idempotently; recycling preserves state; Fuel remains normal limiter; no per-part health, degradation or mandatory global durability; approved type/route behavior is authoritative rather than every checkpoint being a hard stat gate | T, U, C | VISUAL, PLAYTEST | HIGH | MEDIUM |
| RUN-02 | BACKLOG | P1 | Continuous controls/lifecycle/warnings | Complete intent and lifecycle behavior | Existing hidden-tab policy; selection/control policy unresolved | RUN-01; resolved checkpoint-selection/pause/background contracts | Hard | RES-01 in separate module | D02/05/06, GS | Run-only checkpoint inspection/selection, progression frontier and Repeat ON/OFF intent, approved controls, foreground/resume safety, threshold effects and cleanup independent of navigation | Offline formula/cap invention, quit-distance payout | Repeat OFF advances frontier; ON loops selected unlocked checkpoint; older inspection while OFF leaves advancement unchanged; management-view navigation neither stops nor starts/settles attempts; lifecycle follows resolved policy; warnings reflect state; auto-retry remains automatic | T, U, C | PLAYTEST, DEVICE | HIGH | MEDIUM |
| RES-01 | BACKLOG | P1 | Checkpoint feedback and useful diagnosis | Teach improvement during continuous production | D01 diagnosis pillar; D05 removes mandatory terminal results | RUN-01; RUN-02 for applicable states | Hard for M2 | Audio integration | D01/02/05/06, GS/SIM | Clear/repeat/first-clear feedback, relevant bottlenecks/hints, authoritative reward/record changes, settlement rejection; Explain route/type suitability and severe Engine/Radiator mismatch; eventual warning before/while running under resolved contracts; explosion is attempt feedback with parts intact | Mandatory result/return gate, scene reward ownership | Player understands retry/bottleneck, repeat reward versus one-time bonus and next improvement without dismissing results per attempt; Feedback teaches type suitability and meaningful tradeoffs without implying a universally best tier or permanent equipment damage | T, U, C | PLAYTEST, VISUAL | HIGH | MEDIUM |
| SAVE-01 | BACKLOG | P1 | Persist audio preferences safely | Meet meaningful playtest requirement | D13 requires persistence; v1 has no options | Preference contract from D13 | Hard before meaningful audio-enabled external playtest | Scene work; serialized SAVE ownership | D03/06/13, SAVE/GS | Master/music/SFX mute and volume, defaults, explicit known-v1 migration, validated service commands, restore on launch | Progress loss, queue rewrite, active-run persistence | Existing progress survives; preferences restore; unsupported future saves remain protected | T, U, C | PLAYTEST | HIGH | MEDIUM |
| AUD-04 | BACKLOG | P1 | Production audio ownership/integration | Exercise Golden audio through real scenes | Service uncomposed; missing engine controls/disposal | AUD-03, real scenes; SAVE-01 for settings | Hard for integrated proof | RES/QA with separate files | D05/06/13, AU, AudioService | Single composition owner, loaders, category volume APIs, real instance limits, engine rate/stop ownership, pause/scene transitions, listener disposal, saved options | Speculative crossfades/multi-loop system | No leaked engine/music; limits are simultaneous; unlock/mute/resume and scene transitions work | T, U, C, AA-stage | AUDIO, DEVICE | HIGH | MEDIUM |
| AUD-05 | BACKLOG | P1 | Golden in-game mix approval | Approve all six together | D13 explicitly requires integrated mix | AUD-04, RUN/RES/GAR loop | Hard before audio expansion | Visual QA | D13, AU | Music pair + four SFX in real interactions and repeated runs | Remaining production before approval | Identity, repetition, engine, feedback and mix accepted; native delivery remains explicitly provisional | AA-stage | AUDIO, PLAYTEST, DEVICE | HIGH | MEDIUM |
| AUD-06 | BACKLOG | P1 | Remaining seven SFX | Complete required VS1 sound roles | AU has seven non-Golden entries | AUD-05 | Hard for M3 | Art/presentation QA | D13, AU | Error, install, uninstall, three warnings, Scrap tick | New audio roles | Provenance and role distinctions accepted; correct event binding | AA-full, T/U for bindings | AUDIO | MEDIUM | MEDIUM |
| AUD-07 | BACKLOG | P1 | Full VS1 mix/device acceptance | Prove complete soundscape | No real mix evidence | AUD-06, full scene integration | Hard for M3 | QA-01 | D13, AU | All 13, repetition, warnings, engine range, phone/headphone listening, background/resume | Native codec signoff | Feedback stays audible and tolerable across repeated play; no clipping/leaks | AA-full, relevant U | AUDIO, DEVICE, PLAYTEST | HIGH | MEDIUM |
| PLAY-01 | BACKLOG | P1 | Engineering and manual acquisition comprehension | Find interaction confusion early | D01/05 engineering loop; approved source/investment philosophy | GAR-01; GAR-02/RUN-01 for funded acquisition | Hard for final interaction acceptance | Run development | D01/02/05 | Starter installation first; naturally funded source choice, Scrap cost/investment, pool tendencies/tier odds, x1-to-later-batch quantity, free remembered investment and clean full-batch rejection feedback, and matching-type deterministic merge under the approved core rule once interaction is resolved | Balance redesign from fixture-only observations, final UI invention | Observations distinguish starter engineering from funded acquisition; players distinguish pool targeting from tier investment and uncertainty, and matching-type merge progression from invalid unlike-type inputs | Relevant U | PLAYTEST | HIGH | SMALL |
| PLAY-02 | BACKLOG | P1 | Continuous-loop comprehension checkpoint | Prove improvement and deliberate farming | Continuous loop not implemented | RUN-02, RES-01, GAR-02/03; SAVE-01 when external audio playtest | Hard for balance acceptance | Presentation production | D01/02/05 | Fuel depletion/automatic retry, repeated Scrap, first-clear bonus, Run checkpoint selection/Repeat ON/OFF, explicit equipped improvement and rate comparison; Where authorized types exist, compare push versus farm suitability, useful Inventory alternatives and compatibility warnings across changing road conditions | Premature expansion | Players explain automatic attempts, Repeat OFF advancement / ON repetition without formal modes, per-clear versus per-time rewards and why board merges do not change the car; Players understand that lower-tier suitable equipment can outperform higher-tier wrong types and that catastrophic retry preserves equipment | C | PLAYTEST | HIGH | MEDIUM |
| BAL-01 | BACKLOG | P1 | Evidence-based checkpoint balance | Improve progression and farm choices | Discrete-run measurements are historical; exact target values open | PLAY-02; approved checkpoint/acquisition/fuel balance scope; Resolved applicable type stats/weights, compatibility/heat/explosion/terrain and region inputs; resolved source costs/weights/tier-investment and unlock inputs | Hard for VS1 acceptance | Final art/audio QA | D02/03, balance.ts, simulator | Per-clear reward, clear/cycle time, effective Scrap/time, fuel/reset and bottleneck pressures, acquisition cadence; tune investment with checkpoint farming/base/targeted-source costs, small Dismantle returns and approved sinks; prevent profitable infinite reroll loops without assumed final formulas; smallest proven numeric changes; Measure per-type suitability/costs, Engine-Radiator behavior, obstacle/region composition and push/farm reliability rather than tuning a universal tier ladder; compare more pulls versus targeted pulls versus improved tier odds, source overlap and General relevance under approved scope | Invented final economy/offline rules | Farther normally pays more per clear without forced best-per-time farming; repeats sustain economy; upgrades change capability/rate understandably; math safety retained; Specializations solve meaningful problems with costs; regions alter useful builds without forced highest-target farming; no specialized-source universal superiority or mandatory secondary acquisition currency | T/U, data gate, adapted simulator | PLAYTEST | HIGH | MEDIUM |
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
| **AND-03 / P2 / Native storage/lifecycle binding** | BACKLOG | Preserve approved continuous save/attempt semantics on device | AND-02, V1-04 / HARD / codec work | D02/03/06/12; adapter decision, lifecycle bridge, kill/relaunch/reset behavior | New offline rewards or implicit unfinished-run rewards | Process-loss and storage failures accepted; U/native checks; **DEVICE/PLAYTEST** | HIGH / MEDIUM |
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
| ART-07 — Run/checkpoint feedback UI, six | `icon_stat_heat`, `icon_stat_speed`, `icon_ui_pause`; `ui_gauge_frame`, `ui_gauge_fill`, `ui_stamp_frame` | Golden approved; telemetry/stamp QA | Yes for Run |
| ART-08 — Fuel, six | `part_fuel_t1…t3`, `veh_rustbucket_ov_fuel_t1…t3` | Golden approved; family contact-sheet/composite approval | Yes |
| ART-09 — Cooling, six | `part_cooling_t1…t3`, `veh_rustbucket_ov_cooling_t1…t3` | Same | Yes |
| ART-10 — Suspension, six | `part_suspension_t1…t3`, `veh_rustbucket_ov_suspension_t1…t3` | Same | Yes |
| ART-11 — Tires, five | `part_tires_t1…t3`, `veh_wheel_tires_t2`, `veh_wheel_tires_t3` | Golden approved; animation/progression approval | Yes |
| ART-12 — Terrain, eight | `env_sky_cracked`, `env_sky_dirt`, `env_sky_rocky`; `env_far_dunes`, `env_far_cliffs`; `env_road_cracked`, `env_road_dirt`, `env_road_rock` | Golden approved; tiled/transition approval | Yes for unrestricted runs |
| ART-13 — Props, eleven | `prop_scrap_pile_b`, `prop_tire_stack`, `prop_barrel`, `prop_fence`, `prop_utility_pole`, `prop_sign_road`, `prop_sign_grade`, `prop_shrub_dry`, `prop_dead_tree`, `prop_boulder_a`, `prop_boulder_b` | Golden approved; composition approval | M3; does not block first simulation binding |
| ART-14 — Effects, three | `fx_spark`, `fx_merge_burst`, `fx_dust` | Golden approved; motion/readability approval | M3 |

Optional entries are `veh_rustbucket_wrecked`, `env_garage_fg`, and `env_clouds_strip`. They are outside the mandatory critical path. Include them only through an explicit bounded polish decision.

All batches follow editable source → technical export → visual review → actual Phaser integration → approval. Non-Golden entries cannot advance beyond `planned` before all 22 Golden entries are approved, except the explicit ART-03R owner authorization for optional `env_clouds_strip` at `technical` or `visual` only.

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
8. Integrate all six into the real Garage/continuous Run/checkpoint feedback loop; failure SFX can communicate bottlenecks without requiring terminal results.
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
Acquisition under GAR-02 now uses D02/D03 source/investment contracts. It lives in a focused Scavenge screen/system reached from Garage/hub: communicate source identity/cost/pool tendencies and investment/tier odds without embedding every control in home. Preserve General's broad/relatively inexpensive/relevant role, specialized targeted-but-random pools, shared parts and Scrap-only acquisition. Resolve catalogs/unlocks/costs/weights/distributions and applicable interaction inputs before readiness; no source normally guarantees requested equipment and investment does not erase source identity.

Future equipment interactions follow Family + Type + Tier + Tradeoffs + Compatibility. Inventory supports useful alternate push/farm equipment, not just merge fodder; only equipped parts contribute. Detailed display/movement/preset UX is unresolved; manual drag/drop and atomic full-Inventory swaps are approved in D02, with no automatic loadout swapping approved. When types are introduced, apply approved core matching and resolve remaining board/equipped-input/acquisition contracts before GAR-02 readiness rather than assuming all same-family/tier parts are interchangeable.

Three coherent production increments, with statuses retained in §18:

1. **GAR-01 — Home/build overview and equipment:** Frozen loaded snapshots, running/test-in-place equipped Rustbucket, Fuel / Heat / Speed, persistent top-left Scrap/top-right Mail access, Workshop / Garage / Scavenge primary navigation and direct car→Run access; primary equipment management remains Inventory/item flow, with any Garage summary unresolved; explicit equip/unequip feedback after applicable owner decisions and command adaptation.
2. **GAR-02 — Manual Scavenge and merge:** Adapt source/investment acquisition through validated service owners with resolved Scrap/eligibility/RNG rules, then integrate separately resolved work/storage interactions; conserve finite expandable Workbench / general Inventory / Equipped Parts and approved max-tier baseline with clear errors. Normal merge outputs belong on Workbench; Scavenge outputs commit directly to Inventory before reveal with fresh whole-batch/current-cost/unlock validation. Temporary feedback is not permanent Result storage. Exact visuals/placement/Workbench capacity values remain open; base Inventory is 150 item instances; Multi-Merge and Auto-Merge are later directions.
3. **GAR-03 — Save/settings presentation:** Pending/error/blocked status, retry, explicit reset and later persisted audio options.

Only equipped parts change active stats and installed visuals. Do not copy the current implicit installed-input fallback: it unexpectedly clears an equipped slot. Direct equipped merging and whether unequipping is required remain pending board design; no final workflow is chosen. Bare chassis remains valid. Adapt the current blanket active-run engineering block so driving coexists with improvements; equipment-change application timing remains open.

**OWNER DECISION REQUIRED:** D05 §8 slot gesture, MAX-tier/targeting behavior and applicable move/equip contracts gate GAR-01. Applicable detailed workshop, acquisition and ownership decisions gate GAR-02; finite expandable capacity and Workbench output destination are approved, but exact Workbench geometry/capacity values remain open. Inventory base capacity and full-Inventory rules are approved in D02; remaining UI/state contracts still gate readiness.

Current v1 new saves have zero Scrap and two stored starter parts. M1 can prove starter engineering; naturally funded acquisition/merge comprehension needs M2's repeated checkpoint Scrap. Fixture checks do not prove real progression acceptance; the M1/M2 close-timing maintenance note remains open.

## 24. Continuous Run / Checkpoint Feedback Production Plan
Applicable future specialization work evaluates equipped suitability against surfaces/obstacles and Engine/Radiator compatibility. Fuel is the normal limiter; severe overheating can cause catastrophic failure/explosion and retry with equipment intact. Legacy global durability/breakdown and generic tire/suspension buffers do not dictate the new model. Exact formulas/thresholds and bounded catalog/region scope must be resolved before readiness; no new art or permanent damage system is implied.

Road regions group checkpoints and introduce mechanical terrain/obstacle changes through reusable authored pieces. Region transitions should change useful build strategy, not just difficulty numbers; final names/counts/boundaries and requirements remain open.

Adapt existing domain/service/save owners before scene integration; do not repeatedly pay the old minimum/distance completion reward:

- Automatic auto-drive and fuel-limited attempts; fuel-zero stop/reset/refill/retry on the selected/current checkpoint route.
- Physical landmark progression; Scrap Pile can be the first VS1 checkpoint type.
- Repeat OFF advances from the current frontier; Repeat ON loops a selected unlocked checkpoint (earlier or highest); inspecting older checkpoints while OFF never rewinds advancement.
- Repeat successful-clear Scrap and first-clear bonus once, with idempotent authoritative settlement and visible errors.
- Real vehicle/fuel/diagnostic state tied only to equipment, with resolved equipment-change timing.
- Simulation independent of navigation and local road rendering; recycle passed visuals/activate incoming nearby content without erasing state.
- Useful nonblocking clear/reward/bottleneck feedback; no per-attempt launch, mandatory result dismissal or Garage return.

Resolve applicable §33 fuel/reward/checkpoint/reset/selection and persistence contracts before implementation; do not invent numbers/UI. Preserve numeric safety, state ownership, recovery and duplicate-callback protections. Later non-visible/offline calculation must be possible mathematically/statefully without every frame; exact rules remain deferred. Current hidden-tab pausing is an implementation snapshot, not final offline design.

Dispose owned input/audio/lifecycle subscriptions. ART-03R visuals/references/lifecycle states remain unchanged; no new asset batch or Run art redo is implied.

## 25. Playtest Plan

| Uncertainty | Earliest useful checkpoint | Questions |
|---|---|---|
| Installation comprehension | GAR-01 | Can a player identify slots, install starter parts and understand changed values? |
| Acquisition/merge comprehension | GAR-02 plus repeat checkpoint clears | Can players distinguish source pool targeting from investment tier odds, understand Scrap/uncertainty/General relevance, and retain distinct type/merge/equipment concepts? |
| Core-loop comprehension | Continuous RUN/RES feedback | Why did the attempt retry? What reward repeated or paid only once? What should change next? |
| Progression | Several improvement/run cycles; authorized type/region content | Do suitability and tradeoffs change useful builds across regions, rather than only rewarding bigger tier numbers? |
| Balance teaching | First starter and bare-build comparison | Does the game teach sensible engineering, or reward removing useful-looking parts? |
| Farming incentives | Checkpoint selection/repeats available | Can an earlier target yield better Scrap/time despite lower per-clear reward? Can improvements change that choice? |
| Presentation coherence | Golden composites; again at M3 | Do visuals and sound feel like one game? |
| Audio tolerance | Golden pair/SFX, then real loop | Is repetition tolerable? Are merge and failure feedback appropriately distinct? |
| Mobile usability | Every usable scene increment | Can players read, target, scroll and recover from errors? |

Use observation rather than explaining the game during the attempt. Record specific confusion, actions and outcomes. Separate fixture-based branch checks from naturally earned progression.

## 26. Balance Iteration Plan

| Automated / simulation evidence | Human experience evidence |
|---|---|
| Reachability and failure ordering | Whether failure feels understandable |
| Terrain/obstacle/region behavior and per-type suitability | Whether improvements and region-driven build choices feel beneficial |
| Representative/pathological push/farm builds and Engine-Radiator combinations | Whether tradeoffs, warnings and equipment-preserving retries are understandable |
| Reward and safe-integer boundaries | Whether acquisition cadence feels satisfying |
| Currency recovery paths | Whether repeat farming sustains the economy without discovery |
| Partition/stall invariants | Whether high-power failures teach the intended tradeoff |

The 2026-10-04 baseline simulator run recorded:

- Bare chassis: approximately 150 m.
- Starter engine/fuel: approximately 69.57 m, heat failure.
- Full T1/T2/T3: approximately 248.55/372/605 m.
- T3 engine with T1 support: approximately 53.85 m, heat failure.

These are **historical baseline observations**, not final product targets or fresh simulator results.

Tune toward representative progression bands and expected pressures under the approved type/road contract; a higher tier is not universally superior. Specialized types should usually carry meaningful costs, and regions should change mechanical suitability rather than only increase numbers. Preserve mathematical correctness tests, but do not assert that a tier must deliver one exact distance as the definition of fun.

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
| Obsolete terminal payouts or forced highest farming undermine idle choices | MEDIUM | HIGH | RUN-01/PLAY-02/BAL-01 | Adapt settlement to successful repeats/first clears; preserve deliberate earlier targets and sustainable acquisition | Gameplay |
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

An explicit owner-approved direction may update canonical design before implementation, as recorded in the 2026-10-06 correction; unresolved details remain owner decisions. Otherwise, a canonical decision may change when direct implementation or validation evidence demonstrates a meaningful correctness, UX, visual, audio, performance, platform, production-cost, maintainability or contract problem.

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
- Prestige, later workflow automation and final offline formulas; baseline continuous auto-drive/retry belongs in VS1.
- Runtime item-instance/schema implementation outside authorized three-location adaptation, or repeated-slot architecture. Non-stacking individual Part instances are approved design (D02/D03); exact IDs/fields remain undecided.
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
| Exact Workbench geometry, starting/maximum capacity and expansion costs/milestones | **OPEN — affected future GAR/state work** | Finite progression-expandable active workspace approved; no dimensions, slot counts, grid shape or prices chosen |
| Inventory capacity / instances / organization | **APPROVED DESIGN — implementation pending** | Base 150 item instances; Parts do not stack; currencies use no slots; Family / Type / Tier organization; visual/filter/search UX and future categories remain open |
| Detailed drag/drop/move/equip UX and equipment application timing | **OWNER DECISION REQUIRED — GAR/RUN integration** | Primary drag/drop, single location and atomic count-neutral full-Inventory swaps approved; normal Unequip-to-Inventory blocked when full; Equipped→Workbench allowed with room; detailed gestures/timing open |
| Exact checkpoint Scrap, first-clear parts/drop tables and acquisition probabilities/economy | **OWNER DECISION REQUIRED / BALANCE — affected GAR-02/RUN-01** | Repeat Scrap and one-time bonus fixed conceptually; values/list/normal destinations TBD; unavoidable items that Inventory cannot accept may use Mail |
| Exact fuel values/formulas, checkpoint distances and route reset/refill details | **OWNER DECISION REQUIRED / BALANCE — RUN-01** | Automatic fuel-cycle retry fixed; exact mechanics/numbers TBD |
| Garage visual layout and live inspection styling | **ROLE/STATUS SET APPROVED — VISUALS OPEN** | Running/test-in-place car and Fuel/Heat/Speed only; D04 §7 half-open shelter/test-platform brief and concept-only package exist; exact composition/animation/gauges and owner concept acceptance remain unresolved; no Garage production now |
| Global navigation, Run and Inventory access | **PRIMARY ROUTES APPROVED — DETAILS OPEN** | Workshop left / Garage center-home / Scavenge right universal; car→Run direct; Run/Inventory secondary; exact buttons/gestures/hit areas/transitions/bar form open |
| Scrap/Mail global HUD and branding | **CONCEPTUAL PLACEMENT APPROVED — DETAILS OPEN** | Persistent Scrap top-left, Mail top-right; dimensions/alignment/icon offsets and Mail behavior open; no large Garage title/logo required |
| Garage equipped summary | **OPTIONAL / UX OPEN** | No fixed five-slot panel, visibility/placement/direct drag/details/filter gesture; primary equipment management stays Inventory/item flow |
| Multiple cars/runs and switching | **FUTURE ONLY** | Current one active car/one continuous run; no fleet/economy/save/UI requirement now; future switching UX unresolved |
| Checkpoint-selection UI and target/control transitions | **OWNER DECISION REQUIRED — RUN-01/02** | Run owns Repeat OFF frontier advancement and Repeat ON selected unlocked looping; old-checkpoint inspection while OFF never rewinds; no formal Farm/Push modes; exact selector/toggle/timing open |
| Continuous part/checkpoint/intent/first-clear schema and migration; attempt persistence | **FUTURE IMPLEMENTATION CONTRACT — applicable GAR/RUN readiness** | D03/D06; preserve v1 ownership/recovery, resolve migration and validated commands before scene binding |
| Exact offline formula/cap and non-visible calculation policy | **OPEN / DEFERRED** | Support mathematical/stateful repeats; hidden-tab pausing is not final offline design |
| Exact later automation unlocks | **OPEN / DEFERRED** | Most automation follows manual work; driving/retry is VS1 baseline |
| Exact part type catalog, specialized names, stats and weights | **OPEN — affected future gameplay/data scope** | D01/D02/D03; current catalog unchanged; type suitability and tier strength are distinct |
| Engine/Radiator compatibility, heat/explosion thresholds and warning/presentation rules | **OPEN — applicable RUN/RES/GAR readiness** | Catastrophic attempt retry preserves equipment; no global durability/degradation or per-family health mandate |
| Terrain/obstacle/farming formulas and exact checkpoint requirements | **OPEN — applicable RUN/BAL readiness** | Equipped build and conditions shape performance; no universal tier ladder or hard stat gate per checkpoint |
| Exact region names/counts/boundaries/content and map presentation | **OPEN — future region scope** | Multiple checkpoints per region; mechanical transitions and reusable pieces; no example range locked |
| Core merge compatibility | **APPROVED DESIGN — implementation pending** | Same family/type/tier → one next-tier same-type part; unlike types invalid; no core cross-type fusion |
| Exact workshop visuals, merge interaction, result cell/popup and detailed transfer UX | **OPEN — GAR-02 readiness after interaction design** | Top Merge Area / bottom Workbench approved; two-to-one output remains on Workbench independent of full Inventory; no permanent Result storage; detailed gesture/placement/popup and Workbench-space UX open |
| Dismantle economics and interaction | **APPROVED CLEANUP / DETAILS OPEN** | Small Scrap and freed occupied slot; formula/scaling/Scavenge relationship, Inventory/Workbench/other invocation location, bulk/multi, confirmation and buttons unresolved |
| Inventory expansion | **FUTURE DIRECTIONS ONLY** | Permanent progression rewards or optional paid capacity; precise rewards, maximum, purchased amounts/bundles/prices and implementation open; not required now |
| Mail design | **OPEN — separate owner discussion** | Unavoidable item safety approved; no manual Unequip/intentional Scavenge workaround; capacity/expiry/claiming/notifications/types/attachments/inbox/broader functions unresolved |
| Batch availability | **APPROVED PROGRESSION / DETAILS OPEN** | x1 first, then x3→x5→x7; one Part/unit; no quantity-only tier bonus; exact milestones/costs/mechanism/separate upgrades open |
| Investment preference scope and values | **REMEMBERED PER-USE SELECTION APPROVED / DETAILS OPEN** | Selection costs nothing, persists until changed and never auto-downgrades; global versus per-source memory and exact values/multipliers/curves open |
| Source-card design | **IMAGE/CARD DIRECTION APPROVED / VISUALS OPEN** | Recognizable salvage image/name/identity/cost; art, dimensions, carousel/grid, typography, count and animation unselected |
| Permanent source upgrades | **OPTIONAL FUTURE ONLY — separate approval** | Not current core; progression unlocks source/batch possibilities plus player-selected per-use investment |
| Scavenge destination and execution | **APPROVED DESIGN — implementation pending** | One Part/unit; full unlocked batch commits directly to Inventory before reveal; fresh unlock/capacity/full-cost checks; zero-side-effect failure; no partial batch or deliberate Mail overflow |
| Direct equipped merging / whether unequip is required | **OPEN — revisit after Merge Board design** | Direct equipped merging currently disfavored / expected to require unequipping first; not a locked workflow |
| Future max-tier handling | **OPEN beyond existing generic VS1 Tier 3 rejection** | Preserve baseline rejection; no new ceiling, recycling or alternate max-tier output |
| Optional special transformation components / future type transformation | **OPEN / OPTIONAL FUTURE ONLY** | Outside core, not VS1/initial board requirement; no recipes/components/acquisition/balance/UI/unlocks defined |
| Multi-Merge rules/unlock/cost/interaction/targeting/chaining | **APPROVED FUTURE DIRECTION — details open** | Later progression/convenience after manual pairs; not initial core behavior |
| Auto-Merge rules/unlock/scope/tier limits/filters/spending/configuration and Inventory access | **APPROVED LATER AUTOMATION — details open** | Builds on learned manual Workbench flow; must preserve Workbench meaning; no initial automation |
| Source loot tables/family/type weights/tier probabilities, targeting controls/shop behavior and type unlocks | **OPEN — GAR-02 readiness** | Multiple sources plus Scrap tier investment approved; exact pools/distributions/control and unlocks remain unresolved |
| Loadout preset system | **OPEN / NOT APPROVED FOR IMPLEMENTATION** | Push/farm are build philosophies, not preset slots or automatic swapping |
| Final Scavenge Source names/counts, checkpoint/region unlocks and mappings | **OPEN — affected acquisition scope** | Sources may unlock with progression; no fixed source catalog, duplicate-per-tier requirement or checkpoint number |
| Exact Scrap prices/cost multipliers and investment levels/tier rules/UI | **OPEN — GAR-02/BAL inputs** | Source targets pool; additional Scrap improves tier odds; General remains relevant; no final buttons/levels/slider chosen |
| Guaranteed/pity mechanics, duplicate protection, first-clear Scavenge interaction and exact reveal UX | **OPEN — affected acquisition scope** | Random acquisition retained; reveal after full ownership/Inventory commit; sequence/animation/skip/cards/summary open |
| Auto Scavenger unlocks, optional Scrap spending limits and configuration UI | **OPEN / DEFERRED** | Same source/batch/investment workflow and fresh unlock/whole-batch-capacity/affordability checks required; exact behavior/configuration open |
| Any future secondary acquisition currency | **OPEN / NOT APPROVED NOW** | Scrap is the only approved acquisition currency; none added, future choice not permanently forbidden |
| Installed-slot tap: details versus immediate uninstall | **OWNER DECISION REQUIRED — BLOCKS LATER, GAR-01** | Explicitly contained by DOC-01 in D05 §8; resolve applicable Inventory/item-management gesture/MAX/targeting and any separately included Garage summary before affected readiness |
| Typography sizes/wrapping on actual AP canvas | **CAN BE RESOLVED BY VISUAL PROOF** | TYPO-01/02 |
| Palette and overlay composition quality | **CAN BE RESOLVED BY VISUAL PROOF** | Golden review |
| Current music generation entitlement/terms | **BLOCKS NOW for production generation** | AUD-01 preflight; does not block code/art work |
| Shared musical motif and final repetition length | **CAN BE RESOLVED BY AUDIO PROOF** | AUD-01/05 |
| One engine loop survives required rate range | **CAN BE RESOLVED BY AUDIO PROOF** | AUD-02/05 |
| Browser runtime encode choice | **CAN BE RESOLVED BY AUDIO PROOF** | AUD-03 |
| Native runtime codec suitability | **CAN BE RESOLVED DURING ANDROID/RELEASE WORK** | AND-04 |
| Starter/bare tradeoff, repeat-farming rates, progression cadence | **CAN BE RESOLVED BY PLAYTEST** | PLAY-02/BAL-01 |
| Exact V1 feature/content boundary | **BLOCKS LATER** | V1-01 after accepted VS1 |
| Public-browser ownership/fallback policy | **BLOCKS LATER** | Before public browser distribution |
| Native source ownership, storage adapter and device matrix | **CAN BE RESOLVED DURING ANDROID/RELEASE WORK** | AND-01/03 |
| Monetization implementation and paid capacity details | **FUTURE DIRECTION / DETAILS OPEN** | Optional paid Inventory capacity is future only; MON-01 still resolves commercial scope; no current purchase requirement, amounts/prices/maximum or implementation selected |
| Analytics requirement | **BLOCKS LATER only if selected** | Commercial/data decision |
| Store audience, pricing, territories and disclosure requirements | **CAN BE RESOLVED DURING ANDROID/RELEASE WORK** | Store preparation |
| Optional visual polish | **BLOCKS LATER only if included** | Explicit post-critical-path decision |

The original validation-repair batch is complete. Newly recorded decisions gate applicable future gameplay readiness, not retained art/typography/validator evidence. Owner-approved direction authorizes this documentation correction; unresolved details remain open.

## 34. Final Readiness

### ART-01 AND ART-02 COMPLETE — ART-03R GOLDEN RUN VISUALLY APPROVED

**DOC-01, VAL-01, VAL-02, VAL-03, ART-01 and ART-02 are DONE. ART-03 is IN PROGRESS: six Run assets are visual (including optional clouds), accepted as the Golden Run benchmark; Garage refined B direction is accepted, final composition review is pending and runtime production remains unstarted. M0 remains IN PROGRESS.**

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
- **ART-03:** Six Run assets (including optional clouds) passed technical checks and owner visual review under ART-03R, and are recorded at visual. Separate non-Aseprite workflow acknowledgement and VIS-01 in-game proof remain pending. Two Garage runtime entries remain planned/absent; refined B visual direction is accepted, the 2026-10-07 exact-car final composition awaits owner review, and production is unstarted. Overall **IN PROGRESS**, not DONE.
- **TYPO-01:** Named dependencies are DONE, but retained licensed production font inputs are not yet evidenced in the repository. Remains **BACKLOG** until production font files are provided.
- **VIS-01:** Hard dependency requires technical inputs from ART-01/02/03 and TYPO-01. ART-01 and ART-02 are complete, but remaining inputs (ART-03, TYPO-01) are not yet complete. Remains **BACKLOG**.
- **TYPO-02, ART-04 and non-Golden art:** Require completion of remaining Golden batches, typography proof, and in-game proof; remain **BACKLOG**.
- **AUD-01/02:** Source/licensing and entitlement preflight remain unevidenced; remain **BACKLOG**.

M0 remains IN PROGRESS. No broader non-Golden task was started; the optional cloud has only its explicit bounded owner authorization. All recorded status transitions have named evidence. Remaining M0 acceptance requires production typography (TYPO-01), Garage-side ART-03 production and all remaining ART-03 acceptance, in-game proof (VIS-01), palette lock, and final Golden approval (ART-04).

The 2026-10-06 correction updates design and future implementation scope only. Statuses remain intact; applicable GAR/RUN readiness follows the updated dependencies in §§18, 23, 24 and 33. No gameplay or merge-board redesign was started.

The equipment-specialization/road-region record is documentation-only. No gameplay, merge-board redesign, part-acquisition design, runtime schema/catalog or art work was begun; all task/milestone statuses and ART-03R approval remain unchanged.

The Scavenge source/investment update records approved design only. No gameplay, merge-board redesign, runtime schema/data/balance change, art or Scavenge UI production was started; existing task/milestone and ART-03R statuses remain intact.

The 2026-10-07 Inventory/capacity/Dismantle update records design and future task constraints only. No implementation or task/milestone promotion; Inventory visuals, Mail and monetization remain deferred.

The manual Scavenge/batch/atomic-execution record changes canonical design and future acceptance only. No task promotion, gameplay, Scavenge UI/art or automation implementation begins.

The Garage/navigation/Repeat record updates design and future acceptance only; all task/milestone states and ART-03R evidence are unchanged, and Garage art/Mail/multi-car implementation has not begun.
