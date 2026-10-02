/**
 * tools/simulate.ts
 * 
 * Balance simulator that directly imports the production math logic
 * from src/domain/ to prevent formula drift.
 *
 * Replaces the old vanilla JS tools/sim-check.js
 */

import { calculateVehicleStats } from '../src/domain/vehicle/calculateVehicleStats';
import { advanceSimulation, createRunState } from '../src/domain/run/simulation';
import { calculateRunReward } from '../src/domain/run/rewards';
import { PARTS_BY_ID } from '../src/data/parts';
import { RUSTBUCKET } from '../src/data/chassis';
import { SCRAPLAND_HIGHWAY } from '../src/data/roads';
import type { PartDefinition, RunState } from '../src/types/game';

function runScenario(name: string, partIds: string[]) {
  const parts = partIds.map(id => PARTS_BY_ID.get(id)!);
  const stats = calculateVehicleStats(RUSTBUCKET, parts);
  const speed = stats.power / stats.weight; // base speed
  let state = createRunState(stats);

  const DT = 0.016; // 60fps simulation
  let ticks = 0;

  while (state.failureCause === null && ticks < 60 * 60 * 60) { // arbitrary max ticks
    state = advanceSimulation(state, stats, SCRAPLAND_HIGHWAY, DT);
    ticks++;
  }

  const durationSec = (ticks * DT);
  const mins = Math.floor(durationSec / 60);
  const secs = Math.floor(durationSec % 60);
  const reward = calculateRunReward(state);

  console.log(`\nScenario: ${name}`);
  console.log(`  Parts:        ${partIds.length ? partIds.join(', ') : '(none)'}`);
  console.log(`  Stats:        Power=${stats.power.toFixed(1)} Fuel=${stats.fuelCapacity.toFixed(1)} Cool=${stats.cooling.toFixed(1)} Durability=${stats.durability.toFixed(1)} Weight=${stats.weight.toFixed(1)} MaxHeat=${stats.maxHeat.toFixed(1)}`);
  console.log(`  Base Speed:   ${speed.toFixed(3)} m/s`);
  console.log(`  Result:       ${state.distance.toFixed(0)}m in ${mins}m ${secs}s → ${state.failureCause}`);
  console.log(`  Scrap Earned: ${reward}`);
  console.log(`  At failure:   Fuel=${state.fuel.toFixed(1)} Heat=${state.heat.toFixed(1)} HP=${state.durability.toFixed(1)}`);
}

console.log('========================================================================');
console.log(' SCRAP CAR RUNNER — Balance Simulator (Using Production Formulas)');
console.log(' WARNING: All numbers are provisional estimates. Playtesting required.');
console.log('========================================================================');

runScenario('Bare chassis (no parts)', []);
runScenario('Starter: engine_t1 + fuel_t1', ['engine_t1', 'fuel_t1']);
runScenario('T1 full build', ['engine_t1', 'fuel_t1', 'cooling_t1', 'tires_t1', 'suspension_t1']);
runScenario('T2 full build', ['engine_t2', 'fuel_t2', 'cooling_t2', 'tires_t2', 'suspension_t2']);
runScenario('T3 full build', ['engine_t3', 'fuel_t3', 'cooling_t3', 'tires_t3', 'suspension_t3']);
runScenario('Speed focus (T3 engine, T1 others)', ['engine_t3', 'fuel_t1', 'cooling_t1', 'tires_t1', 'suspension_t1']);
runScenario('Fuel focus (T3 fuel, T1 others)', ['engine_t1', 'fuel_t3', 'cooling_t1', 'tires_t1', 'suspension_t1']);

console.log('\n========================================================================');
console.log(' Done. Review results above before tuning balance values.');
console.log('========================================================================');
