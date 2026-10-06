# Architecture and Save Model

## Approved continuous simulation and local rendering (2026-10-06)
Authoritative game/world simulation is independent of visible road rendering and scene navigation. Domain/services track checkpoint progression/unlocks, selected Progress/Push or Farm target, fuel/attempt state, equipped vehicle stats and rewards/first-clear eligibility. The continuous road is ongoing idle production/progression represented by the Rustbucket.

Fuel reaching zero stops the attempt; reset/refill/retry follows its selected/current checkpoint route automatically. A target that cannot be completed likewise retries automatically. No player launch, mandatory result dismissal or Garage return per attempt. Repeat successes grant normal Scrap; first clear grants its bonus once. Preserve validated state ownership, idempotent reward transitions, numeric safety and persistence error visibility while adapting the current discrete-session API. Do not merely wire repeated old distance/minimum completion payouts into a new scene.

Phaser retains/renders only content around the current visible region. Far-behind road content despawns/recycles; nearby/current content renders; incoming nearby content activates as needed; far-future content is not rendered yet. Removing passed graphics never removes checkpoint, reward or progression state. No complicated streaming implementation is chosen here.

Continuous attempts/repeats must be representable mathematically/statefully without simulating every visual frame. This supports later non-visible/offline calculation. Rendering is never the authoritative clock or reward owner. Exact offline formula/cap and background progression policy remain open; current hidden-tab pausing does not grant catch-up and is an existing limitation, not a final offline model.

## Part state and future persistence adaptation
Track Merge Board, Inventory and Equipped Parts distinctly. Only equipped entries plus chassis base produce vehicle stats and installed visuals. A merge cannot implicitly consume/change equipment; explicit equip/unequip must conserve copies across locations. Board geometry/capacity/expansion, Inventory capacity and move/equip UX remain TBD. Applying an explicit equipped change during an attempt needs a resolved timing/safety policy; no implementation is chosen here.

The unchanged v1 save has Inventory and installedParts but no board/checkpoint/intent/first-clear fields. Future authorized adaptation must decide the schema and explicit supported-v1 migration, preserve owned parts/currency, prevent duplicate first-clear/repeat settlement and retain recovery/reset/one-writer safeguards. Do not add fields or bump the version in this documentation pass. Persistence scope for attempt progress/process loss remains an implementation decision; no guaranteed active-attempt recovery is claimed.

## Equipment / road-region simulation contract (pending implementation)
Design-level part identity includes Family + Type/Specialization + Tier, plus tradeoff and compatibility metadata (D03). Slot-family compatibility validates where a part can be equipped; Engine/Radiator performance compatibility is a separate interaction, not automatically an equip prohibition. Evaluate authoritative effective performance against selected route surfaces/obstacles and other equipped parts; tier strength is within type, not universal dominance. Exact metadata, formulas and application timing remain open; scenes must not become compatibility/terrain formula owners.

Road Region / World Region groups multiple checkpoints. Milestones may change terrain grammar, obstacle families, presentation, useful specializations and later acquisition opportunities. Keep semantic region/checkpoint/condition identity independent of local visible tiles/props; reuse authored pieces without unique scenery per checkpoint. Region boundaries/names/counts, obstacle schemas and unlock rules remain unresolved; no streaming subsystem or production table is prescribed.

Fuel depletion is the normal attempt ending. Severe equipped Engine/Radiator incompatibility may cause critical heat and catastrophic failure/explosion before the target, then automatic checkpoint retry. Failure must preserve owned/equipped parts, selected intent and progression/reward safeguards; it cannot delete parts or replay first-clear bonuses. This adds no mandatory global durability resource, per-family health/instant-fail system or equipment degradation. Current durability/breakdown code below is a legacy snapshot requiring review, not target authority.

Future save/data adaptation must conserve alternative specialized parts and retain existing known IDs through explicit supported migrations. Do not implement a type field, runtime/save version bump, arbitrary conversion of unlike types, preset system or auto-swap here. Core merge matching/type-preserving results are approved and cross-type fusion is excluded; optional future transformation rules, exact source catalog/cost/drop/targeting-control details, exact capacities, compatibility/heat/explosion/terrain/farming formulas and region/checkpoint requirements remain open. Current five-family/three-tier definitions and v1 recovery semantics remain unchanged in this design task.

## Scavenge source / search-investment architecture direction
Future authoritative acquisition represents source eligibility/progression availability, Scrap cost, allowed/weighted family/type pools and tier probability rules, plus additional investment cost and tier modification (D03). Keep the axes distinct: source establishes possible/likely kinds of equipment; investment changes tier odds without silently switching source identity. Sources may share definitions; General remains available/relevant and higher-tier scaling does not require duplicate sources. Randomness remains, normally without exact equipment guarantees.

Domain/services own validated acquisition and Scrap/ownership transitions; UI communicates available sources/costs/pool tendencies/investment/odds without owning drop formulas or mutating saves. Preserve existing validation, copy conservation and visible persistence-failure safeguards while adapting the single generic random-T1 command. Region/checkpoint eligibility is authoritative state, independent of graphics. Final source catalog, costs/weights/probabilities, unlocks/scaling, first-clear interactions, pity/duplicate rules and reveal flow remain unresolved.

Manual source/investment/timing choices come before later automation; no Auto Scavenger scheduler, configuration, spending-limit policy or unlock is implemented/locked here. Scrap is the only approved acquisition currency. Persistence of selection/investment/unlock data and explicit supported migrations are future implementation decisions; no runtime schema, save version or production data changes occur in this documentation update. Core matching is approved in D02; board design and equipped-input interaction remain open.

## Core merge authority (design only)
Core merging requires two copies with the **same Family + same Type/Specialization + same Tier**, producing one **next-tier part of the same family and type**. Different families, types or tiers are invalid inputs; matching family and tier alone is insufficient. Type is persistent gameplay identity: no generic, random or hybrid output and no cross-type fusion/recipe graph.

Future domain/service validation must preserve type identity and reject invalid inputs without mutation; scenes do not invent outputs or fusion recipes. Exact encoding, location eligibility, output destination and migrations remain future implementation work. Direct merging of equipped parts is currently disfavored / expected to require unequipping first, but final interaction behavior depends on Merge Board design. This is pending, not a locked equipped-input prohibition or mandatory unequip workflow. Merging must not unexpectedly modify the running vehicle.

Merge Board geometry (grid/non-grid, shape, dimensions), capacity/slot count, expansion, variable-size parts, spatial structure, interaction gesture/workflow, result placement, full-board handling and Inventory transfers remain unresolved. Direct equipped-part merging and whether unequip is required await board design; equipment application timing remains open. Future max-tier handling beyond the existing generic VS1 Tier 3 rejection, special transformation-component rules/future type transformation, merge automation and Auto Merge targeting/configuration remain open.

Special transformation components are an **optional future extension**, outside core merging and not required for VS1 or initial board design. Engine + special modification component → modified/specialized Engine is conceptual only; no component catalog, recipes, transformation rules, acquisition, balance, UI or unlocks are defined. No runtime or save schema changes are authorized.

## Existing foundation contracts — implementation snapshot
The sections below describe unchanged runtime/storage behavior. Existing discrete session ownership, terminal settlement and foreground stepping are not instructions for the approved continuous integration. General layering, frozen snapshots, serialized writes, salvage, visible failures and release safeguards remain valid.

## Layers and composition

Phaser presentation lives in `src/game/`. Pure domain functions live in `src/domain/`; definitions in `src/data/`; progress/persistence in `src/services/`; shared types in `src/types/game.ts`. Domain and services must never import Phaser or game modules. Browser lifecycle is a narrow injected EventTarget bridge, independent of Phaser. Tools import the same production formulas.

`src/main.ts` constructs exactly one StorageAdapter, SaveRepository and GameStateService. It awaits initialization before constructing Phaser, passes the owner through `game.registry.get('gameState')`, registers lifecycle hooks once, and disposes hooks/game on HMR. HMR waits for the preceding owner's initialization and persistence drain before loading again. BootScene is technical diagnostics only; no gameplay scenes or art are included yet.

## State access and readiness

GameStateService is the sole mutable progress owner. `currentState` is a detached, recursively frozen SaveSnapshot (root, inventory and installed record). The snapshot is cached until a successful mutation; reading each frame does not repeatedly clone it. Existing snapshots remain unchanged after later commands. Vehicle stat snapshots are frozen. UI calls validated commands; it must never mutate saves, inventory or installed records.

`init()` shares one promise across overlapping and repeated calls. Ready state is explicit, not a definite-assignment assertion. Actions/read access before readiness throw. A read/recovery failure rejects init, leaves the service unready and permits a retry; no fresh state silently replaces a storage error. A new-save write failure instead leaves initialized progress available with persistence error status.

Invalid ready-state gameplay operations return false/null without mutation. Programming contract errors such as pre-init calls, invalid RNG/delta and unknown advanceRun tokens throw. Current implementation blocks garage actions during an active run; this must be reconciled with continuous engineering and must not become an indefinite product restriction. Unsupported-version progress is read-only until explicit reset. Reset failure also blocks commands until its storage operation is retried.

Existing command example (not a complete continuous integration contract):

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

## Existing discrete-run ownership and completion (requires adaptation)

The existing discrete-run contract assigns ephemeral RunState to the scene. It is not saved. `startRun()` returns a session token, frozen vehicle stats and starting state. Only one session may be active. Token identity is the exact frozen object reference issued by this owner; copying its numeric diagnostic ID does not create eligibility.

```ts
const session = state.startRun();
if (session) {
  let run = session.state; // existing discrete-run contract
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
