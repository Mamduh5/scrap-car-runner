# Master Game Design

## 1. Game Concept & Pitch
**Concept:** A pixel-art idle engineering / auto-driving progression game.
**Pitch:** Build a questionable machine from scrap, engineer it better, and see how far it survives.
**Player Fantasy:** You are a junkyard engineer. You design the machine, and eventually, the systems that operate it.

## 2. Target Audience & Platform
- **Audience:** Fans of progression, idle, and engineering games who enjoy tweaking builds and seeing numbers go up.
- **Platform:** Mobile web browser (first), Android/iOS via Capacitor (later). Portrait orientation.
- **Genre:** Idle Engineering / Auto-Battler (Auto-Driver) / Progression.

## 3. Gameplay Pillars
- **Diagnosis over Twitch Skill:** Success comes from understanding why the car failed and fixing it in the garage.
- **Visible Progression:** Upgrades should have tangible visual and numerical impacts.
- **Scrappy Engineering:** The game should feel like you are patching together barely functioning junk that miraculously works.

## 4. Loops
- **Moment-to-Moment:** Watch the car drive, monitor gauges (Heat, Fuel, Durability), and anticipate failure.
- **Run Loop:** Start Run -> Auto-Drive -> Accumulate Distance -> Fail -> Diagnose -> Earn Scrap.
- **Meta Loop (Garage):** Spend Scrap to get Parts -> Merge Parts -> Install Parts on Chassis -> Return to Run.

## 5. Win / Progression Concept
There is no final "win" state in VS1, only distance records. Progression is measured by reaching new road milestones, unlocking new environments (later), and building higher-tier parts.

## 6. Failure Philosophy
Failure is not a punishment; it is information. The game explicitly tells the player *why* the run ended (e.g., "Out of Fuel", "Engine Overheated", "Suspension Broke"). This informs their next engineering decision.

## 7. Garage Fantasy
A cluttered, greasy workbench. The player slots parts into dedicated chassis areas (Engine, Fuel, Cooling, Tires, Suspension). Merging is simple and satisfying (2 identical parts = 1 higher tier). No backpack management.

## 8. Road Fantasy
A treacherous, procedurally extending highway. It starts flat and smooth, but becomes steep, rocky, and hot, constantly increasing the load on the vehicle's systems.

## 9. Art Identity
Pixel art with a limited palette. Expressive animations for vehicle feedback (smoke, sparks, glowing red engines). Clean, readable UI that doesn't obstruct the action.

## 10. First Vertical Slice (VS1)
- 1 Chassis ("The Rustbucket")
- 5 Part Families (Engine, Fuel Tank, Radiator, Tires, Suspension)
- 3 Tiers per Family
- 1 Currency ("Scrap")
- 1 Road ("Scrapland Highway")
- Core flow: Scavenge -> Merge -> Install -> Run -> Fail -> Reward.

## 11. Explicit Non-Goals
The game will NOT become:
- A manual racing game.
- A grid-based backpack inventory game.
- A combat-focused vehicle game (no guns, no zombies).
- A 3D realistic simulator.
