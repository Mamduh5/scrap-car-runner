/**
 * domain/run/balance.ts
 *
 * Balance constants for run simulation.
 * These are provisional and should be tuned during playtesting.
 * Structure/schemas are production-ready; these specific numbers are not.
 */

export const SIMULATION_BALANCE = {
  /** Divisor for fuel consumption calculation. Higher = less fuel burned per second. */
  FUEL_BURN_DIVISOR: 10,
  
  /** Divisor for distance/speed calculation. Scales vehicle speed output. */
  SPEED_DIVISOR: 1,
  
  /** Multiplier for heat accumulation. */
  HEAT_GENERATION_MULTIPLIER: 1.0,

  /** Base Scrap reward for simply starting a run. */
  BASE_REWARD: 5,
  
  /** Distance divisor for Scrap reward. 1 Scrap per X metres. */
  DISTANCE_REWARD_DIVISOR: 10,
};
