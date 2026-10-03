import { describe,it,expect } from 'vitest';
import { validateData } from './dataValidation';
import { PARTS } from '../src/data/parts';
import { CHASSIS_LIST } from '../src/data/chassis';
import { ROADS } from '../src/data/roads';
import { SIMULATION_BALANCE } from '../src/domain/run/balance';
import type { PartDefinition } from '../src/types/game';
const allPass = (checks: ReturnType<typeof validateData>): boolean => checks.every(check => check.passed);
describe('Data integrity gate', () => {
  it('accepts canonical production data', () => { expect(allPass(validateData(PARTS,CHASSIS_LIST,ROADS))).toBe(true); });
  it.each([Infinity,NaN,-1])('rejects invalid numeric part contribution %s', power => {
    const parts = PARTS.map(part => part.id === 'engine_t1' ? { ...part,stats:{ ...part.stats,power } } : part);
    expect(allPass(validateData(parts,CHASSIS_LIST,ROADS))).toBe(false);
  });
  it('rejects duplicate IDs and broken family/tier merge references', () => {
    expect(allPass(validateData([...PARTS,PARTS[0]!],CHASSIS_LIST,ROADS))).toBe(false);
    const parts = PARTS.map(part => part.id === 'engine_t2' ? { ...part,family:'fuel',tier:1.5 } as unknown as PartDefinition : part);
    expect(allPass(validateData(parts,CHASSIS_LIST,ROADS))).toBe(false);
    expect(allPass(validateData(PARTS.filter(part => part.id !== 'engine_t2'),CHASSIS_LIST,ROADS))).toBe(false);
  });
  it.each([0,Infinity,NaN,-1])('rejects invalid chassis weight/max heat %s', value => {
    const chassis = CHASSIS_LIST.map(item => ({ ...item,baseStats:{ ...item.baseStats,weight:value,maxHeat:value } }));
    expect(allPass(validateData(PARTS,chassis,ROADS))).toBe(false);
  });
  it.each(['gap','overlap','zero','infinite-start','infinite-middle','sentinel','rate'] as const)('rejects invalid road %s', variant => {
    const roads = ROADS.map(road => ({ ...road,segments:road.segments.map((seg,index) => index === 0 ? {
      ...seg, endDistance: variant === 'gap' ? 99 : variant === 'overlap' ? 101 : variant === 'zero' ? 0 : variant === 'infinite-middle' ? Infinity : seg.endDistance,
      startDistance: variant === 'infinite-start' ? Infinity : seg.startDistance, loadFactor: variant === 'rate' ? Infinity : seg.loadFactor,
    } : index === road.segments.length-1 && variant === 'sentinel' ? { ...seg,endDistance:-1 } : seg) }));
    expect(allPass(validateData(PARTS,CHASSIS_LIST,roads))).toBe(false);
  });
  it('rejects duplicate chassis/road IDs, invalid/repeated slots and invalid balance without imposing reachability opinions', () => {
    expect(allPass(validateData(PARTS,[...CHASSIS_LIST,...CHASSIS_LIST],ROADS))).toBe(false);
    expect(allPass(validateData(PARTS,CHASSIS_LIST,[...ROADS,...ROADS]))).toBe(false);
    expect(allPass(validateData(PARTS,CHASSIS_LIST.map(item => ({ ...item,slots:['engine','engine'] })),ROADS))).toBe(false);
    expect(allPass(validateData(PARTS,CHASSIS_LIST,ROADS,{ ...SIMULATION_BALANCE,SPEED_DIVISOR:0 }))).toBe(false);
    expect(allPass(validateData(PARTS,CHASSIS_LIST,ROADS,{ ...SIMULATION_BALANCE,BASE_REWARD:1.5 }))).toBe(false);
  });
});
