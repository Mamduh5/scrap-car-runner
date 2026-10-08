/** Capture the actual Vite/Phaser scene. No mock rendering and no screenshot baselines. */
import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { decodePng } from './png.ts';

const out = 'art/source/golden/vis01';
mkdirSync(join(out, 'review'), { recursive: true });
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const path = join(dir, entry.name).replaceAll('\\', '/');
  return entry.isDirectory() ? walk(path) : [path];
});
const sha = file => createHash('sha256').update(readFileSync(file)).digest('hex');
if (process.argv.includes('--baseline')) {
  const files = [...walk('public/assets'), ...walk('art/source').filter(file => !file.startsWith(out + '/'))];
  writeFileSync(join(out, 'preservation-baseline.json'), JSON.stringify(Object.fromEntries(files.map(file => [file, sha(file)])), null, 2) + '\n');
  console.log(`Sealed ${files.length} existing art/runtime files.`);
  process.exit(0);
}
const baseline = JSON.parse(readFileSync(join(out, 'preservation-baseline.json'), 'utf8'));
const changed = Object.keys(baseline).filter(file => sha(file) !== baseline[file]);
if (changed.length) throw new Error('Protected art changed: ' + changed.join(', '));
const tileEdges = ['env_sky_outskirts', 'env_clouds_strip', 'env_far_junkyard', 'env_road_asphalt'].map(key => {
  const image = decodePng(readFileSync('public/assets/environments/' + key + '.png'));
  let mismatchedRows = 0;
  for (let y = 0; y < image.height; y++) {
    const left = y * image.width * 4, right = (y * image.width + image.width - 1) * 4;
    const bothTransparent = image.rgba[left + 3] === 0 && image.rgba[right + 3] === 0;
    if (!bothTransparent && [0,1,2,3].some(c => image.rgba[left + c] !== image.rgba[right + c])) mismatchedRows++;
  }
  if (mismatchedRows) throw new Error(key + ': source tile edges differ at ' + mismatchedRows + ' rows');
  return { key, width:image.width, height:image.height, mismatchedRows };
});

const browser = await puppeteer.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
const errors = [], requests = new Set(), samples = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => {
  if (new URL(response.url()).pathname.startsWith('/assets/')) {
    requests.add(new URL(response.url()).pathname);
    if (!response.ok()) errors.push('HTTP ' + response.status() + ': ' + response.url());
  }
});
const assert = (condition, message) => { if (!condition) throw new Error(message); };
async function settle() {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function show(state, guides = false, frame = 0, phase = 0, tile) {
  await page.evaluate((...args) => window.__visualProof.show(...args), state, guides, frame, phase, tile);
  await settle();
}
async function inspect(name, capture = true) {
  const report = await page.evaluate(() => {
    const canvas = document.querySelector('canvas'), rect = canvas.getBoundingClientRect();
    const ratio = rect.width * devicePixelRatio / canvas.width;
    return { ...window.__visualProof.report, devicePixelRatio, canvas: { width: canvas.width, height: canvas.height,
      cssWidth: rect.width, cssHeight: rect.height, devicePixelsPerArtPixel: ratio,
      imageRendering: getComputedStyle(canvas).imageRendering } };
  });
  assert(report.ready && !report.failures.length, name + ': loading failed');
  assert(report.assets.every(a => a.present && a.nearest && a.frameDimensions), name + ': missing texture/font, invalid frames or non-nearest filter');
  assert(!report.pixelConfig.antialias && report.pixelConfig.roundPixels, name + ': pixel-art config');
  assert(Math.abs(report.pixelConfig.zoom * report.devicePixelRatio - Math.round(report.pixelConfig.zoom * report.devicePixelRatio)) < 1e-6, name + ': noninteger device zoom');
  assert(report.bounds.every(b => b.safe && b.integer), name + ': critical clipping or fractional sprite transform: ' + JSON.stringify(report.bounds.filter(b => !b.safe || !b.integer)));
  assert(report.tiles.every(t => t.adjacent && t.copies.every(Number.isInteger)), name + ': tile placement gap');
  // DOM layout rounds CSS dimensions to 1/64px, including at fractional DPR. Allow only that quantization.
  const ratio = report.canvas.devicePixelsPerArtPixel;
  assert(Math.abs(ratio - Math.round(ratio)) <= report.devicePixelRatio / (64 * report.canvas.width), name + ': fractional display scale');
  assert(report.canvas.imageRendering === 'pixelated', name + ': CSS smoothing');
  if (capture) await (await page.$('canvas')).screenshot({ path: join(out, 'review', name + '.png') });
  samples.push({ name, ...report });
  return report;
}
function integerEnlargement(small, large, scale) {
  const a = decodePng(readFileSync(small)), b = decodePng(readFileSync(large));
  assert(b.width === a.width * scale && b.height === a.height * scale, 'Inspection capture dimensions');
  let mismatches = 0;
  for (let y = 0; y < b.height; y++) for (let x = 0; x < b.width; x++) {
    const ai = (Math.floor(y / scale) * a.width + Math.floor(x / scale)) * 4, bi = (y * b.width + x) * 4;
    if ([0, 1, 2, 3].some(c => a.rgba[ai + c] !== b.rgba[bi + c])) mismatches++;
  }
  assert(mismatches === 0, 'Integer-enlarged Phaser output differs: ' + mismatches);
  return { scale, mismatches };
}
function safeCropMatches(safeFile, fullFile) {
  const a = decodePng(readFileSync(safeFile)), b = decodePng(readFileSync(fullFile));
  let mismatches = 0;
  for (let y = 0; y < 288; y++) for (let x = 0; x < 180; x++) {
    const ai = (y * 180 + x) * 4, bi = ((y + 69) * 216 + x + 18) * 4;
    if ([0, 1, 2, 3].some(c => a.rgba[ai + c] !== b.rgba[bi + c])) mismatches++;
  }
  assert(mismatches === 0, 'Safe composition changes between viewports: ' + mismatches);
  return { mismatches };
}
const enlargement = {}, crop = {};
try {
  await page.setViewport({ width: 180, height: 288, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:8080/visual-proof.html', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.__visualProof?.report.ready);
  for (const state of ['garage', 'run']) {
    await show(state); await inspect(state + '-clean-180x288');
    await show(state, true); await inspect(state + '-guided-180x288');
  }
  for (let frame = 0; frame < 4; frame++) { await show('vehicle', false, frame); await inspect('vehicle-frame-' + frame); }
  await show('ui'); await inspect('ui-context-180x288');
  for (let frame = 0; frame < 4; frame++) { await show('run', false, frame, frame * 61); await inspect('run-cycle-' + frame); }
  for (const tile of ['env_sky_outskirts', 'env_clouds_strip', 'env_far_junkyard', 'env_road_asphalt']) {
    for (const phase of [0, 1, 63, 64, 255, 256, 383, 384]) {
      await show('seams', false, 0, phase, tile);
      await inspect('tile-' + tile + '-phase-' + phase, phase === 0);
    }
  }
  await page.setViewport({ width: 216, height: 427, deviceScaleFactor: 1 }); await settle();
  for (const state of ['garage', 'run']) { await show(state); await inspect(state + '-clean-216x427'); }
  for (const state of ['garage', 'run']) {
    await page.setViewport({ width: 540, height: 864, deviceScaleFactor: 1 }); await settle();
    await show(state); await inspect(state + '-clean-180x288-3x');
    enlargement[state] = integerEnlargement(join(out, 'review', state + '-clean-180x288.png'), join(out, 'review', state + '-clean-180x288-3x.png'), 3);
    crop[state] = safeCropMatches(join(out, 'review', state + '-clean-180x288.png'), join(out, 'review', state + '-clean-216x427.png'));
  }
  for (const viewport of [{width:360,height:640,deviceScaleFactor:1}, {width:390,height:844,deviceScaleFactor:3}, {width:393,height:852,deviceScaleFactor:2.75}]) {
    await page.setViewport(viewport); await settle();
    for (const state of ['garage', 'run', 'vehicle', 'ui']) {
      await show(state); await inspect(`resize-${state}-${viewport.width}x${viewport.height}-dpr${viewport.deviceScaleFactor}`, false);
    }
  }
  assert(!errors.length, errors.join('\n'));
  // A real failed production request must stop the proof and expose its key/URL to the reviewer.
  const failurePage = await browser.newPage(); await failurePage.setRequestInterception(true);
  failurePage.on('request', request => request.url().endsWith('/vehicles/veh_rustbucket_body.png') ? request.abort() : request.continue());
  await failurePage.goto('http://127.0.0.1:8080/visual-proof.html', {waitUntil:'networkidle0'});
  await failurePage.waitForSelector('#proof-error');
  const failure = await failurePage.evaluate(() => ({ report:window.__visualProof.report, visible:document.querySelector('#proof-error').textContent }));
  assert(!failure.report.ready && failure.visible.includes('veh_rustbucket_body'), 'Load failures are not visible');
  await failurePage.close();
  const reviewPage = await browser.newPage();
  await reviewPage.setViewport({width:1000,height:1100,deviceScaleFactor:1});
  await reviewPage.goto('http://127.0.0.1:8080/art/source/golden/vis01/review.html', {waitUntil:'networkidle0'});
  assert(await reviewPage.evaluate(() => [...document.images].every(i => i.complete && i.naturalWidth > 0)), 'Review page has missing images');
  await reviewPage.screenshot({path:join(out,'review','owner-review.png'),fullPage:true});
  await reviewPage.close();
  writeFileSync(join(out, 'runtime-evidence.json'), JSON.stringify({ engine:'Phaser runtime via Vite', renderer:samples[0].renderer,
    samples, enlargement, crop, tileEdges, expectedFailure:failure, errors, requests:[...requests].sort(),
    protectedFiles:Object.keys(baseline).length, protectedFilesChanged:changed, exitCode:0 }, null, 2) + '\n');
  console.log(`VIS-01: ${samples.length} runtime states passed; real load failure visible; ${Object.keys(baseline).length} protected files unchanged.`);
} finally { await browser.close(); }
