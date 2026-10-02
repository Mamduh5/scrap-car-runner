/**
 * game/config/phaserConfig.ts
 *
 * Phaser 4 game configuration.
 *
 * Design decisions documented here:
 *
 * RESOLUTION STRATEGY — Fixed logical canvas (360×640) + scale fit
 *   The game is authored at 360×640 (portrait). Phaser's Scale Manager
 *   scales this canvas to fill the device viewport while preserving
 *   the aspect ratio. Black bars appear on wider screens (letterboxing).
 *   This is intentional — the game is portrait-only, not landscape.
 *
 * PIXEL ART — pixelArt: true
 *   Sets WebGL texture filter to nearest-neighbor (no anti-aliasing),
 *   roundPixels: true (avoids sub-pixel sprite shimmer at scale),
 *   and antialias: false globally. This matches the game's art style.
 *
 * RENDERER — Phaser.AUTO
 *   Selects WebGL if available, falls back to Canvas. WebGL is standard
 *   on all modern mobile browsers and Capacitor WebViews. Canvas fallback
 *   exists for edge cases but is not a primary target.
 *
 * BACKGROUND COLOUR — #1a1a1a
 *   Matches the HTML body background to prevent white-flash artefacts.
 */

import Phaser from 'phaser';
import { BootScene } from '@/game/scenes/BootScene';

/** Logical canvas dimensions — all game art is authored for this size */
export const LOGICAL_WIDTH  = 360;
export const LOGICAL_HEIGHT = 640;

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type:       Phaser.AUTO,
  width:      LOGICAL_WIDTH,
  height:     LOGICAL_HEIGHT,
  pixelArt:   true,              // nearest-neighbor + roundPixels + antialias:false
  backgroundColor: '#1a1a1a',

  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // No explicit parent — Phaser appends the canvas to document.body
  },

  // Audio context will be created on first user interaction (browser policy)
  audio: {
    noAudio: false,
  },

  scene: [
    BootScene,
    // GarageScene and RunScene will be added here when implemented
  ],
};
