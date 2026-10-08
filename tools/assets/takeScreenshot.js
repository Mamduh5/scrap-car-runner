import puppeteer from 'puppeteer';
import fs from 'fs';

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to the maximum canvas 216x427 (with some margin) to capture everything
  // Wait, no. The Phaser game will scale to fill the space up to 216x427.
  // Actually, setting viewport to 216x427 exact.
  await page.setViewport({ width: 216, height: 427, deviceScaleFactor: 1 });

  for (const p of ['A', 'B', 'C', 'D']) {
    console.log(`Navigating to page ${p}...`);
    await page.goto(`http://localhost:8080?page=${p}`, { waitUntil: 'networkidle0' });
    
    // Wait for render
    await new Promise(r => setTimeout(r, 1000));
    
    await page.screenshot({ path: `art/source/fonts/typography_proof_${p}.png` });
    console.log(`Saved typography_proof_${p}.png`);
    
    const bounds = await page.evaluate(() => window.__typographyBounds || []);
    fs.writeFileSync(`art/source/fonts/typography_proof_${p}_bounds.json`, JSON.stringify(bounds, null, 2));
  }

  await browser.close();
  process.exit(0);
}

run();
