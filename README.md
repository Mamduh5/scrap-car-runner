# Scrap Car Runner

A local-first junkyard engineering auto-driver. Build, diagnose and improve the car; the player engineers rather than drives. The repository currently contains the hardened foundation, static VS1 data and a technical BootScene. Garage, RunScene, result UI and production art are not implemented.

## Setup

Use the Node range in [package.json](package.json): `^22.12.0 || ^24.0.0 || >=26.0.0`, with npm 10+. This pass was tested on Node 22.23.1 / npm 10.9.8. Use the committed lockfile:

```sh
npm ci
npm run check
npm run dev
```

Development: port 8080. Preview: `npm run preview`, port 8081. Build output: `dist/`.

## Validation

| Command | Purpose |
|---|---|
| `npm run typecheck` | Strict source and source-test checking |
| `npm run typecheck:tools` | Tools, their tests and Vite/Vitest configs with Node types |
| `npm run test` | Domain, state, save/storage, lifecycle and tooling regression tests |
| `npm run validate:data` | Static numeric, range and reference invariants |
| `npm run simulate` | Production-formula balance scenarios; provisional tuning |
| `npm run build` | Source typecheck and Vite production bundle |
| `npm run check` | All six gates in that order; stops on failure |

These gates do not replace browser, touch, Android-device or lifecycle acceptance. Production source maps are disabled by default. For internal diagnostics only, set `INTERNAL_SOURCEMAPS=1` before building; do not publish that diagnostic artifact accidentally.

## Architecture

- `src/types/`: shared domain/save types; no Phaser.
- `src/data/`: definitions and stable IDs (one chassis, five families, three tiers, one road).
- `src/domain/`: pure calculations, merge resolution, simulation and rewards.
- `src/services/`: authoritative progress, semantic decoding, ordered persistence and browser lifecycle bridge.
- `src/game/`: Phaser configuration and presentation.
- `src/main.ts`: one state owner, initialized before Phaser boots; HMR cleanup drains the previous owner's persistence.
- `tools/`: production simulator and testable data-integrity gate.

Read cached frozen snapshots from `GameStateService.currentState`; change progress only through commands. Read `persistenceStatus` to expose unsaved progress in future UI. A scene owns ephemeral run state and uses `startRun`, `advanceRun` and `recordRunResult` with the original session token.

Assets: editable sources in `art/source/`; Phaser runtime exports in `public/assets/`, served as `assets/...` and copied by Vite. No placeholder art is included.

## Canonical documents

| Document | Responsibility |
|---|---|
| [Project instructions](docs/00_PROJECT_INSTRUCTIONS.md) | Identity and scope constraints |
| [Master design](docs/01_MASTER_GAME_DESIGN.md) | Product vision |
| [Gameplay](docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md) | Rules, formulas and playtest baseline |
| [Data Bible](docs/03_GAME_DATA_BIBLE.md) | Content, schema and recovery policy |
| [Art registry](docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md) | Required production assets |
| [UI/UX](docs/05_UI_UX_AND_SCREEN_LAYOUTS.md) | Future presentation contracts |
| [Architecture/save](docs/06_ARCHITECTURE_AND_SAVE_MODEL.md) | Ownership, initialization and persistence |
| [Build plan](docs/07_VERTICAL_SLICE_BUILD_PLAN.md) | Future phase sequence |
| [Workflow](docs/08_AI_CODEX_WORKFLOW_RULES.md) | Working constraints |
| [Expansion roadmap](docs/09_EXPANSION_ROADMAP.md) | Deferred product systems |
| [Technology](docs/10_TECHNOLOGY_DECISION.md) | Locked stack and release gates |
| [Asset workflow](docs/11_ASSET_PRODUCTION_WORKFLOW.md) | Editable/runtime asset pipeline |
| [Security/trust](docs/12_SECURITY_AND_TRUST_MODEL.md) | Local authority and future trust changes |
| [Implementation and project management](docs/14_IMPLEMENTATION_AND_PROJECT_MANAGEMENT_PLAN.md) | Implementation sequencing, milestones, backlog and project-management workflow |

## Current limits

No backend, accounts, cloud save, ads, purchases, automation, offline rewards or native wrapper. Saves are user-controlled, not anti-cheat. Active foreground runs pause while hidden and are lost if the process dies; ordinary completed mutations persist immediately through the queue. Recovery retains one bounded latest raw backup. Multiple tabs/processes are not coordinated: one active owner is required until a public-browser one-writer release gate is implemented. Native source ownership must be decided before adding Android (the current ignore rules are not a native release policy).
