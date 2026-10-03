/**
 * domain/parts/merge.ts
 *
 * Pure merge logic. No Phaser. No side effects.
 *
 * Canonical rules: docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md §6 Merge Eligibility
 *
 * Rules:
 *   - Merging is free (cost = 0 Scrap)
 *   - Requires 2 owned copies (service selects stored/installed inputs atomically)
 *   - The part must not be at max tier (tier 3 in VS1)
 *   - Output: 1 part of tier+1 in the same family
 *   - Merge ID convention: `{family}_t{tier+1}`
 */

import type { PartDefinition } from '@/types/game';
import { PARTS_BY_ID } from '@/data/parts';
import { MAX_TIER } from '@/types/game';

export interface MergeResult {
  readonly success:   true;
  readonly outputId:  string;          // ID of the merged (tier+1) part
  readonly outputDef: PartDefinition;  // Full definition of the merged part
}

export interface MergeFailure {
  readonly success: false;
  readonly reason:  'already_max_tier' | 'part_not_found' | 'no_output_found';
}

/**
 * Validate and resolve a merge operation.
 *
 * This function does NOT mutate inventory — callers handle inventory
 * changes via GameStateService.
 *
 * @param partId - The ID of the part being merged (both inputs have the same ID)
 * @returns      - MergeResult if merge is valid, MergeFailure otherwise
 */
export function resolveMerge(partId: string): MergeResult | MergeFailure {
  const part = PARTS_BY_ID.get(partId);
  if (part === undefined) {
    return { success: false, reason: 'part_not_found' };
  }

  if (part.tier >= MAX_TIER) {
    return { success: false, reason: 'already_max_tier' };
  }

  const outputId  = `${part.family}_t${part.tier + 1}`;
  const outputDef = PARTS_BY_ID.get(outputId);
  if (outputDef === undefined || outputDef.family !== part.family || outputDef.tier !== part.tier + 1) {
    return { success: false, reason: 'no_output_found' };
  }

  return { success: true, outputId, outputDef };
}

/**
 * Check whether a given inventory contains at least 2 copies of partId.
 * (Does not check tier; that is handled by resolveMerge.)
 */
export function canMergeInInventory(inventory: readonly string[], partId: string): boolean {
  let count = 0;
  for (const id of inventory) {
    if (id === partId) {
      count++;
      if (count >= 2) return true;
    }
  }
  return false;
}
