# Architecture and Save Model

## 1. Technical Stack
- **Engine:** Phaser 4 (v4.2.1+). See `docs/10_TECHNOLOGY_DECISION.md` for the rationale for choosing Phaser 4 over Phaser 3.
- **Language:** TypeScript 5.8.x (`strict: true` + `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`).
- **Bundler:** Vite 8.
- **Persistence:** Browser `localStorage` via `StorageAdapter` interface (allows swap to Capacitor Preferences later without touching game logic).
- **Testing:** Vitest 5 — scoped to `src/domain/`, `src/services/`, `src/data/` only. Phaser scenes are not unit-tested.

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

## 5. Directory Structure (Implemented)
```text
src/
  main.ts              # Entry point — creates Phaser.Game only

  types/
    game.ts            # ALL canonical TypeScript types (PartDefinition, ChassisDefinition,
                       #   VehicleStats, RunState, SaveData, FailureCause, etc.)

  data/
    parts.ts           # Static PartDefinition[] — mirrors Data Bible §Parts
    chassis.ts         # Static ChassisDefinition[] — mirrors Data Bible §Chassis
    roads.ts           # Static RoadDefinition[] — mirrors Data Bible §Roads

  domain/
    vehicle/
      calculateVehicleStats.ts       # Pure: chassis + parts → VehicleStats
      calculateVehicleStats.test.ts
    run/
      simulation.ts                  # Pure: advanceSimulation, createRunState, getActiveSegment
      simulation.test.ts
      rewards.ts                     # Pure: calculateRunReward
    parts/
      merge.ts                       # Pure: resolveMerge, canMergeInInventory
      merge.test.ts

  services/
    storage/
      StorageAdapter.ts              # Interface + LocalStorageAdapter (VS1 implementation)
    save/
      SaveRepository.ts              # Load, save, migrate, validate SaveData
    state/
      GameStateService.ts            # Live mutable state wrapper (Scavenge, Merge, Install)
      GameStateService.test.ts

  game/
    config/
      phaserConfig.ts                # Phaser 4 game config (pixelArt, Scale.FIT, 360×640)
    scenes/
      BootScene.ts                   # Phase 1 minimal boot; transitions to GarageScene later

  assets/                            # Art assets go here when produced
                                     # See docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md
```

**Boundary rule:** `domain/` and `services/` must NEVER import from `game/`. The Phaser layer (`game/`) may import from `domain/` and `services/`. This keeps simulation logic testable without Phaser.
