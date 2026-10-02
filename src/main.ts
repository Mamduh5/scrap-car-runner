/**
 * main.ts — Application entry point
 *
 * Creates the Phaser game instance. Nothing else belongs here.
 *
 * All configuration is in src/game/config/phaserConfig.ts.
 * All scenes are registered via the phaserConfig.scene array.
 */

import Phaser from 'phaser';
import { phaserConfig } from '@/game/config/phaserConfig';

new Phaser.Game(phaserConfig);
