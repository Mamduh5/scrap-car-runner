/** Balance evidence uses the production domain; no parallel formula implementation. */
import { calculateVehicleStats } from '../src/domain/vehicle/calculateVehicleStats';
import { advanceSimulation, createRunState } from '../src/domain/run/simulation';
import { calculateRunReward } from '../src/domain/run/rewards';
import { SIMULATION_BALANCE } from '../src/domain/run/balance';
import { PARTS_BY_ID } from '../src/data/parts';
import { RUSTBUCKET } from '../src/data/chassis';
import { SCRAPLAND_HIGHWAY } from '../src/data/roads';

function runScenario(name: string, partIds: readonly string[]): void {
  const parts = partIds.map(id => {
    const part = PARTS_BY_ID.get(id);
    if (!part) throw new Error('Unknown scenario part: ' + id);
    return part;
  });
  const stats = calculateVehicleStats(RUSTBUCKET, parts);
  let state = createRunState(stats);
  const dt = 1 / 60;
  let ticks = 0;
  while (state.failureCause === null && ticks < 60 * 600) {
    state = advanceSimulation(state, stats, SCRAPLAND_HIGHWAY, dt);
    ticks++;
  }
  if (state.failureCause === null) throw new Error('Scenario did not finish: ' + name);
  console.log(name + ': ' + state.distance.toFixed(2) + 'm, ~' + (ticks * dt).toFixed(2) + 's, ' + state.failureCause +
    ', ' + calculateRunReward(state) + ' Scrap, ' + (stats.power / stats.weight / SIMULATION_BALANCE.SPEED_DIVISOR).toFixed(2) + 'm/s');
}
console.log('Provisional first-playtest tuning. Durations include at most one 1/60s terminal frame.');
runScenario('Bare chassis', []);
runScenario('Starter engine + fuel', ['engine_t1', 'fuel_t1']);
for (const tier of [1, 2, 3]) runScenario('Full T' + tier, ['engine', 'fuel', 'cooling', 'tires', 'suspension'].map(family => family + '_t' + tier));
runScenario('T3 engine, T1 others', ['engine_t3', 'fuel_t1', 'cooling_t1', 'tires_t1', 'suspension_t1']);
runScenario('T3 fuel, T1 others', ['engine_t1', 'fuel_t3', 'cooling_t1', 'tires_t1', 'suspension_t1']);
runScenario('T3 power/fuel/cooling, no reinforcement', ['engine_t3', 'fuel_t3', 'cooling_t3']);
