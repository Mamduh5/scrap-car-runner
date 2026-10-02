# UI/UX and Screen Layouts

## 1. Target Viewports
- **Primary:** 360x640 (Mobile Portrait)
- **Secondary:** 390x844
- UI must scale to fit these aspect ratios. Use relative positioning, not hardcoded absolutes where possible.

## 2. Screen Flow
`Boot` -> `Garage Scene` <-> `Run Scene` -> `Result Modal` (Over Garage or Run)

## 3. Garage & Engineering Screen
**Top Bar:**
- Current Scrap amount.
- Settings button (audio toggle, reset save).

**Middle Area (The Chassis):**
- Visual representation of the car.
- 5 distinct slotted areas with labels: [Engine] [Fuel] [Cooling] [Tires] [Suspension].
- Tapping a slot shows details of the installed part.

**Bottom Area (Inventory & Actions):**
- Scrollable list or grid of uninstalled parts.
- "Scavenge Part (10 Scrap)" button.
- "DRIVE" button (Big, prominent).

**Interactions (VS1):**
- **Install:** Tap a part in inventory -> Tap a valid chassis slot.
- **Uninstall:** Tap an installed part -> Returns to inventory.
- **Merge:** Tap a part -> If a duplicate exists, a "Merge" button appears. Tap to combine into the next tier.

## 4. Run Screen
**Top Area (Telemetry):**
- Large Distance Counter (e.g., "1,240 m").
- Current Speed.
- Pause/Quit button.

**Middle Area (Action):**
- Side-scrolling view of the car driving on the road.
- Parallax background.
- Visual effects: Smoke if Heat > 80%, sputtering if Fuel < 20%, sparks if Durability < 20%.

**Bottom Area (Gauges):**
- **Fuel Bar:** Blue. Empties over time based on consumption.
- **Heat Bar:** Red. Fills up over time based on load vs cooling.
- **Durability Bar:** Green. Empties over time based on road roughness.

## 5. Result Screen (Modal)
- **Header:** "Run Ended!"
- **Cause:** Prominent red text (e.g., "ENGINE OVERHEATED").
- **Stats:**
  - Distance Reached: X m (Highlight if New Record).
  - Peak Heat: X%.
  - Remaining Fuel: X%.
  - Remaining Durability: X%.
- **Rewards:** "Earned X Scrap".
- **Action:** "Return to Garage" button.

## 6. Feedback & Warnings
- **Toasts:** Use brief floating text for errors (e.g., "Not enough Scrap!").
- **Gauges:** Flash red when nearing critical failure thresholds (see `02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md` §3 Warning Thresholds table).

## 7. Boot Scene
The `Boot` scene is a minimal Phaser preload wrapper:
1. Display a simple loading indicator (text or progress bar).
2. Load all assets listed in `04_ART_DIRECTION_AND_ASSET_REGISTRY.md`.
3. Run `SaveManager.load()` to hydrate the game state.
4. Transition directly to `GarageScene`.

No gameplay occurs during Boot. It exists only to preload assets and restore save state before any scene is rendered.

## 8. Garage Slot States

Each chassis slot must visually distinguish the following states:

| State | Visual |
|---|---|
| `empty` | Slot outline with a family icon (e.g., engine icon placeholder). Tapping an empty slot while a part is selected installs the part. |
| `installed` | Shows the part sprite + part name. Tapping uninstalls (moves to inventory). |
| `selected_target` | Highlighted outline (gold). The player has tapped a part in inventory and can now tap an empty slot to install it. |
| `max_tier` | Slot has a small "MAX" badge. Tapping shows part details; no merge is available. |

**Incompatible part targeting:** If the player selects a part in inventory and then taps a slot of the wrong family (e.g., select a Fuel part, tap the Engine slot), show a toast: "Wrong slot type." No state change occurs.

## 9. Pause / Quit Behavior
- Pause is reached via the Pause/Quit button on the Run screen.
- While paused: the simulation tick is halted; gauges are frozen; the background music (if any) stops.
- Options shown: **"Resume"** and **"Quit Run"**.
- **"Quit Run"** triggers the normal result flow at the current distance. Full distance-based Scrap reward is awarded (see `02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md` §4). The failure cause is shown as "Run Abandoned".

## 10. Result Screen Variants

The Result screen always shows Cause, Distance, Rewards, and stat snapshots. The **Cause** line varies:

| Failure Cause | Cause Text | Sub-line Hint |
|---|---|---|
| `Fuel <= 0` | ENGINE STALLED | "Tip: Install or upgrade your Fuel Tank." |
| `Heat >= MaxHeat` | ENGINE OVERHEATED | "Tip: Install or upgrade your Radiator." |
| `Durability <= 0` | BREAKDOWN | "Tip: Install Tires or Suspension for more HP." |
| Run abandoned (quit) | RUN ABANDONED | — |

The hint lines are suggestions, not mandatory UI text. They improve the diagnosis feedback loop and may be toggled off later.

## 11. Start Run Readiness
The "DRIVE" button is always enabled. The player may start a run with no parts installed (bare chassis). This is a valid (if very short) run. The UI does **not** block the player from running with an empty garage.

