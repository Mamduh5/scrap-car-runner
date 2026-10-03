import type { StorageAdapter } from '@/services/storage/StorageAdapter';
export function deferred<T = void>(): { promise: Promise<T>; resolve: (value: T | PromiseLike<T>) => void; reject: (error: unknown) => void } {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
export class MemoryStorage implements StorageAdapter {
  readonly values = new Map<string, string>();
  readonly calls: string[] = [];
  getError: Error | null = null;
  setError: Error | null = null;
  removeError: Error | null = null;
  nextWriteGate: Promise<void> | null = null;
  async get(key: string): Promise<string | null> {
    this.calls.push('get:' + key);
    if (this.getError) throw this.getError;
    return this.values.get(key) ?? null;
  }
  async set(key: string, value: string): Promise<void> {
    this.calls.push('start:' + key);
    const gate = this.nextWriteGate; this.nextWriteGate = null;
    if (gate) await gate;
    if (this.setError) throw this.setError;
    this.values.set(key, value);
    this.calls.push('end:' + key);
  }
  async remove(key: string): Promise<void> {
    this.calls.push('remove:' + key);
    if (this.removeError) throw this.removeError;
    this.values.delete(key);
  }
}
