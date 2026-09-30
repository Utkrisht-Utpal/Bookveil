// Realistic paper turn sound synthesizer using Web Audio API
class PageTurnAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public playPageTurn(isForward: boolean = true) {
    if (this.isMuted || this.volume <= 0) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 0.22 + Math.random() * 0.08;
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = Math.floor(sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate shaped pink-like noise with paper texture characteristics
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        const pink = b0 + b1 + b2 + white * 0.5362;
        data[i] = pink * 0.11;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      // Bandpass filter for paper frequency (swish range ~ 800Hz - 3500Hz)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isForward ? 1400 : 1250, now);
      filter.frequency.exponentialRampToValueAtTime(isForward ? 2400 : 1800, now + duration * 0.5);
      filter.frequency.exponentialRampToValueAtTime(900, now + duration);
      filter.Q.setValueAtTime(1.8, now);

      // Secondary highpass filter for crisp paper edge rustle
      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(450, now);

      // Envelope gain node
      const gainNode = this.ctx.createGain();
      const peakVol = this.volume * 0.45;
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(peakVol, now + duration * 0.3);
      gainNode.gain.exponentialRampToValueAtTime(peakVol * 0.4, now + duration * 0.7);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Connect nodes
      noiseNode.connect(filter);
      filter.connect(highpass);
      highpass.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      noiseNode.start(now);
      noiseNode.stop(now + duration);
    } catch (e) {
      console.warn('Audio play prevented:', e);
    }
  }

  public playBookClose() {
    if (this.isMuted || this.volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);
      
      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }
}

export const pageAudio = new PageTurnAudioEngine();
