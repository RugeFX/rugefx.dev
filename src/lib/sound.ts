export type SoundName = "pop" | "click" | "key" | "flip" | "tada";

let audioContext: AudioContext | null = null;

interface Tone {
  frequency: number;
  endFrequency?: number;
  start?: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
}

// Every sound is synthesised, so there are no audio files to download.
const sounds: Record<SoundName, Tone[]> = {
  pop: [{ frequency: 360, endFrequency: 900, duration: 0.11, gain: 0.14 }],
  click: [{ frequency: 1500, duration: 0.035, type: "square", gain: 0.035 }],
  key: [
    {
      frequency: 720,
      endFrequency: 480,
      duration: 0.06,
      type: "triangle",
      gain: 0.09,
    },
  ],
  flip: [
    {
      frequency: 260,
      endFrequency: 640,
      duration: 0.18,
      type: "triangle",
      gain: 0.08,
    },
  ],
  tada: [523, 659, 784, 1047].map((frequency, index) => ({
    frequency,
    start: index * 0.085,
    duration: 0.26,
    type: "triangle" as const,
    gain: 0.08,
  })),
};

export function playSound(name: SoundName) {
  if (typeof window === "undefined" || !("AudioContext" in window)) return;
  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") void audioContext.resume();

  const now = audioContext.currentTime;
  for (const tone of sounds[name]) {
    const start = now + (tone.start ?? 0);
    const end = start + tone.duration;
    const oscillator = audioContext.createOscillator();
    const amplitude = audioContext.createGain();

    oscillator.type = tone.type ?? "sine";
    oscillator.frequency.setValueAtTime(tone.frequency, start);
    if (tone.endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(tone.endFrequency, end);
    }
    amplitude.gain.setValueAtTime(0.0001, start);
    amplitude.gain.exponentialRampToValueAtTime(tone.gain ?? 0.1, start + 0.01);
    amplitude.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.connect(amplitude).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  }
}
