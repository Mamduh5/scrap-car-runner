# Scrap Car Runner

> **Working Title:** Scrap Car Runner  
> **Genre:** Idle Engineering / Auto-Driver / Progression  
> **Platform:** Browser (mobile portrait), Phaser 4 + TypeScript + Vite 8

Build a questionable machine from scrap parts, engineer it better, and see how far it survives.

---

## Quick Reference

| What | Where |
|---|---|
| Game design & core loop | [`docs/01_MASTER_GAME_DESIGN.md`](docs/01_MASTER_GAME_DESIGN.md) |
| Gameplay systems & formulas | [`docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md`](docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md) |
| All data schemas & part/road values | [`docs/03_GAME_DATA_BIBLE.md`](docs/03_GAME_DATA_BIBLE.md) |
| Art direction & asset registry | [`docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md`](docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md) |
| UI/UX & screen layouts | [`docs/05_UI_UX_AND_SCREEN_LAYOUTS.md`](docs/05_UI_UX_AND_SCREEN_LAYOUTS.md) |
| Architecture, save model & RunState | [`docs/06_ARCHITECTURE_AND_SAVE_MODEL.md`](docs/06_ARCHITECTURE_AND_SAVE_MODEL.md) |
| Implementation build plan (VS1) | [`docs/07_VERTICAL_SLICE_BUILD_PLAN.md`](docs/07_VERTICAL_SLICE_BUILD_PLAN.md) |
| AI/Codex workflow rules | [`docs/08_AI_CODEX_WORKFLOW_RULES.md`](docs/08_AI_CODEX_WORKFLOW_RULES.md) |
| Future expansion roadmap | [`docs/09_EXPANSION_ROADMAP.md`](docs/09_EXPANSION_ROADMAP.md) |
| Technology decision record | [`docs/10_TECHNOLOGY_DECISION.md`](docs/10_TECHNOLOGY_DECISION.md) |
| Balance simulation tool | [`tools/sim-check.js`](tools/sim-check.js) |
| Data integrity validator | [`tools/validate-data.ts`](tools/validate-data.ts) |

---

## Development Status

| Phase | Status |
|---|---|
| Game design documentation | ✅ Complete |
| Foundation audit & formula review | ✅ Complete |
| Technology decision | ✅ Complete (Phaser 4) |
| Project foundation (build, types, domain logic, tests) | ✅ Complete |
| Asset production | ⏳ Not started |
| VS1 implementation (Phase 3+) | ⏳ Not started |

---

## Core Loop

```
GET / SCAVENGE PARTS → MERGE → INSTALL / ENGINEER → RUN (auto-drive) → FAIL → DIAGNOSE → EARN → IMPROVE → GO FARTHER
```

---

## VS1 Scope (Do Not Expand)

- **1 chassis:** The Rustbucket (`chassis_rustbucket`)
- **5 part families:** engine, fuel, cooling, tires, suspension
- **3 tiers per family** (15 parts total)
- **1 road:** Scrapland Highway (`road_scrapland_highway`)
- **1 currency:** Scrap
- Local save via `localStorage`

---

## Getting Started

```bash
npm install        # Install all dependencies
npm run dev        # Start dev server at http://localhost:8080
npm run typecheck  # TypeScript check (no emit)
npm test           # Run domain unit tests (Vitest)
npm run build      # Production build to dist/
npm run simulate   # Balance simulator (node tools/sim-check.js)
npm run validate:data  # Data integrity checks (node --import tsx/esm tools/validate-data.ts)
```

---

## For AI Agents Working in This Repository

**Read before editing anything:**

1. Read [`docs/08_AI_CODEX_WORKFLOW_RULES.md`](docs/08_AI_CODEX_WORKFLOW_RULES.md) — workflow rules.
2. Read [`docs/07_VERTICAL_SLICE_BUILD_PLAN.md`](docs/07_VERTICAL_SLICE_BUILD_PLAN.md) — find the current phase.
3. Read the relevant canonical doc for the feature you are implementing.

**Critical rules:**

- Do **not** substitute missing art with colored boxes. Report the missing asset and stop.
- Do **not** expand VS1 scope silently. No new part families, currencies, enemies, or systems without explicit instruction.
- Do **not** add a backend, ads, multiplayer, or Capacitor during VS1.
- Do **not** implement features from `09_EXPANSION_ROADMAP.md` during VS1.
- Preserve all documented IDs (`chassis_rustbucket`, `road_scrapland_highway`, part IDs like `engine_t1`). IDs are stored in save data.
- Keep all simulation logic in `src/domain/` (pure TypeScript, no Phaser). Phaser scenes live in `src/game/`.
- **Boundary rule:** `src/domain/` and `src/services/` must never import from `src/game/`.
- Follow the save schema exactly as defined in `docs/03_GAME_DATA_BIBLE.md`. Increment `CURRENT_SAVE_VERSION` (in `src/types/game.ts`) if the schema changes and write a migration function in `SaveRepository.ts`.
- After implementation changes, run `npm run typecheck && npm test && npm run validate:data` and report the output.

---

## Tech Stack

| | |
|---|---|
| Engine | Phaser 4 |
| Language | TypeScript 5.8.x |
| Bundler | Vite 8 |
| Testing | Vitest 5 |
| Package manager | npm |
| Persistence | `localStorage` (via `StorageAdapter`) |
| Target viewport | 360×640 portrait (primary) |
| Scaling | Phaser Scale.FIT + CENTER_BOTH |
| Pixel art | `pixelArt: true` (nearest-neighbor, roundPixels, no antialias) |


Build a questionable machine from scrap parts, engineer it better, and see how far it survives.

---

## Quick Reference

| What | Where |
|---|---|
| Game design & core loop | [`docs/01_MASTER_GAME_DESIGN.md`](docs/01_MASTER_GAME_DESIGN.md) |
| Gameplay systems & formulas | [`docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md`](docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md) |
| All data schemas & part/road values | [`docs/03_GAME_DATA_BIBLE.md`](docs/03_GAME_DATA_BIBLE.md) |
| Art direction & asset registry | [`docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md`](docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md) |
| UI/UX & screen layouts | [`docs/05_UI_UX_AND_SCREEN_LAYOUTS.md`](docs/05_UI_UX_AND_SCREEN_LAYOUTS.md) |
| Architecture, save model & RunState | [`docs/06_ARCHITECTURE_AND_SAVE_MODEL.md`](docs/06_ARCHITECTURE_AND_SAVE_MODEL.md) |
| Implementation build plan (VS1) | [`docs/07_VERTICAL_SLICE_BUILD_PLAN.md`](docs/07_VERTICAL_SLICE_BUILD_PLAN.md) |
| AI/Codex workflow rules | [`docs/08_AI_CODEX_WORKFLOW_RULES.md`](docs/08_AI_CODEX_WORKFLOW_RULES.md) |
| Future expansion roadmap | [`docs/09_EXPANSION_ROADMAP.md`](docs/09_EXPANSION_ROADMAP.md) |
| Balance simulation tool | [`tools/sim-check.js`](tools/sim-check.js) |

---

## Development Status

| Phase | Status |
|---|---|
| Game design documentation | ✅ Complete |
| Foundation audit & formula review | ✅ Complete |
| Asset production | ⏳ Not started |
| VS1 implementation | ⏳ Not started |

---

## Core Loop

```
GET / SCAVENGE PARTS → MERGE → INSTALL / ENGINEER → RUN (auto-drive) → FAIL → DIAGNOSE → EARN → IMPROVE → GO FARTHER
```

---

## VS1 Scope (Do Not Expand)

- **1 chassis:** The Rustbucket (`chassis_rustbucket`)
- **5 part families:** engine, fuel, cooling, tires, suspension
- **3 tiers per family** (15 parts total)
- **1 road:** Scrapland Highway (`road_scrapland_highway`)
- **1 currency:** Scrap
- Local save via `localStorage`

---

## For AI Agents Working in This Repository

**Read before editing anything:**

1. Read [`docs/08_AI_CODEX_WORKFLOW_RULES.md`](docs/08_AI_CODEX_WORKFLOW_RULES.md) — workflow rules.
2. Read [`docs/07_VERTICAL_SLICE_BUILD_PLAN.md`](docs/07_VERTICAL_SLICE_BUILD_PLAN.md) — find the current phase.
3. Read the relevant canonical doc for the feature you are implementing.

**Critical rules:**

- Do **not** substitute missing art with colored boxes. Report the missing asset and stop.
- Do **not** expand VS1 scope silently. No new part families, currencies, enemies, or systems without explicit instruction.
- Do **not** add a backend, ads, multiplayer, or Capacitor during VS1.
- Do **not** implement features from `09_EXPANSION_ROADMAP.md` during VS1.
- Preserve all documented IDs (`chassis_rustbucket`, `road_scrapland_highway`, part IDs like `engine_t1`).
- Keep all simulation logic (formulas) in pure TypeScript functions (`src/logic/`), separate from Phaser scenes.
- Follow the save schema exactly as defined in `03_GAME_DATA_BIBLE.md`. Increment `CURRENT_SAVE_VERSION` if the schema changes and write a migration function.
- After implementation, run `node tools/sim-check.js` and report the output.

---

## Running the Balance Simulator

No game implementation is needed to use this tool:

```bash
node tools/sim-check.js
```

See [`tools/sim-check.js`](tools/sim-check.js) for configuration options.

---

## Tech Stack

| | |
|---|---|
| Engine | Phaser 3 |
| Language | TypeScript (strict) |
| Bundler | Vite |
| Persistence | `localStorage` |
| Target viewport | 360×640 portrait (primary) |
