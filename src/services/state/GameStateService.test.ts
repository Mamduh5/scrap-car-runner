/**
 * services/state/GameStateService.test.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameStateService, SCAVENGE_COST } from './GameStateService';
import type { SaveRepository } from '@/services/save/SaveRepository';
import type { SaveData, RunState } from '@/types/game';
import { CURRENT_SAVE_VERSION } from '@/types/game';

// Create a fake SaveRepository
function createFakeRepository(initialState: SaveData): SaveRepository {
  return {
    load: vi.fn(() => Promise.resolve(JSON.parse(JSON.stringify(initialState)))),
    save: vi.fn(() => Promise.resolve()),
    reset: vi.fn(() => Promise.resolve()),
  } as unknown as SaveRepository;
}

function createBaseState(): SaveData {
  return {
    version: CURRENT_SAVE_VERSION,
    scrap: 0,
    inventory: [],
    installedParts: {
      engine: null,
      fuel: null,
      cooling: null,
      tires: null,
      suspension: null,
    },
    bestDistance: 0,
  };
}

describe('GameStateService', () => {
  it('loads initial state from repository', async () => {
    const repo = createFakeRepository(createBaseState());
    const service = new GameStateService(repo);
    await service.init();
    expect(service.currentState.scrap).toBe(0);
    expect(repo.load).toHaveBeenCalledOnce();
  });

  describe('scavenge()', () => {
    it('fails if scrap is below cost', async () => {
      const state = createBaseState();
      state.scrap = SCAVENGE_COST - 1;
      const repo = createFakeRepository(state);
      const service = new GameStateService(repo);
      await service.init();
      
      const result = service.scavenge();
      
      expect(result).toBeNull();
      expect(service.currentState.scrap).toBe(SCAVENGE_COST - 1);
      expect(service.currentState.inventory.length).toBe(0);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('deducts scrap and adds a random T1 part', async () => {
      const state = createBaseState();
      state.scrap = SCAVENGE_COST;
      const repo = createFakeRepository(state);
      const service = new GameStateService(repo);
      await service.init();
      
      const result = service.scavenge();
      
      expect(result).not.toBeNull();
      expect(result!.endsWith('_t1')).toBe(true);
      expect(service.currentState.scrap).toBe(0);
      expect(service.currentState.inventory).toContain(result);
      expect(repo.save).toHaveBeenCalledOnce();
    });
  });

  describe('merge()', () => {
    it('fails if inventory does not have 2 copies', async () => {
      const state = createBaseState();
      state.inventory = ['engine_t1'];
      const repo = createFakeRepository(state);
      const service = new GameStateService(repo);
      await service.init();
      
      expect(service.merge('engine_t1')).toBe(false);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('merges 2 copies into the next tier and saves', async () => {
      const state = createBaseState();
      state.inventory = ['engine_t1', 'fuel_t1', 'engine_t1'];
      const repo = createFakeRepository(state);
      const service = new GameStateService(repo);
      await service.init();
      
      expect(service.merge('engine_t1')).toBe(true);
      
      const inv = service.currentState.inventory;
      expect(inv).not.toContain('engine_t1'); // Both consumed
      expect(inv).toContain('fuel_t1');       // Untouched
      expect(inv).toContain('engine_t2');     // Added output
      expect(repo.save).toHaveBeenCalledOnce();
    });
  });

  describe('installPart()', () => {
    it('fails if part not in inventory', async () => {
      const state = createBaseState();
      const repo = createFakeRepository(state);
      const service = new GameStateService(repo);
      await service.init();
      
      expect(service.installPart('engine_t1')).toBe(false);
    });

    it('installs part to empty slot and removes from inventory', async () => {
      const state = createBaseState();
      state.inventory = ['engine_t1'];
      const repo = createFakeRepository(state);
      const service = new GameStateService(repo);
      await service.init();
      
      expect(service.installPart('engine_t1')).toBe(true);
      expect(service.currentState.inventory).not.toContain('engine_t1');
      expect(service.currentState.installedParts.engine).toBe('engine_t1');
      expect(repo.save).toHaveBeenCalledOnce();
    });

    it('swaps installed part back to inventory if slot occupied', async () => {
      const state = createBaseState();
      state.inventory = ['engine_t2'];
      state.installedParts.engine = 'engine_t1';
      const repo = createFakeRepository(state);
      const service = new GameStateService(repo);
      await service.init();
      
      expect(service.installPart('engine_t2')).toBe(true);
      expect(service.currentState.installedParts.engine).toBe('engine_t2');
      expect(service.currentState.inventory).toContain('engine_t1'); // Swapped out
      expect(service.currentState.inventory).not.toContain('engine_t2'); // Installed
    });
  });

  describe('uninstallPart()', () => {
    it('fails if slot is empty', async () => {
      const state = createBaseState();
      const repo = createFakeRepository(state);
      const service = new GameStateService(repo);
      await service.init();
      
      expect(service.uninstallPart('engine')).toBe(false);
    });

    it('removes from slot and adds to inventory', async () => {
      const state = createBaseState();
      state.installedParts.engine = 'engine_t1';
      const repo = createFakeRepository(state);
      const service = new GameStateService(repo);
      await service.init();
      
      expect(service.uninstallPart('engine')).toBe(true);
      expect(service.currentState.installedParts.engine).toBeNull();
      expect(service.currentState.inventory).toContain('engine_t1');
      expect(repo.save).toHaveBeenCalledOnce();
    });
  });

  describe('recordRunResult()', () => {
    it('awards scrap and updates best distance', async () => {
      const state = createBaseState();
      state.scrap = 5;
      state.bestDistance = 100;
      const repo = createFakeRepository(state);
      const service = new GameStateService(repo);
      await service.init();
      
      const runState: RunState = {
        distance: 150,
        fuel: 0,
        heat: 0,
        durability: 0,
        maxDurability: 0,
        failureCause: 'out_of_gas'
      };

      service.recordRunResult(runState);
      
      // base 5 + floor(150/10) = 5 + 15 = 20 scrap earned
      expect(service.currentState.scrap).toBe(25); 
      expect(service.currentState.bestDistance).toBe(150);
      expect(repo.save).toHaveBeenCalledOnce();
    });

    it('does not lower best distance', async () => {
      const state = createBaseState();
      state.bestDistance = 100;
      const repo = createFakeRepository(state);
      const service = new GameStateService(repo);
      await service.init();
      
      const runState: RunState = {
        distance: 50,
        fuel: 0, heat: 0, durability: 0, maxDurability: 0, failureCause: 'out_of_gas'
      };

      service.recordRunResult(runState);
      expect(service.currentState.bestDistance).toBe(100);
    });
  });
});
