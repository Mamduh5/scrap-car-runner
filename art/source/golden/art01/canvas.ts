/**
 * ART-01 source — minimal indexed pixel canvas.
 *
 * Every pixel is a canonical palette NAME (src/game/assets/palette.ts) or null (transparent).
 * There is no anti-aliasing, no blending and no off-palette colour by construction: the
 * export step can only emit palette RGB at alpha 255 or fully transparent pixels.
 */
import { PALETTE, hexToRgb, type PaletteName } from '../../../../src/game/assets/palette.ts';

export type Px = PaletteName | null;

export class Canvas {
  readonly px: Px[];
  constructor(readonly w: number, readonly h: number) { this.px = new Array<Px>(w * h).fill(null); }

  inb(x: number, y: number): boolean { return x >= 0 && y >= 0 && x < this.w && y < this.h; }
  get(x: number, y: number): Px { return this.inb(x, y) ? this.px[y * this.w + x]! : null; }
  set(x: number, y: number, c: Px): void { if (this.inb(x, y)) this.px[y * this.w + x] = c; }

  rect(x0: number, y0: number, x1: number, y1: number, c: Px): void {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) this.set(x, y, c);
  }
  hline(x0: number, x1: number, y: number, c: Px): void { this.rect(x0, y, x1, y, c); }
  vline(x: number, y0: number, y1: number, c: Px): void { this.rect(x, y0, x, y1, c); }

  /** Bresenham line. */
  line(x0: number, y0: number, x1: number, y1: number, c: Px): void {
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  /** Even-odd scanline polygon fill sampled at pixel centres. */
  poly(pts: readonly (readonly [number, number])[], c: Px): void {
    let minY = Infinity, maxY = -Infinity;
    for (const [, y] of pts) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const yc = y + 0.5;
      const xs: number[] = [];
      for (let i = 0; i < pts.length; i++) {
        const [ax, ay] = pts[i]!, [bx, by] = pts[(i + 1) % pts.length]!;
        if ((ay <= yc && by > yc) || (by <= yc && ay > yc)) xs.push(ax + ((yc - ay) / (by - ay)) * (bx - ax));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        for (let x = Math.ceil(xs[i]! - 0.5); x <= Math.floor(xs[i + 1]! - 0.5); x++) this.set(x, y, c);
      }
    }
  }

  /** Filled disk; (cx, cy) are pixel-grid coordinates where pixel centres sit at +0.5. */
  disk(cx: number, cy: number, r: number, c: Px): void {
    for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y++)
      for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++)
        if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r) this.set(x, y, c);
  }

  /** Replace colour `from` with `to` in a rectangle (used for shading/weathering passes). */
  swap(x0: number, y0: number, x1: number, y1: number, from: Px, to: Px): void {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (this.get(x, y) === from) this.set(x, y, to);
  }

  /** Flat shaded plate: top row highlight, bottom row shadow. */
  plate(x0: number, y0: number, x1: number, y1: number, base: Px, hi: Px, sh: Px): void {
    this.rect(x0, y0, x1, y1, base);
    if (hi !== null) this.hline(x0, x1, y0, hi);
    if (sh !== null) this.hline(x0, x1, y1, sh);
  }

  /** Vertical cylinder shading (light from upper right): dark left, lit right-of-centre. */
  cyl(x0: number, y0: number, x1: number, y1: number, sh: Px, base: Px, hi: Px): void {
    const w = x1 - x0 + 1;
    for (let x = x0; x <= x1; x++) {
      const t = w === 1 ? 0.5 : (x - x0) / (w - 1);
      const c = t < 0.25 ? sh : t < 0.62 ? base : t < 0.9 ? hi : base;
      this.vline(x, y0, y1, c);
    }
  }

  /** Paint a 4-neighbour outline of `c` around every filled pixel (onto transparent pixels only). */
  outline(c: PaletteName): void {
    const add: number[] = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (this.get(x, y) !== null) continue;
      if (this.get(x - 1, y) !== null || this.get(x + 1, y) !== null || this.get(x, y - 1) !== null || this.get(x, y + 1) !== null) add.push(y * this.w + x);
    }
    for (const i of add) this.px[i] = c;
  }

  /** Draw `src` onto this canvas with its top-left at (ox, oy); null pixels are skipped. */
  blit(src: Canvas, ox: number, oy: number): void {
    for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) {
      const p = src.get(x, y);
      if (p !== null) this.set(x + ox, y + oy, p);
    }
  }

  /** Copy a sub-rectangle. */
  crop(x0: number, y0: number, w: number, h: number): Canvas {
    const out = new Canvas(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out.set(x, y, this.get(x0 + x, y0 + y));
    return out;
  }

  /** Visible-pixel bounding box, or null when empty. */
  bounds(): { x0: number; y0: number; x1: number; y1: number } | null {
    let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) if (this.get(x, y) !== null) {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
    return x1 < 0 ? null : { x0, y0, x1, y1 };
  }

  /** Straight RGBA bytes: palette RGB at alpha 255, or (0,0,0,0). */
  toRgba(): Uint8Array {
    const out = new Uint8Array(this.w * this.h * 4);
    this.px.forEach((p, i) => {
      if (p === null) return;
      const [r, g, b] = hexToRgb(PALETTE[p]);
      out[i * 4] = r; out[i * 4 + 1] = g; out[i * 4 + 2] = b; out[i * 4 + 3] = 255;
    });
    return out;
  }
}

/** Horizontal strip of equal frames (registered spritesheet layout: no margin, no spacing). */
export function strip(frames: readonly Canvas[]): Canvas {
  const f0 = frames[0]!;
  const out = new Canvas(f0.w * frames.length, f0.h);
  frames.forEach((f, i) => out.blit(f, i * f0.w, 0));
  return out;
}
