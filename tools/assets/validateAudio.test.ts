import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { AUDIO_REGISTRY, CANONICAL_RUNTIME_AUDIO_EXT, isGoldenAudio, runtimeAudioUrls } from '../../src/game/audio/audioRegistry';
import type { AudioDefinition } from '../../src/game/audio/audioRegistry';
import { formatAudioReport, inspectRuntimeAudio, nodeAudioFs, parseAudioArgs, runAudioCli, validateAudio } from './validateAudio';
import type { AudioFs, AudioStage, AudioValidationInput } from './validateAudio';

const asset: AudioDefinition = Object.freeze({ ...AUDIO_REGISTRY.find(a => a.id === 'bgm_garage')! });
const url = runtimeAudioUrls(asset)[0]!;
// Structural fixture only: known MPEG-1 Layer III 128kbps/44.1kHz frame (417 bytes).
// Payload is not encoded music, and passing this gate does not establish decoding.
function frame(): Buffer { const out = Buffer.alloc(417); out.set([255, 251, 144, 0]); return out; }
const source = 'music/garage-original.wav';
const record = { id: asset.id, tool: 'fixture source', generationDate: '2026-10-05', sourcePrompt: 'fixture brief',
  sourceFilename: 'garage-original.wav', sourceFormat: 'WAV', editingPerformed: 'fixture edit notes', licenseTermsReference: 'fixture reference, not rights proof', entitlement: 'fixture reference' };
function memory(runtime: Readonly<Record<string, Uint8Array>> = {}, sources: Readonly<Record<string, Uint8Array>> = {}): AudioFs {
  return { listRuntime: () => Object.keys(runtime), readRuntime: path => runtime[path], readSource: path => sources[path] };
}
function check(runtime: Readonly<Record<string, Uint8Array>> = {}, options: Partial<AudioValidationInput> = {}) {
  return validateAudio({ registry: [asset], stage: 'golden', provenanceJson: '[]', fs: memory(runtime), ...options });
}
const codes = (report: ReturnType<typeof check>) => report.issues.map(i => i.code);
const canonical = (stage: AudioStage) => check({}, { registry: AUDIO_REGISTRY, stage });
const valid = (entry = record, stage: AudioStage = 'golden') => check({ [url]: frame() }, { stage, provenanceJson: JSON.stringify([entry]), fs: memory({ [url]: frame() }, { [source]: Buffer.from('retained original fixture') }) });
const roots: string[] = [];
function temporaryRoot(): string { const root = mkdtempSync(join(tmpdir(), 'scrap-audio-gate-')); roots.push(root); return root; }
function put(root: string, path: string, bytes: Uint8Array | string): void {
  const target = join(root, path); mkdirSync(resolve(target, '..'), { recursive: true }); writeFileSync(target, bytes);
}
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });

describe('audio stage and registry contracts', () => {
  it('preparation allows empty production/provenance but reports every missing required export', () => {
    const result = canonical('preparation');
    expect(result.ok).toBe(true); expect(result.errorCount).toBe(0); expect(result.warningCount).toBe(13);
    expect(result.summary).toMatchObject({ registered: 13, requiredVs1: 13, optionalVs1: 0, future: 0, golden: 6, enforced: 0, missing: 13, technicalPassed: 0 });
    expect(formatAudioReport(result, '.')).toContain('PREPARATION ONLY; production presence/approval not established');
  });
  it('derives exactly the D13 Golden set from canonical per-entry metadata', () => {
    const expected = ['bgm_garage', 'bgm_run', 'sfx_engine_loop', 'sfx_mech_merge', 'sfx_ui_click', 'sfx_run_fail'].sort();
    expect(AUDIO_REGISTRY.filter(isGoldenAudio).map(a => a.id).sort()).toEqual(expected);
    const result = canonical('golden');
    expect(result.assets.filter(a => a.requiredHere).map(a => a.id).sort()).toEqual(expected);
    expect(result.errorCount).toBe(6); expect(result.warningCount).toBe(7);
  });
  it('full requires every required VS1 entry rather than a hardcoded count', () => {
    const result = canonical('full');
    expect(result.errorCount).toBe(AUDIO_REGISTRY.filter(a => a.required && a.scope === 'vs1').length);
    expect(result.warningCount).toBe(0); expect(result.summary.enforced).toBe(13);
  });
  it('does not require missing optional or future entries', () => {
    expect(check({}, { stage: 'full', registry: [{ ...asset, required: false }] }).ok).toBe(true);
    expect(check({}, { stage: 'full', registry: [{ ...asset, scope: 'future', golden: false }] }).ok).toBe(true);
    expect(check({ [url]: Buffer.alloc(0) }, { stage: 'full', registry: [{ ...asset, required: false }] }).ok).toBe(false);
  });
  it('rejects duplicate IDs/paths and invalid registry contracts', () => {
    expect(codes(check({}, { registry: [asset, asset] }))).toEqual(expect.arrayContaining(['registry-duplicate-id', 'registry-duplicate-path']));
    expect(codes(check({}, { registry: [{ ...asset, defaultVolume: NaN, maxInstances: 0, role: '' }] }))).toEqual(expect.arrayContaining(['registry-volume', 'registry-instances', 'registry-contract']));
    expect(codes(check({}, { registry: [{ ...asset, id: 'bgm_../../outside' }] }))).toContain('registry-path');
  });
  it('validates a controlled fixture without changing registry/approval or codec', () => {
    const result = valid(); expect(result.ok).toBe(true); expect(result.assets[0]).toMatchObject({ result: 'passed', provenanceApproval: 'pending' });
    expect(asset).toEqual(AUDIO_REGISTRY.find(a => a.id === asset.id)); expect(CANONICAL_RUNTIME_AUDIO_EXT).toBe('.mp3');
    expect(codes(check({}, { stage: 'typo' as AudioStage }))).toContain('validation-stage');
  });
});

describe('runtime file integrity and ownership', () => {
  it('resolves the correct public/assets/audio location and ignores old public/audio', () => {
    const root = temporaryRoot(); put(root, 'public/audio/music/bgm_garage.mp3', frame());
    expect(nodeAudioFs(root).readRuntime(url)).toBeUndefined();
    expect(codes(check({}, { fs: nodeAudioFs(root) }))).toContain('missing-required');
    put(root, 'public/assets/' + url, frame()); put(root, 'art/source/audio/' + source, 'retained original fixture');
    expect(check({}, { fs: nodeAudioFs(root), provenanceJson: JSON.stringify([record]) }).ok).toBe(true);
  });
  it('owns audio exports while excluding visual files and rejecting unexpected audio/source files', () => {
    const root = temporaryRoot(); put(root, 'public/assets/icons/visual.png', 'visual-owned');
    put(root, 'public/assets/audio/music/unregistered.mp3', frame()); put(root, 'public/assets/audio/sfx/edit.wav', 'source');
    put(root, 'public/assets/audio/.gitkeep', '');
    const result = check({}, { stage: 'preparation', fs: nodeAudioFs(root) });
    expect(nodeAudioFs(root).listRuntime()).not.toContain('icons/visual.png');
    expect(result.issues.filter(i => i.code === 'unexpected-file')).toHaveLength(2);
    expect(result.issues.some(i => i.file?.endsWith('.gitkeep'))).toBe(false);
    expect(check({}, { stage: 'preparation', fs: memory({ 'icons/visual.png': Buffer.from('visual') }) }).ok).toBe(true);
  });
  it('rejects duplicate listings, traversal and unsafe adapter reads', () => {
    expect(codes(check({}, { fs: { ...memory(), listRuntime: () => [url, url, 'audio/../icons/x.png'] } }))).toEqual(expect.arrayContaining(['duplicate-file', 'runtime-path']));
    const fs = nodeAudioFs(temporaryRoot()); expect(() => fs.readRuntime('audio/../outside')).toThrow('outside audio tree');
    expect(() => fs.readSource('../outside')).toThrow('unsafe');
  });
  it.each([Buffer.alloc(0), Buffer.from('not audio'), Buffer.from('RIFFxxxxWAVE'), Buffer.from([255, 251, 144, 0]), Buffer.from([255, 255, 144, 0])])('rejects empty, wrong-container, truncated or wrong-layer runtime bytes', bytes => {
    expect(codes(check({ [url]: bytes }, { stage: 'preparation' }))).toContain('runtime-invalid');
  });
  it('accepts the structural frame and ID3 envelope, without claiming decode proof', () => {
    const tag = Buffer.from([73, 68, 51, 4, 0, 0, 0, 0, 0, 2, 0, 0]);
    expect(inspectRuntimeAudio(Buffer.concat([tag, frame()]), url)).toBeUndefined();
    expect(inspectRuntimeAudio(frame(), 'audio/music/bgm_garage.ogg')).toContain('not implemented');
    expect(formatAudioReport(valid(), '.')).toContain('not decoding/listening/loop/loudness/device or legal proof');
  });
  it.each([Buffer.from('ID3'), Buffer.from([73, 68, 51, 4, 0, 0, 128, 0, 0, 0]), Buffer.from([73, 68, 51, 4, 0, 0, 0, 0, 4, 0]), Buffer.from([73, 68, 51, 4, 0, 0, 0, 0, 0, 0])])('rejects malformed, oversized or metadata-only ID3 files', bytes => {
    expect(inspectRuntimeAudio(bytes, url)).toBeDefined();
  });
});

describe('D13 provenance checks', () => {
  it('requires provenance for present production exports but reports pending records in preparation', () => {
    const result = check({ [url]: frame() }); expect(codes(result)).toContain('provenance-missing'); expect(result.ok).toBe(false);
    const prep = check({ [url]: frame() }, { stage: 'preparation' }); expect(prep.ok).toBe(true);
    expect(prep.assets[0]?.result).toBe('attention'); expect(prep.summary.technicalPassed).toBe(0);
    expect(check({ [url]: frame() }, { stage: 'full' }).ok).toBe(false);
  });
  it.each(['{broken', '{}', '[null]', '[{"id":"unregistered"}]'])('rejects malformed provenance %s even in preparation', provenanceJson => {
    expect(check({}, { stage: 'preparation', provenanceJson }).ok).toBe(false);
  });
  it('rejects duplicate records, invalid dates, missing music fields and unsafe source references', () => {
    expect(codes(check({}, { provenanceJson: JSON.stringify([record, record]) }))).toContain('provenance-duplicate');
    expect(codes(valid({ ...record, generationDate: '2026-02-30', sourcePrompt: '', entitlement: '' }))).toEqual(expect.arrayContaining(['provenance-date', 'provenance-field']));
    expect(codes(valid({ ...record, sourceFilename: '../outside.wav' }))).toContain('provenance-source-path');
    expect(codes(check({}, { provenanceJson: JSON.stringify([record]) }))).toContain('provenance-source-missing');
    expect(codes(valid({ ...record, model: '' } as typeof record))).toContain('provenance-field');
  });
  it('checks retained nonempty source separately from runtime encoding', () => {
    expect(valid().ok).toBe(true); // WAV source is separate from the provisional MP3 export.
    expect(codes(check({ [url]: frame() }, { provenanceJson: JSON.stringify([record]), fs: memory({ [url]: frame() }, { [source]: Buffer.alloc(0) }) }))).toContain('provenance-source-missing');
    const approved = { ...record, approvalDate: '2026-10-05' };
    expect(valid(approved).assets[0]?.provenanceApproval).toBe('recorded');
    expect(codes(valid({ ...record, approvalDate: 'bad' } as typeof record))).toContain('provenance-date');
  });
  it('uses minimal sourced-SFX fields instead of inventing AI music requirements', () => {
    const sfx = AUDIO_REGISTRY.find(a => a.id === 'sfx_ui_click')!, sfxUrl = runtimeAudioUrls(sfx)[0]!;
    const entry = { id: sfx.id, tool: 'fixture synth', sourceFilename: 'click-session.txt', sourceFormat: 'editable session', editingPerformed: 'fixture notes', licenseTermsReference: 'fixture reference' };
    expect(check({}, { registry: [sfx], provenanceJson: JSON.stringify([entry]), fs: memory({ [sfxUrl]: frame() }, { 'sfx/click-session.txt': Buffer.from('session fixture') }) }).ok).toBe(true);
  });
  it('missing provenance file is reportable before production and never hides a produced-record failure', () => {
    expect(check({}, { stage: 'preparation', provenanceJson: undefined }).ok).toBe(true);
    expect(codes(check({ [url]: frame() }, { provenanceJson: undefined }))).toContain('provenance-missing');
  });
});

describe('audio CLI', () => {
  it.each([['--stage', 'typo'], ['--stage'], ['--wat'], ['--strict', '--golden'], ['--root'], ['--root', '.', '--root', '.']].map(args => ({ args })))('rejects invalid options $args', ({ args }) => {
    const output: string[] = []; expect(runAudioCli(args, s => output.push(s), temporaryRoot())).toBe(1);
    expect(output.join('')).toContain('Usage:'); expect(output.join('')).toContain('FAILED');
  });
  it('help succeeds and strict alias deterministically means full', () => {
    const output: string[] = []; expect(runAudioCli(['--help'], s => output.push(s))).toBe(0);
    expect(output.join('')).toContain('preparation|golden|full'); expect(parseAudioArgs(['--strict'], '.').stage).toBe('full');
  });
  it('the actual process runs validation and exits correctly without import side effects', () => {
    const root = temporaryRoot(), tool = resolve(import.meta.dirname, 'validateAudio.ts');
    put(root, 'art/source/audio/provenance.json', '[]');
    const invoke = (args: string[]) => spawnSync(process.execPath, ['--import', 'tsx/esm', tool, '--root', root, ...args], { cwd: resolve(import.meta.dirname, '../..'), encoding: 'utf8', timeout: 15000 });
    const prep = invoke([]); expect(prep.error).toBeUndefined(); expect(prep.status).toBe(0); expect(prep.stdout).toContain('PREPARATION ONLY');
    const golden = invoke(['--stage', 'golden']); expect(golden.status).toBe(1); expect(golden.stdout).toContain('presence enforced: 6');
    const full = invoke(['--strict']); expect(full.status).toBe(1); expect(full.stdout).toContain('presence enforced: 13');
    expect(invoke(['--stage', 'typo']).status).toBe(1); expect(invoke(['--help']).status).toBe(0);
    const imported = spawnSync(process.execPath, ['--import', 'tsx/esm', '--input-type=module', '-e',
      `await import(${JSON.stringify(pathToFileURL(tool).href)}); process.stdout.write('import-only');`],
      { cwd: resolve(import.meta.dirname, '../..'), encoding: 'utf8', timeout: 15000 });
    expect(imported.status).toBe(0); expect(imported.stdout).toBe('import-only');
  }, 25000);
});
