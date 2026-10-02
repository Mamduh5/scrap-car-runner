# Gameplay Systems and Progression

## 1. Garage & Engineering (VS1)
- **Part Acquisition:** The player spends "Scrap" to "Scavenge", which yields a random Tier 1 part from the 5 core families.
- **Merge System:** 2 identical parts of Tier N -> 1 part of Tier N+1. Merging is instant and free.
- **Vehicle Installation:** The chassis has 5 dedicated categorical slots: Engine, Fuel, Cooling, Tires, Suspension. One part per slot.
- **Vehicle Calculation:** Total Stats = Chassis Base Stats + Sum of Installed Parts' Stats.

## 2. Core Stats (VS1)
- **Power:** Determines base speed. Higher speed = faster distance gain, but generates more Heat and consumes more Fuel per second.
- **Fuel Capacity:** Maximum fuel.
- **Cooling:** Reduces Heat accumulation.
- **Durability:** Health of the vehicle. Reduced by rough terrain.
- **Weight:** Acts as a divider on Power for actual Speed. `Speed = Power / Weight`.

## 3. Run Simulation (VS1)
- **Start Run Flow:** Tap "Drive". The view shifts to the road. The car begins moving automatically.
- **Distance Progression:** Distance (in metres) increases based on current Speed each tick.
- **Road Difficulty Progression:** As distance increases, the Road Segment changes (see `03_GAME_DATA_BIBLE.md` for segment definitions).
  - *Load Factor:* Simulates uphill/steepness. Increases Heat generation and Fuel consumption.
  - *Roughness:* Increases Durability loss per second.

### Tick Logic (per-second rates, delta-normalised)

All formula values below are **per-second rates**. The simulation function receives `delta` (seconds elapsed since last frame). Each quantity is multiplied by `delta` before being applied.

```
dt = delta_ms / 1000          // convert Phaser delta (ms) to seconds

Speed (m/s) = Power / Weight  // computed once per tick; used for distance and fuel

Distance  += Speed * dt

HeatDelta  = (Power * LoadFactor) - Cooling
Heat       = clamp(Heat + HeatDelta * dt, 0, MaxHeat)

Fuel       = max(0, Fuel - (Power * LoadFactor / 10) * dt)

Durability = max(0, Durability - Roughness * dt)
```

**Notes on the formulas:**
- `Speed` is in metres per second (m/s). `Power / Weight` with base values (Power 10, Weight 100) gives 0.1 m/s. A fully-loaded T1 car (Power 20, Weight 110) gives ≈ 0.18 m/s. A T3 car (Power 70+, Weight 125+) gives roughly 0.5 m/s. These values require playtesting; units are internally consistent.
- Fuel consumption at base stats (Power 10, LoadFactor 1.0) = 1.0 per second. Base Fuel = 20, so the bare chassis lasts 20 seconds ≈ 2m. The player **must install at least a Fuel Tank** to have a meaningful first run; starting conditions below enforce this.
- `Roughness` directly subtracts from Durability per second. **Tires and Suspension do not reduce the damage rate; they increase the Durability HP pool.** This is intentional for VS1 simplicity. Future tiers may add a `damageResist` stat to those families.
- `HeatDelta` may be negative (cooling exceeds generation). `clamp` prevents Heat going below 0 or above `MaxHeat`.
- `MaxHeat` is a fixed chassis property (see `03_GAME_DATA_BIBLE.md`). It does not change with installed parts in VS1.

> **Balance Calibration Warning (from `node tools/sim-check.js`):**
> At documented starting values, the Heat system is very aggressive. A starter build (engine_t1 + fuel_t1, no radiator) overheats in ~7 seconds, travelling ~1 metre. A T1 full build with `cooling_t1` overheats in ~20 seconds, reaching ~3m. A T3 full build overheats in ~20 seconds reaching ~10m — limited entirely by fuel.
>
> **This is acceptable as provisional scaffolding.** The formula structure is correct and internally consistent. The numbers below need adjustment during playtesting. Recommended first tuning pass: reduce the Heat generation divisor (e.g., `Power * LoadFactor / 20` instead of `/10` equivalent), or increase base Cooling, or reduce the Heat accumulation coefficient.
>
> **Do not change the formula structure during implementation — only change the coefficient values after playtesting.** Run `node tools/sim-check.js` after each balance adjustment.

### Warning Thresholds (for UI and visual effects)

| Condition | Threshold | Visual Cue |
|---|---|---|
| Low Fuel | `Fuel / FuelCapacity < 0.20` | Fuel bar flashes; engine sputtering effect |
| High Heat | `Heat / MaxHeat > 0.80` | Heat bar flashes; heavy smoke effect |
| Critical Durability | `Durability / MaxDurability < 0.20` | Durability bar flashes; sparks effect |

`MaxDurability` is the total Durability calculated at run start (`ChassisBase.durability + sum of installed part durability bonuses`). It does not change during the run.

## 4. Failure Conditions & Diagnosis (VS1)
A run ends immediately if:
1. `Fuel <= 0` (Failure: "Out of Gas")
2. `Heat >= MaxHeat` (Failure: "Engine Overheated")
3. `Durability <= 0` (Failure: "Breakdown")

The Result Screen highlights the exact cause and the peak values of other stats.

**Mid-Run Quit:** If the player taps Pause then "Quit Run", the run ends as if it failed at the current distance. The full distance-based Scrap reward is calculated and awarded (not zeroed). This prevents punishment for quitting and avoids confusion about reward mechanics.

## 5. Run Rewards (VS1)
- **Scrap Earned:** `Base (5) + Floor(Distance / 10)`.
- Players always earn a minimum of 5 Scrap to prevent soft-locking, ensuring they can always buy a Tier 1 part (costs 10 Scrap) after at most 2 failed runs.

## 6. Inventory & Part Lifecycle (VS1)

### Inventory Capacity
- **Unbounded in VS1.** The player may hold any number of parts. No inventory management pressure is intended for VS1.

### Part States
| State | Description |
|---|---|
| `stored` | In inventory; not installed. |
| `installed` | In a chassis slot; contributes to vehicle stats. |
| `consumed` | Destroyed as an input to a successful merge. |
| `max_tier` | Tier 3; cannot be merged further. |

### Max-Tier Duplicate Behavior
If the player holds two or more `Tier 3` (max-tier) parts of the same family, the extras remain in inventory in `stored` state. They cannot be merged and **cannot be sold in VS1** (no sell mechanic exists). This is a minor dead-end acknowledged as acceptable for VS1. A `sell` action or part-recycling mechanism is planned for Stage 2 (see `09_EXPANSION_ROADMAP.md`). The implementer must not invent a sell mechanic to solve this — simply do not prevent the player from accumulating them.

### Merge Eligibility
A merge is available if and only if:
- The player holds ≥ 2 `stored` parts with the **same `id`** (i.e., same family AND same tier).
- The part is not yet at max tier (Tier 3 in VS1).
- One of the two selected parts may be currently `installed`; the installed part is uninstalled first, then both are consumed, and the merged part is placed in inventory as `stored`.

### Scavenge Weighting
Each Scavenge yields exactly one random Tier 1 part. All 5 families have **equal probability (20% each)** in VS1. No duplicate protection exists. Bad luck (e.g., receiving 5 consecutive `fuel_t1` parts) is recoverable because installed duplicates can be merged and excess stored duplicates are harmless.

### Save Triggers
The save is written to `localStorage` after:
- Scavenge (part added to inventory)
- Merge (parts consumed, new part created)
- Install (part moved from inventory to slot)
- **Uninstall** (part moved from slot to inventory)
- Run End (distance, scrap, bestDistance updated)

## 7. Starting State (New Save)

When a new save is created (first launch or explicit reset):
- **Scrap:** 0
- **Installed Parts:** All 5 slots empty (`null`).
- **Inventory:** Contains the following starter parts pre-installed for the first run:
  - `engine_t1` (1×)
  - `fuel_t1` (1×)
- **Best Distance:** 0

**Rationale:** Starting with an empty garage and 0 Scrap would leave the player unable to run at all. Providing two starter parts (engine and fuel) gives a minimally functional vehicle and gives the player a meaningful first run. The player sees: "I ran out of fuel fast; I should scavenge another fuel tank and merge for better capacity."

> These two starter parts are placed in the **inventory** (not pre-installed), so the player must manually slot them. This teaches the install interaction on the very first session.

## 8. Progression & Unlocks
- **Part Progression:** Up to Tier 3 in VS1. Stats scale non-linearly to make merges feel impactful.
- **Future Automation (Do not implement yet):** Auto-scavenge, auto-merge, auto-run.
- **Future Environments (Do not implement yet):** Ice roads, deserts.
- **Future Prestige (Do not implement yet):** Engineering Knowledge points for global upgrades.

