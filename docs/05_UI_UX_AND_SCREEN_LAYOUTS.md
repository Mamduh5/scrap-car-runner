# UI/UX and Screen Layouts

## 1. Target Viewports
- **Browser QA targets (CSS pixels):** 360×640 primary mobile portrait; 390×844 secondary. Physical device pixels equal CSS pixels × DPR. Neither target defines the logical game canvas.
- **Logical art-pixel canvas:** Flexible, with a centred 180×288 safe rectangle and a 216×427 maximum, governed by [pixelViewport.ts](../src/game/config/pixelViewport.ts). Integer device-pixel scaling is applied by `viewportController.ts`.
- Anchor critical UI to the safe rectangle and re-anchor on Phaser resize; backgrounds may bleed into the flexible area. Typography sizes and wrapping require rendered proof on this canvas, not a universal 360-wide layout.

## 2. Screen Flow
`Boot` -> `Garage Scene` <-> `Run Scene` -> `Result Modal` (Over Garage or Run)

## 3. Garage & Engineering Screen
**Top Bar:**
- Current Scrap amount.
- Settings button (audio toggle, reset save).

**Middle Area (The Chassis):**
- Visual representation of the car.
- 5 distinct slotted areas with labels: [Engine] [Fuel] [Cooling] [Tires] [Suspension].
- Installed-slot tap behavior requires the owner decision below; do not assume details or immediate uninstall.

**Bottom Area (Inventory & Actions):**
- Scrollable list or grid of uninstalled parts.
- "Scavenge Part (10 Scrap)" button.
- "DRIVE" button (Big, prominent).

**Interactions (VS1):**
- **Install:** Tap a part in inventory -> Tap a valid chassis slot.
- **Uninstall:** An explicit uninstall command returns the part to inventory through `GameStateService.uninstallPart(targetSlot)`. Its UI trigger awaits the installed-slot decision below.
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
- **Gauges:** Flash red when nearing critical failure thresholds (see `02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md` §8).

## 7. Boot Scene
The `Boot` scene is a minimal Phaser preload wrapper:
1. Display a simple loading indicator (text or progress bar).
2. Load production assets from `src/game/assets/assetRegistry.ts` with registered keys, frame/font contracts and visible failure handling; D04 supplies visual identity, not an asset list.
3. Consume the already-initialized GameStateService provided by application composition; do not load progress again in a scene.
4. Transition directly to `GarageScene`.

No gameplay occurs during Boot. Application composition hydrates progress before Phaser boots. The current foundation displays technical diagnostics only; asset loading and Garage transition are future work.

## 8. Garage Slot States

Each chassis slot must visually distinguish the following states:

| State | Visual |
|---|---|
| `empty` | Slot outline with a family icon (e.g., engine icon placeholder). Tapping an empty slot while a part is selected installs the part. |
| `installed` | Shows the part sprite + part name. Tap behavior awaits the owner decision below. |
| `selected_target` | Highlighted outline (gold). The player has tapped a part in inventory and can now tap an empty slot to install it. |
| `max_tier` | Slot has a small "MAX" badge; no merge is available. Tap/details/uninstall behavior awaits the same owner decision. |

### OWNER DECISION REQUIRED — INSTALLED SLOT TAP

Earlier wording conflicted: §3 said tap shows installed-part details, while §3 uninstall and §8 installed state said tap immediately uninstalls; MAX-tier tap also said details. D02/D06 and `GameStateService` define valid install/swap/uninstall commands, but do not select a player-facing gesture. Codex cannot infer that product choice from command availability.

Before GAR-01 becomes READY, the owner must decide the default installed-slot tap action and how details and uninstall are reached, including MAX-tier parts and occupied-slot targeting while an inventory part is selected. This affects selection, detail presentation, uninstall feedback and accidental removal. Installation/swap conservation and max-tier merge rejection remain service-owned. GAR-01 remains BACKLOG / not READY until this decision and its other dependencies are satisfied; DOC-01 and VAL-01/02/03 are not blocked.

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
Once initialized, foreground, and neither reset/version-blocked nor already running, the "DRIVE" button may start even a bare chassis. The player may start a run with no parts installed (bare chassis). This is a valid run. The UI does **not** block the player from running with an empty garage.


## 12. State, persistence and lifecycle integration
Read cached GameStateService.currentState snapshots. Send installPart(partId, targetSlot) explicitly; service decides compatibility and conservation. Stored + installed merges are atomic, clear the consumed slot and leave output in inventory (prefer two stored inputs when available). Reflect persistenceStatus pending/error/blocked; expose retry and explicit reset for unsupported versions when Settings is built. Do not treat those states as safely saved. Garage requests `startRun()`; the service calculates frozen vehicle stats and issues the original token plus initial RunState. Display `currentVehicleStats` in Garage; do not calculate authoritative stats there. Future RunScene owns evolving ephemeral RunState and calls `advanceRun(originalToken, runState, road, deltaMs / 1000)`, which delegates to existing domain simulation. Hidden runs pause; discard first resume delta. Terminal callbacks settle through `recordRunResult(originalToken, terminalState)`; the service validates completion, calculates rewards, consumes eligibility and updates progress. Present reward/record changes from the successful settled transition; do not independently award rewards or mutate saves. Show settlement rejection; service idempotency guards repeated callbacks. Peak heat telemetry remains a future scene responsibility.

## 13. Typography input contract

Semantic role names are governed by [UI_TYPOGRAPHY](../src/ui/theme/typography.ts): `gameTitle`, `screenTitle`, `sectionHeader`, `buttonPrimary`, `buttonSecondary`, `distanceCounter`, `currency`, `statLabel`, `statValue`, `body`, `caption`, `partName`, `tierLabel`, `resultCause`, `warning`, `criticalWarning`, `success`, `toast`. Preserve those roles and the Silkscreen display / VT323 body identity.

Registered bitmap runtime/cache keys are `font_display` and `font_body`, with PNG/XML exports defined by the visual registry. Existing token `family` values still use family names even for bitmap roles; TYPO-01 must supply explicit renderer/key mapping. Family names remain appropriate for ordinary Text roles. A style helper does not load fonts or establish production rendering.

The token’s 360×640 comment and 320-wide wraps are known unproven legacy assumptions. Sizes, line heights and wrapping are provisional until TYPO-01/02 render the existing roles in actual AP panels/backgrounds at the browser QA targets. Do not copy those values as final layout rules or redesign font identity without evidence.
