/**
 * types/game.ts — Canonical TypeScript types for Scrap Car Runner
 *
 * This file is the single source of truth for all game-domain types.
 * It must stay in sync with docs/03_GAME_DATA_BIBLE.md.
 *
 * Rule: never import Phaser types here. These types must remain usable
 * in pure Node.js tests and tools/simulate.ts without a browser.
 */

// ---------------------------------------------------------------------------
// Part families — must match PartFamily union in the Data Bible
// ---------------------------------------------------------------------------

export type PartFamily =
  | 'engine'
  | 'fuel'
  | 'cooling'
  | 'tires'
  | 'suspension';

export const PART_FAMILIES: readonly PartFamily[] = [
  'engine',
  'fuel',
  'cooling',
  'tires',
  'suspension',
] as const;

// ---------------------------------------------------------------------------
// Part stats — all optional because parts may contribute to only some stats
// ---------------------------------------------------------------------------

export interface PartStats {
  readonly power?:        number;
  readonly fuelCapacity?: number;
  readonly cooling?:      number;
  readonly durability?:   number;
  readonly weight?:       number;
}

// ---------------------------------------------------------------------------
// Part definition — static data, never mutated at runtime
// ---------------------------------------------------------------------------

export interface PartDefinition {
  readonly id:     string;       // e.g. 'engine_t1'
  readonly family: PartFamily;
  readonly tier:   1 | 2 | 3;   // VS1 max tier is 3
  readonly name:   string;
  readonly stats:  PartStats;
}

// ---------------------------------------------------------------------------
// Chassis — static data, never mutated at runtime
// ---------------------------------------------------------------------------

export interface ChassisBaseStats {
  readonly power:        number;
  readonly fuelCapacity: number;
  readonly cooling:      number;
  readonly durability:   number;
  readonly weight:       number;
  readonly maxHeat:      number; // Fixed per chassis; not modified by installed parts in VS1
}

export interface ChassisDefinition {
  readonly id:        string;    // e.g. 'chassis_rustbucket'
  readonly name:      string;
  readonly baseStats: ChassisBaseStats;
  readonly slots:     readonly PartFamily[]; // Ordered list of categorical slots
}

// ---------------------------------------------------------------------------
// Vehicle stats — computed at run start from chassis + installed parts
// ---------------------------------------------------------------------------

export interface VehicleStats {
  readonly power:        number;
  readonly fuelCapacity: number;
  readonly cooling:      number;
  readonly durability:   number;   // Used as MaxDurability at run start
  readonly weight:       number;
  readonly maxHeat:      number;
}

// ---------------------------------------------------------------------------
// Road
// ---------------------------------------------------------------------------

export interface RoadSegment {
  readonly startDistance: number;  // metres
  readonly endDistance:   number;  // metres; use Infinity for the final segment
  readonly name:          string;
  readonly loadFactor:    number;  // Multiplier applied to heat generation and fuel consumption
  readonly roughness:     number;  // Durability damage per second
}

export interface RoadDefinition {
  readonly id:       string;       // e.g. 'road_scrapland_highway'
  readonly name:     string;
  readonly segments: readonly RoadSegment[];
}

// ---------------------------------------------------------------------------
// Run state — ephemeral; owned by RunScene; never persisted
// ---------------------------------------------------------------------------

export type FailureCause =
  | 'out_of_gas'
  | 'overheated'
  | 'breakdown'
  | 'abandoned';

export interface RunState {
  distance:      number;   // metres accumulated this run
  fuel:          number;   // current (0 .. fuelCapacity)
  heat:          number;   // current (0 .. maxHeat)
  durability:    number;   // current (0 .. maxDurability)
  maxDurability: number;   // snapshot at run start; constant during run
  failureCause:  FailureCause | null;
}

// ---------------------------------------------------------------------------
// Save data — serialised to localStorage
// ---------------------------------------------------------------------------

export interface InstalledParts extends Record<PartFamily, string | null> {
  engine:     string | null;
  fuel:       string | null;
  cooling:    string | null;
  tires:      string | null;
  suspension: string | null;
}

export interface SaveData {
  version:        number;         // Must equal CURRENT_SAVE_VERSION
  scrap:          number;         // Current Scrap (integer, >= 0)
  inventory:      string[];       // Part IDs; unbounded in VS1; may contain duplicates
  installedParts: InstalledParts; // null = slot is empty
  bestDistance:   number;         // Metres (float, >= 0)
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Increment this whenever SaveData changes.
 * Write a migration function for every prior version.
 */
export const CURRENT_SAVE_VERSION = 1 as const;

/** VS1 save keys stay compatible; slot targets need not equal families in future schemas. */
export type SlotId = PartFamily;

export interface SaveSnapshot {
  readonly version: number;
  readonly scrap: number;
  readonly inventory: readonly string[];
  readonly installedParts: Readonly<InstalledParts>;
  readonly bestDistance: number;
}

export const MAX_TIER = 3 as const;

/** Warning thresholds from docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md §3 */
export const WARNING_THRESHOLDS = {
  LOW_FUEL_RATIO:          0.20,
  HIGH_HEAT_RATIO:         0.80,
  CRITICAL_DURABILITY_RATIO: 0.20,
} as const;
