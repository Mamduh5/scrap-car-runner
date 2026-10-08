# Garage Golden production recovery — 2026-10-08

**GARAGE GOLDEN PRODUCTION CANDIDATES — READY FOR OWNER VISUAL REVIEW**

Both candidates and editable masters exist. **Repository asset gates are not green:** the owner-required unchanged `planned` statuses conflict with the validator's existing-file rule. Pixel contracts, source/export equality and protected-work checks pass. No owner approval or project completion is claimed.

## 1. Concept workspace cleanup

All 45 original files are classified individually in [cleanup-manifest.json](../art03-garage-concept/production-preparation/cleanup-manifest.json).

- **Kept (A):** selected garage-b-tight, current README/review entry point, preparation plan, inspection/selection evidence and corrected blocker note.
- **Archived (B):** 39 files: initial A/B/C PNGs, prompts, validation, old comparison page, and complete b-refinement, final-composition and composition-correction directories. Four original current-document/page snapshots were additionally retained before updating them.
- **Deleted (C):** none. **Uncertain (D):** none left unresolved; potentially useful provenance was archived rather than discarded.
- All 45 originals remain byte-identical at their recorded retained locations. Current-document originals resolve to snapshots. Frozen historical scripts/manifests retain their original paths; use the manifest for relocation, not as current build commands.
- Approved ART-01/02/03R files were neither moved nor changed.

## 2. Previous blocker reassessment

The native-pipe failure only blocked GUI automation. It did not establish any CLI/Lua failure. The current request explicitly authorizes non-GUI authoring. The [old blocker](../art03-garage-concept/archive/snapshots/production-preparation/PRODUCTION-BLOCKER.md) remains verbatim history; the current blocker note records its resolution.

## 3. Tool verification

Aseprite executable: `D:\Mamduh\Program Files\Stearm\steamapps\common\Aseprite\aseprite.exe`. Version: **1.3.18.6-x64**. Version/help, batch, Lua, named layers, pixel drawing, PNG import/export, .aseprite save/reopen and exact rendered equality passed. Reopened production masters also exactly equal the runtime pixels.

A temporary process-local preferences folder avoids the installed PixelLab extension. Initial default-profile version/help printed its existing nil-dlg errors; subsequent isolated runs did not. No extension action or persistent configuration change was performed.

PixelLab MCP discovery and describe calls succeeded. A synthetic 4×4 import/inspect and exact map_colors edit passed: one pixel changed from #565c6e to #3b3f4e, preserving alpha. Masking, guarded alpha patches, region copying and crop schemas were inspected, but not claimed execution-tested. AI cleanup/cutout generation was not invoked. Aseprite met the production requirements. [Exact tool evidence](tool-verification.json).

## 4. Production preparation

- Full canvas: **216×427**.
- Safe area: **(18,69), 180×288**; 69 rows above, 70 below.
- Selected 180×218 core: **(18,104)**; one translation, no new composition alternative.
- Car: **(52,227), 112×56**; exact body, Engine T1 and approved T1 wheel frame 0.
- Wheel centers: **(78,271), (138,271)**; 60px separation.
- Lift: **(40,281), 136×20**; visible local y0–9, remaining bottom rows transparent.
- Wall owns the entire opaque canvas beneath overlays. Rig belongs only to the separate lift. Vehicle/wheels/engine, smoke, all UI/HUD/navigation/checkpoints and text are excluded from both exports.
- Guides show ownership, exclusions, safe bounds, wheels and provisional UI reservations. They are separate layers in the preparation .aseprite; original selected pixels are unchanged.
- Preparation edge extension is schematic reference mapping, not exported production pixels. Final sky/ground are newly drawn continuous canonical-palette areas.

## 5. Preparation files created

Under `art/source/golden/art03-garage-concept/production-preparation/`:

- `cleanup-manifest.json`
- `mapping.json`
- `mapping-review.aseprite`
- `guides/mapping-216x427.png`
- `guides/mapping-180x288.png`
- `guides/guided-216x427.png`
- `guides/guided-180x288.png`
- `guides/separation-216x427.png`

Current PLAN.md and PRODUCTION-BLOCKER.md updated; their originals are archived.

## 6. Wall master

[env_garage_wall.aseprite](env_garage_wall.aseprite): **216×427**, seven named editable layers, **14 canonical colors**, alpha 255 everywhere. Sky, distant salvage silhouettes, patched fence, continuous ground, peripheral supports/beams, scrap roof and hanging lamp retain the selected arrangement.

Authored in Aseprite Lua with hand-specified pixel contours and coherent clusters. No automatic resize/quantization of the concept, random texture or generated replacement. The source contains no imported car, rig, smoke or UI. [Palette mapping and reproduction](README.md).

## 7. Lift master

[env_garage_lift.aseprite](env_garage_lift.aseprite): **136×20**, two named editable layers, **12 canonical colors**, binary alpha with **1,633 transparent pixels**. Occupied bounds x1..134/y0..9.

A low salvaged bridge with rusted roller end caps and restrained accents. Local roller centers x38/x98 align to the real wheel centers. All twelve Engine T1–T3 / T1 wheel-frame combinations retain exact vehicle pixels and intersect the roller contact row. No hydraulic-lift redesign or explanatory text.

## 8. Production candidates

- `public/assets/environments/env_garage_wall.png`
- `public/assets/environments/env_garage_lift.png`

Both are Aseprite exports of the reopened masters. Exact dimensions, alpha, palette, allowed PNG chunks and reviewed-pixel equality pass. [Measurements/hashes](validation.json), [master equality/layers](master-validation.json). Lifecycle remains planned at the owner's instruction, so the repository validator reports status-mismatch rather than a successful production gate.

## 9. Review composite

Under `art/source/golden/art03-garage/review/`:

- `clean-216x427.png`, `guided-216x427.png`
- `clean-180x288.png`, `guided-180x288.png`
- The same four names with `-3x.png` for integer inspection.
- `wall-candidate.png`, `lift-candidate.png`, `lift-6x.png`
- `approved-car.png`, `engine-wheel-contact.png`
- `composition.aseprite`: separate wall, rig, body, engine, rear/front wheel and hidden guide layers.

[Review page](review.html) defaults to true 1× images and offers 3×. Safe crop was visually inspected at 1× and 3×; full canvas and isolated rig were also inspected. Car remains distinct; canopy/lamp survive the crop; quiet guide regions support potential HUD, small telemetry and navigation. The extra safe-area rows remain a production translation judgment for the owner, not automatically approved by centering. No final UI, in-game or motion evidence.

## 10. Files changed

[FILES.json](FILES.json) contains the exact created/modified paths and every archive source→destination mapping, with no deleted files. Only Garage art/evidence, the current concept index/plan/blocker and narrow D04/D14 Garage activity/link updates were changed. Registry, palette, gameplay, packages and approved benchmarks remain untouched.

## 11. Validation

- Pixel checks: both candidates pass exact dimensions, opacity/cutout, canonical palette and forbidden color-management chunk checks.
- Reopened masters: exact runtime pixel equality; seven/two editable layers.
- Composition: zero car-pixel mismatches in 12 combinations; contact verified; safe crop exactly equals the centered full-canvas crop.
- Preservation: **117 protected ART-01/02/03R/source/runtime files unchanged**; all **45 original concept files retained byte-identically** at mapped paths/snapshots. Selected hash unchanged.
- Source TypeScript check: passed.
- `git diff --check`: passed; existing LF/CRLF notices only.
- `npm run validate:assets -- --stage production --phase proof_c`: **exit 1**, exactly two **status-mismatch** errors; no missing Garage exports. Existing rule: `tools/assets/validateAssets.ts:415`.
- `npm run check`: **exit 1** at preparation asset validation for the same two status errors. Both typechecks, 13 test files / **250 tests**, and data validation passed before that failure.
- Audio validation, simulation and build were then run separately: all passed. Existing large Phaser chunk warning remains.
- No rule weakening, lifecycle promotion or fake all-green claim. Semantic content exclusions are source/visual judgments, not inferred from palette tests.

## 12. Lifecycle / project status

Both assets remain **planned**, with candidate files and technical pixel evidence, pending owner visual review. ART-03 Garage **IN PROGRESS**. M0 **IN PROGRESS**. No visual/ingame/approved promotion; no Golden membership expansion (22 entries), optional Garage sprite, gameplay, HUD, navigation, Mail or animation work.

## 13. Remaining blockers

**No non-GUI authoring tooling blocker.** The remaining repository gate conflict is explicit: planned status cannot coexist with runtime exports under the validator. Resolving it requires a separately authorized truthful lifecycle transition (D11 draft/technical as appropriate), or a revised handoff instruction; neither was silently performed.

The owner should inspect safe-area car dominance, palette simplification/banding, roof gaps/lamp, roller contact and the unavoidable added safe-area head/floor space. Owner visual acceptance and future VIS-01/final acceptance remain pending.

## 14. Final status

**GARAGE GOLDEN PRODUCTION CANDIDATES — READY FOR OWNER VISUAL REVIEW**

Both candidates, editable masters, preparation guides and exact-car review evidence are delivered. Pixel checks pass; repository asset/check commands remain blocked by the deliberately unchanged planned statuses.
