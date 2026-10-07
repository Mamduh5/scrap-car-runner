# Vertical Slice Build Plan (VS1)

These phases describe VS1 integration areas. [D14](14_IMPLEMENTATION_AND_PROJECT_MANAGEMENT_PLAN.md) is authoritative for execution sequencing, readiness, dependencies and status; phase headings do not override its backlog. Domain simulation, rewards and state commands already exist for the discrete-run foundation. Future work must adapt those owners to D01/D02/D06 continuous checkpoint contracts before presentation binds to them; existing code does not prove that adaptation complete.

## Equipment-specialization design dependency
D01/D02/D03's Family + Type/Specialization + Tier + Tradeoffs + Compatibility philosophy is a core contract for future work, not completion of specialized gameplay or an expansion of the VS1 production catalog. Higher tier is not universally best: road conditions can favor a lower-tier suitable type. Engine performance includes hills/load/speed, Radiator supports sustained-load compatibility, Tires specialize by terrain, Suspension by obstacle shape and Fuel Tank by available fuel/attempt duration. No Fuel Tank type catalog is approved.

Preserve alternative push/farm equipment in Inventory and expose only equipped contributions. Severe Engine/Radiator incompatibility can cause catastrophic overheating/explosion and checkpoint retry without destroying equipment; fuel is the normal ending, not a new global durability/health/degradation model. Exact catalog/names/stats/weights/formulas/thresholds and milestone-region requirements remain open. Applicable future implementation must resolve its bounded inputs first; do not invent final catalog, board, acquisition or loadout-preset design.

## Scavenge-source design dependency
D01/D02/D03 now approve multiple sources with family/type pools/weighting, and additional Scrap investment that improves higher-tier odds while retaining source identity. Acquisition remains random but directable, not exact-item shopping. General stays broad/relatively inexpensive/relevant; specialized targeting is typically more expensive, not universally better loot. Shared parts may occur across sources. Region/checkpoint unlocks and tier scaling without mandatory duplicate sources are supported conceptually; exact catalog, prices, odds and mappings remain open. Scrap is the only approved acquisition currency.

Manual source/investment/timing choices precede later automation. Applicable implementation must resolve its bounded inputs and adapt the generic runtime command before UI production. This documents philosophy only; no Scavenge layout, board redesign, new currency, catalog/drop table or balance values are created.

## Phase 1: Project Foundation ✅ COMPLETE
- **Goal:** Setup the build environment and production-grade technical foundation.
- **Tasks:** Phaser 4 + TypeScript + Vite 8 project. Domain/service/data structure. Save abstraction. Unit tests. Data validator.
- **Commands:** `npm install` → `npm run typecheck` → `npm test` → `npm run validate:data` → `npm run build`
- **Validation:** Dev server runs (`npm run dev`) and shows a Phaser canvas scaling correctly to mobile portrait. All tests pass. Build succeeds.
- **Reference:** See `docs/10_TECHNOLOGY_DECISION.md` for technology rationale.

## Phase 2: Data & Save System ✅ COMPLETE
- **Goal:** Implement the static data and save manager.
- **Foundation already in place:**
  - `src/data/parts.ts`, `src/data/chassis.ts`, `src/data/roads.ts` — all VS1 static data.
  - `src/services/save/SaveRepository.ts` — ordered load/save/reset/flush; semantic saveCodec boundary.
  - `src/services/storage/StorageAdapter.ts` — localStorage abstraction.
- **Implemented:** `GameStateService` to handle Scavenge, Merge, Install, Uninstall, and Run End state mutations and triggering saves.
- **Validation:** `GameStateService.test.ts` covers ownership, initialization, errors, ordering/reset, commands and run completion. Game state is completely abstracted from UI.


## Phase 3: Garage overview and engineering navigation
- **Goal:** Render the garage.
- **Tasks:** Create `GarageScene`. Show equipped build, key stats, Scrap and navigation to major systems. Do not permanently embed every subsystem or decide Merge/Inventory layout or board geometry here.
- **Validation:** UI displays the loaded save data correctly.

## Phase 4: Scavenge & Merge Logic
- **Goal:** Core meta-loop mechanics.
- **Tasks:** Resolve applicable acquisition/economy and board/movement contracts before integration, using the approved same-family/type/tier, deterministic type-preserving core merge rule; apply finite expandable Workbench, retained general Inventory, top Merge Area / bottom Workbench and normal outputs on Workbench; resolve equipped-input interaction, result placement cell/detailed Workbench full-space/transfer UX within approved Inventory rules and source catalog/unlock/cost/pool/weight/tier-investment decisions under the approved random-but-directable acquisition model. Adapt commands to conserve Merge Board / Inventory / Equipped Parts separately; remove implicit equipped-input merge behavior. Adapt acquisition to accept source/unlocked-batch/remembered per-use investment, with fresh current-state checks and atomic complete-cost/full-batch Inventory commit before reveal (D02 §12), owned by services; integrate focused Scavenge accessible from Garage/hub without placing all controls on home. Bind manual acquisition/merge UI to validated owners; do not invent probabilities, board geometry or automation unlocks.
- **Validation:** Current generic VS1 ladder remains three tiers; any later authorized type support preserves distinct alternatives rather than silently merging different specializations into a generic upgrade. Verify General remains relevant, specialized sources bias types without normally guaranteeing exact items, investment improves tier odds without changing source identity, and no secondary acquisition currency is required. Validate D02 §12 acquisition safety (fresh source/batch unlocks, full-cost affordability, whole-batch capacity, zero-side-effect failure, no partial batch, Inventory ownership before reveal), resolved balance inputs and ownership persistence; verify matching family/type/tier produces one next-tier same-type part, rejects unlike inputs without mutation, and introduces no core fusion or random merge outcome. Validate two Workbench inputs become one Workbench output without permanent Result storage; temporary result presentation is feedback only. Detailed workshop/equipped interaction remains pending; no initial Multi-Merge or Auto-Merge is assumed.

## Phase 5: Installation & Stat Calculation
- **Goal:** Vehicle engineering.
- **Tasks:** Bind explicit installation targets/uninstall UI to existing commands and display `GameStateService.currentVehicleStats`. Garage does not calculate authoritative `VehicleStats`; the existing domain calculator is the generic additive baseline. Future authorized specialization work must supply authoritative type/terrain/Engine-Radiator performance and tradeoff contracts rather than copying flat formulas into scenes.
- **Validation:** Only explicitly equipped parts change active stats and installed visuals; board/inventory ownership and merges involving only those locations leave the equipped build unchanged. Direct equipped merging remains pending board design. Resolve when equipment changes apply to an ongoing attempt before implementation.

## Phase 6: Continuous attempt and checkpoint simulation
- **Goal:** Implement D02's continuous auto-drive with fuel-limited automatic attempts.
- **Tasks:** Adapt domain/service session, reward and persistence contracts for checkpoint progression, selected Progress/Push or Farm target and automatic route reset/refill/retry. Resolve applicable fuel/checkpoint/reward decisions before implementation, plus any authorized type/compatibility/road-condition scope. Model mechanical region transitions and reusable terrain/obstacle composition rather than only scaling numbers; exact region boundaries/names/content remain TBD. Reuse useful math/safety safeguards; avoid the obsolete per-terminal distance/minimum payout. Bind RunScene movement/gauges and physical landmarks to authoritative state. Render/recycle nearby road content independently from progression.
- **Validation:** Fuel-zero ends the current attempt and automatically begins the next on its selected/current route; targets and state survive visual recycling/view navigation. No per-attempt manual launch or forced Garage return. Later offline calculation is possible without every frame; no offline formula is implemented without an approved contract.

## Phase 7: Repeat rewards, first clears and diagnostics
- **Goal:** Complete continuous idle production and deliberate player farming.
- **Tasks:** Settle normal Scrap for repeat successful checkpoint clears and first-clear bonus once. Allow earlier unlocked checkpoint/route farming even when farther progress is possible. Present useful route-suitability/Engine-Radiator/reward feedback without mandatory terminal result dismissal. Severe incompatibility may trigger catastrophic overheating/explosion and automatic retry with equipment intact; do not generalize to per-part health bars or mandatory global durability. No new art is required by this documentation decision. Keep authoritative settlement/idempotency outside scenes and expose persistence/rejection errors truthfully.
- **Validation:** Repeats fund acquisition without new discoveries; first-clear bonus never duplicates; farther normally pays more per clear but need not yield better Scrap/time. Improvements can change optimal farming. Automatic retry works alongside explicit engineering; no one-run/one-payout/result/Garage cycle.

## Phase 8: Polish & Art Integration
- **Goal:** Refine integrated production assets defined in `assetRegistry.ts` under D04 art direction; add registered smoke/spark effects. Required production art must be made before any earlier UI depends on it; temporary boxes are not permitted.
- **Validation:** The game looks and feels like a complete vertical slice.

## Foundation handoff and release gates
Phases 1–2 remain completed foundation history, not completion of continuous-run or three-location save adaptation. Most automation must begin with a manual workflow the player understands (acquisition, merging, sorting/movement); automation unlocks/implementation remain future work. ART-03R assets/references/lifecycle states remain unchanged; Garage ART-03 remains unfinished. The hardening pass ends before Phase 3. Boot remains technical text, with no art or gameplay added. The aggregate check verifies source/tools, regression tests, static data, production simulation and build; rendered mobile/touch/device acceptance is separate. Before public browser release: one-writer coordination across tabs. Before Android: native source ownership, adapter/lifecycle and physical-device acceptance. Before monetization: actual provider/store trust/privacy/idempotency requirements.

## Production inputs and parallel audio track

D14’s executable validators, production typography and exact 22-entry Golden visual approval precede dependent scene work. Required registered batches must exist and pass their applicable approval gates before presentation consumes them. GAR-01 additionally needs D05’s installed-slot owner decision and applicable part-location/move/equip contracts. Merge-board redesign is a separate future design step, not authorized by this correction. Real Garage and Run integration may overlap once each has its own inputs; D14 determines readiness.

Golden Audio production and browser codec/unlock proof are VS1 tracks under D13, alongside visual/scene work. Full 13-entry audio and integrated mix/device acceptance are required before presentation-complete VS1; native/WebView codec confirmation waits for Android. First scene bindings do not require final audio polish. Persist audio preferences before meaningful user-facing audio-enabled playtests. Automated preparation passes do not establish production-content or human approval.

## Core merge design dependency (2026-10-06)
Core merging requires two copies with the **same Family + same Type/Specialization + same Tier**, producing one **next-tier part of the same family and type**. Different families, types or tiers are invalid inputs; matching family and tier alone is insufficient. Type is persistent gameplay identity: no generic, random or hybrid output and no cross-type fusion/recipe graph.

Phase 4 applies this approved compatibility contract when implementation is authorized; it does not discover fusion recipes or invent board geometry. Direct merging of equipped parts is currently disfavored / expected to require unequipping first, but final interaction behavior depends on Merge Board design. This is pending, not a locked equipped-input prohibition or mandatory unequip workflow. Merging must not unexpectedly modify the running vehicle.

Workbench / Merge Board is finite and expandable through progression; successful normal merge results belong on the Workbench. Exact geometry/visual arrangement, starting and maximum capacity/slot count, expansion costs/milestones, variable-size parts, interaction gesture/workflow, result placement cell, detailed Workbench full-space handling and transfer UX remain unresolved; Inventory capacity and full-Inventory rules are approved in the Inventory contract in D02. Direct equipped-part merging and whether unequip is required await board design; equipment application timing remains open. Future max-tier handling beyond the existing generic VS1 Tier 3 rejection, special transformation-component rules/future type transformation, detailed Multi-Merge and Auto-Merge rules/unlocks/scope/targeting/configuration remain open.

Special transformation components are an **optional future extension**, outside core merging and not required for VS1 or initial board design. Engine + special modification component → modified/specialized Engine is conceptual only; no component catalog, recipes, transformation rules, acquisition, balance, UI or unlocks are defined. No phase/task status changes or board implementation task is created.

## Merge Workshop integration boundary (2026-10-06)
Future Phase 4 integration must retain separate general Inventory, finite progression-expandable Workbench and Equipped Parts; top Merge Area prepares/performs manual merging, bottom Workbench remains active persistent workspace. Normal output belongs on Workbench; temporary result presentation is feedback only, not a permanent Result slot/fourth location. Resolve exact Workbench capacity/expansion, result cell/popup, detailed transfer/Workbench-full-space/scavenged-result presentation and equipped interaction before affected implementation.

Manual pairs come first; Multi-Merge is future progression/convenience and Auto-Merge later automation, both preserving Workbench identity. No initial batch/automatic behavior, exact board visuals, Workbench capacity values, expansion prices or unlocks are assumed. Base Inventory is approved at 150 item instances. D02 owns detailed open decisions; no phase/task status changes or implementation begins.

## Inventory integration dependency (owner-approved 2026-10-07)
Future Phase 4/5 command/save/UI adaptation must apply D02 §11’s **150 non-stacking item-instance base Inventory**, currencies outside slots, Family / Type / Tier organization and exactly one authoritative Part location. Drag/drop is the primary movement direction; detailed mobile gestures/layout remain pending. Validate atomic one-for-one swaps at full Inventory, normal Unequip-to-Inventory rejection with warning (never Mail), direct Equipped→Workbench with room, full-Inventory manual Scavenge rejection and normal Workbench merge independence. Moving out frees Inventory capacity; two Workbench instances become one higher-tier Workbench instance with temporary feedback.

Future cleanup uses Dismantle for small Scrap and freed occupied space instead of valueless Delete; resolve applicable refund, invocation-location and interaction decisions before implementation. Phase 7 unavoidable item rewards that cannot enter Inventory may use safe Mail holding/delivery after the separate Mail contract is designed; manual Unequip and intentional Scavenge overflow cannot use Mail. Mail implementation is not authorized here.

Future permanent progression capacity rewards or optional real-money capacity purchase are deferred, not current integration requirements; base playability must not depend on them. Preserve local-first architecture and v1 implementation truth. All phase/task/milestone states remain unchanged; no gameplay, schema, Mail, monetization or Inventory visual production begins.

## Manual Scavenge integration and validation dependency (owner-approved 2026-10-07)
Future Phase 4 acquisition must bind source + unlocked batch + remembered per-use investment to D02 §12/D03/D06 authoritative execution. Use image/card-oriented source presentation only after separately approved visual inputs; final cards/art/layout remain open. x1 first yields one Part; x3/x5/x7 later progression yield three/five/seven Parts, without a batch-only quality bonus or automatic availability of x7. Resolve exact unlock mechanism/milestones and cost/pool/tier inputs before affected work.

Acceptance must cover free investment selection, persistence until manually changed (global/per-source decision pending), unchanged unaffordable preference, current source/batch unlock validation and complete current-cost/whole-batch-capacity validation immediately before commit. At x7 selected at 140/150, a Phase 7 reward changing Inventory to 144/150 before execution rejects with no charge/roll/item mutation. Success is one atomic full-cost/full-batch Inventory transition before reveal; no partial batch, silent downgrade, deliberate Mail overflow or reveal-owned item creation. Rewards during reveal see the whole committed batch, with existing Mail fallback only for unavoidable rewards that cannot fit.

Future applicable tests/play acceptance should exercise source/batch invalidation, capacity and affordability changing after selection, each rejection’s zero economic side effects, full ownership visible before reveal and no quantity-based odds improvement. Preserve existing save-failure/recovery truth; gameplay atomicity does not imply transactional disk storage. Future Auto Scavenge shares these safety rules without implementation now. Permanent source upgrades remain separate optional future scope. No phase/task/milestone status changes, gameplay, UI/art, schemas/save version or final balance.
