/**
 * services/state/GameStateService.ts
 *
 * Holds the live, mutable GameState (SaveData).
 * Exposes methods for player actions (Scavenge, Merge, Install, Uninstall, Run End).
 * Handles saving to the SaveRepository on state changes.
 */

import type { SaveData, PartFamily, RunState, VehicleStats } from '@/types/game';
import { PART_FAMILIES } from '@/types/game';
import { PARTS_BY_ID } from '@/data/parts';
import { RUSTBUCKET } from '@/data/chassis';
import type { SaveRepository } from '@/services/save/SaveRepository';
import { calculateVehicleStats } from '@/domain/vehicle/calculateVehicleStats';
import { resolveMerge, canMergeInInventory } from '@/domain/parts/merge';
import { calculateRunReward } from '@/domain/run/rewards';

export const SCAVENGE_COST = 10;

export class GameStateService {
  private state!: SaveData;

  constructor(private readonly repository: SaveRepository) {
    // State is uninitialized until init() is called
  }

  /** Must be called before accessing any state. */
  public async init(): Promise<void> {
    this.state = await this.repository.load();
  }

  // --- Getters ---

  public get currentState(): Readonly<SaveData> {
    if (!this.state) throw new Error('GameStateService not initialized');
    return this.state;
  }

  public get currentVehicleStats(): VehicleStats {
    if (!this.state) throw new Error('GameStateService not initialized');
    const installedDefs = Object.values(this.state.installedParts)
      .filter((id): id is string => id !== null)
      .map(id => PARTS_BY_ID.get(id)!)
      .filter(Boolean);
    return calculateVehicleStats(RUSTBUCKET, installedDefs);
  }

  // --- Actions ---

  /**
   * Spends Scrap to scavenge a random Tier 1 part.
   * @returns The ID of the scavenged part, or null if insufficient funds.
   */
  public scavenge(): string | null {
    if (this.state.scrap < SCAVENGE_COST) {
      return null;
    }

    this.state.scrap -= SCAVENGE_COST;
    const randomFamily = PART_FAMILIES[Math.floor(Math.random() * PART_FAMILIES.length)];
    // T1 parts always end in _t1
    const newPartId = `${randomFamily}_t1`;
    this.state.inventory.push(newPartId);

    this.save();
    return newPartId;
  }

  /**
   * Merges two identical parts from inventory into one upgraded part.
   */
  public merge(partId: string): boolean {
    if (!canMergeInInventory(this.state.inventory, partId)) {
      return false;
    }

    const mergeResult = resolveMerge(partId);
    if (!mergeResult.success) {
      return false;
    }

    // Remove exactly two copies of the input part
    this.removeFromInventory(partId, 2);
    // Add the output part
    this.state.inventory.push(mergeResult.outputId);

    this.save();
    return true;
  }

  /**
   * Installs a part from inventory into the appropriate slot.
   * Uninstalls any currently installed part in that slot.
   */
  public installPart(partId: string): boolean {
    const partIndex = this.state.inventory.indexOf(partId);
    if (partIndex === -1) {
      return false; // Not in inventory
    }

    const partDef = PARTS_BY_ID.get(partId);
    if (!partDef) return false;

    const slot = partDef.family;

    // Remove from inventory
    this.state.inventory.splice(partIndex, 1);

    // If slot is occupied, return existing part to inventory
    const existing = this.state.installedParts[slot];
    if (existing) {
      this.state.inventory.push(existing);
    }

    // Install new part
    this.state.installedParts[slot] = partId;

    this.save();
    return true;
  }

  /**
   * Uninstalls a part from a slot and returns it to inventory.
   */
  public uninstallPart(slot: PartFamily): boolean {
    const existing = this.state.installedParts[slot];
    if (!existing) {
      return false; // Nothing to uninstall
    }

    this.state.installedParts[slot] = null;
    this.state.inventory.push(existing);

    this.save();
    return true;
  }

  /**
   * Called when a run ends. Records distance and awards Scrap.
   */
  public recordRunResult(runState: RunState): void {
    const reward = calculateRunReward(runState);
    this.state.scrap += reward;
    
    if (runState.distance > this.state.bestDistance) {
      this.state.bestDistance = runState.distance;
    }

    this.save();
  }

  // --- Internal ---

  private removeFromInventory(partId: string, count: number): void {
    let removed = 0;
    // Iterate backwards to avoid index shifting issues when splicing
    for (let i = this.state.inventory.length - 1; i >= 0; i--) {
      if (this.state.inventory[i] === partId) {
        this.state.inventory.splice(i, 1);
        removed++;
        if (removed === count) break;
      }
    }
  }

  private save(): void {
    // Fire-and-forget the save to avoid blocking gameplay logic
    this.repository.save(this.state).catch((e) => {
      console.error('[GameStateService] Async save failed:', e);
    });
  }
}
