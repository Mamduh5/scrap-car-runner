/**
 * ART-02 source — minimal indexed pixel canvas re-exported from ART-01 with UI drawing utilities.
 */
import { Canvas, strip, type Px } from '../art01/canvas.ts';
import type { PaletteName } from '../../../../src/game/assets/palette.ts';

export { Canvas, strip, type Px };

/** Draw a 1px rivet / bolt head with a lit upper-right and shaded lower-left. */
export function rivet(c: Canvas, x: number, y: number, hi: PaletteName = 'steel_4', sh: PaletteName = 'steel_0'): void {
  c.set(x, y, hi);
  c.set(x + 1, y, hi);
  c.set(x, y + 1, sh);
  c.set(x + 1, y + 1, sh);
}
