# Gameplay Systems and Progression

## 1. Approved continuous idle model
The Rustbucket auto-drives continuously through Scrapland Highway. Fuel consumption limits each attempt; checkpoint clears produce Scrap. Fuel exhaustion or inability to complete the current target leads to automatic reset/refill/retry according to the selected/current checkpoint route. No per-attempt manual launch, mandatory terminal result screen or Garage return. The player engineers the car, never manually races it.

## 2. Physical checkpoints and attempt cycle
Checkpoints are recognizable road landmarks. A Scrap Pile can serve as the first VS1 checkpoint type; fuel stations, guard posts, outposts and other landmarks are future expansion examples only. At fuel zero, stop the current attempt, reset/refill on its selected/current route and automatically begin the next attempt. Exact checkpoint distances, route reset positions, refill timing, fuel formulas/values and handling of other target bottlenecks remain to be balanced/resolved; no teleport/refill implementation is prescribed here.

Heat, durability and vehicle weaknesses can still inform diagnostics and build decisions. They do not restore the obsolete manual launch -> terminal fail -> payout -> Garage -> relaunch structure. An unsuccessful target attempt is not a successful checkpoint clear; do not carry the old minimum completion/quit payout into the new reward model.

## 3. Progress / Push versus Farm
- **Progress / Push:** Attempt farther/new checkpoints. First clear unlocks progression and its one-time first-clear reward.
- **Farm:** Choose an already unlocked/reachable checkpoint or route and repeat its normal reward. The player can stop pushing and remain at an earlier target for an extended period even if the car could go farther.

Never force automatic highest-checkpoint farming. Exact target-selection controls and unlock/reachability presentation remain open.

## 4. Checkpoint rewards and economy
Each checkpoint conceptually has repeatable Scrap and a one-time first-clear bonus. First-clear bonuses may award parts; exact values/drop tables and grant destination are unresolved. Re-clearing still earns normal Scrap; first-clear bonuses are not paid again. The economy must function while farming without new discovery.

Farther checkpoints normally grant more Scrap **per successful clear**, not guaranteed more Scrap per unit of time. Distinguish reward per clear, completion time and effective Scrap/time (including cycle overhead when balanced). The player optimizes this rate; speed improvements can make a formerly slower farther route more profitable. No illustrative numbers are production balance. D03's old distance/minimum payout is existing runtime evidence only.

## 5. Three part-state locations and explicit equipment
| Location | Meaning | Active vehicle contribution |
|---|---|---|
| Merge Board | Primary active merge/work area; future placement/movement/merge rules | None |
| Inventory | Owned stored parts not on the board and not equipped | None |
| Equipped Parts | Rustbucket's Engine, Fuel Tank, Radiator/Cooling, Tires, Suspension | Only source of installed contributions and visuals |

Stats are chassis base plus Equipped Parts only. Example: Engine T1 and T2 on the board, Engine T3 equipped -> car uses/displays Engine T3. A merge must not implicitly modify or consume the equipped build. Any change to equipment requires an explicit equip/unequip action; do not infer a gesture or swap policy from current commands.

VS1 retains two identical same-family/same-tier merge inputs yielding one higher-tier part; Tier 3 cannot merge. New board input/output/movement rules await redesign. Conserve ownership across all three locations and reject invalid actions without mutation. Definition IDs may still represent duplicate copies; no unique-instance system is chosen here.

## 6. Manual engineering and Garage responsibility
The Garage home focuses on the equipped Rustbucket, key stats, Scrap and navigation. Merge, Inventory management and Scavenge can be reached as major systems rather than permanently crowding home. Exact Merge/Inventory layout, move/equip UX and installed-slot gesture remain owner decisions (D05).

Continuous driving must coexist with player improvements. The existing blanket active-run command block is an implementation gap; timing/safety for applying an explicit equipment change to an ongoing attempt remains unresolved. Do not retain the block as a design that makes engineering inaccessible indefinitely.

## 7. Manual first -> automation later
**Most automation should originate from a manual workflow the player first understands.** Manual acquisition -> later auto-acquisition; manual merging -> later auto-merge; manual sorting/movement -> later sorting automation. Automate repetitive low-level work as progression advances, not merely a passive multiplier. No unlock conditions, economy or automation features are implemented/locked here. Continuous auto-drive and auto-retry already belong to the primary VS1 model.

## 8. Simulation, visibility and offline principle
Authoritative gameplay tracks checkpoint/progression, selected farm/progress target, fuel/attempt state, equipped vehicle stats and rewards independently of visible road graphics. Rendering is local to the visible region and may recycle/despawn passed content. Non-visible and later offline repeat progress must be representable mathematically/statefully without replaying all visual frames. Exact offline formula/cap remains open. Current runtime hidden-tab pausing grants no offline rewards; that existing limitation is not a final idle calculation contract.

## 9. Open decisions and implementation boundary
Merge-board dimensions/shape, capacity and expansion; exact Inventory capacity; exact Scrap rewards and first-clear part drops; fuel values/formulas; checkpoint distances; route reset/refill details; offline formula/cap; automation unlocks; checkpoint-selection UI; exact acquisition probabilities/economy; board/move/equip UX and equipment application timing remain unresolved. Existing unbounded storage and numeric acquisition/fuel/reward constants do not lock these new design choices.

This owner-approved correction changes documentation only. No runtime, save version or assets change. D06 preserves existing storage/recovery safeguards and identifies future adaptation. D14 assigns future work without marking implementation complete.

## 10. Existing foundation snapshot — not the continuous model
The following records the unchanged discrete-run implementation and provisional measurements, not requirements for new scene work or final checkpoint balance. Terminal minimum payouts, quit rewards, per-run tokens and hidden-tab behavior here require review/adaptation before continuous integration. Preserve useful mathematical safety and idempotency properties, not obsolete product behavior.

### Existing runtime formulas (provisional)

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

### Existing runtime foreground/background policy

A delta must be finite and nonnegative; invalid input throws. Zero is a no-op. The production simulator analytically divides each accepted interval at terrain boundaries and the earliest failure. A call accepts at most one second; excess stall time is discarded. Thus one accepted second agrees with ten 0.1s steps within floating-point tolerance. A huge stalled call intentionally does not represent its full wall-clock duration.

Active runs pause when the tab/app is hidden. On resume, discard the first frame delta. The pre-correction planned RunScene binding specified `GameStateService.advanceRun(token, state, road, deltaMs / 1000)`. Explicit user pause likewise stops calling the tick. Offline progression/automation is a separate future design; hiding a foreground run grants no catch-up simulation.

### Existing runtime terminal settlement (superseded design)

Stop at the earliest fuel=0, heat=maxHeat or durability=0 event. True numerical ties use out_of_gas, overheated, breakdown priority. Failed states never advance again. Diagnosis uses final stat snapshots; peak telemetry, if shown later, must be collected by the scene (RunState does not currently track peaks).

Explicit Quit marks the state abandoned and grants the same distance reward. A minimum 5 Scrap per valid completion avoids a currency soft lock: two zero-distance completions can fund one scavenge. Service-issued session tokens are consumed synchronously before saving; repeated/stale callbacks cannot pay twice. Unfinished, inconsistent and nonfinite results are rejected. No reward is granted merely for hiding or closing the page. Ephemeral active runs do not resume after process loss.

### Existing discrete-run balance baseline (provisional)

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

### Existing part commands and starting save
Current runtime Scavenge costs 10 Scrap and draws a Tier 1 family with equal probability. Current merge prefers two stored copies, otherwise consumes one stored and one installed copy, clearing its slot and storing the output. **That equipped-input fallback conflicts with §5 and must change in future authorized work.** Current Inventory is unbounded and has no board state; exact future capacities remain open. Current install consumes a stored copy, returns a displaced part to Inventory and validates family/ownership; uninstall returns the installed copy.

Missing saves/explicit reset currently create 0 Scrap, empty equipped slots, engine_t1 + fuel_t1 in Inventory and bestDistance 0. Damaged-save salvage never invents starter ownership. Progress mutations queue captured saves; write failure preserves live state and exposes retry/error (D03/D06). These current save facts do not decide new first-clear reward destination or board initialization.

### Existing feedback thresholds
Low fuel: fuel/fuelCapacity < 0.20; high heat: heat/maxHeat > 0.80; critical durability: durability/maxDurability < 0.20. Guard zero-capacity ratios. Current maxDurability is captured at attempt start. These are retained provisional presentation baselines; exact ongoing equipment application and additional bottleneck behavior remain open.
