# Expansion Roadmap

This document outlines the planned expansion of the game AFTER Vertical Slice 1 (VS1) is fully complete and polished.

*Stages 2 onward are future expansion, not VS1 implementation requirements. Stage 1 records the approved VS1 direction.*

## Stage 1: Vertical Slice 1 (Current)
- Continuous auto-drive with automatic fuel-limited reset/refill/retry, physical checkpoints, player-selected Progress/Push or earlier-checkpoint Farm, repeat Scrap and one-time first-clear bonuses; five part families, three tiers, one road and saving. Merge Board, Inventory and Equipped Parts are distinct; only equipped parts affect the car.
- Goal: Prove the fun of the engineering/diagnosis loop.
- **VS1 audio track:** D13 governs Golden Audio production and browser codec/unlock proof during VS1. Full production audio and integrated listening/device acceptance precede presentation-complete VS1 (D14 M3). Native/WebView codec confirmation remains later Android work; it does not block browser-stage sonic approval.

## Stage 2: Depth & Build Variety
- **More Tiers:** Expand parts up to Tier 5.
- **New Part Families:** Add Transmission (modifies Power curve) and Armor (mitigates specific damage types).
- **Part Specializations:** Instead of a linear Tier 3 engine, offer a choice: A Tier 3 "Turbo Engine" (High Power, High Heat) vs. Tier 3 "Eco Engine" (Moderate Power, High Fuel Efficiency).
- **New Chassis:** Unlock a "Heavy Truck" (more slots, higher weight) and "Speedster" (fewer slots, low weight, high base speed).

## Stage 3: Automating learned manual workflows
**Most automation should originate from a manual workflow the player first understands.** Manual acquisition -> later auto-acquisition; manual merging -> later auto-merge; manual sorting/movement -> later sorting automation. Progression automates repetitive low-level work so the game increasingly plays parts of itself, not merely a passive multiplier. Exact unlocks, pricing and behavior are TBD; no automation implementation is required in VS1.

Continuous auto-drive and automatic retry are the primary VS1 model, not an Auto-Run feature deferred to this stage. Later offline/non-visible calculation builds on authoritative mathematical/stateful progression independent of rendering; exact formula/cap remains open.

## Stage 4: Environments & Hazards
- **Checkpoint landmarks:** Fuel stations, guard posts, outposts and other meaningful locations may follow the VS1 Scrap Pile landmark type. These examples are not new VS1 requirements. Earlier unlocked farming remains selectable; new discovery must not be required for continued Scrap production.
- **New Roads:** "Glacier Pass" (Extreme Cooling buff, but high traction loss/durability drain). "Desert Highway" (High Heat generation).
- Players must swap their builds (e.g., removing radiators on Glacier Pass to save weight) depending on the environment.

## Stage 5: Meta Progression (Prestige)
- **Engineering Knowledge:** A system where eventually retiring a maxed-out chassis grants a permanent global currency (Knowledge Points) to upgrade baseline garage efficiency (e.g., cheaper Scavenge costs, base stat multipliers).

## Stage 6: Commercial Polish
- Any additional commercial audio polish builds on the required VS1 audio already produced and accepted under D13; audio production does not begin at this stage.
- Capacitor wrapper for native Android/iOS builds.
- Rewarded ads (e.g., watch an ad for a free Tier 3 part or double run rewards) - strictly optional, no forced interstitials.
