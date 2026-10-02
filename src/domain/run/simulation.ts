/**
 * domain/run/simulation.ts
 *
 * Pure simulation tick function. No Phaser. No DOM. No side effects.
 *
 * Canonical formula source: docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md §3
 *
 * All formulas operate on per-second rates multiplied by dt (seconds).
 * The Phaser RunScene calls this once per update() frame:
 *
 *   const dt = deltaMs / 1000;
 *   runState = advanceSimulation(runState, vehicleStats, road, dt);
 */

import type {
  RunState,
  VehicleStats,
  RoadDefinition,
  RoadSegment,
  FailureCause,
} from '@/types/game';
import { SIMULATION_BALANCE } from './balance';

// ---------------------------------------------------------------------------
// Road segment lookup
// ---------------------------------------------------------------------------

/**
 * Returns the road segment active at the given distance.
 * Segments must be ordered by startDistance ascending.
 */
export function getActiveSegment(
  road: RoadDefinition,
  distance: number,
): RoadSegment {
  // Walk from the last segment backwards — typical case is the current
  // or previous segment, so this is O(n) but n is small (≤ 10 in practice).
  for (let i = road.segments.length - 1; i >= 0; i--) {
    const seg = road.segments[i];
    if (seg !== undefined && distance >= seg.startDistance) return seg;
  }
  // Fallback to first segment if distance is somehow negative
  const first = road.segments[0];
  if (first === undefined) throw new Error('Road has no segments');
  return first;
}

// ---------------------------------------------------------------------------
// Core simulation tick
// ---------------------------------------------------------------------------

/**
 * Advance the run simulation by dt seconds.
 *
 * Returns a new RunState (immutable update). Returns the same object if the
 * run has already ended (failureCause is set).
 *
 * Formulas (all rates are per-second, multiplied by dt):
 *   speed     = power / weight                        [m/s]
 *   distance  += speed * dt                           [m]
 *   heatDelta  = (power * loadFactor) - cooling       [heat/s]
 *   heat       = clamp(heat + heatDelta * dt, 0, maxHeat)
 *   fuel       = max(0, fuel - (power * loadFactor / 10) * dt)
 *   durability = max(0, durability - roughness * dt)
 */
export function advanceSimulation(
  state:   RunState,
  stats:   VehicleStats,
  road:    RoadDefinition,
  dt:      number,         // seconds elapsed since last frame
): RunState {
  // If the run is already over, return unchanged state
  if (state.failureCause !== null) return state;

  const seg = getActiveSegment(road, state.distance);

  // --- Compute rates -------------------------------------------------------
  const speed     = (stats.power / stats.weight) / SIMULATION_BALANCE.SPEED_DIVISOR;
  const heatDelta = (stats.power * seg.loadFactor * SIMULATION_BALANCE.HEAT_GENERATION_MULTIPLIER) - stats.cooling;
  const fuelBurn  = (stats.power * seg.loadFactor) / SIMULATION_BALANCE.FUEL_BURN_DIVISOR;

  // --- Apply delta ---------------------------------------------------------
  const newDistance    = state.distance + speed * dt;
  const newHeat        = Math.max(0, Math.min(stats.maxHeat, state.heat + heatDelta * dt));
  const newFuel        = Math.max(0, state.fuel - fuelBurn * dt);
  const newDurability  = Math.max(0, state.durability - seg.roughness * dt);

  // --- Failure detection (evaluated in priority order) ---------------------
  let failureCause: FailureCause | null = null;
  if (newFuel <= 0)              failureCause = 'out_of_gas';
  else if (newHeat >= stats.maxHeat) failureCause = 'overheated';
  else if (newDurability <= 0)   failureCause = 'breakdown';

  return {
    distance:      newDistance,
    fuel:          newFuel,
    heat:          newHeat,
    durability:    newDurability,
    maxDurability: state.maxDurability,
    failureCause,
  };
}

// ---------------------------------------------------------------------------
// Run initialisation
// ---------------------------------------------------------------------------

/**
 * Creates the initial RunState for a new run.
 * Called by RunScene before the first advanceSimulation tick.
 */
export function createRunState(stats: VehicleStats): RunState {
  return {
    distance:      0,
    fuel:          stats.fuelCapacity,
    heat:          0,
    durability:    stats.durability,
    maxDurability: stats.durability,
    failureCause:  null,
  };
}
