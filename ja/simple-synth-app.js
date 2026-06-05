const notes = [
  { name: "C", midi: 60, key: "a", type: "white" },
  { name: "C#", midi: 61, key: "w", type: "black", left: 8.2 },
  { name: "D", midi: 62, key: "s", type: "white" },
  { name: "D#", midi: 63, key: "e", type: "black", left: 20.7 },
  { name: "E", midi: 64, key: "d", type: "white" },
  { name: "F", midi: 65, key: "f", type: "white" },
  { name: "F#", midi: 66, key: "t", type: "black", left: 45.7 },
  { name: "G", midi: 67, key: "g", type: "white" },
  { name: "G#", midi: 68, key: "y", type: "black", left: 58.2 },
  { name: "A", midi: 69, key: "h", type: "white" },
  { name: "A#", midi: 70, key: "u", type: "black", left: 70.7 },
  { name: "B", midi: 71, key: "j", type: "white" },
  { name: "C2", midi: 72, key: "k", type: "white" }
];

const presets = {
  piano: {
    label: "ピアノ",
    waveform: "triangle",
    octave: "0",
    osc2Waveform: "sine",
    osc2Octave: "0",
    osc2Level: 0.16,
    osc2Detune: 6,
    subLevel: 0.04,
    noiseLevel: 0,
    cutoff: 3600,
    resonance: 1.4,
    attack: 0.005,
    decay: 0.45,
    sustain: 0.18,
    release: 0.28,
    lfoRate: 4.5,
    lfoDepth: 0,
    delayMix: 0.08,
    volume: 0.46
  },
  violin: {
    label: "バイオリン",
    waveform: "sawtooth",
    octave: "0",
    osc2Waveform: "triangle",
    osc2Octave: "0",
    osc2Level: 0.28,
    osc2Detune: 9,
    subLevel: 0.03,
    noiseLevel: 0.03,
    cutoff: 4300,
    resonance: 2.2,
    attack: 0.18,
    decay: 0.35,
    sustain: 0.82,
    release: 0.65,
    lfoRate: 5.6,
    lfoDepth: 24,
    delayMix: 0.1,
    volume: 0.4
  },
  bass: {
    label: "ベース",
    waveform: "square",
    octave: "-1",
    osc2Waveform: "sawtooth",
    osc2Octave: "-1",
    osc2Level: 0.22,
    osc2Detune: -7,
    subLevel: 0.42,
    noiseLevel: 0,
    cutoff: 720,
    resonance: 4.8,
    attack: 0.01,
    decay: 0.18,
    sustain: 0.56,
    release: 0.16,
    lfoRate: 3,
    lfoDepth: 0,
    delayMix: 0,
    volume: 0.52
  },
  strings: {
    label: "ストリングス",
    waveform: "sawtooth",
    octave: "0",
    osc2Waveform: "sawtooth",
    osc2Octave: "0",
    osc2Level: 0.46,
    osc2Detune: 12,
    subLevel: 0.08,
    noiseLevel: 0.01,
    cutoff: 2400,
    resonance: 1.6,
    attack: 0.75,
    decay: 0.9,
    sustain: 0.86,
    release: 1.35,
    lfoRate: 0.9,
    lfoDepth: 16,
    delayMix: 0.18,
    volume: 0.38
  },
  trumpet: {
    label: "トランペット",
    waveform: "sawtooth",
    octave: "0",
    osc2Waveform: "square",
    osc2Octave: "0",
    osc2Level: 0.22,
    osc2Detune: 5,
    subLevel: 0.02,
    noiseLevel: 0.02,
    cutoff: 5100,
    resonance: 6.8,
    attack: 0.06,
    decay: 0.22,
    sustain: 0.72,
    release: 0.28,
    lfoRate: 5.2,
    lfoDepth: 12,
    delayMix: 0.05,
    volume: 0.44
  },
  synthKick: {
    label: "シンセキック",
    waveform: "sine",
    octave: "-1",
    osc2Waveform: "sine",
    osc2Octave: "-1",
    osc2Level: 0.12,
    osc2Detune: -18,
    subLevel: 0.55,
    noiseLevel: 0.02,
    cutoff: 520,
    resonance: 7.5,
    attack: 0.005,
    decay: 0.34,
    sustain: 0.02,
    release: 0.12,
    lfoRate: 0.8,
    lfoDepth: 0,
    delayMix: 0,
    volume: 0.62
  },
  synthSnare: {
    label: "シンセスネア",
    waveform: "square",
    octave: "0",
    osc2Waveform: "triangle",
    osc2Octave: "0",
    osc2Level: 0.18,
    osc2Detune: 24,
    subLevel: 0.05,
    noiseLevel: 0.28,
    cutoff: 3600,
    resonance: 8.5,
    attack: 0.005,
    decay: 0.16,
    sustain: 0.04,
    release: 0.14,
    lfoRate: 8,
    lfoDepth: 0,
    delayMix: 0.04,
    volume: 0.5
  },
  space: {
    label: "宇宙",
    waveform: "sine",
    octave: "1",
    osc2Waveform: "sawtooth",
    osc2Octave: "0",
    osc2Level: 0.42,
    osc2Detune: 17,
    subLevel: 0.12,
    noiseLevel: 0.08,
    cutoff: 1400,
    resonance: 12.5,
    attack: 0.9,
    decay: 1.1,
    sustain: 0.72,
    release: 2.2,
    lfoRate: 0.35,
    lfoDepth: 120,
    delayMix: 0.34,
    volume: 0.34
  }
};

const hints = {
  Waveform: "波形は音の材料です。Saw は明るく、Square は太く、Triangle はやわらかい印象になります。",
  Octave: "オクターブは音域です。-1 にするとベース向き、+1 にするとリード向きになります。",
  "OSC 2 Wave": "OSC 2 は2つ目の音の材料です。OSC 1 と違う波形を混ぜると厚みが出ます。",
  "OSC 2 Octave": "OSC 2 の音域です。1オクターブ違いで混ぜると、太さやきらめきが増えます。",
  "OSC 2 Mix": "OSC 2 Mix は2つ目のオシレーターの音量です。少し足すだけでも音が広がります。",
  "OSC 2 Tune": "OSC 2 Tune はOSC 2だけを少しズラす量です。数セントずらすとアナログらしい揺れが出ます。",
  Sub: "Sub は1オクターブ下の音を混ぜます。少し足すと低音の芯が増えます。",
  Noise: "Noise は息やざらつきの成分です。上げすぎると音程感が薄くなります。",
  Cutoff: "Cutoff はフィルターの開き具合です。低いほど丸く、高いほど明るくなります。",
  Resonance: "Resonance は Cutoff 周辺の強調です。上げると酸味のあるピークが出ます。",
  Attack: "Attack は鍵盤を押してから音量が上がる時間です。長いほどふわっと始まります。",
  Decay: "Decay は Attack 後に Sustain へ落ち着く時間です。短いと打楽器っぽくなります。",
  Sustain: "Sustain は押し続けている間の音量です。低いとプラック、高いとパッド向きです。",
  Release: "Release は鍵盤を離してから消える時間です。長いほど余韻が残ります。",
  "LFO Rate": "LFO Rate はゆらぎの速さです。ゆっくりなら揺れ、速いならビブラートになります。",
  "LFO Depth": "LFO Depth は音程ゆらぎの深さです。少量から試すと効果がわかりやすいです。",
  Delay: "Delay は山びこの量です。音作りでは少しだけ足すと空間が広がります。",
  Volume: "Volume は全体音量です。複数音を鳴らすと大きくなるので少し控えめが安心です。"
};

const lessons = [
  ["まずは波形を選ぶ", "鍵盤を押しながら、Saw / Square / Triangle の音色差を聴いてみましょう。音作りは「素材を選ぶ」ことから始まります。"],
  ["Cutoff で明るさを決める", "Cutoff を下げるとこもり、上げると明るくなります。アナログシンセの音色作りでいちばん触る場所です。"],
  ["Resonance でクセを作る", "Resonance を上げるとフィルターの一点が強調され、シンセらしい鳴きが出ます。上げすぎには注意です。"],
  ["Envelope で形を作る", "Attack と Release を長くするとパッド、Decay と Sustain を短くするとプラックになります。音色は時間の形でも決まります。"],
  ["LFO で揺らす", "Depth を少し上げると音程が揺れます。Rate と Depth の組み合わせでビブラートや不安定な質感を作れます。"],
  ["Preset を分解する", "プリセットを選んでから、何が変わったかを一つずつ戻してみましょう。音作りの近道は差分を聴くことです。"]
];

const state = {
  audio: null,
  isReady: false,
  hold: false,
  lessonIndex: 0,
  voices: new Map(),
  knobs: new Map(),
  selectorKnobs: new Map()
};

const elements = Object.fromEntries(
  [
    "powerButton",
    "waveform",
    "octave",
    "osc2Waveform",
    "osc2Octave",
    "osc2Level",
    "osc2Detune",
    "subLevel",
    "noiseLevel",
    "cutoff",
    "filterCurve",
    "resonance",
    "attack",
    "decay",
    "sustain",
    "release",
    "lfoRate",
    "lfoDepth",
    "delayMix",
    "volume",
    "osc2LevelValue",
    "osc2DetuneValue",
    "subLevelValue",
    "noiseLevelValue",
    "cutoffValue",
    "resonanceValue",
    "attackValue",
    "decayValue",
    "sustainValue",
    "releaseValue",
    "lfoRateValue",
    "lfoDepthValue",
    "delayMixValue",
    "volumeValue",
    "scope",
    "keyboard",
    "holdButton",
    "panicButton",
    "presetButtons",
    "parameterName",
    "parameterHint",
    "lessonTitle",
    "lessonText",
    "stepLabel",
    "prevLesson",
    "nextLesson"
  ].map((id) => [id, document.getElementById(id)])
);

function getSettings() {
  return {
    waveform: elements.waveform.value,
    octave: Number(elements.octave.value),
    osc2Waveform: elements.osc2Waveform.value,
    osc2Octave: Number(elements.osc2Octave.value),
    osc2Level: Number(elements.osc2Level.value),
    osc2Detune: Number(elements.osc2Detune.value),
    subLevel: Number(elements.subLevel.value),
    noiseLevel: Number(elements.noiseLevel.value),
    cutoff: Number(elements.cutoff.value),
    resonance: Number(elements.resonance.value),
    attack: Number(elements.attack.value),
    decay: Number(elements.decay.value),
    sustain: Number(elements.sustain.value),
    release: Number(elements.release.value),
    lfoRate: Number(elements.lfoRate.value),
    lfoDepth: Number(elements.lfoDepth.value),
    delayMix: Number(elements.delayMix.value),
    volume: Number(elements.volume.value)
  };
}

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function setupAudio() {
  if (state.audio) return;
  const context = new AudioContext();
  const master = context.createGain();
  const analyser = context.createAnalyser();
  const delay = context.createDelay(1);
  const feedback = context.createGain();
  const delayGain = context.createGain();

  analyser.fftSize = 1024;
  master.gain.value = Number(elements.volume.value);
  delay.delayTime.value = 0.28;
  feedback.gain.value = 0.28;
  delayGain.gain.value = Number(elements.delayMix.value);

  master.connect(analyser);
  analyser.connect(context.destination);
  master.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(analyser);

  state.audio = { context, master, analyser, delayGain };
  state.isReady = true;
  elements.powerButton.setAttribute("aria-pressed", "true");
  elements.powerButton.textContent = "";
  elements.powerButton.innerHTML = '<span class="power-light"></span>Audio On';
  drawScope();
}

function createNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate * 1.5, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function startNote(note) {
  setupAudio();
  const { context, master } = state.audio;
  if (state.voices.has(note.midi)) return;

  const settings = getSettings();
  const now = context.currentTime;
  const frequency = midiToFrequency(note.midi + settings.octave * 12);
  const voiceGain = context.createGain();
  const filter = context.createBiquadFilter();
  const osc = context.createOscillator();
  const osc2 = context.createOscillator();
  const osc2Gain = context.createGain();
  const sub = context.createOscillator();
  const subGain = context.createGain();
  const noise = context.createBufferSource();
  const noiseGain = context.createGain();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(settings.cutoff, now);
  filter.Q.setValueAtTime(settings.resonance, now);
  voiceGain.gain.setValueAtTime(0, now);
  voiceGain.gain.linearRampToValueAtTime(settings.volume, now + settings.attack);
  voiceGain.gain.linearRampToValueAtTime(settings.volume * settings.sustain, now + settings.attack + settings.decay);

  osc.type = settings.waveform;
  osc.frequency.setValueAtTime(frequency, now);
  osc2.type = settings.osc2Waveform;
  osc2.frequency.setValueAtTime(midiToFrequency(note.midi + settings.osc2Octave * 12), now);
  osc2.detune.setValueAtTime(settings.osc2Detune, now);
  osc2Gain.gain.value = settings.osc2Level;
  sub.type = "square";
  sub.frequency.setValueAtTime(frequency / 2, now);
  subGain.gain.value = settings.subLevel;

  noise.buffer = createNoiseBuffer(context);
  noise.loop = true;
  noiseGain.gain.value = settings.noiseLevel;

  lfo.type = "sine";
  lfo.frequency.value = settings.lfoRate;
  lfoGain.gain.value = settings.lfoDepth;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.detune);
  lfoGain.connect(sub.detune);

  osc.connect(filter);
  osc2.connect(osc2Gain);
  osc2Gain.connect(filter);
  sub.connect(subGain);
  subGain.connect(filter);
  noise.connect(noiseGain);
  noiseGain.connect(filter);
  filter.connect(voiceGain);
  voiceGain.connect(master);

  osc.start(now);
  osc2.start(now);
  sub.start(now);
  noise.start(now);
  lfo.start(now);

  state.voices.set(note.midi, { noteMidi: note.midi, osc, osc2, sub, noise, lfo, voiceGain, filter, osc2Gain, subGain, noiseGain, stopping: false });
  setKeyActive(note.midi, true);
}

function stopNote(note) {
  const voice = state.voices.get(note.midi);
  if (!voice || state.hold || voice.stopping) return;
  voice.stopping = true;
  const { context } = state.audio;
  const settings = getSettings();
  const now = context.currentTime;

  voice.voiceGain.gain.cancelScheduledValues(now);
  voice.voiceGain.gain.setValueAtTime(voice.voiceGain.gain.value, now);
  voice.voiceGain.gain.linearRampToValueAtTime(0, now + settings.release);

  const stopAt = now + settings.release + 0.05;
  [voice.osc, voice.osc2, voice.sub, voice.noise, voice.lfo].forEach((source) => {
    try {
      source.stop(stopAt);
    } catch (error) {
      // Duplicate key/pointer release events can try to stop an already stopping voice.
    }
  });
  setTimeout(() => state.voices.delete(note.midi), (settings.release + 0.08) * 1000);
  setKeyActive(note.midi, false);
}

function setKeyActive(midi, active) {
  const key = elements.keyboard.querySelector(`[data-midi="${midi}"]`);
  if (key) key.classList.toggle("active", active);
}

function panicStop() {
  state.hold = false;
  elements.holdButton.setAttribute("aria-pressed", "false");
  if (!state.audio) {
    elements.keyboard.querySelectorAll(".key.active").forEach((key) => key.classList.remove("active"));
    state.voices.clear();
    return;
  }
  const now = state.audio.context.currentTime;
  state.voices.forEach((voice) => {
    voice.voiceGain.gain.cancelScheduledValues(now);
    voice.voiceGain.gain.setValueAtTime(0, now);
    [voice.osc, voice.osc2, voice.sub, voice.noise, voice.lfo].forEach((source) => {
      try {
        source.stop(now + 0.01);
      } catch (error) {
        // Already stopped voices are harmless during an emergency stop.
      }
    });
  });
  state.voices.clear();
  elements.keyboard.querySelectorAll(".key.active").forEach((key) => key.classList.remove("active"));
}

function updateLiveVoices() {
  if (!state.audio) return;
  const settings = getSettings();
  state.audio.master.gain.setTargetAtTime(settings.volume, state.audio.context.currentTime, 0.02);
  state.audio.delayGain.gain.setTargetAtTime(settings.delayMix, state.audio.context.currentTime, 0.02);
  state.voices.forEach((voice) => {
    voice.filter.frequency.setTargetAtTime(settings.cutoff, state.audio.context.currentTime, 0.025);
    voice.filter.Q.setTargetAtTime(settings.resonance, state.audio.context.currentTime, 0.025);
    voice.osc.type = settings.waveform;
    voice.osc2.type = settings.osc2Waveform;
    voice.osc2.frequency.setTargetAtTime(midiToFrequency(voice.noteMidi + settings.osc2Octave * 12), state.audio.context.currentTime, 0.025);
    voice.osc2Gain.gain.setTargetAtTime(settings.osc2Level, state.audio.context.currentTime, 0.025);
    voice.osc2.detune.setTargetAtTime(settings.osc2Detune, state.audio.context.currentTime, 0.025);
    voice.subGain.gain.setTargetAtTime(settings.subLevel, state.audio.context.currentTime, 0.025);
    voice.noiseGain.gain.setTargetAtTime(settings.noiseLevel, state.audio.context.currentTime, 0.025);
  });
}

function setDisplayValue(element, text) {
  if (!element) return;
  element.value = text;
  element.textContent = text;
}

function updateOutputs() {
  setDisplayValue(elements.subLevelValue, `${Math.round(Number(elements.subLevel.value) * 100)}%`);
  setDisplayValue(elements.noiseLevelValue, `${Math.round(Number(elements.noiseLevel.value) * 100)}%`);
  setDisplayValue(elements.osc2LevelValue, `${Math.round(Number(elements.osc2Level.value) * 100)}%`);
  setDisplayValue(elements.osc2DetuneValue, `${Number(elements.osc2Detune.value) >= 0 ? "+" : ""}${Math.round(Number(elements.osc2Detune.value))} cents`);
  setDisplayValue(elements.cutoffValue, `${Math.round(Number(elements.cutoff.value))} Hz`);
  setDisplayValue(elements.resonanceValue, Number(elements.resonance.value).toFixed(1));
  setDisplayValue(elements.attackValue, `${Number(elements.attack.value).toFixed(2)} s`);
  setDisplayValue(elements.decayValue, `${Number(elements.decay.value).toFixed(2)} s`);
  setDisplayValue(elements.sustainValue, `${Math.round(Number(elements.sustain.value) * 100)}%`);
  setDisplayValue(elements.releaseValue, `${Number(elements.release.value).toFixed(2)} s`);
  setDisplayValue(elements.lfoRateValue, `${Number(elements.lfoRate.value).toFixed(1)} Hz`);
  setDisplayValue(elements.lfoDepthValue, `${Math.round(Number(elements.lfoDepth.value))} cents`);
  setDisplayValue(elements.delayMixValue, `${Math.round(Number(elements.delayMix.value) * 100)}%`);
  setDisplayValue(elements.volumeValue, `${Math.round(Number(elements.volume.value) * 100)}%`);
  updateKnobs();
  updateSelectorKnobs();
  drawFilterCurve();
  updateLiveVoices();
}

function applyPreset(id) {
  const preset = presets[id];
  if (!preset) return;
  setControlValue("waveform", preset.waveform);
  setControlValue("octave", preset.octave);
  setControlValue("osc2Waveform", preset.osc2Waveform);
  setControlValue("osc2Octave", preset.osc2Octave);
  setControlValue("osc2Level", preset.osc2Level);
  setControlValue("osc2Detune", preset.osc2Detune);
  setControlValue("subLevel", preset.subLevel);
  setControlValue("noiseLevel", preset.noiseLevel);
  setControlValue("cutoff", preset.cutoff);
  setControlValue("resonance", preset.resonance);
  setControlValue("attack", preset.attack);
  setControlValue("decay", preset.decay);
  setControlValue("sustain", preset.sustain);
  setControlValue("release", preset.release);
  setControlValue("lfoRate", preset.lfoRate);
  setControlValue("lfoDepth", preset.lfoDepth);
  setControlValue("delayMix", preset.delayMix);
  setControlValue("volume", preset.volume);
  document.querySelectorAll(".preset-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === id);
  });
  updateOutputs();
}

function setControlValue(id, value) {
  const control = elements[id] || document.getElementById(id);
  if (!control) return;
  control.value = String(value);
  if (control.tagName === "SELECT") {
    const selectedIndex = Array.from(control.options).findIndex((option) => option.value === String(value));
    const nextIndex = Math.max(selectedIndex, 0);
    control.selectedIndex = nextIndex;
    control.dataset.index = String(nextIndex);
  }
}

function updateHint(name) {
  elements.parameterName.textContent = name;
  elements.parameterHint.textContent = hints[name] || "つまみを動かしながら、音の変化を短い言葉にしてみましょう。";
}

function updateLesson() {
  const [title, text] = lessons[state.lessonIndex];
  elements.stepLabel.textContent = `Step ${state.lessonIndex + 1} / ${lessons.length}`;
  elements.lessonTitle.textContent = title;
  elements.lessonText.textContent = text;
  document.querySelectorAll(".flow-node").forEach((node, index) => {
    node.classList.toggle("active", index === Math.min(state.lessonIndex, 4));
  });
}

function drawScope() {
  const canvas = elements.scope;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#11140f";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(244, 240, 223, 0.14)";
  ctx.lineWidth = 1;
  for (let y = 24; y < height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  if (!state.audio) {
    ctx.fillStyle = "#b9b39d";
    ctx.fillText("Start Audio を押して、鍵盤を鳴らすと波形が表示されます", 22, 96);
    requestAnimationFrame(drawScope);
    return;
  }

  const data = new Uint8Array(state.audio.analyser.fftSize);
  state.audio.analyser.getByteTimeDomainData(data);
  ctx.strokeStyle = "#60c4b0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = (value / 255) * height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  requestAnimationFrame(drawScope);
}

function drawWaveformIcon(canvas, waveform) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#10130f";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(244, 240, 223, 0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  ctx.strokeStyle = "#5eb7a4";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x <= width; x += 1) {
    const phase = x / width;
    let y = 0;
    if (waveform === "sine") {
      y = Math.sin(phase * Math.PI * 2);
    } else if (waveform === "square") {
      y = phase < 0.5 ? -0.8 : 0.8;
    } else if (waveform === "triangle") {
      y = 1 - 4 * Math.abs(Math.round(phase - 0.25) - (phase - 0.25));
    } else {
      y = 1 - 2 * phase;
    }
    const plotY = height / 2 + y * height * 0.33;
    if (x === 0) ctx.moveTo(x, plotY);
    else ctx.lineTo(x, plotY);
  }
  ctx.stroke();
}

function drawFilterCurve() {
  const svg = elements.filterCurve;
  if (!svg) return;
  const width = 280;
  const height = 82;
  const cutoff = Number(elements.cutoff.value);
  const resonance = Number(elements.resonance.value);
  const min = Number(elements.cutoff.min);
  const max = Number(elements.cutoff.max);
  const cutoffRatio = (Math.log(cutoff) - Math.log(min)) / (Math.log(max) - Math.log(min));
  const cutoffX = clamp(cutoffRatio, 0, 1) * width;
  const peak = clamp(resonance / 18, 0, 1) * height * 0.34;
  let path = "";
  for (let x = 0; x <= width; x += 1) {
    const rolloff = 1 / (1 + Math.exp((x - cutoffX) / 14));
    const resonantPeak = Math.exp(-((x - cutoffX) ** 2) / 420) * peak;
    const y = height - 16 - rolloff * (height - 26) - resonantPeak;
    path += `${x === 0 ? "M" : "L"} ${x.toFixed(1)} ${clamp(y, 8, height - 8).toFixed(1)} `;
  }
  svg.querySelector("#filterCurvePath").setAttribute("d", path);
  const line = svg.querySelector("#filterCutoffLine");
  line.setAttribute("x1", cutoffX.toFixed(1));
  line.setAttribute("x2", cutoffX.toFixed(1));
}

function buildKeyboard() {
  const whiteNotes = notes.filter((note) => note.type === "white");
  whiteNotes.forEach((note) => {
    const button = document.createElement("button");
    button.className = "key";
    button.type = "button";
    button.dataset.midi = note.midi;
    button.textContent = `${note.name} ${note.key.toUpperCase()}`;
    button.addEventListener("pointerdown", () => startNote(note));
    button.addEventListener("pointerup", () => stopNote(note));
    button.addEventListener("pointerleave", () => stopNote(note));
    elements.keyboard.append(button);
  });

  notes.filter((note) => note.type === "black").forEach((note) => {
    const button = document.createElement("button");
    button.className = "key black";
    button.type = "button";
    button.dataset.midi = note.midi;
    button.style.left = `${note.left}%`;
    button.textContent = note.key.toUpperCase();
    button.addEventListener("pointerdown", () => startNote(note));
    button.addEventListener("pointerup", () => stopNote(note));
    button.addEventListener("pointerleave", () => stopNote(note));
    elements.keyboard.append(button);
  });
}

function buildPresets() {
  Object.entries(presets).forEach(([id, preset]) => {
    const button = document.createElement("button");
    button.className = "preset-button";
    button.type = "button";
    button.dataset.preset = id;
    button.textContent = preset.label;
    button.addEventListener("click", () => applyPreset(id));
    elements.presetButtons.append(button);
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function snapToStep(value, step, min) {
  const precision = String(step).includes(".") ? String(step).split(".")[1].length : 0;
  return Number((Math.round((value - min) / step) * step + min).toFixed(precision));
}

function setRangeValue(input, value) {
  const min = Number(input.min);
  const max = Number(input.max);
  const step = Number(input.step || 1);
  input.value = String(clamp(snapToStep(value, step, min), min, max));
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function rangeToDegrees(input) {
  const min = Number(input.min);
  const max = Number(input.max);
  const ratio = (Number(input.value) - min) / (max - min);
  return -135 + ratio * 270;
}

function selectToDegrees(select) {
  const optionCount = select.options.length;
  const index = Number(select.dataset.index || select.selectedIndex || 0);
  const ratio = optionCount <= 1 ? 0 : index / (optionCount - 1);
  return -135 + ratio * 270;
}

function updateKnobs() {
  state.knobs.forEach((knob, input) => {
    const degrees = rangeToDegrees(input);
    const meter = ((degrees + 135) / 270) * 270;
    knob.style.setProperty("--angle", `${degrees}deg`);
    knob.style.setProperty("--meter", `${meter}deg`);
    knob.querySelector(".knob-face")?.style.setProperty("--angle", `${degrees}deg`);
    knob.setAttribute("aria-valuenow", input.value);
    knob.setAttribute("aria-valuetext", input.nextElementSibling?.textContent || input.value);
  });
}

function updateSelectorKnobs() {
  state.selectorKnobs.forEach(({ knob, value, icon }, select) => {
    const selectedIndex = Array.from(select.options).findIndex((option) => option.value === select.value);
    const index = selectedIndex >= 0 ? selectedIndex : Number(select.dataset.index || 0);
    select.dataset.index = String(index);
    const degrees = selectToDegrees(select);
    knob.style.setProperty("--angle", `${degrees}deg`);
    knob.querySelector(".knob-face")?.style.setProperty("--angle", `${degrees}deg`);
    value.textContent = select.options[index].textContent;
    if (icon) drawWaveformIcon(icon, select.value);
    knob.setAttribute("aria-valuenow", index + 1);
    knob.setAttribute("aria-valuetext", value.textContent);
  });
}

function setSelectIndex(select, index) {
  const nextIndex = clamp(index, 0, select.options.length - 1);
  select.dataset.index = String(nextIndex);
  select.value = select.options[nextIndex].value;
  select.selectedIndex = nextIndex;
  select.dispatchEvent(new Event("input", { bubbles: true }));
}

function buildKnobs() {
  document.querySelectorAll('.knob-control input[type="range"]').forEach((input) => {
    const knob = document.createElement("div");
    knob.className = "knob-shell";
    knob.tabIndex = 0;
    knob.setAttribute("role", "slider");
    knob.setAttribute("aria-label", input.dataset.hint || input.id);
    knob.setAttribute("aria-valuemin", input.min);
    knob.setAttribute("aria-valuemax", input.max);
    knob.innerHTML = '<div class="knob-ticks"></div><div class="knob-face"></div>';
    input.before(knob);
    state.knobs.set(input, knob);

    let startY = 0;
    let startValue = 0;

    knob.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      knob.setPointerCapture(event.pointerId);
      startY = event.clientY;
      startValue = Number(input.value);
      updateHint(input.dataset.hint);
    });

    knob.addEventListener("pointermove", (event) => {
      if (!knob.hasPointerCapture(event.pointerId)) return;
      const min = Number(input.min);
      const max = Number(input.max);
      const delta = (startY - event.clientY) / 150;
      setRangeValue(input, startValue + delta * (max - min));
    });

    knob.addEventListener("wheel", (event) => {
      event.preventDefault();
      const direction = event.deltaY > 0 ? -1 : 1;
      const step = Number(input.step || 1);
      setRangeValue(input, Number(input.value) + direction * step);
      updateHint(input.dataset.hint);
    }, { passive: false });

    knob.addEventListener("keydown", (event) => {
      const step = Number(input.step || 1);
      const largeStep = step * 10;
      const keys = {
        ArrowUp: step,
        ArrowRight: step,
        ArrowDown: -step,
        ArrowLeft: -step,
        PageUp: largeStep,
        PageDown: -largeStep,
        Home: "min",
        End: "max"
      };
      if (!(event.key in keys)) return;
      event.preventDefault();
      const change = keys[event.key];
      const value = change === "min" ? Number(input.min) : change === "max" ? Number(input.max) : Number(input.value) + change;
      setRangeValue(input, value);
      updateHint(input.dataset.hint);
    });

    knob.addEventListener("focus", () => updateHint(input.dataset.hint));
  });
  updateKnobs();
}

function buildSelectorKnobs() {
  document.querySelectorAll(".selector-control select").forEach((select) => {
    const knob = document.createElement("button");
    const value = document.createElement("div");
    const icon = select.id === "waveform" || select.id === "osc2Waveform" ? document.createElement("canvas") : null;
    knob.type = "button";
    knob.className = "knob-shell";
    knob.tabIndex = 0;
    knob.setAttribute("aria-label", select.dataset.hint || select.id);
    knob.innerHTML = '<div class="knob-ticks"></div><div class="knob-face"></div>';
    value.className = "selector-value";
    if (icon) {
      icon.className = "waveform-icon";
      icon.width = 120;
      icon.height = 36;
    }
    select.before(knob);
    select.after(value);
    if (icon) value.after(icon);
    state.selectorKnobs.set(select, { knob, value, icon });

    let startY = 0;
    let startIndex = 0;
    let didDrag = false;
    let lastStepTime = 0;

    const stepSelector = () => {
      const now = performance.now();
      if (now - lastStepTime < 90) return;
      lastStepTime = now;
      const current = Number(select.dataset.index || select.selectedIndex || 0);
      setSelectIndex(select, (current + 1) % select.options.length);
      updateHint(select.dataset.hint);
    };

    knob.addEventListener("click", (event) => {
      event.preventDefault();
      stepSelector();
    });

    knob.addEventListener("mousedown", (event) => {
      event.preventDefault();
      stepSelector();
    });

    knob.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      knob.setPointerCapture(event.pointerId);
      startY = event.clientY;
      startIndex = Number(select.dataset.index || select.selectedIndex || 0);
      didDrag = false;
      updateHint(select.dataset.hint);
    });

    knob.addEventListener("pointermove", (event) => {
      if (!knob.hasPointerCapture(event.pointerId)) return;
      const delta = Math.round((startY - event.clientY) / 44);
      didDrag = didDrag || delta !== 0;
      setSelectIndex(select, startIndex + delta);
    });

    knob.addEventListener("pointerup", (event) => {
      if (knob.hasPointerCapture(event.pointerId)) {
        knob.releasePointerCapture(event.pointerId);
      }
      updateHint(select.dataset.hint);
    });

    knob.addEventListener("wheel", (event) => {
      event.preventDefault();
      setSelectIndex(select, Number(select.dataset.index || select.selectedIndex || 0) + (event.deltaY > 0 ? -1 : 1));
      updateHint(select.dataset.hint);
    }, { passive: false });

    knob.addEventListener("keydown", (event) => {
      const keys = {
        ArrowUp: 1,
        ArrowRight: 1,
        ArrowDown: -1,
        ArrowLeft: -1,
        Home: "min",
        End: "max"
      };
      if (!(event.key in keys)) return;
      event.preventDefault();
      const change = keys[event.key];
      const currentIndex = Number(select.dataset.index || select.selectedIndex || 0);
      const index = change === "min" ? 0 : change === "max" ? select.options.length - 1 : currentIndex + change;
      setSelectIndex(select, index);
      updateHint(select.dataset.hint);
    });

    knob.addEventListener("focus", () => updateHint(select.dataset.hint));
  });
  updateSelectorKnobs();
}

function bindEvents() {
  elements.powerButton.addEventListener("click", setupAudio);
  elements.panicButton.addEventListener("click", panicStop);
  elements.holdButton.addEventListener("click", () => {
    state.hold = !state.hold;
    elements.holdButton.setAttribute("aria-pressed", String(state.hold));
    if (!state.hold) panicStop();
  });
  elements.prevLesson.addEventListener("click", () => {
    state.lessonIndex = (state.lessonIndex - 1 + lessons.length) % lessons.length;
    updateLesson();
  });
  elements.nextLesson.addEventListener("click", () => {
    state.lessonIndex = (state.lessonIndex + 1) % lessons.length;
    updateLesson();
  });

  document.querySelectorAll("input, select").forEach((control) => {
    control.addEventListener("input", () => {
      updateOutputs();
      updateHint(control.dataset.hint);
    });
    control.addEventListener("focus", () => updateHint(control.dataset.hint));
  });

  window.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    const note = notes.find((item) => item.key === event.key.toLowerCase());
    if (note) startNote(note);
  });

  window.addEventListener("keyup", (event) => {
    const note = notes.find((item) => item.key === event.key.toLowerCase());
    if (note) stopNote(note);
  });
}

buildKeyboard();
buildPresets();
buildSelectorKnobs();
buildKnobs();
bindEvents();
applyPreset("piano");
updateLesson();
updateHint("Waveform");
drawScope();
