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
Use the Node range from package.json and npm run check before handoff. State is service-owned with frozen snapshots. Never swallow storage failures, cast JSON into SaveData, or grant rewards outside run-session completion. See 06_ARCHITECTURE_AND_SAVE_MODEL.md and 12_SECURITY_AND_TRUST_MODEL.md. Art sources: art/source/; runtime: public/assets/. Public browser release requires cross-tab one-writer protection; Android requires native source ownership and device acceptance.
