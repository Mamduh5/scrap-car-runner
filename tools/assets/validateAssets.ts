/**
 * Visual technical gate over the canonical registry; file access is injected.
 * Preparation permits missing planned/draft assets, not malformed present files.
 * Golden/production enforce required selected entries; strict enforces all required entries.
 * Release additionally requires final approval and a locked palette. No stage mutates status.
 * Review/approval policy: docs/04 and docs/11. Audio is delegated to VAL-02.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { ChassisDefinition, PartDefinition, RoadDefinition } from '../../src/types/game';
import {
  ASSET_REGISTRY, ASSET_CATEGORIES, ASSET_PHASES, ASSET_STATUSES, CATEGORY_PREFIX, expectedFileSize, frameSize, isGolden, runtimeFiles,
} from '../../src/game/assets/assetRegistry';
import type { AssetDefinition, AssetStatus, AssetPhase } from '../../src/game/assets/assetRegistry';
import { CHROMA_KEY_HEX, hexToRgb, PALETTE, PALETTE_STATUS, MAX_PALETTE_COLORS, renderGpl } from '../../src/game/assets/palette';
import { outskirtsSkyRow } from '../../src/game/assets/skyRamp';
import { PARTS } from '../../src/data/parts';
import { CHASSIS_LIST } from '../../src/data/chassis';
import { ROADS } from '../../src/data/roads';
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
      if (!statSync(full).isDirectory()) return [relative(root, full).split(sep).join('/')];
      return dir === root && name === 'audio' ? [] : walk(full);
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

export type ValidationMode = 'preparation' | 'golden' | 'production' | 'strict' | 'release';
const VALIDATION_MODES: readonly ValidationMode[] = ['preparation', 'golden', 'production', 'strict', 'release'];

export interface ValidateInput {
  readonly registry: readonly AssetDefinition[];
  readonly fs: AssetFs;
  readonly palette: PaletteInput;
  readonly gameData?: GameDataRefs;
  readonly mode?: ValidationMode;
  /** Required only for production; presence is enforced for required entries in this phase. */
  readonly phase?: AssetPhase;
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
  readonly selectedRequired: number;
  readonly technicalPassed: number;
  readonly goldenTotal: number;
  readonly goldenApproved: number;
  readonly byStatus: Readonly<Record<AssetStatus, number>>;
  readonly missingByPhase: Readonly<Record<string, number>>;
}

export interface AssetResult {
  readonly assetId: string;
  readonly status: AssetStatus;
  readonly files: readonly string[];
  readonly selected: boolean;
  readonly presenceRequired: boolean;
  readonly result: 'missing' | 'invalid' | 'attention' | 'passed';
}

export interface AssetReport {
  readonly mode: ValidationMode;
  readonly phase?: AssetPhase;
  readonly assets: readonly AssetResult[];
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
    if (a.color === 'sky-ramp' && !(a.id === 'env_sky_outskirts' && a.category === 'environments' && a.kind === 'image' && a.size.w === 16 && a.size.h === 300 && a.alpha === 'opaque' && a.tileX === true && a.layer === 'sky')) err('registry-sky-ramp', 'sky-ramp is restricted to the registered opaque 16x300 Outskirts sky', a.id);
    if (a.kind === 'bitmap_font' && a.color !== 'grayscale') err('registry-font-color', 'bitmap fonts must be grayscale (tinted at runtime)', a.id);
    if (a.layer !== undefined && a.category !== 'environments') err('registry-layer', 'layer only applies to environments', a.id);
  }

  // Golden gate: nothing outside the proof set may progress until the proof set is approved.
  const golden = registry.filter(a => a.required && isGolden(a));
  const goldenApproved = golden.filter(a => a.status === 'approved').length;
  if (goldenApproved < golden.length) {
    for (const a of registry) {
      // Owner authorized technical review and then visual acceptance for this optional cloud only.
      const cloudReview = a.id === 'env_clouds_strip' && a.phase === 'polish' && !a.required
        && a.kind === 'image' && a.size.w === 384 && a.size.h === 96 && a.alpha === 'cutout' && a.tileX === true
        && (a.status === 'technical' || a.status === 'visual');
      if (!isGolden(a) && a.status !== 'planned' && !cloudReview) {
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
    const row = asset.color === 'sky-ramp' ? outskirtsSkyRow(Math.floor(i / 4 / png.width)) : null;
    const bad = row !== null ? r !== row[0] || g !== row[1] || b !== row[2]
      : asset.color === 'grayscale' ? !(r === g && g === b) : !paletteRgb.has((r << 16) | (g << 8) | b);
    if (bad) { offenderCount++; const h = hex6(r, g, b); offenders.set(h, (offenders.get(h) ?? 0) + 1); }
  }
  if (offenderCount > 0) {
    const sample = [...offenders.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([h, n]) => h + '×' + n).join(', ');
    out.push(asset.color === 'sky-ramp'
      ? { code: 'sky-ramp-mismatch', message: offenderCount + ' pixels differ from the authorized reference row ramp' }
      : asset.color === 'grayscale'
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
  const issues: AssetIssue[] = [];
  const assets: AssetResult[] = [];
  if (!VALIDATION_MODES.includes(mode)) issues.push({ severity: 'error', code: 'validation-mode', message: 'unknown validation mode: ' + String(mode) });
  if (mode === 'production' ? input.phase === undefined || !ASSET_PHASES.includes(input.phase) : input.phase !== undefined) {
    issues.push({ severity: 'error', code: 'validation-phase', message: 'production requires one registered phase; other stages do not accept a phase' });
  }
  const selected = (asset: AssetDefinition): boolean => mode === 'golden' ? isGolden(asset)
    : mode === 'production' ? asset.phase === input.phase : true;
  issues.push(...validatePalette(input.palette), ...validateRegistry(input.registry, input.gameData));
  if (input.gpl !== undefined) {
    if (input.gpl.actual === undefined) issues.push({ severity: mode === 'preparation' ? 'warning' : 'error', code: 'palette-gpl-missing', message: 'art/palette/scrap-master.gpl is missing; export canonical text with palette.ts renderGpl()' });
    else if (input.gpl.actual.replace(/\r\n/g, '\n') !== input.gpl.expected) issues.push({ severity: 'error', code: 'palette-gpl-stale', message: 'art/palette/scrap-master.gpl differs from palette.ts renderGpl(); regenerate the canonical export' });
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
    if (ASSET_STATUSES.includes(asset.status)) byStatus[asset.status]++;
    const files = runtimeFiles(asset);
    files.forEach(f => expectedFiles.add(f));
    const rank = ASSET_STATUSES.indexOf(asset.status);
    const presenceRequired = asset.required && mode !== 'preparation' && selected(asset);
    // Read each export once so summary and content checks describe the same captured input.
    const contents = files.map(file => ({ file, bytes: input.fs.read(file) }));
    const have = contents.filter((entry): entry is { file: string; bytes: Uint8Array } => entry.bytes !== undefined);
    const complete = have.length === files.length;
    const tag = { assetId: asset.id };
    const report = (finding: AssetIssue): void => { issues.push({ ...tag, ...finding }); };

    if (asset.required) {
      required++;
      if (complete) present++;
      else { missing++; missingByPhase[asset.phase] = (missingByPhase[asset.phase] ?? 0) + 1; }
    }
    if (have.length > 0 && asset.status === 'planned') {
      report({ severity: 'error', code: 'status-mismatch', message: 'runtime file exists but status is "planned"; record this asset as "draft" (or the evidenced later status) in the registry' });
    }
    if (!complete) {
      const absent = contents.filter(entry => entry.bytes === undefined).map(entry => entry.file);
      if (rank >= technicalRank) report({ severity: 'error', code: 'missing-file', message: 'status is "' + asset.status + '" but file(s) missing: ' + absent.join(', ') });
      else if (presenceRequired) report({ severity: 'error', code: 'missing-required', message: 'required for ' + mode + (input.phase === undefined ? '' : '/' + input.phase) + ': ' + absent.join(', ') });
      else if (have.length > 0) report({ severity: 'error', code: 'incomplete-files', message: 'partial asset export; missing: ' + absent.join(', ') });
      else if (asset.required) report({ severity: 'warning', code: 'missing-future', message: 'not produced (presence not enforced by this stage): ' + absent.join(', ') });
    }
    for (const { file, bytes } of have) {
      if (file.endsWith('.png')) {
        for (const finding of inspectPng(asset, bytes, paletteRgb)) {
          // Palette review may warn during preparation while provisional, but never supply
          // technical success for an off-palette production export. Lock timing is unchanged.
          const provisionalReview = finding.paletteRelated === true && !paletteLocked && mode === 'preparation' && rank < technicalRank;
          report({ severity: provisionalReview ? 'warning' : 'error', code: finding.code, file, message: finding.message });
        }
      } else if (file.endsWith('.xml') && asset.kind === 'bitmap_font') {
        let png: DecodedPng | null = null;
        try { const pb = contents[0]?.bytes; png = pb === undefined ? null : decodePng(pb); } catch { png = null; }
        for (const finding of inspectFontXml(asset, Buffer.from(bytes).toString('utf8'), png)) {
          report({ severity: 'error', code: finding.code, file, message: finding.message });
        }
      }
    }
    if (mode === 'release' && asset.required && asset.status !== 'approved') {
      report({ severity: 'error', code: 'not-approved', message: 'release requires status "approved", found "' + asset.status + '"' });
    }
    const ownIssues = issues.filter(issue => issue.assetId === asset.id);
    if (ownIssues.some(issue => issue.severity === 'error')) invalid++;
    const result: AssetResult['result'] = !complete ? 'missing' : ownIssues.some(issue => issue.severity === 'error') ? 'invalid'
      : ownIssues.length > 0 ? 'attention' : 'passed';
    assets.push({ assetId: asset.id, status: asset.status, files, selected: selected(asset), presenceRequired, result });
  }
  if (input.registry.some(a => a.status === 'approved') && !paletteLocked) {
    issues.push({ severity: 'error', code: 'palette-not-locked', message: 'approved assets require a locked palette; lock only at Golden-set approval' });
  } else if (mode === 'release' && !paletteLocked) {
    issues.push({ severity: 'error', code: 'palette-not-locked', message: 'release requires a locked palette' });
  }

  let unexpected = 0;
  const seenFiles = new Set<string>();
  for (const file of input.fs.list()) {
    // Only this named tree is delegated. Unknown directories/root files remain errors.
    if (file.startsWith('audio/')) continue;
    if (seenFiles.has(file)) {
      issues.push({ severity: 'error', code: 'duplicate-file', file, message: 'runtime file is listed more than once' });
      continue;
    }
    seenFiles.add(file);
    if (expectedFiles.has(file) || file.split('/').at(-1) === '.gitkeep') continue;
    unexpected++;
    const isSource = SOURCE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext));
    issues.push({ severity: 'error', code: isSource ? 'source-in-runtime' : 'unexpected-file', file,
      message: isSource ? 'editable source in runtime tree; keep it under art/source/' : 'not registered as a visual export; use the registered category/id path (audio/ is separately owned)' });
  }
  const golden = input.registry.filter(isGolden);
  const errorCount = issues.filter(i => i.severity === 'error').length;
  return {
    mode, ...(input.phase === undefined ? {} : { phase: input.phase }), assets, issues,
    errorCount, warningCount: issues.length - errorCount, ok: errorCount === 0,
    summary: {
      registered: input.registry.length, required, optional: input.registry.length - required, present, missing, invalid, unexpected,
      selectedRequired: assets.filter(a => a.presenceRequired).length,
      technicalPassed: assets.filter(a => a.result === 'passed').length,
      goldenTotal: golden.length, goldenApproved: golden.filter(a => a.status === 'approved').length, byStatus, missingByPhase,
    },
  };
}

// ------------------------------------------------------------------ CLI (read-only adapter)

export const VISUAL_USAGE = 'Usage: npm run validate:assets -- [--stage preparation|golden|production|full|release] [--phase <registered phase>] [--root <project root>]\n'
  + 'Aliases: --allow-missing (preparation), --golden, --strict (full), --release. Default: preparation.\n'
  + 'Production requires --phase; other stages reject it. Technical validation never grants visual/in-game approval.';

export interface VisualCliOptions { readonly mode: ValidationMode; readonly root: string; readonly phase?: AssetPhase; readonly help: boolean }
export function parseVisualArgs(args: readonly string[], cwd: string): VisualCliOptions {
  let mode: ValidationMode = 'preparation', chosen = false, phase: AssetPhase | undefined, root = cwd, rootChosen = false, help = false;
  const stages: Readonly<Record<string, ValidationMode>> = { preparation: 'preparation', golden: 'golden', production: 'production', full: 'strict', release: 'release' };
  const aliases: Readonly<Record<string, ValidationMode>> = { '--allow-missing': 'preparation', '--golden': 'golden', '--strict': 'strict', '--release': 'release' };
  const choose = (value: ValidationMode): ValidationMode => {
    if (chosen) throw new Error('choose exactly one validation stage');
    chosen = true; return value;
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === '--help') { help = true; continue; }
    if (arg === '--stage' || arg === '--phase' || arg === '--root') {
      const value = args[++i];
      if (value === undefined || value.startsWith('--')) throw new Error('missing value for ' + arg);
      if (arg === '--stage') {
        const stage = stages[value];
        if (stage === undefined) throw new Error('unknown stage: ' + value);
        mode = choose(stage);
      } else if (arg === '--phase') {
        if (phase !== undefined || !ASSET_PHASES.includes(value as AssetPhase)) throw new Error('invalid or repeated phase: ' + value);
        phase = value as AssetPhase;
      } else {
        if (rootChosen) throw new Error('repeated --root');
        root = resolve(cwd, value); rootChosen = true;
      }
    } else if (aliases[arg] !== undefined) mode = choose(aliases[arg]!);
    else throw new Error('unknown option: ' + arg);
  }
  if (!help && (mode === 'production' ? phase === undefined : phase !== undefined)) throw new Error('--phase is required for production and forbidden for other stages');
  return { mode, root, help, ...(phase === undefined ? {} : { phase }) };
}

export function formatAssetReport(report: AssetReport, root: string): string {
  const stage = report.mode === 'strict' ? 'full' : report.mode;
  const s = report.summary;
  const lines = [
    'Visual Asset Validation — TECHNICAL CHECKS ONLY',
    'Stage: ' + stage + (report.phase === undefined ? '' : ' / ' + report.phase),
    'Root: ' + join(root, 'public', 'assets'),
    'Scope: ' + (report.mode === 'preparation' ? 'registry/data/palette integrity and all present visual files; future presence allowed'
      : report.mode === 'golden' ? 'required Golden entries derived from isGolden(); all present visual files'
      : report.mode === 'production' ? 'required entries in selected registry phase; all present visual files'
      : 'all required visual entries; all present visual files' + (report.mode === 'release' ? '; final statuses and locked palette' : '')),
    'Missing files: ' + (report.mode === 'preparation' ? 'planned/draft future assets allowed; reported below'
      : 'selected required assets fail; unselected planned/draft future assets may be absent'),
    'Registry: ' + s.registered + ' entries; ' + s.required + ' required; ' + s.optional + ' optional; ' + s.goldenTotal + ' Golden',
    'Required present: ' + s.present + '; missing: ' + s.missing + '; presence enforced: ' + s.selectedRequired,
    'Technical passes: ' + s.technicalPassed + '; errors: ' + report.errorCount + '; warnings: ' + report.warningCount,
    'Tree ownership: visual categories and unknown runtime paths checked; audio/ delegated to audio validation.',
  ];
  for (const asset of report.assets) {
    if (asset.selected) lines.push('ASSET ' + asset.assetId + ': ' + asset.result + '; recorded status=' + asset.status + '; ' + asset.files.join(', '));
  }
  for (const issue of report.issues) lines.push(issue.severity.toUpperCase() + ' [' + issue.code + '] '
    + (issue.assetId === undefined ? '' : issue.assetId + ': ') + (issue.file === undefined ? '' : issue.file + ': ') + issue.message);
  lines.push(report.ok ? 'PASS — ' + (report.mode === 'preparation' ? 'PREPARATION ONLY; production presence/approval not established'
    : report.mode === 'release' ? 'release contract checks passed; recorded approvals verified, none granted'
    : 'selected technical gate passed; no visual/in-game/final approval granted') : 'FAILED — ' + stage + ' gate');
  return lines.join('\n');
}

export function runVisualCli(args: readonly string[], write: (message: string) => void = console.log, cwd = process.cwd()): number {
  try {
    const options = parseVisualArgs(args, cwd);
    if (options.help) { write(VISUAL_USAGE); return 0; }
    const gplPath = join(options.root, 'art', 'palette', 'scrap-master.gpl');
    const report = validateAssets({
      registry: ASSET_REGISTRY, fs: nodeFs(join(options.root, 'public', 'assets')),
      palette: { colors: PALETTE, status: PALETTE_STATUS, maxColors: MAX_PALETTE_COLORS },
      gameData: { parts: PARTS, chassis: CHASSIS_LIST, roads: ROADS }, mode: options.mode,
      ...(options.phase === undefined ? {} : { phase: options.phase }),
      ...(existsSync(gplPath) || options.mode === 'release' ? { gpl: { expected: renderGpl(), actual: existsSync(gplPath) ? readFileSync(gplPath, 'utf8') : undefined } } : {}),
    });
    write(formatAssetReport(report, options.root));
    return report.ok ? 0 : 1;
  } catch (error: unknown) {
    write('FAILED — visual validation: ' + (error instanceof Error ? error.message : String(error)) + '\n' + VISUAL_USAGE);
    return 1;
  }
}

// Importing the core stays side-effect free; invoking the documented module executes the gate.
if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = runVisualCli(process.argv.slice(2));
}
