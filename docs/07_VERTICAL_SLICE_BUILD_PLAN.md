# Vertical Slice Build Plan (VS1)

This is the strict implementation sequence. Do not skip phases. Each phase must be stable before moving to the next.

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
- **Tasks:** Bind explicit installation targets/uninstall UI to existing commands and display the production calculateVehicleStats result.
- **Validation:** Installing parts dynamically updates the total Power, Fuel, Cooling, and Durability.

## Phase 6: The Run Simulation
- **Goal:** The core moment-to-moment loop.
- **Tasks:** Create `RunScene`. Implement the logic tick that consumes fuel, increases heat, and takes damage based on distance and `RoadSegment`. Update UI gauges.
- **Validation:** Car "drives", stats deplete accurately based on formulas.

## Phase 7: Failure & Result Flow
- **Goal:** Complete the loop.
- **Tasks:** Detect failure conditions (Fuel 0, Heat Max, Durability 0). Show Result Modal. Calculate Scrap reward. Return to Garage.
- **Validation:** Game loops seamlessly from Garage -> Run -> Result -> Garage. Scrap is awarded.

## Phase 8: Polish & Art Integration
- **Goal:** Refine integrated production assets defined in `04_ART_DIRECTION_AND_ASSET_REGISTRY.md`; add smoke/spark particles. Required production art must be made before any earlier UI depends on it; temporary boxes are not permitted.
- **Validation:** The game looks and feels like a complete vertical slice.

## Foundation handoff and release gates
The hardening pass ends before Phase 3. Boot remains technical text, with no art or gameplay added. The aggregate check verifies source/tools, regression tests, static data, production simulation and build; rendered mobile/touch/device acceptance is separate. Before public browser release: one-writer coordination across tabs. Before Android: native source ownership, adapter/lifecycle and physical-device acceptance. Before monetization: actual provider/store trust/privacy/idempotency requirements.
