/** Separate Vite development entry: no state, save, economy or gameplay initialization. */
import Phaser from 'phaser';
import { phaserConfig } from '../config/phaserConfig';
import { attachPixelViewport } from '../config/viewportController';
import { DevVisualProofScene } from '../scenes/DevVisualProofScene';

if (!import.meta.env.DEV) throw new Error('VIS-01 is a development-only entry');
const game = new Phaser.Game({ ...phaserConfig, audio: { noAudio: true }, scene: [DevVisualProofScene] });
const dispose = attachPixelViewport(game, window);
if (import.meta.hot) import.meta.hot.dispose(() => { dispose(); game.destroy(true); });
