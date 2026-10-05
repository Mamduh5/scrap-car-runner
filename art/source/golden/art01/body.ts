/**
 * ART-01 source — veh_rustbucket_body (112x56, cutout). Side view, faces right.
 *
 * Registration contract (shared by every overlay; tires are separate 24x24 sheets):
 *   rear wheel centre (26,44), front wheel centre (86,44), wheel radius 11, ground row y=55.
 *   ENGINE bay   : open notch in the hood, x72..94 (far wall y25..27, near lip y28).
 *   FUEL zone    : open pickup bed above the near wall, x8..30, y<=26.
 *   COOLING zone : bare nose, x>=105 (radiator is strapped on in front of the bumper).
 *   SUSPENSION   : wheel arches (flare lips) at y>=30 around both wheels.
 * Panels are deliberately mismatched: teal cab (hero paint), steel hood, rust bed.
 */
import { Canvas, type Px } from './canvas.ts';

export const BODY = { w: 112, h: 56 } as const;
export const WHEEL_CENTRES = { rear: { x: 26, y: 44 }, front: { x: 86, y: 44 } } as const;

/** 2x2 bolt head: lit top row, shadowed bottom row. */
export function bolt(c: Canvas, x: number, y: number): void {
  c.hline(x, x + 1, y, 'steel_3');
  c.hline(x, x + 1, y + 1, 'steel_1');
}

export function drawBody(): Canvas {
  const c = new Canvas(BODY.w, BODY.h);

  // ---- chassis rail --------------------------------------------------------------------
  c.plate(5, 40, 104, 42, 'steel_1', 'steel_2', 'ink_1');

  // ---- pickup bed (rear) ---------------------------------------------------------------
  c.hline(6, 30, 24, 'rust_2');                 // far wall rim, lit
  c.hline(6, 30, 25, 'rust_0');
  c.hline(6, 30, 26, 'ink_1');                  // dark bed interior
  c.rect(5, 27, 30, 39, 'rust_2');              // near wall
  c.hline(5, 30, 27, 'rust_3');                 // folded lip, lit
  c.hline(5, 30, 28, 'rust_3');
  c.hline(5, 30, 39, 'rust_1');
  c.vline(5, 27, 39, 'rust_1');                 // crumpled rear edge
  c.vline(6, 29, 38, 'rust_1');
  // corrugation ridges (irregular spacing = hand-fitted sheet)
  for (const x of [9, 13, 27, 30]) { c.vline(x, 30, 37, 'rust_1'); c.vline(x + 1, 30, 36, 'rust_3'); }
  // salvaged steel patch, screwed on
  c.plate(15, 30, 25, 37, 'steel_2', 'steel_3', 'steel_1');
  c.vline(15, 31, 36, 'steel_1');
  c.vline(25, 31, 36, 'steel_1');
  bolt(c, 16, 31); bolt(c, 23, 31); bolt(c, 16, 34); bolt(c, 23, 34);
  c.rect(19, 33, 20, 35, 'rust_2');             // rust bleeding from the patch
  c.rect(20, 35, 21, 36, 'rust_1');
  // bottom rot
  c.rect(7, 36, 12, 38, 'rust_1');
  c.rect(8, 35, 10, 35, 'rust_1');
  c.rect(7, 36, 8, 36, 'rust_0');
  c.rect(27, 35, 30, 38, 'rust_1');
  // tailgate hinge + rear bumper bar
  c.plate(3, 36, 8, 40, 'steel_2', 'steel_3', 'steel_1');
  bolt(c, 4, 37);
  c.rect(6, 33, 7, 35, 'steel_1');              // hanging chain stub
  c.rect(6, 34, 6, 35, 'steel_2');

  // ---- cabin (teal hero paint) ------------------------------------------------------------
  c.poly([[31, 41], [31, 16], [35, 9], [57, 9], [66, 25], [66, 41]], 'teal_2');
  c.hline(36, 56, 9, 'teal_3');                 // roof top highlight
  c.hline(35, 58, 10, 'teal_2');
  c.hline(34, 59, 11, 'teal_1');
  c.hline(33, 59, 12, 'teal_1');
  c.vline(31, 17, 40, 'teal_1');                // rear shadow edge
  c.vline(32, 20, 24, 'teal_1');
  c.hline(36, 65, 23, 'teal_3');                // belt line highlight
  // window
  c.poly([[36, 13], [55.5, 13], [60.6, 22], [36, 22]], 'ink_1');
  c.rect(37, 16, 41, 22, 'ink_2');              // seat back (nobody home: the car drives itself)
  c.rect(38, 14, 40, 15, 'ink_2');
  const glass: Px[] = ['ink_1', 'ink_2'];
  const stripe = (pts: readonly (readonly [number, number])[], col: Px): void => {
    const t = new Canvas(BODY.w, BODY.h); t.poly(pts, col);
    for (let y = 0; y < BODY.h; y++) for (let x = 0; x < BODY.w; x++) if (t.get(x, y) !== null && glass.includes(c.get(x, y))) c.set(x, y, col);
  };
  stripe([[43, 22], [47, 22], [52, 13], [48, 13]], 'steel_2');   // broad glass glare
  stripe([[49, 22], [51, 22], [55, 13], [53, 13]], 'steel_3');   // narrow glare
  // duct-tape X over the cracked corner
  for (const [x0, y0, x1, y1] of [[52, 14, 58, 21], [58, 14, 52, 21]] as const) {
    for (let t = 0; t <= 1; t++) {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      for (let i = 0; i <= n; i++) {
        const x = Math.round(x0 + ((x1 - x0) * i) / n) + t, y = Math.round(y0 + ((y1 - y0) * i) / n);
        if (['ink_1', 'ink_2', 'steel_2', 'steel_3'].includes(c.get(x, y) as string)) c.set(x, y, t === 0 ? 'paper_1' : 'paper_0');
      }
    }
  }
  // rear quarter + steel patch
  c.vline(37, 25, 40, 'ink_1');
  c.plate(32, 29, 35, 36, 'steel_2', 'steel_3', 'steel_1');
  bolt(c, 33, 31);
  // door (replacement panel, darker teal) + handle
  c.rect(38, 25, 61, 40, 'teal_1');
  c.hline(38, 61, 25, 'teal_2');
  c.vline(38, 26, 40, 'ink_1');
  c.vline(61, 26, 40, 'ink_1');
  c.hline(39, 60, 26, 'teal_2');
  c.hline(56, 59, 29, 'steel_3');
  c.hline(56, 59, 30, 'steel_1');
  // door rust bite (chewed from the bottom edge up, with a lit leading edge)
  c.rect(40, 38, 53, 40, 'rust_2');
  c.rect(42, 36, 47, 37, 'rust_2');
  c.rect(49, 36, 51, 37, 'rust_2');
  c.rect(43, 35, 45, 35, 'rust_3');
  c.rect(42, 36, 43, 36, 'rust_3');
  c.rect(40, 40, 53, 40, 'rust_1');
  c.rect(46, 38, 47, 39, 'rust_1');
  c.rect(51, 38, 52, 38, 'rust_3');
  // dent: a darker crease across the door skin, lit on its lower lip
  c.hline(46, 52, 31, 'teal_0');
  c.hline(44, 50, 32, 'teal_0');
  c.hline(45, 51, 33, 'teal_2');
  // door hinge plates
  c.rect(39, 28, 40, 30, 'steel_1');
  c.rect(39, 35, 40, 36, 'steel_1');
  // cab front pillar
  c.vline(65, 25, 40, 'teal_1');
  // wing mirror on a bent wire arm
  c.line(62, 25, 65, 22, 'steel_1');
  c.rect(65, 20, 67, 23, 'steel_2');
  c.hline(65, 67, 20, 'steel_3');
  c.vline(67, 21, 23, 'steel_1');

  // ---- hood: steel panels, open engine bay --------------------------------------------------
  c.plate(66, 26, 71, 40, 'steel_2', 'steel_3', 'steel_1');
  c.vline(66, 26, 40, 'ink_1');
  for (const y of [29, 32, 35]) {                // three hand-cut louvers
    c.line(67, y + 2, 70, y, 'ink_1');
    c.line(67, y + 3, 70, y + 1, 'steel_3');
  }
  c.hline(72, 94, 25, 'steel_2');               // far fender rim
  c.rect(72, 26, 94, 27, 'ink_1');              // bay interior (what the engine fills)
  c.rect(74, 26, 77, 27, 'steel_0');            // motor mounts
  c.rect(89, 26, 92, 27, 'steel_0');
  c.hline(74, 77, 26, 'steel_1');
  c.hline(89, 92, 26, 'steel_1');
  c.rect(72, 28, 94, 40, 'steel_2');            // near fender, lower than the far side
  c.hline(72, 94, 28, 'steel_3');
  c.vline(72, 29, 40, 'steel_1');               // fender rear edge seam
  c.rect(73, 30, 75, 33, 'rust_2');             // rust patch on fender
  c.rect(73, 30, 74, 30, 'rust_3');
  // hood nose (right)
  c.plate(95, 26, 104, 40, 'steel_2', 'steel_3', 'steel_1');
  c.hline(95, 104, 27, 'steel_3');
  c.rect(95, 28, 96, 40, 'steel_1');
  c.rect(95, 28, 95, 40, 'steel_0');
  c.rect(98, 29, 100, 31, 'rust_2');            // rust bloom bleeding onto the nose
  c.rect(98, 29, 99, 29, 'rust_3');
  c.rect(98, 32, 99, 34, 'rust_1');
  c.rect(98, 35, 104, 40, 'steel_1');
  // headlight (profile): small salvaged lamp, yellow_2 lens
  c.rect(103, 29, 106, 32, 'ink_0');
  c.rect(104, 29, 106, 31, 'yellow_2');
  c.hline(104, 105, 29, 'yellow_3');
  c.hline(104, 106, 31, 'yellow_1');
  c.rect(103, 33, 104, 34, 'steel_3');
  // front bumper (bent: right end sags one row)
  c.plate(97, 38, 103, 40, 'steel_2', 'steel_3', 'steel_1');
  c.plate(104, 39, 107, 41, 'steel_2', 'steel_3', 'steel_1');
  bolt(c, 98, 38);

  // ---- wheel arches: dark well + flare lip (lit on the upper right) ---------------------------
  for (const { x: cx, y: cy } of [WHEEL_CENTRES.rear, WHEEL_CENTRES.front]) {
    for (let y = cy - 15; y <= 42; y++) for (let x = cx - 15; x <= cx + 15; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy);
      if (d <= 12.8) c.set(x, y, 'ink_0');
      else if (d <= 13.9 && c.get(x, y) !== null) c.set(x, y, dy < -3 && dx > -6 ? 'steel_3' : 'steel_1');
    }
  }

  // ---- underside: driveshaft, u-joints, hanging muffler -------------------------------------------
  c.hline(39, 72, 43, 'steel_2');
  c.hline(39, 72, 44, 'steel_1');
  c.hline(39, 72, 45, 'ink_1');
  c.rect(39, 43, 42, 46, 'rust_2');
  c.rect(69, 43, 72, 46, 'rust_2');
  c.hline(39, 42, 43, 'rust_3');
  c.hline(69, 72, 43, 'rust_3');
  c.hline(39, 42, 46, 'rust_1');
  c.hline(69, 72, 46, 'rust_1');
  // muffler on two straps
  c.rect(48, 43, 49, 47, 'rust_0');
  c.rect(57, 43, 58, 47, 'rust_0');
  c.rect(46, 47, 60, 51, 'steel_2');
  c.hline(46, 60, 47, 'steel_3');
  c.hline(46, 60, 51, 'steel_1');
  for (const [x, y] of [[46, 47], [60, 47], [46, 51], [60, 51]] as const) c.set(x, y, null);
  c.rect(50, 49, 53, 50, 'rust_2');
  c.rect(54, 48, 55, 49, 'rust_3');
  c.vline(47, 48, 50, 'steel_1');

  // ---- crooked antenna with a rag (personality at silhouette level) ----------------------------
  c.vline(36, 4, 8, 'steel_3');
  c.line(36, 4, 39, 2, 'steel_3');
  c.hline(32, 35, 4, 'dust_3');
  c.hline(30, 34, 5, 'dust_2');
  c.rect(30, 5, 31, 6, 'dust_1');

  // ---- weathering: roof rust + dust splashed up the rocker ---------------------------------------
  c.rect(49, 10, 52, 11, 'rust_2');
  c.rect(49, 10, 50, 10, 'rust_3');
  c.rect(51, 11, 53, 12, 'rust_1');
  c.rect(10, 39, 14, 39, 'dust_1');
  c.rect(33, 39, 36, 40, 'dust_1');

  c.outline('ink_0');
  return c;
}
