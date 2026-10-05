# ART-01 Style Reference

This document summarizes the visual decisions and stylistic rules established in the ART-01 Golden Vehicle / Engine Ladder production.

## Art Direction Pillars
- **Chunky handmade scrapyard engineering:** Improvised construction, salvage/junkyard materials, mechanical readability.
- **Personality over Polish:** Asymmetry, slight dents, off-center elements (e.g., crooked antenna), mismatched panel replacements.
- **Readability:** High contrast outlines, readable silhouettes at 1x scale, distinct color-coding for parts.
- **Palette Strictness:** All pixels use the canonical `palette.ts`. No color-management artifacts.

## The Rustbucket Body
- **Silhouette:** Boxy cabin with a strong nose, distinct bed, clear wheel arches. Small details like the crooked antenna add personality.
- **Surface Detail:** Uses strategic rust bites (chewed edges with lit highlights), mismatched doors (darker teal replacement panel), dent lines for volume, and hand-cut louvers on the hood.
- **Lighting:** Lit from the upper right. Edges facing the upper right receive highlight colors, opposite edges receive shadows or dark inks.

## Engine Ladder Progression
The engine ladder communicates increasing capability visually:
- **T1:** Small footprint. Raw cast block, rusted. Single cylinder. Can exhaust. Simple flywheel.
- **T2:** Medium footprint. Cleaner steel with teal painted valve covers. Two cylinders. Pulley with a belt groove. Muffler with riser.
- **T3:** Large footprint (still within 22x22 safe area). Polished steel block with rivets and welds. Four cylinders with safety-yellow covers. Supercharger and three exhaust stacks.

## Wheels
- The T1 wheel is a cheap salvaged steel wheel on a bald tire.
- Hub is 4-fold symmetric, tread has 8-block period.
- Wheel rotation is achieved by drawing a 4-frame seamless cycle (22.5 deg rotation per frame).
- Lighting is applied *after* rotation so the highlight remains consistent at the upper right.

## Technical Execution
- Procedurally authored via TypeScript canvas drawing commands to bypass current tool limitations and ensure perfect palette compliance.
- Outlines are primarily `ink_0` or `ink_1` depending on depth.
- Glass is rendered with diagonal glare stripes over dark ink.
