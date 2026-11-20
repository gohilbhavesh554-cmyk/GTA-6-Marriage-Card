/**
 * Original 3-station Vice FM Web Audio ambient synthesizer.
 * Starts OFF by default; strictly user-initiated via tap/click.
 * Zero external audio files — 100% original procedural chords for Miami sunset atmosphere.
 */

export type ViceStationId = 'ocean' | 'palm' | 'midnight';

export interface ViceStation {
  id: ViceStationId;
  freq: string;
  name: string;
  mood: string;
  intervalMs: number;
  filterHz: number;
  wave: OscillatorType;
  chords: number[][];
}

export const VICE_STATIONS: ViceStation[] = [
  {
    id: 'ocean',
    freq: '98.3 FM',
    name: 'Ocean Drive',
    mood: 'Warm Sunset Rhodes',
    intervalMs: 4400,
    filterHz: 860,
    wave: 'triangle',
    // Fmaj7 -> G6 -> Em7 -> Am9
    chords: [
      [174.61, 220.0, 261.63, 329.63, 392.0],
      [196.0, 246.94, 293.66, 329.63, 440.0],
      [164.81, 246.94, 293.66, 392.0, 493.88],
      [220.0, 261.63, 329.63, 392.0, 493.88],
    ],
  },
  {
    id: 'palm',
    freq: '104.7 FM',
    name: 'Palm Groove',
    mood: 'Retro Neon Pulse',
    intervalMs: 3200,
    filterHz: 1120,
    wave: 'sawtooth',
    // Dbmaj9 -> Bbm7 -> Gbmaj7 -> Ab6
    chords: [
      [138.59, 174.61, 207.65, 261.63, 311.13],
      [116.54, 174.61, 207.65, 277.18, 349.23],
      [185.0, 233.08, 277.18, 349.23, 415.3],
      [207.65, 261.63, 311.13, 349.23, 415.3],
    ],
  },
  {
    id: 'midnight',
    freq: '88.9 FM',
    name: 'Midnight Vows',
    mood: 'Velvet Horizon Keys',
    intervalMs: 5200,
    filterHz: 680,
    wave: 'sine',
    // Cmaj9 -> Am11 -> Fmaj9 -> G13
    chords: [
      [130.81, 196.0, 246.94, 293.66, 329.63],
      [110.0, 196.0, 246.94, 293.66, 392.0],
      [174.61, 220.0, 261.63, 329.63, 392.0],
      [196.0, 246.94, 293.66, 329.63, 440.0],
    ],
  },
];

class ViceRadioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private isPlaying = false;
  private chordIndex = 0;
  private stationId: ViceStationId = 'ocean';

  public getPlaying(): boolean {
    return this.isPlaying;
  }

  public getStationId(): ViceStationId {
    return this.stationId;
  }

  private getCurrentStation(): ViceStation {
    return VICE_STATIONS.find((s) => s.id === this.stationId) || VICE_STATIONS[0];
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.stop();
      return false;
    }
    await this.start();
    return true;
  }

  public async selectStation(nextId: ViceStationId, autoPlay = true): Promise<boolean> {
    this.stationId = nextId;
    this.chordIndex = 0;
    if (this.isPlaying || autoPlay) {
      if (this.timerId !== null) {
        window.clearInterval(this.timerId);
        this.timerId = null;
      }
      this.isPlaying = false;
      await this.start();
      return true;
    }
    return false;
  }

  public async start(): Promise<void> {
    if (this.isPlaying) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isPlaying = true;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 1.1);
    }

    const station = this.getCurrentStation();
    this.playNextChord();
    this.timerId = window.setInterval(() => {
      if (this.isPlaying) {
        this.playNextChord();
      }
    }, station.intervalMs);
  }

  private playNextChord(): void {
    if (!this.ctx || !this.masterGain) return;
    const station = this.getCurrentStation();
    const now = this.ctx.currentTime;
    const notes = station.chords[this.chordIndex % station.chords.length];
    this.chordIndex += 1;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(station.filterHz, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(320, station.filterHz * 0.45), now + station.intervalMs / 1000);
    filter.connect(this.masterGain);

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sine' : station.wave;
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((idx - 2) * 3.8, now);

      const stagger = station.id === 'palm' ? 0.14 : 0.08;
      const startAt = now + idx * stagger;
      const peak = idx === 0 ? 0.22 : station.wave === 'sawtooth' ? 0.065 : 0.11;
      const durationSec = station.intervalMs / 1000 + 0.55;

      noteGain.gain.setValueAtTime(0.0001, startAt);
      noteGain.gain.linearRampToValueAtTime(peak, startAt + Math.min(1.0, durationSec * 0.25));
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSec);

      osc.connect(noteGain);
      noteGain.connect(filter);
      osc.start(startAt);
      osc.stop(startAt + durationSec + 0.15);
    });
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
    }
  }
}

export const ambientSunsetAudio = new ViceRadioEngine();
