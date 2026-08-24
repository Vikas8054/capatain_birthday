// Retro Chiptune Happy Birthday Melody Player
export const synthMusic = {
  audioCtx: null,
  timeouts: [],
  melody: [
    { note: "G4", duration: 0.35 }, { note: "G4", duration: 0.12 },
    { note: "A4", duration: 0.45 }, { note: "G4", duration: 0.45 },
    { note: "C5", duration: 0.45 }, { note: "B4", duration: 0.85 },
    
    { note: "G4", duration: 0.35 }, { note: "G4", duration: 0.12 },
    { note: "A4", duration: 0.45 }, { note: "G4", duration: 0.45 },
    { note: "D5", duration: 0.45 }, { note: "C5", duration: 0.85 },
    
    { note: "G4", duration: 0.35 }, { note: "G4", duration: 0.12 },
    { note: "G5", duration: 0.45 }, { note: "E5", duration: 0.45 },
    { note: "C5", duration: 0.45 }, { note: "B4", duration: 0.45 }, { note: "A4", duration: 0.45 },
    
    { note: "F5", duration: 0.35 }, { note: "F5", duration: 0.12 },
    { note: "E5", duration: 0.45 }, { note: "C5", duration: 0.45 },
    { note: "D5", duration: 0.45 }, { note: "C5", duration: 0.85 }
  ],
  freqs: {
    G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33,
    E5: 659.25, F5: 698.46, G5: 783.99
  },
  playNote(note, duration, startTime) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'triangle'; // Cozy chiptune feel
    osc.frequency.setValueAtTime(this.freqs[note], startTime);
    
    gain.gain.setValueAtTime(0.06, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.02);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  },
  start() {
    this.stop();
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const playLoop = () => {
      if (!this.audioCtx) return;
      let time = this.audioCtx.currentTime;
      let currentDelay = 0;
      
      this.melody.forEach((item) => {
        this.playNote(item.note, item.duration * 1.45, time + currentDelay);
        currentDelay += item.duration * 1.55;
      });
      
      this.timeouts.push(setTimeout(playLoop, currentDelay * 1550));
    };
    
    playLoop();
  },
  stop() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {}
      this.audioCtx = null;
    }
  }
};

// Web Audio API Synthesis pop sound
export const playPopSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1050, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.error("Audio Pop synthesis error:", e);
  }
};
