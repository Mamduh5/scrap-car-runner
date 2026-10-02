# Asset Production Workflow

This document defines the canonical strategy for generating, validating, and importing production visual assets for Scrap Car Runner.

## 1. Production Art Strategy (No 3D)

**Decision:** The game is exclusively 2D pixel art.
- **No 3D models** will be used in the final runtime.
- **No 3D authoring pipeline** (e.g., Blender) is required. The overhead of rendering 3D vehicles into pixel-art sprites outweighs the benefits for this top-down/side-scrolling junkyard aesthetic.

## 2. Recommended Art Workflow & AI Assistance

Because the project leverages AI assistance, the workflow combines generation with strict manual pixel-art cleanup:

1. **Concept & Silhouette (AI):** AI image generators (e.g., Midjourney, DALL-E) can be used to ideate scrap vehicle parts and environments.
2. **Pixel-Art Cleanup (Manual):** AI-generated outputs **must** be manually traced or heavily processed in a dedicated pixel-art tool (e.g., **Aseprite** or **LibreSprite**). AI outputs are never dropped directly into the runtime.
3. **Palette & Discipline:** The manual cleanup phase enforces the canonical junkyard color palette, eliminates "dirty" sub-pixels, and ensures crisp nearest-neighbor readability on mobile screens.

## 3. Asset Source Structure

Assets are strictly separated into *Source* (editable) and *Runtime* (imported by Phaser):

- **Source:** `art/source/` (Contains `.aseprite` files, layers, AI reference images). This folder is *not* packaged by Vite.
- **Runtime:** `public/assets/` (Contains optimized, flat `.png` files and JSON atlases).

## 4. Animation Strategy

- **Runtime Transforms First:** Simple animations (e.g., wheel rotation, chassis bounce) must be handled via Phaser 4 Tweens and rotations. Do not draw 8 frames of a wheel rotating when a simple `sprite.angle += speed` suffices.
- **Sprite Sheets:** For complex deformations (smoke, sparks, overheating engine vibrations), export standard horizontal sprite sheets from Aseprite.

## 5. Shader Strategy

- **Policy:** Shaders are for **optional visual enhancement only**.
- Core gameplay must never depend on a shader for readability.
- **Good Candidates:** Heat haze over the radiator, engine smoke tinting, damage flashing.
- **Avoid:** CRT curvature (wastes mobile screen space), complex normal mapping.

## 6. Asset Validation Pipeline

To prevent missing files and dimension mismatches, a custom asset validator should be run before builds.

- **Check:** Does every Sprite listed in `04_ART_DIRECTION_AND_ASSET_REGISTRY.md` exist in `public/assets/`?
- **Check:** Are all files exactly `.png` (no `.jpg` or `.webp` for pixel art)?
- **Check:** Are all sprite sheets cleanly divisible by their frame dimensions?

*(The asset validator tooling will be implemented when actual art production begins.)*

## 7. Approval Gate

No asset enters `public/assets/` without passing this gate:
`Generate -> Aseprite Cleanup -> Strict Dimension Check -> Import -> In-Game QA -> Approved`
