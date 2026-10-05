/**
 * ART-02 source — Golden UI Components:
 *   - ui_panel_plate: 32x32 image, alpha binary, nineSlice 8x8 (Primary container panel)
 *   - ui_button_primary: 72x24 sheet (3 frames of 24x24), alpha binary, nineSlice 8x8 (Normal, Pressed, Disabled)
 *   - ui_slot_frame: 120x30 sheet (4 frames of 30x30), alpha binary (Idle, Selected, Valid Target, Blocked)
 */
import { Canvas, strip, rivet } from './canvas.ts';

/**
 * Primary container plate (32x32, alpha binary, nineSlice { left: 8, top: 8, right: 8, bottom: 8 }).
 * Stamped workshop steel plate with 4 corner rivets and a clean, solid dark-steel interior
 * that guarantees high text contrast and zero nine-slice stretching artifacts.
 */
export function drawPanelPlate(): Canvas {
  const c = new Canvas(32, 32);

  // Solid dark floor fill (ink_2 = #31262E) across the whole interior
  c.rect(0, 0, 31, 31, 'ink_2');

  // Outer border perimeter (ink_0)
  c.hline(0, 31, 0, 'ink_0');
  c.hline(0, 31, 31, 'ink_0');
  c.vline(0, 0, 31, 'ink_0');
  c.vline(31, 0, 31, 'ink_0');

  // Top rim bevel (stretches horizontally along x=8..23)
  c.hline(1, 30, 1, 'steel_3');
  c.hline(1, 30, 2, 'steel_2');
  c.hline(1, 30, 3, 'steel_2');
  c.hline(1, 30, 4, 'steel_1');
  c.hline(1, 30, 5, 'steel_0');
  c.hline(1, 30, 6, 'ink_1'); // Recess drop shadow

  // Left rim bevel (stretches vertically along y=8..23)
  c.vline(1, 1, 30, 'steel_3');
  c.vline(2, 1, 30, 'steel_2');
  c.vline(3, 1, 30, 'steel_2');
  c.vline(4, 1, 30, 'steel_1');
  c.vline(5, 1, 30, 'steel_0');
  c.vline(6, 1, 30, 'ink_1'); // Recess drop shadow

  // Right rim bevel (stretches vertically along y=8..23)
  c.vline(25, 1, 30, 'ink_1');
  c.vline(26, 1, 30, 'steel_0');
  c.vline(27, 1, 30, 'steel_1');
  c.vline(28, 1, 30, 'steel_1');
  c.vline(29, 1, 30, 'steel_0');
  c.vline(30, 1, 30, 'steel_0');

  // Bottom rim bevel (stretches horizontally along x=8..23)
  c.hline(1, 30, 25, 'ink_1');
  c.hline(1, 30, 26, 'steel_0');
  c.hline(1, 30, 27, 'steel_1');
  c.hline(1, 30, 28, 'steel_1');
  c.hline(1, 30, 29, 'steel_0');
  c.hline(1, 30, 30, 'steel_0');

  // Restore pure solid ink_2 across the stretching interior (x=7..24, y=7..24)
  c.rect(7, 7, 24, 24, 'ink_2');

  // 4 Industrial Corner Rivets (anchored strictly within the 8x8 nine-slice corners):
  // Top-left corner rivet (within x=0..7, y=0..7)
  rivet(c, 3, 3, 'steel_4', 'steel_0');

  // Top-right corner rivet (within x=24..31, y=0..7)
  rivet(c, 27, 3, 'steel_4', 'steel_0');

  // Bottom-left corner rivet (within x=0..7, y=24..31)
  rivet(c, 3, 27, 'steel_3', 'steel_0');

  // Bottom-right corner rivet (within x=24..31, y=24..31)
  rivet(c, 27, 27, 'steel_3', 'steel_0');

  return c;
}

/**
 * Primary actionable button (72x24 spritesheet, 3 frames of 24x24).
 * Nine-slice: { left: 8, top: 8, right: 8, bottom: 8 }.
 *   Frame 0: Normal state (chunky workshop safety yellow with 3D bottom bevel)
 *   Frame 1: Pressed state (depressed 2px into housing, top shadow)
 *   Frame 2: Disabled state (deactivated matte iron plate)
 */
export function drawButtonPrimary(): Canvas {
  const frames: Canvas[] = [];

  const drawCasing = (f: Canvas) => {
    // Outer outline (ink_0) with chamfered corners
    f.hline(1, 22, 0, 'ink_0');
    f.hline(1, 22, 23, 'ink_0');
    f.vline(0, 1, 22, 'ink_0');
    f.vline(23, 1, 22, 'ink_0');

    // Steel housing (outer rim)
    f.hline(1, 22, 1, 'steel_3'); // Top highlight
    f.hline(1, 22, 2, 'steel_2'); // Top rim
    f.vline(1, 2, 21, 'steel_2'); // Left highlight
    f.vline(2, 3, 20, 'steel_1'); // Left rim
    f.vline(22, 2, 21, 'steel_0'); // Right shadow
    f.vline(21, 3, 20, 'steel_1'); // Right rim
    f.hline(1, 22, 22, 'steel_0'); // Bottom shadow
    f.hline(2, 21, 21, 'steel_1'); // Bottom rim

    // Industrial corner details (anchored to the 8x8 corners)
    f.set(2, 2, 'steel_4');
    f.set(21, 2, 'steel_3');
    f.set(2, 21, 'steel_3');
    f.set(21, 21, 'steel_2');

    // Housing inner drop shadow (recess where button sits)
    f.hline(3, 20, 3, 'ink_2'); // Top recess
    f.vline(3, 4, 19, 'ink_2'); // Left recess
    f.vline(20, 4, 19, 'ink_2'); // Right recess
    f.hline(3, 20, 20, 'ink_2'); // Bottom recess
  };

  // Frame 0: Normal State (24x24)
  {
    const f = new Canvas(24, 24);
    drawCasing(f);

    // The physical yellow button (raised)
    // Base face
    f.rect(4, 4, 19, 19, 'yellow_2');

    // Top-left lighting on the button
    f.hline(4, 19, 4, 'yellow_3');
    f.vline(4, 5, 18, 'yellow_3');

    // Bottom-right shadow of the button
    f.vline(19, 5, 19, 'yellow_1');
    f.hline(4, 19, 18, 'yellow_1');
    
    // Extra thick bottom ledge for mechanical depth
    f.hline(4, 19, 19, 'yellow_0');

    frames.push(f);
  }

  // Frame 1: Pressed State (24x24)
  {
    const f = new Canvas(24, 24);
    drawCasing(f);

    // Top recess shadow (the hole the button slid into)
    f.rect(4, 4, 19, 6, 'ink_2'); // Deep hole
    f.hline(4, 19, 6, 'ink_1');   // Fade out of hole

    // Pressed Button Face
    f.rect(4, 7, 19, 19, 'yellow_2'); // Flat down
    
    // Slight inner bevel to show it's sunk
    f.hline(4, 19, 7, 'yellow_1');
    f.vline(4, 8, 19, 'yellow_1');
    f.vline(19, 8, 19, 'yellow_0');
    
    // Bottom edge is flat against the casing floor
    f.hline(4, 19, 19, 'yellow_0');

    frames.push(f);
  }

  // Frame 2: Disabled State (24x24)
  {
    const f = new Canvas(24, 24);
    drawCasing(f);

    // Button is raised but made of muted iron/steel, implying it's off/inactive.
    f.rect(4, 4, 19, 19, 'steel_1');
    
    // Top-left lighting (muted)
    f.hline(4, 19, 4, 'steel_2');
    f.vline(4, 5, 18, 'steel_2');

    // Bottom-right shadow
    f.vline(19, 5, 19, 'steel_0');
    f.hline(4, 19, 18, 'steel_0');
    
    // Heavy bottom ledge
    f.hline(4, 19, 19, 'ink_2'); 

    frames.push(f);
  }

  return strip(frames);
}

/**
 * Equipment & Inventory Slot Frame (120x30 spritesheet, 4 frames of 30x30).
 * Holds a centered 24x24 part icon with 3px frame rim.
 *   Frame 0: Idle (industrial steel mounting frame, dark ink_2 recess)
 *   Frame 1: Selected (workshop safety yellow active highlight)
 *   Frame 2: Valid Target (hero vehicle teal mounting rim)
 *   Frame 3: Blocked / Disabled (weathered iron/rust rim)
 */
export function drawSlotFrame(): Canvas {
  const frames: Canvas[] = [];

  const drawBaseFrame = (
    rimTop: 'steel_3' | 'yellow_3' | 'teal_4' | 'steel_1',
    rimMain: 'steel_2' | 'yellow_2' | 'teal_3' | 'steel_0',
    rimShade: 'steel_1' | 'yellow_1' | 'teal_2' | 'rust_1',
    rimBottom: 'steel_0' | 'yellow_0' | 'teal_1' | 'rust_0',
    boltHi: 'steel_4' | 'yellow_3' | 'teal_4' | 'rust_2',
    innerGroove: 'ink_1' | 'yellow_0' | 'teal_1' | 'ink_0',
    wellFloor: 'ink_2' | 'ink_1'
  ): Canvas => {
    const f = new Canvas(30, 30);

    // 1px outer outline (ink_0) with 1px chamfered corners
    f.hline(1, 28, 0, 'ink_0');
    f.hline(1, 28, 29, 'ink_0');
    f.vline(0, 1, 28, 'ink_0');
    f.vline(29, 1, 28, 'ink_0');

    // 2px Frame Rim
    // Top
    f.hline(1, 28, 1, rimTop);
    f.hline(2, 27, 2, rimMain);
    // Left
    f.vline(1, 2, 27, rimTop);
    f.vline(2, 3, 26, rimMain);
    // Right
    f.vline(28, 2, 27, rimShade);
    f.vline(27, 3, 26, rimShade);
    // Bottom
    f.hline(1, 28, 28, rimBottom);
    f.hline(2, 27, 27, rimShade);

    // 4 Corner Mounting Bolts
    f.set(3, 3, boltHi);
    f.set(26, 3, boltHi);
    f.set(3, 26, rimMain);
    f.set(26, 26, rimBottom);

    // Recessed 24x24 Interior Well (x=3..26, y=3..26)
    // Floor fill
    f.rect(3, 3, 26, 26, wellFloor);

    // Recess groove shadow (top & left)
    f.hline(3, 26, 3, innerGroove);
    f.vline(3, 4, 26, innerGroove);

    return f;
  };

  // Frame 0: Idle
  frames.push(drawBaseFrame('steel_3', 'steel_2', 'steel_1', 'steel_0', 'steel_4', 'ink_1', 'ink_2'));

  // Frame 1: Selected (Safety Yellow active accent)
  frames.push(drawBaseFrame('yellow_3', 'yellow_2', 'yellow_1', 'yellow_0', 'yellow_3', 'yellow_0', 'ink_2'));

  // Frame 2: Valid Target (Hero Vehicle Teal mount accent)
  frames.push(drawBaseFrame('teal_4', 'teal_3', 'teal_2', 'teal_1', 'teal_4', 'teal_1', 'ink_2'));

  // Frame 3: Blocked / Disabled (Weathered Iron & Rust)
  frames.push(drawBaseFrame('steel_1', 'steel_0', 'rust_1', 'rust_0', 'rust_2', 'ink_0', 'ink_1'));

  return strip(frames);
}
