# Scrap Car Runner - Project Instructions

## 1. Project Identity
**Working Name:** Scrap Car Runner
**Core Fantasy:** Build a questionable machine from scrap, engineer it better, and see how far it survives.
**Role:** The player is an ENGINEER, not a driver. The car drives automatically; the player diagnoses and improves.

## 2. Development Philosophy
- **Real Game First:** Design the real game, data, and art contract before implementation.
- **No Prototypes:** Do not build disposable prototypes. Every implemented feature should be production-intent.
- **Small Scope:** Keep the initial scope small but robust. Build a vertical slice that can be expanded, not rewritten.
- **No Overengineering:** Do not build complex backend, multiplayer, or 3D physics architectures. Keep it simple and focused on the core loop.

## Approved idle design rule
The primary VS1 cycle is continuous auto-drive, fuel-limited automatic reset/refill/retry and physical checkpoints with Progress/Push or player-selected earlier-checkpoint Farm. Most automation should originate from a manual workflow the player first understands (acquisition, merging, sorting/movement); continuous driving/retry is baseline, while later automation unlocks remain open. Merge Board, Inventory and Equipped Parts are separate; only Equipped Parts affect active stats/installed visuals. Workbench capacity is finite and expandable through progression; exact geometry, capacity values and expansion balance/UX remain undecided (D01/D02). Current discrete-run code is a foundation requiring adaptation, not a competing design authority.

## Core equipment / road-region contract
Parts conceptually have Family + Type/Specialization + Tier + Tradeoffs + Compatibility (D01/D02/D03). Tier strengthens a specific type; type determines suitability. A higher-tier wrong type can perform worse than a lower-tier suitable type on a particular route. Roads/obstacles and milestone regions should change useful builds, not only scale numbers. Push and Farm builds may differ; Inventory supports useful alternatives. Only Equipped Parts affect vehicle performance/installed visuals.

Fuel depletion is the normal automatic attempt ending. Severe Engine/Radiator incompatibility can cause catastrophic overheating/explosion and checkpoint retry, never permanent equipment destruction. No mandatory global durability resource, per-part health bars, equipment degradation, rarity power systems, affixes, runes, skill trees or other RPG layers are approved. Catalogs, stats/formulas, region boundaries, merge interaction and detailed acquisition rules and preset systems remain unresolved. This core philosophy does not expand the VS1 production catalog or authorize gameplay, art, merge-board or acquisition design work.

## Core Scavenge / part-acquisition contract
Acquisition is random but directable through multiple Scavenge Sources: selected source controls eligible/weighted families and types; additional Scrap search investment improves higher-tier probability while preserving source identity. General Scavenge stays broad, relatively inexpensive and useful after specialized sources unlock; specialized sources primarily offer targeting, typically at greater Scrap cost, not guaranteed exact equipment or universally better loot. Sources can share parts and may unlock through regions/checkpoints without fixed mappings. Scrap remains the only approved acquisition currency.

Manual source/investment/timing choices precede later automation. Final source names/counts, unlocks, costs/multipliers, loot tables/weights/tier probabilities, investment UI/levels, pity/duplicate protection, first-clear interactions, reveal flow and Auto Scavenger settings/unlocks remain open. Source selection does not equip parts; core merge compatibility is recorded below; no runtime/schema/art/board/UI production or new currency is authorized by this documentation update.

## Core merge compatibility contract
Core merging requires two copies with the **same Family + same Type/Specialization + same Tier**, producing one **next-tier part of the same family and type**. Different families, types or tiers are invalid inputs; matching family and tier alone is insufficient. Type is persistent gameplay identity: no generic, random or hybrid output and no cross-type fusion/recipe graph.

Direct merging of equipped parts is currently disfavored / expected to require unequipping first, but final interaction behavior depends on Merge Board design. This is pending, not a locked equipped-input prohibition or mandatory unequip workflow. Merging must not unexpectedly modify the running vehicle. Detailed workshop interaction/movement/result-cell/full-space and Auto-Merge design remain unresolved (D02); normal merge outputs belong on the Workbench. Special transformation components are optional future only, outside core and not required for VS1. Existing generic Tier 3 rejection remains the baseline; this records design only.

## Merge Workshop structure contract
The Merge screen has **TOP: Merge Area** and **BOTTOM: Workbench / Merge Board**. The Workbench is persistent, finite active engineering space, expandable through progression. Inventory remains separate general long-term item/part storage, capable of future content beyond car parts; it is neither only spare car-part storage nor merely Workbench overflow. Equipped Parts remain the current Rustbucket build and the only installed contributions to stats/visuals.

Normal results remain on Workbench with temporary UX feedback; the Merge Area is not storage and no permanent Result slot is required. Capacity is active engineering capacity, distinct from Inventory storage capacity. Manual merges precede future Multi-Merge and later Auto-Merge, which preserve Workbench meaning. Exact visuals, Workbench capacity values/expansion balance, detailed transfer UX, result cell/popup, equipped merge workflow and automation details remain unresolved (D02/D05). Documentation only; no implementation or asset changes.

## 3. Vertical-Slice Philosophy (VS1)
- Must implement exactly ONE complete gameplay loop.
- Must use real game systems and production-intent assets.
- Must not include massive content bloat (e.g., limit to 1 chassis, 5 part families, 3 tiers).
- The foundation must be stable enough to support future expansion without major refactors.

## 4. Technical Direction
- **Engine:** Phaser 4 (v4.2.1+) — see `docs/10_TECHNOLOGY_DECISION.md` for rationale.
- **Language:** TypeScript (strict mode; locked version in package-lock.json)
- **Bundler:** Vite 8
- **Testing:** Vitest 5 (domain/logic only — no Phaser in tests)
- **Platform:** Browser-first (mobile portrait layout), local save via `localStorage`. Capacitor/Android will come much later.
- **Package manager:** npm

## 5. Art Philosophy
- **Style:** Pixel art, retro aesthetic, chunky pixels, strong silhouettes.
- **Tone:** Scrappy, mechanical, charming, satisfying. Not grimdark, not overly realistic.
- **No Placeholders:** Do not use temporary colored boxes if production art is specified. If an asset is missing, stop and create it.
- **Readability:** Prioritize readability at small sizes over historical hardware limits.

## 6. Scope Rules
- **No** backpack inventory tetris.
- **No** combat or RPG fantasy elements.
- **No** manual driving.
- **No** backend, ads, or monetization in VS1.
- **No** complex procedural generation yet.

## 7. AI/Codex Working Rules
- **Inspect First:** Always inspect existing code and data before proposing changes.
- **One Feature Per Prompt:** Do not combine multiple disparate features in one pass.
- **Preserve Behavior:** Do not perform unrelated refactors.
- **Follow the Docs:** All implementations must strictly adhere to these canonical documentation files.

## 8. Mobile-First Rule
- Design and implement UI primarily for portrait viewports: 360x640 and 390x844.
- Important interactions must be touch-friendly.
- Do not solve layout issues by shrinking text to illegible sizes.

## 9. Save Compatibility Rule
- The save model must be versioned from day one.
- Only serialize pure game state (JSON). Never serialize Phaser objects or view state.
- Keep the schema simple to allow for future migrations.

## 10. Foundation contracts
Use the Node range from package.json and npm run check before handoff. State is service-owned with frozen snapshots. Never swallow storage failures, cast JSON into SaveData, or grant rewards outside validated authoritative transitions (repeat checkpoint clear and one-time first clear in the approved target model). See 06_ARCHITECTURE_AND_SAVE_MODEL.md and 12_SECURITY_AND_TRUST_MODEL.md. Art sources: art/source/; runtime: public/assets/. Public browser release requires cross-tab one-writer protection; Android requires native source ownership and device acceptance.

## Inventory / capacity / Dismantle contract (owner-approved 2026-10-07)
Inventory is general long-term storage, currently Parts and extensible to later non-part categories, separate from Workbench engineering and the equipped Rustbucket. Base capacity is **150 item instances**, tunable later through playtesting: occupied slots, not weight/family/category limits. Parts do not stack; Scrap and future currencies use no item slots unless separately designed otherwise. Current organization supports Family / Type / Tier.

D02 §11 owns drag/drop direction, single authoritative location, atomic full-Inventory swaps, blocked normal Unequip-to-Inventory and manual Scavenge, Equipped-to-Workbench with room, Workbench merge independence, unavoidable-item Mail safety and deliberate Dismantle for small Scrap. Dismantle location/economics and detailed Inventory/Mail UX remain open. Future progression capacity rewards and optional paid expansion are directions only, never required now. Local-first architecture, v1 schema and implementation/asset/status boundaries remain unchanged.

## Manual Scavenge execution contract (owner-approved 2026-10-07)
D02 §12 owns image/card-oriented source selection, one Part per unit, baseline x1 and later progression x3→x5→x7, and adjustable per-use Scrap investment remembered until changed (global/per-source scope open). Selecting investment is free, never prepaid; unaffordable preferences stay selected. Source targets family/type pools; investment improves tier odds; batch count alone adds no quality.

Execution must recheck current authoritative source/batch unlocks, whole-batch Inventory capacity and full-cost Scrap affordability immediately before atomic commit. Failure consumes nothing, rolls/generates nothing and changes no Inventory items; success deducts full cost and commits every result directly into Inventory before reveal. No partial batch, automatic downgrade, deliberate Mail overflow or reveal-owned item creation. Concurrent checkpoint/reward changes are respected. Future Auto Scavenge must obey the same rules; permanent source upgrades are future-only if separately approved. No runtime/schema/save-version, art/UI production, numeric balance or status changes.
