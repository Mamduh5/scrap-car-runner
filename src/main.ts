/** Application composition: one progress owner, initialized before Phaser boots. */
import Phaser from 'phaser';
import { phaserConfig } from '@/game/config/phaserConfig';
import { LocalStorageAdapter } from '@/services/storage/StorageAdapter';
import { SaveRepository } from '@/services/save/SaveRepository';
import { GameStateService } from '@/services/state/GameStateService';
import { attachBrowserLifecycle } from '@/services/platform/BrowserLifecycle';

const state = new GameStateService(new SaveRepository(new LocalStorageAdapter()));
let game: Phaser.Game | null = null;
let disposeLifecycle: (() => void) | null = null;
let disposed = false;

async function boot(): Promise<void> {
  const previousDrain: unknown = import.meta.hot?.data['persistenceDrain'];
  if (previousDrain instanceof Promise) await previousDrain;
  await state.init();
  if (disposed) return;
  disposeLifecycle = attachBrowserLifecycle(state, document, window);
  game = new Phaser.Game({ ...phaserConfig, callbacks: {
    preBoot: instance => { instance.registry.set('gameState', state); },
  } });
}
const bootWork = boot();
void bootWork.catch((error: unknown) => {
  if (disposed) return;
  console.error('Progress initialization failed', error);
  disposeLifecycle?.();
  const message = document.createElement('p');
  message.style.color = '#cccccc';
  message.textContent = 'Progress could not be loaded. Check browser storage access, then reload to retry.';
  document.body.append(message);
});

if (import.meta.hot) import.meta.hot.dispose(() => {
  disposed = true;
  if (import.meta.hot) import.meta.hot.data['persistenceDrain'] = bootWork.then(() => state.flush()).catch(console.error);
  disposeLifecycle?.();
  game?.destroy(true);
});
