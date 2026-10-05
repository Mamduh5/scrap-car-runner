/**
 * ART-02 source — Golden UI Icons:
 *   - icon_scrap: 16x16, cutout, margin 1 (Scrap currency icon: salvaged cog/sprocket with rust bite)
 *   - icon_stat_fuel: 16x16, cutout, margin 1 (Fuel stat icon: rugged stamped fuel jerrycan)
 */
import { Canvas } from './canvas.ts';

/**
 * Scrap currency icon (16x16 canvas, 1px transparent margin).
 * A chunky salvaged metal sprocket/cog with 4 mechanical teeth, central bore,
 * and a weathered rust bite on the lower tooth.
 */
export function drawScrapIcon(): Canvas {
  const c = new Canvas(16, 16);

  // Outer teeth / cog geometry within safe box x=1..14, y=1..14
  // Top tooth (lit from top-right)
  c.rect(6, 1, 9, 3, 'steel_2');
  c.hline(6, 9, 1, 'steel_4');
  c.vline(9, 2, 3, 'steel_4');
  c.vline(6, 2, 3, 'steel_2');

  // Bottom tooth (has a rust patch from salvage)
  c.rect(6, 12, 9, 14, 'rust_2');
  c.hline(6, 9, 14, 'rust_0');
  c.set(8, 12, 'rust_3');
  c.set(9, 12, 'rust_3');
  c.set(6, 13, 'rust_1');

  // Left tooth (shadowed)
  c.rect(1, 6, 3, 9, 'steel_1');
  c.vline(1, 6, 9, 'steel_0');
  c.hline(2, 3, 6, 'steel_2');

  // Right tooth (brightly lit)
  c.rect(12, 6, 14, 9, 'steel_3');
  c.vline(14, 6, 9, 'steel_4');
  c.hline(12, 14, 6, 'steel_4');
  c.hline(12, 14, 9, 'steel_2');

  // Main hub disc (connecting the teeth)
  c.rect(4, 4, 11, 11, 'steel_2');
  // Diagonal bevelled facets of the hub disc
  c.set(4, 4, 'steel_3');
  c.set(5, 4, 'steel_3');
  c.set(4, 5, 'steel_2');

  c.set(10, 4, 'steel_4');
  c.set(11, 4, 'steel_4');
  c.set(11, 5, 'steel_3');

  c.set(4, 10, 'steel_1');
  c.set(4, 11, 'steel_1');
  c.set(5, 11, 'rust_1');

  c.set(10, 11, 'steel_1');
  c.set(11, 10, 'steel_2');
  c.set(11, 11, 'steel_1');

  // Rust bite spreading from bottom-left tooth onto hub face
  c.rect(5, 9, 6, 10, 'rust_2');
  c.set(6, 9, 'rust_3');
  c.set(5, 10, 'rust_1');

  // Center axle bore (clean circular/square mechanical hole)
  c.rect(6, 6, 9, 9, 'steel_0');
  c.rect(7, 7, 8, 8, 'ink_0');
  // Inner lighting of bore
  c.set(6, 6, 'ink_1');
  c.set(9, 7, 'steel_3');
  c.set(9, 8, 'steel_4');
  c.set(8, 9, 'steel_3');
  c.set(7, 9, 'steel_2');

  // Stamped rivet on upper-right hub face
  c.set(9, 5, 'steel_4');
  c.set(10, 5, 'steel_1');

  // Crisp 1px outline (ink_0) around the gear silhouette
  c.outline('ink_0');

  // Verify margin 1 invariant: perimeter must be null
  for (let x = 0; x < 16; x++) { c.set(x, 0, null); c.set(x, 15, null); }
  for (let y = 0; y < 16; y++) { c.set(0, y, null); c.set(15, y, null); }

  return c;
}

/**
 * Fuel stat icon (16x16 canvas, 1px transparent margin).
 * A rugged metal fuel jerrycan in signal fuel blue with steel carry handle,
 * angled corner filler spout, and stamped stiffening ribbing.
 */
export function drawFuelIcon(): Canvas {
  const c = new Canvas(16, 16);

  // Canister body (x=3..12, y=3..14)
  c.rect(3, 4, 12, 14, 'fuel_1');

  // Left shadow column
  c.vline(3, 4, 14, 'fuel_0');
  c.vline(4, 4, 13, 'fuel_0');

  // Right lit highlight column
  c.vline(11, 4, 13, 'fuel_2');
  c.vline(12, 4, 14, 'fuel_3');

  // Top angled shoulder
  c.hline(4, 11, 3, 'fuel_1');
  c.set(4, 3, 'fuel_0');
  c.set(10, 3, 'fuel_2');
  c.set(11, 3, 'fuel_3');

  // Stamped stiffening "X" on can face
  for (let i = 0; i <= 5; i++) {
    c.set(5 + i, 6 + i, 'fuel_2');
    c.set(10 - i, 6 + i, 'fuel_2');
  }
  // Highlight upper edges of X
  c.set(7, 5, 'fuel_3');
  c.set(8, 5, 'fuel_3');
  c.set(5, 6, 'fuel_3');
  c.set(10, 6, 'fuel_3');
  c.set(7, 8, 'fuel_3');
  c.set(8, 8, 'fuel_3');
  // Shadow lower edges of X
  c.set(7, 9, 'fuel_0');
  c.set(8, 9, 'fuel_0');
  c.set(5, 12, 'fuel_0');
  c.set(10, 12, 'fuel_0');

  // Bottom edge shadow
  c.hline(4, 11, 14, 'fuel_0');

  // Small paint scratch exposing steel at bottom right
  c.set(11, 13, 'steel_3');
  c.set(12, 13, 'steel_4');

  // Handle on top (x=5..9, y=1..2)
  c.hline(5, 9, 1, 'steel_3');
  c.hline(6, 8, 1, 'steel_4');
  c.set(5, 2, 'steel_2');
  c.set(9, 2, 'steel_2');
  // Hole under handle is transparent (x=6..8, y=2 is empty)

  // Spout on top-right corner (x=11..12, y=1..2)
  c.set(11, 2, 'steel_2');
  c.set(12, 2, 'steel_3');
  c.set(11, 1, 'steel_4'); // Spout cap
  c.set(12, 1, 'steel_3');

  // Outline (ink_0)
  c.outline('ink_0');

  // Re-verify handle hole cutout is clean transparent
  c.set(6, 2, null);
  c.set(7, 2, null);
  c.set(8, 2, null);

  // Verify margin 1 invariant: perimeter must be null
  for (let x = 0; x < 16; x++) { c.set(x, 0, null); c.set(x, 15, null); }
  for (let y = 0; y < 16; y++) { c.set(0, y, null); c.set(15, y, null); }

  return c;
}
