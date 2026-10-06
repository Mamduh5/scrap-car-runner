# Vertical Slice Build Plan (VS1)

These phases describe VS1 integration areas. [D14](14_IMPLEMENTATION_AND_PROJECT_MANAGEMENT_PLAN.md) is authoritative for execution sequencing, readiness, dependencies and status; phase headings do not override its backlog. Domain simulation, rewards and state commands already exist for the discrete-run foundation. Future work must adapt those owners to D01/D02/D06 continuous checkpoint contracts before presentation binds to them; existing code does not prove that adaptation complete.

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
- **Tasks:** Resolve applicable acquisition/economy and board/movement contracts before integration. Adapt commands to conserve Merge Board / Inventory / Equipped Parts separately; remove implicit equipped-input merge behavior. Bind manual acquisition/merge UI to validated owners; do not invent probabilities, board geometry or automation unlocks.
- **Validation:** Player can buy parts and merge them up to Tier 3. Data saves correctly.

## Phase 5: Installation & Stat Calculation
- **Goal:** Vehicle engineering.
- **Tasks:** Bind explicit installation targets/uninstall UI to existing commands and display `GameStateService.currentVehicleStats`. Garage does not calculate authoritative `VehicleStats`; the service uses the existing domain calculator.
- **Validation:** Only explicitly equipped parts change active stats and installed visuals; board/inventory ownership and merges leave the equipped build unchanged. Resolve when equipment changes apply to an ongoing attempt before implementation.

## Phase 6: Continuous attempt and checkpoint simulation
- **Goal:** Implement D02's continuous auto-drive with fuel-limited automatic attempts.
- **Tasks:** Adapt domain/service session, reward and persistence contracts for checkpoint progression, selected Progress/Push or Farm target and automatic route reset/refill/retry. Resolve applicable fuel/checkpoint/reward decisions before implementation. Reuse useful math/safety safeguards; avoid the obsolete per-terminal distance/minimum payout. Bind RunScene movement/gauges and physical landmarks to authoritative state. Render/recycle nearby road content independently from progression.
- **Validation:** Fuel-zero ends the current attempt and automatically begins the next on its selected/current route; targets and state survive visual recycling/view navigation. No per-attempt manual launch or forced Garage return. Later offline calculation is possible without every frame; no offline formula is implemented without an approved contract.

## Phase 7: Repeat rewards, first clears and diagnostics
- **Goal:** Complete continuous idle production and deliberate player farming.
- **Tasks:** Settle normal Scrap for repeat successful checkpoint clears and first-clear bonus once. Allow earlier unlocked checkpoint/route farming even when farther progress is possible. Present useful bottleneck/reward feedback without mandatory terminal result dismissal. Keep authoritative settlement/idempotency outside scenes and expose persistence/rejection errors truthfully.
- **Validation:** Repeats fund acquisition without new discoveries; first-clear bonus never duplicates; farther normally pays more per clear but need not yield better Scrap/time. Improvements can change optimal farming. Automatic retry works alongside explicit engineering; no one-run/one-payout/result/Garage cycle.

## Phase 8: Polish & Art Integration
- **Goal:** Refine integrated production assets defined in `assetRegistry.ts` under D04 art direction; add registered smoke/spark effects. Required production art must be made before any earlier UI depends on it; temporary boxes are not permitted.
- **Validation:** The game looks and feels like a complete vertical slice.

## Foundation handoff and release gates
Phases 1–2 remain completed foundation history, not completion of continuous-run or three-location save adaptation. Most automation must begin with a manual workflow the player understands (acquisition, merging, sorting/movement); automation unlocks/implementation remain future work. ART-03R assets/references/lifecycle states remain unchanged; Garage ART-03 remains unfinished. The hardening pass ends before Phase 3. Boot remains technical text, with no art or gameplay added. The aggregate check verifies source/tools, regression tests, static data, production simulation and build; rendered mobile/touch/device acceptance is separate. Before public browser release: one-writer coordination across tabs. Before Android: native source ownership, adapter/lifecycle and physical-device acceptance. Before monetization: actual provider/store trust/privacy/idempotency requirements.

## Production inputs and parallel audio track

D14’s executable validators, production typography and exact 22-entry Golden visual approval precede dependent scene work. Required registered batches must exist and pass their applicable approval gates before presentation consumes them. GAR-01 additionally needs D05’s installed-slot owner decision and applicable part-location/move/equip contracts. Merge-board redesign is a separate future design step, not authorized by this correction. Real Garage and Run integration may overlap once each has its own inputs; D14 determines readiness.

Golden Audio production and browser codec/unlock proof are VS1 tracks under D13, alongside visual/scene work. Full 13-entry audio and integrated mix/device acceptance are required before presentation-complete VS1; native/WebView codec confirmation waits for Android. First scene bindings do not require final audio polish. Persist audio preferences before meaningful user-facing audio-enabled playtests. Automated preparation passes do not establish production-content or human approval.
