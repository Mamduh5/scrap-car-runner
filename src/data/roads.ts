/**
 * data/roads.ts — Static road definitions for VS1
 *
 * Canonical source: docs/03_GAME_DATA_BIBLE.md §Roads
 *
 * IMPORTANT: The final segment must use endDistance: Infinity (not -1).
 * The simulation uses Infinity comparisons; -1 is not a valid sentinel here.
 */

import type { RoadDefinition } from '@/types/game';

/** The single road used in VS1 */
export const SCRAPLAND_HIGHWAY: RoadDefinition = {
  id:   'road_scrapland_highway',
  name: 'Scrapland Highway',
  segments: [
    {
      name:          'Outskirts',
      startDistance:    0,
      endDistance:    100,
      loadFactor:     1.0,
      roughness:      0,
    },
    {
      name:          'Cracked Pavement',
      startDistance:  100,
      endDistance:   300,
      loadFactor:     1.2,
      roughness:      1,
    },
    {
      name:          'Dirt Incline',
      startDistance: 300,
      endDistance:   600,
      loadFactor:    1.5,
      roughness:     3,
    },
    {
      name:          'Steep Rocky Pass',
      startDistance: 600,
      endDistance:   Infinity, // Final segment: no upper bound
      loadFactor:    2.0,
      roughness:     5,
    },
  ],
} as const;

export const ROADS: readonly RoadDefinition[] = [SCRAPLAND_HIGHWAY] as const;

/** Lookup map for O(1) road access by ID */
export const ROADS_BY_ID: ReadonlyMap<string, RoadDefinition> = new Map(
  ROADS.map((r) => [r.id, r]),
);

