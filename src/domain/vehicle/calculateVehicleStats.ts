/**
 * domain/vehicle/calculateVehicleStats.ts
 *
 * Pure function: computes the combined VehicleStats for a chassis with
 * a set of installed parts. No Phaser. No side effects.
 *
 * Canonical formula source: docs/02_GAMEPLAY_SYSTEMS_AND_PROGRESSION.md §2
 *   Total Stats = Chassis Base Stats + Sum of Installed Parts' Stats
 */

import type {
  ChassisDefinition,
  PartDefinition,
  VehicleStats,
} from '@/types/game';

/**
 * Calculate effective vehicle stats.
 *
 * @param chassis  - The chassis definition (provides base stats)
 * @param parts    - Array of installed part definitions (may be empty)
 * @returns        - Combined VehicleStats; all fields are numbers >= 0
 */
export function calculateVehicleStats(
  chassis: ChassisDefinition,
  parts: readonly PartDefinition[],
): VehicleStats {
  let power        = chassis.baseStats.power;
  let fuelCapacity = chassis.baseStats.fuelCapacity;
  let cooling      = chassis.baseStats.cooling;
  let durability   = chassis.baseStats.durability;
  let weight       = chassis.baseStats.weight;
  const maxHeat    = chassis.baseStats.maxHeat; // Not modified by parts in VS1

  for (const part of parts) {
    power        += part.stats.power        ?? 0;
    fuelCapacity += part.stats.fuelCapacity ?? 0;
    cooling      += part.stats.cooling      ?? 0;
    durability   += part.stats.durability   ?? 0;
    weight       += part.stats.weight       ?? 0;
  }

  return {
    power:        Math.max(0, power),
    fuelCapacity: Math.max(0, fuelCapacity),
    cooling:      Math.max(0, cooling),
    durability:   Math.max(0, durability),
    weight:       Math.max(1, weight), // weight must never be 0 (division in speed formula)
    maxHeat:      Math.max(1, maxHeat),
  };
}
