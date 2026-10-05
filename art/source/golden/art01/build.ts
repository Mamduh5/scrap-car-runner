/**
 * ART-01 build — regenerates every runtime export and review preview from the editable sources.
 *
 *   node --import tsx/esm art/source/golden/art01/build.ts
 *
 * Writes:
 *   public/assets/vehicles/veh_rustbucket_body.png           (112x56)
 *   public/assets/vehicles/veh_rustbucket_ov_engine_t{1,2,3}.png (112x56, drawn in place)
 *   public/assets/vehicles/veh_wheel_tires_t1.png            (96x24, 4 frames)
 *   public/assets/parts/part_engine_t{1,2,3}.png              (24x24, margin 1)
 *   art/source/golden/art01/preview/*.png                     (review only, never loaded by the game)
 * Exports are palette RGB at alpha 255 or alpha 0, 8-bit RGBA, no colour-management chunks.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodePng } from '../../../../tools/assets/png.ts';
import { Canvas } from './canvas.ts';
import { Sheet } from './preview.ts';
import { drawBody, WHEEL_CENTRES } from './body.ts';
import { drawWheelT1 } from './wheel.ts';
import { drawEngineOverlay, drawEngineIcon, type EngineTier } from './engines.ts';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../..');
const TIERS: readonly EngineTier[] = [1, 2, 3];

function exportPng(rel: string, c: Canvas): void {
  const file = resolve(root, 'public/assets', rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, encodePng(c.w, c.h, c.toRgba()));
  console.log('wrote public/assets/' + rel + ' (' + c.w + 'x' + c.h + ')');
}

const body = drawBody();
const wheel = drawWheelT1();
exportPng('vehicles/veh_rustbucket_body.png', body);
for (const t of TIERS) exportPng(`vehicles/veh_rustbucket_ov_engine_t${t}.png`, drawEngineOverlay(t));
exportPng('vehicles/veh_wheel_tires_t1.png', wheel);
for (const t of TIERS) exportPng(`parts/part_engine_t${t}.png`, drawEngineIcon(t));

// ---- review previews ---------------------------------------------------------------------------
const PREVIEW = resolve(here, 'preview');
mkdirSync(PREVIEW, { recursive: true });

function composite(tier: EngineTier | 0, wheelFrame: number): Canvas {
  const comp = new Canvas(112, 56);
  comp.blit(body, 0, 0);
  if (tier !== 0) comp.blit(drawEngineOverlay(tier), 0, 0);
  for (const k of [WHEEL_CENTRES.rear, WHEEL_CENTRES.front]) comp.blit(wheel.crop(wheelFrame * 24, 0, 24, 24), k.x - 12, k.y - 12);
  return comp;
}
const SKY: readonly [number, number, number] = [0xAE, 0xDD, 0xD6];
const GROUND: readonly [number, number, number] = [0x5E, 0x48, 0x38];

// contact sheet: bare / T1 / T2 / T3 at 5x with the part icons and wheel frames at 8x
{
  const S = 5;
  const sheet = new Sheet(112 * S * 2 + 12, 56 * S * 2 + 12, [0x21, 0x19, 0x21]);
  [0, 1, 2, 3].forEach((t, i) => {
    const ox = (i % 2) * (112 * S + 12), oy = Math.floor(i / 2) * (56 * S + 12);
    sheet.fillRect(ox, oy, ox + 112 * S, oy + 56 * S, SKY);
    sheet.fillRect(ox, oy + 55 * S, ox + 112 * S, oy + 56 * S, GROUND);
    sheet.draw(composite(t as EngineTier | 0, 0), ox, oy, S);
  });
  sheet.save(resolve(PREVIEW, 'contact_vehicle_ladder.png'));
}
{
  const T = 8;
  const sheet = new Sheet(24 * T * 7 + 6 * T, 24 * T, [0x31, 0x26, 0x2E]);
  TIERS.forEach((t, i) => sheet.draw(drawEngineIcon(t), i * 24 * T, 0, T));
  for (let k = 0; k < 4; k++) sheet.draw(wheel.crop(k * 24, 0, 24, 24), (3 + k) * 24 * T + 6 * T, 0, T);
  sheet.save(resolve(PREVIEW, 'contact_parts_and_wheel.png'));
}
// actual runtime scale: 1x and 3x with the Garage-ish backdrop colours (what the player sees)
{
  const sheet = new Sheet(112 * 3 + 16 + 112 * 4, 56 * 3 * 1 + 4, [0x21, 0x19, 0x21]);
  sheet.fillRect(0, 0, 112 * 3, 56 * 3, SKY);
  sheet.fillRect(0, 55 * 3, 112 * 3, 56 * 3, GROUND);
  sheet.draw(composite(2, 1), 0, 0, 3);
  [1, 2, 3].forEach((t, i) => {
    const ox = 112 * 3 + 16 + i * 112;   // 1x strip of all tiers (width fits 4 columns)
    sheet.fillRect(ox, 0, ox + 112, 56, SKY);
    sheet.draw(composite(t as EngineTier, 0), ox, 0, 1);
  });
  sheet.save(resolve(PREVIEW, 'runtime_scale.png'));
}
console.log('previews written to art/source/golden/art01/preview/');
