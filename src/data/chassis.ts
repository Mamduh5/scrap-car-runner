/**
 * data/chassis.ts — Static chassis definitions for VS1
 *
 * Canonical source: docs/03_GAME_DATA_BIBLE.md §Chassis
 *
 * Do NOT change IDs. IDs are stored in player save data.
 */

import type { ChassisDefinition } from '@/types/game';

/** The single chassis used in VS1 */
export const RUSTBUCKET: ChassisDefinition = {
  id:   'chassis_rustbucket',
  name: 'The Rustbucket',
  baseStats: {
    power:        10,
    fuelCapacity: 20,
    cooling:       5,
    durability:   50,
    weight:      100,
    maxHeat:     100,
  },
  slots: ['engine', 'fuel', 'cooling', 'tires', 'suspension'],
} as const;

export const CHASSIS_LIST: readonly ChassisDefinition[] = [RUSTBUCKET] as const;

/** Lookup map for O(1) chassis access by ID */
export const CHASSIS_BY_ID: ReadonlyMap<string, ChassisDefinition> = new Map(
  CHASSIS_LIST.map((c) => [c.id, c]),
);

