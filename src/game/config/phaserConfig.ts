/**
 * game/config/phaserConfig.ts
 *
 * Phaser 4 game configuration.
 *
 * RESOLUTION STRATEGY — Fixed logical width, expandable logical height
 *   Base width is exactly 360. Base height is 640.
 *   On taller phones (e.g., 390x844), the logical height expands up to 850
 *   to eliminate large vertical letterboxing. The UI can then anchor to the
 *   top/bottom of this expanded vertical space.
 *   Phaser.Scale.FIT ensures this new dynamic logical canvas scales cleanly
 *   into the physical device window.
 *
 * PIXEL ART — pixelArt: true
 *   Nearest-neighbor filtering, roundPixels, and no antialiasing.
 */

import Phaser from 'phaser';
import { BootScene } from '@/game/scenes/BootScene';

export const LOGICAL_WIDTH = 360;
export const MIN_LOGICAL_HEIGHT = 640;
export const MAX_LOGICAL_HEIGHT = 850;

// Calculate dynamic height based on window aspect ratio (safe for SSR/Node environments by checking window)
const windowRatio = typeof window !== 'undefined' ? window.innerHeight / window.innerWidth : (640 / 360);
export const LOGICAL_HEIGHT = Math.floor(Math.max(MIN_LOGICAL_HEIGHT, Math.min(MAX_LOGICAL_HEIGHT, LOGICAL_WIDTH * windowRatio)));

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type:       Phaser.AUTO,
  width:      LOGICAL_WIDTH,
  height:     LOGICAL_HEIGHT,
  pixelArt:   true,
  backgroundColor: '#1a1a1a',

  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  audio: {
    noAudio: false,
  },

  scene: [
    BootScene,
  ],
};
