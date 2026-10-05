# ART-03R Golden Run environment benchmark

**OWNER VISUALLY APPROVED — 2026-10-05.** Exactly six Run assets are `visual`:
`env_sky_outskirts`, optional `env_clouds_strip`, `env_far_junkyard`,
`env_road_asphalt`, `prop_scrap_pile_a`, `fx_puff`. No in-game or final approval is
claimed. Garage wall/lift remain planned and absent; ART-03 and M0 are IN PROGRESS.

## Authority and retained source

All eight approved references remain in `art/reference/art03_run/`: road/ground,
far junkyard, scrap pile, terrain progression, puff, base sky, cloud strip and sky
composite. The composite is composition authority, never a baked runtime sprite.

`pixels/*.json` are the six maintained editable production grids. `pixels.ts`
exports strict RGBA PNGs; palette symbols apply to objects/clouds, grayscale to
puff, and sky-only RGB hex symbols to the base sky. The sky's Unicode symbols
allow its 183-color ramp without changing the 64-color object/UI palette.

Four CURRENT masters remain: `masters/road.png`, `far.png`, `prop.png`, `puff.png`.
They are consumed by `translate.ts` and retained generation provenance. Exact
original prompts for these four masters remain in `prompts.json`. The road master
is already cropped to 1448x784; provenance retains the crop and original hash.
Unused padding and rejected source iterations are not build dependencies.

`sky.ts` / `refine-sky.ts` use the approved anchors in
`src/game/assets/skyRamp.ts`. `translate-clouds.ts` samples complete bank/streak
crops from the original cloud reference, never a previously exported cloud tile.
Retranslation scripts deliberately replace grids; ordinary builds retain edits.
The initial imagegen/master translation and non-Aseprite workflow are documented;
separate source-workflow acknowledgement remains pending, without invalidating or
expanding the owner's explicit visual acceptance. This is not a global exemption.

## Contracts

Sky: existing 16x300 opaque horizontal tile, proof_c, required. The owner explicitly
authorized its `sky-ramp` color mode; every pixel is checked against the declared
reference row ramp. The exception applies only to `env_sky_outskirts` atmosphere.

Clouds: owner-approved 384x96 image at
`public/assets/environments/env_clouds_strip.png`, cutout alpha 0/255, horizontal
tiling, optional (`required: false`), existing polish phase. The bounded Golden-gate
exception permits this ID/contract at technical or visual; it permits no in-game
or final promotion. Golden membership remains the 22 required proof entries.

## Reproduction and read-only checks

From the repository root:

```powershell
node --import tsx/esm art/source/golden/art03/build.ts
node --import tsx/esm art/source/golden/art03/validate-run.ts
node --import tsx/esm art/source/golden/art03/review-clouds.ts
npx tsc -p art/source/golden/art03/tsconfig.json --noEmit
npm run validate:assets -- --stage production --phase proof_c
```

Build reads the six grids and approved ART-01 body/engine/wheel exports. It can
reproduce missing Run exports and the compact proof set; existing exports that
differ from the grids fail rather than silently replacing accepted artwork. No
Garage files are written. Validation compares all runtime bytes to encoded grids.
The evidence tools update JSON only; they need no temporary or rejected snapshots.
No art or retained preview was regenerated during the hygiene/approval task.

## Compact final proof set

All eight retained previews are the owner's existing accepted pixels:

- `preview/run_216_1x.png`: primary 216x288 AP Run composite.
- `preview/run_1x.png`: minimum 180x288 AP composition.
- `preview/run_max_1x.png`: maximum 216x427 AP bleed.
- `preview/run_wide_1x.png`: 768x288 AP repetition proof.
- `preview/run_scroll_contact_1x.png`: four 216 AP offsets and wheel/puff frames.
- `preview/background_216_1x.png`: sky + clouds + far, without foreground/vehicle.
- `preview/cloud_tile_repeat_1x.png`: two full 384 AP cloud repeats and empty joins.
- `preview/asset_contact_1x.png`: far, road, prop and puff export inspection.

Stack: sky -> clouds -> far -> road -> props/Rustbucket/effects. Static offset
approximations are review-only, not production parallax. These PNGs establish the
accepted visual benchmark, not Phaser/browser/device loading or motion evidence.

## Approval and evidence

`owner-approval.json` records the explicit owner decision and seals SHA-256 hashes
for all six runtime exports, six editable grids, eight references and eight proofs.
`cloud-review.json` verifies those retained hashes and measures the approved cloud
contract, bank bounds, binary alpha and full 384 AP period. `validation.json`
records all six technical passes. Full proof_c still fails only for absent Garage
wall/lift (two errors, 66 future warnings); no Garage exports are fabricated.

ART-01/02 are DONE. ART-03R Run visual review is complete; overall ART-03 remains
incomplete. VIS-01, source-workflow acknowledgement and final Golden approval are
separate remaining evidence. No broader non-Golden batch is authorized.
