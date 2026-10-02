# Architecture and Save Model

## 1. Technical Stack
- **Engine:** Phaser 3 (for rendering, scene management, input).
- **Language:** TypeScript (strict mode enabled).
- **Bundler:** Vite.
- **Persistence:** Browser `localStorage`.

## 2. Architecture Philosophy
Strict separation of concerns. Phaser scenes should act as the "View" and "Controller". The game state and simulation logic should be pure TypeScript objects and functions independent of the rendering loop.

### Layers:
1. **State:** Pure data (JSON serializable). Contains the current inventory, scrap, and car build.
2. **Logic/Simulation:** Pure functions that take State and calculate outcomes (e.g., `calculateVehicleStats(state)`, `tickRun(runState, delta)`).
3. **Services:** SaveManager, AssetLoader.
4. **View (Phaser):** Reads from State and Logic to update sprites, bars, and UI text.

## 3. Save Model
- Saves are triggered automatically on key events: Scavenge, Merge, Install, Run End.
- **Schema:** Defined in `03_GAME_DATA_BIBLE.md`.
- **Versioning:** Include a `version` integer in the save data. Future updates must include migration functions if the schema changes.
- **No Phaser Objects:** Never store Phaser Sprites, Text objects, or active Scene data in the save file.

## 4. Simulation Ownership
The `Run Scene` owns the `RunState` (distance, current fuel, current heat, current durability).
During the Phaser `update(time, delta)` loop, the scene calls the pure simulation function:
`RunState = advanceSimulation(RunState, VehicleStats, RoadDefinition, delta)`
The scene then updates the UI gauges based on the new `RunState`.

## 5. Directory Structure (Proposed)
```text
src/
  assets/         # Images, fonts
  data/           # Static definitions (Parts, Roads)
  logic/          # Pure functions for merging, stats, simulation
  scenes/         # Phaser scenes (Boot, Garage, Run)
  state/          # Current game state and SaveManager
  types/          # TypeScript interfaces
  ui/             # Reusable UI components (Buttons, Bars)
  main.ts         # Entry point
```
