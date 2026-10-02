/**
 * services/storage/StorageAdapter.ts
 *
 * Thin abstraction over the physical storage backend.
 *
 * VS1 uses localStorage. This interface allows replacing localStorage with
 * Capacitor Preferences (mobile) or IndexedDB without touching game logic.
 *
 * Rule: StorageAdapter only handles raw string get/set/remove.
 * It knows nothing about SaveData structure or game rules.
 */

export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

/**
 * LocalStorageAdapter — VS1 implementation.
 *
 * localStorage is synchronous, requires no async/await,
 * and is available in all browsers and Capacitor WebViews.
 * Size limit (~5 MB) is far in excess of SaveData requirements.
 */
export class LocalStorageAdapter implements StorageAdapter {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      // Private browsing on some browsers throws on localStorage access
      console.warn(`[Storage] get failed for key "${key}"`);
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // QuotaExceededError or similar — log and continue
      console.warn(`[Storage] set failed for key "${key}":`, e);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn(`[Storage] remove failed for key "${key}"`);
    }
  }
}
