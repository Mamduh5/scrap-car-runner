import type { SaveData, SaveSnapshot } from '@/types/game';
import type { StorageAdapter } from '@/services/storage/StorageAdapter';
import { createEmptySave, createNewSave, decodeSave, encodeSave } from './saveCodec';

export { createNewSave } from './saveCodec';
export const SAVE_KEY = 'scr_save_v1';
export const RECOVERY_KEY = 'scr_save_recovery_v1';
export interface LoadResult {
  readonly data: SaveData;
  readonly status: 'new' | 'loaded' | 'recovered' | 'unsupported';
  readonly issues: readonly string[];
}
export interface SaveStore {
  load(): Promise<LoadResult>;
  save(data: SaveSnapshot): Promise<void>;
  reset(): Promise<void>;
  flush(): Promise<void>;
}

/** One ordered stream for load/recovery, writes, reset, and flush. */
export class SaveRepository implements SaveStore {
  private tail: Promise<unknown> = Promise.resolve();
  private latest: Promise<unknown> = Promise.resolve();
  private unsupported = false;
  constructor(private readonly storage: StorageAdapter) {}
  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const job = this.tail.then(operation);
    this.latest = job;
    this.tail = job.catch(() => undefined); // Return job still rejects; next job may proceed.
    return job;
  }
  load(): Promise<LoadResult> {
    return this.enqueue(async () => {
      const raw = await this.storage.get(SAVE_KEY);
      if (raw === null) return { data: createNewSave(), status: 'new', issues: [] };
      let parsed: unknown;
      try { parsed = JSON.parse(raw); } catch { parsed = null; }
      const result = decodeSave(parsed);
      if (result.kind === 'current') return { data: result.data, status: 'loaded', issues: [] };
      // Bounded latest-recovery copy. Backup MUST succeed before any replacement.
      await this.storage.set(RECOVERY_KEY, raw);
      if (result.kind === 'unsupported') {
        this.unsupported = true;
        return { data: createEmptySave(), status: 'unsupported', issues: result.issues };
      }
      await this.storage.set(SAVE_KEY, encodeSave(result.data));
      return { data: result.data, status: 'recovered', issues: result.issues };
    });
  }
  save(data: SaveSnapshot): Promise<void> {
    let raw: string;
    try { raw = encodeSave(data); }
    catch (error) { return this.enqueue(async () => { throw error; }); }
    // Capture now, never when a queued job eventually starts.
    return this.enqueue(async () => {
      if (this.unsupported) throw new Error('Unsupported save; explicit reset required');
      await this.storage.set(SAVE_KEY, raw);
    });
  }
  reset(): Promise<void> {
    const raw = encodeSave(createNewSave());
    return this.enqueue(async () => {
      await this.storage.remove(SAVE_KEY);
      await this.storage.set(SAVE_KEY, raw);
      this.unsupported = false;
    });
  }
  async flush(): Promise<void> { await this.latest; }
}
