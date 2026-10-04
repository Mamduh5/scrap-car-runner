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
- ❌ Generic Lo-Fi Study Music (needs mechanical momentum, not pure relaxation).
- ❌ Childish/Cartoon Sound Design (no slide-whistles or boings).

## 2. Music Roles (VS1)
- **Garage:** "Garage planning loop." Relaxed, thoughtful, improvised mechanical rhythm to support repeated merging and engineering without fatigue.
- **Run:** "Road momentum loop." Optimistic, forward-driving, slightly tense but cheerful.

## 3. Instrument Vocabulary
- Muted/brushed drums and toolbox/junk percussion.
- Warm, rounded bass.
- Dry plucked strings, muted acoustic guitar, prepared/string-percussive textures.
- Restrained synth elements for lead melodies.
- Distorted or metallic mechanical accents.
- **Instrumental Only:** No vocals, lyrics, or vocal chops (canonical rule for VS1 to avoid repetition fatigue and unwanted AI artifacts).

## 4. Google Flow Music Production Workflow
Google Flow Music (e.g., Lyria) is the authorized music generation tool.

**Verification Checklist (External Verified Facts - Checked: 2026-10-04):**
- **Plan Entitlement & Commercial Use:** Flow Music has multiple access/subscription arrangements. Google AI Pro currently explicitly advertises Flow Music commercial-use rights. That does NOT automatically prove that every free/core/standard Flow Music generation carries the same commercial-use entitlement.
- **Download Capability:** Download -> choose a file format.

**Scrap Car Runner Production Policy:**
- **Pre-flight verification:** Before every production-generation batch, record the account/plan entitlement and verify current Google commercial-use terms.
- **Output Editing:** Generated tracks must be edited. The workflow assumes generations will be trimmed, crossfaded, and mastered to create a seamless loop.

**Music Consistency Strategy:**
Consistency is achieved via explicit controls, NOT by assuming tracks from the same generation session will "carry the vibe":
- Stick to the same instrument vocabulary and anti-pillars.
- Use related BPM families.
- Establish and request a recurring **Scrap Car Runner Musical Motif** (e.g., a recognizable rhythmic or mechanical-percussive figure) in both Garage and Run tracks to share musical DNA.
- Use approved Golden tracks as a listening benchmark.
- Use audio reference input when supported by Flow Music and only if it produces quality results (human listening remains the authority).

**Workflow:**
1. **Sonic Brief:** Define role, mood, energy, instruments.
2. **Flow Music Prompt:** Generate variants using the canonical template (optionally using the first Golden track as a reference).
3. **Selection:** Review against pillars and select the best candidate.
4. **Editing:** Trim, align musical bars, crossfade, and master to create a seamless loop.
5. **Export:** Export Source Master (WAV).
6. **Encode:** Encode Runtime Versions (MP3).
7. **In-game QA:** Audition on phone speakers and headphones.

**Reusable Prompt Template:**
```text
TRACK ID / ROLE: [e.g., bgm_garage / Garage planning loop]
GAME SONIC IDENTITY: Chunky handmade scrapyard engineering, cheerful improvised machinery
PURPOSE: [e.g., Repeated engineering and merging / Auto-driving momentum]
MOOD: Resourceful, cheerful, mechanically handmade, optimistic
ENERGY: [Low / Medium / High]
TEMPO / BPM RANGE: [e.g., 90 - 105 BPM]
INSTRUMENT VOCABULARY: Toolbox/junk percussion, muted drums, warm bass, dry plucked strings
RHYTHMIC CHARACTER: Steady, mechanical, handmade
MELODIC CHARACTER: Restrained, catchy, retro
MOTIF / SHARED MUSICAL DNA: Include a recognizable mechanical-percussive rhythmic signature
ARRANGEMENT DENSITY: Sparse to allow for SFX clarity
VOCALS POLICY: Instrumental only. No vocals. No lyrics.
TARGET LENGTH: 1 to 2 minutes
LOOP / ENDING BEHAVIOR: Must have consistent rhythm to allow seamless looping
REFERENCE TRACK / AUDIO IF APPLICABLE: [Link or None]
AVOID / ANTI-PILLARS: Cyberpunk, generic 8-bit, heavy metal, aggressive EDM, cartoon sounds
PHONE-SPEAKER CONSIDERATIONS: Avoid relying on deep sub-bass; emphasize mid-range clarity
```

**Duration Policy:**
- **Golden Proof Generation:** Generate enough duration (e.g., 60-120s) to judge melody, groove, arrangement, and loop potential.
- **Final Production Track:** Duration is determined after repetition testing. The Garage loop may require more variation as players spend significant time there.

## 5. Sound Effects Direction
SFX will be handcrafted, synthesized, or sourced from licensed libraries. Flow Music will NOT be forced to generate one-shot mechanical SFX.

- **UI:** Tactile, satisfying clicks and metallic snaps.
- **Engineering:** Chunky installs, metallic clanks for merges (merges must feel significantly more meaningful than UI clicks).
- **Engine/Road:** A single stylized looping engine sound that scales pitch/volume with speed/load. Avoid hyper-realistic simulators.
- **Warnings:** Distinct, readable alarms that don't pierce the ears (e.g., rhythmic buzzer for heat).
- **Spam Policy:** Handled via `audioRegistry.ts` using `maxInstances` (simultaneous limits). True retrigger/cooldown limits will be added if runtime testing proves `maxInstances` is insufficient.

## 6. Runtime Audio Architecture
- **Service:** `AudioService` wraps Phaser’s SoundManager and acts as the sole owner of playback intent.
- **Lifecycle Ownership:** 
  - Phaser executes playback and handles visibility-hidden pauses automatically.
  - `AudioService` tracks user-configured mutes/volumes and listens to Phaser's `unlocked` event to resume music if playback was requested before Web Audio API unlock.
- **Mixing Categories:** Master, Music, SFX. Mute semantics are strictly boolean logic layered on top of volume (unmuting restores the exact previous volume). Changes to category volume dynamically update actively playing sounds (including looping SFX like engines).
- **Format Policy:** **MP3** is chosen as the single runtime format for universal compatibility across web browsers, Android WebView, and older iOS Safari without fallback bloat.
- **Loudness Policy:** Target consistent relative loudness. Documented target: roughly -14 to -16 LUFS for music, allowing SFX headroom to sit clearly above without clipping the master bus. Final perceptual balance must be judged in-game.
- **Settings Persistence:** Left in memory for VS1 preparation. Audio preferences must persist to save data before meaningful user-facing release/playtest.

## 7. File Structure & Formats

**Master Format Policy:**
- **RAW SOURCE:** Preserve exactly as obtained (e.g., raw MP4/MP3 download from Flow).
- **EDITING SESSION:** Use the DAW/project's appropriate working precision.
- **PRODUCTION MASTER:** Lossless WAV or equivalent. Avoid unnecessary resampling. Preserve suitable production bit depth.
- **RUNTIME EXPORT:** Encode separately for game delivery (MP3).

**Source & Masters:** (Archived, not bundled in game)
```text
art/source/audio/
  music/ (source files, WAV masters)
  sfx/ (source files, WAV masters)
  provenance.json
```

**Runtime:** (Bundled)
```text
public/assets/audio/
  music/ (MP3)
  sfx/ (MP3)
```

## 8. Provenance & Licensing
All approved AI-generated music and sourced SFX must be tracked in `art/source/audio/provenance.json`.
Required fields for AI music:
- `id`
- `tool` (e.g., Google Flow Music)
- `model` (if known)
- `generationDate`
- `sourcePrompt` (and reference inputs if used)
- `originalGeneratedFilename`
- `editingPerformed`
- `licenseTermsReference`
- `entitlement` (e.g., "Google AI Pro")
- `approvalDate`

Maintain raw source files alongside the edited master for future remastering. Do not overwrite raw Flow output.

## 9. Audio Validation
Controlled by `tools/assets/validateAudio.ts`.
- **Preparation Mode:** Missing required audio files trigger a warning but allow the build to pass.
- **Strict Mode:** Missing required audio files will explicitly fail validation. (Enabled automatically once Golden Audio production begins; do not create fake files to pass this).

## 10. Golden Audio Set (Production Order)
Do NOT mass-produce assets or evaluate music in isolation. Prove the riskiest assumptions early:

1. Generate Garage music candidates
2. Approve one provisional Golden Garage track
3. Establish Motif / Musical DNA
4. Generate Run candidates against that reference
5. Approve Garage + Run as a PAIR
6. Create `sfx_engine_loop` (Engine loop must be auditioned at minimum, normal, and maximum expected playback rates. Listen for artifacting or tonal repetition fatigue. If one loop cannot survive the expected range, a low/idle + high/load multi-loop approach may be evaluated).
7. Create `sfx_mech_merge`
8. Create `sfx_ui_click`
9. Create `sfx_run_fail`
10. Mix all six together in-game
11. Approve Golden Audio Set
12. Only then expand production

**Approval Gate:**
- **Music Identity:** Garage and Run sound like the same game; motif is recognizable; not generic; no accidental cyberpunk/chiptune vibes.
- **Repetition:** Garage survives at least ~10 minutes of repeated listening; Run survives repeated restarts.
- **Engine:** Pitch range works; loop is seamless; long exposure is tolerable; doesn't mask feedback.
- **Interaction SFX:** Click is not irritating; merge feels significantly more meaningful than a UI click; failure is clear but not punishing.
- **Mix:** Music/SFX/engine coexist; important sounds are audible; no obvious clipping.
- **Device:** Checked on both phone speaker and headphones.
