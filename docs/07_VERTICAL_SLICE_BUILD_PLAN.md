# Vertical Slice Build Plan (VS1)

This is the strict implementation sequence. Do not skip phases. Each phase must be stable before moving to the next.

## Phase 1: Project Foundation
- **Goal:** Setup the build environment.
- **Tasks:** Initialize Vite + TypeScript + Phaser 3 project. Setup folder structure.
- **Validation:** Dev server runs and shows a blank Phaser canvas scaling correctly to mobile portrait.

## Phase 2: Data & Save System
- **Goal:** Implement the static data and save manager.
- **Tasks:** Create `src/data/` with the parts and chassis defined in `03_GAME_DATA_BIBLE.md`. Implement `SaveManager` using `localStorage`.
- **Validation:** Game can save and load dummy scrap and inventory data.

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
