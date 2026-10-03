/** Pure analytical foreground simulation; no browser or Phaser dependencies. */
import type { RunState, VehicleStats, RoadDefinition, RoadSegment } from '@/types/game';
import { SIMULATION_BALANCE } from './balance';

export const MAX_FOREGROUND_DELTA_SECONDS = 1;
const epsilon = (value: number): number => 32 * Number.EPSILON * Math.max(1, Math.abs(value));

export function validateVehicleStats(stats: VehicleStats): void {
  for (const value of Object.values(stats)) {
    if (!Number.isFinite(value) || value < 0 || value > Number.MAX_SAFE_INTEGER) throw new RangeError('Invalid vehicle stats');
  }
  if (!(stats.weight > 0) || !(stats.maxHeat > 0)) throw new RangeError('Weight and max heat must be positive');
}

export function isValidRunState(state: unknown, stats: VehicleStats): state is RunState {
  if (typeof state !== 'object' || state === null || Array.isArray(state)) return false;
  const value = state as Record<string, unknown>;
  const bounded = (number: unknown, max: number): boolean => typeof number === 'number'
    && Number.isFinite(number) && number >= 0 && number <= max;
  return bounded(value['distance'], Number.MAX_SAFE_INTEGER)
    && bounded(value['fuel'], stats.fuelCapacity) && bounded(value['heat'], stats.maxHeat)
    && bounded(value['durability'], stats.durability) && value['maxDurability'] === stats.durability
    && new Set<unknown>([null, 'out_of_gas', 'overheated', 'breakdown', 'abandoned']).has(value['failureCause']);
}

export function getActiveSegment(road: RoadDefinition, distance: number): RoadSegment {
  if (!Number.isFinite(distance) || distance < 0) throw new RangeError('Invalid distance');
  const segment = road.segments.find(seg => distance >= seg.startDistance && distance < seg.endDistance);
  if (!segment) throw new RangeError('Road does not cover distance');
  return segment;
}

export function createRunState(stats: VehicleStats): RunState {
  validateVehicleStats(stats);
  return { distance: 0, fuel: stats.fuelCapacity, heat: 0, durability: stats.durability,
    maxDurability: stats.durability, failureCause: null };
}

/** Excess stalled time is discarded; offline progression is a separate future system. */
export function advanceSimulation(state: RunState, stats: VehicleStats, road: RoadDefinition, dt: number): RunState {
  if (!Number.isFinite(dt) || dt < 0) throw new RangeError('Delta must be finite and nonnegative');
  validateVehicleStats(stats);
  if (!isValidRunState(state, stats)) throw new RangeError('Invalid run state');
  if (dt === 0 || state.failureCause !== null) return state;
  const next = { ...state };
  let remaining = Math.min(dt, MAX_FOREGROUND_DELTA_SECONDS);
  const speed = stats.power / stats.weight / SIMULATION_BALANCE.SPEED_DIVISOR;
  if (!Number.isFinite(speed)) throw new RangeError('Invalid speed');
  // Each iteration reaches a road boundary or finishes the accepted interval.
  for (let crossings = 0; remaining > 0; crossings++) {
    if (crossings > road.segments.length) throw new RangeError('Invalid road boundaries');
    const seg = getActiveSegment(road, next.distance);
    if (!Number.isFinite(seg.loadFactor) || seg.loadFactor <= 0 || !Number.isFinite(seg.roughness) || seg.roughness < 0) {
      throw new RangeError('Invalid road rates');
    }
    const fuelRate = stats.power * seg.loadFactor / SIMULATION_BALANCE.FUEL_BURN_DIVISOR;
    const heatRate = stats.power * seg.loadFactor * SIMULATION_BALANCE.HEAT_GENERATION_MULTIPLIER - stats.cooling;
    if (!Number.isFinite(fuelRate) || !Number.isFinite(heatRate)) throw new RangeError('Rate overflow');
    const fuelTime = next.fuel === 0 ? 0 : fuelRate > 0 ? next.fuel / fuelRate : Infinity;
    const heatTime = next.heat === stats.maxHeat ? 0 : heatRate > 0 ? (stats.maxHeat - next.heat) / heatRate : Infinity;
    const durabilityTime = next.durability === 0 ? 0 : seg.roughness > 0 ? next.durability / seg.roughness : Infinity;
    const boundaryTime = speed > 0 ? (seg.endDistance - next.distance) / speed : Infinity;
    const step = Math.min(remaining, fuelTime, heatTime, durabilityTime, boundaryTime);
    const reached = (time: number): boolean => Number.isFinite(time) && Math.abs(time - step) <= epsilon(step);
    next.distance += speed * step;
    next.fuel = Math.max(0, next.fuel - fuelRate * step);
    next.heat = Math.max(0, Math.min(stats.maxHeat, next.heat + heatRate * step));
    next.durability = Math.max(0, next.durability - seg.roughness * step);
    if (reached(boundaryTime)) next.distance = seg.endDistance;
    // Priority only breaks numerical ties; it never overrides an earlier failure.
    if (reached(fuelTime)) { next.fuel = 0; next.failureCause = 'out_of_gas'; }
    else if (reached(heatTime)) { next.heat = stats.maxHeat; next.failureCause = 'overheated'; }
    else if (reached(durabilityTime)) { next.durability = 0; next.failureCause = 'breakdown'; }
    if (!Number.isFinite(next.distance) || next.distance > Number.MAX_SAFE_INTEGER) throw new RangeError('Distance overflow');
    if (next.failureCause !== null) return next;
    remaining = Math.max(0, remaining - step);
  }
  return next;
}
