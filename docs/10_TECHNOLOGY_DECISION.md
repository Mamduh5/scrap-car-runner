# Technology Decision Record

**Date:** 2026-10-02  
**Status:** Active  
**Applies to:** Scrap Car Runner VS1 and all subsequent phases

---

## Context

This record documents the technology evaluation performed before implementing any gameplay or art. All decisions were made after reviewing the existing design documentation and verifying current package versions.

**Key external fact discovered:** Phaser 4 launched April 2026. The npm `phaser` package now resolves to Phaser 4. The project had specified "Phaser 3" but had no installed code, so the decision was revisited before any implementation began.

---

## Decisions

### Engine / Renderer — UPGRADE: Phaser 3 → Phaser 4

| | |
|---|---|
| **Previous proposal** | Phaser 3 (latest stable: 3.90.0, end-of-development) |
| **Chosen** | Phaser 4 (v4.2.1, current stable as of 2026-10-02) |
| **Reason** | Phaser 4 launched April 2026 and is the actively maintained branch. It offers improved mobile WebGL performance (up to 16× gains on mobile reported), a cleaner render node architecture, the same `pixelArt: true` config, the same TypeScript + Vite workflow, and official support for Capacitor. The npm `phaser` package already resolves to Phaser 4. Using Phaser 3.90.0 would require pinning a deprecated end-of-life branch. Phaser 4 migration from Phaser 3 is minimal for a project starting from scratch (no custom WebGL pipelines or complex FX). |
| **Tradeoff** | Phaser 4 is newer; some community tutorials still reference Phaser 3. The render node system is different from the Phaser 3 WebGL pipeline, but this game does not use custom shaders. |
| **Confidence** | High |

### Language — KEEP: TypeScript

| | |
|---|---|
| **Chosen** | TypeScript 5.8.x (resolved by npm from `"typescript": "^5.8.3"`) |
| **Reason** | TypeScript provides type safety for the data-driven part/stats/save model. The `PartFamily` union, `InstalledParts` record, and `RunState` types prevent entire classes of save-corruption bugs. TypeScript 7.0 (Go-based compiler, released July 2026) exists but is too new — ecosystem compatibility with Phaser 4 types is unverified. TypeScript 5.8 is current LTS-equivalent with full Phaser 4 type support. |
| **Note** | TypeScript 6 and 7 may be evaluated after VS1 when the ecosystem stabilises. |
| **Confidence** | High |

### Build Tool — KEEP: Vite (upgraded to v8)

| | |
|---|---|
| **Chosen** | Vite 8 (v8.3.2 current stable) |
| **Reason** | Vite remains the correct choice: fast HMR, excellent ESM support, straightforward static build output compatible with both browser hosting and Capacitor. The `manualChunks` option separates Phaser from game code, improving cache utilisation. No alternative provides meaningful improvement for this project. |
| **Confidence** | High |

### Package Manager — npm

| | |
|---|---|
| **Chosen** | npm (v10.9.8, already installed) |
| **Reason** | npm is available, works, and creates a standard `package-lock.json`. pnpm would also work but adds a setup step on CI and Capacitor build environments. For a solo developer, npm is sufficient. |
| **Confidence** | High |

### Save Technology — KEEP: localStorage (via abstracted adapter)

| | |
|---|---|
| **Chosen** | `localStorage` via `StorageAdapter` interface |
| **Reason** | Expected save data size for VS1 is well under 10 KB (15 part IDs + 5 slot values + scrap + distance = trivial). localStorage is synchronous (no async complexity), universally supported, and works identically in Capacitor WebViews. The `StorageAdapter` interface allows replacing it with Capacitor Preferences or IndexedDB later without touching game logic. No reason to use IndexedDB at this scale. |
| **Note** | If future automation systems create very large inventories, consider IndexedDB at that point. |
| **Confidence** | High |

### Testing — Vitest (v5.0.3)

| | |
|---|---|
| **Chosen** | Vitest 5 for pure domain/logic unit tests |
| **Reason** | Vitest integrates natively with Vite (same config chain), runs in Node without browser context (correct for pure domain logic), and is the standard testing tool for this stack. Scope is explicitly limited to `domain/`, `services/`, and `data/` — Phaser scenes are not unit-tested. No E2E tooling (Playwright) is added at this phase; the ROI is low before there is a rendered UI. |
| **Confidence** | High |

### Android Strategy — Capacitor (deferred, not added yet)

| | |
|---|---|
| **Chosen** | Capacitor 8 (to be added when Android packaging is needed) |
| **Reason** | Capacitor is the correct choice for packaging a Phaser/TypeScript web game as an Android APK. It treats the game as a hosted web app in a WebView, requiring no native code rewrite. Capacitor 8 supports Android 15/16 and current Android Studio. It is **not added to the project yet** — no native project should be committed before VS1 gameplay is complete. The `StorageAdapter` abstraction ensures no code change will be needed when Capacitor is added. |
| **Note** | `android/` and `ios/` directories are excluded in `.gitignore`. |
| **Confidence** | High |

### Rendering / Scaling Strategy — Fixed logical 360×640 + Scale.FIT

| | |
|---|---|
| **Chosen** | Fixed 360×640 portrait canvas, Phaser Scale.FIT + CENTER_BOTH |
| **Reason** | The game is portrait-only and pixel art. A fixed logical resolution means all coordinates, UI positions, and art sizes are authored at one resolution. Scale.FIT scales the canvas proportionally to fit any device screen with black bars on wider screens (letterboxing). This is the correct approach for a pixel-art game with a fixed art canvas: no need for responsive world coordinates or adaptive layouts. |
| **Canvas CSS** | `image-rendering: pixelated` is set in HTML to prevent any browser-level interpolation. |
| **Confidence** | High |

---

## Rejected Alternatives

### PixiJS + custom game framework
Considered briefly. PixiJS is an excellent renderer but requires building scene management, input handling, asset loading, audio, and game loop infrastructure from scratch. For a solo developer, this adds weeks of framework work with no gameplay benefit. Phaser 4 provides all of this out of the box.

### Godot
Godot 4.x is excellent for desktop/mobile games. Rejected because:
1. GDScript and C# are not TypeScript — a rewrite from scratch.
2. No standard browser deployment path comparable to Vite.
3. The Capacitor pattern does not apply.
4. The existing documentation is TypeScript-centric.

### Phaser 3.90.0 (pinned)
The cleanest "safe" option given the docs said "Phaser 3." Rejected because Phaser 3 is end-of-development. Starting a new project on an EOL branch creates maintenance debt from day one.

### React / HTML-overlay UI
No reason to add React. The game UI lives inside the Phaser canvas using Phaser's own text/graphics primitives. HTML overlays are complex to synchronize with the canvas and create z-index headaches. Phaser 4's text and container objects are sufficient for VS1.

---

## Conditions for Revisiting

| Condition | Response |
|---|---|
| Phaser 4 has a breaking bug in pixel art rendering on Android WebView | Evaluate PixiJS or downgrade to Phaser 3.90.0 |
| Save data grows to > 1 MB due to automation systems | Evaluate IndexedDB via abstracted adapter |
| TypeScript 7 ecosystem matures and Phaser 4 type definitions are verified | Upgrade compiler |
| A second platform target (e.g. Steam/Desktop) requires different packaging | Evaluate Electron or Tauri at that point |

---

## Package Versions (Resolved at install time)

Exact versions are pinned in `package-lock.json`. The versions above are targets; the lockfile is the source of truth.
