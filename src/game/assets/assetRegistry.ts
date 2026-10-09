/**
 * game/assets/assetRegistry.ts — CANONICAL machine-readable VS1 asset registry.
 *
 * This file is the single source of truth for WHICH production art exists, how big it is and how
 * far through the approval gate it is. docs/04 explains the art; this file lists the assets.
 * Documentation must reference it, never copy per-asset tables (that is how drift starts).
 *
 * Consumers: tools/assets/validateAssets.ts (technical gates), and — later — the BootScene
 * loader (load assets whose status is `technical` or beyond). Contact-sheet automation is future work.
 *
 * Conventions (enforced by tools/assets/validateAssets.ts):
 *   - `id` === Phaser texture key === file stem. No second naming scheme.
 *   - Runtime file: public/assets/<category>/<id>.png  (+ <id>.xml for bitmap fonts).
 *   - Spritesheets are ONE horizontal strip, no margin/spacing: width = frame.w * frames.
 *   - `status` is the approval-gate position; see docs/11_ASSET_PRODUCTION_WORKFLOW.md.
 *   - Subjective art notes do NOT belong here; they belong in docs/04.
 */

import type { PartFamily } from '@/types/game';
import { MAX_TIER, PART_FAMILIES } from '@/types/game';

export const ASSET_CATEGORIES = ['vehicles', 'parts', 'icons', 'ui', 'fonts', 'environments', 'props', 'effects'] as const;
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

/** Required id prefix per category (also the runtime sub-directory name). */
export const CATEGORY_PREFIX: Readonly<Record<AssetCategory, string>> = {
  vehicles: 'veh_', parts: 'part_', icons: 'icon_', ui: 'ui_', fonts: 'font_',
  environments: 'env_', props: 'prop_', effects: 'fx_',
};

/** Approval gate, in order. See docs/11. */
export const ASSET_STATUSES = ['planned', 'draft', 'technical', 'visual', 'ingame', 'approved'] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

/**
 * Production order. `proof_*` is the golden reference set; it must be fully approved before any
 * other phase may leave `planned` (validator rule `golden-gate`).
 */
export const ASSET_PHASES = ['proof_a', 'proof_b', 'proof_c', 'hero', 'ui', 'parts', 'road', 'fx', 'polish'] as const;
export type AssetPhase = (typeof ASSET_PHASES)[number];

/**
 * Alpha contract:
 *   cutout — binary alpha AND at least one fully transparent pixel (rejects baked backgrounds)
 *   binary — alpha is 0 or 255 only (no anti-aliased edges)
 *   opaque — every pixel alpha 255
 *   soft   — arbitrary alpha allowed (smoke, soft shadow); edges must still be pixel-crisp
 */
export type AlphaMode = 'cutout' | 'binary' | 'opaque' | 'soft';

/**
 * Colour contract:
 *   palette   — every visible pixel is a master-palette colour
 *   grayscale — r=g=b for every visible pixel; the asset is tinted at runtime (fx, fonts, stamps)
 */
/** sky-ramp is restricted to the owner-authorized Outskirts reference row ramp. */
export type ColorMode = 'palette' | 'grayscale' | 'sky-ramp';

export type EnvironmentLayer = 'sky' | 'far' | 'ground';

export interface Size { readonly w: number; readonly h: number }
export interface NineSlice { readonly left: number; readonly right: number; readonly top: number; readonly bottom: number }

/** Ties an asset to canonical game data so art coverage cannot drift from content. */
export type AssetBinding =
  | { readonly type: 'part'; readonly id: string }
  | { readonly type: 'chassis'; readonly id: string }
  | { readonly type: 'roadSegment'; readonly roadId: string; readonly segment: number };

interface AssetCommon {
  readonly id: string;
  readonly category: AssetCategory;
  readonly scope: 'vs1';
  readonly phase: AssetPhase;
  readonly status: AssetStatus;
  readonly required: boolean;
  readonly alpha: AlphaMode;
  readonly color: ColorMode;
  /** Minimum transparent pixels required on every edge of every frame (framing/clipping guard). */
  readonly margin: number;
  readonly binds: readonly AssetBinding[];
  readonly nineSlice?: NineSlice;
  readonly tileX?: boolean;
  readonly layer?: EnvironmentLayer;
  /** Review grouping: part family contact sheets include icon, overlay and wheel of one family. */
  readonly family?: PartFamily;
}
export interface ImageAsset extends AssetCommon { readonly kind: 'image'; readonly size: Size }
export interface SpritesheetAsset extends AssetCommon {
  readonly kind: 'spritesheet'; readonly frame: Size; readonly frames: number;
}
/** BMFont atlas: <id>.png + <id>.xml (Phaser load.bitmapFont). Atlas size is free. */
export interface BitmapFontAsset extends AssetCommon { readonly kind: 'bitmap_font' }
export type AssetDefinition = ImageAsset | SpritesheetAsset | BitmapFontAsset;

/** The golden reference set: every `proof_*` asset. */
export function isGolden(asset: AssetDefinition): boolean {
  return asset.phase.startsWith('proof_');
}

/** Pixel size of the whole file, or null when free (bitmap font atlases). */
export function expectedFileSize(asset: AssetDefinition): Size | null {
  switch (asset.kind) {
    case 'image': return asset.size;
    case 'spritesheet': return { w: asset.frame.w * asset.frames, h: asset.frame.h };
    case 'bitmap_font': return null;
  }
}

/** Frame rectangle size used for margin / blank-frame checks. */
export function frameSize(asset: AssetDefinition): Size | null {
  switch (asset.kind) {
    case 'image': return asset.size;
    case 'spritesheet': return asset.frame;
    case 'bitmap_font': return null;
  }
}

/** Runtime files relative to public/assets/ (POSIX separators). */
export function runtimeFiles(asset: AssetDefinition): readonly string[] {
  const base = asset.category + '/' + asset.id;
  return asset.kind === 'bitmap_font' ? [base + '.png', base + '.xml'] : [base + '.png'];
}

/** URL a Phaser loader should use (relative to the app base, like `assets/...` in docs/06). */
export function runtimeUrl(file: string): string {
  return 'assets/' + file;
}

// ---------------------------------------------------------------------------------------------
// Builders (keep the registry below to one line per asset)
// ---------------------------------------------------------------------------------------------

interface Opts {
  readonly phase: AssetPhase;
  /** Recorded approval-gate position (defaults to planned); advanced only with evidence per docs/11. */
  readonly status?: AssetStatus;
  readonly required?: boolean;
  readonly alpha?: AlphaMode;
  readonly color?: ColorMode;
  readonly margin?: number;
  readonly binds?: readonly AssetBinding[];
  readonly nineSlice?: NineSlice;
  readonly tileX?: boolean;
  readonly layer?: EnvironmentLayer;
  readonly family?: PartFamily;
}

function common(id: string, category: AssetCategory, o: Opts): AssetCommon {
  return {
    id, category, scope: 'vs1', phase: o.phase, status: o.status ?? 'planned',
    required: o.required ?? true, alpha: o.alpha ?? 'cutout', color: o.color ?? 'palette',
    margin: o.margin ?? 0, binds: o.binds ?? [],
    ...(o.nineSlice !== undefined ? { nineSlice: o.nineSlice } : {}),
    ...(o.tileX !== undefined ? { tileX: o.tileX } : {}),
    ...(o.layer !== undefined ? { layer: o.layer } : {}),
    ...(o.family !== undefined ? { family: o.family } : {}),
  };
}
const image = (id: string, category: AssetCategory, w: number, h: number, o: Opts): ImageAsset =>
  ({ ...common(id, category, o), kind: 'image', size: { w, h } });
const sheet = (id: string, category: AssetCategory, fw: number, fh: number, frames: number, o: Opts): SpritesheetAsset =>
  ({ ...common(id, category, o), kind: 'spritesheet', frame: { w: fw, h: fh }, frames });
const font = (id: string, o: Opts): BitmapFontAsset => ({ ...common(id, 'fonts', o), kind: 'bitmap_font' });
const nine = (n: number): NineSlice => ({ left: n, right: n, top: n, bottom: n });

const TIERS = [1, 2, 3] as const;
const CHASSIS_ID = 'chassis_rustbucket';
const ROAD_ID = 'road_scrapland_highway';
const seg = (segment: number): AssetBinding => ({ type: 'roadSegment', roadId: ROAD_ID, segment });
const part = (family: PartFamily, tier: number): AssetBinding => ({ type: 'part', id: family + '_t' + tier });
/** The golden set uses the engine family as the progression-ladder proof. UI Golden expansion needs T1 icons for all families. */
const familyPhase = (family: PartFamily, tier: number): AssetPhase => {
  if (family === 'engine') return 'proof_a';
  if (tier === 1) return 'proof_b';
  return 'parts';
};

// ---------------------------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------------------------

const vehicles: readonly AssetDefinition[] = [
  // Body: 112x56 canvas shared by every overlay so layers register by drawing in place.
  image('veh_rustbucket_body', 'vehicles', 112, 56, { phase: 'proof_a', status: 'visual', binds: [{ type: 'chassis', id: CHASSIS_ID }] }),
  // Overlays for the four body-mounted families (tires are the wheel sheets below).
  ...(['engine', 'fuel', 'cooling', 'suspension'] as const).flatMap(family => TIERS.map(tier =>
    image('veh_rustbucket_ov_' + family + '_t' + tier, 'vehicles', 112, 56, {
      phase: family === 'engine' ? 'proof_a' : 'parts', status: family === 'engine' ? 'visual' : 'planned', family,
      binds: [{ type: 'chassis', id: CHASSIS_ID }, part(family, tier)],
    }))),
  // Authored 4-frame wheel cycles (no code rotation of low-resolution wheels).
  ...TIERS.map(tier => sheet('veh_wheel_tires_t' + tier, 'vehicles', 24, 24, 4, {
    phase: tier === 1 ? 'proof_a' : 'parts', status: tier === 1 ? 'visual' : 'planned', family: 'tires', binds: [part('tires', tier)],
  })),
  sheet('veh_wheel_bare', 'vehicles', 24, 24, 4, { phase: 'hero' }),
  image('veh_shadow', 'vehicles', 112, 8, { phase: 'hero', alpha: 'soft' }),
  image('veh_rustbucket_wrecked', 'vehicles', 112, 56, { phase: 'polish', required: false }),
];

const parts: readonly AssetDefinition[] = PART_FAMILIES.flatMap(family => TIERS.map(tier =>
  image('part_' + family + '_t' + tier, 'parts', 24, 24, {
    phase: familyPhase(family, tier), status: family === 'engine' ? 'visual' : 'planned', margin: 1, family, binds: [part(family, tier)],
  })));
if (TIERS.length !== MAX_TIER) throw new Error('assetRegistry TIERS must match MAX_TIER');

const icons: readonly AssetDefinition[] = [
  image('icon_scrap', 'icons', 16, 16, { phase: 'proof_b', status: 'visual', margin: 1 }),
  image('icon_stat_fuel', 'icons', 16, 16, { phase: 'proof_b', status: 'visual', margin: 1 }),
  image('icon_stat_power', 'icons', 16, 16, { phase: 'ui', margin: 1 }),
  image('icon_stat_cooling', 'icons', 16, 16, { phase: 'ui', margin: 1 }),
  image('icon_stat_heat', 'icons', 16, 16, { phase: 'proof_b', margin: 1 }),
  image('icon_stat_durability', 'icons', 16, 16, { phase: 'ui', margin: 1 }),
  image('icon_stat_weight', 'icons', 16, 16, { phase: 'ui', margin: 1 }),
  image('icon_stat_speed', 'icons', 16, 16, { phase: 'proof_b', margin: 1 }),
  image('icon_ui_settings', 'icons', 16, 16, { phase: 'ui', margin: 1 }),
  image('icon_ui_pause', 'icons', 16, 16, { phase: 'ui', margin: 1 }),
  image('icon_ui_mail', 'icons', 16, 16, { phase: 'proof_b', margin: 1 }),
];

const ui: readonly AssetDefinition[] = [
  image('ui_panel_plate', 'ui', 32, 32, { phase: 'proof_b', status: 'visual', alpha: 'binary', nineSlice: nine(8) }),
  image('ui_panel_inset', 'ui', 16, 16, { phase: 'ui', alpha: 'binary', nineSlice: nine(4) }),
  image('ui_panel_note', 'ui', 24, 24, { phase: 'ui', alpha: 'binary', nineSlice: nine(6) }),
  // Button frames: 0 normal, 1 pressed, 2 disabled.
  sheet('ui_button_primary', 'ui', 24, 24, 3, { phase: 'proof_b', status: 'visual', alpha: 'binary', nineSlice: nine(8) }),
  sheet('ui_button_secondary', 'ui', 24, 24, 3, { phase: 'ui', alpha: 'binary', nineSlice: nine(8) }),
  // Slot frames: 0 idle, 1 selected, 2 valid target, 3 blocked/disabled.
  sheet('ui_slot_frame', 'ui', 30, 30, 4, { phase: 'proof_b', status: 'visual', alpha: 'binary' }),
  // Tier pips: frame n lights n pips.
  sheet('ui_tier_pips', 'ui', 15, 5, 3, { phase: 'ui', alpha: 'binary' }),
  image('ui_badge_max', 'ui', 17, 9, { phase: 'ui', alpha: 'binary' }),
  image('ui_badge_merge', 'ui', 13, 13, { phase: 'ui', alpha: 'binary' }),
  image('ui_gauge_frame', 'ui', 12, 12, { phase: 'ui', alpha: 'binary', nineSlice: nine(4) }),
  // Fill tiles: 0 fuel, 1 heat, 2 durability.
  sheet('ui_gauge_fill', 'ui', 8, 6, 3, { phase: 'ui', alpha: 'opaque' }),
  image('ui_stamp_frame', 'ui', 16, 16, { phase: 'ui', alpha: 'binary', color: 'grayscale', nineSlice: nine(5) }),
];

const fonts: readonly AssetDefinition[] = [
  font('font_display', { phase: 'proof_b', status: 'visual', alpha: 'binary', color: 'grayscale' }),
  font('font_body', { phase: 'proof_b', status: 'visual', alpha: 'binary', color: 'grayscale' }),
];

const environments: readonly AssetDefinition[] = [
  // Garage: authored at the maximum viewport; the centred 180x288 safe rect holds everything critical.
  image('env_garage_wall', 'environments', 216, 427, { phase: 'proof_c', status: 'visual', alpha: 'opaque' }),
  image('env_garage_lift', 'environments', 136, 20, { phase: 'proof_c', status: 'visual' }),
  image('env_garage_fg', 'environments', 216, 64, { phase: 'polish', required: false }),
  // Run: opaque base sky, optional cloud cutout, far silhouettes and road tiles.
  image('env_sky_outskirts', 'environments', 16, 300, { phase: 'proof_c', status: 'visual', alpha: 'opaque', color: 'sky-ramp', tileX: true, layer: 'sky', binds: [seg(0)] }),
  image('env_sky_cracked', 'environments', 16, 300, { phase: 'road', alpha: 'opaque', tileX: true, layer: 'sky', binds: [seg(1)] }),
  image('env_sky_dirt', 'environments', 16, 300, { phase: 'road', alpha: 'opaque', tileX: true, layer: 'sky', binds: [seg(2)] }),
  image('env_sky_rocky', 'environments', 16, 300, { phase: 'road', alpha: 'opaque', tileX: true, layer: 'sky', binds: [seg(3)] }),
  image('env_far_junkyard', 'environments', 256, 96, { phase: 'proof_c', status: 'visual', tileX: true, layer: 'far', binds: [seg(0), seg(1)] }),
  image('env_far_dunes', 'environments', 256, 96, { phase: 'road', tileX: true, layer: 'far', binds: [seg(2)] }),
  image('env_far_cliffs', 'environments', 256, 96, { phase: 'road', tileX: true, layer: 'far', binds: [seg(3)] }),
  image('env_road_asphalt', 'environments', 64, 48, { phase: 'proof_c', status: 'visual', alpha: 'opaque', tileX: true, layer: 'ground', binds: [seg(0)] }),
  image('env_road_cracked', 'environments', 64, 48, { phase: 'road', alpha: 'opaque', tileX: true, layer: 'ground', binds: [seg(1)] }),
  image('env_road_dirt', 'environments', 64, 48, { phase: 'road', alpha: 'opaque', tileX: true, layer: 'ground', binds: [seg(2)] }),
  image('env_road_rock', 'environments', 64, 48, { phase: 'road', alpha: 'opaque', tileX: true, layer: 'ground', binds: [seg(3)] }),
  image('env_clouds_strip', 'environments', 384, 96, { phase: 'polish', status: 'visual', required: false, tileX: true }),
];

const props: readonly AssetDefinition[] = [
  image('prop_scrap_pile_a', 'props', 48, 32, { phase: 'proof_c', status: 'visual' }),
  image('prop_scrap_pile_b', 'props', 40, 24, { phase: 'road' }),
  image('prop_tire_stack', 'props', 24, 24, { phase: 'road' }),
  image('prop_barrel', 'props', 16, 24, { phase: 'road' }),
  image('prop_fence', 'props', 48, 24, { phase: 'road' }),
  image('prop_utility_pole', 'props', 24, 64, { phase: 'road' }),
  image('prop_sign_road', 'props', 24, 40, { phase: 'road' }),
  image('prop_sign_grade', 'props', 24, 40, { phase: 'road' }),
  image('prop_shrub_dry', 'props', 24, 16, { phase: 'road' }),
  image('prop_dead_tree', 'props', 32, 56, { phase: 'road' }),
  image('prop_boulder_a', 'props', 40, 28, { phase: 'road' }),
  image('prop_boulder_b', 'props', 24, 18, { phase: 'road' }),
];

const effects: readonly AssetDefinition[] = [
  // Grayscale + soft alpha: tinted at runtime (white steam, grey exhaust, black smoke).
  sheet('fx_puff', 'effects', 16, 16, 4, { phase: 'proof_c', status: 'visual', alpha: 'soft', color: 'grayscale' }),
  sheet('fx_spark', 'effects', 8, 8, 4, { phase: 'fx', alpha: 'binary' }),
  sheet('fx_merge_burst', 'effects', 32, 32, 6, { phase: 'fx', alpha: 'binary' }),
  sheet('fx_dust', 'effects', 16, 16, 4, { phase: 'fx', alpha: 'soft', color: 'grayscale' }),
];

export const ASSET_REGISTRY: readonly AssetDefinition[] =
  [...vehicles, ...parts, ...icons, ...ui, ...fonts, ...environments, ...props, ...effects];

export const ASSET_BY_ID: ReadonlyMap<string, AssetDefinition> = new Map(ASSET_REGISTRY.map(a => [a.id, a]));
