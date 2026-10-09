/** Shared production loader: lifecycle eligibility and URLs come only from the registry. */
import type Phaser from 'phaser';
import { ASSET_REGISTRY, ASSET_STATUSES, runtimeFiles, runtimeUrl, type AssetDefinition, type AssetStatus } from './assetRegistry';

export function loadProductionAssets(
  scene: Phaser.Scene,
  assets: readonly AssetDefinition[] = ASSET_REGISTRY,
  threshold: AssetStatus = 'technical'
): string[] {
  const failures: string[] = [];
  const onError = (file: Phaser.Loader.File): void => { failures.push(file.key + ': ' + file.url); };
  scene.load.on('loaderror', onError);
  scene.load.once('complete', () => scene.load.off('loaderror', onError));
  for (const asset of assets) {
    if (ASSET_STATUSES.indexOf(asset.status) < ASSET_STATUSES.indexOf(threshold)) continue;
    const files = runtimeFiles(asset);
    const png = runtimeUrl(files[0]!);
    switch (asset.kind) {
      case 'image': scene.load.image(asset.id, png); break;
      case 'spritesheet': scene.load.spritesheet(asset.id, png, {
        frameWidth: asset.frame.w, frameHeight: asset.frame.h,
        startFrame: 0, endFrame: asset.frames - 1, margin: 0, spacing: 0,
      }); break;
      case 'bitmap_font': scene.load.bitmapFont(asset.id, png, runtimeUrl(files[1]!)); break;
    }
  }
  return failures;
}
