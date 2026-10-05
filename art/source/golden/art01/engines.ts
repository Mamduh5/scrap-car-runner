/**
 * ART-01 source — Engine ladder.
 *
 * One drawing per tier is the SINGLE source of both exports:
 *   - veh_rustbucket_ov_engine_tN : the drawing in place on the 112x56 body canvas
 *   - part_engine_tN              : the same drawing cropped and bottom-centred on 24x24
 * so overlay and inventory icon can never disagree about what an engine looks like.
 *
 * Shared family vocabulary (what makes T1/T2/T3 "the same component getting better"):
 *   mount plate -> crankcase block -> finned cylinder(s) -> exhaust going up at the right ->
 *   flywheel/pulley at the front-right (x ~ 90, y ~ 25).
 * Escalation: 1 cylinder / raw rust -> 2 cylinders / steel + teal repaint / 4 cylinders,
 * supercharger, 3 stacks, polished steel + safety-yellow trim. Every tier fits 22x22 including
 * outline so the icon and overlay share one footprint ceiling; tier is read from density and
 * material confidence, not from size alone.
 */
import { Canvas } from './canvas.ts';
import type { PaletteName } from '../../../../src/game/assets/palette.ts';
import { bolt, BODY } from './body.ts';

/** Lit disc (light from upper right) with a hub: the family's front-right flywheel/pulley. */
function pulley(c: Canvas, cx: number, cy: number, r: number, base: PaletteName, hi: PaletteName, sh: PaletteName, hub: PaletteName): void {
  c.disk(cx, cy, r, base);
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
    const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
    if (dx * dx + dy * dy > r * r) continue;
    const l = dx - dy;
    if (l > 1.9) c.set(x, y, hi); else if (l < -1.9) c.set(x, y, sh);
  }
  c.disk(cx, cy, 1.2, hub);
}

function tier1(c: Canvas): void {
  // mount plate
  c.plate(78, 28, 92, 29, 'steel_1', 'steel_2', 'ink_2');
  // crankcase: raw cast block, rusted through
  c.rect(79, 22, 89, 27, 'rust_2');
  c.hline(79, 89, 22, 'rust_3');
  c.hline(79, 89, 27, 'rust_1');
  c.vline(79, 23, 27, 'rust_1');
  c.rect(81, 24, 85, 26, 'rust_1');
  c.hline(81, 85, 24, 'rust_3');
  bolt(c, 86, 23);
  // single finned cylinder
  c.cyl(82, 15, 87, 21, 'steel_1', 'steel_2', 'steel_3');
  for (const y of [17, 19]) c.hline(82, 87, y, 'ink_1');
  c.hline(82, 87, 21, 'ink_1');
  c.plate(81, 13, 88, 14, 'steel_2', 'steel_3', 'steel_1');
  c.rect(84, 11, 85, 12, 'steel_4');             // spark plug
  c.hline(84, 85, 12, 'steel_2');
  // tin-can air cleaner with a paper label
  c.cyl(78, 16, 81, 21, 'steel_1', 'steel_3', 'steel_4');
  c.hline(78, 81, 16, 'steel_4');
  c.hline(78, 81, 18, 'dust_3');
  c.hline(78, 81, 19, 'dust_2');
  // stovepipe exhaust
  c.rect(88, 17, 90, 18, 'steel_1');
  c.rect(89, 12, 90, 16, 'steel_1');
  c.vline(90, 12, 16, 'steel_2');
  c.hline(89, 91, 12, 'ink_2');
  c.rect(89, 14, 90, 15, 'rust_2');
  // flywheel
  pulley(c, 90, 25, 3, 'rust_2', 'rust_4', 'rust_1', 'steel_2');
}

function tier2(c: Canvas): void {
  c.plate(75, 28, 93, 29, 'steel_1', 'steel_2', 'ink_2');
  // crankcase: cleaner steel with one rusty patch left on it
  c.rect(75, 22, 92, 27, 'steel_2');
  c.hline(75, 92, 22, 'steel_3');
  c.hline(75, 92, 27, 'steel_1');
  c.vline(75, 23, 27, 'steel_1');
  c.vline(82, 23, 26, 'ink_1');
  bolt(c, 77, 23); bolt(c, 84, 23);
  c.rect(77, 25, 80, 26, 'rust_2');
  c.rect(77, 25, 78, 25, 'rust_3');
  // two finned cylinders under one repainted valve cover
  c.cyl(77, 15, 81, 21, 'steel_1', 'steel_2', 'steel_3');
  c.cyl(84, 15, 88, 21, 'steel_1', 'steel_2', 'steel_3');
  for (const y of [17, 19, 21]) { c.hline(77, 81, y, 'ink_1'); c.hline(84, 88, y, 'ink_1'); }
  c.vline(82, 15, 21, 'ink_1'); c.vline(83, 15, 21, 'ink_1');
  c.plate(76, 12, 89, 14, 'teal_2', 'teal_3', 'teal_1');
  c.vline(82, 13, 13, 'teal_1');
  c.hline(78, 79, 13, 'steel_3'); c.hline(86, 87, 13, 'steel_3');
  // tin-can air cleaner
  c.cyl(74, 16, 76, 21, 'steel_1', 'steel_3', 'steel_4');
  c.hline(74, 76, 16, 'steel_4');
  c.hline(74, 76, 18, 'dust_3');
  c.hline(74, 76, 19, 'dust_2');
  c.rect(74, 14, 75, 15, 'ink_2');               // intake hose to the valve cover
  // exhaust: manifold stub into a soup-can muffler with a short riser
  c.rect(89, 16, 90, 17, 'steel_1');
  c.cyl(90, 13, 93, 19, 'steel_1', 'steel_2', 'steel_3');
  c.hline(90, 93, 13, 'steel_3');
  c.rect(91, 11, 92, 12, 'steel_1');
  c.hline(91, 92, 11, 'ink_2');
  c.rect(90, 16, 91, 18, 'rust_2');
  c.hline(90, 91, 16, 'rust_3');
  // front pulley with a belt groove
  pulley(c, 90, 25, 3, 'steel_2', 'steel_4', 'steel_1', 'steel_1');
}

function tier3(c: Canvas): void {
  c.plate(72, 28, 91, 29, 'steel_2', 'steel_3', 'ink_2');
  // crankcase: polished steel, riveted
  c.rect(72, 21, 90, 27, 'steel_2');
  c.hline(72, 90, 21, 'steel_4');
  c.hline(72, 90, 22, 'steel_3');
  c.hline(72, 90, 23, 'steel_3');
  c.hline(72, 90, 27, 'steel_1');
  c.vline(72, 22, 27, 'steel_1');
  for (const x of [77, 82, 87]) c.vline(x, 24, 26, 'steel_1');
  for (const x of [74, 79, 84]) { c.hline(x, x + 1, 25, 'steel_4'); }
  c.hline(73, 90, 24, 'steel_3');                 // weld bead along the block seam
  c.rect(80, 26, 82, 27, 'ink_2');                // oil weep
  // three polished stacks at the right (drawn first: the valve covers sit in front of them)
  for (const x of [86, 88, 90]) {
    c.rect(x, 10, x + 1, 15, 'steel_1');
    c.vline(x + 1, 10, 15, 'steel_4');
    c.hline(x, x + 1, 10, 'ink_2');
  }
  // four cylinders under four safety-yellow valve covers
  for (const x of [73, 78, 83, 88] as const) {
    c.cyl(x, 16, x + 3, 20, 'steel_1', 'steel_3', 'steel_4');
    c.hline(x, x + 3, 16, 'ink_1');
    c.hline(x, x + 3, 18, 'steel_1');
    c.plate(x, 13, x + 3, 15, 'yellow_2', 'yellow_3', 'yellow_1');
  }
  // supercharger box with intake horn
  c.plate(75, 10, 84, 12, 'steel_3', 'steel_4', 'steel_1');
  c.hline(77, 82, 11, 'yellow_2');
  c.rect(73, 10, 74, 12, 'steel_2');
  c.vline(73, 10, 12, 'ink_0');
  // yellow-hubbed pulley
  pulley(c, 89, 25, 3, 'steel_3', 'steel_4', 'steel_2', 'yellow_2');
  c.rect(73, 25, 75, 27, 'rust_2');                // one salvaged panel never got replaced
  c.hline(73, 75, 25, 'rust_3');
  c.hline(73, 75, 27, 'rust_1');
}

export type EngineTier = 1 | 2 | 3;

export function drawEngineOverlay(tier: EngineTier): Canvas {
  const c = new Canvas(BODY.w, BODY.h);
  (tier === 1 ? tier1 : tier === 2 ? tier2 : tier3)(c);
  c.outline('ink_0');
  return c;
}

/** 24x24 inventory icon: the overlay drawing, cropped, bottom-aligned and centred. */
export function drawEngineIcon(tier: EngineTier): Canvas {
  const ov = drawEngineOverlay(tier);
  const b = ov.bounds();
  if (b === null) throw new Error('empty engine overlay');
  const w = b.x1 - b.x0 + 1, h = b.y1 - b.y0 + 1;
  if (w > 22 || h > 22) throw new Error(`engine t${tier} footprint ${w}x${h} exceeds the 22x22 icon safe area`);
  const icon = new Canvas(24, 24);
  icon.blit(ov.crop(b.x0, b.y0, w, h), Math.floor((24 - w) / 2), 23 - h);
  return icon;
}
