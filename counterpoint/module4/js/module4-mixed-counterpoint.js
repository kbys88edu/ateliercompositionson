const SVG_NS = "http://www.w3.org/2000/svg";

const NATURAL_NOTES = [
  "C3", "D3", "E3", "F3", "G3", "A3", "B3",
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  "C6"
];

const NOTE_LETTER_STEPS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

const SCORE = {
  width: 1280,
  height: 360,
  left: 105,
  right: 55,
  staffGap: 10,
  noteStep: 5,
  topBottomLineY: 145,
  cantusBottomLineY: 260,
  playheadTop: 55,
  playheadBottom: 308,
  quartersPerCantus: 4
};

const DURATIONS = {
  q: { label: "♩", quarters: 1, nameJa: "四分音符", nameFr: "noire" },
  h: { label: "𝅗𝅥", quarters: 2, nameJa: "二分音符", nameFr: "blanche" },
  w: { label: "𝅝", quarters: 4, nameJa: "全音符", nameFr: "ronde" }
};

const I18N = {
  ja: {
    backLink: "← トップへ戻る",
    languageLabel: "言語",
    title: "2声混合対位法チェッカー",
    lead: "ヘ音記号の全音符の定旋律に対して、ト音記号の対旋律に全音符・二分音符・四分音符を混合して入力します。タイは扱いません。",
    exerciseLabel: "課題",
    loadExercise: "課題を読み込む",
    durationLabel: "入力する音価",
    durationQuarter: "四分音符",
    durationHalf: "二分音符",
    durationWhole: "全音符",
    loadExample: "例題を読み込む",
    deleteSelected: "選択音を削除",
    clearCounterpoint: "対旋律をクリア",
    refreshScore: "楽譜を更新",
    playSelected: "選択音を鳴らす",
    exportMidi: "MIDIを書き出す",
    resetStart: "最初に戻す",
    playbackModeLabel: "再生対象",
    playBoth: "両声",
    playCantus: "定旋律のみ",
    playCounterpoint: "対旋律のみ",
    timbreLabel: "音色",
    timbreSine: "Sine / 柔らかい",
    timbreTriangle: "Triangle / 素直",
    timbreOrgan: "Organ / オルガン風",
    timbreBell: "Bell / ベル風",
    timbreHumanVoice: "人の声",
    playbackHint: "クリック：音を入力　｜　← / →：選択移動　｜　↑ / ↓：半音移動　｜　Space：再生 / 停止",
    scoreInputTitle: "五線入力",
    scoreInputHelp: "上段はト音記号の混合対旋律、下段はヘ音記号の全音符定旋律です。",
    currentInput: "現在の入力",
    cantusLabel: "定旋律：",
    counterpointLabel: "対旋律：",
    analyze: "解析する",
    analysisResult: "解析結果",
    notAnalyzed: "まだ解析していません。",
    noInput: "未入力",
    play: "再生",
    stop: "停止",
    status: (notes, slots) => `対旋律：${notes}音 / 使用拍：${slots} / 再生位置：${playbackIndex + 1}`,
    labelOk: "OK",
    labelWarn: "注意",
    labelError: "禁止",
    summaryOk: (ok) => `大きな問題は見つかりませんでした。OK項目：${ok}件`,
    summaryCounts: (e, w, ok) => `禁止：${e}件 / 注意：${w}件 / OK：${ok}件`,
    needInput: "定旋律と混合対旋律を入力してください。",
    lengthMismatch: (need, got) => `拍数が一致していません。必要な拍数は${need}拍、現在は${got}拍です。`,
    lengthOk: (n) => `拍数は一致しています。全${n}拍です。`,
    overlap: "音価が小節の境界をまたいでいます。このモジュールではタイを扱わないため、小節内で完結させてください。",
    invalidNote: (i) => `${i}番目の音：音名の形式が正しくありません。`,
    strongBad: (q, name) => `${q}拍目：拍頭の音程が ${name} です。拍頭では協和音程が必要です。`,
    strongOk: (q, name) => `${q}拍目：拍頭の音程は ${name} です。`,
    weakDissonanceOk: (q, name) => `${q}拍目：${name}。順次進行による経過的・補助音的な不協和として扱えます。`,
    weakDissonanceBad: (q, name) => `${q}拍目：${name}。弱拍の不協和ですが、前後関係が不自然です。`,
    consonanceOk: (q, name) => `${q}拍目：${name}。協和音程です。`,
    parallelFifth: (a, b) => `${a}拍目 → ${b}拍目：連続5度があります。`,
    parallelOctave: (a, b) => `${a}拍目 → ${b}拍目：連続8度または連続1度があります。`,
    exerciseDescription: "全音符・二分音符・四分音符を混合して置く練習です。",
    exampleDescription: "混合リズムの入力例です。",
    intervals: {
      perfectUnison: "完全1度",
      perfectOctave: "完全8度",
      compoundPerfect: "完全8度または複合完全音程",
      m2: "短2度",
      M2: "長2度",
      m3: "短3度",
      M3: "長3度",
      P4: "完全4度",
      tritone: "増4度 / 減5度",
      P5: "完全5度",
      m6: "短6度",
      M6: "長6度",
      m7: "短7度",
      M7: "長7度",
      unknown: "不明な音程"
    }
  },
  fr: {
    backLink: "← Retour à l’accueil",
    languageLabel: "Langue",
    title: "Module 4 — Contrepoint mixte à deux voix",
    lead: "Contre un cantus en rondes en clé de fa, saisissez une ligne de contrepoint en clé de sol combinant rondes, blanches et noires. Les liaisons ne sont pas utilisées.",
    exerciseLabel: "Exercice",
    loadExercise: "Charger l’exercice",
    durationLabel: "Valeur à saisir",
    durationQuarter: "Noire",
    durationHalf: "Blanche",
    durationWhole: "Ronde",
    loadExample: "Charger l’exemple",
    deleteSelected: "Supprimer la note sélectionnée",
    clearCounterpoint: "Effacer le contrepoint",
    refreshScore: "Actualiser la partition",
    playSelected: "Jouer la note sélectionnée",
    exportMidi: "Exporter MIDI",
    resetStart: "Revenir au début",
    playbackModeLabel: "Lecture",
    playBoth: "Deux voix",
    playCantus: "Cantus seul",
    playCounterpoint: "Contrepoint seul",
    timbreLabel: "Timbre",
    timbreSine: "Sine / doux",
    timbreTriangle: "Triangle / simple",
    timbreOrgan: "Organ / orgue",
    timbreBell: "Bell / cloche",
    timbreHumanVoice: "Voix humaine",
    playbackHint: "Clic : saisir une note　｜　← / → : déplacer la sélection　｜　↑ / ↓ : demi-ton　｜　Espace : lecture / arrêt",
    scoreInputTitle: "Saisie sur portée",
    scoreInputHelp: "La portée supérieure montre le contrepoint mixte en clé de sol ; la portée inférieure montre le cantus en rondes en clé de fa.",
    currentInput: "Saisie actuelle",
    cantusLabel: "Cantus :",
    counterpointLabel: "Contrepoint :",
    analyze: "Analyser",
    analysisResult: "Résultat de l’analyse",
    notAnalyzed: "Pas encore analysé.",
    noInput: "Non saisi",
    play: "Lecture",
    stop: "Arrêter",
    status: (notes, slots) => `Contrepoint : ${notes} notes / temps utilisés : ${slots} / Position : ${playbackIndex + 1}`,
    labelOk: "OK",
    labelWarn: "Attention",
    labelError: "Interdit",
    summaryOk: (ok) => `Aucun problème majeur détecté. Éléments OK : ${ok}`,
    summaryCounts: (e, w, ok) => `Interdits : ${e} / Attention : ${w} / OK : ${ok}`,
    needInput: "Veuillez saisir le cantus et le contrepoint mixte.",
    lengthMismatch: (need, got) => `La durée totale ne correspond pas. Requis : ${need} temps, saisi : ${got} temps.`,
    lengthOk: (n) => `La durée totale correspond. Total : ${n} temps.`,
    overlap: "Une valeur traverse une barre de mesure. Ce module n’utilise pas de liaisons ; la valeur doit rester dans la mesure.",
    invalidNote: (i) => `Note ${i} : format invalide.`,
    strongBad: (q, name) => `Temps ${q} : l’intervalle fort est ${name}. Une consonance est requise.`,
    strongOk: (q, name) => `Temps ${q} : l’intervalle fort est ${name}.`,
    weakDissonanceOk: (q, name) => `Temps ${q} : ${name}. Dissonance acceptable par mouvement conjoint.`,
    weakDissonanceBad: (q, name) => `Temps ${q} : ${name}. Dissonance faible, mais le contexte mélodique est peu convaincant.`,
    consonanceOk: (q, name) => `Temps ${q} : ${name}. Intervalle consonant.`,
    parallelFifth: (a, b) => `Temps ${a} → ${b} : quintes parallèles.`,
    parallelOctave: (a, b) => `Temps ${a} → ${b} : octaves ou unissons parallèles.`,
    exerciseDescription: "Exercice pour combiner rondes, blanches et noires.",
    exampleDescription: "Exemple avec rythme mixte.",
    intervals: {
      perfectUnison: "unisson juste",
      perfectOctave: "octave juste",
      compoundPerfect: "octave juste ou intervalle composé juste",
      m2: "seconde mineure",
      M2: "seconde majeure",
      m3: "tierce mineure",
      M3: "tierce majeure",
      P4: "quarte juste",
      tritone: "quarte augmentée / quinte diminuée",
      P5: "quinte juste",
      m6: "sixte mineure",
      M6: "sixte majeure",
      m7: "septième mineure",
      M7: "septième majeure",
      unknown: "intervalle inconnu"
    }
  }
};

const EXERCISES = [
  {
    id: "mixed-c-major-01",
    title: { ja: "混合 01｜C major", fr: "Mixte 01｜Do majeur" },
    description: { ja: "全音符・二分音符・四分音符を混合して置く練習です。", fr: "Exercice pour combiner rondes, blanches et noires." },
    cantus: ["C3", "D3", "E3", "F3", "G3", "A3", "G3", "F3", "E3", "D3", "C3"],
    counterpoint: []
  },
  {
    id: "mixed-example-filled",
    title: { ja: "入力例つき", fr: "Exemple rempli" },
    description: { ja: "混合リズムの入力例です。", fr: "Exemple avec rythme mixte." },
    cantus: ["C3", "D3", "E3", "F3"],
    counterpoint: [
      { start: 0, duration: "h", note: "G4" },
      { start: 2, duration: "q", note: "A4" },
      { start: 3, duration: "q", note: "G4" },
      { start: 4, duration: "w", note: "F4" },
      { start: 8, duration: "h", note: "G4" },
      { start: 10, duration: "h", note: "B4" },
      { start: 12, duration: "w", note: "C5" }
    ]
  }
];

let currentLanguage = "ja";
let selectedIndex = 0;
let inputDuration = "q";
let playbackIndex = 0;
let isPlaying = false;
let playbackTimerId = null;
let audioContext = null;
let analysisIssues = [];

function t(key) { return I18N[currentLanguage][key]; }

function setLanguage(lang) {
  if (!I18N[lang]) return;
  currentLanguage = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const value = t(key);
    if (typeof value === "string") element.textContent = value;
  });

  populateExerciseSelect(true);
  updateExerciseDescription();
  updateDisplays();
  updatePlayPauseButton();
}

function getAudioContext() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function getTimbre() {
  const select = document.getElementById("timbreSelect");
  return select ? select.value : "triangle";
}

function getTimbreConfig(timbre = getTimbre()) {
  const configs = {
    sine: { waveform: "sine", gain: 0.17, attack: 0.015, release: 0.06, secondOscillator: false },
    triangle: { waveform: "triangle", gain: 0.18, attack: 0.012, release: 0.07, secondOscillator: false },
    organ: { waveform: "sine", gain: 0.13, attack: 0.02, release: 0.12, secondOscillator: true, secondRatio: 2, secondGain: 0.035, secondWaveform: "sine" },
    bell: { waveform: "sine", gain: 0.15, attack: 0.005, release: 0.22, secondOscillator: true, secondRatio: 2.01, secondGain: 0.055, secondWaveform: "sine" }
  };
  return configs[timbre] || configs.triangle;
}

function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function createVoiceFormant(ctx, source, destination, now, duration, gainScale) {
  const inputGain = ctx.createGain();
  inputGain.gain.setValueAtTime(0.0001, now);
  inputGain.gain.exponentialRampToValueAtTime(0.16 * gainScale, now + 0.055);
  inputGain.gain.setValueAtTime(0.13 * gainScale, now + Math.max(0.06, duration * 0.72));
  inputGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.16);

  const formants = [
    { frequency: 750, q: 7.5, gain: 0.9 },
    { frequency: 1150, q: 9.0, gain: 0.55 },
    { frequency: 2450, q: 11.0, gain: 0.35 }
  ];

  source.connect(inputGain);

  formants.forEach((formant) => {
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(formant.frequency, now);
    filter.Q.setValueAtTime(formant.q, now);
    gain.gain.setValueAtTime(formant.gain, now);
    inputGain.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
  });
}

function playVoiceLikeNote(midi, duration = 0.45, gainScale = 1) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const frequency = midiToFrequency(midi);

  const output = ctx.createGain();
  output.gain.setValueAtTime(0.85, now);
  output.connect(ctx.destination);

  const vibrato = ctx.createOscillator();
  const vibratoGain = ctx.createGain();
  vibrato.type = "sine";
  vibrato.frequency.setValueAtTime(5.4, now);
  vibratoGain.gain.setValueAtTime(Math.max(1.0, frequency * 0.006), now);
  vibrato.connect(vibratoGain);

  const oscillators = [
    { type: "sawtooth", ratio: 1, gain: 0.85 },
    { type: "triangle", ratio: 0.997, gain: 0.45 },
    { type: "sine", ratio: 2.005, gain: 0.18 }
  ];

  oscillators.forEach((config) => {
    const osc = ctx.createOscillator();
    osc.type = config.type;
    osc.frequency.setValueAtTime(frequency * config.ratio, now);
    vibratoGain.connect(osc.frequency);
    createVoiceFormant(ctx, osc, output, now, duration, gainScale * config.gain);
    osc.start(now);
    osc.stop(now + duration + 0.25);
  });

  vibrato.start(now);
  vibrato.stop(now + duration + 0.25);
}



const SAMPLE_VOICE_SETS = {
  femaleSample: {
    folder: "female",
    // Required female files:
    // C4.wav, G4.wav, C5.wav, G5.wav
    // These files are played at their written sample octave.
    notes: ["C4", "G4", "C5", "G5"],
    transposeSemitones: 0
  },
  maleSample: {
    folder: "male",
    // Required male files:
    // C2.wav, G2.wav, C3.wav, G3.wav, C4.wav, G4.wav
    notes: ["C2", "G2", "C3", "G3", "C4", "G4"],
    transposeSemitones: 0
  }
};

const sampleVoiceCache = {};

function getSampleVoiceBasePath() {
  const path = window.location.pathname;
  if (
    path.includes("/module2/") ||
    path.includes("/module3/") ||
    path.includes("/module4/") ||
    path.includes("/three-voice/")
  ) {
    return "../audio/voice";
  }
  return "audio/voice";
}

function midiToSampleNoteName(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const pitch = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${names[pitch]}${octave}`;
}

function getNearestSampleNote(targetMidi, sampleNotes, setName = "") {
  const exactName = typeof midiToSampleNoteName === "function"
    ? midiToSampleNoteName(targetMidi)
    : midiToNote(targetMidi, "sharp");

  if (sampleNotes.includes(exactName)) {
    return exactName;
  }

  // Female / soprano correction:
  // Keep A4 and B4 in the G4 sample region instead of jumping to the C5 sample.
  // This avoids the previous A4+ area sounding an octave too high.
  let candidates = sampleNotes;

  if (setName === "femaleSample") {
    const c5Midi = noteToMidi("C5");
    candidates = targetMidi < c5Midi
      ? sampleNotes.filter((note) => ["C4", "G4"].includes(note))
      : sampleNotes.filter((note) => ["C5", "G5"].includes(note));

    if (!candidates.length) candidates = sampleNotes;
  }

  let nearest = candidates[0];
  let nearestDistance = Infinity;

  candidates.forEach((note) => {
    const midi = noteToMidi(note);
    if (midi === null) return;

    const distance = Math.abs(midi - targetMidi);
    if (distance < nearestDistance) {
      nearest = note;
      nearestDistance = distance;
    }
  });

  return nearest;
}

async function loadSampleVoiceBuffer(setName, note) {
  const set = SAMPLE_VOICE_SETS[setName];
  if (!set) return null;

  const cacheKey = `${setName}:${note}`;
  if (sampleVoiceCache[cacheKey]) return sampleVoiceCache[cacheKey];

  const ctx = getAudioContext();
  const url = `${getSampleVoiceBasePath()}/${set.folder}/${note}.wav`;

  try {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) throw new Error(`Sample not found: ${url}`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    sampleVoiceCache[cacheKey] = audioBuffer;
    return audioBuffer;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

async function playSampleVoiceNote(setName, midi, duration = 0.45, gainScale = 1) {
  const set = SAMPLE_VOICE_SETS[setName];
  if (!set) return;

  const nearestNote = getNearestSampleNote(midi, set.notes, setName);
  const sourceMidi = noteToMidi(nearestNote);
  if (sourceMidi === null) return;

  const buffer = await loadSampleVoiceBuffer(setName, nearestNote);
  if (!buffer) {
    if (typeof playFallbackVoice === "function") {
      playFallbackVoice(midi, duration, gainScale);
    } else if (typeof playVoiceLikeNote === "function") {
      playVoiceLikeNote(midi, duration, gainScale);
    }
    return;
  }

  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // No global octave transposition.
  // Exact G4 plays female/G4.wav at playbackRate 1.0.
  // A4/B4 use the G4 region instead of jumping to C5.
  const semitoneShift = midi - sourceMidi + (set.transposeSemitones || 0);
  source.playbackRate.setValueAtTime(Math.pow(2, semitoneShift / 12), now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.78 * gainScale, now + 0.025);
  gain.gain.setValueAtTime(0.68 * gainScale, now + Math.max(0.03, duration * 0.74));
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.08);

  source.connect(gain);
  gain.connect(ctx.destination);

  source.start(now);
  source.stop(now + duration + 0.12);
}





function playMidiNote(midi, duration = 0.38, gainScale = 1, voiceSet = "femaleSample") {
  const timbre = getTimbre();

  if (timbre === "humanVoice") {
    playSampleVoiceNote(voiceSet, midi, duration, gainScale);
    return;
  }

  if (timbre === "voice") {
    playVoiceLikeNote(midi, duration, gainScale);
    return;
  }

  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const config = getTimbreConfig(timbre);
  const frequency = midiToFrequency(midi);

  const mainOsc = ctx.createOscillator();
  const mainGain = ctx.createGain();

  mainOsc.type = config.waveform;
  mainOsc.frequency.setValueAtTime(frequency, now);

  mainGain.gain.setValueAtTime(0.0001, now);
  mainGain.gain.exponentialRampToValueAtTime(config.gain * gainScale, now + config.attack);
  mainGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + config.release);

  mainOsc.connect(mainGain);
  mainGain.connect(ctx.destination);

  mainOsc.start(now);
  mainOsc.stop(now + duration + config.release + 0.05);

  if (config.secondOscillator) {
    const secondOsc = ctx.createOscillator();
    const secondGain = ctx.createGain();

    secondOsc.type = config.secondWaveform || "sine";
    secondOsc.frequency.setValueAtTime(frequency * (config.secondRatio || 2), now);

    secondGain.gain.setValueAtTime(0.0001, now);
    secondGain.gain.exponentialRampToValueAtTime((config.secondGain || 0.04) * gainScale, now + config.attack);
    secondGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + config.release);

    secondOsc.connect(secondGain);
    secondGain.connect(ctx.destination);
    secondOsc.start(now);
    secondOsc.stop(now + duration + config.release + 0.05);
  }
}

function noteToMidi(note) {
  const match = String(note).trim().match(/^([A-Ga-g])(#|b)?(-?\d)$/);
  if (!match) return null;
  const pitch = match[1].toUpperCase();
  const accidental = match[2] || "";
  const octave = parseInt(match[3], 10);
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let value = base[pitch];
  if (accidental === "#") value += 1;
  if (accidental === "b") value -= 1;
  return 12 * (octave + 1) + value;
}

function midiToNote(midi, preference = "sharp") {
  const sharpNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const flatNames = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const pitch = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const names = preference === "flat" ? flatNames : sharpNames;
  return names[pitch] + octave;
}

function parseNote(note) {
  const match = String(note).trim().match(/^([A-Ga-g])(#|b)?(-?\d)$/);
  if (!match) return null;
  return { letter: match[1].toUpperCase(), accidental: match[2] || "", octave: parseInt(match[3], 10) };
}

function getDiatonicStep(note) {
  const parsed = parseNote(note);
  if (!parsed) return null;
  return parsed.octave * 7 + NOTE_LETTER_STEPS[parsed.letter];
}

function noteToY(note, bottomLineY = SCORE.topBottomLineY) {
  const noteStep = getDiatonicStep(note);
  const referenceNote = bottomLineY === SCORE.cantusBottomLineY ? "G2" : "E4";
  const referenceStep = getDiatonicStep(referenceNote);
  if (noteStep === null || referenceStep === null) return null;
  return bottomLineY - (noteStep - referenceStep) * SCORE.noteStep;
}

function yToNaturalNote(y) {
  const e4Step = getDiatonicStep("E4");
  const rawStep = Math.round((SCORE.topBottomLineY - y) / SCORE.noteStep);
  const targetStep = e4Step + rawStep;

  let closest = NATURAL_NOTES[0];
  let closestDistance = Infinity;

  NATURAL_NOTES.forEach((note) => {
    const step = getDiatonicStep(note);
    const distance = Math.abs(step - targetStep);
    if (distance < closestDistance) {
      closest = note;
      closestDistance = distance;
    }
  });

  return closest;
}

function getNotesFromTextarea(id) {
  const el = document.getElementById(id);
  if (!el) return [];
  const value = el.value.trim();
  if (!value) return [];
  return value.split(/\s+/).filter(Boolean);
}

function isRestEvent(event) {
  return !event || event.rest === true || event.note === "REST";
}

function normalizeCounterpointEvents(events) {
  const total = getTotalQuarterSlots();
  const cleaned = [];

  (events || []).forEach((event) => {
    if (!event || typeof event.start !== "number") return;
    const duration = DURATIONS[event.duration] ? event.duration : "q";
    const length = getDurationQuarters(duration);
    if (event.start < 0 || event.start >= total) return;
    if (event.start + length > total) return;
    cleaned.push({
      start: event.start,
      duration,
      note: isRestEvent(event) ? "REST" : event.note,
      rest: isRestEvent(event)
    });
  });

  cleaned.sort((a, b) => a.start - b.start);
  return cleaned;
}

function fillRests(events) {
  const total = getTotalQuarterSlots();
  const source = normalizeCounterpointEvents(events).sort((a, b) => a.start - b.start);
  const result = [];

  let slot = 0;

  source.forEach((event) => {
    const eventStart = event.start;
    const eventLength = getDurationQuarters(event.duration);

    while (slot < eventStart) {
      result.push({ start: slot, duration: "q", note: "REST", rest: true });
      slot += 1;
    }

    if (eventStart >= slot) {
      result.push(event);
      slot = eventStart + eventLength;
    }
  });

  while (slot < total) {
    result.push({ start: slot, duration: "q", note: "REST", rest: true });
    slot += 1;
  }

  return result.sort((a, b) => a.start - b.start);
}

function getCounterpointEvents() {
  const el = document.getElementById("counterpoint");
  if (!el || !el.value.trim()) return [];

  try {
    const parsed = JSON.parse(el.value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((event) => event && typeof event.start === "number" && event.note && !isRestEvent(event))
      .map((event) => ({
        start: event.start,
        duration: DURATIONS[event.duration] ? event.duration : "q",
        note: event.note,
        rest: false
      }))
      .sort((a, b) => a.start - b.start);
  } catch {
    return [];
  }
}

function setCounterpointEvents(events) {
  const el = document.getElementById("counterpoint");
  if (!el) return;

  const total = getTotalQuarterSlots();
  const cleaned = (events || [])
    .filter((event) => event && typeof event.start === "number" && event.note && !isRestEvent(event))
    .map((event) => ({
      start: event.start,
      duration: DURATIONS[event.duration] ? event.duration : "q",
      note: event.note,
      rest: false
    }))
    .filter((event) => {
      const length = getDurationQuarters(event.duration);
      return event.start >= 0 && event.start + length <= total && event.start % 4 + length <= 4;
    })
    .sort((a, b) => a.start - b.start);

  el.value = JSON.stringify(cleaned);
}

function setCantus(notes) {
  const el = document.getElementById("cantus");
  if (el) el.value = notes.join(" ");
}

function getTotalQuarterSlots() {
  return getNotesFromTextarea("cantus").length * SCORE.quartersPerCantus;
}

function getDurationQuarters(duration) {
  return DURATIONS[duration]?.quarters || 1;
}

function getEventAtSlot(slot) {
  return getCounterpointEvents().find((event) => event.start === slot) || null;
}

function getEventCoveringSlot(slot) {
  return getCounterpointEvents().find((event) => {
    const length = getDurationQuarters(event.duration);
    return slot >= event.start && slot < event.start + length;
  }) || null;
}

function isSlotAvailable(start, duration, ignoreStart = null) {
  const total = getTotalQuarterSlots();
  const length = getDurationQuarters(duration);
  if (start < 0 || start + length > total) return false;
  if (start % 4 + length > 4) return false;

  const events = getCounterpointEvents();
  return !events.some((event) => {
    if (ignoreStart !== null && event.start === ignoreStart) return false;

    const a1 = start;
    const a2 = start + length;
    const b1 = event.start;
    const b2 = event.start + getDurationQuarters(event.duration);
    return a1 < b2 && b1 < a2;
  });
}

function syncRhythmButtons(duration = inputDuration) {
  document.querySelectorAll(".rhythm-button").forEach((button) => {
    button.classList.toggle("active", button.getAttribute("data-duration") === duration);
  });
}

function changeSelectedNoteDuration(duration) {
  if (!DURATIONS[duration]) return false;

  const selectedEvent = getEventAtSlot(selectedIndex) || getEventCoveringSlot(selectedIndex);
  if (!selectedEvent) return false;

  const start = selectedEvent.start;
  const newLength = getDurationQuarters(duration);
  const total = getTotalQuarterSlots();

  // Do not allow crossing the barline or exceeding the exercise length.
  if (start % 4 + newLength > 4 || start + newLength > total) {
    return false;
  }

  const newEnd = start + newLength;

  const updatedEvents = getCounterpointEvents()
    .filter((event) => {
      if (event.start === start) return false;

      const eventStart = event.start;
      const eventEnd = event.start + getDurationQuarters(event.duration);

      // Remove only notes that overlap with the resized selected note.
      return !(start < eventEnd && eventStart < newEnd);
    })
    .concat([{ ...selectedEvent, start, duration, rest: false }])
    .sort((a, b) => a.start - b.start);

  selectedIndex = start;
  inputDuration = duration;
  setCounterpointEvents(updatedEvents);
  syncRhythmButtons(duration);
  renderScore();
  updateDisplays();
  return true;
}

function setInputDuration(duration) {
  if (!DURATIONS[duration]) return;

  inputDuration = duration;
  syncRhythmButtons(duration);

  const changed = changeSelectedNoteDuration(duration);
  if (!changed) {
    renderScore();
  }
}

function selectCounterpointEventAtSlot(slot, playPreview = true) {
  const event = getEventAtSlot(slot) || getEventCoveringSlot(slot);
  if (!event) return null;

  selectedIndex = event.start;
  inputDuration = event.duration;
  syncRhythmButtons(event.duration);
  renderScore();

  if (playPreview && event.note) {
    playNoteName(event.note, 0.25, 0.8, "femaleSample");
  }

  return event;
}

function moveSelection(delta) {
  const total = getTotalQuarterSlots();
  if (!total) return;

  // Sibelius-like simple behavior: move by quarter slot.
  selectedIndex = Math.max(0, Math.min(total - 1, selectedIndex + delta));

  const selectedEvent = getEventAtSlot(selectedIndex) || getEventCoveringSlot(selectedIndex);
  if (selectedEvent) {
    selectedIndex = selectedEvent.start;
    inputDuration = selectedEvent.duration;
    syncRhythmButtons(inputDuration);
  }

  renderScore();
}

function moveSelectedNote(delta) {
  const selectedEvent = getEventAtSlot(selectedIndex) || getEventCoveringSlot(selectedIndex);
  if (!selectedEvent) return;

  const midi = noteToMidi(selectedEvent.note);
  if (midi === null) return;

  const updatedNote = midiToNote(midi + delta);
  const events = getCounterpointEvents().map((event) =>
    event.start === selectedEvent.start ? { ...event, note: updatedNote, rest: false } : event
  );

  selectedIndex = selectedEvent.start;
  setCounterpointEvents(events);
  renderScore();
  updateDisplays();
  playNoteName(updatedNote, 0.25, 1, "femaleSample");
}

function deleteSelectedNote() {
  const selectedEvent = getEventAtSlot(selectedIndex) || getEventCoveringSlot(selectedIndex);
  if (!selectedEvent) return;

  const events = getCounterpointEvents().filter((event) => event.start !== selectedEvent.start);
  selectedIndex = selectedEvent.start;
  setCounterpointEvents(events);
  renderScore();
  updateDisplays();
}

function clearCounterpoint() {
  stopPlayback(true);
  selectedIndex = 0;
  playbackIndex = 0;
  analysisIssues = [];
  setCounterpointEvents([]);
  renderScore();
}

function getScorePositions(noteCount) {
  const usableWidth = SCORE.width - SCORE.left - SCORE.right;
  const count = Math.max(noteCount, 1);
  const spacing = usableWidth / count;
  return Array.from({ length: count }, (_, i) => SCORE.left + spacing * i + spacing / 2);
}

function createSvgElement(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function clearSvg(svg) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function drawClef(svg, bottomLineY, clef = "treble") {
  const symbol = clef === "bass" ? "𝄢" : "𝄞";
  const x = clef === "bass" ? 30 : 28;
  const y = clef === "bass" ? bottomLineY - SCORE.lineGap * 1.45 : bottomLineY + SCORE.lineGap * 0.15;

  svg.appendChild(createSvgElement("text", {
    x,
    y,
    class: "music-symbol clef-symbol"
  })).textContent = symbol;
}

function drawStaff(svg, bottomLineY, label, noteCount, clefType = "treble") {
  const startX = SCORE.left - 30;
  const endX = SCORE.width - SCORE.right + 10;

  for (let i = 0; i < 5; i++) {
    const y = bottomLineY - i * SCORE.staffGap;
    svg.appendChild(createSvgElement("line", { x1: startX, y1: y, x2: endX, y2: y, class: "staff-line" }));
  }

  drawClef(svg, bottomLineY, clefType);
  svg.appendChild(createSvgElement("text", { x: 22, y: bottomLineY - 58, class: "voice-label" })).textContent = label;

  const positions = getScorePositions(noteCount);

  positions.forEach((x, i) => {
    const isDownbeat = i % 4 === 0;

    svg.appendChild(createSvgElement("circle", {
      cx: x,
      cy: bottomLineY + 56,
      r: isDownbeat ? 3.4 : 2.2,
      class: isDownbeat ? "downbeat-marker" : "slot-marker"
    }));

    if (clefType === "treble" && i === selectedIndex && !isPlaying) {
      svg.appendChild(createSvgElement("rect", {
        x: x - 10,
        y: bottomLineY - 58,
        width: 20,
        height: 118,
        rx: 6,
        class: "selection-halo"
      }));
    }

    if (bottomLineY === SCORE.cantusBottomLineY && isDownbeat) {
      svg.appendChild(createSvgElement("text", { x: x - 4, y: bottomLineY + 82, class: "note-label" })).textContent = Math.floor(i / 4) + 1;
    }

    if (i > 0) {
      const midX = (positions[i - 1] + x) / 2;
      svg.appendChild(createSvgElement("line", {
        x1: midX,
        y1: bottomLineY - 50,
        x2: midX,
        y2: bottomLineY + 66,
        class: isDownbeat ? "measure-line" : "subdivision-line"
      }));
    }
  });
}

function drawLedgerLines(svg, x, y, bottomLineY) {
  const topLineY = bottomLineY - 4 * SCORE.staffGap;

  if (y < topLineY - SCORE.noteStep) {
    for (let ly = topLineY - 2 * SCORE.noteStep; ly >= y - 1; ly -= 2 * SCORE.noteStep) {
      svg.appendChild(createSvgElement("line", { x1: x - 14, y1: ly, x2: x + 14, y2: ly, class: "ledger-line" }));
    }
  }

  if (y > bottomLineY + SCORE.noteStep) {
    for (let ly = bottomLineY + 2 * SCORE.noteStep; ly <= y + 1; ly += 2 * SCORE.noteStep) {
      svg.appendChild(createSvgElement("line", { x1: x - 14, y1: ly, x2: x + 14, y2: ly, class: "ledger-line" }));
    }
  }
}

function drawAccidental(svg, parsed, x, y, issueClass = "") {
  if (!parsed.accidental) return;
  const symbol = parsed.accidental === "#" ? "♯" : "♭";
  svg.appendChild(createSvgElement("text", { x: x - 30, y: y + 1, class: `accidental${issueClass ? " " + issueClass : ""}` })).textContent = symbol;
}

function getIssueFor(voice, index) {
  const exactError = analysisIssues.find((issue) => issue.voice === voice && issue.index === index && issue.type === "error");
  if (exactError) return exactError;
  return analysisIssues.find((issue) => issue.voice === voice && issue.index === index && issue.type === "warn") || null;
}

function getIssueClass(voice, index) {
  const issue = getIssueFor(voice, index);
  return issue ? issue.type : "";
}

function drawIssueRing(svg, x, y, issueClass) {
  if (!issueClass) return;
  svg.appendChild(createSvgElement("circle", { cx: x, cy: y, r: 15, class: issueClass === "warn" ? "issue-ring warn" : "issue-ring" }));
}

function supportsMusicFontGlyph() {
  if (typeof document === "undefined") return false;

  // Prefer the browser Font Loading API when available.
  if (document.fonts && typeof document.fonts.check === "function") {
    const candidates = [
      "28px Bravura",
      "28px Noto Music",
      "28px Finale Maestro",
      "28px Petaluma",
      "28px Maestro",
      "28px Opus"
    ];

    if (candidates.some((font) => document.fonts.check(font, "𝄽"))) {
      return true;
    }
  }

  // Conservative fallback: use SVG if support cannot be confirmed.
  return false;
}

function getRestGlyph(duration = "q") {
  if (duration === "w") return "𝄻";
  if (duration === "h") return "𝄼";
  return "𝄽";
}

function drawRest(svg, x, voice, index, bottomLineY, duration = "q") {
  // Stable version: do not draw generated rests.
  // Empty beats remain empty and clickable.
}

function drawNote(svg, note, x, voice, index, bottomLineY, duration = "q") {
  const y = noteToY(note, bottomLineY);
  const parsed = parseNote(note);
  if (y === null || !parsed) return;

  const isCantus = voice === "cantus";
  const isSelected = !isCantus && index === selectedIndex && !isPlaying;
  const isCurrentPlayback = index === playbackIndex && isPlaying;
  const issueClass = getIssueClass(voice, index);
  const durationInfo = DURATIONS[duration] || DURATIONS.q;
  const isOpen = isCantus || duration === "h" || duration === "w";

  drawLedgerLines(svg, x, y, bottomLineY);
  drawIssueRing(svg, x, y, issueClass);
  drawAccidental(svg, parsed, x, y, issueClass);

  svg.appendChild(createSvgElement("ellipse", {
    cx: x,
    cy: y,
    rx: 8.8,
    ry: 5.8,
    transform: `rotate(-18 ${x} ${y})`,
    class: [
      "note-head",
      isOpen ? "open" : "",
      isCantus ? "cantus" : "",
      isSelected ? "selected" : "",
      isCurrentPlayback ? "playing" : "",
      issueClass
    ].filter(Boolean).join(" ")
  }));

  if (!isCantus && duration !== "w") {
    svg.appendChild(createSvgElement("line", {
      x1: x + 7,
      y1: y,
      x2: x + 7,
      y2: y - 34,
      class: ["note-stem", isSelected ? "selected" : "", isCurrentPlayback ? "playing" : "", issueClass].filter(Boolean).join(" ")
    }));
  }

  svg.appendChild(createSvgElement("text", {
    x: x - 12,
    y: isCantus ? bottomLineY + 48 : bottomLineY - 62,
    class: ["note-label", isSelected ? "selected" : "", isCurrentPlayback ? "playing" : "", issueClass].filter(Boolean).join(" ")
  })).textContent = note;

  if (!isCantus) {
    svg.appendChild(createSvgElement("text", { x: x - 4, y: bottomLineY - 78, class: "duration-tag" })).textContent = durationInfo.label;
  }
}

function drawPlayhead(svg, positions, noteCount) {
  if (!noteCount) return;
  const safeIndex = Math.min(playbackIndex, noteCount - 1);
  const x = positions[safeIndex];
  svg.appendChild(createSvgElement("rect", { x: x - 12, y: SCORE.playheadTop, width: 24, height: SCORE.playheadBottom - SCORE.playheadTop, rx: 8, class: "playhead-halo" }));
  svg.appendChild(createSvgElement("line", { x1: x, y1: SCORE.playheadTop, x2: x, y2: SCORE.playheadBottom, class: "playhead-line" }));
}

function renderScore() {
  const svg = document.getElementById("scoreEditor");
  if (!svg) return;

  clearSvg(svg);

  const cantus = getNotesFromTextarea("cantus");
  const events = getCounterpointEvents();
  const totalSlots = Math.max(getTotalQuarterSlots(), 1);
  const positions = getScorePositions(totalSlots);

  if (selectedIndex >= totalSlots) selectedIndex = totalSlots - 1;
  if (selectedIndex < 0) selectedIndex = 0;
  if (playbackIndex >= totalSlots) playbackIndex = 0;
  if (playbackIndex < 0) playbackIndex = 0;

  drawStaff(svg, SCORE.topBottomLineY, "Counterpoint / mixed / treble clef", totalSlots, "treble");
  drawStaff(svg, SCORE.cantusBottomLineY, "Cantus / whole notes / bass clef", totalSlots, "bass");
  drawPlayhead(svg, positions, totalSlots);

  events.forEach((event) => {
    const x = positions[event.start];
    if (x !== undefined && event.note && !isRestEvent(event)) {
      drawNote(svg, event.note, x, "counterpoint", event.start, SCORE.topBottomLineY, event.duration);
    }
  });

  cantus.forEach((note, i) => {
    const x = positions[i * 4];
    if (note && x !== undefined) drawNote(svg, note, x, "cantus", i * 4, SCORE.cantusBottomLineY, "w");
  });

  updateDisplays();
}

function handleScoreClick(event) {
  if (isPlaying) return;

  const svg = document.getElementById("scoreEditor");
  if (!svg) return;

  const rect = svg.getBoundingClientRect();
  const viewX = ((event.clientX - rect.left) / rect.width) * SCORE.width;
  const viewY = ((event.clientY - rect.top) / rect.height) * SCORE.height;

  if (viewY > (SCORE.topBottomLineY + SCORE.cantusBottomLineY) / 2) return;

  const totalSlots = getTotalQuarterSlots();
  const positions = getScorePositions(totalSlots);

  let nearestIndex = 0;
  let nearestDistance = Infinity;
  positions.forEach((x, i) => {
    const distance = Math.abs(x - viewX);
    if (distance < nearestDistance) {
      nearestIndex = i;
      nearestDistance = distance;
    }
  });

  const clickedNote = yToNaturalNote(viewY);
  const coveringEvent = getEventCoveringSlot(nearestIndex);

  // Existing note: select it and update pitch when clicking near its head.
  if (coveringEvent) {
    selectedIndex = coveringEvent.start;
    inputDuration = coveringEvent.duration;
    syncRhythmButtons(inputDuration);

    const headX = positions[coveringEvent.start];
    const closeToHead = headX !== undefined && Math.abs(viewX - headX) < 20;

    if (closeToHead) {
      const events = getCounterpointEvents().map((event) =>
        event.start === coveringEvent.start ? { ...event, note: clickedNote, rest: false } : event
      );
      setCounterpointEvents(events);
      renderScore();
      updateDisplays();
      playNoteName(clickedNote, 0.45, 1, "femaleSample");
      return;
    }

    renderScore();
    if (coveringEvent.note) playNoteName(coveringEvent.note, 0.25, 0.8, "femaleSample");
    return;
  }

  const start = nearestIndex;

  // Empty slot: insert note if it does not overlap another note.
  if (!isSlotAvailable(start, inputDuration, null)) {
    selectedIndex = start;
    renderScore();
    return;
  }

  const events = getCounterpointEvents();
  events.push({ start, duration: inputDuration, note: clickedNote, rest: false });
  events.sort((a, b) => a.start - b.start);

  selectedIndex = start;
  setCounterpointEvents(events);
  syncRhythmButtons(inputDuration);
  renderScore();
  updateDisplays();
  playNoteName(clickedNote, 0.45, 1, "femaleSample");
}

function updateDisplays() {
  const cantusDisplay = document.getElementById("cantusDisplay");
  const counterpointDisplay = document.getElementById("counterpointDisplay");
  const scoreMeta = document.getElementById("scoreMeta");

  if (cantusDisplay) {
    cantusDisplay.textContent = getNotesFromTextarea("cantus").join(" ");
  }

  if (counterpointDisplay) {
    const events = getCounterpointEvents()
      .filter((event) => event.note && !isRestEvent(event))
      .map((event) => `${event.note}:${event.duration}@${event.start}`);
    counterpointDisplay.textContent = events.length ? events.join(" ") : "—";
  }

  if (scoreMeta) {
    const totalNotes = getNotesFromTextarea("cantus").length;
    scoreMeta.textContent = `${t("counterpointCount")}: ${getCounterpointEvents().length}${currentLanguage === "ja" ? "音" : " notes"} / ${t("beats")}: ${getTotalQuarterSlots()} / ${t("playbackPosition")}: ${playbackIndex + 1}`;
  }
}

function addResult(results, type, message) {
  results.push({ type, message });
}

function renderResults(results) {
  const resultBox = document.getElementById("result");
  if (!resultBox) return;

  resultBox.innerHTML = results.map((item) => {
    let label = t("labelOk");
    if (item.type === "warn") label = t("labelWarn");
    if (item.type === "error") label = t("labelError");

    return `<div class="result-item ${item.type}"><span class="result-label">${label}</span>${item.message}</div>`;
  }).join("");
}

function renderSummary(errorCount, warnCount, okCount) {
  const summary = document.getElementById("summary");
  if (!summary) return;
  summary.removeAttribute("data-i18n");
  summary.innerHTML = errorCount === 0 && warnCount === 0
    ? t("summaryOk")(okCount)
    : t("summaryCounts")(errorCount, warnCount, okCount);
}

function getIntervalName(semitones) {
  const abs = Math.abs(semitones);
  const simple = abs % 12;
  const intervals = t("intervals");
  if (abs === 0) return intervals.perfectUnison;
  if (abs === 12) return intervals.perfectOctave;
  const names = {
    0: intervals.compoundPerfect,
    1: intervals.m2,
    2: intervals.M2,
    3: intervals.m3,
    4: intervals.M3,
    5: intervals.P4,
    6: intervals.tritone,
    7: intervals.P5,
    8: intervals.m6,
    9: intervals.M6,
    10: intervals.m7,
    11: intervals.M7
  };
  return names[simple] || intervals.unknown;
}

function getSimpleInterval(semitones) {
  return Math.abs(semitones) % 12;
}

function isConsonant(semitones) {
  return [0, 3, 4, 7, 8, 9].includes(getSimpleInterval(semitones));
}

function isPerfectFifth(semitones) {
  return getSimpleInterval(semitones) === 7;
}

function isPerfectOctaveOrUnison(semitones) {
  const abs = Math.abs(semitones);
  return abs === 0 || getSimpleInterval(semitones) === 0;
}

function direction(a, b) {
  if (b > a) return 1;
  if (b < a) return -1;
  return 0;
}

function isStep(a, b) {
  if (a === null || b === null) return false;
  return Math.abs(b - a) <= 2 && Math.abs(b - a) > 0;
}

function expandCounterpointToSlots(events, totalSlots) {
  const slots = Array.from({ length: totalSlots }, () => null);
  events.forEach((event) => {
    const length = getDurationQuarters(event.duration);
    for (let i = 0; i < length; i++) {
      if (event.start + i < totalSlots) {
        slots[event.start + i] = { ...event, held: i > 0 };
      }
    }
  });
  return slots;
}

function isPassingOrNeighbor(cpMidiSlots, slot) {
  const prev = cpMidiSlots[slot - 1];
  const cur = cpMidiSlots[slot];
  const next = cpMidiSlots[slot + 1];

  if ([prev, cur, next].some((v) => v === null || v === undefined)) return false;

  const d1 = direction(prev, cur);
  const d2 = direction(cur, next);
  const passing = d1 !== 0 && d1 === d2 && isStep(prev, cur) && isStep(cur, next);
  const neighbor = prev === next && isStep(prev, cur) && isStep(cur, next);

  return passing || neighbor;
}

function analyzeCounterpoint() {
  analysisIssues = [];

  const cantus = getNotesFromTextarea("cantus");
  const events = getCounterpointEvents();
  const results = [];
  let errorCount = 0;
  let warnCount = 0;
  let okCount = 0;

  if (!cantus.length || !events.length) {
    addResult(results, "error", t("needInput"));
    renderSummary(1, 0, 0);
    renderResults(results);
    renderScore();
    return;
  }

  const totalSlots = getTotalQuarterSlots();
  const usedSlots = events.reduce((sum, event) => sum + getDurationQuarters(event.duration), 0);

  if (usedSlots !== totalSlots) {
    addResult(results, "error", t("lengthMismatch")(totalSlots, usedSlots));
    errorCount++;
  } else {
    addResult(results, "ok", t("lengthOk")(totalSlots));
    okCount++;
  }

  events.forEach((event, i) => {
    if (noteToMidi(event.note) === null) {
      addResult(results, "error", t("invalidNote")(i + 1));
      analysisIssues.push({ voice: "counterpoint", index: event.start, type: "error" });
      errorCount++;
    }

    if (event.start % 4 + getDurationQuarters(event.duration) > 4) {
      addResult(results, "error", t("overlap"));
      analysisIssues.push({ voice: "counterpoint", index: event.start, type: "error" });
      errorCount++;
    }
  });

  const slots = expandCounterpointToSlots(events, totalSlots);
  const cpMidiSlots = slots.map((slot) => slot ? noteToMidi(slot.note) : null);
  const cantusMidi = cantus.map(noteToMidi);

  for (let slot = 0; slot < totalSlots; slot++) {
    const slotEvent = slots[slot];
    if (!slotEvent) continue;

    const cpMidi = noteToMidi(slotEvent.note);
    const cMidi = cantusMidi[Math.floor(slot / 4)];
    if (cpMidi === null || cMidi === null) continue;

    const interval = cpMidi - cMidi;
    const name = getIntervalName(interval);
    const beatInMeasure = slot % 4;
    const isStrong = beatInMeasure === 0 || beatInMeasure === 2;

    if (isStrong || !slotEvent.held) {
      if (isConsonant(interval)) {
        addResult(results, "ok", isStrong ? t("strongOk")(slot + 1, name) : t("consonanceOk")(slot + 1, name));
        okCount++;
      } else if (!isStrong && isPassingOrNeighbor(cpMidiSlots, slot)) {
        addResult(results, "ok", t("weakDissonanceOk")(slot + 1, name));
        okCount++;
      } else {
        const type = isStrong ? "error" : "warn";
        addResult(results, type, isStrong ? t("strongBad")(slot + 1, name) : t("weakDissonanceBad")(slot + 1, name));
        analysisIssues.push({ voice: "counterpoint", index: slotEvent.start, type });
        analysisIssues.push({ voice: "cantus", index: Math.floor(slot / 4) * 4, type });
        if (type === "error") errorCount++;
        else warnCount++;
      }
    }
  }

  for (let slot = 0; slot < totalSlots - 1; slot++) {
    if (!slots[slot] || !slots[slot + 1]) continue;

    const c1 = cantusMidi[Math.floor(slot / 4)];
    const c2 = cantusMidi[Math.floor((slot + 1) / 4)];
    const cp1 = cpMidiSlots[slot];
    const cp2 = cpMidiSlots[slot + 1];

    if ([c1, c2, cp1, cp2].some((v) => v === null || v === undefined)) continue;

    const cDir = direction(c1, c2);
    const cpDir = direction(cp1, cp2);

    if (cDir !== 0 && cDir === cpDir) {
      const interval1 = cp1 - c1;
      const interval2 = cp2 - c2;

      if (isPerfectFifth(interval1) && isPerfectFifth(interval2)) {
        addResult(results, "error", t("parallelFifth")(slot + 1, slot + 2));
        analysisIssues.push({ voice: "counterpoint", index: slots[slot].start, type: "error" });
        analysisIssues.push({ voice: "counterpoint", index: slots[slot + 1].start, type: "error" });
        errorCount++;
      }

      if (isPerfectOctaveOrUnison(interval1) && isPerfectOctaveOrUnison(interval2)) {
        addResult(results, "error", t("parallelOctave")(slot + 1, slot + 2));
        analysisIssues.push({ voice: "counterpoint", index: slots[slot].start, type: "error" });
        analysisIssues.push({ voice: "counterpoint", index: slots[slot + 1].start, type: "error" });
        errorCount++;
      }
    }
  }

  renderSummary(errorCount, warnCount, okCount);
  renderResults(results);
  renderScore();
}

function playNoteName(note, duration = 0.38, gainScale = 1, voiceSet = "femaleSample") {
  const midi = noteToMidi(note);
  if (midi === null) return;
  playMidiNote(midi, duration, gainScale, voiceSet);
}

function getTempo() {
  const input = document.getElementById("tempoInput");
  const raw = input ? parseInt(input.value, 10) : 60;
  if (Number.isNaN(raw)) return 60;
  return Math.min(160, Math.max(40, raw));
}

function getStepDurationSeconds() {
  return 60 / getTempo();
}

function getPlaybackMode() {
  const select = document.getElementById("playbackModeSelect");
  return select ? select.value : "both";
}

function playSelectedNote() {
  const selectedEvent = getEventAtSlot(selectedIndex) || getEventCoveringSlot(selectedIndex);
  if (selectedEvent && selectedEvent.note) {
    playNoteName(selectedEvent.note, 0.45, 1, "femaleSample");
  }
}

function previewTimbre() {
  const event = getEventAtSlot(selectedIndex) || getCounterpointEvents()[0];
  const note = event?.note || "C4";
  playNoteName(note, 0.5, 1, "femaleSample");
}

function updatePlayPauseButton() {
  const button = document.getElementById("playPauseButton");
  if (!button) return;
  button.textContent = isPlaying ? t("stop") : t("play");
}

function togglePlayback() {
  if (isPlaying) stopPlayback(false);
  else startPlayback();
}

function startPlayback() {
  const length = getTotalQuarterSlots();
  if (!length) return;
  if (playbackIndex >= length) playbackIndex = 0;
  getAudioContext();
  isPlaying = true;
  updatePlayPauseButton();
  playCurrentStep();
}

function stopPlayback(resetToStart = false) {
  isPlaying = false;
  if (playbackTimerId !== null) {
    window.clearTimeout(playbackTimerId);
    playbackTimerId = null;
  }

  if (resetToStart) {
    playbackIndex = 0;
    selectedIndex = 0;
  }

  updatePlayPauseButton();
  renderScore();
}

function playCurrentStep() {
  if (!isPlaying) return;

  const length = getTotalQuarterSlots();
  if (playbackIndex >= length) {
    isPlaying = false;
    playbackIndex = 0;
    updatePlayPauseButton();
    renderScore();
    return;
  }

  renderScore();

  const mode = getPlaybackMode();
  const qDuration = getStepDurationSeconds();
  const cantus = getNotesFromTextarea("cantus");
  const cantusIndex = Math.floor(playbackIndex / 4);
  const event = getEventAtSlot(playbackIndex);

  if ((mode === "both" || mode === "cantus") && playbackIndex % 4 === 0 && cantus[cantusIndex]) {
    playNoteName(cantus[cantusIndex], qDuration * 3.85, mode === "both" ? 0.62 : 1, "maleSample", "maleSample");
  }

  if ((mode === "both" || mode === "counterpoint") && event) {
    playNoteName(event.note, qDuration * getDurationQuarters(event.duration) * 0.9, 1);
  }

  playbackTimerId = window.setTimeout(() => {
    playbackIndex += 1;
    playCurrentStep();
  }, qDuration * 1000);
}

function populateExerciseSelect(keepValue = false) {
  const select = document.getElementById("exerciseSelect");
  if (!select) return;

  const previousValue = select.value;
  select.innerHTML = "";

  EXERCISES.forEach((exercise, index) => {
    const option = document.createElement("option");
    option.value = exercise.id;
    option.textContent = exercise.title[currentLanguage] || exercise.title.ja;
    if ((keepValue && previousValue === exercise.id) || (!keepValue && index === 0)) option.selected = true;
    select.appendChild(option);
  });

  updateExerciseDescription();
}

function getSelectedExercise() {
  const select = document.getElementById("exerciseSelect");
  if (!select) return EXERCISES[0];
  return EXERCISES.find((exercise) => exercise.id === select.value) || EXERCISES[0];
}

function updateExerciseDescription() {
  const description = document.getElementById("exerciseDescription");
  const exercise = getSelectedExercise();
  if (!description || !exercise) return;
  description.textContent = exercise.description[currentLanguage] || exercise.description.ja;
}

function loadSelectedExercise() {
  const exercise = getSelectedExercise();
  if (!exercise) return;

  stopPlayback(true);
  analysisIssues = [];
  setCantus(exercise.cantus);
  setCounterpointEvents(exercise.counterpoint || []);
  selectedIndex = 0;
  playbackIndex = 0;
  renderScore();
}

function setExample() {
  const select = document.getElementById("exerciseSelect");
  if (select) select.value = "mixed-example-filled";
  updateExerciseDescription();
  loadSelectedExercise();
}

function midiEncodeVariableLength(value) {
  let buffer = value & 0x7f;
  const bytes = [];
  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= ((value & 0x7f) | 0x80);
  }
  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8;
    else break;
  }
  return bytes;
}

function midiTextBytes(text) {
  return Array.from(text).map((char) => char.charCodeAt(0) & 0xff);
}

function midiNumberToBytes(value, length) {
  const bytes = [];
  for (let i = length - 1; i >= 0; i--) bytes.push((value >> (i * 8)) & 0xff);
  return bytes;
}

function midiTrackChunk(events) {
  const data = [];
  events.forEach((event) => data.push(...event));
  return [...midiTextBytes("MTrk"), ...midiNumberToBytes(data.length, 4), ...data];
}

function midiNoteEvent(delta, status, note, velocity) {
  return [...midiEncodeVariableLength(delta), status, note, velocity];
}

function midiMetaEvent(delta, type, data) {
  return [...midiEncodeVariableLength(delta), 0xff, type, data.length, ...data];
}

function midiCreateFile(tracks, ticksPerQuarter = 480) {
  return new Uint8Array([
    ...midiTextBytes("MThd"),
    0x00, 0x00, 0x00, 0x06,
    0x00, 0x01,
    ...midiNumberToBytes(tracks.length, 2),
    ...midiNumberToBytes(ticksPerQuarter, 2),
    ...tracks.flat()
  ]);
}

function midiDownload(bytes, filename) {
  const blob = new Blob([bytes], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function midiBuildEventTrack(trackName, events, channel, velocity = 86) {
  const ticksPerQuarter = 480;
  const midiEvents = [midiMetaEvent(0, 0x03, midiTextBytes(trackName))];
  let cursor = 0;

  events.sort((a, b) => a.start - b.start).forEach((event) => {
    const midi = noteToMidi(event.note);
    if (midi === null) return;
    const startTick = event.start * ticksPerQuarter;
    const delta = Math.max(0, startTick - cursor);
    const durationTicks = getDurationQuarters(event.duration) * ticksPerQuarter;
    midiEvents.push(midiNoteEvent(delta, 0x90 + channel, midi, velocity));
    midiEvents.push(midiNoteEvent(durationTicks, 0x80 + channel, midi, 0));
    cursor = startTick + durationTicks;
  });

  midiEvents.push(midiMetaEvent(0, 0x2f, []));
  return midiTrackChunk(midiEvents);
}

function exportMidi() {
  const ticksPerQuarter = 480;
  const wholeTicks = ticksPerQuarter * 4;
  const cantus = getNotesFromTextarea("cantus");
  const events = getCounterpointEvents();

  if (!cantus.length && !events.length) {
    alert(currentLanguage === "fr" ? "Aucune note à exporter." : "書き出す音がありません。");
    return;
  }

  const conductorEvents = [
    midiMetaEvent(0, 0x03, midiTextBytes("Tempo / Meter")),
    midiMetaEvent(0, 0x51, [0x0f, 0x42, 0x40]),
    midiMetaEvent(0, 0x58, [0x04, 0x02, 0x18, 0x08]),
    midiMetaEvent(0, 0x2f, [])
  ];

  const cantusEvents = cantus.map((note, i) => ({ start: i * 4, duration: "w", note }));

  const tracks = [
    midiTrackChunk(conductorEvents),
    midiBuildEventTrack("Cantus / whole notes", cantusEvents, 0, 72),
    midiBuildEventTrack("Counterpoint / mixed", events, 1, 86)
  ];

  const bytes = midiCreateFile(tracks, ticksPerQuarter);
  midiDownload(bytes, "mixed_two_voice_counterpoint_tempo60_4-4.mid");
}

window.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("scoreEditor");
  if (svg) svg.addEventListener("click", handleScoreClick);

  document.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName?.toLowerCase();
    const isTextInput = activeTag === "textarea" || activeTag === "input" || activeTag === "select";

    if (event.code === "Space") {
      event.preventDefault();
      togglePlayback();
      return;
    }

    if (isTextInput) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveSelection(1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveSelection(-1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelectedNote(1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSelectedNote(-1);
      return;
    }

    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      deleteSelectedNote();
    }
  });

  const exerciseSelect = document.getElementById("exerciseSelect");
  if (exerciseSelect) exerciseSelect.addEventListener("change", updateExerciseDescription);

  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) languageSelect.value = currentLanguage;

  populateExerciseSelect();
  setLanguage(currentLanguage);
  setInputDuration(inputDuration);
  loadSelectedExercise();
  updatePlayPauseButton();
});
