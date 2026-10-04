/**
 * game/audio/audioRegistry.ts — CANONICAL machine-readable VS1 audio registry.
 * 
 * Enforces IDs, looping, and volume defaults before the assets even exist.
 */

export type AudioCategory = 'music' | 'sfx';

export interface AudioDefinition {
  readonly id: string;
  readonly category: AudioCategory;
  readonly role: string;
  readonly loop: boolean;
  readonly defaultVolume: number;
  readonly required: boolean;
  readonly scope: 'vs1' | 'future';
  readonly maxInstances?: number; // Helps avoid audio spam clipping for SFX
}

export const AUDIO_REGISTRY: readonly AudioDefinition[] = [
  // Music (Golden Set target)
  { id: 'bgm_garage', category: 'music', role: 'Garage planning loop', loop: true, defaultVolume: 0.7, required: true, scope: 'vs1' },
  { id: 'bgm_run', category: 'music', role: 'Road momentum loop', loop: true, defaultVolume: 0.7, required: true, scope: 'vs1' },
  
  // UI SFX
  { id: 'sfx_ui_click', category: 'sfx', role: 'Generic button click', loop: false, defaultVolume: 1.0, required: true, scope: 'vs1', maxInstances: 3 },
  { id: 'sfx_ui_error', category: 'sfx', role: 'Invalid action/blocked', loop: false, defaultVolume: 1.0, required: true, scope: 'vs1', maxInstances: 2 },
  
  // Engineering SFX (Golden Set target)
  { id: 'sfx_mech_install', category: 'sfx', role: 'Install part', loop: false, defaultVolume: 1.0, required: true, scope: 'vs1', maxInstances: 2 },
  { id: 'sfx_mech_uninstall', category: 'sfx', role: 'Uninstall part', loop: false, defaultVolume: 1.0, required: true, scope: 'vs1', maxInstances: 2 },
  { id: 'sfx_mech_merge', category: 'sfx', role: 'Merge success', loop: false, defaultVolume: 1.0, required: true, scope: 'vs1', maxInstances: 2 },
  
  // Gameplay SFX (Golden Set target)
  { id: 'sfx_engine_loop', category: 'sfx', role: 'Vehicle engine running', loop: true, defaultVolume: 0.8, required: true, scope: 'vs1', maxInstances: 1 },
  
  // Warnings
  { id: 'sfx_warn_heat', category: 'sfx', role: 'High heat warning', loop: false, defaultVolume: 1.0, required: true, scope: 'vs1', maxInstances: 1 },
  { id: 'sfx_warn_fuel', category: 'sfx', role: 'Low fuel warning', loop: false, defaultVolume: 1.0, required: true, scope: 'vs1', maxInstances: 1 },
  { id: 'sfx_warn_durability', category: 'sfx', role: 'Critical durability warning', loop: false, defaultVolume: 1.0, required: true, scope: 'vs1', maxInstances: 1 },
  
  // Results
  { id: 'sfx_run_fail', category: 'sfx', role: 'Run failure breakdown', loop: false, defaultVolume: 1.0, required: true, scope: 'vs1', maxInstances: 1 },
  { id: 'sfx_reward_scrap', category: 'sfx', role: 'Earned scrap count tick', loop: false, defaultVolume: 0.6, required: true, scope: 'vs1', maxInstances: 4 },
];

export const AUDIO_BY_ID: ReadonlyMap<string, AudioDefinition> = new Map(AUDIO_REGISTRY.map(a => [a.id, a]));

/** 
 * PROVISIONAL UNTIL GOLDEN AUDIO RUNTIME TESTING
 * The final production codec will be selected based on gapless loop testing.
 */
export const CANONICAL_RUNTIME_AUDIO_EXT = '.mp3'; // PROVISIONAL

/** Returns expected runtime relative URLs for a given audio ID. */
export function runtimeAudioUrls(asset: AudioDefinition): readonly string[] {
  const base = `audio/${asset.category}/${asset.id}`;
  return [`${base}${CANONICAL_RUNTIME_AUDIO_EXT}`];
}
