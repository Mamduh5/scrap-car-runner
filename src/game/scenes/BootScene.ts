/** Foundation boot: main.ts hydrates state; registry exports load here; gameplay is deferred. */
import Phaser from 'phaser';
import { GameStateService } from '@/services/state/GameStateService';
import { loadProductionAssets } from '@/game/assets/loadProductionAssets';

export const SCENE_KEYS = {
  BOOT:   'BootScene',
  GARAGE: 'GarageScene',
  RUN:    'RunScene',
} as const;

export class BootScene extends Phaser.Scene {
  private assetFailures: string[] = [];
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  preload(): void {
    this.assetFailures = loadProductionAssets(this);
  }

  create(): void {
    if (this.assetFailures.length) {
      this.add.text(4, 4, 'Production asset load failed\n' + this.assetFailures.join('\n'), {
        fontSize: '8px', color: '#ffffff', wordWrap: { width: this.scale.width - 8 },
      });
      return;
    }
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
