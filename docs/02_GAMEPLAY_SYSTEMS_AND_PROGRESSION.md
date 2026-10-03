# Gameplay Systems and Progression

## 1. Garage and engineering (VS1)

Scavenge costs 10 Scrap and produces one Tier 1 part with equal probability for each of the five families. Merge is free: two identical owned IDs become one next-tier part of the same family; Tier 3 cannot merge. Installation explicitly selects a slot and the service validates ownership and compatibility. One slot per family in VS1. Stats are chassis base plus installed contributions. Garage commands are blocked during an active run.

## 2. Stats and production formulas

Power increases speed, heat generation and fuel burn. Weight divides speed. Fuel capacity is the tank size. Cooling subtracts from heat generation. Tires and suspension add durability capacity; they do not reduce damage rate. MaxHeat is fixed by the chassis.

Central provisional coefficients live in `src/domain/run/balance.ts`:

```text
seconds = Phaser deltaMs / 1000
speed = power / weight / SPEED_DIVISOR                (0.05)
heatRate = power * segment.loadFactor * HEAT_GENERATION_MULTIPLIER (0.5) - cooling
fuelRate = power * segment.loadFactor / FUEL_BURN_DIVISOR (40)
durabilityRate = segment.roughness
reward = BASE_REWARD (5) + floor(distance / DISTANCE_REWARD_DIVISOR (10))
```

Distance adds speed * accepted seconds. Heat clamps to [0,maxHeat]; fuel/durability stop at zero. No global per-tick rounding. Reward quotients within eight machine-epsilon units of an integer snap to that integer to prevent a floating-point 10m threshold from losing Scrap.

## 3. Foreground stepping and background policy

A delta must be finite and nonnegative; invalid input throws. Zero is a no-op. The production simulator analytically divides each accepted interval at terrain boundaries and the earliest failure. A call accepts at most one second; excess stall time is discarded. Thus one accepted second agrees with ten 0.1s steps within floating-point tolerance. A huge stalled call intentionally does not represent its full wall-clock duration.

Active runs pause when the tab/app is hidden. On resume, discard the first frame delta. Future RunScene must use `GameStateService.advanceRun(token, state, road, deltaMs / 1000)`. Explicit user pause likewise stops calling the tick. Offline progression/automation is a separate future design; hiding a foreground run grants no catch-up simulation.

## 4. Failure and completion

Stop at the earliest fuel=0, heat=maxHeat or durability=0 event. True numerical ties use out_of_gas, overheated, breakdown priority. Failed states never advance again. Diagnosis uses final stat snapshots; peak telemetry, if shown later, must be collected by the scene (RunState does not currently track peaks).

Explicit Quit marks the state abandoned and grants the same distance reward. A minimum 5 Scrap per valid completion avoids a currency soft lock: two zero-distance completions can fund one scavenge. Service-issued session tokens are consumed synchronously before saving; repeated/stale callbacks cannot pay twice. Unfinished, inconsistent and nonfinite results are rejected. No reward is granted merely for hiding or closing the page. Ephemeral active runs do not resume after process loss.

## 5. Initial playtest baseline (provisional)

Terrain begins at 100m (cracked pavement), 300m (dirt incline), 600m (rocky pass). Part/chassis values and reward economy are unchanged. Speed divisor 0.05, fuel divisor 40 and heat coefficient 0.5 replace unreachable scaffolding. Measure with `npm run simulate`, which imports production formulas.

| Installed build | Approximate distance | Duration | Cause |
|---|---:|---:|---|
| Bare chassis | 150m | 75s | Fuel |
| Starter engine + fuel | 69.57m | 20s | Heat |
| Full T1 | 248.55m | 71.47s | Fuel |
| Full T2 | 372m | 66.43s | Fuel |
| Full T3 | 605m | 60.50s | Fuel |
| T3 engine, T1 others | 53.85m | 5s | Heat |
| T3 fuel, T1 others | 308m | 96.25s | Breakdown |
| T3 engine/fuel/cooling, no tires or suspension | 400m | 40s | Breakdown |

The crude starter makes a short run; adding cooling enables the first terrain transition. Balanced upgrades reach later transitions; more power without cooling can worsen survival. Bare chassis outruns the overheating starter but earns less than a full T1 build. This is an explicit provisional engineering tradeoff to revisit in playtesting, along with short high-power heat failures, progression pacing and T3's brief rocky-pass exposure. These numbers are not final balance.

## 6. Inventory, merges and ownership

Inventory stores definition IDs, permits duplicates and is unbounded in VS1. Unique instances are unnecessary until per-copy state exists. No sell mechanic; max-tier extras remain stored.

Merge input selection is deterministic: prefer two stored copies; otherwise consume exactly one stored plus one installed copy. The latter clears its slot atomically and puts the upgraded output in inventory. UI never manually uninstalls/merges/reinstalls to execute this command. Unrelated copies and currency are preserved. Two inputs become one output.

Install consumes one stored copy and returns any displaced part to inventory. Uninstall returns the installed copy. Invalid targets/ownership/compatibility return false with no mutation. Scavenge RNG is injectable for tests; production defaults to Math.random and validates a draw in [0,1) before spending.

## 7. Starting state and persistence

Only missing saves and explicit reset receive 0 Scrap, empty slots, engine_t1 + fuel_t1 in inventory, and bestDistance 0. The player manually installs starter items to learn engineering; a bare-chassis run is permitted. Salvaging damaged saves never invents starter ownership.

Scavenge, merge, install, uninstall and valid run completion queue captured saves. Persistence failure preserves live progress and exposes an error/retry state. See `06_ARCHITECTURE_AND_SAVE_MODEL.md` and the Data Bible for recovery/reset.

## 8. Presentation thresholds and future scope

Low fuel: fuel/fuelCapacity < 0.20. High heat: heat/maxHeat > 0.80. Critical durability: durability/maxDurability < 0.20. For zero capacities, UI must handle ratios without division by zero. MaxDurability is fixed at run start.

VS1 retains one chassis, five families and three tiers. Automation, offline rewards, new environments and prestige remain deferred. This pass adds no gameplay UI or assets.
