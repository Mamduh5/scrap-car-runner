# Game Data Bible

This document records existing VS1 content and the unchanged v1 disk contract, alongside the owner-approved continuous idle direction (2026-10-06). Existing numerical content is a provisional foundation snapshot, not locked checkpoint balance. No runtime schema or save version changes in this documentation task.

## Approved conceptual data direction (pending implementation)
Track three distinct owned-part locations: **Merge Board** (active work area), **Inventory** (stored off-board/unequipped parts), and **Equipped Parts** (Engine, Fuel Tank, Radiator/Cooling, Tires, Suspension). Only equipped entries plus chassis base affect active stats and installed visuals; board/inventory parts contribute nothing and merging must not consume/modify equipped parts implicitly.

Continuous state must represent physical checkpoint progression/unlocks, selected Progress/Push or Farm target, fuel/attempt state, equipped stats and reward/first-clear state independently of graphics. A Scrap Pile can be the first VS1 checkpoint type. Each checkpoint conceptually has repeatable Scrap and a one-time first-clear bonus (possibly parts). Farther normally pays more per successful clear, but not necessarily more Scrap/time; earlier unlocked checkpoint farming remains player-selected.

This is a conceptual contract, not a new TypeScript/save schema. Board shape/dimensions/capacity/expansion, exact Inventory capacity, reward values/drop tables, fuel values, checkpoint distances, offline formula/cap, automation unlocks, selection UI and acquisition probabilities/economy remain TBD. Later schema work must conserve ownership, first-clear eligibility and selected intent and migrate known v1 saves explicitly; do not invent fields or increment the version here.

## 1. Existing implementation data schemas (v1)

```typescript
type PartFamily = 'engine' | 'fuel' | 'cooling' | 'tires' | 'suspension';

interface PartDefinition {
  id: string; // e.g., 'engine_t1'
  family: PartFamily;
  tier: 1 | 2 | 3;
  name: string;
  stats: {
    power?: number;
    fuelCapacity?: number;
    cooling?: number;
    durability?: number;
    weight?: number;
  };
}

interface ChassisDefinition {
  id: string;
  name: string;
  baseStats: {
    power: number;
    fuelCapacity: number;
    cooling: number;
    durability: number;
    weight: number;
    maxHeat: number; // Fixed chassis property; does not change with installed parts in VS1
  };
  slots: PartFamily[]; // The required categorical slots
}

interface VehicleStats {
  power: number;
  fuelCapacity: number;
  cooling: number;
  durability: number;
  weight: number;
  maxHeat: number;
}

interface RoadSegment {
  startDistance: number;
  endDistance: number; // Infinity only for the final segment (static TS data, never JSON save data)
  name: string;
  loadFactor: number; // Multiplier for heat/fuel
  roughness: number;  // Damage over time modifier
}

// Increment CURRENT_SAVE_VERSION whenever the schema changes. Migration functions
// must handle all supported released prior versions; v1 is the only released schema now. Never read a save without checking this field.
const CURRENT_SAVE_VERSION = 1;

interface SaveData {
  version: number;                              // Must equal CURRENT_SAVE_VERSION
  scrap: number;                                // Current Scrap balance (integer, >= 0)
  inventory: string[];                          // Array of part IDs (e.g., ['engine_t1', 'fuel_t1']). Currently unbounded; future capacity TBD. May contain duplicates. No Merge Board field in v1.
  installedParts: Record<PartFamily, string | null>; // null = slot is empty
  bestDistance: number;                         // metres (float, >= 0)
}
```

## 2. Initial Content (VS1)

### Chassis
- **ID:** `chassis_rustbucket`
- **Name:** The Rustbucket
- **Base Stats:** Power: 10, Fuel: 20, Cooling: 5, Durability: 50, Weight: 100, MaxHeat: 100
- **Slots:** engine, fuel, cooling, tires, suspension

### Parts
*(Stats are additive to base)*

**Family: Engine (Provides Power, adds Weight)**
- `engine_t1`: Rusty Motor (Tier 1) - Power: +10, Weight: +10
- `engine_t2`: Salvaged V6 (Tier 2) - Power: +25, Weight: +15
- `engine_t3`: Rebuilt V8 (Tier 3) - Power: +60, Weight: +25

**Family: Fuel (Provides Fuel Capacity, adds Weight)**
- `fuel_t1`: Leaky Jerrycan (Tier 1) - Fuel: +20, Weight: +5
- `fuel_t2`: Welded Drum (Tier 2) - Fuel: +50, Weight: +10
- `fuel_t3`: Custom Tank (Tier 3) - Fuel: +120, Weight: +15

**Family: Cooling (Provides Cooling)**
- `cooling_t1`: Bent Fan (Tier 1) - Cooling: +10
- `cooling_t2`: Scavenged Radiator (Tier 2) - Cooling: +25
- `cooling_t3`: Dual-Fan Array (Tier 3) - Cooling: +60

**Family: Tires (Provides Durability buffer)**
- `tires_t1`: Bald Tires (Tier 1) - Durability: +10
- `tires_t2`: Patched Rubber (Tier 2) - Durability: +30
- `tires_t3`: Off-road Treads (Tier 3) - Durability: +70

**Family: Suspension (Provides Durability buffer)**
- `suspension_t1`: Rusted Springs (Tier 1) - Durability: +10
- `suspension_t2`: Stiff Shocks (Tier 2) - Durability: +30
- `suspension_t3`: Heavy Duty Leaf (Tier 3) - Durability: +70

### Existing provisional economy (requires continuous-model adaptation)
- **Scavenge Cost:** 10 Scrap (Gives 1 random Tier 1 part).
- **Existing discrete-run reward (superseded design):** 5 Scrap guaranteed + 1 Scrap per 10m driven. This unchanged runtime formula is not the future checkpoint payout; repeat Scrap and first-clear bonuses require future implementation and balance.
- **Merge Cost:** 0 (Free).

### Existing provisional road segments: Scrapland Highway
- **ID:** `road_scrapland_highway`
- **0 - 100m (Outskirts):** LoadFactor: 1.0, Roughness: 0
- **100 - 300m (Cracked Pavement):** LoadFactor: 1.2, Roughness: 1
- **300 - 600m (Dirt Incline):** LoadFactor: 1.5, Roughness: 3
- **600m+ (Steep Rocky Pass):** LoadFactor: 2.0, Roughness: 5

*Note: Existing balance values are starting estimates, not approved exact fuel numbers, checkpoint distances or acquisition economy. Terrain boundaries are not checkpoint placements.*

### Save Loading, Decoding and Recovery

The v1 disk schema and primary key `scr_save_v1` remain compatible. Decoder output is always newly constructed canonical data; unknown root/slot fields are removed. Scrap is a nonnegative safe integer. Best distance is finite, nonnegative and at most Number.MAX_SAFE_INTEGER. Inventory retains only known string IDs (including legitimate duplicates). Each of the five installed keys must be null or a known matching-family ID. Known wrong-family entries transfer that exact owned copy to inventory and clear the slot; unknown IDs/types clear only the invalid ownership entry. Missing/malformed fields use zero/empty/null defaults, never invented starter parts.

| Scenario | Behavior |
|---|---|
| Primary key absent | Create canonical new state with the two starter inventory items; service queues its initial save |
| Storage read rejects | Initialization fails and may retry; never pretend the save is absent |
| Canonical v1 | Decode into fresh canonical data; retain valid progress |
| Damaged/missing-field v1 | Salvage valid fields and known ownership; preserve raw backup before writing repair |
| Invalid JSON/non-object JSON | Preserve raw backup, then recover empty progress; do not invent ownership |
| Unsupported/missing version (including 0, 0.5, 2, 99999) | Preserve raw backup and leave primary untouched; progress commands blocked until explicit reset |
| Backup write fails | Reject initialization; never replace the primary |
| Repair write fails | Reject initialization; primary/raw backup remain recoverable for retry |
| Explicit reset | Invalidate active run, replace live progress, serialize remove + canonical new write; retain recovery backup |

Backup key: `scr_save_recovery_v1`. It holds one latest raw damaged/unsupported value, bounded in count rather than an accumulating backup history. A repeated successful recovery load reads the repaired primary and does not overwrite that backup. It is not an export system or a guaranteed cloud backup; quota can prevent backup creation and storage clearing can erase both keys.

Only v1 is currently supported; no known older released schema exists to migrate. Do not accept an arbitrary lower version by casting it. When introducing v2, implement explicit migrations for known supported old versions and revalidate canonical semantics. Unsupported versions remain preserved until a supported implementation or explicit player reset handles them.

Provisional run coefficients are centralized in `src/domain/run/balance.ts`; see D02 §10 for existing-runtime equations and measured builds, not continuous checkpoint balance. The final road end uses Infinity only in static definitions; save JSON contains no Infinity sentinel.
