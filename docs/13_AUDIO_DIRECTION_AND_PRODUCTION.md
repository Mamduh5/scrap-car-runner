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
- **Download Capability:** Flow Music provides downloadable generated audio. Available download/export formats should be verified at the time of production. Google's broader data-export mechanisms may use different formats from normal direct-download workflows.

**Scrap Car Runner Production Policy:**
- **Pre-flight verification:** Before every production-generation batch, record the account/plan entitlement and verify current Google commercial-use terms.
- **Output Editing:** Generated tracks must be edited. The workflow assumes generations will be trimmed, crossfaded, and mastered to create a seamless loop. The project should preserve the highest-quality source available exactly as received.

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
5. **Export:** Export Source Master (WAV or equivalent lossless format).
6. **Encode:** Encode Runtime Versions (format chosen post-Golden testing).
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
- **Format Policy:** **PROVISIONAL UNTIL GOLDEN AUDIO RUNTIME TESTING**. Select a browser-stage runtime encode through actual Golden Audio gapless loop testing in Phaser on desktop and physical mobile browsers. Native/WebView delivery stays provisional until Android testing (D14 AND-04); browser sonic approval may unlock VS1 production without claiming final cross-platform codec approval. The current `.mp3` extension in `audioRegistry.ts` is provisional, not canonical delivery evidence.
- **Loudness Policy:** Target consistent relative loudness. Documented target: roughly -14 to -16 LUFS for music, allowing SFX headroom to sit clearly above without clipping the master bus. Final perceptual balance must be judged in-game.
- **Settings Persistence:** Left in memory for VS1 preparation. Audio preferences must persist to save data before meaningful user-facing release/playtest.

## 7. File Structure & Formats

**Source, Master & Runtime Format Policy:**
- **RAW SOURCE:** Preserve exactly as obtained (raw generation files in their ORIGINAL formats). The actual source format is recorded in provenance.
- **EDITING SESSION:** Use the DAW/project's appropriate working precision.
- **PRODUCTION MASTER:** Create/retain an approved lossless production master after editing, loop preparation and mastering. Avoid unnecessary resampling and destructive transcoding.
- **RUNTIME EXPORT:** Browser-stage choice follows Golden browser testing of seamless looping, compatibility, quality, filesize and decoding. Native/WebView suitability is confirmed later; retain masters for re-encoding if necessary. No codec is predetermined.

**Source & Masters:** (Archived, not bundled in game)
```text
art/source/audio/
  music/ (raw generation files in original formats, editable session files, approved lossless masters)
  sfx/ (editable session files, approved lossless masters)
  provenance.json
```

**Runtime:** (Bundled)
```text
public/assets/audio/
  music/ (Provisional until Golden testing)
  sfx/ (Provisional until Golden testing)
```

## 8. Provenance & Licensing
All approved AI-generated music and sourced SFX must be tracked in `art/source/audio/provenance.json`.
Required fields for AI music:
- `id`
- `tool` (e.g., Google Flow Music)
- `model` (if known)
- `generationDate`
- `sourcePrompt` (and reference inputs if used)
- `sourceFilename` (the original filename)
- `sourceFormat` (the original format, e.g., MP4/MP3/WAV)
- `editingPerformed`
- `licenseTermsReference`
- `entitlement` (e.g., "Google AI Pro")
- `approvalDate`

Maintain raw source files alongside the edited master for future remastering. Do not overwrite raw Flow output.

## 9. Audio Validation
The executable, read-only gate is `tools/assets/validateAudio.ts`. Its CLI adapts the independently callable `validateAudio()` core and does not run when imported. File access is injected for controlled tests. Registry `runtimeAudioUrls()` returns URLs relative to `public/assets/`; the filesystem adapter joins them to that root, so `audio/music/bgm_garage.mp3` resolves to `public/assets/audio/music/bgm_garage.mp3`. The former `public/audio/` location is not accepted.

### Implemented commands and stages

| Stage | Command | Required presence and meaning |
|---|---|---|
| Preparation (default) | `npm run validate:audio` | Registry/provenance integrity and all present audio exports. Absent required VS1 entries are warnings; no produced audio and `[]` provenance are allowed. Output explicitly says PREPARATION ONLY. |
| Golden | `npm run validate:audio:golden` | Required VS1 entries with canonical `golden` metadata: the exact six in §10. Other future batches may be absent. Present exports must have valid source/provenance records. |
| Full VS1 | `npm run validate:audio:full` | Every `required && scope === 'vs1'` entry (currently 13), with applicable file/provenance checks. Absent optional/future entries do not become requirements. |

Equivalent syntax is `--stage preparation|golden|full`. `--golden` and the compatibility alias `--strict` select Golden and Full respectively; there is no automatic stage switch. `--root <project root>` selects the filesystem root without replacing canonical registry metadata. Invalid/unknown/conflicting options fail with usage; `--help` exits 0 without validation. Reports state stage, root, scope, enforced presence, per-entry result, provenance approval recorded/pending, errors/warnings and pass/fail. Exit 0 means only the requested technical stage passed; failed checks, invalid arguments or filesystem errors exit 1. Ordinary `npm run check` uses preparation.

### File and tree checks

All stages check registry IDs/category prefixes, roles, scope/required/loop metadata, volume/instance ranges and duplicate IDs/paths. Golden membership is represented once in executable data, by minimal per-entry registry metadata and `isGoldenAudio()`; the documentation checklist remains the production authority.

Present registered files must be nonempty. For the current provisional `.mp3` URL, the dependency-free structural check verifies an optional ID3v2.2/2.3/2.4 envelope (size/flags/footer bounds), followed by a recognized complete first MPEG Layer III frame. It detects obvious wrong containers, invalid headers, metadata-only inputs and a truncated first frame. It does **not** decode payloads or audit every frame. Free-format MP3 frame sizing and other extensions are explicitly unsupported by this structural inspector; extending it requires evidence when delivery changes. These implementation limits neither finalize the codec nor prove gapless playback.

Only the exact `public/assets/audio/` tree is scanned. Unexpected runtime exports (including a wrong-extension alternative or source/master placed there), unsafe paths and duplicate file listings fail. Literal `.gitkeep` placeholders are exempt, consistent with the visual gate. Visual categories are outside audio ownership. No stage creates exports or changes approval.

### Provenance and retained-source checks

`provenance.json` must be a JSON array. Records need unique registered string IDs. For music in the current AI workflow, §8 fields `tool`, `sourcePrompt`, `sourceFilename`, `sourceFormat`, `editingPerformed`, `licenseTermsReference` and `entitlement` must be nonempty strings; `generationDate` must be a real `YYYY-MM-DD` date. `model` is optional when unknown and must be nonempty when supplied. `approvalDate`, when supplied, must be a real date; absent/null explicitly reports pending provenance approval. Approved AI music still requires its approval date under §8. Technical validation does not grant listening approval or force a pending record to invent one.

For sourced/synthesized SFX, the shared local record needs `id`, `tool`, `sourceFilename`, `sourceFormat`, `editingPerformed` and `licenseTermsReference`. It does not invent a generation prompt/account entitlement for non-AI SFX. Optional music-related fields and dates are checked if supplied. Reference-input details, when used, remain recorded with the prompt/source information as §8 requires; the gate cannot establish which references were actually used.

Every supplied record's `sourceFilename` is a safe path relative to `art/source/audio/<music|sfx>/`, and that retained original/source file must exist and be nonempty. `sourceFormat` describes the original, not the runtime extension: a WAV/MP4 source is separate from an MP3 runtime encode. No transcoding or raw replacement occurs. The current provenance schema supplies no master/session filenames, so retained editable sessions and approved lossless masters remain production-review evidence rather than an invented filename check.

For any present runtime export, missing provenance is a warning in Preparation (entry result `attention`, no technical asset pass), and an error in Golden/Full. Malformed supplied records/JSON and missing referenced source files fail every stage. A missing provenance file can be reported during zero-production preparation; production cannot pass a present export without its record. Selected missing runtime assets fail by their presence requirement even before records exist.

These are structural checks, not proof of commercial rights, actual source format/content, authenticity of dates/notes or human approval. Nonempty license/entitlement references do not assert legal truth.

### Remaining production/platform proof

File validation cannot establish decoding in Phaser, seamless loops, loudness/clipping, musical quality, repetition fatigue, engine pitch quality or phone/headphone mix. Browser listening/codec/unlock/loop proof remains AUD-03/05/07; native/WebView delivery remains AND-04. Golden/Full file success does not finalize `.mp3` or replace integrated mix/listening approval. A preparation pass MUST NOT be representable as production approval. Do not create fake files to satisfy a gate.

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
11. **Golden Browser Audio Codec Test:** Test candidate encodes of `bgm_garage` and `bgm_run` in actual Phaser playback on desktop and physical mobile browsers during VS1. Candidate export auditions may begin before full scene mix integration; final Golden approval still needs all six in the real loop. Native/WebView codec confirmation waits for Android (AND-04).
    - *Evaluate Looping:* no audible gap, no click, no duplicated transient, no obvious timing hiccup, repeated looping remains stable.
    - *Evaluate Runtime:* Phaser loads reliably, playback starts reliably, browser unlock works, track switching works, background/resume remains correct.
    - *Evaluate Quality:* no obvious compression artifacts, important mid-range instruments remain clear, mechanical percussion remains clean, phone speaker presentation remains acceptable.
    - *Evaluate Delivery:* reasonable bundle size, reasonable decode/start latency.
    - *Outcome:* Record the supported browser-stage encode and its evidence; the existing registry field is `CANONICAL_RUNTIME_AUDIO_EXT`. Future audio tasks may update delivery contracts after proof. Keep native delivery explicitly provisional until WebView acceptance; do not invent a second registry constant or claim final cross-platform approval from browser testing.
12. Approve the browser-stage Golden Audio Set after integrated six-entry mix, listening and mobile-browser proof, retaining native delivery uncertainty.
13. Only then expand to the remaining seven required VS1 SFX; full 13-entry audio and integrated mix/device acceptance precede presentation-complete VS1 (D14 M3). Native delivery approval remains AND-04.
**Approval Gate:**
- **Music Identity:** Garage and Run sound like the same game; motif is recognizable; not generic; no accidental cyberpunk/chiptune vibes.
- **Repetition:** Garage survives at least ~10 minutes of repeated listening; Run survives repeated restarts.
- **Engine:** Pitch range works; loop is seamless; long exposure is tolerable; doesn't mask feedback.
- **Interaction SFX:** Click is not irritating; merge feels significantly more meaningful than a UI click; failure is clear but not punishing.
- **Mix:** Music/SFX/engine coexist; important sounds are audible; no obvious clipping.
- **Device:** Checked on both phone speaker and headphones.
