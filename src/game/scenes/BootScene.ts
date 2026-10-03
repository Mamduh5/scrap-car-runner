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
    // See docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md for the full asset list.
    //
    // Example (do not add until assets exist):
    //   this.load.image('spr_chassis_rustbucket', 'assets/sprites/chassis_rustbucket.png');
  }

  create(): void {
    // Temporary: display technical validation text.
    // This will be replaced by the real transition to GarageScene in Phase 3.
    const state: unknown = this.registry.get('gameState');
    if (!(state instanceof GameStateService) || !state.ready) throw new Error('State must initialize before BootScene');
    const { width, height } = this.scale;
    const status = state.persistenceStatus.status;
    const diagnostic = status === 'blocked' ? 'Unsupported save preserved; reset required' : 'Persistence: ' + status;

    this.add.text(width / 2, height / 2, 'Scrap Car Runner\nEngine and state initialized\n' + diagnostic, {
      fontSize:  '16px',
      color:     '#cccccc',
      align:     'center',
      fontFamily: 'monospace',
      wordWrap: { width: width - 32 },
    }).setOrigin(0.5);

    // In Phase 3, replace the above with:
    //   this.scene.start(SCENE_KEYS.GARAGE);
  }
}
