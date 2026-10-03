/** Raw string storage. null means absent; unavailable storage MUST reject. */
export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}
export class LocalStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> { return localStorage.getItem(key); }
  async set(key: string, value: string): Promise<void> { localStorage.setItem(key, value); }
  async remove(key: string): Promise<void> { localStorage.removeItem(key); }
}
