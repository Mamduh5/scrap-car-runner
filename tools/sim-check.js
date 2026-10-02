#!/usr/bin/env node
/**
 * sim-check.js — Scrap Car Runner Balance Simulator
 *
 * PURPOSE:
 *   Deterministic run simulator using the formulas defined in
 *   docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md §3.
 *   Use this to verify formula sanity and inspect balance before
 *   implementing the actual Phaser game.
 *
 * WARNING:
 *   All numbers here are PROVISIONAL starting estimates.
 *   Balance WILL require playtesting. This tool only checks
 *   internal formula consistency and gives rough distance expectations.
 *
 * HOW TO RUN:
 *   node tools/sim-check.js
 *
 * NO DEPENDENCIES. No Phaser. No assets. No game state.
 */

'use strict';

// ---------------------------------------------------------------------------
// CANONICAL DATA (must mirror docs/03_GAME_DATA_BIBLE.md)
// ---------------------------------------------------------------------------

const CHASSIS = {
  id: 'chassis_rustbucket',
  name: 'The Rustbucket',
  baseStats: {
    power:        10,
    fuelCapacity: 20,
    cooling:       5,
    durability:   50,
    weight:      100,
    maxHeat:     100,
  },
  slots: ['engine', 'fuel', 'cooling', 'tires', 'suspension'],
};

const PARTS = {
  // Engine family
  engine_t1: { family: 'engine',     tier: 1, name: 'Rusty Motor',       stats: { power: 10,           weight: 10 } },
  engine_t2: { family: 'engine',     tier: 2, name: 'Salvaged V6',       stats: { power: 25,           weight: 15 } },
  engine_t3: { family: 'engine',     tier: 3, name: 'Rebuilt V8',        stats: { power: 60,           weight: 25 } },
  // Fuel family
  fuel_t1:   { family: 'fuel',       tier: 1, name: 'Leaky Jerrycan',    stats: { fuelCapacity: 20,    weight:  5 } },
  fuel_t2:   { family: 'fuel',       tier: 2, name: 'Welded Drum',       stats: { fuelCapacity: 50,    weight: 10 } },
  fuel_t3:   { family: 'fuel',       tier: 3, name: 'Custom Tank',       stats: { fuelCapacity: 120,   weight: 15 } },
  // Cooling family
  cooling_t1:    { family: 'cooling',    tier: 1, name: 'Bent Fan',          stats: { cooling: 10 } },
  cooling_t2:    { family: 'cooling',    tier: 2, name: 'Scavenged Radiator', stats: { cooling: 25 } },
  cooling_t3:    { family: 'cooling',    tier: 3, name: 'Dual-Fan Array',    stats: { cooling: 60 } },
  // Tires family
  tires_t1:  { family: 'tires',      tier: 1, name: 'Bald Tires',        stats: { durability: 10 } },
  tires_t2:  { family: 'tires',      tier: 2, name: 'Patched Rubber',    stats: { durability: 30 } },
  tires_t3:  { family: 'tires',      tier: 3, name: 'Off-road Treads',   stats: { durability: 70 } },
  // Suspension family
  suspension_t1: { family: 'suspension', tier: 1, name: 'Rusted Springs',    stats: { durability: 10 } },
  suspension_t2: { family: 'suspension', tier: 2, name: 'Stiff Shocks',      stats: { durability: 30 } },
  suspension_t3: { family: 'suspension', tier: 3, name: 'Heavy Duty Leaf',   stats: { durability: 70 } },
};

// Road: Scrapland Highway (id: road_scrapland_highway)
const ROAD_SEGMENTS = [
  { name: 'Outskirts',        startDistance:    0, endDistance:  500, loadFactor: 1.0, roughness: 0 },
  { name: 'Cracked Pavement', startDistance:  500, endDistance: 1500, loadFactor: 1.2, roughness: 1 },
  { name: 'Dirt Incline',     startDistance: 1500, endDistance: 3000, loadFactor: 1.5, roughness: 3 },
  { name: 'Steep Rocky Pass', startDistance: 3000, endDistance:   -1, loadFactor: 2.0, roughness: 5 },
];

// ---------------------------------------------------------------------------
// SIMULATION LOGIC (mirrors docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md §3)
// ---------------------------------------------------------------------------

function getRoadSegment(distance) {
  for (let i = ROAD_SEGMENTS.length - 1; i >= 0; i--) {
    if (ROAD_SEGMENTS[i].startDistance <= distance) return ROAD_SEGMENTS[i];
  }
  return ROAD_SEGMENTS[0];
}

function calculateVehicleStats(installedPartIds) {
  const stats = { ...CHASSIS.baseStats };
  for (const id of installedPartIds) {
    if (!id) continue;
    const part = PARTS[id];
    if (!part) { console.warn(`Unknown part ID: ${id}`); continue; }
    for (const [k, v] of Object.entries(part.stats)) {
      stats[k] = (stats[k] || 0) + v;
    }
  }
  return stats;
}

function simulateRun(vehicleStats, options = {}) {
  const {
    dt = 0.016,           // seconds per tick (≈ 60fps)
    maxSeconds = 3600,    // safety cap (1 hour of sim time)
    verbose = false,
  } = options;

  const { power, fuelCapacity, cooling, durability, weight, maxHeat } = vehicleStats;

  let distance    = 0;
  let fuel        = fuelCapacity;
  let heat        = 0;
  let hp          = durability;
  let elapsed     = 0;
  let failCause   = null;
  let segmentLog  = [];
  let lastSegName = null;

  while (elapsed < maxSeconds) {
    const seg = getRoadSegment(distance);
    if (seg.name !== lastSegName) {
      if (verbose) segmentLog.push({ at: Math.round(distance), segment: seg.name });
      lastSegName = seg.name;
    }

    // Formulas (per-second rates × dt)
    const speed     = power / weight;
    const heatDelta = (power * seg.loadFactor) - cooling;
    const fuelBurn  = (power * seg.loadFactor) / 10;

    distance += speed * dt;
    heat      = Math.max(0, Math.min(maxHeat, heat + heatDelta * dt));
    fuel      = Math.max(0, fuel - fuelBurn * dt);
    hp        = Math.max(0, hp - seg.roughness * dt);
    elapsed  += dt;

    // Failure checks
    if (fuel <= 0)      { failCause = 'out_of_gas';   break; }
    if (heat >= maxHeat){ failCause = 'overheated';    break; }
    if (hp   <= 0)      { failCause = 'breakdown';     break; }
  }

  if (!failCause) failCause = 'timeout';

  const scrapEarned = 5 + Math.floor(distance / 10);
  return { distance: Math.round(distance), elapsed: Math.round(elapsed), failCause, scrapEarned, segmentLog, finalHeat: Math.round(heat), finalFuel: Math.round(fuel * 10) / 10, finalHp: Math.round(hp * 10) / 10 };
}

// ---------------------------------------------------------------------------
// SCENARIO DEFINITIONS
// ---------------------------------------------------------------------------

const scenarios = [
  {
    label: 'Bare chassis (no parts)',
    parts: [],
  },
  {
    label: 'Starter: engine_t1 + fuel_t1 (starting inventory)',
    parts: ['engine_t1', 'fuel_t1'],
  },
  {
    label: 'T1 full build: all 5 families at Tier 1',
    parts: ['engine_t1', 'fuel_t1', 'cooling_t1', 'tires_t1', 'suspension_t1'],
  },
  {
    label: 'T2 full build: all 5 families at Tier 2',
    parts: ['engine_t2', 'fuel_t2', 'cooling_t2', 'tires_t2', 'suspension_t2'],
  },
  {
    label: 'T3 full build: all 5 families at Tier 3',
    parts: ['engine_t3', 'fuel_t3', 'cooling_t3', 'tires_t3', 'suspension_t3'],
  },
  {
    label: 'T3 engine, all others T1 (speed focus)',
    parts: ['engine_t3', 'fuel_t1', 'cooling_t1', 'tires_t1', 'suspension_t1'],
  },
  {
    label: 'T1 engine, T3 fuel, T1 cooling (fuel focus)',
    parts: ['engine_t1', 'fuel_t3', 'cooling_t1', 'tires_t1', 'suspension_t1'],
  },
  {
    label: 'T1 engine + T3 cooling (heat ceiling test)',
    parts: ['engine_t1', 'fuel_t1', 'cooling_t3', 'tires_t1', 'suspension_t1'],
  },
];

// ---------------------------------------------------------------------------
// SANITY CHECKS
// ---------------------------------------------------------------------------

function runSanityChecks() {
  const issues = [];

  // Verify all part IDs are unique
  const ids = Object.keys(PARTS);
  const unique = new Set(ids);
  if (ids.length !== unique.size) issues.push('Duplicate part IDs detected.');

  // Verify chassis slot families match PartFamily type
  const validFamilies = new Set(['engine', 'fuel', 'cooling', 'tires', 'suspension']);
  for (const slot of CHASSIS.slots) {
    if (!validFamilies.has(slot)) issues.push(`Unknown chassis slot family: ${slot}`);
  }

  // Verify all parts belong to a valid family
  for (const [id, part] of Object.entries(PARTS)) {
    if (!validFamilies.has(part.family)) issues.push(`Part ${id} has invalid family: ${part.family}`);
    if (part.tier < 1 || part.tier > 3) issues.push(`Part ${id} has out-of-range tier: ${part.tier}`);
  }

  // Verify road segments are contiguous and ordered
  let lastEnd = 0;
  for (const seg of ROAD_SEGMENTS) {
    if (seg.startDistance !== lastEnd) issues.push(`Road gap or overlap at ${seg.name}: expected start ${lastEnd}, got ${seg.startDistance}`);
    lastEnd = seg.endDistance === -1 ? Infinity : seg.endDistance;
  }

  // Verify no division by zero in speed formula
  if (CHASSIS.baseStats.weight === 0) issues.push('Chassis base weight is 0 — Speed would divide by zero.');

  // Verify MaxHeat is positive
  if (CHASSIS.baseStats.maxHeat <= 0) issues.push('Chassis maxHeat is <= 0 — overheat can never be reached.');

  return issues;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

function main() {
  console.log('='.repeat(72));
  console.log(' SCRAP CAR RUNNER — Balance Simulator');
  console.log(' WARNING: All numbers are provisional estimates. Playtesting required.');
  console.log('='.repeat(72));

  // Sanity checks first
  console.log('\n--- Sanity Checks ---');
  const issues = runSanityChecks();
  if (issues.length === 0) {
    console.log('✓ All sanity checks passed.\n');
  } else {
    for (const issue of issues) console.error(`✗ ${issue}`);
    console.error(`\n${issues.length} issue(s) found. Fix these before relying on sim results.\n`);
  }

  // Run scenarios
  console.log('--- Simulation Results ---\n');
  for (const scenario of scenarios) {
    const stats = calculateVehicleStats(scenario.parts);
    const result = simulateRun(stats, { verbose: false });
    const speed = (stats.power / stats.weight).toFixed(3);

    console.log(`Scenario: ${scenario.label}`);
    console.log(`  Parts:        ${scenario.parts.join(', ') || '(none)'}`);
    console.log(`  Stats:        Power=${stats.power} Fuel=${stats.fuelCapacity} Cool=${stats.cooling} Durability=${stats.durability} Weight=${stats.weight} MaxHeat=${stats.maxHeat}`);
    console.log(`  Speed:        ${speed} m/s`);
    console.log(`  Result:       ${result.distance}m in ${result.elapsed}s → ${result.failCause}`);
    console.log(`  Scrap Earned: ${result.scrapEarned}`);
    console.log(`  At failure:   Fuel=${result.finalFuel} Heat=${result.finalHeat} HP=${result.finalHp}`);
    console.log('');
  }

  // Soft-lock analysis
  console.log('--- Soft-Lock Analysis ---');
  console.log('Starting state: 0 Scrap, inventory = [engine_t1, fuel_t1] (not yet installed)');
  console.log('Scenario: Player installs both starter parts, runs, earns minimum 5 Scrap.');
  const starterStats = calculateVehicleStats(['engine_t1', 'fuel_t1']);
  const starterRun = simulateRun(starterStats);
  console.log(`  First run distance:  ${starterRun.distance}m → ${starterRun.failCause} → Earned: ${starterRun.scrapEarned} Scrap`);
  console.log(`  After 2 minimum-reward runs: ${2 * 5} Scrap → can Scavenge once (costs 10 Scrap)`);
  const canAffordScavenge = (starterRun.scrapEarned * 1) >= 10 || (starterRun.scrapEarned * 2) >= 10;
  console.log(`  Soft-lock risk: ${canAffordScavenge ? 'NONE — player can always afford 1 Scavenge within 2 runs' : 'POTENTIAL — review minimum reward'}`);
  console.log('');

  // Division-by-zero check
  console.log('--- Edge Case Checks ---');
  const bareStats = calculateVehicleStats([]);
  console.log(`Bare chassis speed: ${(bareStats.power / bareStats.weight).toFixed(4)} m/s (Power=${bareStats.power}, Weight=${bareStats.weight})`);
  if (bareStats.weight === 0) console.error('✗ DIVISION BY ZERO: chassis weight is 0!');
  else console.log('✓ No division by zero in speed formula.');

  const maxCooling = calculateVehicleStats(['cooling_t3']);
  const heatAtOutskirts = (maxCooling.power * 1.0) - maxCooling.cooling;
  console.log(`Max-cooling scenario: HeatDelta at Outskirts = ${heatAtOutskirts.toFixed(1)}/s (${heatAtOutskirts < 0 ? 'negative → heat decreases ✓' : 'positive → heat accumulates'})`);

  console.log('\n' + '='.repeat(72));
  console.log(' Done. Review results above before tuning balance values.');
  console.log('='.repeat(72));
}

main();
