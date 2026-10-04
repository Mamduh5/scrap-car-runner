/**
 * game/config/pixelViewport.ts — integer pixel-scale viewport maths (pure, no Phaser, unit tested).
 *
 * WHY THIS EXISTS (docs/04 §4)
 *   Art is authored on ONE pixel grid ("art pixel", AP). To keep every AP the same on-screen size,
 *   the canvas must be an exact INTEGER multiple of device pixels per AP. The previous strategy
 *   (fixed 360-wide logical canvas scaled with Phaser FIT) produced fractional scales such as
 *   3.25 device px per art pixel on a 390x844 @3x phone: uneven pixel widths and shimmer on scroll.
 *
 * STRATEGY — integer scale, flexible logical size
 *   1. physical = CSS size x devicePixelRatio
 *   2. pixelScale S = largest integer such that the 180x288 SAFE rect still fits
 *   3. logical size = floor(physical / S), clamped to [safe, max]
 *   The canvas is then drawn at exactly S device pixels per AP (cssZoom = S / DPR) and fills the
 *   window except for < S device pixels (invisible) — no letterboxing on real phones.
 *
 * Critical content must live in the centred SAFE rect; backgrounds bleed out to the MAX rect.
 */

export const VIEWPORT_LIMITS = {
  /** Guaranteed-visible area, in art pixels. All critical art and UI lives here. */
  SAFE_WIDTH: 180,
  SAFE_HEIGHT: 288,
  /** Largest logical canvas. Backgrounds are authored to this size. */
  MAX_WIDTH: 216,
  MAX_HEIGHT: 427,
} as const;

export interface ViewportInput {
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly devicePixelRatio: number;
}

export interface PixelViewport {
  /** Device pixels per art pixel. Always an integer >= 1. */
  readonly pixelScale: number;
  /** Logical canvas size in art pixels. */
  readonly width: number;
  readonly height: number;
  /** CSS pixels per art pixel (= pixelScale / devicePixelRatio): the value for Phaser's scale zoom. */
  readonly cssZoom: number;
}

const EPSILON = 1e-6;

function positiveOr(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function computePixelViewport(input: ViewportInput): PixelViewport {
  const { SAFE_WIDTH, SAFE_HEIGHT, MAX_WIDTH, MAX_HEIGHT } = VIEWPORT_LIMITS;
  const dpr = positiveOr(input.devicePixelRatio, 1);
  const physicalWidth = positiveOr(input.innerWidth, SAFE_WIDTH) * dpr;
  const physicalHeight = positiveOr(input.innerHeight, SAFE_HEIGHT) * dpr;

  const pixelScale = Math.max(1, Math.floor(
    Math.min(physicalWidth / SAFE_WIDTH, physicalHeight / SAFE_HEIGHT) + EPSILON));
  const width = clamp(Math.floor(physicalWidth / pixelScale + EPSILON), SAFE_WIDTH, MAX_WIDTH);
  const height = clamp(Math.floor(physicalHeight / pixelScale + EPSILON), SAFE_HEIGHT, MAX_HEIGHT);

  return { pixelScale, width, height, cssZoom: pixelScale / dpr };
}

/** Reads the live window. Safe in Node (returns the safe-rect default at DPR 1). */
export function readWindowViewport(win: Pick<Window, 'innerWidth' | 'innerHeight' | 'devicePixelRatio'> | undefined =
  typeof window !== 'undefined' ? window : undefined): ViewportInput {
  return win === undefined
    ? { innerWidth: VIEWPORT_LIMITS.SAFE_WIDTH, innerHeight: VIEWPORT_LIMITS.SAFE_HEIGHT, devicePixelRatio: 1 }
    : { innerWidth: win.innerWidth, innerHeight: win.innerHeight, devicePixelRatio: win.devicePixelRatio };
}
