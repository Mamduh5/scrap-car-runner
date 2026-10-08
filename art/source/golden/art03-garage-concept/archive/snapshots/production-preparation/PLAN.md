# Garage production-preparation plan — 2026-10-08

**Selected composition: `garage-b-tight`, accepted by the owner. Concept exploration is closed.**

The current authorization is inspection and production-preparation planning for two registered assets. No production source, runtime PNG, palette, registry or gameplay file is modified by this preparation pass. Reference acceptance is not either asset's `visual` lifecycle approval.

## Accepted reference and inspection

[Selected image](../single-image-review/garage-b-tight.png) · [Measured inspection](inspection.json)

The selected PNG is 540×654, an exact integer 3× display of a **180×218** composition. Inspection found zero 3× repetition mismatches. Its SHA-256 is `b203926db3afc428d5cdc659fd67357b6badfba66293c03c9c3c166e42209f6a`. Retain this file unchanged as composition authority; do not regenerate or resave it.

At the underlying art-pixel scale, the complete 112×56 Rustbucket starts at (34,123); all 3,407 visible pixels match the existing approved car composite. The visible roller assembly occupies the established 136×10 placement at (22,177). The image is flattened and fully opaque: car, exhaust, rig and background are combined, so it cannot be exported as either registered asset.

The image has 9,722 RGB colors; **35,825 of 39,240 pixels (91.3%) are outside the canonical palette**. This is expected of the retained generated environment but rules out direct export or simple resizing as production. Composition acceptance does not grant the Run sky's separate RGB-ramp exception to Garage.

## Exact production targets

This is an inspection snapshot, not a replacement for [the registry](../../../../../src/game/assets/assetRegistry.ts).

| Target | Exact contract | Content ownership |
|---|---|---|
| `public/assets/environments/env_garage_wall.png` | One 216×427 image; every alpha 255; every visible RGB in the master palette; margin 0; required `proof_c`; `planned`, absent; no tiling or nine-slice contract | Open sky/daylight, canopy/posts/lamp, distant junkyard, fence/horizon and continuous ground; restore the background occluded by the car and rig |
| `public/assets/environments/env_garage_lift.png` | One 136×20 image; alpha only 0/255, with some transparent pixels; every visible RGB in the palette; margin 0; required `proof_c`; `planned`, absent; no animation/tiling contract | The low rollers, central bridge and end braces only, with a true cutout contour |

Keep the vehicle body, engine overlay, authored wheels and existing puff separate in the eventual assembled proof. Neither environment image includes a car, puff, telemetry, Scrap/Mail, navigation, labels or review guides. `env_garage_fg` and other optional/new assets are outside this plan.

The wall must remain complete beneath the independently drawn rig: no car-shaped hole, transparent patch, ghost car, duplicate rollers or baked exhaust. The existing clean-plate reference can inform those obscured areas, but it is not a ready production source and must not override the selected composition's placement.

## Translation into the registered canvas

**Preserve native scale and the accepted internal spacing.** The car stays at 1× and the accepted canopy-to-car gap is not stretched. Do not stretch 180×218 to 216×427, enlarge the car fractionally, repeat a middle sky row, add props to fill space, or restore the rejected purple block.

The actual maximum canvas contains a centered 180×288 safe rectangle at (18,69), using integer floor rounding; there are 69 pixels above and 70 below it. Compared with the selected core:

- The safe rectangle has **70 additional vertical pixels**. These are inside the guaranteed view, not disposable outer bleed.
- The maximum canvas has 36 additional horizontal pixels and 209 additional vertical pixels. Of those extra vertical pixels, 139 are outside the safe rectangle.
- Simply padding the selected image cannot preserve its exact apparent framing. This is the remaining production-layout translation issue; reference acceptance does not resolve it.

**Recommended starting construction:** keep a protected 180×218 core, center it horizontally, and use one provisional centered placement at **(18,104)** in the maximum canvas. This is a measurable starting anchor, not approved final layout. It puts the car at (52,227) and rig contact origin at (40,281), with the whole core inside the safe area. It adds 35 pixels above and below the selected core inside the safe view, plus outer bleed. Those additions must be continuous subdued scene material, with no visible UI-region boundary. Existing concept context can guide side/sky/ground continuation; no new style or architecture is needed.

Before committing production artwork, resolve the vertical extension/anchor using **one registered-size layout proof of this same accepted composition**. Inspect the safe crop first: the extra 70 rows must not recreate the rejected low-car/large-empty-bay impression. If the centered starting anchor fails that check, adjust the common core translation and distribution of the continuous edge extensions; keep the internal car/roof/rig relationships intact. Do not claim mathematical centering alone settles the visual issue. No proof image or alternative is generated in this planning pass.

This check is a translation gate, not renewed concept exploration. Full viewport / safe crop evidence is necessary for production acceptance even though the reference itself is accepted. Final HUD/navigation geometry remains outside these two environment assets.

## Lift canvas and exact registration

The accepted visible rig is approximately 10 pixels tall; the registered **canvas** is 20 pixels tall. Preserve its low profile. Start with the traced 136×10 visible form at local y0–9 and transparent rows y10–19. Transparent padding is valid: `margin: 0` specifies no minimum transparent border and does not require filling the entire image. Do not vertically double the rig or add machinery merely to occupy 20 rows. Clean away the rectangular floor background and retain only the intended rig silhouette.

Record the following top-left-origin relationship in the future assembly/layout source:

| Registration | Native art-pixel value |
|---|---|
| Lift canvas origin | `(Lx, Ly)`; top contact line at `Ly` |
| Car body/overlay origin | `(Lx + 12, Ly - 54)` |
| Rear / front wheel centers | `(Lx + 38, Ly - 10)` / `(Lx + 98, Ly - 10)` |
| Wheel sheet frame placement | Car origin + `(14,32)` / `(74,32)`; 24×24 frame |

The approved tread reaches car-local y54; inspect that it meets the contact line without a gap. The 60-pixel wheel-center separation is fixed. Use the already selected bridge/roller proportions, not the earlier generated car's wheel spacing. Padding below the lift must not shift its contact anchor.

Assembly order: opaque wall → lift → existing puff behind the car → approved body → selected engine overlay → authored wheel frames → eventual separate UI. This is an art-proof recipe, not a GarageScene implementation. There is currently no implemented GarageScene layout to inherit; Boot's Garage name is a future route only.

## Editable source and palette preparation

Use [D11's manual Aseprite cleanup workflow](../../../../../docs/11_ASSET_PRODUCTION_WORKFLOW.md), with proposed future source files under a new `art/source/golden/art03-garage/` directory:

- `env_garage_wall.aseprite`, 216×427: named sky/yard/fence/canopy/lamp/ground layers; hidden reference/guide layers excluded from export; opaque final wall composite.
- `env_garage_lift.aseprite`, 136×20: separate cutout rig, with its contact origin documented.
- A small layout/provenance record for selected-reference hash, core placement, lift anchor, layer exclusions and palette decisions. The approved car assets remain external read-only inputs.

These paths are proposed only; no production source directory or file is created now. Aseprite was not found on PATH or in the two common Windows locations checked. Tool availability remains unestablished; do not silently substitute procedural production authoring. The ART-01/02 exceptions and ART-03R visual acceptance do not waive Garage's source workflow.

Trace intentional pixel clusters and simplify generated shading without redesigning the accepted silhouette/material grouping. Use the canonical sky-outskirts ramp for Garage sky/daylight, steel/ink/rust ramps for the structure and rollers, subdued steel/dust for the distant yard and ground, and restrained dust/yellow for the lamp. Preserve value separation and teal car dominance. Do not blindly nearest-color-quantize the noisy source, add palette colors, borrow `sky-ramp` mode, or bake smooth glow/antialiased edges into the lift. Wall lighting may use opaque palette clusters; lift edges stay binary alpha.

## Planned sequence and acceptance evidence

1. **Preparation now:** record the owner's composition selection, inspect contracts and reference, document the exact separation/registration strategy and remaining canvas-fit/tooling seams. Preserve accepted art and task/lifecycle states.
2. **Before production editing:** establish the Aseprite authoring path and resolve the single registered-canvas translation proof described above. This does not reopen style selection or authorize optional assets.
3. **When production work is authorized:** create the two editable sources, trace/clean palette-compliant pixels, restore occluded wall areas and isolate the rig. Assemble against unchanged car/engine/wheel/puff inputs. Check Engine T1–T3 and the existing four T1 wheel frames for clearance/contact without producing new vehicle assets.
4. **Only after source/fit review:** export the two exact PNGs, excluding every reference/guide/car/UI layer. Check dimensions, opacity/cutout, canonical colors, nonblank content and absence of forbidden color-management chunks. Run `npm run validate:assets -- --stage production --phase proof_c`; it must then pass both Garage entries while retained Run inputs remain unchanged. Follow with the required project checks.
5. **Acceptance stays staged:** technical export evidence → actual-size visual review at maximum/safe canvas → later VIS-01 real Phaser/viewport/motion evidence → final owner acceptance. Any lifecycle transition must have its own named evidence; none occurs in this preparation pass. Do not infer ART-03/M0 completion, palette lock, ART-04 approval or GAR-01 readiness.

Before any runtime export, compare accepted ART-01/02/03R source/runtime/reference hashes, registry/palette/source code, selected reference hash and canonical task/milestone statuses. Inspect composited and isolated wall/lift for baked vehicle pixels, duplicate ground/rig seams, cutout halos and a returning purple band. Keep the selected image immutable and separate from production inputs/outputs.

**Preparation outcome:** the two-asset separation and registration are understood. Actual production remains unstarted. The 70-row safe-area extension/anchor and concrete Aseprite availability must be resolved before treating this plan as executable pixel authoring; palette cleanup remains substantial. No new concept images or production files were created.

**Preparation verification:** 137 protected files, including the selected reference and accepted ART-01/02/03R context, remain byte-identical. All 62 canonical task/milestone status rows are unchanged; both Garage exports remain absent. All 71 checked local links resolve. `npm.cmd run check` passed (13 test files / 250 tests, typechecks, data/assets/audio preparation, simulation and build); the existing Phaser chunk-size warning remains. `git diff --check` passed. These checks establish preservation and repository health, not production-art acceptance.
