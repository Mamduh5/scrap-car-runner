# Game Data Bible

This document defines the data schemas and initial content for Vertical Slice 1 (VS1).

## 1. Data Schemas

```typescript
type PartFamily = 'engine' | 'fuel' | 'cooling' | 'tires' | 'suspension';

interface PartDefinition {
  id: string; // e.g., 'engine_t1'
  family: PartFamily;
  tier: number;
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
  endDistance: number; // -1 for infinite
  name: string;
  loadFactor: number; // Multiplier for heat/fuel
  roughness: number;  // Damage over time modifier
}

interface SaveData {
  version: number;
  scrap: number;
  inventory: string[]; // Array of Part IDs
  installedParts: Record<PartFamily, string | null>;
  bestDistance: number;
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

### Economy
- **Scavenge Cost:** 10 Scrap (Gives 1 random Tier 1 part).
- **Run Reward:** 5 Scrap guaranteed + 1 Scrap per 10m driven.
- **Merge Cost:** 0 (Free).

### The First Road: Scrapland Highway
- **0 - 500m (Outskirts):** LoadFactor: 1.0, Roughness: 0
- **500 - 1500m (Cracked Pavement):** LoadFactor: 1.2, Roughness: 1
- **1500 - 3000m (Dirt Incline):** LoadFactor: 1.5, Roughness: 3
- **3000m+ (Steep Rocky Pass):** LoadFactor: 2.0, Roughness: 5

*Note: Balance values are starting estimates and will require playtesting.*
