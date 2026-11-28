/**
 * Optional soundtrack, synthesised live with the Web Audio API (no audio files,
 * no third-party code). Off by default; started only from a user gesture.
 *
 * Layers
 *  - pad:    a slow, organ-like drone; the chord shifts with each homepage chapter
 *  - engine: a low hum whose pitch and level follow scroll speed
 *  - ui:     soft blips on hover over links/cards; a whoosh on warp
 *
 * Other scripts talk to it through window events:
 *  'voyage:chapter' (detail: index), 'voyage:speed' (detail: 0..1), 'voyage:warp'
 */

type Voice = { osc: OscillatorNode; gain: GainNode };

// Chord per chapter, as semitone offsets from A1 (55 Hz). Suspended, open voicings.
const CHORDS = [
  [0, 7, 14, 19],
  [5, 12, 16, 24],
  [3, 10, 15, 22],
  [-2, 5, 12, 17],
  [0, 7, 12, 16],
  [7, 14, 19, 23],
  [5, 12, 17, 21],
  [3, 10, 14, 19],
  [8, 15, 20, 24],
  [-4, 3, 10, 15],
  [0, 7, 14, 21],
];
const hz = (semi: number) => 55 * Math.pow(2, semi / 12);

let ctx: AudioContext | null = null;
let master: GainNode;
let padBus: GainNode;
let padFilter: BiquadFilterNode;
let voices: Voice[] = [];
let engineGain: GainNode;
let engineOsc: OscillatorNode;
let engineFilter: BiquadFilterNode;
let noise: AudioBuffer;
let running = false;
let lastBlip = 0;

function build() {
  ctx = new AudioContext();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 6;
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(comp).connect(ctx.destination);

  // Simple space "reverb": two cross-fed delay lines with damping.
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  const dA = ctx.createDelay(2);
  const dB = ctx.createDelay(2);
  dA.delayTime.value = 0.43;
  dB.delayTime.value = 0.71;
  const fbA = ctx.createGain();
  const fbB = ctx.createGain();
  fbA.gain.value = 0.42;
  fbB.gain.value = 0.38;
  const damp = ctx.createBiquadFilter();
  damp.type = 'lowpass';
  damp.frequency.value = 1800;
  dA.connect(fbA).connect(dB);
  dB.connect(fbB).connect(damp).connect(dA);
  dA.connect(wet);
  dB.connect(wet);
  wet.connect(master);

  // Pad
  padBus = ctx.createGain();
  padBus.gain.value = 0.16;
  padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.value = 900;
  padFilter.Q.value = 0.7;
  padBus.connect(padFilter);
  padFilter.connect(master);
  padFilter.connect(dA);
  const lfo = ctx.createOscillator();
  const lfoAmt = ctx.createGain();
  lfo.frequency.value = 0.05;
  lfoAmt.gain.value = 380;
  lfo.connect(lfoAmt).connect(padFilter.frequency);
  lfo.start();
  voices = CHORDS[0].flatMap((semi, i) =>
    [-4, 4].map((detune) => {
      const osc = ctx!.createOscillator();
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.value = hz(semi);
      osc.detune.value = detune;
      const gain = ctx!.createGain();
      gain.gain.value = i === 0 ? 0.55 : 0.32;
      osc.connect(gain).connect(padBus);
      osc.start();
      return { osc, gain };
    }),
  );

  // Engine hum
  engineOsc = ctx.createOscillator();
  engineOsc.type = 'sawtooth';
  engineOsc.frequency.value = 38;
  engineFilter = ctx.createBiquadFilter();
  engineFilter.type = 'lowpass';
  engineFilter.frequency.value = 160;
  engineGain = ctx.createGain();
  engineGain.gain.value = 0.015;
  engineOsc.connect(engineFilter).connect(engineGain).connect(master);
  engineOsc.start();

  // Noise for whooshes
  noise = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  addEventListener('voyage:chapter', (e) => setChord((e as CustomEvent<number>).detail));
  addEventListener('voyage:speed', (e) => setSpeed((e as CustomEvent<number>).detail));
  addEventListener('voyage:warp', whoosh);
  document.addEventListener('pointerover', onHover, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !running) return;
    if (document.hidden) ctx.suspend();
    else ctx.resume();
  });
}

function setChord(i: number) {
  if (!ctx) return;
  const chord = CHORDS[((i % CHORDS.length) + CHORDS.length) % CHORDS.length];
  const t = ctx.currentTime;
  voices.forEach((v, k) => v.osc.frequency.setTargetAtTime(hz(chord[Math.floor(k / 2)]), t, 1.2));
}

function setSpeed(s: number) {
  if (!ctx) return;
  const t = ctx.currentTime;
  const k = Math.min(Math.max(s, 0), 1);
  engineOsc.frequency.setTargetAtTime(38 + k * 46, t, 0.25);
  engineFilter.frequency.setTargetAtTime(160 + k * 700, t, 0.25);
  engineGain.gain.setTargetAtTime(0.015 + k * 0.05, t, 0.25);
}

function whoosh() {
  if (!ctx || !running) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 1.2;
  bp.frequency.setValueAtTime(300, t);
  bp.frequency.exponentialRampToValueAtTime(2400, t + 0.6);
  bp.frequency.exponentialRampToValueAtTime(400, t + 1.3);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.22, t + 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  src.connect(bp).connect(g).connect(master);
  src.start(t);
  src.stop(t + 1.5);
}

function blip(freq: number) {
  if (!ctx || !running) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.08);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.05, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + 0.25);
}

function onHover(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return;
  const el = (e.target as Element | null)?.closest('a, button, .card-hover');
  if (!el || el.contains(e.relatedTarget as Node | null)) return;
  const now = performance.now();
  if (now - lastBlip < 90) return;
  lastBlip = now;
  blip(el.matches('.card-hover') ? 660 : 880);
}

export async function setSound(on: boolean) {
  if (on && !ctx) build();
  if (!ctx) return;
  running = on;
  const t = ctx.currentTime;
  if (on) {
    await ctx.resume();
    master.gain.cancelScheduledValues(t);
    master.gain.setTargetAtTime(0.9, t, 0.8);
  } else {
    master.gain.cancelScheduledValues(t);
    master.gain.setTargetAtTime(0, t, 0.25);
    setTimeout(() => !running && ctx?.suspend(), 900);
  }
}
