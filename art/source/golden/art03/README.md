# ART-03R layered Run sky candidate

READY FOR OWNER VISUAL REVIEW. The composition's road, far junkyard, scrap pile,
puff and approved Rustbucket are retained unchanged. Garage is not started.

## Current visual authority

- `art/reference/art03_run/sky_base_reference.png`: atmosphere, value/color progression and quiet space.
- `art/reference/art03_run/clouds_strip_reference.png`: asymmetric banks, horizontal streaks, sparse density.
- `art/reference/art03_run/sky_composite_reference.png`: layered composition only; never cropped into runtime art.
- `art/reference/art03_run/far_junkyard_reference.png`: the retained far-junkyard language.

The old monolithic sky and ordered-dither recipe are superseded. Existing road,
prop, puff and terrain references continue to apply to their unchanged KEEP assets.

## Source and rebuild

Production sources remain the explicit per-pixel grids in `pixels/*.json`. Each row
is one art-pixel row. Symbols map to canonical palette names (or grayscale effect
values); the sky alone also permits RGB hex colors. Its additional symbols are
single Unicode characters because the reference ramp needs more than 64 colors.
The grid codec validates those literals as sky-only; technical validation checks
every sky pixel against its declared row ramp. Ordinary builds retain grid edits.

```powershell
node --import tsx/esm art/source/golden/art03/build.ts
node --import tsx/esm art/source/golden/art03/validate-run.ts
npx tsc -p art/source/golden/art03/tsconfig.json --noEmit
npm run validate:assets -- --stage production --phase proof_c
```

`refine-sky.ts` deliberately regenerates only the sky from `sky.ts` and the
reference-measured anchors in `src/game/assets/skyRamp.ts`. `translate-clouds.ts`
deliberately regenerates only clouds from their reference: whole-cell mask tracing,
two existing pale sky palette colors, binary alpha, removal of disconnected tiny
flecks, and an empty-air seam. Run those only for deliberate retranslation.
`translate.ts` is the historical KEEP master translation recipe; ordinary sky
corrections never run it. No new image generation was used for this correction.

## Contracts and authorized exceptions

On 2026-10-05 the owner explicitly answered **Allow a sky-only RGB ramp**. The
sky retains its 16x300, opaque, horizontal tile, proof_c, required and technical
contracts. Only its color mode becomes `sky-ramp`. Five measured reference anchors
produce 183 distinct RGB colors with a maximum adjacent-row channel step of 2;
there are no dither strips, checker patterns, cloud pixels or alpha blending.
The 64-color master palette and all other production color rules remain intact.

Owner approved the optional cloud dimension correction **256x48 -> 384x96** on
2026-10-05. `env_clouds_strip` uses the new 384x96 image, `cutout` alpha (0/255 only),
`tileX: true`, `polish`, `required: false` contract and runtime path
`public/assets/environments/env_clouds_strip.png`. Its owner-authorized technical
review is a narrowly checked Golden-gate exception: this optional ID may reach
technical, but visual/ingame/approved and other non-Golden assets remain gated.
Optional/required counts and the seven required proof_c IDs are unchanged.

## Layer stack and review

Back to front: base sky -> cloud strip -> existing far junkyard -> road -> props,
Rustbucket and effects. Nothing is baked into a combined runtime background.
The sky is fixed and horizon anchored. Static scroll proofs give clouds a slower
offset than far scenery; those are review approximations, not gameplay rates.

`preview/run_216_1x.png` (216x288 AP) is the **primary owner review evidence**.
`run_216_4x.png` is its nearest-neighbor enlargement. `run_1x.png` is 180x288;
`run_wide_1x.png` is the 768x288 AP two-tile repetition proof.
`run_max_1x.png` checks 216x427 bleed. All enlarged proofs use nearest neighbor.
`background_layers_1x.png` omits foreground and vehicle. Two-tile cloud proofs
and 32-tile sky proofs expose joins. Before/after is rejected sky left, layered
sky right. Vehicle registration remains 112x56, wheel centers (26,44)/(86,44).

The former 256x48 cloud candidate was **rejected by the owner** for tiny motifs,
compressed heights and wallpaper repetition. It was never used as a sampling
input for this rebuild. Two complete bank crops and two thin streak crops from
`clouds_strip_reference.png` were traced into the new grid, removing disconnected
resampling flecks and keeping binary edges. The main bank occupies 128x25 pixels
at rows 51-75; the secondary bank is 96x23 at rows 10-32. Their sizes and vertical
positions differ, with asymmetric horizontal spacing and 92.23% empty pixels.

The primary 216 AP view shows a broad low bank, thin streaks, readable distant
silhouettes and Rustbucket as the highest-contrast focal object. Four 216 AP
scroll/contact panels check different cloud offsets, including wrap. The 768 AP
proof intentionally shows the full 384 AP tile repeat; no smaller repeat exists.
No normal 216 AP viewport spans a full tile. Empty-air tile boundaries have no
edge mismatch. These are PNG review composites, not owner or in-game approval.

## Evidence and remaining acceptance

`cloud-review.json` is the current cloud correction evidence: contract, measured
bank bounds, repeat/seam results, all ten KEEP grid/export hash comparisons
(including improved sky), and zero other runtime changes. `review-clouds.ts`
regenerates it from the OS temporary pre-correction snapshot (or the directory
passed as its first argument). `cloud_before_after_216_1x.png` compares the rejected
cloud layer on the left to this rebuild on the right at maximum runtime width.

`sky-review.json` / `review-sky.ts` retain historical sky-correction evidence from
before the owner rejected the 256x48 cloud output; they are superseded for clouds
by `cloud-review.json` and must not be treated as acceptance of that rejected art.

`validation.json` records all six Run asset passes, including optional clouds.
Full production/proof_c remains expected exit 1 only for missing Garage wall/lift:
two errors and 66 future-asset warnings. No Garage assets are fabricated.

Historical masters/prompts retain the original reference translation provenance.
The initial non-Aseprite batch workflow acknowledgement remains pending; this
color authorization is not visual approval. All six Run entries are technical,
never visual/ingame/approved. Owner review and later VIS-01 Phaser proof remain.
ART-01/02 are DONE, ART-03R owner review is pending, Garage is planned/unstarted,
ART-03 overall is incomplete, and M0 is IN PROGRESS.
