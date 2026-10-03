# Architecture and Save Model

## Layers and composition

Phaser presentation lives in `src/game/`. Pure domain functions live in `src/domain/`; definitions in `src/data/`; progress/persistence in `src/services/`; shared types in `src/types/game.ts`. Domain and services must never import Phaser or game modules. Browser lifecycle is a narrow injected EventTarget bridge, independent of Phaser. Tools import the same production formulas.

`src/main.ts` constructs exactly one StorageAdapter, SaveRepository and GameStateService. It awaits initialization before constructing Phaser, passes the owner through `game.registry.get('gameState')`, registers lifecycle hooks once, and disposes hooks/game on HMR. HMR waits for the preceding owner's initialization and persistence drain before loading again. BootScene is technical diagnostics only; no gameplay scenes or art are included yet.

## State access and readiness

GameStateService is the sole mutable progress owner. `currentState` is a detached, recursively frozen SaveSnapshot (root, inventory and installed record). The snapshot is cached until a successful mutation; reading each frame does not repeatedly clone it. Existing snapshots remain unchanged after later commands. Vehicle stat snapshots are frozen. UI calls validated commands; it must never mutate saves, inventory or installed records.

`init()` shares one promise across overlapping and repeated calls. Ready state is explicit, not a definite-assignment assertion. Actions/read access before readiness throw. A read/recovery failure rejects init, leaves the service unready and permits a retry; no fresh state silently replaces a storage error. A new-save write failure instead leaves initialized progress available with persistence error status.

Invalid ready-state gameplay operations return false/null without mutation. Programming contract errors such as pre-init calls, invalid RNG/delta and unknown advanceRun tokens throw. During a run, garage actions are blocked. Unsupported-version progress is read-only until explicit reset. Reset failure also blocks commands until its storage operation is retried.

Example for future UI:

```ts
await state.init();
const view = state.currentState; // readonly, frozen; reuse until mutation
const installed = state.installPart('engine_t1', 'engine'); // explicit target
const persistence = state.persistenceStatus; // saved | pending | error | blocked
```

## Persistence contracts

StorageAdapter holds raw strings. get returns null only for absent data. Browser access, SecurityError, quota and native rejections propagate. No adapter or repository catch converts a failure into success/missing.

SaveRepository serializes load/recovery, captured saves and reset through one promise queue. Save serialization captures call-time values before waiting, validates semantics and rejects invalid/nonfinite data rather than letting JSON stringify coerce numbers to null. Failed jobs reject their callers but the queue continues, so a later valid write can succeed. One repository/owner per application is required.

GameStateService keeps live progress after a failed write. Its immutable persistenceStatus exposes saved, pending, error (with message), or blocked. A revision protects status from stale completion callbacks. Synchronous actions attach rejection handlers immediately; callers use `flush()` or `retryPersistence()` for explicit durability/error handling. A successful latest snapshot includes prior valid mutations and clears earlier error status.

`flush()` awaits jobs requested before the call; it does not reserve future mutations or guarantee process-close completion. It rejects when the latest requested job fails. Ordinary mutations are the primary persistence mechanism. Visibility-hidden and pagehide hooks pause runs and attempt a flush, catching/reporting failures. Pageshow restores foreground eligibility according to visibility. Listener disposal is idempotent. Async close-time work is best effort; browser/process termination may interrupt queued operations.

Reset is a state operation: invalidate the active token, immediately replace live progress with the canonical new save, block commands, then queue remove + fresh write behind older jobs. Old pending saves cannot resurrect prior progress. If remove/write fails, the live fresh state remains in error and commands stay blocked; retry repeats reset. The recovery backup is retained. Reset is not a transactional storage primitive: a process killed between remove and write may leave no primary key. The canonical next launch handles that as new; native/platform acceptance must test its own storage guarantees.

The asynchronous StorageAdapter remains suitable for a later native adapter without changing domain logic. Native durability, packaging, lifecycle events and process-loss acceptance still require platform work; an interface alone does not prove them.

## Save schema, decoding and migrations

The unchanged v1 schema is in `03_GAME_DATA_BIBLE.md`; `CURRENT_SAVE_VERSION` is defined in `src/types/game.ts`. `saveCodec.ts` constructs canonical data from unknown input. See the Data Bible for numeric limits, ownership salvage and raw backup policy. No prior released schema exists: v1 is the only supported version, and no fake v0 migration is provided. When v2 is introduced, add explicit migrations for every supported released older schema, followed by current semantic decoding. Never infer schema solely because a version is lower.

## Run ownership and completion

RunScene will own ephemeral RunState. It is not saved. `startRun()` returns a session token, frozen vehicle stats and starting state. Only one session may be active. Token identity is the exact frozen object reference issued by this owner; copying its numeric diagnostic ID does not create eligibility.

```ts
const session = state.startRun();
if (session) {
  let run = session.state; // future scene-owned
  run = state.advanceRun(session.token, run, road, deltaMs / 1000);
  if (run.failureCause !== null) state.recordRunResult(session.token, run);
}
```

Simulation accepts seconds, splits road/failure boundaries analytically, caps accepted foreground intervals to one second and never globally rounds positions. Hidden runs pause; the first resume tick is discarded. Completed or explicitly abandoned results must have finite bounded fields, matching maxDurability and consistent failure thresholds. The owner validates reward/currency bounds and closes eligibility synchronously before any save is queued. Duplicate, unknown, cloned and stale tokens cannot pay. Reset also invalidates eligibility. This is local lifecycle correctness, not anti-cheat or a persisted receipt ledger.

## Files and assets

- `src/services/save/saveCodec.ts`: canonical constructors, decoder and encoder.
- `src/services/save/SaveRepository.ts`: raw backup, ordered writes/reset/flush.
- `src/services/state/GameStateService.ts`: progress, commands, persistence status and run eligibility.
- `src/services/platform/BrowserLifecycle.ts`: visibility/page events and cleanup.
- `src/test/storage.ts`: deterministic test-only async storage fixture.
- `tsconfig.tools.json`: strict Node tools/config checking alongside the source config.
- `art/source/`: editable production art, excluded from bundling.
- `public/assets/`: Phaser runtime exports copied by Vite; load as assets/... relative to the app base.

## Multiple owners and release gates

Composition prevents duplicate owners within the page and coordinates HMR. Independent tabs/windows/processes remain uncoordinated and can overwrite each other's progress. Use one active instance for current internal VS1. Before public browser distribution, implement and browser-test a robust one-writer ownership/conflict policy (for example Web Locks with clear fallback behavior), rather than a race-prone localStorage pseudo-lock. Native source ownership must be decided when packaging; current android/ios ignore entries are temporary, not permission to omit release-owned source. See `12_SECURITY_AND_TRUST_MODEL.md` for authority/secrecy and future backend triggers.
