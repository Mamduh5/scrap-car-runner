/**
 * domain/run/rewards.ts
 *
 * Pure reward calculation. No Phaser. No side effects.
 *
 * Canonical formula: docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md §5
 *   Scrap Earned = BASE_REWARD + Floor(distance / DISTANCE_DIVISOR)
 *
 * The minimum reward (BASE_REWARD) prevents soft-lock: a player with 0 Scrap
 * will always earn enough to Scavenge at least once after 2 runs.
 */

import type { RunState } from '@/types/game';

const BASE_REWARD      = 5;   // Scrap guaranteed per run
const DISTANCE_DIVISOR = 10;  // 1 Scrap per 10 metres

/**
 * Calculate the Scrap reward for a completed (or abandoned) run.
 *
 * @param state - The final RunState after the run ended
 * @returns     - Scrap amount earned (integer, >= BASE_REWARD)
 */
export function calculateRunReward(state: RunState): number {
  return BASE_REWARD + Math.floor(state.distance / DISTANCE_DIVISOR);
}
