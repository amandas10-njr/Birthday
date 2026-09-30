/**
 * Audio Engine using Web Audio API
 * Generates zero-dependency sound effects (fireworks, whooshes, chimes, candle puffs)
 * and plays an ambient celestial birthday melody, with optional custom audio fallback.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isUnlocked = false;
    this.masterGain = null;
    this.customAudio = null;
    this.ambientLoopTimer = null;
    this.isAmbientPlaying = false;
    this.volume = 0.7;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.isUnlocked = true;

      // Check for custom audio file in config
      const customUrl = window.BIRTHDAY_CONFIG?.audio?.customAudioUrl;
      if (customUrl) {
        this.customAudio = new Audio(customUrl);
        this.customAudio.loop = true;
        this.customAudio.volume = this.volume;
      }
    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e);
    }
  }

  unlock() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isUnlocked = true;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    if (this.customAudio) {
      this.customAudio.muted = muted;
    }
    return this.isMuted;
  }

  toggleMute() {
    return this.setMuted(!this.isMuted);
  }

  /**
   * Sound: Firework rocket launch whoosh/whistle
   */
  playLaunch() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 300, t + 0.35);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.4);
    } catch (e) {}
  }

  /**
   * Sound: Prolonged realistic ascending whistle for the first cracker
   */
  playLongLaunch() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.exponentialRampToValueAtTime(950, t + 2.4);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.4);
      gain.gain.setValueAtTime(0.12, t + 1.9);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 2.6);
    } catch (e) {}
  }

  /**
   * Sound: Firework explosion boom + sparkle crackle
   */
  playExplosion(intensity = 1.0) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;

      // 1. Low-frequency boom (sub-bass punch)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.5);

      const boomVol = Math.min(0.25 * intensity, 0.35);
      oscGain.gain.setValueAtTime(boomVol, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.6);

      // 2. Filtered noise burst for explosion shockwave
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, t);
      filter.frequency.exponentialRampToValueAtTime(120, t + 0.4);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18 * intensity, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      whiteNoise.start(t);
      whiteNoise.stop(t + 0.42);

      // 3. Crackling sparkle tails
      if (Math.random() > 0.3) {
        this.playSparkleCrackle(t + 0.2 + Math.random() * 0.15);
      }
    } catch (e) {}
  }

  playSparkleCrackle(startTime) {
    if (this.isMuted || !this.ctx) return;
    try {
      const count = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const sparkTime = startTime + i * (0.04 + Math.random() * 0.05);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(1800 + Math.random() * 1200, sparkTime);

        gain.gain.setValueAtTime(0.03, sparkTime);
        gain.gain.exponentialRampToValueAtTime(0.001, sparkTime + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(sparkTime);
        osc.stop(sparkTime + 0.09);
      }
    } catch (e) {}
  }

  /**
   * Sound: Blowing out the candle (air puff whoosh + magical chime)
   */
  playCandleBlow() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;

      // Soft air gust
      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(650, t);
      filter.Q.setValueAtTime(2, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(t);
      noise.stop(t + 0.65);

      // Followed by celebratory chime chord
      setTimeout(() => {
        this.playMagicalChimes();
      }, 250);
    } catch (e) {}
  }

  /**
   * Sound: Magical sparkly chimes (pentatonic notes)
   */
  playMagicalChimes() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5]; // C5, E5, G5, B5, C6, E6
      const baseTime = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const t = baseTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.85);
      });
    } catch (e) {}
  }

  /**
   * Ambient Music: Plays gentle, warm celestial chords in a loop
   * Creates a luxury, heartfelt emotional atmosphere without external files!
   */
  startAmbientMusic() {
    if (this.isAmbientPlaying) return;
    this.isAmbientPlaying = true;

    if (this.customAudio) {
      this.customAudio.play().catch(() => {});
      return;
    }

    // Peaceful celestial melody loop chords (Cmaj9, Am9, Fmaj7, Gsus4)
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // C, E, G, B
      [220.00, 261.63, 329.63, 392.00], // A, C, E, G
      [174.61, 261.63, 329.63, 349.23], // F, C, E, F
      [196.00, 293.66, 392.00, 523.25]  // G, D, G, C
    ];

    let chordIndex = 0;
    const playNextChord = () => {
      if (!this.isAmbientPlaying || !this.ctx) return;

      const chord = chords[chordIndex % chords.length];
      chordIndex++;
      const now = this.ctx.currentTime;
      const duration = 4.2;

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, now);

        // Gentle envelope
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.025, now + 1.2);
        gain.gain.setValueAtTime(0.025, now + duration - 1.2);
        gain.gain.linearRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration);
      });

      this.ambientLoopTimer = setTimeout(playNextChord, (duration - 0.5) * 1000);
    };

    playNextChord();
  }

  stopAmbientMusic() {
    this.isAmbientPlaying = false;
    if (this.ambientLoopTimer) {
      clearTimeout(this.ambientLoopTimer);
      this.ambientLoopTimer = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }
}

window.soundEngine = new SoundEngine();
