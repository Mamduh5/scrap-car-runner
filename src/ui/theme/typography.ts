export type TextRenderingType = 'text' | 'bitmap';
export type TextCasing = 'none' | 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase';

export interface TypographyToken {
  readonly type: TextRenderingType;
  /** The font family name (for 'text') or the cache key (for 'bitmap'). */
  readonly family: string;
  /** Size in logical pixels (assuming 360x640 base viewport). */
  readonly size: number;
  /** Palette hex colour or '#RRGGBB'. */
  readonly color: string;
  readonly casing: TextCasing;
  readonly align?: 'left' | 'center' | 'right';
  readonly lineHeight?: number;
  readonly letterSpacing?: number;
  readonly weight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  readonly maxLines?: number;
  readonly wordWrapWidth?: number;
  readonly shadow?: {
    readonly color: string;
    readonly offsetX: number;
    readonly offsetY: number;
  };
  readonly stroke?: {
    readonly color: string;
    readonly thickness: number;
  };
}

// Ensure PALETTE_HEX is used (from palette.ts, but we use hardcoded hex here for pure UI typing, 
// or import it from palette.ts to bind them).
import { PALETTE_HEX } from '../../game/assets/palette';

// Primary Display Font: Silkscreen (OFL) - Chunky, mechanical, scrapyard feel.
// Used for Headings, Action Buttons, and Large Distance counters.
const FONT_DISPLAY = 'Silkscreen';

// Secondary Body/Stats Font: VT323 (OFL) - Crisp, tall pixel font, high numeric readability.
// Used for body text, tooltips, stats, parts.
const FONT_BODY = 'VT323';

/**
 * The canonical source of truth for all UI typography roles in Scrap Car Runner.
 * No arbitrary font sizes or colors should be used in scenes.
 */
export const UI_TYPOGRAPHY = {
  // Screen and Section Titles
  gameTitle: {
    type: 'bitmap',
    family: FONT_DISPLAY,
    size: 48,
    color: PALETTE_HEX.teal_3,
    casing: 'uppercase',
    align: 'center',
    shadow: { color: PALETTE_HEX.ink_0, offsetX: 2, offsetY: 2 },
    stroke: { color: PALETTE_HEX.ink_1, thickness: 2 },
  } as TypographyToken,

  screenTitle: {
    type: 'bitmap', // Recommended production type
    family: FONT_DISPLAY,
    size: 24,
    color: PALETTE_HEX.steel_4,
    casing: 'uppercase',
    align: 'center',
    shadow: { color: PALETTE_HEX.ink_0, offsetX: 1, offsetY: 1 },
  } as TypographyToken,

  sectionHeader: {
    type: 'bitmap',
    family: FONT_DISPLAY,
    size: 16,
    color: PALETTE_HEX.steel_3,
    casing: 'uppercase',
    align: 'left',
  } as TypographyToken,

  // Buttons
  buttonPrimary: {
    type: 'bitmap',
    family: FONT_DISPLAY,
    size: 16,
    color: PALETTE_HEX.ink_0,
    casing: 'uppercase',
    align: 'center',
  } as TypographyToken, // Drawn on yellow_2 background (PALETTE_HEX.yellow_2)

  buttonSecondary: {
    type: 'bitmap',
    family: FONT_BODY,
    size: 16,
    color: PALETTE_HEX.steel_4,
    casing: 'uppercase',
    align: 'center',
  } as TypographyToken, // Drawn on steel_1 background

  // Stats and HUD (Numbers must be highly legible and update fast)
  distanceCounter: {
    type: 'bitmap',
    family: FONT_DISPLAY,
    size: 32,
    color: PALETTE_HEX.steel_4,
    casing: 'uppercase',
    align: 'right',
    stroke: { color: PALETTE_HEX.ink_0, thickness: 2 },
  } as TypographyToken,

  currency: {
    type: 'bitmap',
    family: FONT_BODY,
    size: 24,
    color: PALETTE_HEX.yellow_2,
    casing: 'uppercase',
    align: 'right',
  } as TypographyToken,

  statLabel: {
    type: 'bitmap',
    family: FONT_BODY,
    size: 16,
    color: PALETTE_HEX.steel_3,
    casing: 'uppercase',
    align: 'left',
  } as TypographyToken,

  statValue: {
    type: 'bitmap',
    family: FONT_BODY,
    size: 24,
    color: PALETTE_HEX.steel_4,
    casing: 'uppercase',
    align: 'right',
    shadow: { color: PALETTE_HEX.ink_0, offsetX: 1, offsetY: 1 },
  } as TypographyToken,

  // Body and Text
  body: {
    type: 'text', // Safe for Phaser Text since it might wrap heavily
    family: FONT_BODY,
    size: 16,
    color: PALETTE_HEX.steel_4,
    casing: 'none',
    align: 'left',
    lineHeight: 18,
    wordWrapWidth: 320, // Default safe width for 360px portrait
  } as TypographyToken,

  caption: {
    type: 'text',
    family: FONT_BODY,
    size: 12,
    color: PALETTE_HEX.steel_3,
    casing: 'none',
    align: 'left',
    wordWrapWidth: 320,
  } as TypographyToken,

  // Inventory & Parts
  partName: {
    type: 'bitmap',
    family: FONT_BODY,
    size: 16,
    color: PALETTE_HEX.yellow_2,
    casing: 'titlecase',
    align: 'left',
  } as TypographyToken,

  tierLabel: {
    type: 'bitmap',
    family: FONT_DISPLAY,
    size: 12,
    color: PALETTE_HEX.dura_2,
    casing: 'uppercase',
    align: 'center',
    shadow: { color: PALETTE_HEX.ink_0, offsetX: 1, offsetY: 1 },
  } as TypographyToken,

  resultCause: {
    type: 'bitmap',
    family: FONT_DISPLAY,
    size: 24,
    color: PALETTE_HEX.heat_1,
    casing: 'uppercase',
    align: 'center',
    stroke: { color: PALETTE_HEX.ink_0, thickness: 2 },
  } as TypographyToken,

  // Warnings and States
  warning: {
    type: 'bitmap',
    family: FONT_BODY,
    size: 16,
    color: PALETTE_HEX.heat_1, // Orange/Red
    casing: 'uppercase',
    align: 'center',
  } as TypographyToken,

  criticalWarning: {
    type: 'bitmap',
    family: FONT_DISPLAY,
    size: 24,
    color: PALETTE_HEX.heat_1,
    casing: 'uppercase',
    align: 'center',
    stroke: { color: PALETTE_HEX.ink_0, thickness: 2 },
  } as TypographyToken,

  success: {
    type: 'bitmap',
    family: FONT_DISPLAY,
    size: 16,
    color: PALETTE_HEX.dura_2, // Green
    casing: 'uppercase',
    align: 'center',
  } as TypographyToken,

  toast: {
    type: 'bitmap',
    family: FONT_BODY,
    size: 16,
    color: PALETTE_HEX.paper_2,
    casing: 'none',
    align: 'center',
    shadow: { color: PALETTE_HEX.ink_0, offsetX: 1, offsetY: 1 },
  } as TypographyToken,
} as const;

export type TypographyRole = keyof typeof UI_TYPOGRAPHY;

/**
 * Helper to convert a TypographyToken into a Phaser.Types.GameObjects.Text.TextStyle.
 * (Used when instantiating Phaser Text for prototyping or 'text' roles).
 */
export function toPhaserTextStyle(token: TypographyToken): Phaser.Types.GameObjects.Text.TextStyle {
  const style: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: token.family,
    fontSize: `${token.size}px`,
    color: token.color,
  };

  if (token.align) style.align = token.align;
  if (token.weight) style.fontStyle = token.weight.toString();
  
  if (token.wordWrapWidth) {
    style.wordWrap = { width: token.wordWrapWidth, useAdvancedWrap: true };
  }

  if (token.shadow) {
    style.shadow = {
      color: token.shadow.color,
      offsetX: token.shadow.offsetX,
      offsetY: token.shadow.offsetY,
      fill: true,
    };
  }

  if (token.stroke) {
    style.stroke = token.stroke.color;
    style.strokeThickness = token.stroke.thickness;
  }

  // Note: Phaser Text supports letterSpacing in WebGL but it is not a standard TextStyle property 
  // in the core definitions without plugins. For BitmapText it will be passed to the config.
  // To prevent Phaser's canvas from antialiasing text slightly, 
  // real pixel art games often prefer BitmapText for crispness.
  // This config works perfectly for standard Text fallbacks.
  
  return style;
}

/**
 * Helper to apply casing rules to raw strings before displaying.
 */
export function applyCasing(text: string, casing: TextCasing): string {
  switch (casing) {
    case 'uppercase': return text.toUpperCase();
    case 'lowercase': return text.toLowerCase();
    case 'titlecase': return text.replace(/\b\w/g, c => c.toUpperCase());
    case 'sentencecase': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    default: return text;
  }
}

/**
 * Helper to truncate text to a maximum length and append an ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 1) + '…';
}
