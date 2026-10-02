/**
 * game/scenes/BootScene.ts
 *
 * Phase 1 of the VS1 build plan: validates the technical foundation.
 *
 * IMPORTANT: This is NOT a gameplay scene. It is the minimal preload
 * entry point required to verify that Phaser boots, the canvas scales
 * correctly, and the save system loads without errors.
 *
 * What BootScene does in VS1 Phase 1:
 *   1. Preloads all game assets (defined in docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md)
 *   2. Runs SaveManager to hydrate game state
 *   3. Transitions to GarageScene
 *
 * During Phase 1 (foundation only), the preload list is empty and the
 * scene displays a simple "Loading..." text then transitions. This is
 * intentional: it proves the pipeline works without requiring art.
 *
 * DO NOT add gameplay code here.
 * DO NOT add placeholder art or colored boxes.
 */

import Phaser from 'phaser';

export const SCENE_KEYS = {
  BOOT:   'BootScene',
  GARAGE: 'GarageScene',
  RUN:    'RunScene',
} as const;

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  preload(): void {
    // Asset loading will be added here in Phase 8 when production art is ready.
    // See docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md for the full asset list.
    //
    // Example (do not add until assets exist):
    //   this.load.image('spr_chassis_rustbucket', 'assets/sprites/chassis_rustbucket.png');
  }

  create(): void {
    // Temporary: display technical validation text.
    // This will be replaced by the real transition to GarageScene in Phase 3.
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2, 'Scrap Car Runner\nEngine OK', {
      fontSize:  '16px',
      color:     '#cccccc',
      align:     'center',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // In Phase 3, replace the above with:
    //   this.scene.start(SCENE_KEYS.GARAGE);
  }
}
