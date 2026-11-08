export type SoundName =
  | "click"
  | "key"
  | "toggle"
  | "open"
  | "close"
  | "minimize"
  | "notify"
  | "error"
  | "tada"
  | "startup"
  | "shutdown"
  | "trash"
  | "munch"
  | "meow";

/*
 * Every sound is synthesised, so there are no audio files to download. The
 * palette is an old PC's: filtered-noise clicks for the mouse and keyboard,
 * square-wave chirps from the PC speaker for windows, and two-operator FM
 * (the 90s sound card) for system events.
 */

interface Noise {
  kind: "noise";
  at: number;
  duration: number;
  gain: number;
  filter: BiquadFilterType;
  frequency: number;
  to?: number;
  q?: number;
}

interface Square {
  kind: "square";
  at: number;
  duration: number;
  gain: number;
  frequency: number;
  to?: number;
}

interface FM {
  kind: "fm";
  at: number;
  duration: number;
  gain: number;
  frequency: number;
  /** Modulator frequency as a multiple of the carrier. */
  ratio: number;
  /** Starting brightness; it decays as the note rings out. */
  index: number;
  attack?: number;
}

interface Voice {
  kind: "voice";
  at: number;
  duration: number;
  gain: number;
  /** Pitch contour as [time, frequency] points. */
  pitch: [number, number][];
  formant: number;
}

type Part = Noise | Square | FM | Voice;

const jitter = (value: number, amount: number) =>
  value * (1 + (Math.random() * 2 - 1) * amount);

const fmChord = (
  notes: number[],
  at: number,
  options: Omit<FM, "kind" | "at" | "frequency">,
): FM[] =>
  notes.map((frequency) => ({ kind: "fm", at, frequency, ...options }));

const sounds: Record<SoundName, () => Part[]> = {
  click: () => [
    {
      kind: "noise",
      at: 0,
      duration: 0.012,
      gain: 1.1,
      filter: "bandpass",
      frequency: jitter(2600, 0.08),
      q: 1.4,
    },
    { kind: "square", at: 0, duration: 0.01, gain: 0.05, frequency: 140 },
  ],
  key: () => [
    {
      kind: "noise",
      at: 0,
      duration: jitter(0.016, 0.2),
      gain: 0.85,
      filter: "bandpass",
      frequency: jitter(1800, 0.18),
      q: 1.1,
    },
    {
      kind: "noise",
      at: 0.004,
      duration: 0.03,
      gain: 0.25,
      filter: "lowpass",
      frequency: 500,
    },
  ],
  // A latching switch: press, then release.
  toggle: () => [
    {
      kind: "noise",
      at: 0,
      duration: 0.01,
      gain: 1,
      filter: "bandpass",
      frequency: 2200,
      q: 1.5,
    },
    {
      kind: "noise",
      at: 0.045,
      duration: 0.008,
      gain: 0.75,
      filter: "bandpass",
      frequency: 3400,
      q: 1.5,
    },
  ],
  open: () => [
    { kind: "square", at: 0, duration: 0.035, gain: 0.045, frequency: 1047 },
    { kind: "square", at: 0.04, duration: 0.05, gain: 0.045, frequency: 1568 },
  ],
  close: () => [
    { kind: "square", at: 0, duration: 0.035, gain: 0.045, frequency: 1568 },
    { kind: "square", at: 0.04, duration: 0.05, gain: 0.045, frequency: 1047 },
  ],
  minimize: () => [
    {
      kind: "square",
      at: 0,
      duration: 0.09,
      gain: 0.04,
      frequency: 1175,
      to: 440,
    },
  ],
  notify: () => [
    {
      kind: "fm",
      at: 0,
      duration: 0.9,
      gain: 0.11,
      frequency: 1319,
      ratio: 3.5,
      index: 2.2,
    },
  ],
  // A clangy, inharmonic two-note drop, like a 90s "critical stop".
  error: () => [
    {
      kind: "fm",
      at: 0,
      duration: 0.35,
      gain: 0.12,
      frequency: 440,
      ratio: 1.41,
      index: 3,
    },
    {
      kind: "fm",
      at: 0.16,
      duration: 0.55,
      gain: 0.12,
      frequency: 330,
      ratio: 1.41,
      index: 3,
    },
  ],
  // A brassy two-hit fanfare.
  tada: () => [
    ...fmChord([523, 659, 784], 0, {
      duration: 0.16,
      gain: 0.06,
      ratio: 1,
      index: 2.4,
      attack: 0.01,
    }),
    ...fmChord([698, 880, 1047], 0.17, {
      duration: 0.75,
      gain: 0.06,
      ratio: 1,
      index: 2.6,
      attack: 0.015,
    }),
  ],
  // A soft electric-piano chord that swells, then a bell on top.
  startup: () => [
    ...fmChord([262, 330, 392, 494], 0, {
      duration: 2.2,
      gain: 0.05,
      ratio: 1,
      index: 1.2,
      attack: 0.35,
    }),
    ...fmChord([131], 0, {
      duration: 2.2,
      gain: 0.06,
      ratio: 0.5,
      index: 0.8,
      attack: 0.3,
    }),
    {
      kind: "fm",
      at: 0.45,
      duration: 1.6,
      gain: 0.05,
      frequency: 1568,
      ratio: 3.5,
      index: 1.6,
    },
  ],
  shutdown: () =>
    [784, 659, 523, 392].map((frequency, index) => ({
      kind: "fm" as const,
      at: index * 0.18,
      duration: 0.9 + index * 0.25,
      gain: 0.07,
      frequency,
      ratio: 2,
      index: 1.4,
    })),
  // Paper being scrunched up.
  trash: () =>
    Array.from({ length: 6 }, (_, index) => ({
      kind: "noise" as const,
      at: index * jitter(0.045, 0.3),
      duration: jitter(0.04, 0.3),
      gain: 0.18 - index * 0.02,
      filter: "bandpass" as const,
      frequency: jitter(1400, 0.4),
      q: 0.8,
    })),
  munch: () =>
    [0, 0.11].map((at) => ({
      kind: "noise" as const,
      at: at + jitter(0.01, 0.5),
      duration: 0.06,
      gain: 0.22,
      filter: "lowpass" as const,
      frequency: jitter(1300, 0.2),
      to: 400,
    })),
  meow: () => [
    {
      kind: "voice",
      at: 0,
      duration: 0.42,
      gain: 0.4,
      pitch: [
        [0, 560],
        [0.12, 820],
        [0.42, 520],
      ],
      formant: 1300,
    },
  ],
};

let context: AudioContext | null = null;
let output: AudioNode | null = null;
let noise: AudioBuffer | null = null;

function setup() {
  context ??= new AudioContext();
  if (!output) {
    // A gentle low-pass and compressor, like a small desktop speaker.
    const speaker = context.createBiquadFilter();
    speaker.type = "lowpass";
    speaker.frequency.value = 7000;
    const compressor = context.createDynamicsCompressor();
    speaker.connect(compressor).connect(context.destination);
    output = speaker;
  }
  if (!noise) {
    noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const data = noise.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = Math.random() * 2 - 1;
    }
  }
  return { audio: context, out: output, noiseBuffer: noise };
}

function envelope(
  param: AudioParam,
  start: number,
  attack: number,
  end: number,
  peak: number,
) {
  param.setValueAtTime(0.0001, start);
  param.exponentialRampToValueAtTime(peak, start + attack);
  param.exponentialRampToValueAtTime(0.0001, end);
}

export function playSound(name: SoundName) {
  if (typeof window === "undefined" || !("AudioContext" in window)) return;
  const { audio, out, noiseBuffer } = setup();
  if (audio.state === "suspended") void audio.resume();
  const now = audio.currentTime + 0.005;

  for (const part of sounds[name]()) {
    const start = now + part.at;
    const end = start + part.duration;
    const amp = audio.createGain();
    amp.connect(out);

    if (part.kind === "noise") {
      const source = audio.createBufferSource();
      source.buffer = noiseBuffer;
      const filter = audio.createBiquadFilter();
      filter.type = part.filter;
      filter.frequency.setValueAtTime(part.frequency, start);
      if (part.to) filter.frequency.exponentialRampToValueAtTime(part.to, end);
      filter.Q.value = part.q ?? 0.7;
      envelope(amp.gain, start, 0.002, end, part.gain);
      source.connect(filter).connect(amp);
      source.start(start, Math.random() * 0.5);
      source.stop(end + 0.02);
    } else if (part.kind === "square") {
      const oscillator = audio.createOscillator();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(part.frequency, start);
      if (part.to) {
        oscillator.frequency.exponentialRampToValueAtTime(part.to, end);
      }
      // PC-speaker beeps are flat, with just enough fade to avoid pops.
      amp.gain.setValueAtTime(0, start);
      amp.gain.linearRampToValueAtTime(part.gain, start + 0.002);
      amp.gain.setValueAtTime(part.gain, end - 0.004);
      amp.gain.linearRampToValueAtTime(0, end);
      oscillator.connect(amp);
      oscillator.start(start);
      oscillator.stop(end + 0.02);
    } else if (part.kind === "fm") {
      const carrier = audio.createOscillator();
      const modulator = audio.createOscillator();
      const depth = audio.createGain();
      const modulatorFrequency = part.frequency * part.ratio;
      carrier.frequency.value = part.frequency;
      modulator.frequency.value = modulatorFrequency;
      // Bright at the strike, mellow as it rings: the FM bell sound.
      depth.gain.setValueAtTime(part.index * modulatorFrequency, start);
      depth.gain.exponentialRampToValueAtTime(
        part.index * modulatorFrequency * 0.08,
        end,
      );
      envelope(amp.gain, start, part.attack ?? 0.004, end, part.gain);
      modulator.connect(depth).connect(carrier.frequency);
      carrier.connect(amp);
      carrier.start(start);
      modulator.start(start);
      carrier.stop(end + 0.05);
      modulator.stop(end + 0.05);
    } else {
      // A sawtooth through a vowel-ish band-pass makes a small "mew".
      const oscillator = audio.createOscillator();
      const formant = audio.createBiquadFilter();
      const vibrato = audio.createOscillator();
      const vibratoDepth = audio.createGain();
      oscillator.type = "sawtooth";
      for (const [time, frequency] of part.pitch) {
        if (time === 0) oscillator.frequency.setValueAtTime(frequency, start);
        else {
          oscillator.frequency.exponentialRampToValueAtTime(
            frequency,
            start + time,
          );
        }
      }
      vibrato.frequency.value = 7;
      vibratoDepth.gain.value = 12;
      vibrato.connect(vibratoDepth).connect(oscillator.frequency);
      formant.type = "bandpass";
      formant.frequency.setValueAtTime(part.formant * 0.7, start);
      formant.frequency.linearRampToValueAtTime(part.formant, start + 0.1);
      formant.Q.value = 2.5;
      envelope(amp.gain, start, 0.04, end, part.gain);
      oscillator.connect(formant).connect(amp);
      oscillator.start(start);
      vibrato.start(start);
      oscillator.stop(end + 0.02);
      vibrato.stop(end + 0.02);
    }
  }
}
