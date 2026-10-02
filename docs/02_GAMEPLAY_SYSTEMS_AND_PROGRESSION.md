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
- **Start Run Flow:** Click "Drive". The view shifts to the road. The car begins moving automatically.
- **Distance Progression:** Distance increases based on current Speed.
- **Road Difficulty Progression:** As distance increases, the Road Segment changes.
  - *Load Factor:* Simulates uphill/steepness. Increases Heat generation and Fuel consumption.
  - *Roughness:* Increases Durability loss over time.
- **Tick Logic:** Every second (or fixed tick):
  - `Speed = Power / Weight`
  - `Distance += Speed`
  - `Heat += (Power * Load Factor) - Cooling` (min 0)
  - `Fuel -= (Power * Load Factor) / 10`
  - `Durability -= Roughness / (Tire & Suspension mitigation factor)`

## 4. Failure Conditions & Diagnosis (VS1)
A run ends immediately if:
1. `Fuel <= 0` (Failure: "Out of Gas")
2. `Heat >= MaxHeat (e.g., 100)` (Failure: "Engine Overheated")
3. `Durability <= 0` (Failure: "Breakdown")

The Result Screen highlights the exact cause and the peak values of other stats.

## 5. Run Rewards (VS1)
- **Scrap Earned:** `Base (5) + Floor(Distance / 10)`.
- Players always earn a minimum of 5 Scrap to prevent soft-locking, ensuring they can always buy a Tier 1 part (costs 10 Scrap) after at most 2 failed runs.

## 6. Progression & Unlocks
- **Part Progression:** Up to Tier 3 in VS1. Stats scale non-linearly to make merges feel impactful.
- **Future Automation (Do not implement yet):** Auto-scavenge, auto-merge, auto-run.
- **Future Environments (Do not implement yet):** Ice roads, deserts.
- **Future Prestige (Do not implement yet):** Engineering Knowledge points for global upgrades.
