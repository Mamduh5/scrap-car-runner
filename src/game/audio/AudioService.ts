import Phaser from 'phaser';
import { AUDIO_BY_ID } from './audioRegistry';

/**
 * Minimal AudioService architecture.
 * Wraps Phaser.Sound.BaseSoundManager to provide strongly typed ID access,
 * spam prevention (polyphony limits), and global volume/mute categories.
 */
export class AudioService {
  private readonly manager: Phaser.Sound.BaseSoundManager;
  private masterMute = false;
  private musicMute = false;
  private sfxMute = false;

  private masterVolume = 1.0;
  private musicVolume = 1.0;
  private sfxVolume = 1.0;

  private activeMusicId: string | null = null;
  private activeMusicSound: Phaser.Sound.BaseSound | null = null;

  // Track SFX play times for concurrency/spam limiting
  private sfxPlayHistory = new Map<string, number[]>();

  constructor(soundManager: Phaser.Sound.BaseSoundManager) {
    this.manager = soundManager;
    
    // Register unlock listener
    // Browser audio unlock is handled automatically by Phaser's SoundManager
    // when a user interaction occurs. We just need to sync state if needed.
    this.manager.on('unlocked', () => {
      // If we attempted to play music before unlock, restart or resume it here
      if (this.activeMusicId && !this.activeMusicSound?.isPlaying) {
        this.playMusic(this.activeMusicId);
      }
    });
  }

  /**
   * Sets master volume (0.0 to 1.0)
   */
  public setMasterVolume(vol: number): void {
    this.masterVolume = Phaser.Math.Clamp(vol, 0, 1);
    this.updateVolumes();
  }

  public setMasterMute(mute: boolean): void {
    this.masterMute = mute;
    this.updateVolumes();
  }

  public setMusicMute(mute: boolean): void {
    this.musicMute = mute;
    this.updateVolumes();
  }

  public setSfxMute(mute: boolean): void {
    this.sfxMute = mute;
    this.updateVolumes();
  }

  /**
   * Play background music. Crossfades could be added here later.
   */
  public playMusic(id: string): void {
    const def = AUDIO_BY_ID.get(id);
    if (!def || def.category !== 'music') {
      console.warn(`[AudioService] Unknown or invalid music ID: ${id}`);
      return;
    }

    if (this.activeMusicId === id && this.activeMusicSound?.isPlaying) {
      return; // Already playing
    }

    this.stopMusic();

    this.activeMusicId = id;
    this.activeMusicSound = this.manager.add(id, {
      loop: def.loop,
      volume: this.getMusicEffectiveVolume(def.defaultVolume)
    });

    // If audio context is still locked, Phaser will queue it, or we handle it on 'unlocked'
    this.activeMusicSound.play();
  }

  public stopMusic(): void {
    if (this.activeMusicSound) {
      this.activeMusicSound.stop();
      this.activeMusicSound.destroy();
      this.activeMusicSound = null;
    }
    this.activeMusicId = null;
  }

  /**
   * Play a sound effect, respecting concurrency limits.
   */
  public playSfx(id: string): void {
    const def = AUDIO_BY_ID.get(id);
    if (!def || def.category !== 'sfx') {
      console.warn(`[AudioService] Unknown or invalid SFX ID: ${id}`);
      return;
    }

    if (this.sfxMute || this.masterMute) return;

    const now = Date.now();
    let history = this.sfxPlayHistory.get(id) || [];
    
    // Clean up history older than e.g. 100ms
    history = history.filter(time => now - time < 100);

    if (def.maxInstances && history.length >= def.maxInstances) {
      // Spam prevention threshold reached
      return;
    }

    history.push(now);
    this.sfxPlayHistory.set(id, history);

    this.manager.play(id, {
      volume: this.getSfxEffectiveVolume(def.defaultVolume),
      loop: def.loop
    });
  }

  /**
   * Sync active instances with current volume settings.
   */
  private updateVolumes(): void {
    // We only actively manage the music volume stream since SFX are fire-and-forget 
    // for the most part, except looping SFX which we might track later.
    if (this.activeMusicSound && this.activeMusicId) {
      const def = AUDIO_BY_ID.get(this.activeMusicId);
      if (def) {
        // Casting is safe enough here since Phaser's BaseSound usually supports volume property
        (this.activeMusicSound as any).volume = this.getMusicEffectiveVolume(def.defaultVolume);
      }
    }
  }

  private getMusicEffectiveVolume(baseVol: number): number {
    if (this.masterMute || this.musicMute) return 0;
    return baseVol * this.musicVolume * this.masterVolume;
  }

  private getSfxEffectiveVolume(baseVol: number): number {
    if (this.masterMute || this.sfxMute) return 0;
    return baseVol * this.sfxVolume * this.masterVolume;
  }
}
