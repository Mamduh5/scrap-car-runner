# ART-02 Style Reference — Golden UI Samples

This document summarizes the interface visual grammar established in the ART-02 Golden UI production, extending the ART-01 vehicle benchmark into interface components.

## 1. UI Visual Pillars
- **Workshop Engineering:** UI components feel forged and assembled from the same scrapyard materials as the vehicles (stamped steel plates, corner rivets, machined bevels).
- **Tactile Feedback:** Controls have physical mechanical travel (buttons have thick bottom ledges that depress on click).
- **High Interaction Contrast:** Crisp `ink_0` outlines, directional lighting from the top-right, and clean negative space ensuring high readability on mobile viewports.
- **Strict Palette Indexing:** All pixels strictly use canonical colours from `src/game/assets/palette.ts`.

## 2. Icon Language
- **Currency (`icon_scrap`, 16x16, 1px margin):**
  - Represents salvage machine material, not generic coins or gems.
  - Form: Chunky 4-toothed mechanical cog/sprocket with a central axle bore.
  - Scrapyard detail: Weathered rust bite (`rust_2`/`rust_3`) on the lower tooth, demonstrating it was salvaged from a junked chassis.
  - Margin: Strictly 1px transparent border around the 16x16 canvas.
- **Resource / Stat (`icon_stat_fuel`, 16x16, 1px margin):**
  - Represents combustible liquid capacity.
  - Form: Classic metal jerrycan with top carry handle, corner spout cap, and stamped stiffening "X" ribbing.
  - Colour: Signal fuel blue (`fuel_0`–`fuel_3`), directly matching the fuel gauge bar in RunScene.
  - Margin: Strictly 1px transparent border around the 16x16 canvas.

## 3. Panel Container Language (`ui_panel_plate`, 32x32)
- **Nine-Slice Contract:** `left: 8, top: 8, right: 8, bottom: 8`.
- **Border Rim:** 2–3px stamped steel bevel with `steel_3` highlight along top/left, `steel_0` shadow along bottom/right, and a recessed `ink_1` inner shadow.
- **Corner Anchors:** Industrial 2x2 bolt heads (`steel_4`/`steel_0`) positioned at (3,3), (27,3), (3,27), and (27,27), strictly inside the 8x8 corner regions.
- **Interior Negative Space:** The interior stretching field (x=7..24, y=7..24) is a uniform, solid dark steel plate (`ink_2` = `#31262E`). This guarantees that arbitrary nine-slice stretching produces flawless, flat surfaces with high contrast for text and part icons.

## 4. Action Button Language (`ui_button_primary`, 72x24, 3 frames)
- **Nine-Slice Contract:** `left: 8, top: 8, right: 8, bottom: 8`.
- **Frame 0 (Normal):** Chunky workshop safety-yellow face (`yellow_2`) with bright top highlight (`yellow_3`) and heavy 3D bottom bevel (`yellow_0`), providing clear interactive call-to-action emphasis. Intended for `ink_0` text labels.
- **Frame 1 (Pressed):** Physically depressed 2px into housing. Top edge drops into shadow (`yellow_0`), and bottom 3D ledge collapses.
- **Frame 2 (Disabled):** Cold matte grey industrial plate (`steel_1`/`steel_0`) indicating inactive/deactivated state.

## 5. Slot Frame Language (`ui_slot_frame`, 120x30, 4 frames)
- **Dimensions:** 30x30 per frame. Sized to hold 24x24 part icons centered at offset (3,3) with zero clipping.
- **Frame 0 (Idle):** Neutral steel mounting rim (`steel_2`) with chamfered corners and dark `ink_2` recess.
- **Frame 1 (Selected):** Active workshop safety-yellow rim (`yellow_2`/`yellow_3`), indicating current user focus.
- **Frame 2 (Valid Target):** Hero vehicle teal rim (`teal_3`/`teal_4`), indicating compatible chassis install/merge destination.
- **Frame 3 (Blocked / Disabled):** Weathered iron and rust rim (`steel_0`/`rust_1`), indicating locked/incompatible slot.

## 6. Prohibited Visual Drift
- ❌ No glossy gradients, glassmorphism, or modern SaaS button styling.
- ❌ No decorative noise in the center of panels or buttons that impairs future typography readability.
- ❌ No anti-aliasing or fractional alpha (strict binary/cutout alpha only).
- ❌ No off-palette colors.
