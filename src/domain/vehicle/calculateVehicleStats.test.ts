/**
 * domain/vehicle/calculateVehicleStats.test.ts
 *
 * Unit tests for the vehicle stat calculation.
 * Uses the canonical data from src/data/ to verify real game values.
 */

import { describe, it, expect } from 'vitest';
import { calculateVehicleStats } from './calculateVehicleStats';
import { RUSTBUCKET } from '@/data/chassis';
import { PARTS_BY_ID } from '@/data/parts';
import type { ChassisDefinition } from '@/types/game';

describe('calculateVehicleStats', () => {

  it('returns chassis base stats when no parts are installed', () => {
    const stats = calculateVehicleStats(RUSTBUCKET, []);
    expect(stats.power).toBe(10);
    expect(stats.fuelCapacity).toBe(20);
    expect(stats.cooling).toBe(5);
    expect(stats.durability).toBe(50);
    expect(stats.weight).toBe(100);
    expect(stats.maxHeat).toBe(100);
  });

  it('adds engine_t1 stats correctly', () => {
    const engine = PARTS_BY_ID.get('engine_t1');
    expect(engine).toBeDefined();
    const stats = calculateVehicleStats(RUSTBUCKET, engine ? [engine] : []);
    expect(stats.power).toBe(20);   // 10 base + 10
    expect(stats.weight).toBe(110); // 100 base + 10
  });

  it('adds fuel_t1 stats correctly', () => {
    const fuel = PARTS_BY_ID.get('fuel_t1');
    expect(fuel).toBeDefined();
    const stats = calculateVehicleStats(RUSTBUCKET, fuel ? [fuel] : []);
    expect(stats.fuelCapacity).toBe(40); // 20 base + 20
    expect(stats.weight).toBe(105);      // 100 base + 5
  });

  it('accumulates stats across all 5 T1 parts', () => {
    const ids = ['engine_t1', 'fuel_t1', 'cooling_t1', 'tires_t1', 'suspension_t1'];
    const parts = ids.map((id) => PARTS_BY_ID.get(id)).filter(Boolean) as NonNullable<ReturnType<typeof PARTS_BY_ID.get>>[];
    const stats = calculateVehicleStats(RUSTBUCKET, parts);
    expect(stats.power).toBe(20);        // 10 + 10
    expect(stats.fuelCapacity).toBe(40); // 20 + 20
    expect(stats.cooling).toBe(15);      // 5 + 10
    expect(stats.durability).toBe(70);   // 50 + 10 + 10
    expect(stats.weight).toBe(115);      // 100 + 10 + 5
  });

  it('never returns weight < 1 (division-by-zero guard)', () => {
    const zeroWeightChassis: ChassisDefinition = {
      id:   'test_chassis',
      name: 'Test',
      baseStats: {
        power: 10, fuelCapacity: 20, cooling: 5,
        durability: 50, weight: 0, maxHeat: 100,
      },
      slots: ['engine'],
    };
    const stats = calculateVehicleStats(zeroWeightChassis, []);
    expect(stats.weight).toBeGreaterThanOrEqual(1);
  });

  it('maxHeat is not modified by installed parts', () => {
    const allParts = Array.from(PARTS_BY_ID.values());
    const stats = calculateVehicleStats(RUSTBUCKET, allParts);
    expect(stats.maxHeat).toBe(RUSTBUCKET.baseStats.maxHeat);
  });

});
