import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { crc32, deflateSync } from 'node:zlib';
import { ASSET_REGISTRY, isGolden, runtimeFiles } from '../../src/game/assets/assetRegistry';
import type { AssetDefinition, BitmapFontAsset, ImageAsset, SpritesheetAsset } from '../../src/game/assets/assetRegistry';
import { MAX_PALETTE_COLORS, PALETTE, PALETTE_STATUS, renderGpl } from '../../src/game/assets/palette';
import { PARTS } from '../../src/data/parts';
import { CHASSIS_LIST } from '../../src/data/chassis';
import { ROADS } from '../../src/data/roads';
import { encodePng } from './png';
import { formatAssetReport, memoryFs, nodeFs, parseVisualArgs, runVisualCli, validateAssets } from './validateAssets';
import type { AssetFs, PaletteInput, ValidateInput } from './validateAssets';

const palette: PaletteInput = { colors: PALETTE, status: PALETTE_STATUS, maxColors: MAX_PALETTE_COLORS };
const image: ImageAsset = { id: 'icon_probe', category: 'icons', scope: 'vs1', phase: 'proof_b', status: 'draft', required: true,
  kind: 'image', size: { w: 4, h: 4 }, alpha: 'binary', color: 'palette', margin: 1, binds: [] };
const file = runtimeFiles(image)[0]!;
const rgb = [214, 219, 227] as const; // PALETTE.steel_4, the controlled fixture ink.
function pixels(w: number, h: number, color: readonly number[] = rgb, alpha = 255, frames = 1): Uint8Array {
  const out = new Uint8Array(w * h * 4);
  const fw = w / frames;
  for (let y = 1; y < h - 1; y++) for (let x = 0; x < w; x++) if (x % fw > 0 && x % fw < fw - 1) {
    out.set([color[0]!, color[1]!, color[2]!, alpha], (y * w + x) * 4);
  }
  return out;
}
const png = (w = 4, h = 4): Buffer => encodePng(w, h, pixels(w, h));
function check(files: Readonly<Record<string, Uint8Array | string>> = {}, options: Partial<Omit<ValidateInput, 'fs'>> = {}) {
  return validateAssets({ registry: [image], palette, mode: 'strict', ...options, fs: memoryFs(files) });
}
const codes = (report: ReturnType<typeof check>): string[] => report.issues.map(issue => issue.code);
const canonical = (mode: ValidateInput['mode'], extra: Partial<ValidateInput> = {}) => validateAssets({
  registry: ASSET_REGISTRY, palette, fs: memoryFs({}), gameData: { parts: PARTS, chassis: CHASSIS_LIST, roads: ROADS }, mode: mode!, ...extra,
});
const directories: string[] = [];
function temporaryRoot(): string { const root = mkdtempSync(join(tmpdir(), 'scrap-visual-gate-')); directories.push(root); return root; }
afterEach(() => { for (const root of directories.splice(0)) rmSync(root, { recursive: true, force: true }); });

describe('visual stage enforcement', () => {
  it('executes registry/data/palette checks in preparation and reports missing required exports', () => {
    const report = canonical('preparation');
    expect(report.ok).toBe(false); // Fails because 8 technical assets are missing in empty fs
    expect(report.summary).toMatchObject({ registered: 89, required: 86, optional: 3, missing: 86, selectedRequired: 0, technicalPassed: 0 });
    expect(report.errorCount).toBe(8); // 8 technical assets missing
    expect(report.warningCount).toBe(78); // 78 planned assets missing
    expect(report.assets.filter(asset => asset.result === 'missing')).toHaveLength(89);
    expect(formatAssetReport(report, '.')).toContain('FAILED');
  });
  it('derives the Golden gate from registry metadata without requiring later batches', () => {
    const report = canonical('golden');
    const expected = ASSET_REGISTRY.filter(asset => asset.required && isGolden(asset)).map(asset => asset.id).sort();
    expect(expected).toHaveLength(22);
    expect(report.assets.filter(asset => asset.presenceRequired).map(asset => asset.assetId).sort()).toEqual(expected);
    expect(report.issues.filter(issue => issue.code === 'missing-required')).toHaveLength(14); // 8 are missing-file because they are technical
    expect(report.issues.filter(issue => issue.code === 'missing-file')).toHaveLength(8);
    expect(report.errorCount).toBe(22);
    expect(report.warningCount).toBe(64);
  });
  it('enforces a chosen phase while retaining full registry integrity', () => {
    const report = canonical('production', { phase: 'proof_a' });
    expect(report.summary.selectedRequired).toBe(8);
    expect(report.errorCount).toBe(8);
    expect(report.assets.filter(asset => asset.presenceRequired).every(asset => asset.assetId.startsWith('veh_') || asset.assetId.startsWith('part_engine_'))).toBe(true);
    const duplicate = { ...image, status: 'draft' } as ImageAsset;
    expect(codes(check({}, { mode: 'golden', registry: [image, duplicate] }))).toContain('registry-duplicate-id');
  });
  it('full requires canonical required entries; release additionally requires approval and palette lock', () => {
    expect(canonical('strict').errorCount).toBe(86);
    const report = canonical('release');
    expect(report.issues.filter(issue => issue.code === 'missing-required')).toHaveLength(78);
    expect(report.issues.filter(issue => issue.code === 'missing-file')).toHaveLength(8);
    expect(report.issues.filter(issue => issue.code === 'not-approved')).toHaveLength(86);
    expect(codes(report)).toContain('palette-not-locked');
  });
  it('accepts a valid small fixture without mutating its recorded status', () => {
    const registered = Object.freeze({ ...image });
    const report = check({ [file]: png() }, { registry: [registered] });
    expect(report.ok).toBe(true);
    expect(report.assets[0]).toMatchObject({ result: 'passed', status: 'draft' });
    expect(registered.status).toBe('draft');
    const approved = { ...image, status: 'approved' } as ImageAsset;
    expect(check({ [file]: png() }, { registry: [approved], mode: 'release', palette: { ...palette, status: 'locked' } }).ok).toBe(true);
  });
  it('does not require absent optional entries but validates any that exist', () => {
    const optional = { ...image, required: false };
    expect(check({}, { registry: [optional] }).ok).toBe(true);
    expect(check({ [file]: new Uint8Array([1, 2, 3]) }, { registry: [optional] }).ok).toBe(false);
  });
  it('rejects missing technical exports and planned-status files in every stage', () => {
    expect(codes(check({}, { mode: 'preparation', registry: [{ ...image, required: false, status: 'technical' }] }))).toContain('missing-file');
    expect(codes(check({ [file]: png() }, { mode: 'preparation', registry: [{ ...image, status: 'planned' }] }))).toContain('status-mismatch');
  });
  it('rejects invalid programmatic mode/phase selection instead of granting preparation success', () => {
    expect(codes(check({}, { mode: 'bogus' as NonNullable<ValidateInput['mode']> }))).toContain('validation-mode');
    expect(codes(check({}, { mode: 'production' }))).toContain('validation-phase');
    expect(codes(check({}, { mode: 'preparation', phase: 'proof_a' }))).toContain('validation-phase');
  });
  it('preserves Golden approval gating and coverage checks', () => {
    const later = { ...image, id: 'icon_later', phase: 'ui', status: 'draft' } as ImageAsset;
    expect(codes(check({}, { mode: 'preparation', registry: [image, later] }))).toContain('golden-gate');
    expect(codes(canonical('preparation', { registry: ASSET_REGISTRY.filter(asset => asset.id !== 'part_engine_t1') }))).toContain('coverage-part-icon');
  });
});

describe('registered export checks', () => {
  it.each(['preparation', 'golden', 'strict', 'release'] as const)('rejects malformed existing draft PNGs in %s', mode => {
    expect(codes(check({ [file]: Buffer.from('not a png') }, { mode }))).toContain('png-invalid');
    expect(check({ [file]: Buffer.from('not a png') }, { mode }).ok).toBe(false);
  });
  it('reports actual and expected dimensions', () => {
    const report = check({ [file]: png(5, 4) });
    expect(report.issues.find(issue => issue.code === 'wrong-size')).toMatchObject({ assetId: image.id, file, message: 'is 5x4, registry requires 4x4' });
  });
  it.each(['crc', 'truncated', 'filter', 'compression'] as const)('rejects invalid PNG %s through the validator', variant => {
    const bytes = png();
    if (variant === 'crc') bytes[29] = bytes[29]! ^ 1;
    if (variant === 'filter' || variant === 'compression') {
      bytes[variant === 'compression' ? 26 : 27] = 1;
      bytes.writeUInt32BE(crc32(bytes.subarray(12, 29)), 29);
    }
    const damaged = variant === 'truncated' ? bytes.subarray(0, bytes.length - 4) : bytes;
    expect(codes(check({ [file]: damaged }))).toContain('png-invalid');
  });
  it('rejects duplicate IHDR and unknown critical chunks rather than accepting malformed PNGs', () => {
    const valid = png();
    const duplicateHeader = Buffer.concat([valid.subarray(0, 33), valid.subarray(8, 33), valid.subarray(33)]);
    expect(codes(check({ [file]: duplicateHeader }))).toContain('png-invalid');
    const unknown = encodePng(4, 4, pixels(4, 4), [{ type: 'ABCD', data: new Uint8Array(0) }]);
    expect(codes(check({ [file]: unknown }))).toContain('png-invalid');
  });
  it('respects an RGB PNG transparency key before alpha/margin/palette checks', () => {
    // An independent RGB/tRNS fixture exercises a supported export variant, not our RGBA encoder.
    const chunk = (type: string, data: Buffer): Buffer => {
      const out = Buffer.alloc(12 + data.length); out.writeUInt32BE(data.length, 0); out.write(type, 4, 'ascii');
      out.set(data, 8); out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length); return out;
    };
    const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(4, 0); ihdr.writeUInt32BE(4, 4); ihdr[8] = 8; ihdr[9] = 2;
    const key = Buffer.alloc(6); key.writeUInt16BE(255, 0); key.writeUInt16BE(0, 2); key.writeUInt16BE(255, 4);
    const raw = Buffer.alloc((4 * 3 + 1) * 4);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) raw.set(x > 0 && x < 3 && y > 0 && y < 3 ? rgb : [255, 0, 255], y * 13 + 1 + x * 3);
    const rgbPng = Buffer.concat([png().subarray(0, 8), chunk('IHDR', ihdr), chunk('tRNS', key), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
    expect(check({ [file]: rgbPng }, { registry: [{ ...image, alpha: 'cutout' }] }).ok).toBe(true);
  });
  it('enforces sheet geometry, nonblank frames and per-frame transparent margins', () => {
    const sheet: SpritesheetAsset = { ...image, id: 'fx_probe', category: 'effects', kind: 'spritesheet', frame: { w: 4, h: 4 }, frames: 2 };
    const sheetFile = runtimeFiles(sheet)[0]!;
    expect(check({ [sheetFile]: encodePng(8, 4, pixels(8, 4, rgb, 255, 2)) }, { registry: [sheet] }).ok).toBe(true);
    expect(codes(check({ [sheetFile]: png(7, 4) }, { registry: [sheet] }))).toContain('wrong-size');
    const blank = pixels(8, 4, rgb, 255, 2);
    for (let y = 0; y < 4; y++) blank.fill(0, (y * 8 + 4) * 4, (y * 8 + 8) * 4);
    expect(codes(check({ [sheetFile]: encodePng(8, 4, blank) }, { registry: [sheet] }))).toContain('blank-frame');
    const margin = pixels(8, 4, rgb, 255, 2); margin.set([...rgb, 255], (1 * 8 + 4) * 4);
    expect(codes(check({ [sheetFile]: encodePng(8, 4, margin) }, { registry: [sheet] }))).toContain('margin-violation');
  });
  it('distinguishes binary, cutout, opaque and soft alpha contracts', () => {
    const semi = encodePng(4, 4, pixels(4, 4, rgb, 128));
    expect(codes(check({ [file]: semi }))).toContain('alpha-soft');
    expect(check({ [file]: semi }, { registry: [{ ...image, alpha: 'soft' }] }).ok).toBe(true);
    expect(codes(check({ [file]: png() }, { registry: [{ ...image, alpha: 'opaque' }] }))).toContain('not-opaque');
    const opaque = new Uint8Array(4 * 4 * 4); for (let i = 0; i < opaque.length; i += 4) opaque.set([...rgb, 255], i);
    expect(codes(check({ [file]: encodePng(4, 4, opaque) }, { registry: [{ ...image, margin: 0, alpha: 'cutout' }] }))).toContain('no-transparency');
  });
  it('ignores RGB of fully transparent pixels without ignoring visible palette violations', () => {
    const transparent = pixels(4, 4); transparent.set([255, 0, 255, 0], 0);
    expect(check({ [file]: encodePng(4, 4, transparent) }).ok).toBe(true);
    const offPalette = encodePng(4, 4, pixels(4, 4, [1, 2, 3]));
    const preparation = check({ [file]: offPalette }, { mode: 'preparation' });
    expect(preparation.ok).toBe(true);
    expect(preparation.assets[0]?.result).toBe('attention');
    expect(preparation.summary.technicalPassed).toBe(0);
    expect(check({ [file]: offPalette }).ok).toBe(false);
    expect(check({ [file]: offPalette }, { mode: 'preparation', palette: { ...palette, status: 'locked' } }).ok).toBe(false);
  });
  it('validates grayscale exports independently of the master palette and forbids colour-management chunks', () => {
    const gray = { ...image, color: 'grayscale' } as ImageAsset;
    expect(check({ [file]: encodePng(4, 4, pixels(4, 4, [150, 150, 150])) }, { registry: [gray] }).ok).toBe(true);
    expect(codes(check({ [file]: png() }, { registry: [gray] }))).toContain('not-grayscale');
    const tagged = encodePng(4, 4, pixels(4, 4), [{ type: 'gAMA', data: Uint8Array.of(0, 0, 177, 143) }]);
    expect(codes(check({ [file]: tagged }, { mode: 'preparation' }))).toContain('png-color-chunk');
  });
  it('requires complete PNG/XML font exports and checks page/glyph/atlas metadata', () => {
    const font: BitmapFontAsset = { ...image, id: 'font_probe', category: 'fonts', kind: 'bitmap_font', color: 'grayscale' };
    const [atlas, xmlFile] = runtimeFiles(font) as readonly [string, string];
    const atlasPng = encodePng(4, 4, pixels(4, 4, [150, 150, 150]));
    const xml = '<font><common lineHeight="4" scaleW="4" scaleH="4"/><pages><page id="0" file="font_probe.png"/></pages><chars><char id="65"/></chars></font>';
    expect(check({ [atlas]: atlasPng, [xmlFile]: xml }, { registry: [font] }).ok).toBe(true);
    expect(codes(check({ [atlas]: atlasPng }, { registry: [font], mode: 'preparation' }))).toContain('incomplete-files');
    expect(codes(check({ [atlas]: atlasPng, [xmlFile]: 'invalid' }, { registry: [font] }))).toContain('font-xml');
    expect(codes(check({ [atlas]: atlasPng, [xmlFile]: xml.replace('scaleW="4"', 'scaleW="8"') }, { registry: [font] }))).toContain('font-scale');
    expect(codes(check({ [atlas]: atlasPng, [xmlFile]: xml.replace('font_probe.png', 'other.png') }, { registry: [font] }))).toContain('font-page');
  });
  it('validates canonical palette integrity and supplied GPL without locking automatically', () => {
    expect(codes(check({}, { mode: 'preparation', palette: { ...palette, colors: { ink_0: '#FF00FF', ink_1: '#FF00FF' } } }))).toEqual(expect.arrayContaining(['palette-chroma', 'palette-duplicate']));
    expect(check({ [file]: png() }, { gpl: { expected: renderGpl(), actual: renderGpl().replace(/\n/g, '\r\n') } }).ok).toBe(true);
    expect(codes(check({}, { mode: 'preparation', gpl: { expected: renderGpl(), actual: 'stale' } }))).toContain('palette-gpl-stale');
    expect(codes(check({}, { gpl: { expected: renderGpl(), actual: undefined } }))).toContain('palette-gpl-missing');
  });
});

describe('runtime tree ownership', () => {
  it('delegates only audio/ and rejects unknown visual/category/root files and sources', () => {
    const report = check({ [file]: png(), 'audio/music/track.mp3': 'audio-owned', 'icons/unregistered.png': png(),
      'effects/editable.aseprite': 'source', 'other/unknown.png': png(), 'audio-old/track.mp3': 'unknown',
      'root.png': png(), 'icons/.gitkeep': '', 'icons/hidden.gitkeep': '' });
    expect(report.summary.unexpected).toBe(6);
    expect(report.issues.some(issue => issue.file === 'audio/music/track.mp3')).toBe(false);
    expect(codes(report)).toContain('source-in-runtime');
  });
  it('detects duplicate runtime listings rather than silently double-counting', () => {
    const files: AssetFs = { list: () => [file, file], read: () => png() };
    expect(codes(validateAssets({ registry: [image], fs: files, palette, mode: 'strict' }))).toContain('duplicate-file');
  });
  it('checks a controlled temporary filesystem without writing production assets', () => {
    const root = temporaryRoot(); mkdirSync(join(root, 'icons'));
    writeFileSync(join(root, file), png());
    mkdirSync(join(root, 'audio', 'music'), { recursive: true });
    writeFileSync(join(root, 'audio', 'music', 'owned-by-audio.mp3'), 'audio-owned');
    expect(nodeFs(root).list()).toEqual([file]);
    expect(validateAssets({ registry: [image], palette, fs: nodeFs(root), mode: 'strict' }).ok).toBe(true);
  });
});

describe('visual CLI', () => {
  it.each([['--stage', 'bogus'], ['--stage'], ['--wat'], ['--strict', '--allow-missing'], ['--stage', 'production'],
    ['--stage', 'golden', '--phase', 'proof_a'], ['--stage', 'production', '--phase', 'unknown'], ['--root'], ['--root', '.', '--root', '.']].map(args => ({ args })))('rejects invalid CLI arguments $args', ({ args }) => {
    const output: string[] = [];
    expect(runVisualCli(args, message => output.push(message), temporaryRoot())).toBe(1);
    expect(output.join('')).toContain('FAILED'); expect(output.join('')).toContain('Usage:');
  });
  it('supports explicit stages, existing aliases and help without silently changing scope', () => {
    expect(parseVisualArgs(['--strict'], '.').mode).toBe('strict');
    expect(parseVisualArgs(['--stage', 'production', '--phase', 'proof_b'], '.')).toMatchObject({ mode: 'production', phase: 'proof_b' });
    expect(parseVisualArgs(['--stage', 'full'], '.').mode).toBe('strict');
    const output: string[] = []; expect(runVisualCli(['--help'], message => output.push(message))).toBe(0);
    expect(output.join('')).toContain('Default: preparation');
  });
  it('runs canonical core checks and reports actionable stage failures', () => {
    const root = temporaryRoot(), output: string[] = [];
    expect(runVisualCli([], message => output.push(message), root)).toBe(1); // 1 because 8 technical assets missing
    expect(output.join('')).toContain('missing: 86'); expect(output.join('')).toContain('FAILED');
    output.length = 0;
    expect(runVisualCli(['--golden'], message => output.push(message), root)).toBe(1);
    expect(output.join('')).toContain('presence enforced: 22');
    expect(output.join('')).toContain('required for golden:');
    mkdirSync(join(root, 'public', 'assets', 'icons'), { recursive: true });
    writeFileSync(join(root, 'public', 'assets', 'icons', 'unexpected.png'), Buffer.from('bad'));
    output.length = 0;
    expect(runVisualCli([], message => output.push(message), root)).toBe(1);
    expect(output.join('')).toContain('unexpected-file');
  });
  it('the actual process entrypoint exits correctly for preparation, release and invalid input', () => {
    const root = temporaryRoot(), tool = resolve(import.meta.dirname, 'validateAssets.ts');
    const invoke = (args: string[]) => spawnSync(process.execPath, ['--import', 'tsx/esm', tool, '--root', root, ...args],
      { cwd: resolve(import.meta.dirname, '../..'), encoding: 'utf8', timeout: 15000 });
    const prepare = invoke(['--stage', 'preparation']);
    expect(prepare.error).toBeUndefined(); expect(prepare.status).toBe(1); expect(prepare.stdout).toContain('FAILED');
    const release = invoke(['--release']);
    expect(release.status).toBe(1); expect(release.stdout).toContain('missing-required'); expect(release.stdout).toContain('FAILED — release gate');
    const invalid = invoke(['--stage', 'typo']);
    expect(invalid.status).toBe(1); expect(invalid.stdout).toContain('unknown stage: typo');
  }, 20000);
});
