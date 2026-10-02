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
- Saves are triggered automatically on key events: Scavenge, Merge, Install, **Uninstall**, Run End.
- **Schema:** Defined in `03_GAME_DATA_BIBLE.md`.
- **Versioning:** Include a `version` integer in the save data. Future updates must include migration functions if the schema changes. The current version constant (`CURRENT_SAVE_VERSION`) is defined in `03_GAME_DATA_BIBLE.md`.
- **No Phaser Objects:** Never store Phaser Sprites, Text objects, or active Scene data in the save file.
- **Corruption:** If the save cannot be parsed or has an unrecognized version, discard it and start fresh. See `03_GAME_DATA_BIBLE.md` §Save Loading & Corruption Behavior for the full decision table.

## 4. Simulation Ownership
The `Run Scene` owns the `RunState` (distance, current fuel, current heat, current durability). `RunState` is **not** persisted in the save file; it is reconstructed at the start of each run from the current `GameState`.

```typescript
interface RunState {
  distance: number;        // metres accumulated this run
  fuel: number;            // current fuel (0..fuelCapacity)
  heat: number;            // current heat (0..maxHeat)
  durability: number;      // current durability (0..maxDurability)
  maxDurability: number;   // snapshot from VehicleStats at run start; does not change mid-run
  failureCause: 'out_of_gas' | 'overheated' | 'breakdown' | 'abandoned' | null;
}
```

During the Phaser `update(time, delta)` loop, the scene calls the pure simulation function:
`RunState = advanceSimulation(RunState, VehicleStats, RoadDefinition, delta)`
The scene then updates the UI gauges based on the new `RunState`.

**Formulas:** All simulation formulas are defined in `02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md` §3. The `advanceSimulation` function must follow those formulas exactly. Do not invent alternative formulas in the implementation.

## 5. Directory Structure (Proposed)
```text
src/
  assets/         # Images, fonts
  data/           # Static definitions (Parts, Roads, Chassis)
  logic/          # Pure functions: calculateVehicleStats, advanceSimulation, mergeLogic
  scenes/         # Phaser scenes (Boot, Garage, Run)
  state/          # Current game state and SaveManager
  types/          # TypeScript interfaces (PartDefinition, ChassisDefinition, VehicleStats, RunState, SaveData)
  ui/             # Reusable UI components (Buttons, Bars, Gauges)
  main.ts         # Entry point
```

