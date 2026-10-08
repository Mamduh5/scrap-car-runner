# Garage production plan — current after recovery, 2026-10-08

**garage-b-tight remains the selected composition. Concept exploration is closed.**
**CLOSED AT OWNER VISUAL ACCEPTANCE — 2026-10-08.** Both assets are visual; ART-03 is DONE; M0 remains IN PROGRESS. [Closeout](../../art03-garage/CLOSEOUT.md).

The selected concept served primarily as composition authority during the production translation. The canonical-palette production pass simplified some material/shading character, so Garage visual fidelity may be reconsidered during later in-game polish if warranted. This accepted technical/palette translation debt is non-blocking and is NOT an M0 blocker.

## Current evidence

- [Selected reference](../single-image-review/garage-b-tight.png): immutable 540×654 display of the accepted 180×218 core, SHA-256 `b203926db3afc428d5cdc659fd67357b6badfba66293c03c9c3c166e42209f6a`.
- [Mapping record](mapping.json), [layered preparation](mapping-review.aseprite), [guided full canvas](guides/guided-216x427.png), [guided safe crop](guides/guided-180x288.png), [ownership map](guides/separation-216x427.png).
- [Production sources and reproduction](../../art03-garage/README.md), [current review](../../art03-garage/review.html), [technical evidence](../../art03-garage/validation.json).
- [Cleanup manifest](cleanup-manifest.json) records every original file, classification, retained path and hash. No deletions. [Original plan](../archive/snapshots/production-preparation/PLAN.md) and [original blocker](../archive/snapshots/production-preparation/PRODUCTION-BLOCKER.md) remain historical snapshots.

## Verified authoring path

Aseprite 1.3.18.6 CLI/Lua is operational. Batch, drawing, named layers, PNG import/export, editable master save/reopen and exact rendered equality passed. The earlier native-pipe failure affected GUI automation only; it was not a production blocker. The current owner request explicitly authorizes non-GUI CLI/Lua pixel authoring. No global D11 waiver is inferred.

A process-local `ASEPRITE_USER_FOLDER` points into temporary storage, avoiding automatic loading of the broken PixelLab extension without changing installed extensions or personal settings. PixelLab MCP is separately operational: a synthetic exact-color edit passed. Production did not need remote generation. See [tool verification](../../art03-garage/tool-verification.json).

## Exact contracts and ownership

| Asset | Contract | Source |
|---|---|---|
| env_garage_wall | 216×427, opaque alpha 255, canonical palette, no repeat | [7-layer master](../../art03-garage/env_garage_wall.aseprite) |
| env_garage_lift | 136×20, cutout alpha 0/255, canonical palette, no repeat | [2-layer master](../../art03-garage/env_garage_lift.aseprite) |

The wall is complete beneath runtime objects: sky, distant yard, fence, ground, canopy/supports and lamp. It contains no car, wheels, engine, rollers, smoke, UI or text. The separate rig contains only its low bridge, braces and rollers. No extra production IDs.

## Mapping and separation

One native-scale selected core at (18,104), unchanged internal spacing. Safe rectangle: (18,69), 180×288; full canvas: 216×427. The 70 extra safe-area rows are distributed 35 above / 35 below the selected core. Outer 69/70 rows are non-critical continuation.

Car origin (52,227), 112×56. Lift canvas (40,281), 136×20. Wheel centers (78,271)/(138,271), exactly 60 pixels apart. Relative to lift: body (+12,-54), wheel centers (+38,-10)/(+98,-10). Rig content occupies local y0–9; y10–19 is transparent. All 12 engine-tier/wheel-frame combinations preserve exact approved vehicle pixels and meet the roller contact row.

Preparation PNGs preserve selected-reference pixels, with explicitly schematic edge continuation; they are not production artwork. Production is freshly authored palette geometry in Aseprite, not resampled or quantized reference pixels. Magenta preparation guides identify runtime exclusions; red identifies the rig canvas; teal the car; yellow the safe bounds. The entire wall remains opaque beneath every overlay.

## Palette translation and remaining review

Canonical sky_outskirts values replace reference cyan/cream shading; steel/dust/rust ramps replace noisy roof/fence/floor colors; a few dust highlights light the lamp. Hero teal stays in the unchanged car. No Run RGB-ramp exception, smooth glow, gradients or semitransparent edge pixels. Detailed mappings and limits are in the production README.

The full/safe production images retain the canopy, lamp, car and rig and show clear provisional Scrap/Mail, telemetry and navigation reservations. Their geometry is evidence for art review, not final UI or touch-layout approval. The exact canvas necessarily has more surrounding atmosphere than the tight selected study; owner review must assess that translation and the simplified palette.

## Work after visual acceptance

1. Owner visual review is complete for the current milestone; preserve accepted PNGs and masters.
2. Apply only requested pixel corrections to the editable masters; ordinary export uses `export.ps1`, never silently reruns `author.lua` over hand edits.
3. Later VIS-01 Phaser/viewport/motion evidence and final approval remain separate.

Both registry entries are now `visual` by explicit owner acceptance. Neither is `ingame` or `approved`. ART-03 is DONE; M0 remains IN PROGRESS. No gameplay, gauges, navigation, Mail or animation implementation.

## Resolved lifecycle gate

The previous planned-status mismatch is resolved by the owner-authorized visual transition. See [current closeout validation](../../art03-garage/closeout-validation.json); original failing results remain in the historical production evidence.
