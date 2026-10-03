/** Sole owner of mutable progress. Scenes receive cached, detached frozen snapshots. */
import type { SaveData, SaveSnapshot, SlotId, RunState, VehicleStats, RoadDefinition } from '@/types/game';
import { PART_FAMILIES } from '@/types/game';
import { PARTS_BY_ID } from '@/data/parts';
import { RUSTBUCKET } from '@/data/chassis';
import type { SaveStore, LoadResult } from '@/services/save/SaveRepository';
import { copySave, createNewSave } from '@/services/save/saveCodec';
import { calculateVehicleStats } from '@/domain/vehicle/calculateVehicleStats';
import { resolveMerge } from '@/domain/parts/merge';
import { calculateRunReward } from '@/domain/run/rewards';
import { advanceSimulation, createRunState, isValidRunState } from '@/domain/run/simulation';

export const SCAVENGE_COST = 10;
export interface RunToken { readonly id: number }
export interface RunSession { readonly token: RunToken; readonly stats: VehicleStats; readonly state: RunState }
export interface PersistenceStatus { readonly status: 'saved' | 'pending' | 'error' | 'blocked'; readonly error: string | null }

export class GameStateService {
  private state: SaveData | null = null;
  private snapshot: SaveSnapshot | null = null;
  private initialization: Promise<void> | null = null;
  private loadInfo: Readonly<{ status: LoadResult['status']; issues: readonly string[] }> | null = null;
  private persistence: PersistenceStatus = Object.freeze({ status: 'saved', error: null });
  private revision = 0;
  private resetting = false;
  private resetNeedsRetry = false;
  private activeRun: RunSession | null = null;
  private nextRunId = 0;
  private foreground = true;
  private discardResumeDelta = false;

  constructor(private readonly repository: SaveStore, private readonly random: () => number = Math.random) {}

  public get ready(): boolean { return this.state !== null; }
  public get loadStatus(): typeof this.loadInfo { return this.loadInfo; }
  public get persistenceStatus(): PersistenceStatus { return this.persistence; }
  public get isRunPaused(): boolean { return !this.foreground; }

  /** Concurrent/repeated calls share one load. Failed loads permit an explicit retry. */
  public init(): Promise<void> {
    if (this.initialization) return this.initialization;
    this.initialization = this.repository.load().then(result => {
      this.state = copySave(result.data);
      this.loadInfo = Object.freeze({ status: result.status, issues: Object.freeze([...result.issues]) });
      if (result.status === 'unsupported') this.persistence = Object.freeze({ status: 'blocked', error: 'Unsupported save; explicit reset required' });
      else if (result.status === 'new') this.persist();
    }).catch((error: unknown) => {
      this.initialization = null;
      throw error;
    });
    return this.initialization;
  }

  public get currentState(): SaveSnapshot {
    const state = this.requireState();
    if (!this.snapshot) this.snapshot = Object.freeze({ ...state,
      inventory: Object.freeze([...state.inventory]), installedParts: Object.freeze({ ...state.installedParts }) });
    return this.snapshot;
  }

  public get currentVehicleStats(): VehicleStats {
    const installed = Object.values(this.requireState().installedParts).flatMap(id => {
      const part = id === null ? undefined : PARTS_BY_ID.get(id);
      return part ? [part] : [];
    });
    return Object.freeze(calculateVehicleStats(RUSTBUCKET, installed));
  }

  public scavenge(): string | null {
    if (!this.canChangeGarage()) return null;
    const state = this.requireState();
    if (state.scrap < SCAVENGE_COST) return null;
    const draw = this.random();
    if (!Number.isFinite(draw) || draw < 0 || draw >= 1) throw new RangeError('RNG must return [0, 1)');
    const id = String(PART_FAMILIES[Math.floor(draw * PART_FAMILIES.length)]) + '_t1';
    if (!PARTS_BY_ID.has(id)) throw new Error('Missing scavenge definition');
    state.scrap -= SCAVENGE_COST;
    state.inventory.push(id);
    this.persist();
    return id;
  }

  public installPart(partId: string, target: SlotId): boolean {
    if (!this.canChangeGarage() || !RUSTBUCKET.slots.includes(target)) return false;
    const state = this.requireState();
    const part = PARTS_BY_ID.get(partId);
    const index = state.inventory.indexOf(partId);
    if (!part || part.family !== target || index < 0) return false;
    state.inventory.splice(index, 1);
    const previous = state.installedParts[target];
    if (previous !== null) state.inventory.push(previous);
    state.installedParts[target] = partId;
    this.persist();
    return true;
  }

  public uninstallPart(target: SlotId): boolean {
    if (!this.canChangeGarage() || !RUSTBUCKET.slots.includes(target)) return false;
    const state = this.requireState();
    const previous = state.installedParts[target];
    if (previous === null) return false;
    state.installedParts[target] = null;
    state.inventory.push(previous);
    this.persist();
    return true;
  }

  /** Prefer two stored copies; otherwise atomically consume one stored and one installed. */
  public merge(partId: string): boolean {
    if (!this.canChangeGarage()) return false;
    const state = this.requireState();
    const result = resolveMerge(partId);
    const part = PARTS_BY_ID.get(partId);
    if (!result.success || !part) return false;
    const count = state.inventory.filter(id => id === partId).length;
    const useInstalled = count === 1 && state.installedParts[part.family] === partId;
    if (count < 2 && !useInstalled) return false;
    for (let i = 0; i < (useInstalled ? 1 : 2); i++) state.inventory.splice(state.inventory.indexOf(partId), 1);
    if (useInstalled) state.installedParts[part.family] = null;
    state.inventory.push(result.outputId);
    this.persist();
    return true;
  }

  public startRun(): RunSession | null {
    if (!this.canChangeGarage() || !this.foreground) return null;
    const stats = this.currentVehicleStats;
    const session = Object.freeze({ token: Object.freeze({ id: ++this.nextRunId }), stats, state: createRunState(stats) });
    this.activeRun = session;
    return session;
  }

  /** Scene owns the returned ephemeral state. Route foreground ticks here (seconds). */
  public advanceRun(token: RunToken, state: RunState, road: RoadDefinition, seconds: number): RunState {
    this.requireState();
    if (!this.activeRun || token !== this.activeRun.token) throw new Error('Unknown run token');
    if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError('Invalid delta');
    if (!this.foreground) return state;
    if (this.discardResumeDelta) { this.discardResumeDelta = false; return state; }
    return advanceSimulation(state, this.activeRun.stats, road, seconds);
  }

  public recordRunResult(token: RunToken, result: RunState): boolean {
    const state = this.requireState();
    const session = this.activeRun;
    if (!session || token !== session.token || this.resetting || this.persistence.status === 'blocked') return false;
    if (!isValidRunState(result, session.stats) || result.failureCause === null) return false;
    if (result.failureCause === 'out_of_gas' && result.fuel !== 0) return false;
    if (result.failureCause === 'overheated' && result.heat !== session.stats.maxHeat) return false;
    if (result.failureCause === 'breakdown' && result.durability !== 0) return false;
    const reward = calculateRunReward(result);
    if (!Number.isSafeInteger(state.scrap + reward)) return false;
    this.activeRun = null; // Consume eligibility BEFORE queuing any persistence.
    state.scrap += reward;
    state.bestDistance = Math.max(state.bestDistance, result.distance);
    this.persist();
    return true;
  }

  public setForegroundActive(active: boolean): void {
    if (active && !this.foreground && this.activeRun) this.discardResumeDelta = true;
    this.foreground = active;
  }

  public async flush(): Promise<void> { this.requireState(); await this.repository.flush(); }

  public retryPersistence(): Promise<void> {
    this.requireState();
    if (this.resetting) return Promise.reject(new Error('Reset in progress'));
    if (this.resetNeedsRetry) return this.reset();
    if (this.persistence.status === 'blocked') return Promise.reject(new Error('Explicit reset required'));
    return this.persist();
  }

  /** Reset immediately replaces live progress; commands are blocked until storage settles. */
  public async reset(): Promise<void> {
    this.requireState();
    if (this.resetting) throw new Error('Reset in progress');
    this.resetting = true;
    this.resetNeedsRetry = true;
    this.activeRun = null;
    this.state = createNewSave();
    this.snapshot = null;
    try {
      await this.track(this.repository.reset());
      this.resetNeedsRetry = false;
    } finally { this.resetting = false; }
  }

  private requireState(): SaveData {
    if (this.state === null) throw new Error('GameStateService not initialized');
    return this.state;
  }
  private canChangeGarage(): boolean {
    this.requireState();
    return !this.resetting && !this.resetNeedsRetry && this.persistence.status !== 'blocked' && this.activeRun === null;
  }
  private persist(): Promise<void> {
    this.snapshot = null;
    return this.track(this.repository.save(this.currentState));
  }
  private track(job: Promise<void>): Promise<void> {
    const revision = ++this.revision;
    this.persistence = Object.freeze({ status: 'pending', error: null });
    // Attach a rejection handler even when a synchronous action does not await its write.
    void job.then(() => {
      if (revision === this.revision) this.persistence = Object.freeze({ status: 'saved', error: null });
    }, (error: unknown) => {
      if (revision === this.revision) this.persistence = Object.freeze({ status: 'error', error: error instanceof Error ? error.message : String(error) });
    });
    return job;
  }
}
