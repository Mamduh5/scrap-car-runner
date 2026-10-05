/** Read-only audio file/provenance gate. D13 owns policy; listening/device proof is separate. */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { AUDIO_REGISTRY, AUDIO_RUNTIME_TREE, CANONICAL_RUNTIME_AUDIO_EXT, isGoldenAudio, runtimeAudioUrls } from '../../src/game/audio/audioRegistry';
import type { AudioDefinition } from '../../src/game/audio/audioRegistry';

export type AudioStage = 'preparation' | 'golden' | 'full';
const STAGES: readonly AudioStage[] = ['preparation', 'golden', 'full'];
export interface AudioFs {
  /** URLs relative to public/assets; list only the audio-owned tree. */
  listRuntime(): readonly string[];
  readRuntime(url: string): Uint8Array | undefined;
  /** Paths relative to art/source/audio, including music/ or sfx/. */
  readSource(path: string): Uint8Array | undefined;
}
export interface AudioIssue { readonly severity: 'error' | 'warning'; readonly code: string; readonly message: string; readonly assetId?: string; readonly file?: string }
export interface AudioAssetResult {
  readonly id: string; readonly urls: readonly string[]; readonly requiredHere: boolean;
  readonly result: 'missing' | 'invalid' | 'attention' | 'passed';
  readonly provenanceApproval: 'pending' | 'recorded' | 'absent';
}
export interface AudioReport {
  readonly stage: AudioStage; readonly issues: readonly AudioIssue[]; readonly assets: readonly AudioAssetResult[];
  readonly ok: boolean; readonly errorCount: number; readonly warningCount: number;
  readonly summary: { readonly registered: number; readonly requiredVs1: number; readonly optionalVs1: number; readonly future: number;
    readonly golden: number; readonly enforced: number; readonly present: number; readonly missing: number; readonly technicalPassed: number; readonly provenanceRecords: number };
}
export interface AudioValidationInput {
  readonly registry: readonly AudioDefinition[]; readonly fs: AudioFs; readonly provenanceJson: string | undefined; readonly stage?: AudioStage;
}

function safeRelative(path: string): boolean {
  return path.length > 0 && !/[\\:\x00]/.test(path) && path.split('/').every(part => part.length > 0 && part !== '.' && part !== '..');
}
function audioUrl(url: string): boolean { return safeRelative(url) && url.startsWith(AUDIO_RUNTIME_TREE + '/'); }
export function nodeAudioFs(projectRoot: string): AudioFs {
  const assetsRoot = join(projectRoot, 'public', 'assets');
  const audioRoot = join(assetsRoot, AUDIO_RUNTIME_TREE);
  const sourceRoot = join(projectRoot, 'art', 'source', 'audio');
  const walk = (dir: string): string[] => !existsSync(dir) ? [] : readdirSync(dir).flatMap(name => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [relative(assetsRoot, full).split(sep).join('/')];
  });
  const read = (root: string, path: string): Uint8Array | undefined => {
    if (!safeRelative(path)) throw new Error('unsafe relative audio path: ' + path);
    const full = join(root, path); return existsSync(full) ? readFileSync(full) : undefined;
  };
  return { listRuntime: () => walk(audioRoot).sort(), readRuntime: url => {
    if (!audioUrl(url)) throw new Error('runtime URL outside audio tree: ' + url);
    return read(assetsRoot, url);
  }, readSource: path => read(sourceRoot, path) };
}

/** ID3 envelope + first complete MPEG Layer III frame only; never a decoder/whole-stream audit.
 * ID3 sizing: https://id3.org/id3v2.4.0-structure (header/footer excluded from size).
 */
export function inspectRuntimeAudio(bytes: Uint8Array, url: string): string | undefined {
  if (bytes.length === 0) return 'zero-byte runtime file';
  if (!url.endsWith('.mp3')) return 'structural inspection is not implemented for this registered extension; codec proof is a separate task';
  let start = 0;
  if (Buffer.from(bytes.subarray(0, 3)).toString('ascii') === 'ID3') {
    if (bytes.length < 10) return 'truncated ID3 header';
    const version = bytes[3]!, flags = bytes[5]!;
    const allowedFlags = version === 2 ? 0xc0 : version === 3 ? 0xe0 : 0xf0;
    if (![2, 3, 4].includes(version) || bytes[4] === 255 || (flags & ~allowedFlags) !== 0 || bytes.subarray(6, 10).some(b => b >= 128)) return 'invalid/unsupported ID3 header';
    const tagSize = bytes.subarray(6, 10).reduce((size, b) => size * 128 + b, 0);
    start = 10 + tagSize;
    if (version === 4 && (flags & 0x10) !== 0) {
      const footer = bytes.subarray(start, start + 10);
      if (Buffer.from(footer.subarray(0, 3)).toString('ascii') !== '3DI' || !Buffer.from(footer.subarray(3)).equals(Buffer.from(bytes.subarray(3, 10)))) return 'missing/mismatched ID3 footer';
      start += 10;
    }
    if (start > bytes.length) return 'ID3 tag extends beyond file';
  }
  if (bytes.length - start < 4) return 'missing/truncated MPEG Layer III frame after metadata';
  const a = bytes[start]!, b = bytes[start + 1]!, c = bytes[start + 2]!, d = bytes[start + 3]!;
  const version = (b >> 3) & 3, layer = (b >> 1) & 3, bitrateIndex = c >> 4, sampleIndex = (c >> 2) & 3;
  if (a !== 255 || (b & 0xe0) !== 0xe0 || version === 1 || layer !== 1 || bitrateIndex === 15 || sampleIndex === 3 || (d & 3) === 2) return 'invalid MPEG Layer III frame header (registered .mp3 file)';
  if (bitrateIndex === 0) return 'free-format MP3 frame-size inspection is unsupported';
  const rates = version === 3 ? [32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320] : [8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
  const sampleRate = [44100, 48000, 32000][sampleIndex]! / (version === 3 ? 1 : version === 2 ? 2 : 4);
  const frameSize = Math.floor((version === 3 ? 144000 : 72000) * rates[bitrateIndex - 1]! / sampleRate) + ((c >> 1) & 1);
  if (bytes.length - start < frameSize) return 'truncated first MPEG Layer III frame: needs ' + frameSize + ' bytes, has ' + (bytes.length - start);
  return undefined;
}

type ProvenanceRecord = Readonly<Record<string, unknown>>;
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
function date(v: unknown): boolean {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
}
function provenance(input: AudioValidationInput, issues: AudioIssue[]): Map<string, ProvenanceRecord> {
  const records = new Map<string, ProvenanceRecord>();
  const error = (code: string, message: string, assetId?: string): void => { issues.push({ severity: 'error', code, message, ...(assetId === undefined ? {} : { assetId }) }); };
  if (input.provenanceJson === undefined) {
    issues.push({ severity: 'warning', code: 'provenance-file-missing', message: 'art/source/audio/provenance.json absent; no records available' }); return records;
  }
  let parsed: unknown;
  try { parsed = JSON.parse(input.provenanceJson); } catch { error('provenance-json', 'provenance.json is not valid JSON'); return records; }
  if (!Array.isArray(parsed)) { error('provenance-schema', 'provenance.json must be an array of records'); return records; }
  const registered = new Map(input.registry.map(asset => [asset.id, asset]));
  for (const [index, value] of parsed.entries()) {
    if (value === null || typeof value !== 'object' || Array.isArray(value) || !text(value.id)) { error('provenance-schema', 'record ' + index + ' needs a nonempty string id'); continue; }
    const record = value as ProvenanceRecord, id = record['id'] as string;
    const asset = registered.get(id);
    if (asset === undefined) { error('provenance-id', 'record ' + index + ' refers to unregistered audio id', id); continue; }
    if (records.has(id)) { error('provenance-duplicate', 'duplicate provenance record', id); continue; }
    records.set(id, record);
    const fields = ['tool', 'sourceFilename', 'sourceFormat', 'editingPerformed', 'licenseTermsReference'];
    if (asset.category === 'music') fields.push('sourcePrompt', 'entitlement');
    for (const field of fields) if (!text(record[field])) error('provenance-field', field + ' must be a nonempty string (D13)', id);
    for (const field of ['model', 'sourcePrompt', 'entitlement']) if (record[field] !== undefined && !text(record[field])) error('provenance-field', field + ' must be nonempty when supplied', id);
    if (asset.category === 'music' || record['generationDate'] !== undefined) if (!date(record['generationDate'])) error('provenance-date', 'generationDate must be a real YYYY-MM-DD date', id);
    // D13 requires approvalDate for approved music. Absence/null explicitly represents pending
    // provenance approval; this technical gate cannot grant or require listening approval.
    if (record['approvalDate'] !== undefined && record['approvalDate'] !== null && !date(record['approvalDate'])) error('provenance-date', 'approvalDate must be a real YYYY-MM-DD date, or absent/null while pending', id);
    if (text(record['sourceFilename'])) {
      if (!safeRelative(record['sourceFilename'])) error('provenance-source-path', 'sourceFilename must be a safe path relative to its music/sfx source directory', id);
      else {
        const sourcePath = asset.category + '/' + record['sourceFilename'];
        const source = input.fs.readSource(sourcePath);
        if (source === undefined || source.length === 0) error('provenance-source-missing', 'original/source file must be retained and nonempty: art/source/audio/' + sourcePath, id);
      }
    }
  }
  return records;
}

export function validateAudio(input: AudioValidationInput): AudioReport {
  const stage = input.stage ?? 'preparation', issues: AudioIssue[] = [], assets: AudioAssetResult[] = [];
  const error = (code: string, message: string, assetId?: string, file?: string): void => { issues.push({ severity: 'error', code, message, ...(assetId === undefined ? {} : { assetId }), ...(file === undefined ? {} : { file }) }); };
  if (!STAGES.includes(stage)) error('validation-stage', 'unknown stage: ' + String(stage));
  const ids = new Set<string>(), expected = new Map<string, string>();
  for (const asset of input.registry) {
    if (!/^(bgm|sfx)_[a-z0-9]+(?:_[a-z0-9]+)*$/.test(asset.id)) error('registry-id', 'id must be a registered lower_snake_case bgm_/sfx_ key', asset.id);
    if (ids.has(asset.id)) error('registry-duplicate-id', 'duplicate audio ID', asset.id);
    ids.add(asset.id);
    if (!['music', 'sfx'].includes(asset.category) || !asset.id.startsWith(asset.category === 'music' ? 'bgm_' : 'sfx_')) error('registry-category', 'category and ID prefix must agree', asset.id);
    if (!['vs1', 'future'].includes(asset.scope) || typeof asset.required !== 'boolean' || typeof asset.loop !== 'boolean' || !text(asset.role)) error('registry-contract', 'invalid scope, required/loop flag or empty role', asset.id);
    if (!Number.isFinite(asset.defaultVolume) || asset.defaultVolume < 0 || asset.defaultVolume > 1) error('registry-volume', 'defaultVolume must be finite in [0,1]', asset.id);
    if (asset.maxInstances !== undefined && (!Number.isInteger(asset.maxInstances) || asset.maxInstances < 1)) error('registry-instances', 'maxInstances must be a positive integer', asset.id);
    if (asset.golden !== undefined && (typeof asset.golden !== 'boolean' || (asset.golden && asset.scope !== 'vs1'))) error('registry-golden', 'Golden metadata must be boolean and Golden entries must be VS1', asset.id);
    for (const url of runtimeAudioUrls(asset)) {
      if (!audioUrl(url) || !url.endsWith(CANONICAL_RUNTIME_AUDIO_EXT)) error('registry-path', 'unsafe/out-of-tree path or wrong registered extension', asset.id, url);
      if (expected.has(url)) error('registry-duplicate-path', 'runtime path also belongs to ' + expected.get(url), asset.id, url);
      expected.set(url, asset.id);
    }
  }
  const records = provenance(input, issues);
  let present = 0, missing = 0;
  for (const asset of input.registry) {
    const urls = runtimeAudioUrls(asset), requiredHere = asset.required && asset.scope === 'vs1' && (stage === 'full' || stage === 'golden' && isGoldenAudio(asset));
    const files = urls.filter(audioUrl).map(url => ({ url, bytes: input.fs.readRuntime(url) }));
    const found = files.filter((entry): entry is { url: string; bytes: Uint8Array } => entry.bytes !== undefined);
    if (found.length === 0) {
      missing++;
      if (requiredHere) error('missing-required', 'required for ' + stage + ': ' + urls.join(' or '), asset.id);
      else if (asset.required && asset.scope === 'vs1') issues.push({ severity: 'warning', code: 'missing-future', assetId: asset.id, message: 'not produced; presence not enforced by ' + stage + ': ' + urls.join(' or ') });
    } else {
      present++;
      for (const { url, bytes } of found) {
        const finding = inspectRuntimeAudio(bytes, url); if (finding !== undefined) error('runtime-invalid', finding, asset.id, url);
      }
      if (!records.has(asset.id)) issues.push({ severity: stage === 'preparation' ? 'warning' : 'error', code: 'provenance-missing', assetId: asset.id, message: 'present runtime export needs its D13 source/license record; preparation alone may report this as pending' });
    }
    const own = issues.filter(issue => issue.assetId === asset.id);
    const record = records.get(asset.id);
    assets.push({ id: asset.id, urls, requiredHere,
      provenanceApproval: record === undefined ? 'absent' : date(record['approvalDate']) ? 'recorded' : 'pending',
      result: found.length === 0 ? 'missing' : own.some(i => i.severity === 'error') ? 'invalid' : own.length > 0 ? 'attention' : 'passed' });
  }
  const seen = new Set<string>();
  for (const url of input.fs.listRuntime()) {
    if (!url.startsWith(AUDIO_RUNTIME_TREE + '/')) continue; // visual files belong to VAL-01
    if (seen.has(url)) error('duplicate-file', 'runtime file listed more than once', undefined, url);
    seen.add(url);
    if (!audioUrl(url)) error('runtime-path', 'unsafe path in audio-owned tree', undefined, url);
    else if (!expected.has(url) && url.split('/').at(-1) !== '.gitkeep') error('unexpected-file', 'not a registered runtime audio export; sources/masters belong under art/source/audio/', undefined, url);
  }
  const vs1 = input.registry.filter(a => a.scope === 'vs1');
  const errorCount = issues.filter(i => i.severity === 'error').length;
  return { stage, assets, issues, errorCount, warningCount: issues.length - errorCount, ok: errorCount === 0,
    summary: { registered: input.registry.length, requiredVs1: vs1.filter(a => a.required).length, optionalVs1: vs1.filter(a => !a.required).length,
      future: input.registry.length - vs1.length, golden: vs1.filter(isGoldenAudio).length, enforced: assets.filter(a => a.requiredHere).length,
      present, missing, technicalPassed: assets.filter(a => a.result === 'passed').length, provenanceRecords: records.size } };
}

export const AUDIO_USAGE = 'Usage: npm run validate:audio -- [--stage preparation|golden|full] [--root <project root>]\n'
  + 'Default: preparation. Aliases: --golden, --strict (full). --help prints usage. No listening/device approval is granted.';
export function parseAudioArgs(args: readonly string[], cwd: string): { stage: AudioStage; root: string; help: boolean } {
  let stage: AudioStage = 'preparation', root = cwd, help = false, stageChosen = false, rootChosen = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === '--help') { help = true; continue; }
    if (arg === '--stage' || arg === '--golden' || arg === '--strict') {
      const value = arg === '--golden' ? 'golden' : arg === '--strict' ? 'full' : args[++i];
      if (stageChosen || !STAGES.includes(value as AudioStage)) throw new Error('invalid/repeated stage: ' + String(value));
      stage = value as AudioStage; stageChosen = true;
    } else if (arg === '--root') {
      const value = args[++i]; if (rootChosen || value === undefined || value.startsWith('--')) throw new Error('missing/repeated --root value');
      root = resolve(cwd, value); rootChosen = true;
    } else throw new Error('unknown option: ' + arg);
  }
  return { stage, root, help };
}
export function formatAudioReport(report: AudioReport, root: string): string {
  const s = report.summary;
  const lines = ['Audio Asset Validation — TECHNICAL FILE/PROVENANCE CHECKS ONLY', 'Stage: ' + report.stage,
    'Root: ' + join(root, 'public', 'assets', AUDIO_RUNTIME_TREE),
    'Scope: registry + provenance + all present audio exports; required presence=' + (report.stage === 'preparation' ? 'none (future assets may be absent)' : report.stage === 'golden' ? 'canonical Golden VS1 entries' : 'all required VS1 entries'),
    'Registry: ' + s.registered + '; required VS1: ' + s.requiredVs1 + '; optional VS1: ' + s.optionalVs1 + '; future: ' + s.future + '; Golden: ' + s.golden,
    'Present: ' + s.present + '; absent: ' + s.missing + '; presence enforced: ' + s.enforced + '; technical passes: ' + s.technicalPassed,
    'Provenance records: ' + s.provenanceRecords + '; errors: ' + report.errorCount + '; warnings: ' + report.warningCount,
    'Limits: first MP3 frame/ID3 envelope, not decoding/listening/loop/loudness/device or legal proof. Codec remains provisional.'];
  for (const asset of report.assets) lines.push('ASSET ' + asset.id + ': ' + asset.result + '; required here=' + asset.requiredHere + '; provenance approval=' + asset.provenanceApproval + '; ' + asset.urls.join(', '));
  for (const issue of report.issues) lines.push(issue.severity.toUpperCase() + ' [' + issue.code + '] ' + (issue.assetId === undefined ? '' : issue.assetId + ': ') + (issue.file === undefined ? '' : issue.file + ': ') + issue.message);
  lines.push(report.ok ? report.stage === 'preparation' ? 'PASS — PREPARATION ONLY; production presence/approval not established' : 'PASS — selected technical gate; no listening/platform/legal approval granted' : 'FAILED — ' + report.stage + ' gate');
  return lines.join('\n');
}
export function runAudioCli(args: readonly string[], write: (message: string) => void = console.log, cwd = process.cwd()): number {
  try {
    const options = parseAudioArgs(args, cwd); if (options.help) { write(AUDIO_USAGE); return 0; }
    const provenancePath = join(options.root, 'art', 'source', 'audio', 'provenance.json');
    const report = validateAudio({ registry: AUDIO_REGISTRY, fs: nodeAudioFs(options.root), stage: options.stage,
      provenanceJson: existsSync(provenancePath) ? readFileSync(provenancePath, 'utf8') : undefined });
    write(formatAudioReport(report, options.root)); return report.ok ? 0 : 1;
  } catch (error: unknown) { write('FAILED — audio validation: ' + (error instanceof Error ? error.message : String(error)) + '\n' + AUDIO_USAGE); return 1; }
}
if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = runAudioCli(process.argv.slice(2));
