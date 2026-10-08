/** Foundation boot only: state is hydrated by main.ts; gameplay and asset loading are deferred. */
import Phaser from 'phaser';
import { GameStateService } from '@/services/state/GameStateService';

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
    // Asset loading will be added here in the asset phase when production art is ready.
    // The asset list, sizes and paths are defined by src/game/assets/assetRegistry.ts (canonical);
    // load entries whose status is 'technical' or beyond via runtimeFiles()/runtimeUrl().
    // See docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md and docs/11_ASSET_PRODUCTION_WORKFLOW.md.
    this.load.bitmapFont('font_display', 'assets/fonts/font_display.png', 'assets/fonts/font_display.xml');
    this.load.bitmapFont('font_body', 'assets/fonts/font_body.png', 'assets/fonts/font_body.xml');
  }

  create(): void {
    // Temporary: display technical validation text.
    // This will be replaced by the real transition to GarageScene in Phase 3.
    const state: unknown = this.registry.get('gameState');
    if (!(state instanceof GameStateService) || !state.ready) throw new Error('State must initialize before BootScene');
    const { width, height } = this.scale;
    const status = state.persistenceStatus.status;
    const diagnostic = status === 'blocked' ? 'Unsupported save preserved; reset required' : 'Persistence: ' + status;

    // The logical canvas is ~180 art pixels wide (see phaserConfig.ts); 8px keeps this diagnostic on-screen.
    this.add.text(width / 2, height / 2, 'Scrap Car Runner\nEngine and state initialized\n' + diagnostic, {
      fontSize:  '8px',
      color:     '#cccccc',
      align:     'center',
      fontFamily: 'monospace',
      wordWrap: { width: width - 16 },
    }).setOrigin(0.5);

    // In Phase 3, replace the above with:
    this.scene.start('DevTypographyScene');
  }
}
