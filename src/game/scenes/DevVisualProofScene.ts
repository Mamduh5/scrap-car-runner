/** VIS-01: controlled production-asset compositions, never an owner of gameplay or progress. */
import Phaser from 'phaser';
import { ASSET_REGISTRY, ASSET_BY_ID, isGolden } from '../assets/assetRegistry';
import { loadProductionAssets } from '../assets/loadProductionAssets';
import { VIEWPORT_LIMITS } from '../config/pixelViewport';
import { UI_TYPOGRAPHY, type TypographyRole } from '../../ui/theme/typography';

type ProofState = 'garage' | 'run' | 'vehicle' | 'ui' | 'seams' | 'art02b_run' | 'art02b_garage' | 'art02b_slots' | 'art02b_icons' | 'art02b_seven';
interface Bound { key: string; x: number; y: number; width: number; height: number; integer: boolean; safe: boolean }
interface Tile { key: string; width: number; height: number; phase: number; copies: number[]; adjacent: boolean }
export interface VisualProofReport {
  ready: boolean; failures: string[]; state: ProofState; width: number; height: number;
  safe: { x: number; y: number; width: number; height: number };
  bounds: Bound[]; tiles: Tile[]; assets: { key: string; present: boolean; frames: number; nearest: boolean; frameDimensions: boolean }[];
  pixelConfig: { antialias: boolean; roundPixels: boolean; zoom: number };
  frame: number; phase: number; guides: boolean; renderer: string;
}
declare global {
  interface Window {
    __visualProof?: { report: VisualProofReport; show: (state: ProofState, guides?: boolean, frame?: number, phase?: number, tile?: string) => void };
  }
}

export class DevVisualProofScene extends Phaser.Scene {
  private failures: string[] = [];
  private state: ProofState = 'garage';
  private guides = false;
  private frame = 0;
  private phase = 0;
  private seamKey = 'env_sky_outskirts';
  private bounds: Bound[] = [];
  private tiles: Tile[] = [];
  private sx = 0;
  private sy = 0;
  private animating = false;
  private elapsed = 0;
  constructor() { super('DevVisualProofScene'); }
  preload(): void { this.failures = loadProductionAssets(this, undefined, 'draft'); }
  create(): void {
    if (this.failures.length) {
      const error = document.createElement('pre'); error.id = 'proof-error';
      error.textContent = 'Production asset load failed\n' + this.failures.join('\n'); document.body.append(error);
      this.events.once('shutdown', () => error.remove());
      this.publish(false); return;
    }
    const params = new URLSearchParams(location.search);
    const states: ProofState[] = ['garage', 'run', 'vehicle', 'ui', 'seams'];
    const requested = params.get('state');
    this.state = states.find(s => s === requested) ?? 'garage';
    this.guides = params.get('guides') === '1';
    this.scale.on('resize', this.compose, this);
    this.events.once('shutdown', () => { this.scale.off('resize', this.compose, this); delete window.__visualProof; });
    // Proof navigation: 1–5 states, G guides, Space authored wheel/puff frame cycling.
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const next = states[Number(event.key) - 1];
      if (next) this.state = next;
      if (event.key.toLowerCase() === 'g') this.guides = !this.guides;
      if (event.code === 'Space') this.animating = !this.animating;
      this.compose();
    });
    this.compose();
  }
  override update(_time: number, delta: number): void {
    if (!this.animating) return;
    this.elapsed += delta;
    if (this.elapsed >= 180) {
      this.elapsed %= 180; this.frame = (this.frame + 1) % 4; this.phase += 1; this.compose();
    }
  }
  private record(key: string, object: Phaser.GameObjects.Image | Phaser.GameObjects.BitmapText | Phaser.GameObjects.NineSlice): void {
    const b = object.getBounds();
    this.bounds.push({ key, x: b.x, y: b.y, width: b.width, height: b.height,
      integer: [object.x, object.y, object.scaleX, object.scaleY].every(Number.isInteger),
      safe: b.x >= this.sx && b.y >= this.sy && b.right <= this.sx + 180 && b.bottom <= this.sy + 288 });
  }
  private image(key: string, x: number, y: number, frame = 0, critical = true): Phaser.GameObjects.Image {
    const object = this.add.image(x, y, key, ASSET_BY_ID.get(key)?.kind === 'image' ? '__BASE' : frame).setOrigin(0);
    if (critical) this.record(key, object);
    return object;
  }
  private label(role: TypographyRole, text: string, x: number, y: number): Phaser.GameObjects.BitmapText {
    const token = UI_TYPOGRAPHY[role];
    const object = this.add.bitmapText(x, y, token.fontKey, text, token.size).setTint(Number.parseInt(token.color.slice(1), 16));
    this.record(token.fontKey + ':' + text, object);
    return object;
  }
  private panel(x: number, y: number, width: number, height: number, key = 'ui_panel_plate', frame = 0): void {
    const slices = ASSET_BY_ID.get(key)?.nineSlice;
    if (!slices) throw new Error('Missing nine-slice contract: ' + key);
    const object = this.add.nineslice(x, y, key, frame, width, height, slices.left, slices.right, slices.top, slices.bottom).setOrigin(0);
    this.record(key + ':' + frame, object);
  }
  private tile(key: string, y: number, phase: number): void {
    const asset = ASSET_BY_ID.get(key);
    if (asset?.kind !== 'image' || !asset.tileX) throw new Error('Not a tileX image: ' + key);
    const { w, h } = asset.size;
    const offset = (((phase - this.sx) % w) + w) % w;
    const copies: number[] = [];
    for (let x = -w - offset; x < this.scale.width + w; x += w) {
      this.image(key, x, y, 0, false); copies.push(x);
    }
    this.tiles.push({ key, width: w, height: h, phase: offset, copies, adjacent: copies.every((x, i) => i === 0 || x - copies[i - 1]! === w) });
  }
  private car(x: number, y: number, tier: number): void {
    this.image('veh_rustbucket_body', x, y);
    if (tier) this.image('veh_rustbucket_ov_engine_t' + tier, x, y);
    for (const offset of [26, 86]) this.image('veh_wheel_tires_t1', x + offset - 12, y + 32, this.frame);
  }
  private hud(): void {
    this.panel(this.sx + 4, this.sy + 4, 104, 28);
    this.image('icon_scrap', this.sx + 10, this.sy + 10);
    this.label('currency', '850 SCRAP', this.sx + 30, this.sy + 9);
    // No approved Mail asset exists: omit rather than create Golden art.
    this.panel(this.sx + 4, this.sy + 238, 172, 44);
    this.image('icon_stat_fuel', this.sx + 10, this.sy + 244);
    this.label('statLabel', 'FUEL', this.sx + 30, this.sy + 243);
    this.label('statLabel', 'HEAT', this.sx + 78, this.sy + 243);
    this.label('statLabel', 'SPEED', this.sx + 127, this.sy + 243);
    this.label('statValue', '45%', this.sx + 30, this.sy + 259);
    this.label('statValue', '60%', this.sx + 78, this.sy + 259);
    this.label('statValue', '125', this.sx + 127, this.sy + 259);
  }
  private garage(): void {
    this.image('env_garage_wall', this.sx - 18, this.sy - 69, 0, false);
    this.image('env_garage_lift', this.sx + 22, this.sy + 212);
    this.car(this.sx + 34, this.sy + 158, 1);
    this.hud();
  }
  private run(withHud = true): void {
    const roadY = this.sy + 214;
    const skyY = roadY - 300;
    const sky = this.textures.get('env_sky_outskirts');
    if (!sky.has('top-row')) sky.add('top-row', 0, 0, 0, 16, 1);
    // Noncritical bleed repeats only the source edge row; no texture stretching or extra horizon.
    if (skyY > 0) this.add.tileSprite(0, 0, this.scale.width, skyY, 'env_sky_outskirts', 'top-row').setOrigin(0);
    this.tile('env_sky_outskirts', skyY, this.phase);
    this.tile('env_clouds_strip', roadY - 156, Math.floor(this.phase / 3) + 294);
    this.tile('env_far_junkyard', roadY - 96, this.phase + 166);
    this.tile('env_road_asphalt', roadY, this.phase);
    const road = this.textures.get('env_road_asphalt');
    if (!road.has('bottom-row')) road.add('bottom-row', 0, 0, 47, 64, 1);
    const below = this.scale.height - roadY - 48;
    if (below > 0) this.add.tileSprite(0, roadY + 48, this.scale.width, below, 'env_road_asphalt', 'bottom-row').setOrigin(0);
    // Landmark above the car silhouette, not underneath its wheels.
    this.image('prop_scrap_pile_a', this.sx + 126, roadY - 53);
    this.car(this.sx + 20, roadY - 55, 2);
    this.image('fx_puff', this.sx + 4, roadY - 20, this.frame).setTint(0xe8d6b0);
    if (withHud) this.hud();
  }
  private ui(): void {
    this.run(false);
    this.panel(this.sx + 4, this.sy + 36, 172, 248);
    this.label('sectionHeader', 'ENGINE', this.sx + 16, this.sy + 44);
    for (let tier = 1; tier <= 3; tier++) {
      const x = this.sx + 16 + (tier - 1) * 54;
      this.image('ui_slot_frame', x, this.sy + 76, tier - 1);
      this.image('part_engine_t' + tier, x + 3, this.sy + 79);
      this.label('statLabel', 'T' + tier, x + 4, this.sy + 110);
    }
    for (let frame = 0; frame < 4; frame++) this.image('ui_slot_frame', this.sx + 16 + frame * 38, this.sy + 134, frame);
    for (let frame = 0; frame < 3; frame++) {
      this.panel(this.sx + 10, this.sy + 174 + frame * 34, 160, 26, 'ui_button_primary', frame);
      this.label('buttonPrimary', 'SCAVENGE', this.sx + 25, this.sy + 178 + frame * 34);
    }
  }
  private compose(): void {
    this.children.removeAll(true); this.bounds = []; this.tiles = [];
    this.sx = Math.floor((this.scale.width - VIEWPORT_LIMITS.SAFE_WIDTH) / 2);
    this.sy = Math.floor((this.scale.height - VIEWPORT_LIMITS.SAFE_HEIGHT) / 2);
    this.cameras.main.setBackgroundColor('#130e14');
    switch (this.state) {
      case 'garage': this.garage(); break;
      case 'run': this.run(); break;
      case 'ui': this.ui(); break;
      case 'vehicle':
        this.image('env_garage_wall', this.sx - 18, this.sy - 69, 0, false);
        for (let tier = 0; tier <= 3; tier++) {
          this.label('statLabel', tier ? 'ENGINE T' + tier : 'BASE', this.sx + 6, this.sy + tier * 68);
          this.car(this.sx + 34, this.sy + 14 + tier * 68, tier);
        }
        break;
      case 'art02b_run': this.art02b_run(); break;
      case 'art02b_garage': this.art02b_garage(); break;
      case 'art02b_slots': this.art02b_slots(); break;
      case 'art02b_icons': this.art02b_icons(); break;
      case 'art02b_seven': this.art02b_seven(); break;
      case 'seams':
        this.tile('env_sky_outskirts', this.sy - 12, 0);
        this.tile(this.seamKey, this.sy + 100, this.phase + (ASSET_BY_ID.get(this.seamKey)?.kind === 'image' ? (ASSET_BY_ID.get(this.seamKey) as {size:{w:number}}).size.w - 90 : 0));
        break;
    }
    if (this.guides) {
      const g = this.add.graphics().setDepth(100);
      g.lineStyle(1, 0x42e0cd).strokeRect(this.sx, this.sy, 179, 287);
      g.lineStyle(1, 0xffca45);
      for (const b of this.bounds) g.strokeRect(b.x, b.y, b.width, b.height);
      if (this.state === 'garage' || this.state === 'run') {
        const contactY = this.sy + (this.state === 'garage' ? 212 : 214);
        g.lineBetween(this.sx + 4, contactY, this.sx + 176, contactY);
      }
      for (const tile of this.tiles) for (const x of tile.copies) if (x > 0 && x < this.scale.width) g.lineBetween(x, 0, x, this.scale.height);
    }
    this.publish(true);
  }
  private publish(ready: boolean): void {
    const assets = ASSET_REGISTRY.filter(a => isGolden(a) || a.id === 'env_clouds_strip').map(a => {
      const texture = this.textures.exists(a.id) ? this.textures.get(a.id) : undefined;
      return { key: a.id, present: Boolean(texture) && (a.kind !== 'bitmap_font' || this.cache.bitmapFont.exists(a.id)),
        frames: texture ? (a.kind === 'spritesheet' ? Array.from({length:a.frames}, (_, i) => texture.has(String(i))).filter(Boolean).length : 1) : 0,
        frameDimensions: Boolean(texture) && (a.kind === 'bitmap_font' || (a.kind === 'image'
          ? texture!.get('__BASE').width === a.size.w && texture!.get('__BASE').height === a.size.h
          : Array.from({length:a.frames}, (_, i) => texture!.get(String(i))).every(f => f.width === a.frame.w && f.height === a.frame.h))),
        nearest: texture?.source.every(source => source.scaleMode === Phaser.ScaleModes.NEAREST) ?? false };
    });
    const report: VisualProofReport = { ready, failures: [...this.failures], state: this.state,
      width: this.scale.width, height: this.scale.height, safe: { x: this.sx, y: this.sy, width: 180, height: 288 },
      bounds: this.bounds, tiles: this.tiles, assets, frame: this.frame, phase: this.phase, guides: this.guides,
      pixelConfig: { antialias: this.game.config.antialias, roundPixels: this.game.config.roundPixels, zoom: this.scale.zoom },
      renderer: this.game.renderer.type === Phaser.WEBGL ? 'WEBGL' : 'CANVAS' };
    window.__visualProof = { report, show: (state, guides = false, frame = 0, phase = 0, tile = 'env_sky_outskirts') => {
      this.state = state; this.guides = guides; this.frame = frame; this.phase = phase; this.seamKey = tile; this.compose();
    } };
  }

  private art02b_run(): void {
    const roadY = this.sy + 214;
    const skyY = roadY - 300;
    const sky = this.textures.get('env_sky_outskirts');
    if (!sky.has('top-row')) sky.add('top-row', 0, 0, 0, 16, 1);
    if (skyY > 0) this.add.tileSprite(0, 0, this.scale.width, skyY, 'env_sky_outskirts', 'top-row').setOrigin(0);
    this.tile('env_sky_outskirts', skyY, this.phase);
    this.tile('env_clouds_strip', roadY - 156, Math.floor(this.phase / 3) + 294);
    this.tile('env_far_junkyard', roadY - 96, this.phase + 166);
    this.tile('env_road_asphalt', roadY, this.phase);
    const road = this.textures.get('env_road_asphalt');
    if (!road.has('bottom-row')) road.add('bottom-row', 0, 0, 47, 64, 1);
    const below = this.scale.height - roadY - 48;
    if (below > 0) this.add.tileSprite(0, roadY + 48, this.scale.width, below, 'env_road_asphalt', 'bottom-row').setOrigin(0);
    this.image('prop_scrap_pile_a', this.sx + 126, roadY - 53);
    this.car(this.sx + 20, roadY - 55, 2);

    // Concept C Run HUD
    this.image('icon_scrap', this.sx + 8, this.sy + 6);
    this.label('currency', '342', this.sx + 28, this.sy + 5);
    this.image('icon_ui_mail', this.sx + 180 - 16 - 8, this.sy + 6);
  }

  private art02b_garage(): void {
    this.image('env_garage_wall', this.sx - 18, this.sy - 69, 0, false);
    this.image('env_garage_lift', this.sx + 22, this.sy + 212);
    this.car(this.sx + 34, this.sy + 158, 1);

    // Global Anchors
    this.image('icon_scrap', this.sx + 8, this.sy + 6);
    this.label('currency', '342', this.sx + 28, this.sy + 5);
    this.image('icon_ui_mail', this.sx + 180 - 16 - 8, this.sy + 6);

    // Garage telemetry above car
    const carCx = this.sx + 34 + 56;
    const stripY = this.sy + 158 - 22; // Above car
    const startX = carCx - 60;

    // Fuel, Heat, Speed manually positioned to match concept
    const inner = 4;
    const itemGap = 34; // approx spacing

    this.image('icon_stat_fuel', startX, stripY);
    this.label('statValue', '45%', startX + 14 + inner, stripY - 1).setDropShadow(1, 1, 0x130e14, 1);

    this.image('icon_stat_heat', startX + itemGap, stripY);
    this.label('statValue', '20%', startX + itemGap + 14 + inner, stripY - 1).setDropShadow(1, 1, 0x130e14, 1);

    this.image('icon_stat_speed', startX + itemGap * 2, stripY);
    this.label('statValue', '4.2', startX + itemGap * 2 + 14 + inner, stripY - 1).setDropShadow(1, 1, 0x130e14, 1);
  }

  private art02b_seven(): void {
    this.panel(this.sx + 4, this.sy + 4, 172, 100);
    const parts = ['part_fuel_t1', 'part_cooling_t1', 'part_tires_t1', 'part_suspension_t1'];
    const icons = ['icon_stat_heat', 'icon_stat_speed', 'icon_ui_mail'];

    parts.forEach((p, i) => this.image(p, this.sx + 14 + i * 34, this.sy + 20));
    icons.forEach((ic, i) => this.image(ic, this.sx + 14 + i * 34, this.sy + 60));
  }

  private art02b_slots(): void {
    this.panel(this.sx + 4, this.sy + 4, 172, 280);
    const items = ['part_engine_t1', 'part_fuel_t1', 'part_cooling_t1', 'part_tires_t1', 'part_suspension_t1'];

    const startX = this.sx + 6;
    const startY = this.sy + 20;

    items.forEach((item, i) => {
      this.image('ui_slot_frame', startX + i * 34, startY);
      this.image(item, startX + i * 34 + 3, startY + 3);
    });
  }

  private art02b_icons(): void {
    this.panel(this.sx + 4, this.sy + 4, 172, 100);
    const icons = ['icon_scrap', 'icon_stat_fuel', 'icon_stat_heat', 'icon_stat_speed', 'icon_ui_mail'];
    const startX = this.sx + 14;
    const startY = this.sy + 20;
    icons.forEach((ic, i) => {
      this.image(ic, startX + i * 30, startY);
    });
  }
}
