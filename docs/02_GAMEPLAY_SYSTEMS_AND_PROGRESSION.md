# Gameplay Systems and Progression

## 1. Approved continuous idle model
The Rustbucket auto-drives continuously through Scrapland Highway. Fuel consumption limits each attempt; checkpoint clears produce Scrap. Fuel exhaustion or inability to complete the current target leads to automatic reset/refill/retry according to the selected/current checkpoint route. No per-attempt manual launch, mandatory terminal result screen or Garage return. The player engineers the car, never manually races it.

## 2. Physical checkpoints and attempt cycle
Checkpoints are recognizable road landmarks. A Scrap Pile can serve as the first VS1 checkpoint type; fuel stations, guard posts, outposts and other landmarks are future expansion examples only. At fuel zero, stop the current attempt, reset/refill on its selected/current route and automatically begin the next attempt. Exact checkpoint distances, route reset positions, refill timing, fuel formulas/values and handling of other target bottlenecks remain to be balanced/resolved; no teleport/refill implementation is prescribed here.

Fuel depletion is the normal attempt-cycle ending; severe Engine/Radiator incompatibility may instead cause critical overheating/catastrophic failure (see the specialization contract below). Vehicle weakness diagnostics remain useful, but mandatory global durability, per-part health bars, degradation and permanent destruction are not approved target systems. They do not restore the obsolete manual launch -> terminal fail -> payout -> Garage -> relaunch structure. An unsuccessful target attempt is not a successful checkpoint clear; do not carry the old minimum completion/quit payout into the new reward model.

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

Stats are chassis base plus Equipped Parts only. Example: Engine T1 and T2 on the board, Engine T3 equipped -> car uses/displays Engine T3. A merge must not implicitly modify or consume the equipped build. Equipment changes must be deliberate; direct equipped merging and whether unequip is required remain pending board design. Do not infer a gesture or swap policy from current commands.

The existing generic VS1 ladder merges two identical IDs into one next-tier part and rejects Tier 3 merges. Core merging requires two copies with the **same Family + same Type/Specialization + same Tier**, producing one **next-tier part of the same family and type**. Different families, types or tiers are invalid inputs; matching family and tier alone is insufficient. Type is persistent gameplay identity: no generic, random or hybrid output and no cross-type fusion/recipe graph. Type acquisition now follows the source/investment philosophy below; exact source catalogs, pools and unlock rules remain open. Board input/output/movement rules also await separate design. Conserve ownership across all three locations and reject invalid actions without mutation. Definition IDs may still represent duplicate copies; no unique-instance system is chosen here.

## 6. Manual engineering and Garage responsibility
The Garage home focuses on the equipped Rustbucket, key stats, Scrap and navigation. Merge, Inventory management and Scavenge can be reached as major systems rather than permanently crowding home. Exact Merge/Inventory layout, move/equip UX and installed-slot gesture remain owner decisions (D05).

Continuous driving must coexist with player improvements. The existing blanket active-run command block is an implementation gap; timing/safety for applying an explicit equipment change to an ongoing attempt remains unresolved. Do not retain the block as a design that makes engineering inaccessible indefinitely.

## 7. Manual first -> automation later
**Most automation should originate from a manual workflow the player first understands.** Manual acquisition -> later auto-acquisition; manual merging -> later auto-merge; manual sorting/movement -> later sorting automation. Automate repetitive low-level work as progression advances, not merely a passive multiplier. No unlock conditions, economy or automation features are implemented/locked here. Continuous auto-drive and auto-retry already belong to the primary VS1 model.

## 8. Simulation, visibility and offline principle
Authoritative gameplay tracks checkpoint/progression, selected farm/progress target, fuel/attempt state, equipped vehicle stats and rewards independently of visible road graphics. Rendering is local to the visible region and may recycle/despawn passed content. Non-visible and later offline repeat progress must be representable mathematically/statefully without replaying all visual frames. Exact offline formula/cap remains open. Current runtime hidden-tab pausing grants no offline rewards; that existing limitation is not a final idle calculation contract.

## Core equipment / road-region contract (owner-approved 2026-10-06)
### Equipment dimensions and build decisions
Family identifies the subsystem; Type/Specialization identifies intended terrain, obstacle, strategy or role; Tier expresses strength within that specialization. Tradeoffs and Compatibility describe costs and interactions with the other equipped parts. **Tier determines strength; type determines suitability.** A higher-tier wrong type may perform worse than a lower-tier suitable type on a particular checkpoint or farm route. Specialized equipment should usually solve a meaningful problem at a meaningful cost (weight, speed, fuel use or off-terrain efficiency), not become strictly better everywhere.

Only Equipped Parts affect vehicle performance and installed visuals; parts on the board or in Inventory have no passive effect. Retain useful alternative parts for different routes. A heavy/obstacle-capable **Push Build** can reach a new checkpoint yet farm easy terrain more slowly than a light/speed-focused **Farm Build**. Both are intended strategies; route reliability, clear time and effective Scrap/time can change the optimal farm checkpoint. No formal loadout slots, presets or automatic swapping are chosen.

### Family roles
| Family | Approved conceptual role | Direction examples only; not production definitions |
|---|---|---|
| Engine | Basic power, acceleration/effective driving performance, speed, overcoming hills and heavy resistance | High-speed: fast easy-road farming, weaker climbing/torque, potentially more heat. Torque/power: stronger hills/heavy loads/push, lower top speed. Balanced: general purpose without extreme specialization. |
| Fuel Tank | Fuel capacity and how long an attempt can continue before zero fuel | Future types may have tradeoffs, but no Fuel Tank types are approved here. |
| Radiator / Cooling | Sustained-load heat control, stable performance and Engine compatibility | Suitable cooling supports strong engines and long/high-load routes; weak/unsuitable cooling can reduce performance/speed and indirectly increase fuel consumed because completion takes longer. No final cooling catalog is chosen. |
| Tires | Meaningful surface/terrain suitability, beyond a generic traction or durability number | Road: fast asphalt, weaker specialized surfaces. Grip/track: difficult/steep surfaces, slower/heavier. Oversized/big: large physical obstacles, weight/speed/fuel costs. Ice: ice suitability, lower off-terrain efficiency. Heat-resistant: extreme-hot suitability, possible weight/speed costs. |
| Suspension | Meaningful obstacle-shape/impact/load suitability, beyond generic durability | Standard: efficient/light on flat road, weak extreme obstacles. Heavy-duty: heavy vehicle/impact support with weight/speed costs. Long-travel: deep holes/rough terrain/large drops, heavy and inefficient for fast flat farming. |

All example names/catalogs are provisional and impose no exact tiers, values, unlocks or VS1 production requirements.

### Engine / Radiator compatibility and attempt failure
A Radiator too weak or unsuitable for its equipped Engine can produce severe overheating. In sufficiently bad combinations the vehicle may reach critical heat, fail catastrophically and show an explosion/failure presentation before the target checkpoint. The current attempt ends and resets/retries through the checkpoint system. **Equipment remains owned and equipped; explosion is an attempt failure/presentation state, never permanent part deletion.** The UI should eventually warn about dangerous combinations before or while running. Exact compatibility formulas, heat/explosion thresholds and presentation are unresolved; no warning gesture, blanket equip rejection or new art is specified.

Fuel depletion remains the normal ending. Do not generalize this approved severe-overheat exception into independent health/instant-fail systems for every family, a mandatory global durability resource or equipment degradation. The durability field, tire/suspension buffers and breakdown branch in §10 are unchanged legacy implementation evidence, not the target gameplay requirement.

### Road conditions and milestone regions
Possible surface conditions include normal asphalt, damaged/torn road, dirt, rock, sand/mud, ice, water, extreme heat/lava-like terrain and later specialized surfaces. Possible obstacles include bumps, rough road, potholes/deep holes, large drops, steep descents, ramps, ledges, hills and broken terrain. These examples give types purpose; none is a new approved VS1 content list.

Long uphills pressure Engine power; sustained engine load pressures Cooling; loose/slippery surfaces pressure Tires; large obstacles/holes/drops pressure Suspension; long routes pressure Fuel capacity. Mixed routes create tradeoffs across systems. Performance emerges from the equipped combination and road conditions, not a hard numeric gate at every checkpoint.

Several checkpoints belong to a larger Road Region / World Region. At milestone transitions, environment, terrain grammar, obstacle families and useful/necessary specializations may change; new acquisition opportunities may unlock later. Reuse authored terrain/obstacle pieces while changing composition; no unique environment per checkpoint is needed. Progression should sometimes change what build works, not demand the same type at ever-higher tiers. Region names/counts/boundaries and checkpoint requirements remain open; no illustrative range becomes data.

### Future merge and acquisition implications
Core matching is approved: same family, type and tier advance within that same type; cross-type merges are invalid. Optional future type transformation remains separate and unresolved. Later acquisition must consider family, type, region, unlocked specializations and player targeting/control because unrestricted random acquisition may become frustrating. The approved Scavenge source/investment contract below now provides targeting direction. Exact pools, drop rates, targeting controls and shop behavior remain open; do not redesign the board or produce Scavenge UI in this update.

No random affixes/stat or quality rolls, rarity power systems, rune sockets, skill trees, character stats, legendary procs, equipment durability degradation or permanent destruction are approved. Type catalogs/names, stats/weights, compatibility/heat/explosion/terrain/farming formulas, checkpoint requirements, region boundaries/names, merge interaction, capacity, source catalogs/prices/drop details, type unlocks and loadout preset systems remain owner decisions. This core philosophy does not enlarge the current VS1 catalog.

## Scavenge sources and Scrap search investment (owner-approved 2026-10-06)
### Random but directable acquisition
Use multiple **Scavenge Sources** representing where/what salvage is searched. Source selection controls eligible/weighted families and types/specializations, normally not a guaranteed exact item. Avoid both an unrestricted global pool with little player control and specialized Scavenge becoming a direct purchase of requested equipment.

| Axis | Approved purpose | Unresolved details |
|---|---|---|
| Scavenge Source | Which family/type parts are possible/likely, and relative weighting | Names/counts, pools/weights, prices, unlock requirements/mappings |
| Scrap search investment | More Scrap improves higher-tier probability while keeping selected source identity | Added costs, tier distributions, levels/control/UI and progression formulas |

General / Normal Scavenge remains available: broadest general pool, many/all currently available general families/types, relatively inexpensive, useful merge material or general acquisition and relevant after specialized sources unlock. Specialized sources are narrower/biased toward solving specific equipment needs and typically cost more Scrap, potentially substantially more; exact prices/multipliers remain open. Their value is better targeting, not universally better loot. Neither source nor increased investment normally guarantees an exact part/tier; guaranteed/pity mechanics remain undecided.

Concept examples only: mud/off-road salvage may favor Grip-style/Oversized Tires, torque/climbing Engines and rough-terrain Suspension; high-tech salvage may favor high-speed Engines, advanced Cooling and technical components; mountain salvage may favor climbing/power equipment, heavy Suspension and obstacle-oriented Tires. Frozen/ice, flooded/water, extreme-heat and industrial salvage are possible future region examples. These do not define source names, catalogs, new families/types or production tables.

Sources can overlap: shared parts may appear in General and multiple specialized sources, potentially every relevant source. Cooling may appear broadly, while specific Radiator types may later have different weights. No exclusive assignment or exact weighting is locked.

### Economy and progression
**Scrap remains the only approved acquisition currency.** No region tokens/chips/secondary salvage currencies are added. Source cost and additional investment compete for Scrap: more pulls versus better-targeted pulls versus better-tier odds, alongside already-approved Scrap uses. Low investment can favor lower-tier finds; increasing investment improves higher-tier odds at greater cost. Do not invent final cost curves/probabilities or alter the current runtime's numeric balance.

Checkpoint/region progression may unlock relevant sources when new terrain creates equipment needs. Exact unlock numbers, source/region mappings and availability remain open. The same source can stay relevant at future higher tiers through player progression, investment or later Scavenge upgrades; tier-numbered source duplication is not required. Exact scaling rules are undecided.

### Equipment, merge and automation connection
Acquisition targets Type/Specialization meaningfully and preserves Family + Type + Tier + Tradeoff + Compatibility; it must not collapse back to family/tier only. Finds remain owned parts, not implicit equipped changes. Core matching requires equal family/type/tier and preserves type at the next tier; cross-type fusion is excluded, while optional future transformation remains unresolved, and all Engine T1 parts are not assumed interchangeable.

Manual workflow first: choose source, investment/cost level and when to Scavenge. Later automation may perform that learned workflow. An Auto Scavenger using selected source/investment and an optional Scrap spending limit is an example only; no unlock, spending-limit rule or final configuration UI is approved.

### Open acquisition decisions
Final source names/counts; source unlock checkpoints/regions; exact Scrap prices/cost multipliers; loot tables/family/type weights; tier probabilities; investment levels/UI; guaranteed/pity mechanics; duplicate protection; exact first-clear Scavenge interactions; acquisition animation/reveal; Auto Scavenger unlocks/spending limits; any future secondary currency. Scavenge is its own focused system accessible from Garage/hub; no layout or UI production is started. This updates design only; §10's fixed-price random-T1 runtime behavior remains unchanged foundation evidence.

## Core merge compatibility (owner-approved 2026-10-06)
Core merging requires two copies with the **same Family + same Type/Specialization + same Tier**, producing one **next-tier part of the same family and type**. Different families, types or tiers are invalid inputs; matching family and tier alone is insufficient. Type is persistent gameplay identity: no generic, random or hybrid output and no cross-type fusion/recipe graph.

| Conceptual inputs | Result |
|---|---|
| High-Speed Engine T1 + High-Speed Engine T1 | High-Speed Engine T2 |
| Road Tire T2 + Road Tire T2 | Road Tire T3 |
| Grip Tire T1 + Grip Tire T1 | Grip Tire T2, never random or generic Tire T2 |
| High-Speed Engine T1 + Torque Engine T1 | Invalid: type differs |
| Road Tire T2 + Grip Tire T2 | Invalid: type differs |

These are explanatory names, not new production catalog entries. Two valid matching copies produce one next-tier copy; no extra outputs, bonuses, merge criticals, success percentages, failure chances, destruction, downgrades, rarity combining, affix inheritance, quality rolls or recipe discovery trees are approved. Reject invalid inputs without mutation.

Depth already comes from family/type/tier/tradeoffs/compatibility/road conditions. Stable specialization preserves readable progression and Scavenge targeting instead of interchangeable types or fusion recipes. Needed specialization → relevant source → matching copies → merge upward → equip/test is explanatory, not mandatory implementation sequencing. Source pools, Scrap investment rules, probabilities and unlocks are unchanged.

Special transformation components are an **optional future extension**, outside core merging and not required for VS1 or initial board design. Engine + special modification component → modified/specialized Engine is conceptual only; no component catalog, recipes, transformation rules, acquisition, balance, UI or unlocks are defined.

Direct merging of equipped parts is currently disfavored / expected to require unequipping first, but final interaction behavior depends on Merge Board design. This is pending, not a locked equipped-input prohibition or mandatory unequip workflow. Merging must not unexpectedly modify the running vehicle. Only Equipped Parts affect active stats/visuals; keep Board, Inventory and Equipped Parts distinct without choosing movement or output rules.

Merge Board geometry (grid/non-grid, shape, dimensions), capacity/slot count, expansion, variable-size parts, spatial structure, interaction gesture/workflow, result placement, full-board handling and Inventory transfers remain unresolved. Direct equipped-part merging and whether unequip is required await board design; equipment application timing remains open. Future max-tier handling beyond the existing generic VS1 Tier 3 rejection, special transformation-component rules/future type transformation, merge automation and Auto Merge targeting/configuration remain open. The existing generic three-tier ladder retains Tier 3 merge rejection; this does not settle future specialized max-tier UX or handling.

## 9. Open decisions and implementation boundary
Merge-board dimensions/shape, capacity and expansion; exact Inventory capacity; exact Scrap rewards and first-clear part drops; fuel values/formulas; checkpoint distances; route reset/refill details; offline formula/cap; automation unlocks; checkpoint-selection UI; exact acquisition probabilities/economy; board/move/equip UX and equipment application timing remain unresolved. Existing unbounded storage and numeric acquisition/fuel/reward constants do not lock these new design choices.

The specialization contract above adds its explicit open decisions to this list. This owner-approved correction changes documentation only. No runtime, save version or assets change. D06 preserves existing storage/recovery safeguards and identifies future adaptation. D14 assigns future work without marking implementation complete.

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
