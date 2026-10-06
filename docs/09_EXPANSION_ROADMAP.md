# Expansion Roadmap

This document outlines the planned expansion of the game AFTER Vertical Slice 1 (VS1) is fully complete and polished.

*Stages 2 onward are future expansion, not VS1 implementation requirements. Stage 1 records the approved VS1 direction.*

## Stage 1: Vertical Slice 1 (Current)
- Continuous auto-drive with automatic fuel-limited reset/refill/retry, physical checkpoints, player-selected Progress/Push or earlier-checkpoint Farm, repeat Scrap and one-time first-clear bonuses; five part families, three tiers, one road and saving. Merge Board, Inventory and Equipped Parts are distinct; only equipped parts affect the car.
- Goal: Prove the fun of the engineering/diagnosis loop.
- **VS1 audio track:** D13 governs Golden Audio production and browser codec/unlock proof during VS1. Full production audio and integrated listening/device acceptance precede presentation-complete VS1 (D14 M3). Native/WebView codec confirmation remains later Android work; it does not block browser-stage sonic approval.

## Approved Scavenge acquisition direction
The core model is multiple Scavenge Sources for family/type pool control and weighting, plus additional Scrap investment for better higher-tier odds. General stays broad/relatively inexpensive/relevant; specialized sources improve targeting at typically higher cost while remaining random, not exact-item shops or universally better loot. Sources may overlap in shared parts such as Cooling. Scrap remains the only approved acquisition currency; any future secondary currency remains an unapproved open possibility.

Sources may unlock through checkpoint/region progress to help pursue equipment for new road problems. Mud/off-road, high-tech and mountain salvage, plus future ice/water/heat/industrial salvage, are concepts only, not final names/catalogs/pools/mappings. Existing sources can scale to higher tiers through investment/progression/future upgrades without mandatory tier-numbered duplicates. All costs, rates, investment controls and unlock/scaling mechanics remain open; no new source content or UI implementation is authorized here.

## Stage 2: Depth & Build Variety
- **More Tiers:** Expand parts up to Tier 5.
- **New Part Families:** Add Transmission (modifies Power curve) and Armor (mitigates specific damage types).
- **Core specialization philosophy:** Family + Type/Specialization + Tier + Tradeoffs + Compatibility is now a core design contract (D01/D02), not merely optional late variety. Future catalog expansion implements it only within separately approved scope: Engine speed/torque/balanced roles, terrain-specific Tires, obstacle-specific Suspension and Engine/Radiator interactions. Fuel Tank types remain unapproved. Names/catalog/stats/unlocks are open; no examples become production definitions.
- **Alternative useful builds:** Type suitability can beat raw tier. Retain push/farm alternatives in Inventory; no preset slots or automatic swapping are chosen. Core merges preserve type and require equal family/type/tier; cross-type fusion is excluded. Optional future transformation rules and exact source catalog/cost/pool/rate/targeting-control/shop details remain explicit future decisions; the source/investment acquisition philosophy above is approved.
- **New Chassis:** Unlock a "Heavy Truck" (more slots, higher weight) and "Speedster" (fewer slots, low weight, high base speed).

## Stage 3: Automating learned manual workflows
**Most automation should originate from a manual workflow the player first understands.** Manual acquisition -> later auto-acquisition; manual merging -> later auto-merge; manual sorting/movement -> later sorting automation. Progression automates repetitive low-level work so the game increasingly plays parts of itself, not merely a passive multiplier. For Scavenge, the manual workflow specifically teaches source selection, investment/cost choice and timing. A later Auto Scavenger may use a selected source/investment and optional Scrap spending limit; this is an example, not final configuration. Exact unlocks, pricing, behavior and spending limits/UI are TBD; no automation implementation is required in VS1.

Continuous auto-drive and automatic retry are the primary VS1 model, not an Auto-Run feature deferred to this stage. Later offline/non-visible calculation builds on authoritative mathematical/stateful progression independent of rendering; exact formula/cap remains open.

## Stage 4: Environments & Hazards
- **Checkpoint landmarks:** Fuel stations, guard posts, outposts and other meaningful locations may follow the VS1 Scrap Pile landmark type. These examples are not new VS1 requirements. Earlier unlocked farming remains selectable; new discovery must not be required for continued Scrap production.
- **Road Region / World Region transitions:** Several checkpoints share a region. Milestones may change environment, terrain grammar, obstacle families, useful/necessary specializations and later acquisition opportunities. Reuse authored terrain/obstacle pieces with different compositions; no unique scenery per checkpoint or final region names/counts/boundaries is locked.
- **Mechanical build changes:** Hills/load pressure Engines/Cooling, loose/slippery surfaces pressure Tires, holes/drops pressure Suspension and long routes pressure Fuel capacity. Regions should change what equipment is useful, rather than only increase difficulty numbers or require the same type at higher tiers forever. Earlier roadmap road names were examples, not final map data; no mandatory durability drain or blanket Radiator-removal strategy is approved.
- **Tradeoffs and safe retry:** Specialized solutions carry meaningful costs; highest-progress and best-Scrap/time builds may differ. Severe Engine/Radiator incompatibility can cause catastrophic overheating/explosion and retry, never equipment deletion. Exact terrain/compatibility/heat/explosion/farming formulas remain open; no degradation, per-part health or mandatory global durability is added.

## Stage 5: Meta Progression (Prestige)
- **Engineering Knowledge:** A system where eventually retiring a maxed-out chassis grants a permanent global currency (Knowledge Points) to upgrade baseline garage efficiency (e.g., cheaper Scavenge costs, base stat multipliers).

## Stage 6: Commercial Polish
- Any additional commercial audio polish builds on the required VS1 audio already produced and accepted under D13; audio production does not begin at this stage.
- Capacitor wrapper for native Android/iOS builds.
- Rewarded ads (e.g., watch an ad for a free Tier 3 part or double run rewards) - strictly optional, no forced interstitials.

## Merge progression boundary
Core merging requires two copies with the **same Family + same Type/Specialization + same Tier**, producing one **next-tier part of the same family and type**. Different families, types or tiers are invalid inputs; matching family and tier alone is insufficient. Type is persistent gameplay identity: no generic, random or hybrid output and no cross-type fusion/recipe graph. Targeted Scavenge supplies matching specialization duplicates; source pools, Scrap investment, probabilities and unlocks remain unchanged.

Special transformation components are an **optional future extension**, outside core merging and not required for VS1 or initial board design. Engine + special modification component → modified/specialized Engine is conceptual only; no component catalog, recipes, transformation rules, acquisition, balance, UI or unlocks are defined.

Direct merging of equipped parts is currently disfavored / expected to require unequipping first, but final interaction behavior depends on Merge Board design. This is pending, not a locked equipped-input prohibition or mandatory unequip workflow. Merging must not unexpectedly modify the running vehicle.

Merge Board geometry (grid/non-grid, shape, dimensions), capacity/slot count, expansion, variable-size parts, spatial structure, interaction gesture/workflow, result placement, full-board handling and Inventory transfers remain unresolved. Direct equipped-part merging and whether unequip is required await board design; equipment application timing remains open. Future max-tier handling beyond the existing generic VS1 Tier 3 rejection, special transformation-component rules/future type transformation, merge automation and Auto Merge targeting/configuration remain open. This records scope only, with no new VS1 requirement or automation design.
