import { describe, it, expect } from 'vitest';
import { SaveRepository, SAVE_KEY, RECOVERY_KEY } from './SaveRepository';
import { createEmptySave, createNewSave, encodeSave } from './saveCodec';
import { MemoryStorage, deferred } from '@/test/storage';

describe('Ordered persistence and recovery', () => {
  it('distinguishes absence from read failure', async () => {
    const storage = new MemoryStorage(); const repo = new SaveRepository(storage);
    expect((await repo.load()).status).toBe('new'); expect(storage.values.has(SAVE_KEY)).toBe(false);
    storage.getError = new Error('SecurityError'); await expect(repo.load()).rejects.toThrow('SecurityError');
  });
  it('serializes delayed writes and captures call-time snapshots so older completion cannot win', async () => {
    const storage = new MemoryStorage(); const repo = new SaveRepository(storage); const gate = deferred();
    storage.nextWriteGate = gate.promise; const data = createEmptySave(); data.scrap = 1;
    const first = repo.save(data); data.scrap = 2; const second = repo.save(data); data.scrap = 3;
    const flushed = repo.flush(); let finished = false; void flushed.then(() => { finished = true; });
    await Promise.resolve(); await Promise.resolve();
    expect(storage.calls).toEqual(['start:' + SAVE_KEY]); expect(finished).toBe(false);
    gate.resolve(); await Promise.all([first,second,flushed]);
    expect(storage.calls).toEqual(['start:' + SAVE_KEY,'end:' + SAVE_KEY,'start:' + SAVE_KEY,'end:' + SAVE_KEY]);
    expect(JSON.parse(storage.values.get(SAVE_KEY) ?? '{}').scrap).toBe(2); expect(finished).toBe(true);
  });
  it('propagates set/quota errors, flush rejects, and later writes recover the queue', async () => {
    const storage = new MemoryStorage(); const repo = new SaveRepository(storage); storage.setError = new Error('QuotaExceededError');
    await expect(repo.save(createNewSave())).rejects.toThrow('QuotaExceededError'); await expect(repo.flush()).rejects.toThrow('QuotaExceededError');
    storage.setError = null; await repo.save({ ...createNewSave(), scrap:9 }); await repo.flush();
    expect(JSON.parse(storage.values.get(SAVE_KEY) ?? '{}').scrap).toBe(9);
  });
  it('serialization rejection participates in ordering and leaves stored progress untouched', async () => {
    const storage = new MemoryStorage(); const repo = new SaveRepository(storage); await repo.save(createNewSave()); const before = storage.values.get(SAVE_KEY);
    await expect(repo.save({ ...createNewSave(), bestDistance: NaN })).rejects.toThrow('noncanonical');
    await expect(repo.flush()).rejects.toThrow('noncanonical'); expect(storage.values.get(SAVE_KEY)).toBe(before);
    await repo.save(createNewSave()); await repo.flush();
  });
  it('reset waits behind a delayed save and commits fresh progress last', async () => {
    const storage = new MemoryStorage(); const repo = new SaveRepository(storage); const gate = deferred(); storage.nextWriteGate = gate.promise;
    const pending = repo.save({ ...createNewSave(), scrap:999 }); const reset = repo.reset(); await Promise.resolve();
    expect(storage.calls).not.toContain('remove:' + SAVE_KEY); gate.resolve(); await Promise.all([pending,reset]); await repo.flush();
    expect(JSON.parse(storage.values.get(SAVE_KEY) ?? '{}')).toEqual(createNewSave());
    expect(storage.calls.indexOf('remove:' + SAVE_KEY)).toBeGreaterThan(storage.calls.indexOf('end:' + SAVE_KEY));
  });
  it('failed remove does not masquerade as reset success and can be retried', async () => {
    const storage = new MemoryStorage(); const repo = new SaveRepository(storage); await repo.save({ ...createNewSave(), scrap:999 });
    storage.removeError = new Error('remove failed'); await expect(repo.reset()).rejects.toThrow('remove failed');
    expect(JSON.parse(storage.values.get(SAVE_KEY) ?? '{}').scrap).toBe(999);
    storage.removeError = null; await repo.reset(); expect(JSON.parse(storage.values.get(SAVE_KEY) ?? '{}').scrap).toBe(0);
  });
  it.each(['{broken','null','[]','{"version":1,"scrap":12,"inventory":["engine_t1","bad"]}','{"version":1,"scrap":1e400}'])('preserves raw corruption before canonical recovery: %s', async raw => {
    const storage = new MemoryStorage(); storage.values.set(SAVE_KEY, raw); const repo = new SaveRepository(storage);
    const result = await repo.load(); expect(result.status).toBe('recovered'); expect(storage.values.get(RECOVERY_KEY)).toBe(raw);
    expect(storage.values.get(SAVE_KEY)).toBe(encodeSave(result.data)); expect(storage.calls.indexOf('end:' + RECOVERY_KEY)).toBeLessThan(storage.calls.indexOf('start:' + SAVE_KEY));
  });
  it('backup failure prevents replacement of the original corrupted save', async () => {
    const storage = new MemoryStorage(); storage.values.set(SAVE_KEY, '{bad'); storage.setError = new Error('backup quota');
    await expect(new SaveRepository(storage).load()).rejects.toThrow('backup quota'); expect(storage.values.get(SAVE_KEY)).toBe('{bad');
  });
  it('keeps future save untouched, blocks direct saves, and permits explicit reset', async () => {
    const raw = '{"version":2,"future":"keep"}'; const storage = new MemoryStorage(); storage.values.set(SAVE_KEY, raw); const repo = new SaveRepository(storage);
    expect((await repo.load()).status).toBe('unsupported'); expect(storage.values.get(SAVE_KEY)).toBe(raw); expect(storage.values.get(RECOVERY_KEY)).toBe(raw);
    await expect(repo.save(createNewSave())).rejects.toThrow('Unsupported'); expect(storage.values.get(SAVE_KEY)).toBe(raw);
    await repo.reset(); await repo.save(createNewSave()); expect(storage.values.get(RECOVERY_KEY)).toBe(raw);
  });
});
