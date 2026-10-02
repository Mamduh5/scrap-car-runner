# Vertical Slice Build Plan (VS1)

This is the strict implementation sequence. Do not skip phases. Each phase must be stable before moving to the next.

## Phase 1: Project Foundation ✅ COMPLETE
- **Goal:** Setup the build environment and production-grade technical foundation.
- **Tasks:** Phaser 4 + TypeScript + Vite 8 project. Domain/service/data structure. Save abstraction. Unit tests. Data validator.
- **Commands:** `npm install` → `npm run typecheck` → `npm test` → `npm run validate:data` → `npm run build`
- **Validation:** Dev server runs (`npm run dev`) and shows a Phaser canvas scaling correctly to mobile portrait. All tests pass. Build succeeds.
- **Reference:** See `docs/10_TECHNOLOGY_DECISION.md` for technology rationale.

## Phase 2: Data & Save System ✅ FOUNDATION COMPLETE
- **Goal:** Implement the static data and save manager.
- **Foundation already in place:**
  - `src/data/parts.ts`, `src/data/chassis.ts`, `src/data/roads.ts` — all VS1 static data.
  - `src/services/save/SaveRepository.ts` — load/save/migrate/validate.
  - `src/services/storage/StorageAdapter.ts` — localStorage abstraction.
- **Remaining task:** Implement `GameStateService` that holds the live mutable `SaveData`, calls `SaveRepository` on trigger events (Scavenge, Merge, Install, Uninstall, Run End), and exposes state to Phaser scenes.
- **Validation:** Game can save and load scrap and inventory data. `npm run validate:data` passes.

## Phase 3: Garage UI & State Integration (Visuals Only)
- **Goal:** Render the garage.
- **Tasks:** Create `GarageScene`. Build the top bar (Scrap), middle car view, and bottom inventory list.
- **Validation:** UI displays the loaded save data correctly.

## Phase 4: Scavenge & Merge Logic
- **Goal:** Core meta-loop mechanics.
- **Tasks:** Implement "Scavenge" button logic (deduct scrap, add random T1 part). Implement Merge logic (tap part -> tap duplicate -> upgrade).
- **Validation:** Player can buy parts and merge them up to Tier 3. Data saves correctly.

## Phase 5: Installation & Stat Calculation
- **Goal:** Vehicle engineering.
- **Tasks:** Implement equipping/unequipping parts to chassis slots. Implement `calculateVehicleStats()`.
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
- **Goal:** Replace any temporary boxes with final pixel art assets defined in `04_ART_DIRECTION_AND_ASSET_REGISTRY.md`. Add smoke/spark particles.
- **Validation:** The game looks and feels like a complete vertical slice.
