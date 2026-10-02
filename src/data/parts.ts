/**
 * data/parts.ts — Static part definitions for VS1
 *
 * Canonical source: docs/03_GAME_DATA_BIBLE.md §Parts
 * All stats are additive bonuses applied to the chassis base stats.
 *
 * Do NOT change IDs. IDs are stored in player save data.
 */

import type { PartDefinition } from '@/types/game';

export const PARTS: readonly PartDefinition[] = [
  // -------------------------------------------------------------------------
  // Engine family — provides Power, adds Weight
  // -------------------------------------------------------------------------
  {
    id:     'engine_t1',
    family: 'engine',
    tier:   1,
    name:   'Rusty Motor',
    stats:  { power: 10, weight: 10 },
  },
  {
    id:     'engine_t2',
    family: 'engine',
    tier:   2,
    name:   'Salvaged V6',
    stats:  { power: 25, weight: 15 },
  },
  {
    id:     'engine_t3',
    family: 'engine',
    tier:   3,
    name:   'Rebuilt V8',
    stats:  { power: 60, weight: 25 },
  },

  // -------------------------------------------------------------------------
  // Fuel family — provides Fuel Capacity, adds Weight
  // -------------------------------------------------------------------------
  {
    id:     'fuel_t1',
    family: 'fuel',
    tier:   1,
    name:   'Leaky Jerrycan',
    stats:  { fuelCapacity: 20, weight: 5 },
  },
  {
    id:     'fuel_t2',
    family: 'fuel',
    tier:   2,
    name:   'Welded Drum',
    stats:  { fuelCapacity: 50, weight: 10 },
  },
  {
    id:     'fuel_t3',
    family: 'fuel',
    tier:   3,
    name:   'Custom Tank',
    stats:  { fuelCapacity: 120, weight: 15 },
  },

  // -------------------------------------------------------------------------
  // Cooling family — provides Cooling
  // -------------------------------------------------------------------------
  {
    id:     'cooling_t1',
    family: 'cooling',
    tier:   1,
    name:   'Bent Fan',
    stats:  { cooling: 10 },
  },
  {
    id:     'cooling_t2',
    family: 'cooling',
    tier:   2,
    name:   'Scavenged Radiator',
    stats:  { cooling: 25 },
  },
  {
    id:     'cooling_t3',
    family: 'cooling',
    tier:   3,
    name:   'Dual-Fan Array',
    stats:  { cooling: 60 },
  },

  // -------------------------------------------------------------------------
  // Tires family — adds Durability HP pool
  // Note: Tires do NOT reduce damage rate; they increase the HP pool.
  // See docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md §3 for rationale.
  // -------------------------------------------------------------------------
  {
    id:     'tires_t1',
    family: 'tires',
    tier:   1,
    name:   'Bald Tires',
    stats:  { durability: 10 },
  },
  {
    id:     'tires_t2',
    family: 'tires',
    tier:   2,
    name:   'Patched Rubber',
    stats:  { durability: 30 },
  },
  {
    id:     'tires_t3',
    family: 'tires',
    tier:   3,
    name:   'Off-road Treads',
    stats:  { durability: 70 },
  },

  // -------------------------------------------------------------------------
  // Suspension family — adds Durability HP pool
  // -------------------------------------------------------------------------
  {
    id:     'suspension_t1',
    family: 'suspension',
    tier:   1,
    name:   'Rusted Springs',
    stats:  { durability: 10 },
  },
  {
    id:     'suspension_t2',
    family: 'suspension',
    tier:   2,
    name:   'Stiff Shocks',
    stats:  { durability: 30 },
  },
  {
    id:     'suspension_t3',
    family: 'suspension',
    tier:   3,
    name:   'Heavy Duty Leaf',
    stats:  { durability: 70 },
  },
] as const;

/** Lookup map for O(1) part access by ID */
export const PARTS_BY_ID: ReadonlyMap<string, PartDefinition> = new Map(
  PARTS.map((p) => [p.id, p]),
);
