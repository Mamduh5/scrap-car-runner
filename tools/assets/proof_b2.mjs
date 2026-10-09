import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const out = 'art/source/golden/art02b/production-review';
mkdirSync(out, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({ args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 180, height: 288, deviceScaleFactor: 1 });
  await page.goto('http://localhost:8081/visual-proof.html', { waitUntil: 'networkidle0' });
  
  // Wait for Phaser to boot
  await page.waitForFunction(() => window.__visualProof?.report.ready || document.querySelector('#proof-error'));

  const errorNode = await page.$('#proof-error');
  if (errorNode) {
    const text = await page.evaluate(el => el.textContent, errorNode);
    throw new Error('Proof scene failed to boot: ' + text);
  }

  async function show(state) {
    await page.evaluate((s) => window.__visualProof.show(s), state);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    
    // Assert all used textures exist without using missing texture fallback
    const report = await page.evaluate(() => window.__visualProof.report);
    if (!report.ready) throw new Error('Scene not ready');
    if (report.failures && report.failures.length > 0) throw new Error('Failed to load textures: ' + report.failures.join(', '));
  }

  // 1. Run Proof
  await show('art02b_run');
  await (await page.$('canvas')).screenshot({ path: join(out, 'proof_c_run.png') });
  
  // 2. Garage Proof
  await show('art02b_garage');
  await (await page.$('canvas')).screenshot({ path: join(out, 'proof_d_garage.png') });

  // 3. Slots Proof
  await show('art02b_slots');
  await (await page.$('canvas')).screenshot({ path: join(out, 'proof_b_five_family.png') });

  // 4. Icons Proof
  await show('art02b_icons');
  await (await page.$('canvas')).screenshot({ path: join(out, 'proof_e_icons.png') });

  await browser.close();
  console.log("ART-02B Visual Proofs Captured.");
})();
