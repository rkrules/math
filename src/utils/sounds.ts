
let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

const playTone = (freq: number, duration: number, type: OscillatorType = 'sine', startTime = 0) => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.3, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

export const playCorrectSound = () => {
  playTone(523, 0.15, 'sine', 0);
  playTone(659, 0.2, 'sine', 0.12);
};

export const playIncorrectSound = () => {
  playTone(200, 0.3, 'sawtooth', 0);
};

export const playStreakSound = () => {
  playTone(523, 0.12, 'sine', 0);
  playTone(659, 0.12, 'sine', 0.1);
  playTone(784, 0.25, 'sine', 0.2);
};

export const playTimeoutSound = () => {
  playTone(440, 0.15, 'triangle', 0);
  playTone(330, 0.25, 'triangle', 0.12);
};
