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
- **Gauges:** Flash red when nearing critical failure thresholds.
