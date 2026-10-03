import { it, expect, vi, afterEach } from 'vitest';
import { LocalStorageAdapter } from './StorageAdapter';
afterEach(() => vi.unstubAllGlobals());
it('returns null only when the browser reports missing data', async () => {
  vi.stubGlobal('localStorage', { getItem: () => null });
  expect(await new LocalStorageAdapter().get('key')).toBeNull();
});
it.each(['get','set','remove'] as const)('propagates browser %s exceptions', async method => {
  const fail = (): never => { throw new Error(method === 'set' ? 'QuotaExceededError' : 'SecurityError'); };
  vi.stubGlobal('localStorage', { getItem:fail, setItem:fail, removeItem:fail });
  const adapter = new LocalStorageAdapter();
  await expect(method === 'get' ? adapter.get('key') : method === 'set' ? adapter.set('key','value') : adapter.remove('key')).rejects.toThrow();
});
it('propagates unavailable localStorage instead of returning missing', async () => {
  vi.stubGlobal('localStorage', undefined); await expect(new LocalStorageAdapter().get('key')).rejects.toThrow();
});
