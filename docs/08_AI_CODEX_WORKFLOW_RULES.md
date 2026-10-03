# AI/Codex Workflow Rules

When working on this project with an AI assistant, strictly follow these rules to maintain project integrity.

## 1. Inspect Before Editing
Always use file-reading tools to inspect existing code, interfaces, and state before proposing or writing modifications. Never assume the structure of a file.

## 2. One Feature Per Prompt
Focus on a single Phase or specific task from `07_VERTICAL_SLICE_BUILD_PLAN.md`. Do not attempt to build the Garage, Run simulation, and Save system in a single prompt.

## 3. No Placeholder Assets
Do not insert HTML colored boxes or missing image keys into the game if production art is specified. If an asset from `04_ART_DIRECTION_AND_ASSET_REGISTRY.md` is missing from the `public/assets/` folder, report it and wait for the asset to be created.

## 4. Preserve Working Behavior
Do not perform unrelated refactors. If tasked with fixing a bug in fuel calculation, do not rewrite the SaveRepository.

## 5. Adhere to the Docs
The `docs/` folder is the single source of truth. If a feature contradicts `01_MASTER_GAME_DESIGN.md` or `03_GAME_DATA_BIBLE.md`, do not implement it.

## 6. Standard Prompt Templates

**For Implementation:**
> "Review `docs/07_VERTICAL_SLICE_BUILD_PLAN.md`. We are on Phase [X]. Inspect the relevant files, then implement [Feature]. Follow the rules in `docs/08_AI_CODEX_WORKFLOW_RULES.md`."

**For Bugfixing:**
> "I am experiencing [Bug Description] in [Scene/File]. Inspect the code and propose a fix. Do not refactor unrelated systems."

**For Data/Balance Changes:**
> "Update `docs/03_GAME_DATA_BIBLE.md` to adjust [Stat] for [Part]. Then, apply this change to the static data implementation in `src/data/`."
