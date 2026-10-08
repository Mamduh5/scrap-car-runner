# Garage final composition — 2026-10-07

**GARAGE COMPOSITION FINAL CANDIDATE — READY FOR OWNER REVIEW**

Refined B's visual direction is owner-accepted. This is **one** composition candidate; maximum/safe and clean/guided views show the same pixels. Composition approval and production authorization remain pending.

[Interactive review](../review.html) · [Clean maximum](composition-216x427-3x.png) · [Clean safe crop](safe-180x288-3x.png) · [Guided maximum](guides-216x427-3x.png) · [Guided safe crop](guides-180x288-3x.png)

1. **Top headroom:** the critical crop has approximately 28 pixels above the first roof edge, versus 46 in B's previous 216-wide study: about 39% less. Scrap/Mail breathing room is shown only as guide boxes. The maximum canvas retains extra sky outside the safe crop; this reduction describes the critical crop, not the entire 427-pixel canvas.

2. **Lower floor:** 43 pixels below the rig within the safe crop, versus approximately 71 previously: about 39% less. This includes provisional near-car status and bottom-navigation reservations. The three colored status strips are removed; no HUD or navigation is baked into the clean image. Maximum-canvas floor beyond the safe boundary is additional bleed.

3. **Rustbucket prominence:** actual approved body + Engine T1 + wheel frame 0, native 112×56 at (52,250), with no redrawing, rescaling or generated replacement. The car occupies 62% of safe-area width and is the sharp foreground subject. An existing approved Run puff frame adds a small exhaust/testing cue, using the same dust tint as the Run review recipe; this is a still-frame hint, not implemented simulation. The generated reference car was larger; this is not a claim that the approved sprite became bigger. Original roller/end-brace forms remain; only the central bridge is shortened for the canonical 60-pixel wheel separation. Wheels contact the rig at y304.

4. **Safe-area behavior:** 216×427 maximum; exact 180×288 crop at (18,69). Odd vertical surplus is rounded down: 69 pixels above, 70 below. Full car, rig, roof span, lamp and subdued junkyard survive. Edge posts may crop away, while the roof/lamp/horizon keep the open shelter readable. No final UI placement is approved by the guide boxes.

5. **Protected assets:** all 120 protected files are byte-identical, including ART-01/02/03R source/runtime/reference context and original A/B/C images. The accepted refined B PNG separately matches its previous recorded hash. All 62 canonical task/milestone status rows are unchanged. Garage runtime assets remain `planned` and absent; ART-03/M0 remain IN PROGRESS.

6. **Files:** this folder adds four native review PNGs and four exact 3× inspection PNGs, `approved-car-native.png`, `clean-plate-reference.png`, [compose.ts](compose.ts), [verify.ts](verify.ts), [prompts.json](prompts.json), [composition-evidence.json](composition-evidence.json), [validation.json](validation.json) and this report. Updated parent review/README, the B follow-up report's current-decision note, D04 and D14. The old comparison is retained in `../review-history.html`; earlier generation/validation evidence is unchanged.

7. **Validation:** required `npm.cmd run check` passed: both typechecks, 250 tests, data/assets/audio preparation, simulation and build; existing Phaser chunk-size warning remains. Production proof_c still fails for exactly the two missing Garage exports, as expected. Pixel checks confirm the exact centre crop, 3× nearest enlargement and all 3,407 visible car pixels (zero mismatches). Chrome checked native clean views and 2× guided views; all four images loaded at their correct dimensions. Local links/JSON and whitespace checks pass. No Phaser/device acceptance is claimed.

8. **Owner production approval readiness:** ready to review this final composition and decide whether to authorize production next. **Remaining weakness:** the open middle bay is generous, and the maximum canvas still shows substantial atmosphere beyond the safe crop. Native car size makes it less oversized than the generated study. Owner confirmation of its prominence is needed; direction acceptance alone does not settle this. The environment is still resampled generated reference material, with a repaired background behind the removed car and a repeated sky row below the lamp. Palette cleanup/editable production authoring/export have not begun. This is not finished production art.

The built-in imagegen tool prepared an empty background only; [the exact prompt](prompts.json) is retained. Deterministic compositing then retained accepted roof/lamp/visible-yard pixels outside the limited repair windows, removed the generated car/status evidence and inserted approved sprites. No new direction, props, gameplay, runtime export, lifecycle promotion or source-method waiver. **Stop at owner review.**
