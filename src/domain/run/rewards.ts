import type { RunState } from '@/types/game';
import { SIMULATION_BALANCE } from './balance';

/**
 * Calculates the Scrap reward for a completed run.
 * Formula: BASE_REWARD + floor(Distance / DISTANCE_REWARD_DIVISOR)
 */
export function calculateRunReward(state: RunState): number {
  return SIMULATION_BALANCE.BASE_REWARD + Math.floor(state.distance / SIMULATION_BALANCE.DISTANCE_REWARD_DIVISOR);
}
