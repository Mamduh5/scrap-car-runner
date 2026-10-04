import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('phaser', () => ({
  default: {
    Math: {
      Clamp: (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
    }
  }
}));

import { AudioService } from './AudioService';
class MockSound {
  public key: string;
  public volume: number = 1;
  public isPlaying: boolean = false;
  
  constructor(key: string) {
    this.key = key;
  }
  
  play() { this.isPlaying = true; }
  stop() { this.isPlaying = false; }
  destroy() {}
}

class MockSoundManager {
  public sounds: MockSound[] = [];
  public listeners: Record<string, Function[]> = {};

  add(key: string, config: any) {
    const s = new MockSound(key);
    s.volume = config.volume ?? 1;
    this.sounds.push(s);
    return s as any;
  }

  play(key: string, config: any) {
    const s = this.add(key, config);
    s.play();
  }

  getAllPlaying() {
    return this.sounds.filter(s => s.isPlaying);
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event: string) {
    const cbs = this.listeners[event] || [];
    for (const cb of cbs) cb();
  }
}

describe('AudioService', () => {
  let manager: MockSoundManager;
  let service: AudioService;

  beforeEach(() => {
    manager = new MockSoundManager();
    service = new AudioService(manager as any);
  });

  it('multiplies master and category volume for music', () => {
    service.setMasterVolume(0.5);
    service.playMusic('bgm_garage'); // default is 0.7
    const sound = manager.sounds.find(s => s.key === 'bgm_garage');
    expect(sound?.volume).toBeCloseTo(0.35);
  });

  it('updates active music volume dynamically when master changes', () => {
    service.playMusic('bgm_garage'); // 1.0 * 0.7 = 0.7
    let sound = manager.sounds.find(s => s.key === 'bgm_garage');
    expect(sound?.volume).toBeCloseTo(0.7);

    service.setMasterVolume(0.5); // should update active sound to 0.35
    expect(sound?.volume).toBeCloseTo(0.35);
  });

  it('updates active SFX volume dynamically', () => {
    service.playSfx('sfx_engine_loop'); // default is 0.8
    let sound = manager.sounds.find(s => s.key === 'sfx_engine_loop');
    expect(sound?.volume).toBeCloseTo(0.8);

    service.setMasterVolume(0.5); // should update active SFX
    expect(sound?.volume).toBeCloseTo(0.4);
  });

  it('preserves configured volume across mute/unmute', () => {
    service.setMasterVolume(0.6);
    service.playMusic('bgm_garage'); // 0.6 * 0.7 = 0.42
    
    let sound = manager.sounds.find(s => s.key === 'bgm_garage');
    expect(sound?.volume).toBeCloseTo(0.42);

    service.setMusicMute(true);
    expect(sound?.volume).toBe(0);

    service.setMusicMute(false);
    expect(sound?.volume).toBeCloseTo(0.42); // restores exact previous configuration
  });

  it('starts pending locked music once after unlock', () => {
    // In actual Phaser, if context is locked, sound.play() might not actually emit audio,
    // but here we just test that the AudioService triggers playMusic again on unlock.
    service.playMusic('bgm_garage');
    const firstSound = manager.sounds.find(s => s.key === 'bgm_garage')!;
    firstSound.isPlaying = false; // Simulate lock preventing play

    manager.emit('unlocked');
    
    // It should have recreated/replayed the music
    const activeSounds = manager.getAllPlaying().filter(s => s.key === 'bgm_garage');
    expect(activeSounds.length).toBe(1);
  });

  it('does not stack duplicate music requests', () => {
    service.playMusic('bgm_garage');
    service.playMusic('bgm_garage');
    service.playMusic('bgm_garage');
    
    const activeSounds = manager.getAllPlaying().filter(s => s.key === 'bgm_garage');
    expect(activeSounds.length).toBe(1);
  });
});
