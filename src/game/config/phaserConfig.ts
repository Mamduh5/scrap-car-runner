/**
 * game/config/phaserConfig.ts
 *
 * Phaser 4 game configuration.
 *
 * RESOLUTION STRATEGY — one pixel grid, integer scale, flexible logical size
 *   Art is authored on a single "art pixel" (AP) grid. The logical canvas is derived from the
 *   window so every AP maps to an exact INTEGER number of device pixels (see pixelViewport.ts):
 *     SAFE rect 180x288 AP (always fully visible), up to 216x427 AP on tall/wide screens.
 *   Phaser's Scale.NONE + `zoom` (CSS px per AP) places that canvas without fractional scaling;
 *   attachPixelViewport() keeps it in sync on resize/rotation/DPR change.
 *   Phaser.Scale.FIT is deliberately NOT used: it scales by arbitrary ratios and breaks pixel crispness.
 *
 * PIXEL ART — pixelArt: true
 *   Nearest-neighbor filtering, roundPixels, no antialiasing. Sprites must be placed at whole AP.
 *
 * Presentation rules: docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md §4.
 */

import Phaser from 'phaser';
import { BootScene } from '@/game/scenes/BootScene';
import { PALETTE_HEX } from '@/game/assets/palette';
import { computePixelViewport, readWindowViewport, VIEWPORT_LIMITS } from '@/game/config/pixelViewport';

export const SAFE_WIDTH = VIEWPORT_LIMITS.SAFE_WIDTH;
export const SAFE_HEIGHT = VIEWPORT_LIMITS.SAFE_HEIGHT;

/** Viewport at boot. Live changes arrive through scale.resize + Phaser.Scale.Events.RESIZE. */
export const INITIAL_VIEWPORT = computePixelViewport(readWindowViewport());
export const LOGICAL_WIDTH = INITIAL_VIEWPORT.width;
export const LOGICAL_HEIGHT = INITIAL_VIEWPORT.height;

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type:       Phaser.AUTO,
  width:      LOGICAL_WIDTH,
  height:     LOGICAL_HEIGHT,
  pixelArt:   true,
  roundPixels: true,
  // ink_0: matches index.html so any unpainted pixel is the outline colour, not browser grey.
  backgroundColor: PALETTE_HEX.ink_0,

  scale: {
    mode:       Phaser.Scale.NONE,
    zoom:       INITIAL_VIEWPORT.cssZoom,
    // Centering is done by CSS (index.html flex) to avoid double offsets; never round the CSS size,
    // it is already an exact multiple of device pixels.
    autoCenter: Phaser.Scale.NO_CENTER,
    autoRound:  false,
  },

  audio: {
    noAudio: false,
  },

  scene: [
    BootScene,
  ],
};
