# UI/UX and Screen Layouts

## 1. Target Viewports
- **Browser QA targets (CSS pixels):** 360×640 primary mobile portrait; 390×844 secondary. Physical device pixels equal CSS pixels × DPR. Neither target defines the logical game canvas.
- **Logical art-pixel canvas:** Flexible, with a centred 180×288 safe rectangle and a 216×427 maximum, governed by [pixelViewport.ts](../src/game/config/pixelViewport.ts). Integer device-pixel scaling is applied by `viewportController.ts`.
- Anchor critical UI to the safe rectangle and re-anchor on Phaser resize; backgrounds may bleed into the flexible area. Typography sizes and wrapping require rendered proof on this canvas, not a universal 360-wide layout.

## 2. Screen responsibilities and continuous flow
`Boot` -> focused Garage home, with navigation to the Run view and major engineering systems. The Run represents continuous auto-drive/automatic attempts, not a sequence gated by a mandatory Result modal and Garage return. Entering/leaving a view is not launching/settling an attempt. Merge screen has a top Merge Area and bottom expandable Workbench; exact visual layout, Inventory layout and checkpoint-selection controls remain undecided.

## 3. Garage home/build overview
Garage focuses on the Rustbucket/current equipped build, five equipped family representations, important vehicle information, Scrap and navigation/settings. Merge, Inventory management and Scavenge need not be permanently embedded in home. Do not prescribe a bottom inventory grid, fixed merge-board geometry, or required DRIVE button. This is a responsibility correction, not a Garage art/layout redesign; Garage-side ART-03 is unfinished separately from approved ART-03R Run visuals.

## 4. Run view
Show the auto-driving Rustbucket, relevant distance/progression and selected Progress/Push or Farm target, fuel/attempt information and useful vehicle telemetry. Recognizable checkpoint landmarks belong to the road; a Scrap Pile can serve as the first VS1 type. Parallax, nearby terrain and state-driven smoke/sputter/spark feedback use the approved Run visual direction. Render only local visible content; recycled visuals do not discard authoritative progression (D06).

Fuel depletes during attempts. At zero fuel, stop/reset/refill on the selected/current route and automatically retry without a player launch action. Keep automatic cycle feedback readable. Fuel/heat ratio displays must be safe for zero capacities. D02 §10 includes legacy durability thresholds, not a requirement to add a global durability gauge to the approved model.

## 5. Rewards and optional diagnostics
Repeat clears continue awarding normal Scrap; a first-clear bonus is one-time and may award parts. Present authoritative reward/first-clear transitions, never independently calculate currency in UI. A mandatory terminal Result screen is no longer the primary flow. Useful heat/Engine-Radiator compatibility and route-suitability diagnostics and improvement hints may remain without gating retries behind dismissal or Garage return. Exact notification/history presentation remains open; preserve existing typography roles including `resultCause`.

## 6. Three part locations and equipment feedback
Display **Workbench / Merge Board**, **Inventory** and **Equipped Parts** as distinct concepts. Inventory is retained general long-term item storage, not merely spare-part or board-overflow storage; future non-part content is possible. Board and stored parts do not affect stats or installed visuals. The equipped Engine, Fuel Tank, Radiator/Cooling, Tires and Suspension are the sole installed contributions to the Rustbucket. Engine T1/T2 on board with T3 equipped must display/use T3.

Merging never implicitly modifies equipment. Feedback and future state binding must not copy the existing stored+installed fallback that clears a slot. Explicit equip/unequip commands conserve ownership and validate family compatibility; exact move/equip UX is undecided. Empty, equipped, selected-target and max-tier states should remain distinguishable where relevant, without deciding an unapproved gesture. Preserve existing generic VS1 Tier 3 merge rejection and clear invalid-action feedback; future specialized max-tier handling remains open.

## 7. Boot Scene
The `Boot` scene is a minimal Phaser preload wrapper:
1. Display a simple loading indicator (text or progress bar).
2. Load production assets from `src/game/assets/assetRegistry.ts` with registered keys, frame/font contracts and visible failure handling; D04 supplies visual identity, not an asset list.
3. Consume the already-initialized GameStateService provided by application composition; do not load progress again in a scene.
4. Transition directly to `GarageScene`.

No gameplay occurs during Boot. Application composition hydrates progress before Phaser boots. The current foundation displays technical diagnostics only; asset loading and Garage transition are future work.

## 8. OWNER DECISION REQUIRED — installed-slot and move/equip UX
Existing service commands establish conservation and compatibility, not a product gesture. Before GAR-01 becomes READY, the owner must resolve default installed-slot tap behavior, access to details/uninstall, MAX-tier behavior and detailed occupied-slot targeting UX. Valid one-for-one swaps are approved in §18; Board/Inventory layout and exact movement/equipping UX remain undecided. Do not carry forward earlier mandatory tap-to-install or automatic merge/equipment changes as locked rules.

GAR-01 remains BACKLOG / not READY until applicable decisions and inputs are resolved. This does not block existing typography/visual proof work. Reject wrong-family targets visibly with no mutation.

## 9. Player intent and controls
Allow deliberate Progress/Push or repeated Farm of an earlier unlocked/reachable checkpoint. Do not always choose the highest unlocked target. Exact checkpoint selection UI, pause/control surface and navigation details remain open. Leaving the Run view or stopping pushing is not a quit-for-distance-payout flow. If explicit pause is retained, it must control authoritative simulation rather than merely freeze graphics; lifecycle/background handling follows D06. No obsolete abandoned-run payout is mandated.

## 10. Diagnostic states
Fuel exhaustion communicates the automatic refill/retry cycle. Engine/Radiator mismatch may produce catastrophic overheating/explosion, ending the attempt before its target and automatically retrying without deleting equipped parts. Tire terrain suitability and Suspension obstacle suitability can explain slower/less reliable completion and useful build changes; do not infer per-family health bars or mandatory global durability. Exact formulas, warning/presentation thresholds and control behavior remain to be settled; do not infer a mandatory terminal failure modal. Existing audio/typography semantic IDs may be reused without locking the old flow.

## 11. Readiness
Respect initialization, unsupported-save/reset blocking, persistence errors and simulation ownership. Bare chassis remains permitted. Once eligible, automatic attempts must not require per-attempt DRIVE/Start Run interaction. Readiness and explicit equipment-change timing need future service adaptation; the current active-run command block cannot indefinitely prevent engineering in a continuous game.

## 12. State, persistence and lifecycle integration
Read frozen service snapshots and authoritative vehicle stats. Submit validated commands; never mutate saves or award rewards in scenes. Continuous attempt scheduling, target intent, checkpoint eligibility and reward settlement belong to domain/services independent of whichever view is open. Save status must show pending/error/blocked honestly and offer retry/explicit reset when Settings is built. Future integration must adapt v1/discrete-run commands and conserve all three part locations (D03/D06/D14).

Current `startRun` / `advanceRun` / `recordRunResult` APIs and ephemeral RunState are an existing foundation snapshot, not the new scene contract. Current hidden-tab pausing and resume-delta discard grant no catch-up; later mathematical offline calculation must not rely on rendering every frame. Exact offline rules remain open. Useful telemetry can be collected without becoming a scene-owned reward authority.

## 13. Typography input contract

Semantic role names are governed by [UI_TYPOGRAPHY](../src/ui/theme/typography.ts): `gameTitle`, `screenTitle`, `sectionHeader`, `buttonPrimary`, `buttonSecondary`, `distanceCounter`, `currency`, `statLabel`, `statValue`, `body`, `caption`, `partName`, `tierLabel`, `resultCause`, `warning`, `criticalWarning`, `success`, `toast`. Preserve those roles and the Silkscreen display / VT323 body identity.

Registered bitmap runtime/cache keys are `font_display` and `font_body`, with PNG/XML exports defined by the visual registry. Existing token `family` values still use family names even for bitmap roles; TYPO-01 must supply explicit renderer/key mapping. Family names remain appropriate for ordinary Text roles. A style helper does not load fonts or establish production rendering.

The token’s 360×640 comment and 320-wide wraps are known unproven legacy assumptions. Sizes, line heights and wrapping are provisional until TYPO-01/02 render the existing roles in actual AP panels/backgrounds at the browser QA targets. Do not copy those values as final layout rules or redesign font identity without evidence.

## 14. Equipment suitability, alternative builds and region feedback
Future equipment presentation should distinguish Family, Type/Specialization and Tier, explain relevant tradeoffs/compatibility and communicate suitability for the selected road/checkpoint conditions. A higher-tier wrong type can be less useful than a lower-tier suitable type; do not imply that highest tier is always best or that all Engine/Tire/Suspension parts are interchangeable. Exact UI layout, comparison controls and labels remain open.

Inventory supports retaining useful alternatives for different push/farm goals, beyond merge fodder. A Push Build may overcome difficult new terrain while a Farm Build earns better Scrap/time on an earlier route. This does not approve preset slots, automatic swapping or a loadout feature. Only equipped parts affect the Rustbucket; alternatives in Inventory or on the board do not passively contribute.

The UI should eventually warn about dangerous equipped Engine/Radiator combinations before or while driving. Catastrophic overheating/explosion is an attempt failure/presentation state with checkpoint retry and equipment intact. Compatibility formulas, heat/explosion thresholds and warning UX are unresolved; no equip-blocking policy or new explosion art/animation is required here.

Milestone region transitions should convey changes in terrain/obstacles and useful equipment, not merely a bigger difficulty number. Multiple checkpoints may reuse a region's authored pieces; exact names, boundaries, content and layout remain open. ART-03R assets/references/lifecycle states and existing semantic font/audio/visual registry identities remain unchanged. Existing durability-related registry entries do not mandate a global durability/degradation system.

## 15. Focused Scavenge system and information responsibilities
Scavenge is its own focused screen/system accessible from Garage/hub; all controls are not forced onto Garage home. Source selection is primarily image/card-oriented (§19). Future UI communicates source identity, Scrap cost, the families/types it tends to contain, unlocked batch choice, remembered per-use investment and resulting tier odds clearly enough to understand targeting/cost/tier tradeoffs. Source directs family/type pool and weights; extra Scrap investment improves higher-tier odds while randomness and source identity remain. Do not imply an exact-item purchase or guaranteed tier.

General remains broad, relatively inexpensive and useful after specialized unlocks. Specialized targeting typically costs more Scrap; shared parts can appear in multiple sources. Region/checkpoint progression may unlock sources, with exact mappings open. No new acquisition currency is added.

Final layout, source names/count, prices/pools/weights/odds, investment levels and whether controls use buttons/levels/slider/another form remain unresolved. Guaranteed/pity mechanics, duplicate protection, first-clear interactions and exact acquisition animation/reveal UX is not chosen; reveal-after-commit is approved (§19). Manual source/investment/timing choices precede later automation; Auto Scavenger unlocks, optional spending limits and configuration UI remain open. This records responsibilities only, with no Scavenge UI/art production or board redesign.

## 16. Core merge feedback contract (design only)
Core merging requires two copies with the **same Family + same Type/Specialization + same Tier**, producing one **next-tier part of the same family and type**. Different families, types or tiers are invalid inputs; matching family and tier alone is insufficient. Type is persistent gameplay identity: no generic, random or hybrid output and no cross-type fusion/recipe graph.

Future feedback should make valid same-line upgrades and invalid unlike inputs understandable; top Merge Area / bottom Workbench is the approved functional hierarchy, while controls, gestures, recipe UI and exact visual layout remain unselected. Direct merging of equipped parts is currently disfavored / expected to require unequipping first, but final interaction behavior depends on Merge Board design. This is pending, not a locked equipped-input prohibition or mandatory unequip workflow. Merging must not unexpectedly modify the running vehicle.

Workbench / Merge Board is finite and expandable through progression; successful normal merge results belong on the Workbench. Exact geometry/visual arrangement, starting and maximum capacity/slot count, expansion costs/milestones, variable-size parts, interaction gesture/workflow, result placement cell, detailed Workbench full-space handling and transfer UX remain unresolved; Inventory capacity and full-Inventory rules are approved in the Inventory contract in D02. Direct equipped-part merging and whether unequip is required await board design; equipment application timing remains open. Future max-tier handling beyond the existing generic VS1 Tier 3 rejection, special transformation-component rules/future type transformation, detailed Multi-Merge and Auto-Merge rules/unlocks/scope/targeting/configuration remain open.

Special transformation components are an **optional future extension**, outside core merging and not required for VS1 or initial board design. Engine + special modification component → modified/specialized Engine is conceptual only; no component catalog, recipes, transformation rules, acquisition, balance, UI or unlocks are defined. Only equipped parts affect vehicle stats/visuals; source targeting and Scrap tier investment remain unchanged.

## 17. Merge Workshop functional hierarchy (owner-approved 2026-10-06)
The Merge screen has **TOP: Merge Area** and **BOTTOM: Workbench / Merge Board**. The Workbench is persistent, finite active engineering space, expandable through progression. Inventory remains separate general long-term item/part storage, capable of future content beyond car parts; it is neither only spare car-part storage nor merely Workbench overflow. Equipped Parts remain the current Rustbucket build and the only installed contributions to stats/visuals.

The Merge Area prepares/performs **Input A + Input B + merge action**; it is interaction space, not permanent storage or a fourth persistent location. A successful normal manual merge consumes two compatible Workbench parts and creates one next-tier same-type Workbench part. Show the new part through temporary result/reward presentation (for example Road Tire T1 + Road Tire T1 → Road Tire T2). Feedback is not authoritative storage. No permanently occupied Result/output slot is required, and no automatic Inventory transfer is implied. Exact destination cell, user-selected placement and presentation remain open.

The top/bottom hierarchy is functional structure only, not a final wireframe, pixel proportions or production artwork. Exact Workbench appearance (table/tray/rack/grid or other arrangement), slot/machine styling, merge animation, popup styling and screen composition remain open. Do not infer controls or gestures from the conceptual inputs. Normal manual pair merging comes first. **Multi-Merge** is approved only as a potential later progression/convenience unlock for processing several compatible pairs more efficiently. **Auto-Merge** is approved as later idle automation of learned manual merging. Both must build on the Workbench workflow and preserve its meaning rather than bypass it. Neither is initial core behavior; rules, unlocks and implementation remain deferred.

D02 lists open capacity/expansion, detailed transfer/Workbench-full-space/scavenged-result-presentation, equipped-merge-workflow and automation decisions. No new assets, layout dimensions, animation timings or buttons are defined.

## 18. Inventory movement and full-capacity feedback (owner-approved 2026-10-07)
Inventory is general long-term storage with **150 item-instance base slots**, currently Parts and extensible to later categories. Display capacity separately from Scrap: 147/150 items plus Scrap 12,450 stays 147/150. Parts do not stack. Support organization by **Family / Type or Specialization / Tier**; visual layout and filters/search UX remain unresolved.

Primary movement direction is drag-and-drop Inventory↔Workbench↔Equipped, including valid direct Inventory↔Equipped transfers. Each Part has one authoritative location; leaving Inventory immediately frees its slot. A valid atomic one-for-one swap into occupied equipment returns the displaced Part to the incoming Part’s Inventory position, stays count-neutral and is allowed at 150/150. Normal Unequip-to-Inventory is blocked when full, with approximate warning “Inventory full. Please clean up your Inventory.”; exact copy/localization remains polish. Never send manual Unequip to Mail. Equipped→Workbench stays allowed with Workbench room even if Inventory is full. Detailed mobile gestures, targeting, slot taps, placement and ongoing-attempt application timing remain open.

Manual Scavenge is blocked at full Inventory; communicate freeing space through Dismantle or valid movement without finalizing warning copy. Normal Workbench merging is allowed: two instances become one Workbench result, reducing occupancy by one, with temporary feedback and no automatic Inventory placement. An unavoidable received item that Inventory cannot accept may be held/delivered through Mail; Mail is a broader future Garage-accessible system, not deliberate Scavenge overflow. Capacity, expiry, claiming, notifications, message types, attachments/inbox layout and broader Mail functions await separate design.

Dismantle deliberately removes an unwanted Part for small Scrap and frees its occupied slot. Refund economics, whether invoked in Inventory/Workbench/other views, bulk/multi-dismantle, confirmation and button placement remain open. Future progression capacity rewards and optional paid expansion are directions only; exact rewards, maximum/amount/pricing and monetization implementation remain unresolved. This approves behavior without finalizing Inventory visuals, detailed drag/drop UX, future item categories, scavenged-result presentation, Mail design or production assets. GAR-01/02 readiness still requires applicable remaining decisions and state adaptation.

## 19. Manual Scavenge interaction and post-commit reveal (owner-approved 2026-10-07)
Represent Scavenge Source selection primarily through **source images/cards**, not only a text list: recognizable salvage-location image, source name, short identity/useful-equipment indication and cost information. Banner/location-card clarity may inspire the feel without copying other games’ assets, branding or exact layout. Card dimensions, final artwork, carousel/grid, typography, visible count and animation remain unresolved; no visual production starts.

The manual configuration is source + unlocked batch + adjustable per-use investment. One unit produces one Part; **x1 → x3 → x5 → x7** is progression, with x1 first and larger convenience batches unlocked later. Exact unlock milestones/costs/mechanism are open. Batch count changes quantity, not inherent tier odds; source targets families/types and investment improves high-tier probability while preserving source identity.

Investment stays selected until changed, after every batch and when unaffordable. Global versus per-source memory is open. Selection spends nothing; no prepaid balance or automatic downgrade. On rejection, show relevant invalid/locked-source, invalid/locked-batch, insufficient whole-batch capacity or insufficient-Scrap feedback without defining final copy/layout. The player may manually lower investment or choose a smaller unlocked batch. Displayed eligibility is informational: execution always rechecks fresh service-owned Inventory, Scrap and source/batch unlocks immediately before atomic commit.

A failed check consumes nothing, rolls/generates nothing and changes no Inventory items. Success commits complete cost and every result directly into Inventory before reveal; no partial batch, deliberate Mail overflow, automatic Workbench/equipment placement or permanent temporary-loot store. All revealed Parts are already owned non-stacking Inventory instances. Continuous Run/checkpoint rewards can change state immediately before execution; during reveal they see the whole committed batch. Existing Mail safety applies only to unavoidable rewards that cannot fit.

One-by-one batch reveal followed by summary is a possible liked direction, not locked behavior. Sequential/summary-first/other order, animation, skip button, duration, result-card geometry, rare-result effects and summary screen remain open. Reveal never creates items or deducts Scrap and is not a separate transaction per animation. Source names/count, costs/multipliers, investment values/tier curves, pools/weights, Auto Scavenge configuration and permanent source upgrades as possible later scope remain unresolved. Future automation must preserve D02/D06 safety; no Scavenge UI/art/runtime or automation implementation.
