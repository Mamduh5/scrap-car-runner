# ART-02B Visual Correction Pass

This directory contains the accepted editable sources and review evidence for the ART-02B HUD and item additions.

## Task and Milestone Status
- **ART-02:** DONE (Golden UI samples benchmark approved)
- **ART-02B:** IN PROGRESS (Owner-reviewed production baseline established; lifecycle closeout pending)
- **VIS-01:** IN PROGRESS (Technical runtime proof completed; visual acceptance pending ART-02B lifecycle closeout)
- **ART-04:** BACKLOG (Approve exact Golden visual set, locked palette, full composition)
- **M0:** IN PROGRESS (Production Gates & Golden Visual Proofs)

*Note: The seven new ART-02B assets remain in `status: 'draft'` in `src/game/assets/assetRegistry.ts` until explicitly promoted through the canonical owner approval procedure.*

---

## Final Production Assets (Runtime)
The following seven files constitute the canonical runtime assets:
- `public/assets/icons/icon_stat_heat.png`
- `public/assets/icons/icon_stat_speed.png`
- `public/assets/icons/icon_ui_mail.png`
- `public/assets/parts/part_fuel_t1.png`
- `public/assets/parts/part_cooling_t1.png`
- `public/assets/parts/part_tires_t1.png`
- `public/assets/parts/part_suspension_t1.png`

---

## Canonical Editable Sources & Export Workflow
The canonical editable sources are genuine `.aseprite` masters located at:
- `art/source/golden/art02b/production/masters/icon_stat_heat/icon_stat_heat.aseprite`
- `art/source/golden/art02b/production/masters/icon_stat_speed/icon_stat_speed.aseprite`
- `art/source/golden/art02b/production/masters/icon_ui_mail/icon_ui_mail.aseprite`
- `art/source/golden/art02b/production/masters/part_fuel_t1/part_fuel_t1.aseprite`
- `art/source/golden/art02b/production/masters/part_cooling_t1/part_cooling_t1.aseprite`
- `art/source/golden/art02b/production/masters/part_tires_t1/part_tires_t1.aseprite`
- `art/source/golden/art02b/production/masters/part_suspension_t1/part_suspension_t1.aseprite`

Each master contains sensible editable layers (`lineart`, `base`, `details`).

### Authoritative Export Workflow
Exports do not depend on intermediate scripts. To export any master to runtime PNG format, use Aseprite directly via GUI or headless CLI:

```powershell
# Single asset export example (PowerShell):
& "D:\Mamduh\Program Files\Stearm\steamapps\common\Aseprite\aseprite.exe" --batch `
  art/source/golden/art02b/production/masters/part_fuel_t1/part_fuel_t1.aseprite `
  --save-as public/assets/parts/part_fuel_t1.png
```

All seven masters have been verified to reopen and export PNGs matching `public/assets/` 100% pixel-for-pixel.

---

## Accepted Visual Decisions (Concept A & B & C)

### Run Screen HUD (Concept A)
- **Scrap and Mail only:** Scrap counter at top-left (`icon_scrap`), Mail icon at top-right (`icon_ui_mail`).
- **No permanent telemetry:** Fuel, Heat, and Speed telemetry are completely removed from Run.
- **No dark backing plates:** Scrap and Mail render cleanly with transparent background without chunky panel plates, maximizing focus on vehicle, road, and environment.

### Garage Screen (Concept A)
- **Telemetry strip:** Tiny Fuel, Heat, and Speed indicators positioned compactly above the car, communicating live test state.
- **Global anchors:** Scrap (top-left) and Mail (top-right) remain visible as global anchors.
- **Lower screen free:** Lower area is preserved for future interaction and navigation UI.
- **No large dashboard panel:** No chunky dark backing boxes or oversized HUD containers.

### Five Equipment Families (Concept B)
- All five families established with distinct, handcrafted Tier 1 pixel art on a 24×24 canvas:
  - **Engine:** Existing Golden `part_engine_t1` (retained unchanged).
  - **Fuel Tank:** Horizontal welded red cylinder with metal mounting straps (`part_fuel_t1`).
  - **Cooling / Radiator:** High-contrast cooling-fin core with metallic vertical side tanks (`part_cooling_t1`).
  - **Tires:** Derived directly from approved Golden wheel artwork (`part_tires_t1`).
  - **Suspension:** Spring-and-strut shock absorber with distinct top/bottom mounts and coiled yellow spring around central strut (`part_suspension_t1`).

### New Stat & Global Icons (Concept C)
- 16×16 icons matching the visual grammar of `icon_scrap` and `icon_stat_fuel`:
  - `icon_stat_heat`: Thermometer with graduated bulb.
  - `icon_stat_speed`: Tachometer / gauge sweep.
  - `icon_ui_mail`: Sealed postal envelope with red seal.

---

## Validation and Evidence

### Validation Commands
```bash
git diff --check
npm run check
node tools/assets/proof_b2.mjs
```

### Retained Evidence Files
Located in `art/source/golden/art02b/production-review/`:
- `proof_c_run.png`: Runtime capture of minimal Run HUD (Scrap + Mail, full environment).
- `proof_d_garage.png`: Runtime capture of Garage screen with compact telemetry strip.
- `proof_b_five_family.png`: Native-size (1×) slot comparison of all five Tier 1 equipment items.
- `proof_e_icons.png`: Comparison of all five UI/telemetry icons.
- `contact_sheet.png`: Unified contact sheet summarizing the full visual delivery.

---

## Important Boundaries
- Do not redesign accepted assets or restore discarded HUD layouts (e.g. permanent Run telemetry or dark backing panels).
- Do not bypass canonical lifecycle promotion procedures.
