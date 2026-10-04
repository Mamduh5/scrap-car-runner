/**
 * tools/assets/validateAssets.ts — production asset validator (pure; file access is injected).
 *
 * Validates the runtime asset tree (public/assets) against the canonical registry
 * (src/game/assets/assetRegistry.ts) and the master palette. It checks TECHNICAL correctness only
 * — dimensions, alpha contract, framing margin, palette membership, file hygiene, registry/game-data
 * coverage and the approval-gate rules. It never judges artistic quality (docs/13 does that).
 *
 * Modes
 *   preparation (default, --allow-missing): absent files are fine while art does not exist yet,
 *       but anything that DOES exist must be valid, and registry/palette errors always fail.
 *   strict (--strict): every required asset must exist and be valid.
 *   release (--release): strict + every required asset `approved` + palette `locked`.
 *
 * Severity rule: an asset at status `technical` or beyond is always held to full technical
 * validation (so an approved asset can never silently regress). Earlier statuses (`draft`) only
 * produce warnings for their own problems, unless --strict.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import type { ChassisDefinition, PartDefinition, RoadDefinition } from '../../src/types/game';
import {
  ASSET_CATEGORIES, ASSET_PHASES, ASSET_STATUSES, CATEGORY_PREFIX, expectedFileSize, frameSize, isGolden, runtimeFiles,
} from '../../src/game/assets/assetRegistry';
import type { AssetDefinition, AssetStatus } from '../../src/game/assets/assetRegistry';
import { CHROMA_KEY_HEX, hexToRgb } from '../../src/game/assets/palette';
import { decodePng, FORBIDDEN_COLOR_CHUNKS, PngError } from './png';
import type { DecodedPng } from './png';

// ------------------------------------------------------------------ file access

export interface AssetFs {
  /** All files under the runtime root as POSIX-relative paths. */
  list(): readonly string[];
  read(relativePath: string): Uint8Array | undefined;
}

export function memoryFs(files: Readonly<Record<string, Uint8Array | string>>): AssetFs {
  return {
    list: () => Object.keys(files).sort(),
    read: p => {
      const v = files[p];
      return v === undefined ? undefined : typeof v === 'string' ? Buffer.from(v, 'utf8') : v;
    },
  };
}

export function nodeFs(root: string): AssetFs {
  const walk = (dir: string): string[] => {
    if (!existsSync(dir)) return [];
    return readdirSync(dir).flatMap(name => {
      const full = join(dir, name);
      return statSync(full).isDirectory() ? walk(full) : [relative(root, full).split(sep).join('/')];
    });
  };
  return {
    list: () => walk(root).sort(),
    read: p => { const full = join(root, p); return existsSync(full) ? readFileSync(full) : undefined; },
  };
}

// ------------------------------------------------------------------ types

export interface PaletteInput {
  readonly status: 'provisional' | 'locked';
  readonly colors: Readonly<Record<string, string>>;
  readonly maxColors: number;
}

export interface GameDataRefs {
  readonly parts: readonly PartDefinition[];
  readonly chassis: readonly ChassisDefinition[];
  readonly roads: readonly RoadDefinition[];
}

export type ValidationMode = 'preparation' | 'strict' | 'release';

export interface ValidateInput {
  readonly registry: readonly AssetDefinition[];
  readonly fs: AssetFs;
  readonly palette: PaletteInput;
  readonly gameData?: GameDataRefs;
  readonly mode?: ValidationMode;
  /** Expected vs committed .gpl text; omitted = skip the check. */
  readonly gpl?: { readonly expected: string; readonly actual: string | undefined };
}

export interface AssetIssue {
  readonly severity: 'error' | 'warning';
  readonly code: string;
  readonly message: string;
  readonly assetId?: string;
  readonly file?: string;
}

export interface AssetSummary {
  readonly registered: number;
  readonly required: number;
  readonly optional: number;
  readonly present: number;
  readonly missing: number;
  readonly invalid: number;
  readonly unexpected: number;
  readonly goldenTotal: number;
  readonly goldenApproved: number;
  readonly byStatus: Readonly<Record<AssetStatus, number>>;
  readonly missingByPhase: Readonly<Record<string, number>>;
}

export interface AssetReport {
  readonly mode: ValidationMode;
  readonly summary: AssetSummary;
  readonly issues: readonly AssetIssue[];
  readonly errorCount: number;
  readonly warningCount: number;
  readonly ok: boolean;
}

// ------------------------------------------------------------------ palette & registry

const ID_PATTERN = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;
const SOURCE_EXTENSIONS = ['.aseprite', '.ase', '.psd', '.kra', '.xcf', '.pxo', '.blend', '.zip', '.tmx', '.afdesign'];

export function validatePalette(palette: PaletteInput): AssetIssue[] {
  const issues: AssetIssue[] = [];
  const err = (code: string, message: string): void => { issues.push({ severity: 'error', code, message }); };
  const seen = new Map<string, string>();
  const names = Object.keys(palette.colors);
  if (names.length === 0) err('palette-empty', 'palette has no colours');
  if (names.length > palette.maxColors) err('palette-too-large', 'palette has ' + names.length + ' colours; limit is ' + palette.maxColors);
  for (const name of names) {
    const hex = palette.colors[name]!;
    if (!/^[a-z]+(_[a-z]+)?_\d+$/.test(name)) err('palette-name', 'palette colour name "' + name + '" must look like ramp_index');
    if (!/^#[0-9A-F]{6}$/.test(hex)) { err('palette-hex', name + ' must be uppercase #RRGGBB, got "' + hex + '"'); continue; }
    if (hex === CHROMA_KEY_HEX) err('palette-chroma', name + ' uses the reserved chroma-key colour ' + CHROMA_KEY_HEX);
    const dup = seen.get(hex);
    if (dup !== undefined) err('palette-duplicate', name + ' duplicates ' + dup + ' (' + hex + ')');
    seen.set(hex, name);
  }
  return issues;
}

export function validateRegistry(registry: readonly AssetDefinition[], gameData: GameDataRefs | undefined): AssetIssue[] {
  const issues: AssetIssue[] = [];
  const err = (code: string, message: string, assetId?: string): void => {
    issues.push({ severity: 'error', code, message, ...(assetId !== undefined ? { assetId } : {}) });
  };
  const ids = new Set<string>();
  const files = new Map<string, string>();

  for (const a of registry) {
    if (!ID_PATTERN.test(a.id)) err('registry-id', 'id must be lower_snake_case', a.id);
    if (ids.has(a.id)) err('registry-duplicate-id', 'duplicate id', a.id);
    ids.add(a.id);
    if (!ASSET_CATEGORIES.includes(a.category)) err('registry-category', 'unknown category ' + a.category, a.id);
    else if (!a.id.startsWith(CATEGORY_PREFIX[a.category])) err('registry-prefix', 'id must start with "' + CATEGORY_PREFIX[a.category] + '" for category ' + a.category, a.id);
    if (!ASSET_PHASES.includes(a.phase)) err('registry-phase', 'unknown phase ' + a.phase, a.id);
    if (!ASSET_STATUSES.includes(a.status)) err('registry-status', 'unknown status ' + a.status, a.id);
    for (const f of runtimeFiles(a)) {
      const other = files.get(f);
      if (other !== undefined) err('registry-duplicate-file', f + ' is also used by ' + other, a.id);
      files.set(f, a.id);
    }
    const fs = frameSize(a);
    if (a.kind === 'spritesheet' && (!Number.isInteger(a.frames) || a.frames < 2)) err('registry-frames', 'spritesheet needs an integer frame count >= 2', a.id);
    for (const dim of [fs?.w, fs?.h]) {
      if (dim !== undefined && (!Number.isInteger(dim) || dim <= 0)) err('registry-size', 'dimensions must be positive integers', a.id);
    }
    if (fs !== null && a.margin * 2 >= Math.min(fs.w, fs.h)) err('registry-margin', 'margin too large for the frame', a.id);
    if (a.margin < 0 || !Number.isInteger(a.margin)) err('registry-margin', 'margin must be a non-negative integer', a.id);
    if (a.nineSlice !== undefined && fs !== null) {
      const n = a.nineSlice;
      if (n.left + n.right >= fs.w || n.top + n.bottom >= fs.h) err('registry-nineslice', 'nine-slice borders leave no centre', a.id);
    }
    if (a.kind === 'bitmap_font' && a.color !== 'grayscale') err('registry-font-color', 'bitmap fonts must be grayscale (tinted at runtime)', a.id);
    if (a.layer !== undefined && a.category !== 'environments') err('registry-layer', 'layer only applies to environments', a.id);
  }

  // Golden gate: nothing outside the proof set may progress until the proof set is approved.
  const golden = registry.filter(a => a.required && isGolden(a));
  const goldenApproved = golden.filter(a => a.status === 'approved').length;
  if (goldenApproved < golden.length) {
    for (const a of registry) {
      if (!isGolden(a) && a.status !== 'planned') {
        err('golden-gate', 'status is "' + a.status + '" but ' + (golden.length - goldenApproved) + ' of ' + golden.length + ' golden reference assets are not approved yet', a.id);
      }
    }
  }

  if (gameData !== undefined) issues.push(...validateCoverage(registry, gameData));
  return issues;
}

function validateCoverage(registry: readonly AssetDefinition[], data: GameDataRefs): AssetIssue[] {
  const issues: AssetIssue[] = [];
  const err = (code: string, message: string, assetId?: string): void => {
    issues.push({ severity: 'error', code, message, ...(assetId !== undefined ? { assetId } : {}) });
  };
  const partIds = new Set(data.parts.map(p => p.id));
  const chassisIds = new Set(data.chassis.map(c => c.id));
  const roads = new Map(data.roads.map(r => [r.id, r]));

  for (const a of registry) for (const b of a.binds) {
    if (b.type === 'part' && !partIds.has(b.id)) err('binding-part', 'binds unknown part "' + b.id + '"', a.id);
    if (b.type === 'chassis' && !chassisIds.has(b.id)) err('binding-chassis', 'binds unknown chassis "' + b.id + '"', a.id);
    if (b.type === 'roadSegment') {
      const road = roads.get(b.roadId);
      if (road === undefined) err('binding-road', 'binds unknown road "' + b.roadId + '"', a.id);
      else if (!Number.isInteger(b.segment) || b.segment < 0 || b.segment >= road.segments.length) err('binding-segment', 'binds missing segment ' + b.segment + ' of ' + b.roadId, a.id);
    }
  }

  const boundTo = (pred: (a: AssetDefinition) => boolean): AssetDefinition[] => registry.filter(pred);
  const hasBind = (a: AssetDefinition, type: 'part' | 'chassis', id: string): boolean => a.binds.some(b => b.type === type && b.id === id);

  for (const p of data.parts) {
    if (boundTo(a => a.category === 'parts' && hasBind(a, 'part', p.id)).length === 0) err('coverage-part-icon', 'part "' + p.id + '" has no icon asset');
    if (p.family === 'tires') {
      if (boundTo(a => a.category === 'vehicles' && hasBind(a, 'part', p.id)).length === 0) err('coverage-wheel', 'tire part "' + p.id + '" has no wheel sheet');
    } else {
      for (const c of data.chassis.filter(ch => ch.slots.includes(p.family))) {
        if (boundTo(a => a.category === 'vehicles' && hasBind(a, 'part', p.id) && hasBind(a, 'chassis', c.id)).length === 0) {
          err('coverage-overlay', 'part "' + p.id + '" has no installed-part overlay for chassis "' + c.id + '"');
        }
      }
    }
  }
  for (const c of data.chassis) {
    const body = 'veh_' + c.id.replace(/^chassis_/, '') + '_body';
    if (!registry.some(a => a.id === body && hasBind(a, 'chassis', c.id))) err('coverage-chassis', 'chassis "' + c.id + '" has no body asset "' + body + '"');
  }
  for (const road of data.roads) road.segments.forEach((s, index) => {
    for (const layer of ['sky', 'far', 'ground'] as const) {
      const found = registry.some(a => a.layer === layer && a.binds.some(b => b.type === 'roadSegment' && b.roadId === road.id && b.segment === index));
      if (!found) err('coverage-segment', 'road "' + road.id + '" segment ' + index + ' (' + s.name + ') has no ' + layer + ' asset');
    }
  });
  return issues;
}

// ------------------------------------------------------------------ pixel checks

interface AlphaStats { transparent: number; opaque: number; semi: number }

function alphaStats(png: DecodedPng): AlphaStats {
  const s: AlphaStats = { transparent: 0, opaque: 0, semi: 0 };
  for (let i = 3; i < png.rgba.length; i += 4) {
    const a = png.rgba[i]!;
    if (a === 0) s.transparent++; else if (a === 255) s.opaque++; else s.semi++;
  }
  return s;
}

/** Visible pixels in rectangle [x0,x1) x [y0,y1). */
function visibleIn(png: DecodedPng, x0: number, y0: number, x1: number, y1: number): number {
  let n = 0;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (png.rgba[(y * png.width + x) * 4 + 3]! > 0) n++;
  return n;
}

const hex6 = (r: number, g: number, b: number): string =>
  '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

interface FileFinding { readonly code: string; readonly message: string; readonly paletteRelated?: boolean }

function inspectPng(asset: AssetDefinition, bytes: Uint8Array, paletteRgb: ReadonlySet<number>): FileFinding[] {
  const out: FileFinding[] = [];
  let png: DecodedPng;
  try { png = decodePng(bytes); } catch (e) {
    return [{ code: 'png-invalid', message: e instanceof PngError ? e.message : 'unreadable PNG' }];
  }
  for (const c of png.chunkTypes) {
    if (FORBIDDEN_COLOR_CHUNKS.includes(c)) out.push({ code: 'png-color-chunk', message: 'contains colour-management chunk ' + c + ' (strip metadata; browsers would shift palette colours)' });
  }
  const expected = expectedFileSize(asset);
  if (expected !== null && (png.width !== expected.w || png.height !== expected.h)) {
    out.push({ code: 'wrong-size', message: 'is ' + png.width + 'x' + png.height + ', registry requires ' + expected.w + 'x' + expected.h });
    return out; // frame maths below would be meaningless
  }

  const stats = alphaStats(png);
  switch (asset.alpha) {
    case 'cutout':
      if (stats.semi > 0) out.push({ code: 'alpha-soft', message: stats.semi + ' semi-transparent pixels (cutout/binary art must use alpha 0 or 255 only — anti-aliased edges are forbidden)' });
      if (stats.transparent === 0) out.push({ code: 'no-transparency', message: 'has no transparent pixels; cutout assets need a transparent background (baked background?)' });
      break;
    case 'binary':
      if (stats.semi > 0) out.push({ code: 'alpha-soft', message: stats.semi + ' semi-transparent pixels (alpha must be 0 or 255)' });
      break;
    case 'opaque':
      if (stats.transparent + stats.semi > 0) out.push({ code: 'not-opaque', message: (stats.transparent + stats.semi) + ' transparent/semi-transparent pixels in an opaque asset' });
      break;
    case 'soft': break;
  }

  const fs = frameSize(asset);
  if (fs !== null) {
    const frames = asset.kind === 'spritesheet' ? asset.frames : 1;
    for (let f = 0; f < frames; f++) {
      const x0 = f * fs.w;
      if (asset.alpha !== 'opaque' && visibleIn(png, x0, 0, x0 + fs.w, fs.h) === 0) {
        out.push({ code: 'blank-frame', message: 'frame ' + f + ' is empty' });
      }
      const m = asset.margin;
      if (m > 0) {
        const bad = visibleIn(png, x0, 0, x0 + fs.w, m) + visibleIn(png, x0, fs.h - m, x0 + fs.w, fs.h)
          + visibleIn(png, x0, m, x0 + m, fs.h - m) + visibleIn(png, x0 + fs.w - m, m, x0 + fs.w, fs.h - m);
        if (bad > 0) out.push({ code: 'margin-violation', message: 'frame ' + f + ' has ' + bad + ' visible pixels inside the required ' + m + 'px transparent margin' });
      }
    }
  }

  const offenders = new Map<string, number>();
  let offenderCount = 0;
  for (let i = 0; i < png.rgba.length; i += 4) {
    if (png.rgba[i + 3] === 0) continue;
    const r = png.rgba[i]!, g = png.rgba[i + 1]!, b = png.rgba[i + 2]!;
    const bad = asset.color === 'grayscale' ? !(r === g && g === b) : !paletteRgb.has((r << 16) | (g << 8) | b);
    if (bad) { offenderCount++; const h = hex6(r, g, b); offenders.set(h, (offenders.get(h) ?? 0) + 1); }
  }
  if (offenderCount > 0) {
    const sample = [...offenders.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([h, n]) => h + '×' + n).join(', ');
    out.push(asset.color === 'grayscale'
      ? { code: 'not-grayscale', message: offenderCount + ' coloured pixels in a tintable grayscale asset (' + sample + ')' }
      : { code: 'off-palette', message: offenderCount + ' pixels (' + offenders.size + ' colours) outside the master palette, e.g. ' + sample, paletteRelated: true });
  }
  return out;
}

function attribute(tag: string, name: string): string | undefined {
  return new RegExp('\\b' + name + '="([^"]*)"').exec(tag)?.[1];
}

function inspectFontXml(asset: AssetDefinition, xml: string, png: DecodedPng | null): FileFinding[] {
  const out: FileFinding[] = [];
  const page = /<page\b[^>]*>/.exec(xml)?.[0];
  const common = /<common\b[^>]*>/.exec(xml)?.[0];
  if (page === undefined || common === undefined) return [{ code: 'font-xml', message: 'not a BMFont XML file (needs <common> and <page>)' }];
  if (attribute(page, 'file') !== asset.id + '.png') out.push({ code: 'font-page', message: '<page file> is "' + String(attribute(page, 'file')) + '", must be "' + asset.id + '.png"' });
  if (png !== null && (Number(attribute(common, 'scaleW')) !== png.width || Number(attribute(common, 'scaleH')) !== png.height)) {
    out.push({ code: 'font-scale', message: 'scaleW/scaleH do not match the PNG size ' + png.width + 'x' + png.height });
  }
  if (!/<char\b/.test(xml)) out.push({ code: 'font-chars', message: 'defines no glyphs' });
  return out;
}

// ------------------------------------------------------------------ orchestration

export function validateAssets(input: ValidateInput): AssetReport {
  const mode = input.mode ?? 'preparation';
  const strict = mode !== 'preparation';
  const issues: AssetIssue[] = [];
  const push = (i: AssetIssue): void => { issues.push(i); };

  issues.push(...validatePalette(input.palette));
  issues.push(...validateRegistry(input.registry, input.gameData));
  if (input.gpl !== undefined) {
    if (input.gpl.actual === undefined) push({ severity: 'error', code: 'palette-gpl-missing', message: 'art/palette/scrap-master.gpl is missing; run `npm run assets:palette`' });
    else if (input.gpl.actual.replace(/\r\n/g, '\n') !== input.gpl.expected) push({ severity: 'error', code: 'palette-gpl-stale', message: 'art/palette/scrap-master.gpl is out of date; run `npm run assets:palette`' });
  }

  const paletteRgb = new Set<number>();
  for (const hex of Object.values(input.palette.colors)) {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) { const [r, g, b] = hexToRgb(hex); paletteRgb.add((r << 16) | (g << 8) | b); }
  }
  const paletteLocked = input.palette.status === 'locked';
  const technicalRank = ASSET_STATUSES.indexOf('technical');

  const expectedFiles = new Set<string>();
  const byStatus = Object.fromEntries(ASSET_STATUSES.map(s => [s, 0])) as Record<AssetStatus, number>;
  const missingByPhase: Record<string, number> = {};
  let required = 0, present = 0, missing = 0, invalid = 0;

  for (const asset of input.registry) {
    byStatus[asset.status]++;
    const files = runtimeFiles(asset);
    files.forEach(f => expectedFiles.add(f));
    const rank = ASSET_STATUSES.indexOf(asset.status);
    const enforced = strict || rank >= technicalRank;
    const have = files.filter(f => input.fs.read(f) !== undefined);
    const complete = have.length === files.length;
    let assetErrors = 0;
    const report = (i: AssetIssue): void => { push(i); if (i.severity === 'error') assetErrors++; };
    const tag = { assetId: asset.id };

    if (asset.required) {
      required++;
      if (complete) present++; else { missing++; missingByPhase[asset.phase] = (missingByPhase[asset.phase] ?? 0) + 1; }
    }

    if (have.length > 0 && asset.status === 'planned') {
      report({ severity: 'error', code: 'status-mismatch', ...tag, message: 'runtime file exists but status is "planned"; set status to "draft" (or beyond) in the registry' });
    }
    if (!complete) {
      const absent = files.filter(f => !have.includes(f));
      if (rank >= technicalRank) report({ severity: 'error', code: 'missing-file', ...tag, message: 'status is "' + asset.status + '" but file(s) missing: ' + absent.join(', ') });
      else if (strict && asset.required) report({ severity: 'error', code: 'missing-required', ...tag, message: 'required asset missing: ' + absent.join(', ') });
      else if (have.length > 0) report({ severity: enforced ? 'error' : 'warning', code: 'incomplete-files', ...tag, message: 'only some files present; missing: ' + absent.join(', ') });
    }

    for (const file of have) {
      const bytes = input.fs.read(file)!;
      if (file.endsWith('.png')) {
        for (const f of inspectPng(asset, bytes, paletteRgb)) {
          const hard = enforced && (f.paletteRelated !== true || paletteLocked);
          report({ severity: hard ? 'error' : 'warning', code: f.code, ...tag, file, message: f.message });
        }
      } else if (file.endsWith('.xml') && asset.kind === 'bitmap_font') {
        let png: DecodedPng | null = null;
        try { const pb = input.fs.read(files[0]!); png = pb === undefined ? null : decodePng(pb); } catch { png = null; }
        for (const f of inspectFontXml(asset, Buffer.from(bytes).toString('utf8'), png)) {
          report({ severity: enforced ? 'error' : 'warning', code: f.code, ...tag, file, message: f.message });
        }
      }
    }
    if (assetErrors > 0) invalid++;

    if (mode === 'release' && asset.required && asset.status !== 'approved') {
      push({ severity: 'error', code: 'not-approved', ...tag, message: 'release requires status "approved", found "' + asset.status + '"' });
    }
  }

  if (input.registry.some(a => a.status === 'approved') && !paletteLocked) {
    push({ severity: 'error', code: 'palette-not-locked', message: 'assets are approved but the palette is still "provisional"; lock it in src/game/assets/palette.ts at golden-set approval' });
  }
  if (mode === 'release' && !paletteLocked) push({ severity: 'error', code: 'palette-not-locked', message: 'release requires a locked palette' });

  let unexpected = 0;
  for (const file of input.fs.list()) {
    if (expectedFiles.has(file) || file.endsWith('.gitkeep')) continue;
    unexpected++;
    const isSource = SOURCE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext));
    push({ severity: 'error', code: isSource ? 'source-in-runtime' : 'unexpected-file', file,
      message: isSource ? 'editable source file in the runtime tree; keep it under art/source/' : 'file is not in the asset registry (rename it to the registered id or register it)' });
  }

  const golden = input.registry.filter(a => a.required && isGolden(a));
  const errorCount = issues.filter(i => i.severity === 'error').length;
  return {
    mode, issues, errorCount, warningCount: issues.length - errorCount, ok: errorCount === 0,
    summary: {
      registered: input.registry.length, required, optional: input.registry.length - required, present, missing, invalid, unexpected,
      goldenTotal: golden.length, goldenApproved: golden.filter(a => a.status === 'approved').length, byStatus, missingByPhase,
    },
  };
}
