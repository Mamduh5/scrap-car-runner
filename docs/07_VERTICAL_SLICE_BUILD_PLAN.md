# Vertical Slice Build Plan (VS1)

These phases describe VS1 integration areas. [D14](14_IMPLEMENTATION_AND_PROJECT_MANAGEMENT_PLAN.md) is authoritative for execution sequencing, readiness, dependencies and status; phase headings do not override its backlog. Domain simulation, rewards and state commands already exist. Bind presentation to those owners rather than rebuilding them.

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


## Phase 3: Garage UI & State Integration (Visuals Only)
- **Goal:** Render the garage.
- **Tasks:** Create `GarageScene`. Build the top bar (Scrap), middle car view, and bottom inventory list.
- **Validation:** UI displays the loaded save data correctly.

## Phase 4: Scavenge & Merge Logic
- **Goal:** Core meta-loop mechanics.
- **Tasks:** Bind Scavenge and Merge UI to the existing validated service commands; do not duplicate ownership or RNG rules.
- **Validation:** Player can buy parts and merge them up to Tier 3. Data saves correctly.

## Phase 5: Installation & Stat Calculation
- **Goal:** Vehicle engineering.
- **Tasks:** Bind explicit installation targets/uninstall UI to existing commands and display `GameStateService.currentVehicleStats`. Garage does not calculate authoritative `VehicleStats`; the service uses the existing domain calculator.
- **Validation:** Installing parts dynamically updates the total Power, Fuel, Cooling, and Durability.

## Phase 6: The Run Simulation
- **Goal:** The core moment-to-moment loop.
- **Tasks:** Create production `RunScene` around the original session returned by `GameStateService.startRun()`. The service calculates frozen stats and initial state; RunScene owns evolving ephemeral RunState and calls `advanceRun(originalToken, state, road, deltaMs / 1000)`. Existing domain simulation advances fuel, heat, durability, terrain and failure. Bind movement/gauges to that state; do not implement duplicate formulas or a moving-car shell. Stop stepping terminal states; hidden runs pause and the first resume delta is discarded.
- **Validation:** Car "drives", stats deplete accurately based on formulas.

## Phase 7: Failure & Result Flow
- **Goal:** Complete the loop.
- **Tasks:** Consume the simulator’s terminal cause, then call `GameStateService.recordRunResult(originalToken, terminalState)`. The service validates the result, calculates rewards, consumes eligibility and updates progress/persistence. Show diagnosis, reward and record changes from the successful settled transition; show rejection if settlement fails. Return to Garage. Explicit quit uses the documented abandoned result. RunScene does not independently calculate/award rewards or own saved progress.
- **Validation:** Game loops seamlessly from Garage -> Run -> Result -> Garage. Scrap is awarded.

## Phase 8: Polish & Art Integration
- **Goal:** Refine integrated production assets defined in `assetRegistry.ts` under D04 art direction; add registered smoke/spark effects. Required production art must be made before any earlier UI depends on it; temporary boxes are not permitted.
- **Validation:** The game looks and feels like a complete vertical slice.

## Foundation handoff and release gates
The hardening pass ends before Phase 3. Boot remains technical text, with no art or gameplay added. The aggregate check verifies source/tools, regression tests, static data, production simulation and build; rendered mobile/touch/device acceptance is separate. Before public browser release: one-writer coordination across tabs. Before Android: native source ownership, adapter/lifecycle and physical-device acceptance. Before monetization: actual provider/store trust/privacy/idempotency requirements.

## Production inputs and parallel audio track

D14’s executable validators, production typography and exact 22-entry Golden visual approval precede dependent scene work. Required registered batches must exist and pass their applicable approval gates before presentation consumes them. GAR-01 additionally needs D05’s installed-slot owner decision. Real Garage and Run integration may overlap once each has its own inputs; D14 determines readiness.

Golden Audio production and browser codec/unlock proof are VS1 tracks under D13, alongside visual/scene work. Full 13-entry audio and integrated mix/device acceptance are required before presentation-complete VS1; native/WebView codec confirmation waits for Android. First scene bindings do not require final audio polish. Persist audio preferences before meaningful user-facing audio-enabled playtests. Automated preparation passes do not establish production-content or human approval.
