# AI/Codex Workflow Rules

When working on this project with an AI assistant, strictly follow these rules to maintain project integrity.

## 1. Inspect Before Editing
Always use file-reading tools to inspect existing code, interfaces, and state before proposing or writing modifications. Never assume the structure of a file.

## 2. One Feature Per Prompt
Execute one coherent backlog task from `14_IMPLEMENTATION_AND_PROJECT_MANAGEMENT_PLAN.md`; D07 supplies supporting VS1 integration context. Do not attempt to build the Garage, Run simulation, and Save system in a single prompt.

## 3. No Placeholder Assets
Do not insert HTML colored boxes or missing image keys into the game if production art is specified. If a required asset from `src/game/assets/assetRegistry.ts` is missing from the `public/assets/` folder, report it and wait for the asset to be created.

## 4. Preserve Working Behavior
Do not perform unrelated refactors. If tasked with fixing a bug in fuel calculation, do not rewrite the SaveRepository.

## 5. Adhere to the Docs
Use D14’s canonical documentation map: D00/D01 own identity; D02/D03/D06 own gameplay/data/save ownership; visual and audio registries own exact registered scope; D04/D13 own art/audio direction; typography.ts owns semantic font roles; D14 owns execution. If a feature contradicts `01_MASTER_GAME_DESIGN.md` or `03_GAME_DATA_BIBLE.md`, do not implement it.

## 6. Standard Prompt Templates

**For Implementation:**
> "Review `docs/14_IMPLEMENTATION_AND_PROJECT_MANAGEMENT_PLAN.md`. Execute only [Task ID]. Read its owning contracts and relevant current implementation, preserve ownership, validate its acceptance criteria and update D14 honestly. Follow `docs/08_AI_CODEX_WORKFLOW_RULES.md`."

**For Bugfixing:**
> "I am experiencing [Bug Description] in [Scene/File]. Inspect the code and propose a fix. Do not refactor unrelated systems."

**For Data/Balance Changes:**
> "Update `docs/03_GAME_DATA_BIBLE.md` to adjust [Stat] for [Part]. Then, apply this change to the static data implementation in `src/data/`."

## 7. Evidence-based change control

Follow D14 §30: show direct implementation/validation evidence, identify the affected canonical decision, choose the smallest correction, update the owning source and affected contracts, implement within authorized scope, then validate/report. Correcting a demonstrated problem requires no unrelated redesign. Preference alone is insufficient. Preserve product identity and scope; mark unresolved product/economy/player-behavior choices `OWNER DECISION REQUIRED` and keep dependent tasks not READY until resolved. Technical/preparation success cannot replace visual, audio, playtest or device approval.
