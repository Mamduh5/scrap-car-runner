/**
 * Review-only preview renderer (NOT a runtime export; lives under art/source and may use
 * non-palette backdrop colours). Composites body + overlay + wheel on a flat backdrop and
 * upscales with nearest-neighbour so the real art pixels can be inspected.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { encodePng } from '../../../../tools/assets/png.ts';
import { Canvas } from './canvas.ts';

export type Rgb = readonly [number, number, number];

export class Sheet {
  readonly data: Uint8Array;
  constructor(readonly w: number, readonly h: number, bg: Rgb) {
    this.data = new Uint8Array(w * h * 4);
    for (let i = 0; i < w * h; i++) { this.data[i * 4] = bg[0]; this.data[i * 4 + 1] = bg[1]; this.data[i * 4 + 2] = bg[2]; this.data[i * 4 + 3] = 255; }
  }
  fillRect(x0: number, y0: number, x1: number, y1: number, c: Rgb): void {
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = (y * this.w + x) * 4; this.data[i] = c[0]; this.data[i + 1] = c[1]; this.data[i + 2] = c[2]; }
  }
  /** Draw a canvas at integer scale s with top-left (ox, oy) in output pixels. */
  draw(src: Canvas, ox: number, oy: number, s: number): void {
    const rgba = src.toRgba();
    for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) {
      const i = (y * src.w + x) * 4;
      if (rgba[i + 3] === 0) continue;
      for (let yy = 0; yy < s; yy++) for (let xx = 0; xx < s; xx++) {
        const px = ox + x * s + xx, py = oy + y * s + yy;
        if (px < 0 || py < 0 || px >= this.w || py >= this.h) continue;
        const j = (py * this.w + px) * 4;
        this.data[j] = rgba[i]!; this.data[j + 1] = rgba[i + 1]!; this.data[j + 2] = rgba[i + 2]!;
      }
    }
  }
  save(path: string): void {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, encodePng(this.w, this.h, this.data));
  }
}
