/**
 * ART-02 build — exports the five Golden UI assets and generates review preview sheets.
 *
 *   node --import tsx/esm art/source/golden/art02/build.ts
 *
 * Exports:
 *   public/assets/icons/icon_scrap.png         (16x16, cutout, margin 1)
 *   public/assets/icons/icon_stat_fuel.png     (16x16, cutout, margin 1)
 *   public/assets/ui/ui_panel_plate.png        (32x32, binary, nineSlice 8x8)
 *   public/assets/ui/ui_button_primary.png     (72x24, 3 frames of 24x24, binary, nineSlice 8x8)
 *   public/assets/ui/ui_slot_frame.png         (120x30, 4 frames of 30x30, binary)
 *
 * Previews (review only):
 *   art/source/golden/art02/preview/runtime_scale.png
 *   art/source/golden/art02/preview/contact_ui_samples.png
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodePng } from '../../../../tools/assets/png.ts';
import { Canvas } from './canvas.ts';
import { Sheet } from '../art01/preview.ts';
import { drawScrapIcon, drawFuelIcon } from './icons.ts';
import { drawPanelPlate, drawButtonPrimary, drawSlotFrame } from './ui.ts';
import { drawEngineIcon } from '../art01/engines.ts';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../..');

function exportPng(rel: string, c: Canvas): void {
  const file = resolve(root, 'public/assets', rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, encodePng(c.w, c.h, c.toRgba()));
  console.log(`wrote public/assets/${rel} (${c.w}x${c.h})`);
}

// 1. Generate and export the 5 runtime assets
const scrapIcon = drawScrapIcon();
const fuelIcon = drawFuelIcon();
const panelPlate = drawPanelPlate();
const buttonPrimary = drawButtonPrimary();
const slotFrame = drawSlotFrame();

exportPng('icons/icon_scrap.png', scrapIcon);
exportPng('icons/icon_stat_fuel.png', fuelIcon);
exportPng('ui/ui_panel_plate.png', panelPlate);
exportPng('ui/ui_button_primary.png', buttonPrimary);
exportPng('ui/ui_slot_frame.png', slotFrame);

// 2. Generate review preview sheets
const PREVIEW_DIR = resolve(here, 'preview');
mkdirSync(PREVIEW_DIR, { recursive: true });

// Contact Sheet at clean integer scales on dark workshop background (#130E14)
{
  const sheet = new Sheet(450, 360, [0x13, 0x0E, 0x14]);

  // Section 1: Icons at 5x (y=15)
  sheet.draw(scrapIcon, 25, 15, 5);
  sheet.draw(fuelIcon, 140, 15, 5);

  // Section 2: Panel plate at 3x (y=115)
  sheet.draw(panelPlate, 25, 115, 3);

  // Section 3: Button states at 3x (y=125)
  // Normal (frame 0)
  sheet.draw(buttonPrimary.crop(0, 0, 24, 24), 140, 125, 3);
  // Pressed (frame 1)
  sheet.draw(buttonPrimary.crop(24, 0, 24, 24), 240, 125, 3);
  // Disabled (frame 2)
  sheet.draw(buttonPrimary.crop(48, 0, 24, 24), 340, 125, 3);

  // Section 4: Slot Frame states at 3x (y=235)
  // Idle (frame 0)
  sheet.draw(slotFrame.crop(0, 0, 30, 30), 25, 235, 3);
  // Selected (frame 1)
  sheet.draw(slotFrame.crop(30, 0, 30, 30), 130, 235, 3);
  // Valid Target (frame 2)
  sheet.draw(slotFrame.crop(60, 0, 30, 30), 235, 235, 3);
  // Blocked (frame 3)
  sheet.draw(slotFrame.crop(90, 0, 30, 30), 340, 235, 3);

  sheet.save(resolve(PREVIEW_DIR, 'contact_ui_samples.png'));
  console.log('wrote preview/contact_ui_samples.png');
}

// Runtime Scale 1x review preview (actual 1:1 pixel rendering with sample combinations)
{
  const sheet = new Sheet(200, 150, [0x21, 0x19, 0x21]);

  // Top row: currency & stat icons at 1x
  sheet.draw(scrapIcon, 10, 10, 1);
  sheet.draw(fuelIcon, 32, 10, 1);

  // Middle: Primary Button 3 states
  sheet.draw(buttonPrimary.crop(0, 0, 24, 24), 60, 6, 1);
  sheet.draw(buttonPrimary.crop(24, 0, 24, 24), 90, 6, 1);
  sheet.draw(buttonPrimary.crop(48, 0, 24, 24), 120, 6, 1);

  // Panel plate (32x32) at 1x
  sheet.draw(panelPlate, 10, 35, 1);

  // Slot frames 4 states at 1x
  sheet.draw(slotFrame.crop(0, 0, 30, 30), 50, 36, 1);
  sheet.draw(slotFrame.crop(30, 0, 30, 30), 85, 36, 1);
  sheet.draw(slotFrame.crop(60, 0, 30, 30), 120, 36, 1);
  sheet.draw(slotFrame.crop(90, 0, 30, 30), 155, 36, 1);

  // Test combination: Slot frame + ART-01 Engine T1 icon inside!
  const equippedSlot = new Canvas(30, 30);
  equippedSlot.blit(slotFrame.crop(0, 0, 30, 30), 0, 0);
  equippedSlot.blit(drawEngineIcon(1), 3, 3);
  sheet.draw(equippedSlot, 50, 75, 1);

  // Test combination: Selected Slot + Engine T2 icon inside!
  const selectedSlot = new Canvas(30, 30);
  selectedSlot.blit(slotFrame.crop(30, 0, 30, 30), 0, 0);
  selectedSlot.blit(drawEngineIcon(2), 3, 3);
  sheet.draw(selectedSlot, 85, 75, 1);

  // Test combination: Valid Target Slot + Engine T3 icon inside!
  const targetSlot = new Canvas(30, 30);
  targetSlot.blit(slotFrame.crop(60, 0, 30, 30), 0, 0);
  targetSlot.blit(drawEngineIcon(3), 3, 3);
  sheet.draw(targetSlot, 120, 75, 1);

  sheet.save(resolve(PREVIEW_DIR, 'runtime_scale.png'));
  console.log('wrote preview/runtime_scale.png');
}
