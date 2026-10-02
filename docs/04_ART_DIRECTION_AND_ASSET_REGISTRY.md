# Art Direction and Asset Registry

## 1. Art Philosophy
- **Style:** Pixel art, strictly retro.
- **Scaling:** Nearest-neighbor filtering ONLY. No anti-aliasing.
- **Palette:** Scrappy, muted metals, rust oranges, oily blacks, bright indicator colors (red for heat/alerts, blue for fuel, green for durability).
- **Perspective:** Side-scrolling for the run (car drives left-to-right). Garage UI is flat/schematic.

## 2. Asset Specifications
- **Base Resolution:** Art should be authored small (e.g., 32x32 for parts) and scaled up in-engine to remain crisp.
- **Formats:** PNG with transparency.

## 3. Asset Registry (VS1)

*Total Assets Required: 29*

### Vehicles & Environment
| ID | Filename | Dimensions | Usage & Animation Notes |
|---|---|---|---|
| `spr_chassis_rustbucket` | `chassis_rustbucket.png` | 64x32 | Side view of base car. Wheels separate. |
| `spr_wheel_base` | `wheel_base.png` | 16x16 | Wheel sprite. Rotates via code based on speed. |
| `bg_garage` | `bg_garage.png` | 360x640 | Cluttered workbench background. |
| `bg_road_sky` | `bg_road_sky.png` | 360x320 | Parallax background layer 1 (static/slow). |
| `bg_road_ground` | `bg_road_ground.png` | 360x320 | Parallax background layer 2 (fast scrolling floor). |

### UI & Icons
| ID | Filename | Dimensions | Usage & Animation Notes |
|---|---|---|---|
| `icon_scrap` | `icon_scrap.png` | 16x16 | Currency icon (a pile of bolts/gears). |
| `icon_stat_power` | `icon_power.png` | 16x16 | Engine/lightning bolt icon. |
| `icon_stat_fuel` | `icon_fuel.png` | 16x16 | Gas drop icon. |
| `icon_stat_cooling` | `icon_cooling.png` | 16x16 | Snowflake/fan icon. |
| `icon_stat_durability` | `icon_durability.png` | 16x16 | Shield/wrench icon. |
| `icon_stat_weight` | `icon_weight.png` | 16x16 | Anvil icon. |
| `btn_scavenge` | `btn_scavenge.png` | 96x32 | Button for buying parts. |
| `btn_drive` | `btn_drive.png` | 96x32 | Button to start run. |
| `ui_panel` | `ui_panel.png` | 9-slice | Base 9-slice border for UI containers. |

### Parts (15 Total)
*Naming convention: `part_[family]_t[tier].png`. Size: 32x32.*
- `part_engine_t1.png`, `part_engine_t2.png`, `part_engine_t3.png`
- `part_fuel_t1.png`, `part_fuel_t2.png`, `part_fuel_t3.png`
- `part_cooling_t1.png`, `part_cooling_t2.png`, `part_cooling_t3.png`
- `part_tires_t1.png`, `part_tires_t2.png`, `part_tires_t3.png`
- `part_suspension_t1.png`, `part_suspension_t2.png`, `part_suspension_t3.png`

### Effects (Code Driven / Simple Sprites)
- Smoke particles (white/grey/black based on heat/damage).
- Sparks (yellow/orange).
- Merge Effect (simple flash/sparkle when combining parts).
