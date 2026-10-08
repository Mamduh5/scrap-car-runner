import { describe, it, expect, vi } from 'vitest';
import type Phaser from 'phaser';
import { loadProductionAssets } from '../../src/game/assets/loadProductionAssets';
import { ASSET_REGISTRY } from '../../src/game/assets/assetRegistry';

function fixture() {
  const on = vi.fn(), once = vi.fn(), off = vi.fn();
  const load = { on, once, off, image: vi.fn(), spritesheet: vi.fn(), bitmapFont: vi.fn() };
  return { load, scene: { load } as unknown as Phaser.Scene };
}
describe('production registry loader', () => {
  it('queues eligible exports through canonical paths, with authored sheet frame sizes and font pairs', () => {
    const { scene, load } = fixture();
    loadProductionAssets(scene);
    expect(load.image).toHaveBeenCalledWith('veh_rustbucket_body', 'assets/vehicles/veh_rustbucket_body.png');
    expect(load.spritesheet).toHaveBeenCalledWith('veh_wheel_tires_t1', 'assets/vehicles/veh_wheel_tires_t1.png', {
      frameWidth:24, frameHeight:24, startFrame:0, endFrame:3, margin:0, spacing:0,
    });
    expect(load.bitmapFont).toHaveBeenCalledWith('font_body', 'assets/fonts/font_body.png', 'assets/fonts/font_body.xml');
    expect(load.image.mock.calls.some(call => call[0] === 'env_clouds_strip')).toBe(true);
    expect(load.image.mock.calls.some(call => call[0] === 'env_garage_fg')).toBe(false);
  });
  it('does not queue planned or draft entries even when files exist', () => {
    const { scene, load } = fixture();
    const asset = ASSET_REGISTRY.find(a => a.kind === 'image')!;
    loadProductionAssets(scene, [{...asset,status:'planned'}, {...asset,status:'draft'}]);
    expect(load.image).not.toHaveBeenCalled();
  });
  it('retains failed key/URL diagnostics and detaches the load-error listener on completion', () => {
    const { scene, load } = fixture();
    const failures = loadProductionAssets(scene, []);
    const onError = load.on.mock.calls[0]?.[1] as (file: {key:string;url:string}) => void;
    onError({key:'font_body',url:'assets/fonts/font_body.xml'});
    expect(failures).toEqual(['font_body: assets/fonts/font_body.xml']);
    const complete = load.once.mock.calls[0]?.[1] as () => void;
    complete(); expect(load.off).toHaveBeenCalledWith('loaderror', onError);
  });
});
