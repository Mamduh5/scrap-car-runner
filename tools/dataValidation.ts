import type { PartDefinition, ChassisDefinition, RoadDefinition } from '../src/types/game';
import { PART_FAMILIES, MAX_TIER } from '../src/types/game';
import { SIMULATION_BALANCE } from '../src/domain/run/balance';
import { MAX_FOREGROUND_DELTA_SECONDS } from '../src/domain/run/simulation';

export interface DataCheck { readonly label: string; readonly passed: boolean }
export function validateData(parts: readonly PartDefinition[], chassis: readonly ChassisDefinition[],
  roads: readonly RoadDefinition[], balance: typeof SIMULATION_BALANCE = SIMULATION_BALANCE): readonly DataCheck[] {
  const checks: DataCheck[] = [];
  const check = (label: string, passed: boolean): void => { checks.push({ label, passed }); };
  const nonnegative = (value: number): boolean => Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
  const positive = (value: number): boolean => nonnegative(value) && value > 0;
  const unique = (list: readonly { readonly id: string }[]): boolean => list.every(item => item.id.length > 0) && new Set(list.map(item => item.id)).size === list.length;
  const byId = new Map(parts.map(part => [part.id, part]));
  check('All part IDs are unique and nonempty', unique(parts));
  for (const part of parts) {
    check('Part ' + part.id + ' family is valid', PART_FAMILIES.includes(part.family));
    check('Part ' + part.id + ' tier is valid', Number.isInteger(part.tier) && part.tier >= 1 && part.tier <= MAX_TIER);
    check('Part ' + part.id + ' ID matches family and tier', part.id === part.family + '_t' + part.tier);
    check('Part ' + part.id + ' stats are finite and nonnegative', Object.values(part.stats).every(nonnegative));
    if (part.tier < MAX_TIER) {
      const output = byId.get(part.family + '_t' + (part.tier + 1));
      check('Merge output for ' + part.id + ' exists with matching family and next tier',
        output !== undefined && output.family === part.family && output.tier === part.tier + 1);
    }
  }
  for (const family of PART_FAMILIES) for (let tier = 1; tier <= MAX_TIER; tier++) {
    check('Definition ' + family + '_t' + tier + ' exists', byId.has(family + '_t' + tier));
  }
  check('At least one chassis defined', chassis.length > 0);
  check('Chassis IDs are unique and nonempty', unique(chassis));
  for (const item of chassis) {
    check(item.id + ' base stats are finite and nonnegative', Object.values(item.baseStats).every(nonnegative));
    check(item.id + ' weight and max heat are positive', positive(item.baseStats.weight) && positive(item.baseStats.maxHeat));
    check(item.id + ' slots are valid and unique for VS1', item.slots.length > 0 && item.slots.every(slot => PART_FAMILIES.includes(slot)) && new Set(item.slots).size === item.slots.length);
  }
  check('At least one road defined', roads.length > 0);
  check('Road IDs are unique and nonempty', unique(roads));
  for (const road of roads) {
    check(road.id + ' starts at zero', road.segments[0]?.startDistance === 0);
    check(road.id + ' ends at explicit Infinity', road.segments.at(-1)?.endDistance === Infinity);
    road.segments.forEach((seg, index) => {
      check(road.id + ' segment ' + index + ' has valid positive length', nonnegative(seg.startDistance) && seg.endDistance > seg.startDistance &&
        (nonnegative(seg.endDistance) || (index === road.segments.length - 1 && seg.endDistance === Infinity)));
      if (index > 0) check(road.id + ' segment ' + index + ' is contiguous and ordered', road.segments[index - 1]?.endDistance === seg.startDistance);
      check(road.id + ' segment ' + index + ' rates are finite and valid', positive(seg.loadFactor) && nonnegative(seg.roughness));
    });
  }
  check('Simulation divisors and maximum delta are finite and positive',
    [balance.FUEL_BURN_DIVISOR, balance.SPEED_DIVISOR, balance.DISTANCE_REWARD_DIVISOR, MAX_FOREGROUND_DELTA_SECONDS].every(positive));
  check('Heat coefficient is finite and nonnegative', nonnegative(balance.HEAT_GENERATION_MULTIPLIER));
  check('Base reward is nonnegative integer currency', nonnegative(balance.BASE_REWARD) && Number.isSafeInteger(balance.BASE_REWARD));
  return checks;
}
