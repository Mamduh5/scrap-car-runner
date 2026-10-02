/**
 * services/save/SaveRepository.ts
 *
 * Owns all save/load operations. Applies migrations. Handles corruption.
 *
 * Canonical rules: docs/03_GAME_DATA_BIBLE.md §Save Loading & Corruption Behavior
 *
 * Architecture:
 *   StorageAdapter  — raw string I/O (no game knowledge)
 *   SaveRepository  — serialization, versioning, migration (no Phaser)
 *   GameStateService — owns the live GameState; calls SaveRepository
 */

import type { SaveData, InstalledParts } from '@/types/game';
import { CURRENT_SAVE_VERSION, PART_FAMILIES } from '@/types/game';
import type { StorageAdapter } from '@/services/storage/StorageAdapter';

const SAVE_KEY = 'scr_save_v1';

// ---------------------------------------------------------------------------
// Default (new) save — see docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md §7
// ---------------------------------------------------------------------------

function createDefaultInstalledParts(): InstalledParts {
  return {
    engine:     null,
    fuel:       null,
    cooling:    null,
    tires:      null,
    suspension: null,
  };
}

export function createNewSave(): SaveData {
  return {
    version:        CURRENT_SAVE_VERSION,
    scrap:          0,
    inventory:      ['engine_t1', 'fuel_t1'], // Starter parts; player must install manually
    installedParts: createDefaultInstalledParts(),
    bestDistance:   0,
  };
}

// ---------------------------------------------------------------------------
// Migrations — add one function per version bump
// ---------------------------------------------------------------------------

type LegacySave = Record<string, unknown>;

function migrateSave(data: LegacySave, fromVersion: number): SaveData {
  let save = data;
  // Example migration template (not needed at version 1):
  // if (fromVersion < 2) { save = migrateV1toV2(save); }
  // if (fromVersion < 3) { save = migrateV2toV3(save); }
  void fromVersion; // suppress unused warning until first migration is needed
  return save as unknown as SaveData;
}

// ---------------------------------------------------------------------------
// Validation — lightweight structural check after load/migration
// ---------------------------------------------------------------------------

function isValidSave(data: unknown): data is SaveData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;

  if (typeof d['version'] !== 'number')       return false;
  if (typeof d['scrap'] !== 'number')         return false;
  if (!Array.isArray(d['inventory']))         return false;
  if (typeof d['bestDistance'] !== 'number')  return false;
  if (typeof d['installedParts'] !== 'object' || d['installedParts'] === null) return false;

  const ip = d['installedParts'] as Record<string, unknown>;
  for (const family of PART_FAMILIES) {
    if (!(family in ip)) return false;
    const v = ip[family];
    if (v !== null && typeof v !== 'string') return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// SaveRepository
// ---------------------------------------------------------------------------

export class SaveRepository {
  constructor(private readonly storage: StorageAdapter) {}

  /**
   * Load and return SaveData.
   *
   * Decision table (docs/03_GAME_DATA_BIBLE.md §Save Loading & Corruption Behavior):
   *   - No save:          return new save
   *   - JSON parse error: return new save + warn
   *   - Version too high: return new save + warn
   *   - Version lower:    migrate then return
   *   - Version matches:  return as-is
   */
  load(): SaveData {
    const raw = this.storage.get(SAVE_KEY);
    if (raw === null) {
      return createNewSave();
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.warn('[Save] Corrupted save (JSON parse error) — starting fresh.');
      return createNewSave();
    }

    if (typeof parsed !== 'object' || parsed === null) {
      console.warn('[Save] Corrupted save (not an object) — starting fresh.');
      return createNewSave();
    }

    const d = parsed as Record<string, unknown>;
    const version = typeof d['version'] === 'number' ? d['version'] : -1;

    if (version > CURRENT_SAVE_VERSION) {
      console.warn(`[Save] Save version ${version} > current ${CURRENT_SAVE_VERSION} — starting fresh.`);
      return createNewSave();
    }

    let data = parsed as LegacySave;
    if (version < CURRENT_SAVE_VERSION) {
      data = migrateSave(data, version) as unknown as LegacySave;
    }

    if (!isValidSave(data)) {
      console.warn('[Save] Save failed structural validation after migration — starting fresh.');
      return createNewSave();
    }

    return data;
  }

  /** Serialise and persist the current save state. */
  save(data: SaveData): void {
    try {
      this.storage.set(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('[Save] Failed to persist save:', e);
    }
  }

  /** Remove all save data (e.g. player resets progress). */
  reset(): void {
    this.storage.remove(SAVE_KEY);
  }
}
