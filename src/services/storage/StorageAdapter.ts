/**
 * services/storage/StorageAdapter.ts
 *
 * Thin abstraction over the physical storage backend.
 *
 * VS1 uses localStorage. This interface uses Promises to ensure seamless
 * future migration to Capacitor Preferences (mobile) or IndexedDB without
 * touching any upstream game logic.
 *
 * Rule: StorageAdapter only handles raw string get/set/remove.
 * It knows nothing about SaveData structure or game rules.
 */

export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

/**
 * LocalStorageAdapter — VS1 implementation.
 *
 * Uses localStorage but wraps returns in Promises to satisfy the async
 * interface contract.
 */
export class LocalStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch {
      // Private browsing on some browsers throws on localStorage access
      console.warn(`[Storage] get failed for key "${key}"`);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // QuotaExceededError or similar — log and continue
      console.warn(`[Storage] set failed for key "${key}":`, e);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn(`[Storage] remove failed for key "${key}"`);
    }
  }
}
