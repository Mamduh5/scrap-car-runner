#!/usr/bin/env node
/**
 * tools/validate-data.ts — Data Integrity Validator
 *
 * Validates all static game data for consistency:
 *   - No duplicate part IDs
 *   - All parts belong to valid families
 *   - Tier progression is complete (T1 → T2 → T3 chain is unbroken)
 *   - All chassis slot families are valid
 *   - Road segments are contiguous and non-overlapping
 *   - No division-by-zero hazards
 *
 * Run: node --import tsx/esm tools/validate-data.ts
 *
 * Exit 0 = all checks passed
 * Exit 1 = one or more checks failed
 */

import { PARTS, PARTS_BY_ID } from '../src/data/parts.js';
import { CHASSIS_LIST } from '../src/data/chassis.js';
import { ROADS } from '../src/data/roads.js';
import { PART_FAMILIES, MAX_TIER } from '../src/types/game.js';

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail?: string): void {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}${detail ? ': ' + detail : ''}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// Parts
// ---------------------------------------------------------------------------

console.log('\n[Parts]');

// Unique IDs
const partIds = PARTS.map((p) => p.id);
check('All part IDs are unique', new Set(partIds).size === partIds.length);

// Valid families
for (const part of PARTS) {
  check(
    `Part "${part.id}" has a valid family`,
    (PART_FAMILIES as readonly string[]).includes(part.family),
  );
}

// Valid tiers
for (const part of PARTS) {
  check(
    `Part "${part.id}" has a valid tier (1-${MAX_TIER})`,
    part.tier >= 1 && part.tier <= MAX_TIER,
  );
}

// Merge chain completeness: for every non-max-tier part, the T+1 variant must exist
for (const part of PARTS) {
  if (part.tier < MAX_TIER) {
    const nextId  = `${part.family}_t${part.tier + 1}`;
    const nextDef = PARTS_BY_ID.get(nextId);
    check(
      `Merge target "${nextId}" exists for "${part.id}"`,
      nextDef !== undefined,
    );
  }
}

// Each family must have parts for every tier 1..MAX_TIER
for (const family of PART_FAMILIES) {
  for (let tier = 1; tier <= MAX_TIER; tier++) {
    const id = `${family}_t${tier}`;
    check(`Part "${id}" exists`, PARTS_BY_ID.has(id));
  }
}

// ---------------------------------------------------------------------------
// Chassis
// ---------------------------------------------------------------------------

console.log('\n[Chassis]');

check('At least one chassis defined', CHASSIS_LIST.length > 0);

for (const chassis of CHASSIS_LIST) {
  check(`Chassis "${chassis.id}" has positive weight (speed formula guard)`, chassis.baseStats.weight > 0);
  check(`Chassis "${chassis.id}" has positive maxHeat`, chassis.baseStats.maxHeat > 0);

  // All slot families are valid
  for (const slot of chassis.slots) {
    check(
      `Chassis "${chassis.id}" slot "${slot}" is a valid PartFamily`,
      (PART_FAMILIES as readonly string[]).includes(slot),
    );
  }
}

// ---------------------------------------------------------------------------
// Roads
// ---------------------------------------------------------------------------

console.log('\n[Roads]');

check('At least one road defined', ROADS.length > 0);

for (const road of ROADS) {
  const segs = road.segments;
  check(`Road "${road.id}" has at least one segment`, segs.length > 0);

  // Segments must start at 0
  check(
    `Road "${road.id}" first segment starts at 0`,
    segs[0] !== undefined && segs[0].startDistance === 0,
  );

  // Segments must be contiguous
  for (let i = 0; i < segs.length - 1; i++) {
    const cur  = segs[i];
    const next = segs[i + 1];
    if (cur === undefined || next === undefined) continue;
    check(
      `Road "${road.id}" segment "${cur.name}" is contiguous with "${next.name}"`,
      cur.endDistance === next.startDistance,
    );
  }

  // Last segment must be Infinity
  const last = segs[segs.length - 1];
  check(
    `Road "${road.id}" last segment has endDistance Infinity`,
    last !== undefined && last.endDistance === Infinity,
  );

  // No segment has negative loadFactor or roughness
  for (const seg of segs) {
    check(`Segment "${seg.name}" loadFactor >= 1.0`, seg.loadFactor >= 1.0);
    check(`Segment "${seg.name}" roughness >= 0`, seg.roughness >= 0);
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'─'.repeat(50)}`);
if (failed === 0) {
  console.log(`✓ All ${passed} checks passed.`);
  process.exit(0);
} else {
  console.error(`✗ ${failed} check(s) failed. ${passed} passed.`);
  process.exit(1);
}
