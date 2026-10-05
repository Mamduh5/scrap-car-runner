/**
 * game/assets/palette.ts — Canonical master palette ("Sunbaked Scrapyard").
 *
 * SINGLE SOURCE OF TRUTH for every colour that may appear in production art or be used as a
 * runtime colour constant. Consumers:
 *   - tools/assets/validateAssets.ts checks exported PNG pixels against this list
 *   - renderGpl()                   supplies canonical art/palette/scrap-master.gpl text; no export CLI yet
 *   - game code                     reads PALETTE_HEX / paletteInt for tints, text and clear colour
 * Rationale, ramp roles and usage rules: docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md §3 and docs/11.
 *
 * Ramps run dark -> light. Shadows shift toward blue/violet, highlights toward warm yellow.
 * Names are `<ramp>_<index>`; the ramp is the name without its trailing `_<index>`.
 */

/** `provisional` until the golden reference set is approved; then `locked` (see docs/11). */
export const PALETTE_STATUS: 'provisional' | 'locked' = 'provisional';

/** Hard cap so the palette cannot grow casually (palette drift). Raising it needs an art-direction decision. */
export const MAX_PALETTE_COLORS = 64;

/** Reserved chroma-key colour for AI generation backgrounds. Must never be a palette colour. */
export const CHROMA_KEY_HEX = '#FF00FF';

export const PALETTE = {
  // INK — outlines, void, deepest shadow. Never pure black.
  ink_0: '#130E14', ink_1: '#211921', ink_2: '#31262E',
  // STEEL — cool neutral metal, UI plates, glass glare.
  steel_0: '#3B3F4E', steel_1: '#565C6E', steel_2: '#7C8497', steel_3: '#A6AEBD', steel_4: '#D6DBE3',
  // RUST — burnt orange-brown. Saturation intentionally capped below the signal colours.
  rust_0: '#4A2420', rust_1: '#76352A', rust_2: '#A24F30', rust_3: '#C8703A', rust_4: '#E5985A',
  // DUST — sand, ground, warm light.
  dust_0: '#5E4838', dust_1: '#8A6F52', dust_2: '#B99A68', dust_3: '#DEC490', dust_4: '#F4E4B6',
  // TEAL — hero vehicle paint. Complement of the warm world so the car separates from the background.
  teal_0: '#17363F', teal_1: '#265F6B', teal_2: '#3F8F93', teal_3: '#6EBDB2', teal_4: '#B4E6D2',
  // YELLOW — workshop safety yellow: primary action, selection, tier-3 trim. Reserved accent.
  yellow_0: '#8F5F0E', yellow_1: '#D99A1B', yellow_2: '#F5C535', yellow_3: '#FFE784',
  // SIGNAL — gauge/state colours. High saturation reserved for these.
  fuel_0: '#17408A', fuel_1: '#2F78D6', fuel_2: '#6FB4F5', fuel_3: '#B8E2FF',
  heat_0: '#8E1A1F', heat_1: '#E03A28', heat_2: '#FF7A3D', heat_3: '#FFC26B',
  dura_0: '#1F6B35', dura_1: '#43B04A', dura_2: '#8FDC5C', dura_3: '#D3F59A',
  // PAPER — taped work-order notes.
  paper_0: '#B8A987', paper_1: '#D8CCA8', paper_2: '#F1E8CC',
  // SKY — one authored ramp per road segment (environment-scoped, not for objects).
  sky_outskirts_0: '#4FA3C0', sky_outskirts_1: '#7CC4D3', sky_outskirts_2: '#AEDDD6', sky_outskirts_3: '#E3F0D2',
  sky_cracked_0: '#8CBFC0', sky_cracked_1: '#C4D8B8', sky_cracked_2: '#EBDDA5', sky_cracked_3: '#F6E3AE',
  sky_dirt_0: '#C88A52', sky_dirt_1: '#E0A45E', sky_dirt_2: '#F0C07A', sky_dirt_3: '#F8DA9A',
  sky_rocky_0: '#8E3A33', sky_rocky_1: '#C25A3A', sky_rocky_2: '#E4844A', sky_rocky_3: '#F4B070',
} as const satisfies Record<string, string>;

export type PaletteName = keyof typeof PALETTE;
export const PALETTE_HEX: Readonly<Record<PaletteName, string>> = PALETTE;
export const PALETTE_NAMES = Object.keys(PALETTE) as readonly PaletteName[];

/** Ramp name of a palette colour, e.g. `sky_dirt_2` -> `sky_dirt`. */
export function rampOf(name: string): string {
  return name.replace(/_\d+$/, '');
}

export function hexToRgb(hex: string): readonly [number, number, number] {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (m === null || m[1] === undefined) throw new Error('Invalid hex colour: ' + hex);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** Colour as a 0xRRGGBB integer (Phaser tint / fillStyle form). */
export function paletteInt(name: PaletteName): number {
  const [r, g, b] = hexToRgb(PALETTE[name]);
  return (r << 16) | (g << 8) | b;
}

/** Packed 0xRRGGBB values of the whole palette, for fast pixel membership tests. */
export function paletteRgbSet(): ReadonlySet<number> {
  return new Set(PALETTE_NAMES.map(paletteInt));
}

/** WCAG relative luminance of an `#RRGGBB` colour. */
export function relativeLuminance(hex: string): number {
  const lin = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Declared text/background pairings for UI proof; declaration alone does not enforce contrast.
 * Numerical enforcement/rendered acceptance remain pending; see D14 typography/visual proofs. `large` text (display font,
 * cap height >= 11 art pixels) may use the 3:1 floor; everything else needs 4.5:1.
 */
export const UI_TEXT_PAIRS: readonly {
  readonly label: string; readonly fg: PaletteName; readonly bg: PaletteName; readonly large: boolean;
}[] = [
  { label: 'body text on dark inset',     fg: 'steel_4',  bg: 'ink_1',   large: false },
  { label: 'body text on steel plate',    fg: 'steel_4',  bg: 'steel_0', large: false },
  { label: 'ink text on paper note',      fg: 'ink_0',    bg: 'paper_2', large: false },
  { label: 'ink label on yellow button',  fg: 'ink_0',    bg: 'yellow_2', large: false },
  { label: 'yellow highlight on inset',   fg: 'yellow_2', bg: 'ink_1',   large: false },
  { label: 'failure stamp on dark inset', fg: 'heat_1',   bg: 'ink_1',   large: true },
  { label: 'failure stamp on paper',      fg: 'heat_0',   bg: 'paper_2', large: true },
];

/** GIMP palette text (.gpl) — the format Aseprite, LibreSprite and Pixelorama import. */
export function renderGpl(): string {
  const lines = ['GIMP Palette', 'Name: Scrap Car Runner Master', 'Columns: 8', '#',
    '# GENERATED by renderGpl() from src/game/assets/palette.ts. Do not edit by hand.',
    '# Status: ' + PALETTE_STATUS];
  for (const name of PALETTE_NAMES) {
    const [r, g, b] = hexToRgb(PALETTE[name]);
    lines.push([r, g, b].map(v => String(v).padStart(3, ' ')).join(' ') + '\t' + name);
  }
  return lines.join('\n') + '\n';
}
