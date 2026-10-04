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

// 2. File checks (Allow missing for now as per instructions)
for (const asset of AUDIO_REGISTRY) {
  const expectedUrls = runtimeAudioUrls(asset);
  // e.g. assets/audio/music/bgm_garage.ogg
  
  let found = false;
  for (const url of expectedUrls) {
    const fullPath = path.join(PUBLIC_DIR, url);
    if (fs.existsSync(fullPath)) {
      found = true;
    }
  }

  // We are in pre-production, so missing files are allowed.
  // In the future this should throw an error if `found === false`.
  if (!found) {
    console.warn(`[Warning] Missing audio asset for ${asset.id} (Allowed during VS1 preparation)`);
  }
}

if (hasErrors) {
  console.error('Audio validation failed.');
  process.exit(1);
} else {
  console.log('Audio validation passed (Missing files allowed).');
}
