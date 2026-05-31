const NATURAL_NOTES = [
  "C3", "D3", "E3", "F3", "G3", "A3", "B3",
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  "C6", "D6", "E6", "F6", "G6", "A6", "B6"
];

const NOTE_LETTER_STEPS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const SVG_NS = "http://www.w3.org/2000/svg";

const SCORE = {
  width: 1120,
  height: 360,
  left: 105,
  right: 55,
  staffGap: 10,
  noteStep: 5,
  bottomLineY: 135,
  cantusBottomLineY: 260,
  playheadTop: 50,
  playheadBottom: 318,
  quartersPerCantus: 2
};

const I18N = {
  ja: {
    backLink: "← トップへ戻る",
    languageLabel: "言語",
    title: "Module 2｜全音符に対する2声二分音符対位法チェッカー",
    lead: "ヘ音記号の全音符の定旋律1音に対して、ト音記号の対旋律を二分音符2つで入力します。タイでつながれた音は扱いません。五線譜をクリックして音を置き、↑↓で半音移動、←→で前後の二分音符へ移動できます。",
    levelFilterLabel: "レベル",
    levelAll: "すべて",
    levelBeginner: "初級",
    levelIntermediate: "中級",
    levelAdvanced: "上級",
    exerciseLabel: "課題",
    loadExercise: "課題を読み込む",
    loadExample: "例題を読み込む",
    deleteLast: "最後の音を削除",
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
    timbreSquare: "Square / 電子的",
    timbreSaw: "Sawtooth / 明るい",
    timbreOrgan: "Organ / オルガン風",
    timbreBell: "Bell / ベル風",
    timbreHumanVoice: "人の声",
    playbackHint: "Space：再生 / 停止　｜　← / →：前後の二分音符へ移動",
    scoreInputTitle: "五線入力",
    scoreInputHelp: "上段はト音記号の二分音符対旋律、下段はヘ音記号の全音符定旋律です。タイ入力はありません。",
    currentInput: "現在の入力",
    cantusLabel: "定旋律：",
    counterpointLabel: "対旋律：",
    analyze: "解析する",
    analysisResult: "解析結果",
    notAnalyzed: "まだ解析していません。",
    play: "再生",
    stop: "停止",
    noInput: "未入力",
    emptySlot: "未入力",
    status: (cp, cf, pos, len) => `対旋律：${cp}音 / 必要：${cf * 4}音 / 再生位置：${pos}/${len}`,
    summaryOk: (ok) => `大きな問題は見つかりませんでした。OK項目：${ok}件`,
    summaryCounts: (e, w, ok) => `禁止：${e}件 / 注意：${w}件 / OK：${ok}件`,
    labelOk: "OK",
    labelWarn: "注意",
    labelError: "禁止",
    needInput: "定旋律と二分音符の対旋律を入力してください。",
    lengthMismatch: (need, got) => `音数が一致していません。必要な二分音符は${need}音、現在は${got}音です。`,
    lengthOk: (n) => `二分音符の数は一致しています。全${n}音です。`,
    invalidNote: (i) => `${i}番目の二分音符：音名の形式が正しくありません。例：C4, F#4, Bb3`,
    downbeatOk: (m, name) => `小節${m}の拍頭：定旋律との音程は ${name} です。`,
    downbeatBad: (m, name) => `小節${m}の拍頭：定旋律との音程は ${name} です。拍頭では協和音程が必要です。`,
    offbeatOk: (q, name) => `${q}番目の二分音符：${name}。協和音程です。`,
    passingOk: (q, name) => `${q}番目の二分音符：${name}。順次進行による経過的な不協和として扱えます。`,
    neighborOk: (q, name) => `${q}番目の二分音符：${name}。補助音的な不協和として扱えます。`,
    offbeatBad: (q, name) => `${q}番目の二分音符：${name}。弱拍の不協和ですが、順次進行による経過音・補助音として説明しにくい形です。`,
    parallelFifth: (a, b) => `${a}番目 → ${b}番目：連続5度があります。`,
    parallelOctave: (a, b) => `${a}番目 → ${b}番目：連続8度または連続1度があります。`,
    noTies: "このモジュールではタイでつながれた音は入力しません。すべて独立した二分音符として扱います。",
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
    title: "Module 2 — Contrepoint à deux voix en blanches",
    lead: "Pour chaque ronde du cantus en clé de fa, saisissez deux blanches dans le contrepoint en clé de sol. Ce module n’utilise pas de notes liées. Cliquez sur la portée pour placer une note, ↑↓ déplacent par demi-ton, ←→ changent de blanche.",
    levelFilterLabel: "Niveau",
    levelAll: "Tous",
    levelBeginner: "Débutant",
    levelIntermediate: "Intermédiaire",
    levelAdvanced: "Avancé",
    exerciseLabel: "Exercice",
    loadExercise: "Charger l’exercice",
    loadExample: "Charger l’exemple",
    deleteLast: "Supprimer la dernière note",
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
    timbreSquare: "Square / électronique",
    timbreSaw: "Sawtooth / brillant",
    timbreOrgan: "Organ / orgue",
    timbreBell: "Bell / cloche",
    timbreHumanVoice: "Voix humaine",
    playbackHint: "Espace : lecture / arrêt　｜　← / → : blanche précédente / suivante",
    scoreInputTitle: "Saisie sur portée",
    scoreInputHelp: "La portée supérieure montre le contrepoint en blanches en clé de sol ; la portée inférieure montre le cantus en rondes en clé de fa. Il n’y a pas de liaison.",
    currentInput: "Saisie actuelle",
    cantusLabel: "Cantus :",
    counterpointLabel: "Contrepoint :",
    analyze: "Analyser",
    analysisResult: "Résultat de l’analyse",
    notAnalyzed: "Pas encore analysé.",
    play: "Lecture",
    stop: "Arrêter",
    noInput: "Non saisi",
    emptySlot: "vide",
    status: (cp, cf, pos, len) => `Contrepoint : ${cp} notes / requis : ${cf * 4} / Position : ${pos}/${len}`,
    summaryOk: (ok) => `Aucun problème majeur détecté. Éléments OK : ${ok}`,
    summaryCounts: (e, w, ok) => `Interdits : ${e} / Attention : ${w} / OK : ${ok}`,
    labelOk: "OK",
    labelWarn: "Attention",
    labelError: "Interdit",
    needInput: "Veuillez saisir le cantus et le contrepoint en blanches.",
    lengthMismatch: (need, got) => `Le nombre de blanches ne correspond pas. Requis : ${need}, saisi : ${got}.`,
    lengthOk: (n) => `Le nombre de blanches correspond. Total : ${n}.`,
    invalidNote: (i) => `Noire ${i} : format de note invalide. Exemple : C4, F#4, Bb3`,
    downbeatOk: (m, name) => `Mesure ${m}, temps fort : l’intervalle avec le cantus est ${name}.`,
    downbeatBad: (m, name) => `Mesure ${m}, temps fort : l’intervalle avec le cantus est ${name}. Sur le temps fort, une consonance est requise.`,
    offbeatOk: (q, name) => `Noire ${q} : ${name}. Intervalle consonant.`,
    passingOk: (q, name) => `Noire ${q} : ${name}. Dissonance acceptable comme note de passage conjointe.`,
    neighborOk: (q, name) => `Noire ${q} : ${name}. Dissonance acceptable comme note auxiliaire.`,
    offbeatBad: (q, name) => `Noire ${q} : ${name}. Dissonance faible, mais elle n’est pas clairement justifiée par mouvement conjoint.`,
    parallelFifth: (a, b) => `Noire ${a} → ${b} : quintes parallèles.`,
    parallelOctave: (a, b) => `Noire ${a} → ${b} : octaves ou unissons parallèles.`,
    noTies: "Ce module n’utilise pas de notes liées : chaque note est traitée comme une blanche indépendante.",
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
    id: "module2-c-major-01",
    level: "beginner",
    title: { ja: "初級 01｜C major｜順次進行", fr: "Débutant 01｜Do majeur｜Mouvement conjoint" },
    description: {
      ja: "全音符の定旋律1音につき、二分音符を2つ置く基本課題です。",
      fr: "Exercice de base : deux blanches de contrepoint pour chaque ronde du cantus."
    },
    cantus: ["C4", "D4", "E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4", "C4"],
    counterpoint: []
  },
  {
    id: "module2-g-major-01",
    level: "beginner",
    title: { ja: "初級 02｜G major｜F#あり", fr: "Débutant 02｜Sol majeur｜Avec Fa#" },
    description: {
      ja: "G majorの二分音符対位法課題です。",
      fr: "Exercice en Sol majeur pour le contrepoint en blanches."
    },
    cantus: ["G3", "A3", "B3", "C4", "D4", "E4", "D4", "C4", "B3", "A3", "G3"],
    counterpoint: []
  },
  {
    id: "module2-f-major-01",
    level: "intermediate",
    title: { ja: "中級 01｜F major｜Bbあり", fr: "Intermédiaire 01｜Fa majeur｜Avec Sib" },
    description: {
      ja: "Bbを含む中級課題です。弱拍の不協和処理に注意してください。",
      fr: "Exercice intermédiaire avec Sib. Attention au traitement des dissonances faibles."
    },
    cantus: ["F3", "G3", "A3", "Bb3", "C4", "D4", "C4", "Bb3", "A3", "G3", "F3"],
    counterpoint: []
  },
  {
    id: "module2-d-minor-01",
    level: "advanced",
    title: { ja: "上級 01｜D minor｜短調", fr: "Avancé 01｜Ré mineur｜Mineur" },
    description: {
      ja: "短調の上級課題です。拍頭の協和と弱拍の経過音処理を確認します。",
      fr: "Exercice avancé en mineur. Vérifiez les consonances sur les temps forts et les passages conjoints."
    },
    cantus: ["D4", "E4", "F4", "G4", "A4", "Bb4", "A4", "G4", "F4", "E4", "D4"],
    counterpoint: []
  },
  {
    id: "module2-example-filled",
    level: "beginner",
    title: { ja: "入力例つき", fr: "Exemple rempli" },
    description: {
      ja: "動作確認用。二分音符の対旋律が入っています。",
      fr: "Exemple de démonstration avec un contrepoint en blanches."
    },
    cantus: ["C4", "D4", "E4", "F4"],
    counterpoint: [
      "G4", "E4",
      "F4", "A4",
      "G4", "B4",
      "A4", "C5"
    ]
  }
];

let currentLanguage = "ja";
let selectedIndex = 0;
let playbackIndex = 0;
let isPlaying = false;
let playbackTimerId = null;
let audioContext = null;
let analysisIssues = [];

function t(key) {
  return I18N[currentLanguage][key];
}

function getLevelName(level) {
  const map = {
    beginner: t("levelBeginner"),
    intermediate: t("levelIntermediate"),
    advanced: t("levelAdvanced")
  };
  return map[level] || level;
}

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

  const summary = document.getElementById("summary");
  if (summary && summary.getAttribute("data-i18n") === "notAnalyzed") {
    summary.textContent = t("notAnalyzed");
  }
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
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
    square: { waveform: "square", gain: 0.10, attack: 0.01, release: 0.05, secondOscillator: false },
    sawtooth: { waveform: "sawtooth", gain: 0.09, attack: 0.01, release: 0.06, secondOscillator: false },
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

  const osc1 = ctx.createOscillator();
  osc1.type = "sawtooth";
  osc1.frequency.setValueAtTime(frequency, now);
  vibratoGain.connect(osc1.frequency);

  const osc2 = ctx.createOscillator();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(frequency * 0.997, now);
  vibratoGain.connect(osc2.frequency);

  const osc3 = ctx.createOscillator();
  osc3.type = "sine";
  osc3.frequency.setValueAtTime(frequency * 2.005, now);
  vibratoGain.connect(osc3.frequency);

  createVoiceFormant(ctx, osc1, output, now, duration, gainScale * 0.85);
  createVoiceFormant(ctx, osc2, output, now, duration, gainScale * 0.45);
  createVoiceFormant(ctx, osc3, output, now, duration, gainScale * 0.18);

  const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * (duration + 0.18)), ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.018;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(3200, now);
  noiseFilter.Q.setValueAtTime(0.9, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.018 * gainScale, now + 0.035);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.08);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(output);

  vibrato.start(now);
  osc1.start(now);
  osc2.start(now);
  osc3.start(now);
  noise.start(now);

  const stopAt = now + duration + 0.25;
  vibrato.stop(stopAt);
  osc1.stop(stopAt);
  osc2.stop(stopAt);
  osc3.stop(stopAt);
  noise.stop(stopAt);
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

function getNearestSampleNote(targetMidi, sampleNotes) {
  const exactName = midiToSampleNoteName(targetMidi);

  // If the exact sample exists, use it directly with playbackRate 1.0.
  // Example: written G4 -> female/G4.wav, not G5.wav or a shifted file.
  if (sampleNotes.includes(exactName)) {
    return exactName;
  }

  let nearest = sampleNotes[0];
  let nearestDistance = Infinity;

  sampleNotes.forEach((note) => {
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

async async function playSampleVoiceNote(setName, midi, duration = 0.45, gainScale = 1) {
  const set = SAMPLE_VOICE_SETS[setName];
  if (!set) return;

  const nearestNote = getNearestSampleNote(midi, set.notes);
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

  const exactName = midiToSampleNoteName(midi);
  const isExactSample = nearestNote === exactName;

  // Exact sample names are never transposed.
  // G4 must play female/G4.wav at playbackRate 1.0.
  const semitoneShift = isExactSample ? 0 : (midi - sourceMidi + set.transposeSemitones);
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

function playNoteName(note, duration = 0.38, gainScale = 1, voiceSet = "femaleSample") {
  const midi = noteToMidi(note);
  if (midi === null) return;
  playMidiNote(midi, duration, gainScale, voiceSet);
}

function getPlaybackMode() {
  const select = document.getElementById("playbackModeSelect");
  return select ? select.value : "both";
}

function playSelectedNote() {
  const counterpoint = getNotesFromTextarea("counterpoint");
  const note = counterpoint[selectedIndex];
  if (!note) return;
  playNoteName(note, 0.45, 1, "femaleSample");
}

function previewTimbre() {
  const counterpoint = getNotesFromTextarea("counterpoint");
  const cantus = getNotesFromTextarea("cantus");
  const note = counterpoint[selectedIndex] || cantus[Math.floor(selectedIndex / 4)] || "C4";
  playNoteName(note, 0.5, 1, "femaleSample");
}

function getTempo() {
  const input = document.getElementById("tempoInput");
  const raw = input ? parseInt(input.value, 10) : 72;
  if (Number.isNaN(raw)) return 72;
  return Math.min(160, Math.max(40, raw));
}

function getStepDurationSeconds() {
  return 60 / getTempo();
}

function getRequiredHalfCount() {
  return getNotesFromTextarea("cantus").length * SCORE.quartersPerCantus;
}

function getPlaybackLength() {
  return Math.max(getRequiredHalfCount(), getNotesFromTextarea("counterpoint").length, 0);
}

function playVerticalSonority(index) {
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const mode = getPlaybackMode();

  const qDuration = getStepDurationSeconds();
  const noteDuration = Math.max(0.35, qDuration * 0.9);
  const cantusIndex = Math.floor(index / SCORE.quartersPerCantus);

  const cantusNote = cantus[cantusIndex];
  const counterpointNote = counterpoint[index];

  if ((mode === "both" || mode === "cantus") && cantusNote) {
    const cantusDuration = index % SCORE.quartersPerCantus === 0 ? Math.max(0.5, qDuration * 3.85) : noteDuration;
    if (mode === "cantus" || index % SCORE.quartersPerCantus === 0) {
      playNoteName(cantusNote, cantusDuration, mode === "cantus" ? 1 : 0.62, "maleSample");
    }
  }

  if ((mode === "both" || mode === "counterpoint") && counterpointNote) {
    playNoteName(counterpointNote, noteDuration, 1);
  }
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
  const length = getPlaybackLength();
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

  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const halfCount = Math.max(cantus.length * SCORE.quartersPerCantus, counterpoint.length, 1);
  const mode = getPlaybackMode();
  const halfDuration = getStepDurationSeconds();

  if (playbackIndex >= halfCount) {
    isPlaying = false;
    playbackIndex = 0;
    updatePlayPauseButton();
    renderScore();
    return;
  }

  renderScore();

  if ((mode === "both" || mode === "cantus") && playbackIndex % SCORE.quartersPerCantus === 0) {
    const cantusIndex = Math.floor(playbackIndex / SCORE.quartersPerCantus);
    if (cantus[cantusIndex]) {
      playNoteName(cantus[cantusIndex], halfDuration * SCORE.quartersPerCantus * 0.92, mode === "both" ? 0.62 : 1, "maleSample");
    }
  }

  if ((mode === "both" || mode === "counterpoint") && counterpoint[playbackIndex]) {
    playNoteName(counterpoint[playbackIndex], halfDuration * 0.92, 1, "femaleSample");
  }

  playbackTimerId = window.setTimeout(() => {
    playbackIndex += 1;
    playCurrentStep();
  }, halfDuration * 1000);
}

function noteToMidi(note) {
  const match = note.trim().match(/^([A-Ga-g])(#|b)?(-?\d)$/);
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
  const match = note.trim().match(/^([A-Ga-g])(#|b)?(-?\d)$/);
  if (!match) return null;
  return { letter: match[1].toUpperCase(), accidental: match[2] || "", octave: parseInt(match[3], 10) };
}

function getDiatonicStep(note) {
  const parsed = parseNote(note);
  if (!parsed) return null;
  return parsed.octave * 7 + NOTE_LETTER_STEPS[parsed.letter];
}

function getSimpleInterval(semitones) {
  return Math.abs(semitones) % 12;
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

function isPassingDissonance(counterMidi, index) {
  const prev = counterMidi[index - 1];
  const cur = counterMidi[index];
  const next = counterMidi[index + 1];

  if ([prev, cur, next].some((v) => v === null || v === undefined)) return false;

  const d1 = direction(prev, cur);
  const d2 = direction(cur, next);

  return d1 !== 0 && d1 === d2 && isStep(prev, cur) && isStep(cur, next);
}

function isNeighborDissonance(counterMidi, index) {
  const prev = counterMidi[index - 1];
  const cur = counterMidi[index];
  const next = counterMidi[index + 1];

  if ([prev, cur, next].some((v) => v === null || v === undefined)) return false;

  return prev === next && isStep(prev, cur) && isStep(cur, next);
}

function getNotesFromTextarea(id) {
  const el = document.getElementById(id);
  if (!el) return [];
  const value = el.value.trim();
  if (!value) return [];
  return value.split(/\s+/).filter(Boolean);
}

function setNotesToTextarea(id, notes) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = notes.filter(Boolean).join(" ");
}

function updateDisplays() {
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const cantusDisplay = document.getElementById("cantusDisplay");
  const counterpointDisplay = document.getElementById("counterpointDisplay");
  const scoreStatus = document.getElementById("scoreStatus");

  if (cantusDisplay) cantusDisplay.textContent = cantus.join(" ");

  if (counterpointDisplay) {
    counterpointDisplay.textContent = counterpoint.length ? counterpoint.join(" ") : t("noInput");
  }

  if (scoreStatus) {
    const length = getPlaybackLength();
    const displayIndex = length ? Math.min(playbackIndex + 1, length) : 0;
    scoreStatus.textContent = t("status")(counterpoint.length, cantus.length, displayIndex, length);
  }
}

function addResult(results, type, message) {
  results.push({ type, message });
}

function renderResults(results) {
  const resultBox = document.getElementById("result");
  if (!resultBox) return;

  if (!results.length) {
    resultBox.innerHTML = "";
    return;
  }

  resultBox.innerHTML = results.map((item) => {
    let label = t("labelOk");
    if (item.type === "warn") label = t("labelWarn");
    if (item.type === "error") label = t("labelError");

    return `
      <div class="result-item ${item.type}">
        <span class="result-label">${label}</span>
        ${item.message}
      </div>
    `;
  }).join("");
}

function renderSummary(errorCount, warnCount, okCount) {
  const summary = document.getElementById("summary");
  if (!summary) return;

  summary.removeAttribute("data-i18n");

  if (errorCount === 0 && warnCount === 0) {
    summary.innerHTML = t("summaryOk")(okCount);
    return;
  }

  summary.innerHTML = t("summaryCounts")(errorCount, warnCount, okCount);
}

function analyzeCounterpoint() {
  analysisIssues = [];
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const results = [];
  let errorCount = 0;
  let warnCount = 0;
  let okCount = 0;

  if (!cantus.length || !counterpoint.length) {
    addResult(results, "error", t("needInput"));
    renderSummary(1, 0, 0);
    renderResults(results);
    renderScore();
    return;
  }

  const required = cantus.length * SCORE.quartersPerCantus;
  if (counterpoint.length !== required) {
    addResult(results, "error", t("lengthMismatch")(required, counterpoint.length));
    errorCount++;
  } else {
    addResult(results, "ok", t("lengthOk")(required));
    okCount++;
  }

  addResult(results, "ok", t("noTies"));
  okCount++;

  const length = Math.min(required, counterpoint.length);
  const cantusMidi = cantus.map(noteToMidi);
  const counterMidi = counterpoint.map(noteToMidi);

  for (let i = 0; i < length; i++) {
    const measure = Math.floor(i / SCORE.quartersPerCantus);
    const beatInMeasure = i % SCORE.quartersPerCantus;
    const cMidi = cantusMidi[measure];
    const cpMidi = counterMidi[i];

    if (cMidi === null || cpMidi === null) {
      addResult(results, "error", t("invalidNote")(i + 1));
      analysisIssues.push({ voice: "counterpoint", index: i, type: "error" });
      errorCount++;
      continue;
    }

    const interval = cpMidi - cMidi;
    const name = getIntervalName(interval);

    if (beatInMeasure === 0) {
      if (isConsonant(interval)) {
        addResult(results, "ok", t("downbeatOk")(measure + 1, name));
        okCount++;
      } else {
        addResult(results, "error", t("downbeatBad")(measure + 1, name));
        analysisIssues.push({ voice: "counterpoint", index: i, type: "error" });
        analysisIssues.push({ voice: "cantus", index: measure * SCORE.quartersPerCantus, type: "error" });
        errorCount++;
      }
    } else {
      if (isConsonant(interval)) {
        addResult(results, "ok", t("offbeatOk")(i + 1, name));
        okCount++;
      } else if (isPassingDissonance(counterMidi, i)) {
        addResult(results, "ok", t("passingOk")(i + 1, name));
        okCount++;
      } else if (isNeighborDissonance(counterMidi, i)) {
        addResult(results, "ok", t("neighborOk")(i + 1, name));
        okCount++;
      } else {
        addResult(results, "warn", t("offbeatBad")(i + 1, name));
        analysisIssues.push({ voice: "counterpoint", index: i, type: "warn" });
        warnCount++;
      }
    }
  }

  for (let i = 0; i < length - 1; i++) {
    const measure1 = Math.floor(i / SCORE.quartersPerCantus);
    const measure2 = Math.floor((i + 1) / SCORE.quartersPerCantus);

    if (measure1 === measure2) continue;

    const c1 = cantusMidi[measure1];
    const c2 = cantusMidi[measure2];
    const cp1 = counterMidi[i];
    const cp2 = counterMidi[i + 1];

    if ([c1, c2, cp1, cp2].some((v) => v === null || v === undefined)) continue;

    const interval1 = cp1 - c1;
    const interval2 = cp2 - c2;
    const cDir = direction(c1, c2);
    const cpDir = direction(cp1, cp2);

    if (cDir !== 0 && cDir === cpDir && isPerfectFifth(interval1) && isPerfectFifth(interval2)) {
      addResult(results, "error", t("parallelFifth")(i + 1, i + 2));
      analysisIssues.push({ voice: "counterpoint", index: i, type: "error" });
      analysisIssues.push({ voice: "counterpoint", index: i + 1, type: "error" });
      analysisIssues.push({ voice: "cantus", index: measure1 * SCORE.quartersPerCantus, type: "error" });
      analysisIssues.push({ voice: "cantus", index: measure2 * SCORE.quartersPerCantus, type: "error" });
      errorCount++;
    }

    if (cDir !== 0 && cDir === cpDir && isPerfectOctaveOrUnison(interval1) && isPerfectOctaveOrUnison(interval2)) {
      addResult(results, "error", t("parallelOctave")(i + 1, i + 2));
      analysisIssues.push({ voice: "counterpoint", index: i, type: "error" });
      analysisIssues.push({ voice: "counterpoint", index: i + 1, type: "error" });
      analysisIssues.push({ voice: "cantus", index: measure1 * SCORE.quartersPerCantus, type: "error" });
      analysisIssues.push({ voice: "cantus", index: measure2 * SCORE.quartersPerCantus, type: "error" });
      errorCount++;
    }
  }

  renderSummary(errorCount, warnCount, okCount);
  renderResults(results);
  renderScore();
}

function createSvgElement(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function clearSvg(svg) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function noteToY(note, bottomLineY = SCORE.bottomLineY) {
  const noteStep = getDiatonicStep(note);
  const referenceNote = bottomLineY === SCORE.cantusBottomLineY ? "G2" : "E4";
  const referenceStep = getDiatonicStep(referenceNote);

  if (noteStep === null || referenceStep === null) return null;

  return bottomLineY - (noteStep - referenceStep) * SCORE.noteStep;
}

function yToNaturalNote(y) {
  const e4Step = getDiatonicStep("E4");
  const rawStep = Math.round((SCORE.bottomLineY - y) / SCORE.noteStep);
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

function getScorePositions(noteCount) {
  const usableWidth = SCORE.width - SCORE.left - SCORE.right;
  const count = Math.max(noteCount, 1);
  const spacing = usableWidth / count;
  return Array.from({ length: count }, (_, i) => SCORE.left + spacing * i + spacing / 2);
}

function moveNoteChromatic(note, semitone) {
  const midi = noteToMidi(note);
  if (midi === null) return note;
  const preference = semitone > 0 ? "sharp" : "flat";
  return midiToNote(midi + semitone, preference);
}

function moveSelectedNote(semitone) {
  if (isPlaying) return;

  const required = getRequiredHalfCount();
  let counterpoint = getNotesFromTextarea("counterpoint");
  if (!required) return;

  while (counterpoint.length < required) counterpoint.push("");

  if (selectedIndex < 0) selectedIndex = 0;
  if (selectedIndex >= required) selectedIndex = required - 1;

  const currentNote = counterpoint[selectedIndex];
  if (!currentNote) {
    counterpoint[selectedIndex] = "G4";
  } else {
    counterpoint[selectedIndex] = moveNoteChromatic(currentNote, semitone);
  }

  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
  playNoteName(counterpoint[selectedIndex], 0.45, 1, "femaleSample");
}

function moveSelection(delta) {
  if (isPlaying) return;

  const length = getRequiredHalfCount();
  if (!length) return;

  selectedIndex += delta;
  if (selectedIndex < 0) selectedIndex = length - 1;
  if (selectedIndex >= length) selectedIndex = 0;

  renderScore();

  const note = getNotesFromTextarea("counterpoint")[selectedIndex];
  if (note) playNoteName(note, 0.35, 0.8, "femaleSample");
}

function deleteSelectedNote() {
  if (isPlaying) return;

  const required = getRequiredHalfCount();
  let counterpoint = getNotesFromTextarea("counterpoint");
  if (!required) return;

  while (counterpoint.length < required) counterpoint.push("");
  counterpoint[selectedIndex] = "";
  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
}

function drawClef(svg, bottomLineY, clefType = "treble") {
  const clef = clefType === "bass" ? "𝄢" : "𝄞";
  const className = clefType === "bass" ? "clef-symbol bass" : "clef-symbol treble";

  svg.appendChild(createSvgElement("text", {
    x: 52,
    y: bottomLineY - 20,
    class: className
  })).textContent = clef;
}

function drawStaff(svg, bottomLineY, label, halfCount, clefType = "treble") {
  const startX = SCORE.left - 30;
  const endX = SCORE.width - SCORE.right + 10;

  for (let i = 0; i < 5; i++) {
    const y = bottomLineY - i * SCORE.staffGap;
    svg.appendChild(createSvgElement("line", {
      x1: startX,
      y1: y,
      x2: endX,
      y2: y,
      class: "staff-line"
    }));
  }

  drawClef(svg, bottomLineY, clefType);

  svg.appendChild(createSvgElement("text", {
    x: 22,
    y: bottomLineY - 58,
    class: "voice-label"
  })).textContent = label;

  const positions = getScorePositions(halfCount);

  positions.forEach((x, i) => {
    const isMeasureStart = i % 2 === 0;

    svg.appendChild(createSvgElement("circle", {
      cx: x,
      cy: bottomLineY + 56,
      r: isMeasureStart ? 3.4 : 2.2,
      class: isMeasureStart ? "downbeat-marker" : "slot-marker"
    }));

    if (clefType === "bass" && isMeasureStart) {
      svg.appendChild(createSvgElement("text", {
        x: x - 4,
        y: bottomLineY + 82,
        class: "note-label"
      })).textContent = Math.floor(i / 2) + 1;
    }

    if (i > 0) {
      const midX = (positions[i - 1] + x) / 2;
      svg.appendChild(createSvgElement("line", {
        x1: midX,
        y1: bottomLineY - 50,
        x2: midX,
        y2: bottomLineY + 66,
        class: isMeasureStart ? "measure-line" : "subdivision-line"
      }));
    }
  });
}

function drawPlayhead(svg, positions, noteCount) {
  if (!noteCount) return;

  const safeIndex = Math.min(playbackIndex, noteCount - 1);
  const x = positions[safeIndex];

  svg.appendChild(createSvgElement("rect", {
    x: x - 12,
    y: SCORE.playheadTop,
    width: 24,
    height: SCORE.playheadBottom - SCORE.playheadTop,
    rx: 8,
    class: "playhead-halo"
  }));

  svg.appendChild(createSvgElement("line", {
    x1: x,
    y1: SCORE.playheadTop,
    x2: x,
    y2: SCORE.playheadBottom,
    class: "playhead-line"
  }));
}

function drawLedgerLines(svg, x, y, bottomLineY = SCORE.bottomLineY) {
  const topLineY = bottomLineY - 4 * SCORE.staffGap;

  if (y < topLineY - SCORE.noteStep) {
    for (let ly = topLineY - 2 * SCORE.noteStep; ly >= y - 1; ly -= 2 * SCORE.noteStep) {
      svg.appendChild(createSvgElement("line", {
        x1: x - 14,
        y1: ly,
        x2: x + 14,
        y2: ly,
        class: "ledger-line"
      }));
    }
  }

  if (y > bottomLineY + SCORE.noteStep) {
    for (let ly = bottomLineY + 2 * SCORE.noteStep; ly <= y + 1; ly += 2 * SCORE.noteStep) {
      svg.appendChild(createSvgElement("line", {
        x1: x - 14,
        y1: ly,
        x2: x + 14,
        y2: ly,
        class: "ledger-line"
      }));
    }
  }
}

function drawAccidental(svg, parsed, x, y, isCantus = false, isSelected = false, isCurrentPlayback = false, issueClass = "") {
  if (!parsed.accidental) return;

  const symbol = parsed.accidental === "#" ? "♯" : "♭";

  svg.appendChild(createSvgElement("text", {
    x: x - 30,
    y: y + 1,
    class: [
      "accidental",
      isCantus ? "cantus" : "",
      isSelected ? "selected" : "",
      isCurrentPlayback ? "playing" : "",
      issueClass
    ].filter(Boolean).join(" ")
  })).textContent = symbol;
}

function drawHalfFlag(svg, x, y, isSelected, isCurrentPlayback) {
  const d = `M ${x + 7} ${y - 34} C ${x + 24} ${y - 28}, ${x + 24} ${y - 12}, ${x + 8} ${y - 8}`;
  svg.appendChild(createSvgElement("path", {
    d,
    class: `flag${isSelected ? " selected" : ""}${isCurrentPlayback ? " playing" : ""}`
  }));
}

function getIssueFor(voice, index) {
  if (!Array.isArray(analysisIssues)) return null;
  const exactError = analysisIssues.find((issue) => issue.voice === voice && issue.index === index && issue.type === "error");
  if (exactError) return exactError;
  const exactWarn = analysisIssues.find((issue) => issue.voice === voice && issue.index === index && issue.type === "warn");
  if (exactWarn) return exactWarn;
  return null;
}

function getIssueClass(voice, index) {
  const issue = getIssueFor(voice, index);
  return issue ? issue.type : "";
}

function drawIssueRing(svg, x, y, issueClass) {
  if (!issueClass) return;
  svg.appendChild(createSvgElement("circle", {
    cx: x,
    cy: y,
    r: 15,
    class: issueClass === "warn" ? "issue-ring warn" : "issue-ring"
  }));
}

function drawNote(svg, note, x, voice, index, bottomLineY = SCORE.bottomLineY, duration = "half") {
  const y = noteToY(note, bottomLineY);
  const parsed = parseNote(note);

  if (y === null || !parsed) return;

  const isCantus = voice === "cantus";
  const isSelected = !isCantus && index === selectedIndex && !isPlaying;
  const isCurrentPlayback = index === playbackIndex && isPlaying;
  const issueClass = typeof getIssueClass === "function" ? getIssueClass(voice, index) : "";
  const noteX = x;
  const openHead = duration === "whole" || duration === "half" || isCantus;

  drawLedgerLines(svg, noteX, y, bottomLineY);

  if (typeof drawIssueRing === "function") {
    drawIssueRing(svg, noteX, y, issueClass);
  }

  drawAccidental(svg, parsed, noteX, y, isCantus, isSelected, isCurrentPlayback, issueClass);

  svg.appendChild(createSvgElement("ellipse", {
    cx: noteX,
    cy: y,
    rx: 8.5,
    ry: 5.8,
    transform: `rotate(-18 ${noteX} ${y})`,
    class: [
      "note-head",
      openHead ? "open" : "",
      isCantus ? "cantus" : "",
      isSelected ? "selected" : "",
      isCurrentPlayback ? "playing" : "",
      issueClass
    ].filter(Boolean).join(" ")
  }));

  const stemUp = !isCantus;
  svg.appendChild(createSvgElement("line", {
    x1: stemUp ? noteX + 7 : noteX - 7,
    y1: y,
    x2: stemUp ? noteX + 7 : noteX - 7,
    y2: stemUp ? y - 34 : y + 34,
    class: [
      "note-stem",
      isCantus ? "cantus" : "",
      isSelected ? "selected" : "",
      isCurrentPlayback ? "playing" : "",
      issueClass
    ].filter(Boolean).join(" ")
  }));

  svg.appendChild(createSvgElement("text", {
    x: noteX - 12,
    y: isCantus ? bottomLineY + 48 : bottomLineY - 62,
    class: [
      "note-label",
      isSelected ? "selected" : "",
      isCurrentPlayback ? "playing" : "",
      issueClass
    ].filter(Boolean).join(" ")
  })).textContent = note;
}

function renderScore() {
  const svg = document.getElementById("scoreEditor");
  if (!svg) return;

  clearSvg(svg);

  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const halfCount = Math.max(cantus.length * SCORE.quartersPerCantus, counterpoint.length, 1);
  const positions = getScorePositions(halfCount);

  if (selectedIndex >= halfCount) selectedIndex = halfCount - 1;
  if (selectedIndex < 0) selectedIndex = 0;
  if (playbackIndex >= halfCount) playbackIndex = 0;
  if (playbackIndex < 0) playbackIndex = 0;

  drawStaff(svg, SCORE.bottomLineY, "Counterpoint / treble clef", halfCount, "treble");
  drawStaff(svg, SCORE.cantusBottomLineY, "Cantus / bass clef", halfCount, "bass");
  drawPlayhead(svg, positions, halfCount);

  counterpoint.forEach((note, i) => {
    if (note) {
      drawNote(svg, note, positions[i], "counterpoint", i, SCORE.bottomLineY, "half");
    }
  });

  cantus.forEach((note, i) => {
    const x = positions[i * SCORE.quartersPerCantus];
    if (note && x !== undefined) {
      drawNote(svg, note, x, "cantus", i * SCORE.quartersPerCantus, SCORE.cantusBottomLineY, "whole");
    }
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

  // Only the upper treble staff is editable.
  if (viewY > (SCORE.bottomLineY + SCORE.cantusBottomLineY) / 2) return;

  const cantus = getNotesFromTextarea("cantus");
  let counterpoint = getNotesFromTextarea("counterpoint");
  const halfCount = Math.max(cantus.length * SCORE.quartersPerCantus, 1);
  const positions = getScorePositions(halfCount);

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

  while (counterpoint.length < halfCount) {
    counterpoint.push("");
  }

  selectedIndex = nearestIndex;
  counterpoint[nearestIndex] = clickedNote;

  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();

  playNoteName(clickedNote, 0.45, 1, "femaleSample");

  svg.focus();
}

function undoCounterpointNote() {
  if (isPlaying) return;
  const counterpoint = getNotesFromTextarea("counterpoint");
  counterpoint.pop();

  if (selectedIndex >= counterpoint.length) selectedIndex = Math.max(0, counterpoint.length - 1);

  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
}

function clearCounterpoint() {
  stopPlayback(true);
  selectedIndex = 0;
  playbackIndex = 0;
  setNotesToTextarea("counterpoint", []);
  renderScore();
}

function populateExerciseSelect(keepValue = false) {
  const select = document.getElementById("exerciseSelect");
  const levelFilter = document.getElementById("levelFilterSelect");
  if (!select) return;

  const previousValue = select.value;
  const selectedLevel = levelFilter ? levelFilter.value : "all";
  const filteredExercises = EXERCISES.filter((exercise) => selectedLevel === "all" || exercise.level === selectedLevel);

  select.innerHTML = "";

  filteredExercises.forEach((exercise, index) => {
    const option = document.createElement("option");
    option.value = exercise.id;
    option.textContent = `${getLevelName(exercise.level)}｜${exercise.title[currentLanguage] || exercise.title.ja}`;

    if ((keepValue && previousValue === exercise.id) || (!keepValue && index === 0)) {
      option.selected = true;
    }

    select.appendChild(option);
  });

  if (!filteredExercises.some((exercise) => exercise.id === select.value) && filteredExercises.length) {
    select.value = filteredExercises[0].id;
  }

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

  description.innerHTML = `
    <span class="level-badge ${exercise.level}">${getLevelName(exercise.level)}</span>
    ${exercise.description[currentLanguage] || exercise.description.ja}
  `;
}

function loadSelectedExercise() {
  const exercise = getSelectedExercise();
  if (!exercise) return;

  stopPlayback(true);
  setNotesToTextarea("cantus", exercise.cantus);
  setNotesToTextarea("counterpoint", exercise.counterpoint || []);

  selectedIndex = 0;
  playbackIndex = 0;
  renderScore();
}

function setExample() {
  const select = document.getElementById("exerciseSelect");
  if (select) {
    select.value = "module2-example-filled";
    updateExerciseDescription();
  }
  loadSelectedExercise();
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
      return;
    }
  });

  const exerciseSelect = document.getElementById("exerciseSelect");
  if (exerciseSelect) exerciseSelect.addEventListener("change", updateExerciseDescription);

  const levelFilterSelect = document.getElementById("levelFilterSelect");
  if (levelFilterSelect) levelFilterSelect.addEventListener("change", () => populateExerciseSelect(false));

  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) languageSelect.value = currentLanguage;

  populateExerciseSelect();
  setLanguage(currentLanguage);
  renderScore();
  updatePlayPauseButton();
});



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
  for (let i = length - 1; i >= 0; i--) {
    bytes.push((value >> (i * 8)) & 0xff);
  }
  return bytes;
}

function midiTrackChunk(events) {
  const data = [];
  events.forEach((event) => data.push(...event));

  const header = midiTextBytes("MTrk");
  const length = midiNumberToBytes(data.length, 4);
  return [...header, ...length, ...data];
}

function midiNoteEvent(delta, status, note, velocity) {
  return [...midiEncodeVariableLength(delta), status, note, velocity];
}

function midiMetaEvent(delta, type, data) {
  return [...midiEncodeVariableLength(delta), 0xff, type, data.length, ...data];
}

function midiCreateFile(tracks, ticksPerQuarter = 480) {
  const header = [
    ...midiTextBytes("MThd"),
    0x00, 0x00, 0x00, 0x06,
    0x00, 0x01,
    ...midiNumberToBytes(tracks.length, 2),
    ...midiNumberToBytes(ticksPerQuarter, 2)
  ];

  return new Uint8Array([...header, ...tracks.flat()]);
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

function midiBuildNoteTrack(trackName, notes, channel, ticksPerNote, velocity = 84) {
  const events = [];
  events.push(midiMetaEvent(0, 0x03, midiTextBytes(trackName)));

  let pendingDelta = 0;

  notes.forEach((note) => {
    const midi = noteToMidi(note);

    if (midi === null) {
      pendingDelta += ticksPerNote;
      return;
    }

    events.push(midiNoteEvent(pendingDelta, 0x90 + channel, midi, velocity));
    events.push(midiNoteEvent(ticksPerNote, 0x80 + channel, midi, 0));
    pendingDelta = 0;
  });

  events.push(midiMetaEvent(pendingDelta, 0x2f, []));
  return midiTrackChunk(events);
}

function exportMidi() {
  const ticksPerQuarter = 480;
  const tempoMicroseconds = 1000000; // 60 BPM
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");

  if (!cantus.length && !counterpoint.length) {
    alert(currentLanguage === "fr" ? "Aucune note à exporter." : "書き出す音がありません。");
    return;
  }

  const cantusTicks = ticksPerQuarter * 4;
  const counterpointTicks = Math.max(1, Math.round(cantusTicks / SCORE.quartersPerCantus));

  const conductorEvents = [
    midiMetaEvent(0, 0x03, midiTextBytes("Tempo / Meter")),
    midiMetaEvent(0, 0x51, [0x0f, 0x42, 0x40]),
    midiMetaEvent(0, 0x58, [0x04, 0x02, 0x18, 0x08]),
    midiMetaEvent(0, 0x2f, [])
  ];

  const tracks = [
    midiTrackChunk(conductorEvents),
    midiBuildNoteTrack("Cantus / whole notes", cantus, 0, cantusTicks, 72),
    midiBuildNoteTrack("Counterpoint", counterpoint, 1, counterpointTicks, 86)
  ];

  const bytes = midiCreateFile(tracks, ticksPerQuarter);
  midiDownload(bytes, "counterpoint_tempo60_4-4.mid");
}

