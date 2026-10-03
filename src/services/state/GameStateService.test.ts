import { describe, it, expect, vi } from 'vitest';
import { GameStateService } from './GameStateService';
import { SaveRepository, SAVE_KEY } from '@/services/save/SaveRepository';
import { createEmptySave, encodeSave } from '@/services/save/saveCodec';
import { deferred, MemoryStorage } from '@/test/storage';
import { SCRAPLAND_HIGHWAY } from '@/data/roads';
import type { SaveData, SlotId, RunState } from '@/types/game';

async function setup(edit: (data: SaveData) => void = () => {}, rng?: () => number) {
  const data = createEmptySave(); edit(data);
  const storage = new MemoryStorage(); storage.values.set(SAVE_KEY, encodeSave(data));
  const repository = new SaveRepository(storage);
  const service = new GameStateService(repository, rng);
  await service.init();
  return { service, storage, repository };
}

describe('State ownership and initialization', () => {
  it('rejects reads and actions before initialization', () => {
    const service = new GameStateService(new SaveRepository(new MemoryStorage()));
    expect(service.ready).toBe(false);
    expect(() => service.currentState).toThrow('not initialized');
    expect(() => service.scavenge()).toThrow('not initialized');
    expect(() => service.startRun()).toThrow('not initialized');
  });
  it('shares overlapping init and never reloads over newer progress', async () => {
    const gate = deferred<Awaited<ReturnType<SaveRepository['load']>>>();
    const load = vi.fn(() => gate.promise);
    const service = new GameStateService({ load, save: async () => {}, reset: async () => {}, flush: async () => {} });
    const first = service.init(); expect(service.init()).toBe(first);
    expect(() => service.merge('engine_t1')).toThrow();
    const data = createEmptySave(); data.scrap = 10;
    gate.resolve({ data, status: 'loaded', issues: [] }); await first;
    service.scavenge(); await service.init();
    expect(service.currentState.scrap).toBe(0); expect(load).toHaveBeenCalledOnce();
  });
  it('remains unready after read failure and permits retry', async () => {
    const storage = new MemoryStorage(); storage.getError = new Error('SecurityError');
    const service = new GameStateService(new SaveRepository(storage));
    await expect(service.init()).rejects.toThrow('SecurityError'); expect(service.ready).toBe(false);
    storage.getError = null; await service.init(); await service.flush();
    expect(service.ready).toBe(true); expect(service.currentState.inventory).toEqual(['engine_t1', 'fuel_t1']);
  });
  it('returns cached frozen nested snapshots detached from the loaded object', async () => {
    const { service } = await setup(data => { data.inventory = ['engine_t1']; });
    const old = service.currentState; expect(service.currentState).toBe(old);
    expect(Reflect.set(old, 'scrap', 999)).toBe(false);
    expect(Reflect.set(old.installedParts, 'engine', 'engine_t3')).toBe(false);
    expect(() => (old.inventory as string[]).push('fuel_t3')).toThrow();
    expect(service.currentState.scrap).toBe(0);
    service.installPart('engine_t1', 'engine');
    expect(service.currentState).not.toBe(old); expect(old.inventory).toEqual(['engine_t1']);
    expect(Object.isFrozen(service.currentVehicleStats)).toBe(true);
  });
  it('reports write failure without reverting progress and retries the latest snapshot', async () => {
    const { service, storage } = await setup(data => { data.inventory = ['engine_t1']; });
    storage.setError = new Error('QuotaExceededError'); service.installPart('engine_t1', 'engine');
    expect(service.persistenceStatus.status).toBe('pending');
    await expect(service.flush()).rejects.toThrow('QuotaExceededError');
    expect(service.persistenceStatus.status).toBe('error'); expect(service.currentState.installedParts.engine).toBe('engine_t1');
    storage.setError = null; await service.retryPersistence();
    expect(service.persistenceStatus.status).toBe('saved');
    expect(JSON.parse(storage.values.get(SAVE_KEY) ?? '{}').installedParts.engine).toBe('engine_t1');
  });
  it('ignores an older failure while a newer save is pending', async () => {
    const gate = deferred(); let calls = 0;
    const service = new GameStateService({ load: async () => ({ data: { ...createEmptySave(), inventory: ['engine_t1', 'fuel_t1'] }, status: 'loaded', issues: [] }),
      save: () => ++calls === 1 ? gate.promise : Promise.resolve(), reset: async () => {}, flush: async () => {} });
    await service.init(); service.installPart('engine_t1', 'engine'); service.installPart('fuel_t1', 'fuel');
    await Promise.resolve(); gate.reject(new Error('older failure')); await Promise.resolve();
    expect(service.persistenceStatus.status).toBe('saved');
  });
  it('blocks unsupported saves until explicit reset', async () => {
    const storage = new MemoryStorage(); const raw = '{"version":99999,"scrap":100}'; storage.values.set(SAVE_KEY, raw);
    const service = new GameStateService(new SaveRepository(storage)); await service.init();
    expect(service.persistenceStatus.status).toBe('blocked'); expect(service.startRun()).toBeNull(); expect(service.scavenge()).toBeNull();
    await expect(service.retryPersistence()).rejects.toThrow('Explicit reset'); expect(storage.values.get(SAVE_KEY)).toBe(raw);
    await service.reset(); expect(service.currentState.inventory).toEqual(['engine_t1','fuel_t1']); expect(service.persistenceStatus.status).toBe('saved');
  });
  it('reset invalidates a run and coordinates pending writes', async () => {
    const { service, storage } = await setup(data => { data.inventory = ['engine_t1']; data.scrap = 100; });
    const gate = deferred(); storage.nextWriteGate = gate.promise;
    service.installPart('engine_t1', 'engine'); const session = service.startRun(); expect(session).not.toBeNull();
    const reset = service.reset(); expect(service.currentState.scrap).toBe(0); expect(service.startRun()).toBeNull();
    expect(service.recordRunResult(session!.token, { ...session!.state, failureCause: 'abandoned' })).toBe(false);
    gate.resolve(); await reset; await service.flush();
    expect(JSON.parse(storage.values.get(SAVE_KEY) ?? '{}')).toEqual(service.currentState);
    expect(service.currentState.installedParts.engine).toBeNull();
  });
  it.each(['remove', 'set'] as const)('reset %s failure keeps fresh state, blocks commands and can retry', async failure => {
    const { service, storage } = await setup(data => { data.scrap = 100; });
    if (failure === 'remove') storage.removeError = new Error('reset failed'); else storage.setError = new Error('reset failed');
    await expect(service.reset()).rejects.toThrow('reset failed'); expect(service.currentState.scrap).toBe(0);
    expect(service.persistenceStatus.status).toBe('error'); expect(service.installPart('engine_t1', 'engine')).toBe(false);
    storage.removeError = null; storage.setError = null; await service.retryPersistence();
    expect(service.persistenceStatus.status).toBe('saved'); expect(service.installPart('engine_t1', 'engine')).toBe(true);
  });
});

describe('Validated ownership commands', () => {
  it('rejects unknown, missing, incompatible and invalid targets without mutation', async () => {
    const { service, storage } = await setup(data => { data.inventory = ['engine_t1']; });
    const before = service.currentState; const calls = storage.calls.length;
    expect(service.installPart('unknown', 'engine')).toBe(false); expect(service.installPart('fuel_t1', 'fuel')).toBe(false);
    expect(service.installPart('engine_t1', 'fuel')).toBe(false); expect(service.installPart('engine_t1', 'invalid' as SlotId)).toBe(false);
    expect(service.uninstallPart('invalid' as SlotId)).toBe(false); expect(service.uninstallPart('engine')).toBe(false);
    expect(service.currentState).toBe(before); expect(storage.calls).toHaveLength(calls);
  });
  it('swap and uninstall conserve all owned copies', async () => {
    const { service } = await setup(data => { data.inventory = ['engine_t2', 'fuel_t1']; data.installedParts.engine = 'engine_t1'; });
    expect(service.installPart('engine_t2', 'engine')).toBe(true);
    expect(service.currentState.inventory).toEqual(['fuel_t1','engine_t1']); expect(service.currentState.installedParts.engine).toBe('engine_t2');
    expect(service.uninstallPart('engine')).toBe(true); expect(service.currentState.inventory).toEqual(['fuel_t1','engine_t1','engine_t2']);
  });
  it('merges stored plus installed atomically to inventory without spending Scrap', async () => {
    const { service } = await setup(data => { data.scrap = 100; data.inventory = ['engine_t1','fuel_t1']; data.installedParts.engine = 'engine_t1'; });
    expect(service.merge('engine_t1')).toBe(true); expect(service.currentState.inventory).toEqual(['fuel_t1','engine_t2']);
    expect(service.currentState.installedParts.engine).toBeNull(); expect(service.currentState.scrap).toBe(100);
  });
  it('prefers two stored inputs and preserves the installed copy', async () => {
    const { service } = await setup(data => { data.inventory = ['engine_t1','engine_t1','engine_t1']; data.installedParts.engine = 'engine_t1'; });
    expect(service.merge('engine_t1')).toBe(true); expect(service.currentState.inventory).toEqual(['engine_t1','engine_t2']);
    expect(service.currentState.installedParts.engine).toBe('engine_t1');
  });
  it('rejects insufficient, unknown and max-tier merges unchanged', async () => {
    const { service } = await setup(data => { data.inventory = ['engine_t1','fuel_t3','fuel_t3']; }); const before = service.currentState;
    expect(service.merge('engine_t1')).toBe(false); expect(service.merge('unknown')).toBe(false); expect(service.merge('fuel_t3')).toBe(false);
    expect(service.currentState).toBe(before);
  });
  it.each([[0,'engine_t1'],[0.199999999,'engine_t1'],[0.2,'fuel_t1'],[0.4,'cooling_t1'],[0.6,'tires_t1'],[0.8,'suspension_t1'],[0.999999999,'suspension_t1']] as const)('RNG %s selects %s', async (draw, expected) => {
    const { service } = await setup(data => { data.scrap = 10; }, () => draw);
    expect(service.scavenge()).toBe(expected); expect(service.currentState.scrap).toBe(0); expect(service.currentState.inventory).toEqual([expected]);
  });
  it.each([-1,1,NaN,Infinity])('invalid RNG %s preserves ownership and money', async draw => {
    const { service } = await setup(data => { data.scrap = 10; }, () => draw); const before = service.currentState;
    expect(() => service.scavenge()).toThrow(RangeError); expect(service.currentState).toBe(before);
  });
  it('does not draw RNG with insufficient funds', async () => {
    const rng = vi.fn(() => 0); const { service } = await setup(() => {}, rng);
    expect(service.scavenge()).toBeNull(); expect(rng).not.toHaveBeenCalled();
  });
});

describe('Run sessions, rewards and foreground policy', () => {
  it.each(['out_of_gas','overheated','breakdown','abandoned'] as const)('consumes valid %s completion exactly once, before a failed save', async cause => {
    const { service, storage } = await setup(data => { data.bestDistance = 20; }); const session = service.startRun()!;
    const result = { ...session.state, distance: 10, fuel: cause === 'out_of_gas' ? 0 : session.state.fuel,
      heat: cause === 'overheated' ? session.stats.maxHeat : 0, durability: cause === 'breakdown' ? 0 : session.state.durability, failureCause: cause };
    storage.setError = new Error('quota'); expect(service.recordRunResult(session.token, result)).toBe(true);
    expect(service.recordRunResult(session.token, result)).toBe(false); expect(service.currentState.scrap).toBe(6); expect(service.currentState.bestDistance).toBe(20);
    await expect(service.flush()).rejects.toThrow('quota'); expect(service.recordRunResult(session.token, result)).toBe(false);
    storage.setError = null; await service.retryPersistence(); expect(service.currentState.scrap).toBe(6);
  });
  it('rejects unfinished, invalid numeric, inconsistent failure and forged/stale token results', async () => {
    const { service } = await setup(); const first = service.startRun()!;
    expect(service.startRun()).toBeNull(); expect(service.recordRunResult(first.token, first.state)).toBe(false);
    for (const bad of [{ distance: NaN }, { distance: Infinity }, { distance: -1 }, { fuel: 999 }, { maxDurability: 1 }, { heat: -1 }, { durability: 999 }, { failureCause: 'bad' }]) {
      expect(service.recordRunResult(first.token, { ...first.state, failureCause: 'abandoned', ...bad } as RunState)).toBe(false);
    }
    expect(service.recordRunResult(first.token, { ...first.state, failureCause: 'out_of_gas' })).toBe(false);
    expect(service.recordRunResult(first.token, { ...first.state, failureCause: 'overheated' })).toBe(false);
    expect(service.recordRunResult(first.token, { ...first.state, failureCause: 'breakdown' })).toBe(false);
    const valid = { ...first.state, distance: 150, failureCause: 'abandoned' as const };
    expect(service.recordRunResult({ id: first.token.id }, valid)).toBe(false);
    expect(service.recordRunResult(first.token, valid)).toBe(true); expect(service.currentState.bestDistance).toBe(150);
    const second = service.startRun()!; expect(service.recordRunResult(first.token, valid)).toBe(false);
    expect(service.recordRunResult(second.token, { ...second.state, failureCause: 'abandoned' })).toBe(true);
  });
  it('rejects currency overflow without consuming completion eligibility', async () => {
    const { service } = await setup(data => { data.scrap = Number.MAX_SAFE_INTEGER; }); const session = service.startRun()!;
    expect(service.recordRunResult(session.token, { ...session.state, failureCause: 'abandoned' })).toBe(false);
    expect(service.startRun()).toBeNull(); expect(service.currentState.scrap).toBe(Number.MAX_SAFE_INTEGER);
  });
  it('blocks garage actions during a run and freezes its stat snapshot', async () => {
    const { service } = await setup(data => { data.scrap = 10; data.inventory = ['engine_t1','engine_t1']; }); const session = service.startRun()!;
    expect(service.scavenge()).toBeNull(); expect(service.merge('engine_t1')).toBe(false); expect(service.installPart('engine_t1','engine')).toBe(false);
    expect(service.uninstallPart('engine')).toBe(false); expect(Object.isFrozen(session.stats)).toBe(true);
  });
  it('pauses hidden runs, discards resume delta and never catches up offline', async () => {
    const { service } = await setup(); const session = service.startRun()!;
    service.setForegroundActive(false); expect(service.isRunPaused).toBe(true);
    expect(service.advanceRun(session.token, session.state, SCRAPLAND_HIGHWAY, 9999)).toBe(session.state);
    service.setForegroundActive(true);
    expect(service.advanceRun(session.token, session.state, SCRAPLAND_HIGHWAY, 9999)).toBe(session.state);
    expect(service.advanceRun(session.token, session.state, SCRAPLAND_HIGHWAY, 1).distance).toBeGreaterThan(0);
    expect(() => service.advanceRun({ id:0 }, session.state, SCRAPLAND_HIGHWAY, 1)).toThrow('Unknown run');
  });
});

it('rejects malformed completion shapes without consuming a valid session', async () => {
  const { service } = await setup(); const session = service.startRun()!;
  for (const malformed of [null,undefined,[],{},'result']) {
    expect(service.recordRunResult(session.token, malformed as unknown as RunState)).toBe(false);
  }
  expect(service.recordRunResult(session.token,{ ...session.state,failureCause:'abandoned' })).toBe(true);
});
