import { describe, it, expect } from 'vitest';
import { advanceSimulation, createRunState, getActiveSegment } from './simulation';
import { calculateRunReward } from './rewards';
import { SCRAPLAND_HIGHWAY } from '@/data/roads';
import type { VehicleStats, RoadDefinition, RunState } from '@/types/game';

const stats = (overrides: Partial<VehicleStats> = {}): VehicleStats => ({ power:40, fuelCapacity:40, cooling:20,
  durability:70, weight:800, maxHeat:100, ...overrides });
const road: RoadDefinition = { id:'test', name:'test', segments:[{ name:'flat', startDistance:0, endDistance:0.5, loadFactor:1, roughness:0 },
  { name:'rough', startDistance:0.5, endDistance:Infinity, loadFactor:2, roughness:2 }] };
const flat: RoadDefinition = { id:'flat', name:'flat', segments:[{ name:'flat', startDistance:0, endDistance:Infinity, loadFactor:1, roughness:0 }] };
const closeState = (actual: RunState, expected: RunState): void => {
  for (const field of ['distance','fuel','heat','durability','maxDurability'] as const) expect(actual[field]).toBeCloseTo(expected[field],10);
  expect(actual.failureCause).toBe(expected.failureCause);
};

describe('Foreground analytical simulation', () => {
  it('initializes run capacity and snapshots max durability', () => {
    expect(createRunState(stats())).toEqual({ distance:0, fuel:40, heat:0, durability:70, maxDurability:70, failureCause:null });
  });
  it('returns the same state for zero delta and completed runs', () => {
    const initial = createRunState(stats()); expect(advanceSimulation(initial,stats(),road,0)).toBe(initial);
    const ended = { ...initial, failureCause:'abandoned' as const }; expect(advanceSimulation(ended,stats(),road,1)).toBe(ended);
  });
  it.each([-1,NaN,Infinity,-Infinity])('rejects invalid delta %s even for an ended run', dt => {
    expect(() => advanceSimulation(createRunState(stats()),stats(),road,dt)).toThrow(RangeError);
    expect(() => advanceSimulation({ ...createRunState(stats()),failureCause:'abandoned' },stats(),road,dt)).toThrow(RangeError);
  });
  it('caps very large foreground stalls to one accepted second', () => {
    const initial = createRunState(stats()); closeState(advanceSimulation(initial,stats(),road,999999),advanceSimulation(initial,stats(),road,1));
  });
  it('splits at the exact road boundary and applies the new rates only after crossing', () => {
    const next = advanceSimulation(createRunState(stats()),stats(),road,1);
    expect(next.distance).toBeCloseTo(1); expect(next.fuel).toBeCloseTo(38.5); expect(next.heat).toBeCloseTo(10); expect(next.durability).toBeCloseTo(69);
    expect(getActiveSegment(road,0.5).name).toBe('rough');
  });
  it('agrees across ten partitions including terrain crossing', () => {
    let split = createRunState(stats()); for (let i=0;i<10;i++) split = advanceSimulation(split,stats(),road,0.1);
    closeState(split,advanceSimulation(createRunState(stats()),stats(),road,1));
  });
  it('handles multiple road boundaries within one interval', () => {
    const multiple: RoadDefinition = { ...road, segments:[{ ...road.segments[0]!, endDistance:0.2 },
      { ...road.segments[1]!,startDistance:0.2,endDistance:0.4 }, { ...road.segments[1]!,startDistance:0.4,loadFactor:3 }] };
    const next = advanceSimulation(createRunState(stats()),stats(),multiple,1);
    expect(next.fuel).toBeCloseTo(37.6); expect(next.durability).toBeCloseTo(68.4);
  });
  it('stops at the earliest heat failure instead of a later fuel failure', () => {
    const vehicle = stats({ fuelCapacity:0.8, cooling:0,maxHeat:10 });
    const next = advanceSimulation(createRunState(vehicle),vehicle,flat,1);
    expect(next.failureCause).toBe('overheated'); expect(next.distance).toBeCloseTo(0.5); expect(next.fuel).toBeCloseTo(0.3); expect(next.heat).toBe(10);
  });
  it('stops precisely at fuel exhaustion without overshooting distance', () => {
    const vehicle = stats({ fuelCapacity:0.1 }); let split = createRunState(vehicle);
    for (let i=0;i<10;i++) split = advanceSimulation(split,vehicle,flat,0.03);
    const once = advanceSimulation(createRunState(vehicle),vehicle,flat,1);
    expect(once.failureCause).toBe('out_of_gas'); expect(once.fuel).toBe(0); expect(once.distance).toBeCloseTo(0.1); closeState(split,once);
  });
  it('stops precisely at durability failure', () => {
    const vehicle = stats({ durability:1 }); const rough = { ...flat,segments:[{ ...flat.segments[0]!,roughness:5 }] };
    const next = advanceSimulation(createRunState(vehicle),vehicle,rough,1);
    expect(next.failureCause).toBe('breakdown'); expect(next.durability).toBe(0); expect(next.distance).toBeCloseTo(0.2);
  });
  it('breaks true simultaneous failures in fuel, heat, durability order', () => {
    const vehicle = stats({ fuelCapacity:0.5,cooling:0,maxHeat:10,durability:1 });
    const rough = { ...flat,segments:[{ ...flat.segments[0]!,roughness:2 }] };
    expect(advanceSimulation(createRunState(vehicle),vehicle,rough,1).failureCause).toBe('out_of_gas');
    const noGasTie = stats({ fuelCapacity:1,cooling:0,maxHeat:10,durability:1 });
    expect(advanceSimulation(createRunState(noGasTie),noGasTie,rough,1).failureCause).toBe('overheated');
  });
  it('ends immediately for initially empty fuel or zero durability', () => {
    const empty = stats({ fuelCapacity:0 }); const next = advanceSimulation(createRunState(empty),empty,flat,1);
    expect(next.distance).toBe(0); expect(next.failureCause).toBe('out_of_gas');
    const fragile = stats({ durability:0 }); expect(advanceSimulation(createRunState(fragile),fragile,flat,1).failureCause).toBe('breakdown');
  });
  it('keeps heat at zero while cooling and permits stationary finite stats', () => {
    const vehicle = stats({ power:0 }); const next = advanceSimulation(createRunState(vehicle),vehicle,flat,1);
    expect(next.distance).toBe(0); expect(next.heat).toBe(0); expect(next.fuel).toBe(40); expect(next.failureCause).toBeNull();
  });
  it.each([{ weight:0 },{maxHeat:0},{power:Infinity},{cooling:NaN},{fuelCapacity:-1}])('rejects invalid vehicle stats %s', invalid => {
    expect(() => createRunState(stats(invalid))).toThrow(RangeError);
  });
  it('rejects invalid run state and uncovered road distance', () => {
    expect(() => advanceSimulation({ ...createRunState(stats()),distance:NaN },stats(),road,1)).toThrow(RangeError);
    expect(() => getActiveSegment({ ...road,segments:[] },0)).toThrow();
    expect(() => getActiveSegment(road,-1)).toThrow();
    expect(() => getActiveSegment({ ...road,segments:[{ ...road.segments[1]!,startDistance:10 }] },1)).toThrow();
  });
  it('uses the new production terrain boundaries and explicit Infinity end', () => {
    expect(getActiveSegment(SCRAPLAND_HIGHWAY,99.999).name).toBe('Outskirts');
    expect(getActiveSegment(SCRAPLAND_HIGHWAY,100).name).toBe('Cracked Pavement');
    expect(getActiveSegment(SCRAPLAND_HIGHWAY,300).name).toBe('Dirt Incline');
    expect(getActiveSegment(SCRAPLAND_HIGHWAY,600).name).toBe('Steep Rocky Pass');
    expect(getActiveSegment(SCRAPLAND_HIGHWAY,99999).endDistance).toBe(Infinity);
  });
});

describe('Reward threshold precision', () => {
  it.each([[0,5],[10,6],[10-1e-15,6],[10-1e-7,5],[20,7]])('distance %s grants %s Scrap', (distance,reward) => {
    expect(calculateRunReward({ ...createRunState(stats()),distance,failureCause:'abandoned' })).toBe(reward);
  });
  it.each([-1,NaN,Infinity])('rejects invalid reward distance %s', distance => {
    expect(() => calculateRunReward({ ...createRunState(stats()),distance })).toThrow(RangeError);
  });
});
