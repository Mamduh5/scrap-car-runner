/**
 * game/config/viewportController.ts — keeps the Phaser canvas on the integer pixel grid.
 *
 * Applies computePixelViewport() whenever the window size or devicePixelRatio changes (rotation,
 * browser UI bars, browser zoom, moving between monitors). Scenes that position content must
 * listen to Phaser.Scale.Events.RESIZE and re-anchor to the SAFE rect (see docs/05 §2).
 */

import type Phaser from 'phaser';
import { computePixelViewport, readWindowViewport } from '@/game/config/pixelViewport';

export function attachPixelViewport(game: Phaser.Game, win: Window): () => void {
  const apply = (): void => {
    const next = computePixelViewport(readWindowViewport(win));
    const scale = game.scale;
    // Zoom first so the following resize writes the final canvas style size in one pass.
    if (scale.zoom !== next.cssZoom) scale.setZoom(next.cssZoom);
    if (scale.width !== next.width || scale.height !== next.height) scale.resize(next.width, next.height);
  };

  let dprQuery: MediaQueryList | null = null;
  const onDprChange = (): void => { apply(); watchDpr(); };
  const watchDpr = (): void => {
    dprQuery?.removeEventListener('change', onDprChange);
    dprQuery = typeof win.matchMedia === 'function'
      ? win.matchMedia('(resolution: ' + win.devicePixelRatio + 'dppx)') : null;
    dprQuery?.addEventListener('change', onDprChange);
  };

  win.addEventListener('resize', apply);
  win.addEventListener('orientationchange', apply);
  watchDpr();
  apply();

  return () => {
    win.removeEventListener('resize', apply);
    win.removeEventListener('orientationchange', apply);
    dprQuery?.removeEventListener('change', onDprChange);
    dprQuery = null;
  };
}
