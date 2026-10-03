import type { RunState } from '@/types/game';
import { SIMULATION_BALANCE } from './balance';

/** Called only after the service has validated and consumed a completed session. */
export function calculateRunReward(state: RunState): number {
  if (!Number.isFinite(state.distance) || state.distance < 0 || state.distance > Number.MAX_SAFE_INTEGER) {
    throw new RangeError('Invalid reward distance');
  }
  const quotient = state.distance / SIMULATION_BALANCE.DISTANCE_REWARD_DIVISOR;
  const nearest = Math.round(quotient);
  const stable = Math.abs(quotient - nearest) <= 8 * Number.EPSILON * Math.max(1, Math.abs(quotient)) ? nearest : quotient;
  const reward = SIMULATION_BALANCE.BASE_REWARD + Math.floor(stable);
  if (!Number.isSafeInteger(reward)) throw new RangeError('Reward overflow');
  return reward;
}
