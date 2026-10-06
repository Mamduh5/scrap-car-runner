# Master Game Design

## 1. Game Concept & Pitch
**Concept:** A pixel-art idle + merge car-building / auto-driving progression game.
**Pitch:** Build a questionable machine from scrap, engineer it better, and push farther or farm more efficiently.
**Player Fantasy:** You are a junkyard engineer. You design the machine, and eventually, the systems that operate it.

## 2. Target Audience & Platform
- **Audience:** Fans of idle progression and engineering who enjoy improving builds and production efficiency.
- **Platform:** Mobile web browser first, Android/iOS via Capacitor later. Portrait orientation.
- **Genre:** Idle Engineering / Merge / Auto-Driver / Progression.

## 3. Gameplay Pillars
- **Engineering over Twitch Skill:** Understand vehicle bottlenecks and improve the equipped build.
- **Visible Progression:** Explicitly equipped upgrades change vehicle stats and installed-part visuals.
- **Scrappy Engineering:** Barely functioning junk becomes a more capable machine.
- **Player-directed Efficiency:** Choose whether to push new checkpoints or farm an earlier unlocked route.

## 4. Loops
- **Continuous Run:** Car auto-drives -> consumes fuel -> progresses along Scrapland Highway -> earns Scrap through checkpoint clears -> fuel exhausted or target cannot be completed -> automatic reset/refill/retry on the selected/current checkpoint route.
- **Engineering:** Manually acquire parts and work/merge on the Merge Board, with separate Inventory storage and explicit equipment choices that improve progression or farming efficiency. Exact move/equip UX remains open.
- **Idle Production:** The moving Rustbucket physically represents ongoing production/progression. No required per-attempt Start Run, terminal result screen, Garage return or manual relaunch.

## 5. Checkpoints, Progress and Farming
Checkpoints are recognizable physical road landmarks, not abstract stage-number screens. A Scrap Pile can be the first VS1 landmark type. Fuel stations, guard posts and outposts are future examples, not VS1 requirements.

**Progress / Push** attempts farther/new checkpoints; first clears unlock progression and a one-time bonus, which may award parts. **Farm** intentionally repeats an earlier unlocked/reachable checkpoint or route, even when the car could travel farther. Never force the highest unlocked checkpoint.

Every checkpoint conceptually offers repeatable Scrap and a one-time first-clear bonus. Farther checkpoints normally pay more Scrap **per successful clear**, but completion time determines effective Scrap/time; farther is not automatically more profitable. Improvements, especially speed, can change the optimal farm target. Repeated clears sustain the economy without constant discovery. No final win state is required in VS1.

## 6. Attempt Limits and Diagnostics
Fuel is the basic attempt-cycle limiter. At zero fuel the attempt stops, resets/refills according to the selected/current route and begins again automatically. Severe Engine/Radiator incompatibility may cause critical overheating and catastrophic attempt failure/explosion before the target, followed by checkpoint reset/retry without destroying equipped parts. Exact compatibility/heat thresholds remain open. Existing runtime durability is not a mandatory target-model resource or a basis for per-part health/degradation systems. Feedback should inform engineering without blocking each retry behind a mandatory failure/result flow.

## 7. Garage and Part Locations
The Garage is a focused home/build overview: Rustbucket, equipped parts, important vehicle information, Scrap and navigation. Merge, Inventory and Scavenge need not be permanently embedded in this home view.

Three distinct locations:

- **Merge Board:** Active merge/work area; placement, movement and merging await board design.
- **Inventory:** Owned stored parts off the board and not equipped.
- **Equipped Parts:** Engine, Fuel Tank, Radiator/Cooling, Tires and Suspension installed on the Rustbucket, one slot per family.

**Only Equipped Parts determine active vehicle stats and installed-part visuals**, with chassis base stats. Board or Inventory ownership alone contributes nothing. Merging must never implicitly consume, replace or modify an equipped part. With Engine T1/T2 on the board and Engine T3 equipped, the car uses/displays Engine T3.

## 8. Road and Simulation
Continuous road progression is authoritative state independent of graphics. Phaser renders only the nearby visible region: recycle/despawn far-behind content, activate incoming nearby content and leave far-future content unrendered. Removing graphics never erases progression. This separation supports later stateful/mathematical idle/offline calculation without every visual frame; exact offline rules remain open (D06).

## 9. Art Identity
Chunky pixel art, scrappy machinery and readable feedback. The owner-approved ART-03R Run-side Golden benchmark, references and recorded lifecycle states remain valid and unchanged. Continuous running uses that direction. Garage-side ART-03 remains separate unfinished work.

## 10. First Vertical Slice (VS1)
- One chassis: The Rustbucket.
- Five part families, three tiers each; one currency: Scrap.
- One road: Scrapland Highway, with physical checkpoint progression and repeat farming.
- Continuous automatic attempts alongside manual acquisition, merging and explicit equipping.
- Existing discrete-run runtime is a foundation awaiting adaptation, not completed implementation of this direction (D02/D06/D14).

## 11. Automation and Scope
**Most automation should originate from a manual workflow the player first understands.** Manual acquisition, merging and sorting/movement can later become auto-acquisition, auto-merge and sorting automation. Progression should automate repetitive work so the game increasingly plays parts of itself, rather than only multiplying passive numbers. Unlocks and implementation remain deferred. Continuous auto-drive/retry is the VS1 baseline, not a later automation unlock.

No manual racing, backpack inventory tetris, combat or 3D simulator. Merge-board geometry/capacity/expansion, exact Inventory capacity, rewards, fuel numbers, checkpoint distances, offline formula/cap, automation unlocks, checkpoint-selection UI and acquisition probabilities/economy remain unresolved; do not redesign the board in this correction.

## 12. Core Equipment Specialization and Road-Region Philosophy
Every part has **Family**, **Type/Specialization**, **Tier**, **Tradeoffs** and **Compatibility** as conceptual dimensions. Family identifies the subsystem; type identifies terrain/obstacle/role suitability; tier expresses strength within that type. Compatibility describes interactions with other equipped parts, especially Engine/Radiator. Specialized equipment should usually solve a meaningful problem at a meaningful cost such as weight, speed, fuel use or weaker off-terrain performance; avoid a specialized type that is simply strictly better everywhere.

**Higher tier is not universally best.** A higher-tier wrong type can lose to a lower-tier suitable type on a specific checkpoint/farm route. A speed-focused Engine can suit easy farming while a torque-focused Engine suits hills/heavy load; road-oriented Tires can lose to grip-oriented Tires on loose terrain. These are conceptual comparisons, not approved names, tier counts or stats. D02 defines family roles and further examples; no final catalog is chosen.

Road conditions give parts purpose: hills/resistance pressure Engine performance, sustained load pressures Cooling, loose/slippery surfaces pressure Tires, holes/drops/geometry pressure Suspension and long routes pressure Fuel capacity. Performance should emerge from equipped build plus conditions rather than every checkpoint being a hard stat gate. Inventory retains useful alternatives; acquiring a higher tier must not make every lower/specialized part obsolete.

A **Push Build** overcomes the newest difficult checkpoint; a **Farm Build** prioritizes reliable, fast/efficient repeat clears for Scrap/time, potentially on an earlier unlocked target. Highest-progress and best-farming builds may differ. This is loadout philosophy only: no presets, loadout slots or automatic swapping are approved.

Multiple checkpoints belong to a larger **Road Region / World Region**. Milestones may change environment presentation, terrain grammar, obstacle families, useful/necessary equipment specializations and later acquisition opportunities. Regions reuse authored terrain/obstacle pieces with different challenge composition; every checkpoint need not have unique scenery. A region changes build strategy, not merely a difficulty number. Final names, counts, checkpoint boundaries, requirements and content remain open; no illustrative checkpoint ranges become production data.

Fuel remains the normal attempt limiter. Cooling manages sustained engine load and compatibility: weak/unsuitable cooling can reduce engine performance/speed and indirectly raise fuel use through slower completion. A sufficiently bad Engine/Radiator combination may cause critical heat and catastrophic failure/explosion, automatically retrying with equipment ownership intact. UI should eventually warn before or while driving; formulas/thresholds/presentation remain unresolved. No generic durability failure system is mandated.

Future merges must represent distinct types and cannot silently turn unlike specializations into a generic higher-tier part. Same-family + same-type + same-tier eligibility, cross-type interactions, type evolution and acquisition are all pending decisions. Future acquisition must consider family, type, region, unlocked specializations and player targeting/control; unrestricted randomness may frustrate access to suitable builds. No Scavenge mechanism, pool/drop rate or shop behavior is selected.

Depth comes from family + type + tier + tradeoff + compatibility + road conditions. Excluded without separate approval: random affixes, rarity colors as power systems, rune sockets, skill trees, character stats, random quality/stat rolls, legendary proc effects, equipment durability degradation and permanent part destruction. Exact type catalog/names/stats/weights, compatibility/heat/explosion/terrain/farming formulas, checkpoint requirements, region boundaries/names, merge rules, board geometry, Inventory capacity, acquisition/drop systems, type unlocks and loadout preset systems remain unresolved. This records design only; the existing five-family/three-tier VS1 catalog and ART-03R visual approval are unchanged.
