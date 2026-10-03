# Technology Decision

## Current repository stack

Retain the existing Phaser/TypeScript/Vite architecture. This hardening pass corrects contracts rather than changing engine or introducing a state framework.

| Component | Locked/tested version | Role |
|---|---|---|
| Phaser | 4.2.1 | Canvas rendering and scenes |
| TypeScript | 5.9.3 | Strict source and tooling checks |
| Vite | 8.3.2 | Dev server and production bundler |
| Vitest / coverage-v8 | 5.0.3 | Node regression tests |
| tsx | 4.23.15 | Run TypeScript tools |
| Node / npm in this pass | 22.23.1 / 10.9.8 | Verified local environment |
| @types/node | 22.x | Tool/config types aligned to the tested Node major |

package-lock.json is authoritative for exact dependency resolution. package.json is authoritative for the supported Node range: `^22.12.0 || ^24.0.0 || >=26.0.0`. This matches the stricter locked Vitest contract and the Vite requirement; Node 20 and early Node 22 are not supported by this repository. Use npm ci for reproducible setup. Other allowed Node majors have not been exercised by this pass.

## Type safety and validation

Keep the strict source options. Separate tsconfig.tools.json checks tools and Vite/Vitest configs with Node types without weakening the browser source config. skipLibCheck remains enabled because Phaser 4.2.1's declarations have upstream errors under full library checking; it does not skip checking our source/tests. Do not claim that TypeScript validates untrusted JSON: saveCodec performs runtime semantic decoding.

npm run check combines source checking, tooling checking, regression tests, data integrity, production simulation and build. Automated checks are separate from rendered browser/touch/device acceptance. No dependency upgrade was needed to solve this foundation task; Node typings are the only dependency addition.

## Persistence and platform

Browser localStorage remains sufficient for current local-only VS1, behind an asynchronous raw StorageAdapter. Storage can be unavailable, reject or run out of quota. Inventory is unbounded, so do not assume a permanent sub-10KB save limit. The repository serializes writes and exposes failures. Native storage durability and WebView lifecycle behavior must be verified when Android is actually introduced.

No Capacitor, native project, ads, purchases, cloud service or backend is added. The current android/ios ignore rules must be revisited before native packaging: explicitly own source/config in version control and ignore generated outputs selectively. The platform boundary supports later adapters; it does not remove native integration/testing work.

## Assets and source maps

Editable art belongs in art/source/. Runtime PNGs/atlases belong in public/assets/, served as assets/... and copied by Vite. No new assets in this pass. Actual art validation begins with asset production, before presentation depending on that art.

Production source maps default off. Set INTERNAL_SOURCEMAPS=1 only for an internal diagnostic build; that build emits maps and must be treated accordingly. Development remains debuggable. Source-map policy reduces accidental diagnostic publication; it is not a secret-protection or anti-cheat boundary. Bundled client code is public regardless.

## Revisit when evidence requires it

- Rendering incompatibility demonstrated on target devices: investigate Phaser configuration/upstream fixes before considering an engine change.
- Public browser distribution: enforce and test one-writer ownership across tabs.
- Android packaging: choose native source ownership, adapter and lifecycle hooks; verify process death, storage, resize, audio and graphics-context recovery on device.
- Cloud save/accounts, shared scores or trusted entitlements: design the required backend authority then.
- Per-copy item properties/repeated slots: introduce instances/slot identities with explicit save migrations then.
- Toolchain changes: update the lockfile and supported Node contract together and rerun the complete gate.
