import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AUDIO_REGISTRY, runtimeAudioUrls } from '../../src/game/audio/audioRegistry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../../public');

let hasErrors = false;

console.log('Validating Audio Registry...');

// 1. Check for duplicates
const ids = new Set<string>();
for (const asset of AUDIO_REGISTRY) {
  if (ids.has(asset.id)) {
    console.error(`[Error] Duplicate audio ID found: ${asset.id}`);
    hasErrors = true;
  }
  ids.add(asset.id);
}

const isStrict = process.argv.includes('--strict');
let hasMissing = false;

// 2. File checks
for (const asset of AUDIO_REGISTRY) {
  const expectedUrls = runtimeAudioUrls(asset);
  
  let found = false;
  for (const url of expectedUrls) {
    const fullPath = path.join(PUBLIC_DIR, url);
    if (fs.existsSync(fullPath)) {
      found = true;
    }
  }

  if (!found) {
    hasMissing = true;
    if (isStrict) {
      console.error(`[Error] Missing audio asset for ${asset.id}`);
      hasErrors = true;
    } else {
      console.warn(`[Warning] Missing audio asset for ${asset.id} (Allowed during VS1 preparation)`);
    }
  }
}

if (hasErrors) {
  console.error('Audio validation failed.');
  process.exit(1);
} else {
  if (hasMissing && !isStrict) {
    console.log('Audio validation passed (Preparation Mode: Missing files allowed).');
  } else {
    console.log('Audio validation passed.');
  }
}
