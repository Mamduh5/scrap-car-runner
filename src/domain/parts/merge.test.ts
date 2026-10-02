/**
 * domain/parts/merge.test.ts
 */

import { describe, it, expect } from 'vitest';
import { resolveMerge, canMergeInInventory } from './merge';

describe('resolveMerge', () => {
  it('resolves a valid T1 → T2 merge', () => {
    const result = resolveMerge('engine_t1');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.outputId).toBe('engine_t2');
      expect(result.outputDef.tier).toBe(2);
    }
  });

  it('resolves a valid T2 → T3 merge', () => {
    const result = resolveMerge('fuel_t2');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.outputId).toBe('fuel_t3');
    }
  });

  it('fails for a max-tier part', () => {
    const result = resolveMerge('cooling_t3');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('already_max_tier');
    }
  });

  it('fails for an unknown part ID', () => {
    const result = resolveMerge('nonexistent_part');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('part_not_found');
    }
  });

  it('works for all T1 and T2 families', () => {
    const t1Parts = ['engine_t1', 'fuel_t1', 'cooling_t1', 'tires_t1', 'suspension_t1'];
    const t2Parts = ['engine_t2', 'fuel_t2', 'cooling_t2', 'tires_t2', 'suspension_t2'];
    for (const id of [...t1Parts, ...t2Parts]) {
      const result = resolveMerge(id);
      expect(result.success).toBe(true);
    }
  });

  it('fails for all T3 families', () => {
    const t3Parts = ['engine_t3', 'fuel_t3', 'cooling_t3', 'tires_t3', 'suspension_t3'];
    for (const id of t3Parts) {
      const result = resolveMerge(id);
      expect(result.success).toBe(false);
    }
  });
});

describe('canMergeInInventory', () => {
  it('returns true when inventory has 2+ of the same part', () => {
    expect(canMergeInInventory(['engine_t1', 'engine_t1'], 'engine_t1')).toBe(true);
    expect(canMergeInInventory(['engine_t1', 'fuel_t1', 'engine_t1'], 'engine_t1')).toBe(true);
  });

  it('returns false when inventory has only 1 copy', () => {
    expect(canMergeInInventory(['engine_t1', 'fuel_t1'], 'engine_t1')).toBe(false);
  });

  it('returns false for an empty inventory', () => {
    expect(canMergeInInventory([], 'engine_t1')).toBe(false);
  });
});
