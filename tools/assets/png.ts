/**
 * tools/assets/png.ts — minimal, dependency-free PNG reader/writer for asset validation.
 *
 * Reads 8-bit, non-interlaced PNG of colour types 0/2/3/4/6 into RGBA. Anything else is rejected
 * with a precise message, because the production export contract is "8-bit, non-interlaced,
 * no colour-management chunks" (docs/11 §6). Writes 8-bit RGBA PNG (used by contact sheets/tests).
 */
import { crc32, deflateSync, inflateSync } from 'node:zlib';

export const PNG_SIGNATURE = Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);

/** Chunks that make browsers colour-convert textures and silently shift palette colours. */
export const FORBIDDEN_COLOR_CHUNKS: readonly string[] = ['gAMA', 'iCCP', 'cHRM'];

export class PngError extends Error {
  constructor(message: string) { super(message); this.name = 'PngError'; }
}

export interface DecodedPng {
  readonly width: number;
  readonly height: number;
  readonly colorType: number;
  readonly chunkTypes: readonly string[];
  /** Row-major RGBA, 4 bytes per pixel. */
  readonly rgba: Uint8Array;
}

const CHANNELS: Readonly<Record<number, number>> = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

function readU32(b: Uint8Array, o: number): number {
  return ((b[o]! << 24) | (b[o + 1]! << 16) | (b[o + 2]! << 8) | b[o + 3]!) >>> 0;
}

export function decodePng(input: Uint8Array): DecodedPng {
  if (input.length < 8 || PNG_SIGNATURE.some((v, i) => input[i] !== v)) throw new PngError('not a PNG file (bad signature)');

  let offset = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = -1, interlace = 0, sawIhdr = false, sawIend = false;
  let palette: Uint8Array | null = null;
  let trns: Uint8Array | null = null;
  const idat: Uint8Array[] = [];
  const chunkTypes: string[] = [];

  while (offset + 12 <= input.length && !sawIend) {
    const length = readU32(input, offset);
    const type = String.fromCharCode(input[offset + 4]!, input[offset + 5]!, input[offset + 6]!, input[offset + 7]!);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > input.length) throw new PngError('truncated PNG chunk ' + type);
    const data = input.subarray(dataStart, dataEnd);
    if (crc32(input.subarray(offset + 4, dataEnd)) !== readU32(input, dataEnd)) throw new PngError('CRC mismatch in chunk ' + type);
    chunkTypes.push(type);
    if (!sawIhdr && type !== 'IHDR') throw new PngError('IHDR must be the first chunk');

    if (type === 'IHDR') {
      if (sawIhdr) throw new PngError('duplicate IHDR');
      if (length !== 13) throw new PngError('bad IHDR length');
      if (data[10] !== 0) throw new PngError('unsupported compression method ' + data[10]);
      if (data[11] !== 0) throw new PngError('unsupported filter method ' + data[11]);
      width = readU32(data, 0); height = readU32(data, 4);
      bitDepth = data[8]!; colorType = data[9]!; interlace = data[12]!;
      sawIhdr = true;
    } else if (type === 'PLTE') palette = data;
    else if (type === 'tRNS') trns = data;
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') {
      if (length !== 0) throw new PngError('bad IEND length');
      sawIend = true;
    } else if ((type.charCodeAt(0) & 0x20) === 0) throw new PngError('unsupported critical chunk ' + type);
    offset = dataEnd + 4;
  }

  if (!sawIhdr) throw new PngError('missing IHDR');
  if (!sawIend) throw new PngError('missing IEND (truncated file)');
  if (bitDepth !== 8) throw new PngError('unsupported bit depth ' + bitDepth + ' (export 8-bit)');
  if (interlace !== 0) throw new PngError('interlaced PNG is not supported (export non-interlaced)');
  const channels = CHANNELS[colorType];
  if (channels === undefined) throw new PngError('unsupported colour type ' + colorType);
  if (colorType === 3 && palette === null) throw new PngError('indexed PNG without PLTE');
  if (trns !== null && ((colorType === 0 && trns.length !== 2) || (colorType === 2 && trns.length !== 6) || colorType === 4 || colorType === 6)) throw new PngError('invalid tRNS for colour type ' + colorType);
  if (width === 0 || height === 0 || width > 16384 || height > 16384) throw new PngError('invalid dimensions ' + width + 'x' + height);

  let raw: Uint8Array;
  try { raw = inflateSync(Buffer.concat(idat)); } catch { throw new PngError('corrupt IDAT stream'); }
  const stride = width * channels;
  if (raw.length !== (stride + 1) * height) throw new PngError('IDAT size does not match dimensions');

  // Unfilter in place into `pix`.
  const pix = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]!;
    const src = y * (stride + 1) + 1;
    const dst = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? pix[dst + x - channels]! : 0;
      const b = y > 0 ? pix[dst - stride + x]! : 0;
      const c = x >= channels && y > 0 ? pix[dst - stride + x - channels]! : 0;
      let v = raw[src + x]!;
      switch (filter) {
        case 0: break;
        case 1: v += a; break;
        case 2: v += b; break;
        case 3: v += (a + b) >> 1; break;
        case 4: {
          const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          break;
        }
        default: throw new PngError('bad scanline filter ' + filter);
      }
      pix[dst + x] = v & 0xff;
    }
  }

  const transparentGray = trns !== null && colorType === 0 ? (trns[0]! << 8) | trns[1]! : -1;
  const transparentRgb = trns !== null && colorType === 2
    ? [(trns[0]! << 8) | trns[1]!, (trns[2]! << 8) | trns[3]!, (trns[4]! << 8) | trns[5]!] : null;
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * channels, d = i * 4;
    switch (colorType) {
      case 0: rgba[d] = rgba[d + 1] = rgba[d + 2] = pix[s]!; rgba[d + 3] = pix[s] === transparentGray ? 0 : 255; break;
      case 2:
        rgba[d] = pix[s]!; rgba[d + 1] = pix[s + 1]!; rgba[d + 2] = pix[s + 2]!;
        rgba[d + 3] = transparentRgb !== null && pix[s] === transparentRgb[0] && pix[s + 1] === transparentRgb[1] && pix[s + 2] === transparentRgb[2] ? 0 : 255;
        break;
      case 3: {
        const idx = pix[s]!;
        rgba[d] = palette![idx * 3] ?? 0; rgba[d + 1] = palette![idx * 3 + 1] ?? 0; rgba[d + 2] = palette![idx * 3 + 2] ?? 0;
        rgba[d + 3] = trns !== null ? (trns[idx] ?? 255) : 255;
        break;
      }
      case 4: rgba[d] = rgba[d + 1] = rgba[d + 2] = pix[s]!; rgba[d + 3] = pix[s + 1]!; break;
      default: rgba[d] = pix[s]!; rgba[d + 1] = pix[s + 1]!; rgba[d + 2] = pix[s + 2]!; rgba[d + 3] = pix[s + 3]!;
    }
  }
  return { width, height, colorType, chunkTypes, rgba };
}

function chunk(type: string, data: Uint8Array): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  out.set(data, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

/** Encodes 8-bit RGBA. `extraChunks` (type, data) are inserted before IDAT — used to test forbidden chunks. */
export function encodePng(width: number, height: number, rgba: Uint8Array,
  extraChunks: readonly { readonly type: string; readonly data: Uint8Array }[] = []): Buffer {
  if (rgba.length !== width * height * 4) throw new PngError('rgba length does not match dimensions');
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    raw.set(rgba.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from(PNG_SIGNATURE), chunk('IHDR', ihdr),
    ...extraChunks.map(c => chunk(c.type, c.data)),
    chunk('IDAT', deflateSync(raw)), chunk('IEND', new Uint8Array(0)),
  ]);
}
