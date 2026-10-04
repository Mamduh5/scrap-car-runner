# Audio Direction and Production

This document serves as the canonical source of truth for the audio foundation of **Scrap Car Runner**.

## 1. Sonic Identity

**Sonic Identity Statement:** 
> Chunky handmade scrapyard engineering + cheerful improvised machinery + dusty roadside travel + a questionable machine slowly becoming capable.

**Sonic Pillars:**
1. **Handmade Mechanical Rhythm:** Percussion should sound like it was constructed from toolbox items, ratchets, taps, and mechanical improvisation.
2. **Warm Road-Trip Momentum:** Melodies should provide forward momentum and optimism without being aggressively fast.
3. **Restrained Retro Character:** Use modern production clarity (warm bass, good mix) while keeping a retro thematic character—no pure generic 8-bit chiptune unless it specifically serves the scrapyard aesthetic.

**Anti-Pillars (What NOT to do):**
- ❌ Generic Chiptune (no arcade bleep-bloop just because it's pixel art).
- ❌ Cyberpunk Synthwave (no high-tech arpeggios).
- ❌ Aggressive EDM/Metal (this is not a high-speed racing game).
- ❌ Lo-Fi Study Beats (needs mechanical momentum, not pure relaxation).
- ❌ Cartoon Sound Design (no slide-whistles or boings).

## 2. Music Roles (VS1)
- **Garage:** "Garage planning loop." Relaxed, thoughtful, improvised mechanical rhythm to support repeated merging and engineering without fatigue.
- **Run:** "Road momentum loop." Optimistic, forward-driving, slightly tense but cheerful.

## 3. Instrument Vocabulary
- Muted/brushed drums and toolbox percussion.
- Warm, rounded bass.
- Plucked strings or acoustic-adjacent textures (e.g., stylized banjo/guitar).
- Light, airy synths for lead melodies.
- Distorted or metallic mechanical taps.
- **No Vocals** (no lyrics or vocal chops to avoid repetition fatigue).

## 4. Google Flow Music Production Workflow
Google Flow Music (e.g., Lyria) is the authorized music generation tool.

**Verification Checklist (before commercial release):**
- Confirm current terms allow commercial usage in a mobile game.
- Ensure duration capabilities are sufficient for 60s+ loops.
- Avoid building runtime dependencies; generations MUST be exported as local assets.

**Workflow:**
1. **Sonic Brief:** Define role, mood, energy, instruments.
2. **Flow Music Prompt:** Generate several variants using the canonical template.
3. **Selection:** Review against pillars and select the best candidate.
4. **Editing:** Trim, crossfade, and master to create a seamless loop.
5. **Export:** Export Source Master (WAV).
6. **Encode:** Encode Runtime Versions (OGG, MP3).
7. **In-game QA:** Audition on phone speakers and headphones.

**Reusable Prompt Template:**
```text
ROLE: [Garage / Road]
PURPOSE: [e.g., Repeated engineering and merging / Auto-driving momentum]
MOOD: Resourceful, cheerful, mechanically handmade, optimistic
INSTRUMENTS: Toolbox percussion, muted drums, warm bass, plucked strings
AVOID: Cyberpunk, generic 8-bit, heavy metal, aggressive EDM, vocals, lyrics
DURATION: 1 to 2 minutes
LOOP: Must have consistent rhythm to allow seamless looping
```

## 5. Sound Effects Direction
SFX will be handcrafted, synthesized, or sourced from licensed libraries. Flow Music will NOT be forced to generate one-shot mechanical SFX.

- **UI:** Tactile, satisfying clicks and metallic snaps.
- **Engineering:** Chunky installs, metallic clanks for merges.
- **Engine/Road:** A single stylized looping engine sound that scales pitch/volume with speed/load. Avoid hyper-realistic simulators.
- **Warnings:** Distinct, readable alarms that don't pierce the ears (e.g., rhythmic buzzer for heat).
- **Spam Policy:** Retriggering must have cooldowns (max instances) to avoid machine-gun clipping (handled via `audioRegistry.ts`).

## 6. Runtime Audio Architecture
- **Service:** `AudioService` wraps Phaser’s SoundManager.
- **Mixing Categories:** Master, Music, SFX.
- **Mute & Volume:** Controlled via `AudioService` (in-memory for now; persistence deferred until global settings save schema is built).
- **Lifecycle:** Browser pagehide/visibility changes naturally pause audio. Phaser handles context unlock automatically on first user gesture.
- **Format:** OGG as primary, MP3 as fallback.
- **Loudness:** Target consistent relative loudness. SFX should sit clearly above music without clipping the master bus.

## 7. File Structure & Formats

**Source & Masters:** (Archived, not bundled in game)
```text
art/source/audio/
  music/
    raw_generations/
    masters/ (WAV 44.1kHz 16-bit)
  sfx/
    masters/ (WAV 44.1kHz 16-bit)
```

**Runtime:** (Bundled)
```text
public/assets/audio/
  music/ (OGG, MP3)
  sfx/ (OGG, MP3)
```

## 8. Provenance & Licensing
Because AI generation is used, maintain `art/source/audio/provenance.json` recording:
- `id`
- `tool` (e.g., Google Flow Music)
- `generationDate`
- `sourcePrompt`
- `licenseTermsReference`

Do not delete raw generations; preserve them alongside the edited master for future remastering.

## 9. Golden Audio Set (Production Order)
Do NOT mass-produce assets. Produce and approve this set first:
1. `bgm_garage` (Music)
2. `sfx_mech_merge` (SFX)
3. `sfx_engine_loop` (SFX)
4. `sfx_ui_click` (SFX)
5. `sfx_run_fail` (SFX)

**Approval Gate:**
- Do they feel like the same game?
- Does it survive 10 minutes of repetition?
- Is it audible and pleasant on phone speakers?
- Do warnings read clearly without being painful?
