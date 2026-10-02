/**
 * domain/run/simulation.test.ts
 *
 * Unit tests for the simulation tick and run lifecycle.
 */

import { describe, it, expect } from 'vitest';
import { advanceSimulation, createRunState, getActiveSegment } from './simulation';
import { SCRAPLAND_HIGHWAY } from '@/data/roads';
import type { VehicleStats, RunState } from '@/types/game';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeStats(overrides: Partial<VehicleStats> = {}): VehicleStats {
  return {
    power:        20,
    fuelCapacity: 40,
    cooling:      15,
    durability:   70,
    weight:       115,
    maxHeat:      100,
    ...overrides,
  };
}

const road = SCRAPLAND_HIGHWAY;

// ---------------------------------------------------------------------------
// getActiveSegment
// ---------------------------------------------------------------------------

describe('getActiveSegment', () => {
  it('returns the first segment at distance 0', () => {
    const seg = getActiveSegment(road, 0);
    expect(seg.name).toBe('Outskirts');
  });

  it('returns the correct segment at segment boundary 500', () => {
    const seg = getActiveSegment(road, 500);
    expect(seg.name).toBe('Cracked Pavement');
  });

  it('returns the last segment beyond max boundary', () => {
    const seg = getActiveSegment(road, 99999);
    expect(seg.name).toBe('Steep Rocky Pass');
  });
});

// ---------------------------------------------------------------------------
// createRunState
// ---------------------------------------------------------------------------

describe('createRunState', () => {
  it('initialises distance and heat to 0', () => {
    const stats = makeStats();
    const state = createRunState(stats);
    expect(state.distance).toBe(0);
    expect(state.heat).toBe(0);
    expect(state.failureCause).toBeNull();
  });

  it('initialises fuel to fuelCapacity', () => {
    const stats = makeStats({ fuelCapacity: 60 });
    const state = createRunState(stats);
    expect(state.fuel).toBe(60);
  });

  it('sets maxDurability equal to initial durability', () => {
    const stats = makeStats({ durability: 80 });
    const state = createRunState(stats);
    expect(state.maxDurability).toBe(80);
    expect(state.durability).toBe(80);
  });
});

// ---------------------------------------------------------------------------
// advanceSimulation
// ---------------------------------------------------------------------------

describe('advanceSimulation', () => {
  it('increases distance each tick', () => {
    const stats = makeStats();
    const state = createRunState(stats);
    const next  = advanceSimulation(state, stats, road, 1.0);
    expect(next.distance).toBeGreaterThan(0);
  });

  it('decreases fuel each tick', () => {
    const stats = makeStats();
    const state = createRunState(stats);
    const next  = advanceSimulation(state, stats, road, 1.0);
    expect(next.fuel).toBeLessThan(state.fuel);
  });

  it('does not go below 0 for any stat', () => {
    const stats = makeStats({ fuelCapacity: 0.001 });
    let state: RunState = createRunState(stats);
    for (let i = 0; i < 100; i++) {
      state = advanceSimulation(state, stats, road, 0.016);
      if (state.failureCause !== null) break;
    }
    expect(state.fuel).toBeGreaterThanOrEqual(0);
    expect(state.heat).toBeGreaterThanOrEqual(0);
    expect(state.durability).toBeGreaterThanOrEqual(0);
  });

  it('detects out_of_gas failure', () => {
    const stats = makeStats({ fuelCapacity: 0.01, cooling: 9999 });
    let state: RunState = createRunState(stats);
    for (let i = 0; i < 10000; i++) {
      state = advanceSimulation(state, stats, road, 0.016);
      if (state.failureCause !== null) break;
    }
    expect(state.failureCause).toBe('out_of_gas');
  });

  it('detects overheated failure', () => {
    const stats = makeStats({ power: 9999, cooling: 0, fuelCapacity: 9999 });
    let state: RunState = createRunState(stats);
    for (let i = 0; i < 10000; i++) {
      state = advanceSimulation(state, stats, road, 0.016);
      if (state.failureCause !== null) break;
    }
    expect(state.failureCause).toBe('overheated');
  });

  it('detects breakdown failure in the rocky segment', () => {
    const stats = makeStats({ durability: 0.01, fuelCapacity: 9999, cooling: 9999 });
    const state: RunState = {
      distance:      3001,
      fuel:          9999,
      heat:          0,
      durability:    0.01,
      maxDurability: 0.01,
      failureCause:  null,
    };
    const next = advanceSimulation(state, stats, road, 1.0);
    expect(next.failureCause).toBe('breakdown');
  });

  it('does not tick further after failure', () => {
    const failedState: RunState = {
      distance:      100,
      fuel:          0,
      heat:          0,
      durability:    50,
      maxDurability: 70,
      failureCause:  'out_of_gas',
    };
    const stats = makeStats();
    const next = advanceSimulation(failedState, stats, road, 1.0);
    expect(next.distance).toBe(100);
    expect(next.failureCause).toBe('out_of_gas');
  });

  it('clamps heat between 0 and maxHeat', () => {
    const stats = makeStats({ power: 9999, cooling: 0, fuelCapacity: 9999, maxHeat: 100 });
    let state: RunState = createRunState(stats);
    for (let i = 0; i < 200; i++) {
      state = advanceSimulation(state, stats, road, 0.016);
      expect(state.heat).toBeGreaterThanOrEqual(0);
      expect(state.heat).toBeLessThanOrEqual(stats.maxHeat);
      if (state.failureCause !== null) break;
    }
  });
});
