# Garage composition correction — 2026-10-08

**GARAGE COMPOSITION CORRECTION — READY FOR OWNER REVIEW**

The owner retains refined B's visual direction and rejects the previous low/small-car framing. For this correction the owner explicitly chose: **complete car at 1×, tighter bay, compact floor ending above a plain UI reserve**. This is one candidate, with no new art generation.

[Review page](../review.html) · [Clean maximum](clean-216x427.png) · [Guided maximum](guided-216x427.png) · [Clean safe crop](clean-180x288.png) · [Guided safe crop](guided-180x288.png)

- **Car and platform move up 44 pixels.** Approved car origin moves from (52,250) to (52,206); rig from (40,304) to (40,260). The complete 112×56 car stays at 1×. All 3,407 visible car pixels are unchanged. Its centre is now 23 pixels below the safe-area centre, versus 67 previously. The existing exhaust cue moves with it.
- **Middle gap loses 44 rows.** The previous recipe inserted a repeated sky band below the lamp. This correction removes that band. Canopy/lamp stay fixed; fence, horizon, junkyard, car and rig translate together with no recoloring, resampling or redesign. No filler props are added.
- **Pavement ends 18 pixels below the rig**, reduced from 43 in the prior safe view. At canvas y288 it gives way to plain canonical `ink_1` (#211921), following the owner's framing choice. The remaining 69 rows inside the safe area are plain UI reserve. This is not a claim that moving the car up removes the lower screen area; it changes that area's role and removes the extended pavement.
- **UI stays separate.** Guided views retain small top Scrap/Mail reservations, a near-car status reservation and bottom navigation reservation. Clean views contain no guide boxes, controls, labels or colored status strips. The plain reserve does not finalize UI geometry or claim that controls need its full height.
- **Viewport evidence:** exact 216×427 canvas and exact centre crop at (18,69), 180×288. Odd vertical surplus rounds down, leaving 69 pixels above and 70 below. Car, wheels and 136×10 roller rig remain fully visible; the roof span, hanging lamp and yard establish the setting. Companion `-3x.png` files are integer inspection enlargements of the same candidate.

The result brings attention into a compact car/test-bay grouping and removes the stretched middle band. The native car has the same width as before; its prominence comes from placement and reduced surrounding scene depth. The plain lower reserve is intentionally visible for review and is still subject to owner approval. The maximum canvas contains extra atmosphere/reserve outside the safe crop.

**Validation:** required `npm.cmd run check` passed, including both typechecks, 13 test files / 250 tests, data/assets/audio preparation, simulation and build. Existing Phaser chunk-size warning remains. All 136 protected files are byte-identical, including the approved ART-01/02/03R context and all prior final-candidate files. Pixel checks verify 38,880 fixed upper pixels, 23,328 translated lower-scene pixels, exact car identity and safe crops. Task/milestone states are unchanged; Garage exports remain planned and absent. [Validation record](validation.json) and [composition evidence](composition-evidence.json) distinguish these checks from owner or in-game acceptance.

**Files:** this folder contains four requested review PNGs plus four 3× inspection copies, [compose.ts](compose.ts), [preservation-baseline.json](preservation-baseline.json), composition/validation evidence and this report. Parent review/README, D04 and D14 point to the correction and record the prior rejection. Previous candidate files are unchanged.

**Stop at owner review.** Direction acceptance remains valid; corrected-composition approval and production authorization are pending. No Golden runtime exports, lifecycle promotion, final UI or gameplay implementation. The retained generated background remains concept material requiring future production authoring/cleanup.
