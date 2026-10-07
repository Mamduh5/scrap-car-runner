# Game Data Bible

This document records existing VS1 content and the unchanged v1 disk contract, alongside the owner-approved continuous idle direction (2026-10-06). Existing numerical content is a provisional foundation snapshot, not locked checkpoint balance. No runtime schema or save version changes in this documentation task.

## Approved conceptual data direction (pending implementation)
Track three distinct owned-part locations: **Workbench / Merge Board** (finite, progression-expandable persistent active workspace), **Inventory** (retained general long-term items/parts; future non-part content possible), and **Equipped Parts** (Engine, Fuel Tank, Radiator/Cooling, Tires, Suspension). Only equipped entries plus chassis base affect active stats and installed visuals; board/inventory parts contribute nothing and merging must not consume/modify equipped parts implicitly.

Continuous state must represent physical checkpoint progression/unlocks, selected Progress/Push or Farm target, fuel/attempt state, equipped stats and reward/first-clear state independently of graphics. A Scrap Pile can be the first VS1 checkpoint type. Each checkpoint conceptually has repeatable Scrap and a one-time first-clear bonus (possibly parts). Farther normally pays more per successful clear, but not necessarily more Scrap/time; earlier unlocked checkpoint farming remains player-selected.

This is a conceptual contract, not a new TypeScript/save schema. Exact Workbench shape/dimensions/starting and maximum capacity/expansion costs and milestones, future Inventory expansion details, reward values/drop tables, fuel values, checkpoint distances, offline formula/cap, automation unlocks, selection UI and acquisition probabilities/economy remain TBD. Later schema work must conserve ownership, first-clear eligibility and selected intent and migrate known v1 saves explicitly; do not invent fields or increment the version here.

## Equipment and road-region design-level model (pending implementation)
A part definition must conceptually represent **Family + Type/Specialization + Tier**, plus future per-type tradeoff and compatibility metadata. Family alone is slot/category identity, not the complete performance/merge identity. Tier expresses strength within a type; a higher-tier wrong type can underperform a lower-tier suitable type.

| Concept | Required design meaning; exact encoding remains open |
|---|---|
| Family | Engine, Fuel Tank, Radiator/Cooling, Tires or Suspension subsystem |
| Type / Specialization | Intended road/surface, obstacle, role or farming strategy; catalog and names TBD |
| Tier | Strength within the specific type, not universal superiority across types |
| Tradeoffs | Meaningful suitability costs such as weight, speed, fuel consumption or off-terrain performance; values/formulas TBD |
| Compatibility | Interactions among equipped definitions, especially Engine/Radiator; metadata and formulas/thresholds TBD |
| Road Region / World Region | Groups multiple checkpoints; milestones may change presentation, terrain grammar, obstacle families, suitable types and later acquisition opportunities |
| Road / checkpoint conditions | Surface and physical obstacle composition against which equipped builds perform; not merely a stage number/hard stat gate |

This is a design-level model, not a replacement runtime interface or new save schema. Region names/counts/boundaries, terrain/obstacle formulas, checkpoint requirements, type unlocks and acquisition opportunities remain open. Reusable authored pieces can form multiple checkpoint challenges; no unique environment per checkpoint or fixed checkpoint ranges are required. Type catalogs/examples in D02 do not populate production tables. Fuel Tank specializations remain unapproved.

Only Equipped Parts contribute stats/performance and installed visuals. Inventory supports useful alternative push/farm builds, not just merge inputs. Dangerous Engine/Radiator combinations may cause catastrophic overheating/explosion and automatic checkpoint retry while preserving equipped ownership; no degradation, global durability requirement or involuntary permanent destruction is added.

Future data/save adaptation must represent type identity without conflating alternatives, preserve owned definition IDs and distinguish slot-family validity from performance compatibility. Exact ID encoding, metadata, runtime/save fields and migration remain future implementation decisions. Core matching requires equal family/type/tier and preserves type at the next tier; cross-type fusion is excluded, while optional future transformation remains unresolved. Acquisition now uses the approved source/investment model below; exact pools/rates/targeting controls/shop behavior remain open. No affix/rarity/rune/skill-tree/random-roll/proc/character-stat systems or preset/auto-swap features are introduced.

## Core merge compatibility: conceptual data only
Core merging requires two copies with the **same Family + same Type/Specialization + same Tier**, producing one **next-tier part of the same family and type**. Different families, types or tiers are invalid inputs; matching family and tier alone is insufficient. Type is persistent gameplay identity: no generic, random or hybrid output and no cross-type fusion/recipe graph.

Conceptual `canMerge(A, B)` requires `A.family == B.family`, `A.type == B.type`, and `A.tier == B.tier`; result family/type stay the same and tier advances to the next tier. These are identity requirements, not runtime code or a schema proposal. Ownership/location eligibility and exact result placement cell need separate interaction contracts; normal outputs belong on the Workbench. Existing generic Tier 3 rejection is unchanged; future specialized max-tier handling remains open.

Direct merging of equipped parts is currently disfavored / expected to require unequipping first, but final interaction behavior depends on Merge Board design. This is pending, not a locked equipped-input prohibition or mandatory unequip workflow. Merging must not unexpectedly modify the running vehicle. Special transformation components are an **optional future extension**, outside core merging and not required for VS1 or initial board design. Engine + special modification component → modified/specialized Engine is conceptual only; no component catalog, recipes, transformation rules, acquisition, balance, UI or unlocks are defined. Detailed transfer UX, exact Workbench capacity values, future Inventory expansion details and Multi-Merge/Auto-Merge behavior remain unresolved; no interface, IDs, balance, save fields or version changes.

## Merge Workshop state requirements (design only)
Persistent state must conceptually distinguish Workbench contents, retained general Inventory contents and Equipped Parts, plus finite Workbench capacity/expansion state and future automation unlock state where appropriate. Inventory can support future non-part content; categories remain open; base Inventory capacity is 150 item instances. Exact encoding, IDs, schema fields, migrations and unlock representation are not selected.

Normal merges are two Workbench parts → one next-tier same-type Workbench part. Merge Area input selection/preparation and temporary result presentation are interaction/feedback, not a fourth persistent storage location or authoritative Result slot. Exact placement, detailed transfer UX, Workbench full-space handling and scavenged-result presentation/destination remain open within approved Inventory rules. Future Multi-Merge/Auto-Merge follow learned manual merging with detailed rules unresolved (D02). No runtime interfaces, save version, catalog or balance change.

## Scavenge acquisition design-level model (pending implementation)
**Scavenge Source controls family/type availability and relative weights; Scrap search investment controls tier odds.** Randomness remains intentional, normally without an exact item guarantee. General Scavenge stays broad/relatively inexpensive/relevant; specialized sources provide targeting, typically at higher Scrap cost. Shared parts can occur in multiple sources. Source/checkpoint/region unlocks and scalable tier odds need not require duplicate tier-numbered sources. Scrap is the only approved acquisition currency.

| Conceptual data | Meaning; exact encoding/values remain open |
|---|---|
| Scavenge Source identity | ID plus source identity/name; final catalog/names/count TBD |
| Unlock state / requirement | Source eligibility, possibly checkpoint/region progression; exact conditions/mappings TBD |
| Scrap cost model | Source cost and interaction with investment; prices/multipliers/formulas TBD |
| Allowed / weighted families | Family availability and relative weighting, not guaranteed equipment |
| Allowed / weighted types | Specialization availability/weighting; supports shared parts across sources |
| Tier probability rules / reference | Base rules/reference modified by search investment and possibly progression/upgrades; exact distributions TBD |
| Progression availability | Which sources/types/search opportunities are available; unlock/scaling details TBD |
| Search Investment additional cost | Extra Scrap committed to improve higher-tier odds; exact levels/costs/control TBD |
| Search Investment tier modification | Changes tier probability without erasing the selected source's family/type identity |

This is conceptual data only: no runtime interface, source/drop table, save field, version bump, new currency or production balance change. Preserve existing definition IDs and ownership; selected-source/investment persistence scope and future migrations remain implementation decisions. First-clear interaction, guaranteed/pity mechanics, duplicate protection, reveal flow and automation limits/unlocks/configuration are unresolved. Acquisition feeds distinct specialized merge inputs; core compatibility requires matching family/type/tier and preserves the type. D02 owns detailed philosophy and the complete acquisition decision list.

## 1. Existing implementation data schemas (v1)

```typescript
type PartFamily = 'engine' | 'fuel' | 'cooling' | 'tires' | 'suspension';

interface PartDefinition {
  id: string; // e.g., 'engine_t1'
  family: PartFamily;
  tier: 1 | 2 | 3;
  name: string;
  stats: {
    power?: number;
    fuelCapacity?: number;
    cooling?: number;
    durability?: number;
    weight?: number;
  };
}

interface ChassisDefinition {
  id: string;
  name: string;
  baseStats: {
    power: number;
    fuelCapacity: number;
    cooling: number;
    durability: number;
    weight: number;
    maxHeat: number; // Fixed chassis property; does not change with installed parts in VS1
  };
  slots: PartFamily[]; // The required categorical slots
}

interface VehicleStats {
  power: number;
  fuelCapacity: number;
  cooling: number;
  durability: number;
  weight: number;
  maxHeat: number;
}

interface RoadSegment {
  startDistance: number;
  endDistance: number; // Infinity only for the final segment (static TS data, never JSON save data)
  name: string;
  loadFactor: number; // Multiplier for heat/fuel
  roughness: number;  // Damage over time modifier
}

// Increment CURRENT_SAVE_VERSION whenever the schema changes. Migration functions
// must handle all supported released prior versions; v1 is the only released schema now. Never read a save without checking this field.
const CURRENT_SAVE_VERSION = 1;

interface SaveData {
  version: number;                              // Must equal CURRENT_SAVE_VERSION
  scrap: number;                                // Current Scrap balance (integer, >= 0)
  inventory: string[];                          // Array of part IDs (e.g., ['engine_t1', 'fuel_t1']). Currently unbounded; target base is 150 item instances (not implemented). Duplicates represent separate copies, not stacks. No Merge Board field in v1.
  installedParts: Record<PartFamily, string | null>; // null = slot is empty
  bestDistance: number;                         // metres (float, >= 0)
}
```

## 2. Existing provisional content (VS1 foundation snapshot)

### Chassis
- **ID:** `chassis_rustbucket`
- **Name:** The Rustbucket
- **Base Stats:** Power: 10, Fuel: 20, Cooling: 5, Durability: 50, Weight: 100, MaxHeat: 100
- **Slots:** engine, fuel, cooling, tires, suspension

### Parts
*(Existing runtime stats are additive to chassis base. The family/tier-only catalog below does not yet encode specialization/terrain/Engine-Radiator interactions. It remains unchanged numerical evidence, not universal tier superiority or a final specialized catalog.)*

**Family: Engine (Provides Power, adds Weight)**
- `engine_t1`: Rusty Motor (Tier 1) - Power: +10, Weight: +10
- `engine_t2`: Salvaged V6 (Tier 2) - Power: +25, Weight: +15
- `engine_t3`: Rebuilt V8 (Tier 3) - Power: +60, Weight: +25

**Family: Fuel (Provides Fuel Capacity, adds Weight)**
- `fuel_t1`: Leaky Jerrycan (Tier 1) - Fuel: +20, Weight: +5
- `fuel_t2`: Welded Drum (Tier 2) - Fuel: +50, Weight: +10
- `fuel_t3`: Custom Tank (Tier 3) - Fuel: +120, Weight: +15

**Family: Cooling (Provides Cooling)**
- `cooling_t1`: Bent Fan (Tier 1) - Cooling: +10
- `cooling_t2`: Scavenged Radiator (Tier 2) - Cooling: +25
- `cooling_t3`: Dual-Fan Array (Tier 3) - Cooling: +60

**Family: Tires (Existing runtime durability buffer; target role is terrain specialization)**
- `tires_t1`: Bald Tires (Tier 1) - Durability: +10
- `tires_t2`: Patched Rubber (Tier 2) - Durability: +30
- `tires_t3`: Off-road Treads (Tier 3) - Durability: +70

**Family: Suspension (Existing runtime durability buffer; target role is obstacle specialization)**
- `suspension_t1`: Rusted Springs (Tier 1) - Durability: +10
- `suspension_t2`: Stiff Shocks (Tier 2) - Durability: +30
- `suspension_t3`: Heavy Duty Leaf (Tier 3) - Durability: +70

### Existing provisional economy (requires continuous-model adaptation)
- **Existing Scavenge baseline:** 10 Scrap gives one random Tier 1 part. This unchanged runtime cost/pool is not the final General-source price, source catalog or investment/tier distribution; new source/investment behavior requires future authorized adaptation.
- **Existing discrete-run reward (superseded design):** 5 Scrap guaranteed + 1 Scrap per 10m driven. This unchanged runtime formula is not the future checkpoint payout; repeat Scrap and first-clear bonuses require future implementation and balance.
- **Merge Cost:** 0 (Free).

### Existing provisional road segments: Scrapland Highway
- **ID:** `road_scrapland_highway`
- **0 - 100m (Outskirts):** LoadFactor: 1.0, Roughness: 0
- **100 - 300m (Cracked Pavement):** LoadFactor: 1.2, Roughness: 1
- **300 - 600m (Dirt Incline):** LoadFactor: 1.5, Roughness: 3
- **600m+ (Steep Rocky Pass):** LoadFactor: 2.0, Roughness: 5

*Note: Existing balance values are starting estimates, not approved exact fuel numbers, checkpoint distances or acquisition economy. Terrain boundaries are not checkpoint placements.*

### Save Loading, Decoding and Recovery

The v1 disk schema and primary key `scr_save_v1` remain compatible. Decoder output is always newly constructed canonical data; unknown root/slot fields are removed. Scrap is a nonnegative safe integer. Best distance is finite, nonnegative and at most Number.MAX_SAFE_INTEGER. Inventory retains only known string IDs (including legitimate duplicates). Each of the five installed keys must be null or a known matching-family ID. Known wrong-family entries transfer that exact owned copy to inventory and clear the slot; unknown IDs/types clear only the invalid ownership entry. Missing/malformed fields use zero/empty/null defaults, never invented starter parts.

| Scenario | Behavior |
|---|---|
| Primary key absent | Create canonical new state with the two starter inventory items; service queues its initial save |
| Storage read rejects | Initialization fails and may retry; never pretend the save is absent |
| Canonical v1 | Decode into fresh canonical data; retain valid progress |
| Damaged/missing-field v1 | Salvage valid fields and known ownership; preserve raw backup before writing repair |
| Invalid JSON/non-object JSON | Preserve raw backup, then recover empty progress; do not invent ownership |
| Unsupported/missing version (including 0, 0.5, 2, 99999) | Preserve raw backup and leave primary untouched; progress commands blocked until explicit reset |
| Backup write fails | Reject initialization; never replace the primary |
| Repair write fails | Reject initialization; primary/raw backup remain recoverable for retry |
| Explicit reset | Invalidate active run, replace live progress, serialize remove + canonical new write; retain recovery backup |

Backup key: `scr_save_recovery_v1`. It holds one latest raw damaged/unsupported value, bounded in count rather than an accumulating backup history. A repeated successful recovery load reads the repaired primary and does not overwrite that backup. It is not an export system or a guaranteed cloud backup; quota can prevent backup creation and storage clearing can erase both keys.

Only v1 is currently supported; no known older released schema exists to migrate. Do not accept an arbitrary lower version by casting it. When introducing v2, implement explicit migrations for known supported old versions and revalidate canonical semantics. Unsupported versions remain preserved until a supported implementation or explicit player reset handles them.

Provisional run coefficients are centralized in `src/domain/run/balance.ts`; see D02 §10 for existing-runtime equations and measured builds, not continuous checkpoint balance. The final road end uses Infinity only in static definitions; save JSON contains no Infinity sentinel.

## Inventory instance/capacity requirements (owner-approved 2026-10-07; design only)
Future data/save adaptation must support an **Inventory item-instance collection with base capacity 150**, each Part’s single authoritative location, persistent Workbench contents, Equipped Parts, currencies separate from item capacity and future Inventory-capacity upgrades. Identical Parts do not stack: each occupies one item slot. Scrap and future currencies consume no item slots unless separately designed otherwise; do not create currency instances. Capacity is neither weight nor family/category-specific. Family / Type or Specialization / Tier are the current organization dimensions.

Leaving Inventory immediately frees capacity. Future transitions must conserve instances and support atomic count-neutral equipment swaps at full Inventory, reject normal Unequip-to-Inventory and manual Scavenge when full, and allow Equipped→Workbench with room and normal Workbench merges regardless of Inventory fullness. Two Workbench inputs produce one Workbench result with temporary presentation only. Unavoidable item rewards that cannot enter Inventory may be held/delivered through Mail; manual Unequip and deliberate Scavenge overflow must not use it.

Dismantle deliberately removes a Part, grants small Scrap and frees its occupied slot; exact return, invocation location and UI remain open. Future permanent progression capacity rewards and optional paid capacity remain deferred directions. Preserve individual-instance capability without inventing per-item stats or production IDs/fields. The v1 disk interface, definition catalog, numeric content, decoder/recovery rules and save version remain unchanged; future supported migrations must preserve legitimate owned copies and separately tracked currencies. Mail’s eventual representation/delivery is a separate unresolved design, not a schema addition here.
