import { PARTS_BY_ID } from '@/data/parts';
import { CURRENT_SAVE_VERSION, PART_FAMILIES } from '@/types/game';
import type { SaveData, SaveSnapshot } from '@/types/game';

export function createEmptySave(): SaveData {
  return {
    version: CURRENT_SAVE_VERSION, scrap: 0, inventory: [], bestDistance: 0,
    installedParts: { engine: null, fuel: null, cooling: null, tires: null, suspension: null },
  };
}
export function createNewSave(): SaveData {
  return { ...createEmptySave(), inventory: ['engine_t1', 'fuel_t1'] };
}
export function copySave(data: SaveSnapshot): SaveData {
  return {
    version: data.version, scrap: data.scrap, bestDistance: data.bestDistance,
    inventory: [...data.inventory], installedParts: { ...data.installedParts },
  };
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isDistance(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
}
export type DecodeResult =
  | { readonly kind: 'current' | 'recovered'; readonly data: SaveData; readonly issues: readonly string[] }
  | { readonly kind: 'unsupported'; readonly issues: readonly string[] };

/** No older schema was released. Add explicit version dispatch/migrations when V2 is introduced. */
export function decodeSave(input: unknown): DecodeResult {
  if (!isRecord(input)) return { kind: 'recovered', data: createEmptySave(), issues: ['Save is not an object'] };
  if (input['version'] !== CURRENT_SAVE_VERSION) {
    return { kind: 'unsupported', issues: ['Unsupported or missing save version; explicit reset required'] };
  }
  const data = createEmptySave();
  const issues: string[] = [];
  const scrap = input['scrap'];
  if (typeof scrap === 'number' && Number.isSafeInteger(scrap) && scrap >= 0) data.scrap = scrap;
  else issues.push('Invalid Scrap cleared');
  if (isDistance(input['bestDistance'])) data.bestDistance = input['bestDistance'];
  else issues.push('Invalid best distance cleared');

  const inventory = input['inventory'];
  if (Array.isArray(inventory)) {
    for (const id of inventory) {
      if (typeof id === 'string' && PARTS_BY_ID.has(id)) data.inventory.push(id);
      else issues.push('Invalid inventory entry removed');
    }
  } else issues.push('Missing/malformed inventory cleared; starter items are not invented');
  const installed = input['installedParts'];
  if (isRecord(installed)) {
    for (const family of PART_FAMILIES) {
      const id = installed[family];
      if (id === null) continue;
      const part = typeof id === 'string' ? PARTS_BY_ID.get(id) : undefined;
      if (part?.family === family && typeof id === 'string') data.installedParts[family] = id;
      else if (part && typeof id === 'string') {
        data.inventory.push(id); // Transfer this owned copy, without auto-installing or inventing one.
        issues.push('Wrong-family installed part moved to inventory');
      } else issues.push('Invalid/missing installed slot cleared');
    }
    if (Object.keys(installed).some(key => !PART_FAMILIES.some(family => family === key))) issues.push('Unknown installed fields removed');
  } else issues.push('Missing/malformed installed slots cleared');
  const keys = ['version', 'scrap', 'inventory', 'installedParts', 'bestDistance'];
  if (Object.keys(input).some(key => !keys.includes(key))) issues.push('Unknown save fields removed');
  return { kind: issues.length ? 'recovered' : 'current', data, issues };
}

/** JSON.stringify silently turns Infinity/NaN into null; validate first. */
export function encodeSave(data: SaveSnapshot): string {
  const result = decodeSave(data);
  if (result.kind !== 'current') throw new Error('Refusing to persist noncanonical save data');
  return JSON.stringify(result.data);
}
