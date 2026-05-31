const NATURAL_NOTES = [
  "C3", "D3", "E3", "F3", "G3", "A3", "B3",
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  "C6", "D6", "E6", "F6", "G6", "A6", "B6"
];

const NOTE_LETTER_STEPS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const SVG_NS = "http://www.w3.org/2000/svg";

const SCORE = {
  width: 960,
  height: 170,
  left: 105,
  right: 45,
  staffGap: 10,
  noteStep: 5,
  playheadTop: 28,
  playheadBottom: 138,
  staves: {
    counterpoint1: {
      label: "CP1",
      bottomLineY: 100,
      labelY: 80,
      noteLabelY: 34,
      xOffset: 0,
      stemUp: true
    },
    counterpoint2: {
      label: "CP2",
      bottomLineY: 100,
      labelY: 80,
      noteLabelY: 34,
      xOffset: 0,
      stemUp: true
    },
    cantus: {
      label: "Cantus",
      bottomLineY: 100,
      labelY: 80,
      noteLabelY: 152,
      xOffset: 0,
      stemUp: false
    }
  }
};

const VOICES = ["cantus", "counterpoint1", "counterpoint2"];

const I18N = {
  ja: {
    backLink: "← トップへ戻る",
    languageLabel: "言語",
    title: "第一種3声対位法チェッカー",
    lead: "定旋律に対して、第1対旋律・第2対旋律を入力します。声部を選んで五線譜をクリックしてください。↑↓で半音移動、←→で前後の音へ移動、Spaceで再生・停止できます。",
    levelFilterLabel: "レベル",
    levelAll: "すべて",
    levelBeginner: "初級",
    levelIntermediate: "中級",
    levelAdvanced: "上級",
    exerciseLabel: "課題",
    loadExercise: "課題を読み込む",
    editVoiceLabel: "入力声部",
    voiceUpper: "第1対旋律・上声",
    voiceMiddle: "第2対旋律・中声",
    editVoiceHint: "青色の音が現在選択中の声部です。",
    loadExample: "例題を読み込む",
    deleteLast: "選択声部の最後の音を削除",
    clearVoice: "選択声部をクリア",
    refreshScore: "楽譜を更新",
    playSelected: "選択音を鳴らす",
    exportMidi: "MIDIを書き出す",
    resetStart: "最初に戻す",
    playbackModeLabel: "再生対象",
    playAll: "3声すべて",
    playCantus: "定旋律のみ",
    playUpper: "第1対旋律のみ",
    playMiddle: "第2対旋律のみ",
    timbreLabel: "音色",
    timbreSine: "Sine / 柔らかい",
    timbreTriangle: "Triangle / 素直",
    timbreSquare: "Square / 電子的",
    timbreSaw: "Sawtooth / 明るい",
    timbreOrgan: "Organ / オルガン風",
    timbreBell: "Bell / ベル風",
    timbreHumanVoice: "人の声",
    playbackHint: "Space：再生 / 停止　｜　← / →：前後の音へ移動",
    scoreInputTitle: "五線入力",
    scoreInputHelp: "第1対旋律・第2対旋律・定旋律を、それぞれ別の楽譜に表示します。第1対旋律と第2対旋律の楽譜をクリックして入力できます。",
    currentInput: "現在の入力",
    cantusLabel: "定旋律：",
    counterpoint1Label: "第1対旋律：",
    counterpoint2Label: "第2対旋律：",
    analyze: "解析する",
    analysisResult: "解析結果",
    notAnalyzed: "まだ解析していません。",
    play: "再生",
    stop: "停止",
    noInput: "未入力",
    status: (cf, cp1, cp2, pos, len) => `定旋律：${cf}音 / 第1：${cp1}音 / 第2：${cp2}音 / 再生位置：${pos}/${len}`,
    summaryOk: (ok) => `大きな問題は見つかりませんでした。OK項目：${ok}件`,
    summaryCounts: (e, w, ok) => `禁止：${e}件 / 注意：${w}件 / OK：${ok}件`,
    labelOk: "OK",
    labelWarn: "注意",
    labelError: "禁止",
    needInput: "定旋律・第1対旋律・第2対旋律を入力してください。",
    lengthMismatch: (cf, a, b) => `音数が一致していません。定旋律${cf}音、第1対旋律${a}音、第2対旋律${b}音です。`,
    lengthOk: (n) => `3声すべての音数は一致しています。全${n}音です。`,
    invalidNote: (i) => `${i}音目：音名の形式が正しくありません。例：C4, F#4, Bb3`,
    intervalOk: (i, v1, n1, v2, n2, name) => `${i}音目：${v1} ${n1} - ${v2} ${n2} は ${name} です。`,
    intervalBad: (i, v1, n1, v2, n2, name) => `${i}音目：${v1} ${n1} - ${v2} ${n2} は ${name} です。3声第一種では、声部間に不協和音程を避けます。`,
    startWarn: "開始和音は、主音を含む完全協和を中心に構成してください。",
    endWarn: "終止和音は、主音を中心に完全協和を含む安定した終止にしてください。",
    parallelFifth: (i, a, b) => `${i}音目 → ${i + 1}音目：${a} と ${b} に連続5度があります。`,
    parallelOctave: (i, a, b) => `${i}音目 → ${i + 1}音目：${a} と ${b} に連続8度または連続1度があります。`,
    voiceNames: { cantus: "定旋律", counterpoint1: "第1対旋律", counterpoint2: "第2対旋律" },
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
    title: "Correcteur de contrepoint à trois voix — première espèce",
    lead: "Saisissez deux voix de contrepoint au-dessus d’un cantus. Choisissez la voix à éditer, puis cliquez sur la portée. ↑↓ déplacent par demi-ton, ←→ changent de note, Espace lance ou arrête la lecture.",
    levelFilterLabel: "Niveau",
    levelAll: "Tous",
    levelBeginner: "Débutant",
    levelIntermediate: "Intermédiaire",
    levelAdvanced: "Avancé",
    exerciseLabel: "Exercice",
    loadExercise: "Charger l’exercice",
    editVoiceLabel: "Voix à éditer",
    voiceUpper: "1er contrepoint / voix supérieure",
    voiceMiddle: "2e contrepoint / voix médiane",
    editVoiceHint: "La note bleue appartient à la voix actuellement sélectionnée.",
    loadExample: "Charger l’exemple",
    deleteLast: "Supprimer la dernière note de la voix",
    clearVoice: "Effacer la voix sélectionnée",
    refreshScore: "Actualiser la partition",
    playSelected: "Jouer la note sélectionnée",
    exportMidi: "Exporter MIDI",
    resetStart: "Revenir au début",
    playbackModeLabel: "Lecture",
    playAll: "Les trois voix",
    playCantus: "Cantus seul",
    playUpper: "1er contrepoint seul",
    playMiddle: "2e contrepoint seul",
    timbreLabel: "Timbre",
    timbreSine: "Sine / doux",
    timbreTriangle: "Triangle / simple",
    timbreSquare: "Square / électronique",
    timbreSaw: "Sawtooth / brillant",
    timbreOrgan: "Organ / orgue",
    timbreBell: "Bell / cloche",
    timbreHumanVoice: "Voix humaine",
    playbackHint: "Espace : lecture / arrêt　｜　← / → : note précédente / suivante",
    scoreInputTitle: "Saisie sur portée",
    scoreInputHelp: "Chaque voix est affichée sur une portée séparée. Cliquez sur la portée du 1er ou du 2e contrepoint pour saisir les notes.",
    currentInput: "Saisie actuelle",
    cantusLabel: "Cantus :",
    counterpoint1Label: "1er contrepoint :",
    counterpoint2Label: "2e contrepoint :",
    analyze: "Analyser",
    analysisResult: "Résultat de l’analyse",
    notAnalyzed: "Pas encore analysé.",
    play: "Lecture",
    stop: "Arrêter",
    noInput: "Non saisi",
    status: (cf, cp1, cp2, pos, len) => `Cantus : ${cf} / CP1 : ${cp1} / CP2 : ${cp2} / Position : ${pos}/${len}`,
    summaryOk: (ok) => `Aucun problème majeur détecté. Éléments OK : ${ok}`,
    summaryCounts: (e, w, ok) => `Interdits : ${e} / Attention : ${w} / OK : ${ok}`,
    labelOk: "OK",
    labelWarn: "Attention",
    labelError: "Interdit",
    needInput: "Veuillez saisir le cantus et les deux voix de contrepoint.",
    lengthMismatch: (cf, a, b) => `Le nombre de notes ne correspond pas. Cantus : ${cf}, CP1 : ${a}, CP2 : ${b}.`,
    lengthOk: (n) => `Les trois voix ont le même nombre de notes. Total : ${n}.`,
    invalidNote: (i) => `Note ${i} : format de note invalide. Exemple : C4, F#4, Bb3`,
    intervalOk: (i, v1, n1, v2, n2, name) => `Note ${i} : ${v1} ${n1} - ${v2} ${n2} forme ${name}.`,
    intervalBad: (i, v1, n1, v2, n2, name) => `Note ${i} : ${v1} ${n1} - ${v2} ${n2} forme ${name}. En première espèce à trois voix, évitez les dissonances entre les voix.`,
    startWarn: "L’accord initial doit être stable et centré sur la tonique.",
    endWarn: "La cadence finale doit être stable, centrée sur la tonique et les consonances parfaites.",
    parallelFifth: (i, a, b) => `Note ${i} → ${i + 1} : quintes parallèles entre ${a} et ${b}.`,
    parallelOctave: (i, a, b) => `Note ${i} → ${i + 1} : octaves ou unissons parallèles entre ${a} et ${b}.`,
    voiceNames: { cantus: "Cantus", counterpoint1: "CP1", counterpoint2: "CP2" },
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
    id: "three-c-major-01",
    level: "beginner",
    title: { ja: "初級 01｜C major｜順次進行", fr: "Débutant 01｜Do majeur｜Mouvement conjoint" },
    description: {
      ja: "2つの対旋律を加える基本課題です。まずは上声と中声の間隔を広めに取ってください。",
      fr: "Exercice de base. Gardez d’abord un espace clair entre les voix supérieures."
    },
    cantus: ["C4", "D4", "E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4", "C4"],
    counterpoint1: [],
    counterpoint2: []
  },
  {
    id: "three-g-major-01",
    level: "beginner",
    title: { ja: "初級 02｜G major｜F#あり", fr: "Débutant 02｜Sol majeur｜Avec Fa#" },
    description: {
      ja: "G majorの基本課題。F#を含みます。",
      fr: "Exercice de base en Sol majeur, avec Fa#."
    },
    cantus: ["G3", "A3", "B3", "C4", "D4", "E4", "D4", "C4", "B3", "A3", "G3"],
    counterpoint1: [],
    counterpoint2: []
  },
  {
    id: "three-f-major-01",
    level: "intermediate",
    title: { ja: "中級 01｜F major｜Bbあり", fr: "Intermédiaire 01｜Fa majeur｜Avec Sib" },
    description: {
      ja: "F majorの課題。Bbを含みます。3声間の協和音程を確認します。",
      fr: "Exercice en Fa majeur avec Sib. Vérifiez les consonances entre les trois voix."
    },
    cantus: ["F3", "G3", "A3", "Bb3", "C4", "D4", "C4", "Bb3", "A3", "G3", "F3"],
    counterpoint1: [],
    counterpoint2: []
  },
  {
    id: "three-d-minor-01",
    level: "advanced",
    title: { ja: "上級 01｜D minor｜短調", fr: "Avancé 01｜Ré mineur｜Mineur" },
    description: {
      ja: "短調の3声課題。終止と声部間の連続完全音程に注意してください。",
      fr: "Exercice à trois voix en mineur. Attention à la cadence et aux parallélismes parfaits."
    },
    cantus: ["D4", "E4", "F4", "G4", "A4", "Bb4", "A4", "G4", "F4", "E4", "D4"],
    counterpoint1: [],
    counterpoint2: []
  },
  {
    id: "three-example-filled",
    level: "beginner",
    title: { ja: "入力例つき", fr: "Exemple rempli" },
    description: {
      ja: "動作確認用。第1対旋律と第2対旋律があらかじめ入っています。",
      fr: "Exemple de démonstration avec deux voix déjà saisies."
    },
    cantus: ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4"],
    counterpoint1: ["E5", "F5", "G5", "A5", "G5", "A5", "G5", "F5", "E5"],
    counterpoint2: ["G4", "A4", "C5", "C5", "B4", "C5", "C5", "A4", "G4"]
  }
];

let currentLanguage = "ja";
let selectedIndex = 0;
let playbackIndex = 0;
let editVoice = "counterpoint1";
let isPlaying = false;
let playbackTimerId = null;
let audioContext = null;

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
    if (typeof value === "string") {
      element.textContent = value;
    }
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
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
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
    transposeSemitones: -12
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

async function playSampleVoiceNote(setName, midi, duration = 0.45, gainScale = 1) {
  const set = SAMPLE_VOICE_SETS[setName];
  if (!set) return;

  const nearestNote = getNearestSampleNote(midi, set.notes);
  const sourceMidi = noteToMidi(nearestNote);
  if (sourceMidi === null) return;

  const buffer = await loadSampleVoiceBuffer(setName, nearestNote);
  if (!buffer) {
    const fallbackMidi = midi + (set.transposeSemitones || 0);
    if (typeof playFallbackVoice === "function") {
      playFallbackVoice(fallbackMidi, duration, gainScale);
    } else if (typeof playVoiceLikeNote === "function") {
      playVoiceLikeNote(fallbackMidi, duration, gainScale);
    }
    return;
  }

  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // Exact sample file is used, then set-level transposition is applied.
  // Soprano/female: G4 on screen -> female/G4.wav at playbackRate 0.5.
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

function playNoteName(note, duration = 0.38, gainScale = 1, voiceSet = "femaleSample") {
  const midi = noteToMidi(note);
  if (midi === null) return;
  playMidiNote(midi, duration, gainScale, voiceSet);
}

function getPlaybackMode() {
  const select = document.getElementById("playbackModeSelect");
  return select ? select.value : "all";
}

function getTempo() {
  const input = document.getElementById("tempoInput");
  const raw = input ? parseInt(input.value, 10) : 66;
  if (Number.isNaN(raw)) return 66;
  return Math.min(180, Math.max(40, raw));
}

function getStepDurationSeconds() {
  return 60 / getTempo();
}

function getPlaybackLength() {
  return Math.max(
    getNotesFromTextarea("cantus").length,
    getNotesFromTextarea("counterpoint1").length,
    getNotesFromTextarea("counterpoint2").length,
    0
  );
}

function playVerticalSonority(index) {
  const mode = getPlaybackMode();
  const notes = {
    cantus: getNotesFromTextarea("cantus")[index],
    counterpoint1: getNotesFromTextarea("counterpoint1")[index],
    counterpoint2: getNotesFromTextarea("counterpoint2")[index]
  };

  const stepDuration = getStepDurationSeconds();
  const noteDuration = Math.max(0.28, stepDuration * 0.95);

  if ((mode === "all" || mode === "cantus") && notes.cantus) {
    playNoteName(notes.cantus, noteDuration, mode === "cantus" ? 1 : 0.58, "maleSample");
  }

  if ((mode === "all" || mode === "counterpoint2") && notes.counterpoint2) {
    playNoteName(notes.counterpoint2, noteDuration, mode === "counterpoint2" ? 1 : 0.72, "femaleSample");
  }

  if ((mode === "all" || mode === "counterpoint1") && notes.counterpoint1) {
    playNoteName(notes.counterpoint1, noteDuration, 1, "femaleSample");
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
  const length = getPlaybackLength();

  if (!length) {
    stopPlayback(true);
    return;
  }

  if (playbackIndex >= length) {
    isPlaying = false;
    playbackIndex = 0;
    selectedIndex = 0;
    updatePlayPauseButton();
    renderScore();
    return;
  }

  renderScore();
  playVerticalSonority(playbackIndex);

  playbackTimerId = window.setTimeout(() => {
    playbackIndex += 1;

    if (playbackIndex >= length) {
      isPlaying = false;
      playbackIndex = 0;
      playbackTimerId = null;
      updatePlayPauseButton();
      renderScore();
      return;
    }

    playCurrentStep();
  }, getStepDurationSeconds() * 1000);
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
  return {
    letter: match[1].toUpperCase(),
    accidental: match[2] || "",
    octave: parseInt(match[3], 10)
  };
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
  const simple = getSimpleInterval(semitones);
  return [0, 3, 4, 7, 8, 9].includes(simple);
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
  const cp1 = getNotesFromTextarea("counterpoint1");
  const cp2 = getNotesFromTextarea("counterpoint2");

  const cantusDisplay = document.getElementById("cantusDisplay");
  const cp1Display = document.getElementById("counterpoint1Display");
  const cp2Display = document.getElementById("counterpoint2Display");
  const scoreStatus = document.getElementById("scoreStatus");

  if (cantusDisplay) cantusDisplay.textContent = cantus.join(" ");
  if (cp1Display) cp1Display.textContent = cp1.length ? cp1.join(" ") : t("noInput");
  if (cp2Display) cp2Display.textContent = cp2.length ? cp2.join(" ") : t("noInput");

  if (scoreStatus) {
    const length = getPlaybackLength();
    const displayIndex = length ? Math.min(playbackIndex + 1, length) : 0;
    scoreStatus.textContent = t("status")(cantus.length, cp1.length, cp2.length, displayIndex, length);
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
  const data = {
    cantus: getNotesFromTextarea("cantus"),
    counterpoint1: getNotesFromTextarea("counterpoint1"),
    counterpoint2: getNotesFromTextarea("counterpoint2")
  };

  const results = [];
  let errorCount = 0;
  let warnCount = 0;
  let okCount = 0;

  if (!data.cantus.length || !data.counterpoint1.length || !data.counterpoint2.length) {
    addResult(results, "error", t("needInput"));
    renderSummary(1, 0, 0);
    renderResults(results);
    return;
  }

  if (data.cantus.length !== data.counterpoint1.length || data.cantus.length !== data.counterpoint2.length) {
    addResult(results, "error", t("lengthMismatch")(data.cantus.length, data.counterpoint1.length, data.counterpoint2.length));
    errorCount++;
  } else {
    addResult(results, "ok", t("lengthOk")(data.cantus.length));
    okCount++;
  }

  const length = Math.min(data.cantus.length, data.counterpoint1.length, data.counterpoint2.length);
  const midi = { cantus: [], counterpoint1: [], counterpoint2: [] };

  for (let i = 0; i < length; i++) {
    for (const voice of VOICES) {
      midi[voice][i] = noteToMidi(data[voice][i]);
    }

    if (VOICES.some((voice) => midi[voice][i] === null)) {
      addResult(results, "error", t("invalidNote")(i + 1));
      errorCount++;
      continue;
    }

    const pairs = [
      ["cantus", "counterpoint2"],
      ["cantus", "counterpoint1"],
      ["counterpoint2", "counterpoint1"]
    ];

    for (const [a, b] of pairs) {
      const interval = midi[b][i] - midi[a][i];
      const intervalName = getIntervalName(interval);
      const voiceA = t("voiceNames")[a];
      const voiceB = t("voiceNames")[b];

      if (isConsonant(interval)) {
        addResult(results, "ok", t("intervalOk")(i + 1, voiceA, data[a][i], voiceB, data[b][i], intervalName));
        okCount++;
      } else {
        addResult(results, "error", t("intervalBad")(i + 1, voiceA, data[a][i], voiceB, data[b][i], intervalName));
        errorCount++;
      }
    }
  }

  addResult(results, "warn", t("startWarn"));
  addResult(results, "warn", t("endWarn"));
  warnCount += 2;

  for (let i = 0; i < length - 1; i++) {
    const pairs = [
      ["cantus", "counterpoint2"],
      ["cantus", "counterpoint1"],
      ["counterpoint2", "counterpoint1"]
    ];

    for (const [a, b] of pairs) {
      const a1 = midi[a][i];
      const a2 = midi[a][i + 1];
      const b1 = midi[b][i];
      const b2 = midi[b][i + 1];

      if ([a1, a2, b1, b2].some((value) => value === null)) continue;

      const interval1 = b1 - a1;
      const interval2 = b2 - a2;

      const aDir = direction(a1, a2);
      const bDir = direction(b1, b2);
      const bothMove = aDir !== 0 && bDir !== 0;
      const sameDirection = aDir === bDir;

      const voiceA = t("voiceNames")[a];
      const voiceB = t("voiceNames")[b];

      if (bothMove && sameDirection && isPerfectFifth(interval1) && isPerfectFifth(interval2)) {
        addResult(results, "error", t("parallelFifth")(i + 1, voiceA, voiceB));
        errorCount++;
      }

      if (bothMove && sameDirection && isPerfectOctaveOrUnison(interval1) && isPerfectOctaveOrUnison(interval2)) {
        addResult(results, "error", t("parallelOctave")(i + 1, voiceA, voiceB));
        errorCount++;
      }
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

function noteToY(note, voice = editVoice) {
  const staff = SCORE.staves[voice] || SCORE.staves.counterpoint1;
  const noteStep = getDiatonicStep(note);
  const referenceNote = voice === "cantus" ? "G2" : "E4";
  const referenceStep = getDiatonicStep(referenceNote);

  if (noteStep === null || referenceStep === null) return null;
  return staff.bottomLineY - (noteStep - referenceStep) * SCORE.noteStep;
}

function yToNaturalNote(y, voice = editVoice) {
  const staff = SCORE.staves[voice] || SCORE.staves.counterpoint1;
  const referenceNote = voice === "cantus" ? "G2" : "E4";
  const referenceStep = getDiatonicStep(referenceNote);
  const rawStep = Math.round((staff.bottomLineY - y) / SCORE.noteStep);
  const targetStep = referenceStep + rawStep;

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

function getCurrentVoiceNotes() {
  return getNotesFromTextarea(editVoice);
}

function setCurrentVoiceNotes(notes) {
  setNotesToTextarea(editVoice, notes);
}

function setEditVoice(voice) {
  if (!["counterpoint1", "counterpoint2"].includes(voice)) return;
  editVoice = voice;
  renderScore();
}

function moveSelectedNote(semitone) {
  if (isPlaying) return;

  const cantus = getNotesFromTextarea("cantus");
  let notes = getCurrentVoiceNotes();

  if (!cantus.length) return;

  const noteCount = cantus.length;

  while (notes.length < noteCount) notes.push("");

  if (selectedIndex < 0) selectedIndex = 0;
  if (selectedIndex >= noteCount) selectedIndex = noteCount - 1;

  const currentNote = notes[selectedIndex];

  if (!currentNote) {
    notes[selectedIndex] = editVoice === "counterpoint1" ? "E5" : "G4";
  } else {
    notes[selectedIndex] = moveNoteChromatic(currentNote, semitone);
  }

  setCurrentVoiceNotes(notes);
  renderScore();
  playNoteName(notes[selectedIndex], 0.45, 1);
}

function moveSelection(delta) {
  if (isPlaying) return;

  const length = getPlaybackLength();
  if (!length) return;

  selectedIndex += delta;
  if (selectedIndex < 0) selectedIndex = length - 1;
  if (selectedIndex >= length) selectedIndex = 0;

  renderScore();

  const note = getCurrentVoiceNotes()[selectedIndex];
  if (note) playNoteName(note, 0.35, 0.8, "femaleSample");
}

function deleteSelectedNote() {
  if (isPlaying) return;

  const cantus = getNotesFromTextarea("cantus");
  let notes = getCurrentVoiceNotes();

  if (!cantus.length) return;

  while (notes.length < cantus.length) notes.push("");

  notes[selectedIndex] = "";
  setCurrentVoiceNotes(notes);
  renderScore();
}

function playSelectedNote() {
  const note = getCurrentVoiceNotes()[selectedIndex];
  if (!note) return;
  playNoteName(note, 0.55, 1, "femaleSample");
}

function previewTimbre() {
  const note = getCurrentVoiceNotes()[selectedIndex] || getNotesFromTextarea("cantus")[selectedIndex] || "C4";
  playNoteName(note, 0.5, 1, "femaleSample");
}

function drawClef(svg, bottomLineY, clefType) {
  const clef = clefType === "bass" ? "𝄢" : "𝄞";
  const className = clefType === "bass" ? "clef-symbol bass" : "clef-symbol treble";
  svg.appendChild(createSvgElement("text", { x: 52, y: bottomLineY - 20, class: className })).textContent = clef;
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
    svg.appendChild(createSvgElement("circle", {
      cx: x,
      cy: bottomLineY + 56,
      r: 2.6,
      class: "slot-marker"
    }));

    svg.appendChild(createSvgElement("text", { x: x - 4, y: bottomLineY + 82, class: "note-label" })).textContent = i + 1;

    if (i > 0) {
      const midX = (positions[i - 1] + x) / 2;
      svg.appendChild(createSvgElement("line", {
        x1: midX,
        y1: bottomLineY - 50,
        x2: midX,
        y2: bottomLineY + 66,
        class: "measure-line"
      }));
    }
  });
}

function drawPlayhead(svg, positions, noteCount) {
  if (!noteCount) return;

  const safeIndex = Math.min(playbackIndex, noteCount - 1);
  const x = positions[safeIndex];

  svg.appendChild(createSvgElement("rect", {
    x: x - 20,
    y: SCORE.playheadTop,
    width: 40,
    height: SCORE.playheadBottom - SCORE.playheadTop,
    rx: 10,
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

function drawLedgerLines(svg, x, y, voice = "counterpoint1") {
  const staff = SCORE.staves[voice] || SCORE.staves.counterpoint1;
  const topLineY = staff.bottomLineY - 4 * SCORE.staffGap;
  const bottomLineY = staff.bottomLineY;

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

function drawAccidental(svg, parsed, x, y, voice, isSelected, isCurrentPlayback) {
  if (!parsed.accidental) return;
  const symbol = parsed.accidental === "#" ? "♯" : "♭";
  svg.appendChild(createSvgElement("text", {
    x: x - 30,
    y: y + 1,
    class: `accidental ${voice}${isSelected ? " selected" : ""}${isCurrentPlayback ? " playing" : ""}`
  })).textContent = symbol;
}

function drawNote(svg, note, x, voice, index) {
  const staff = SCORE.staves[voice] || SCORE.staves.counterpoint1;
  const y = noteToY(note, voice);
  const parsed = parseNote(note);
  if (y === null || !parsed) return;

  const isSelected = voice === editVoice && index === selectedIndex && !isPlaying;
  const isCurrentPlayback = index === playbackIndex && isPlaying;
  const noteX = x + staff.xOffset;

  drawLedgerLines(svg, noteX, y, voice);
  drawAccidental(svg, parsed, noteX, y, voice, isSelected, isCurrentPlayback);

  svg.appendChild(createSvgElement("ellipse", {
    cx: noteX,
    cy: y,
    rx: 8.5,
    ry: 5.8,
    transform: `rotate(-18 ${noteX} ${y})`,
    class: `note-head ${voice}${isSelected ? " selected" : ""}${isCurrentPlayback ? " playing" : ""}`
  }));

  const stemUp = staff.stemUp;
  svg.appendChild(createSvgElement("line", {
    x1: stemUp ? noteX + 7 : noteX - 7,
    y1: y,
    x2: stemUp ? noteX + 7 : noteX - 7,
    y2: stemUp ? y - 34 : y + 34,
    class: `note-stem ${voice}${isSelected ? " selected" : ""}${isCurrentPlayback ? " playing" : ""}`
  }));

  svg.appendChild(createSvgElement("text", {
    x: noteX - 12,
    y: staff.noteLabelY,
    class: isCurrentPlayback ? "note-label playing" : isSelected ? "note-label selected" : "note-label"
  })).textContent = note;
}

function renderScore() {
  const svg = document.getElementById("scoreEditor");
  if (!svg) return;

  clearSvg(svg);

  const cantus = getNotesFromTextarea("cantus");
  const cp1 = getNotesFromTextarea("counterpoint1");
  const cp2 = getNotesFromTextarea("counterpoint2");
  const noteCount = Math.max(cantus.length, cp1.length, cp2.length, 1);
  const positions = getScorePositions(noteCount);

  if (selectedIndex >= noteCount) selectedIndex = noteCount - 1;
  if (selectedIndex < 0) selectedIndex = 0;
  if (playbackIndex >= noteCount) playbackIndex = 0;
  if (playbackIndex < 0) playbackIndex = 0;

  drawStaff(svg, noteCount);
  drawPlayhead(svg, positions, noteCount);

  cantus.forEach((note, i) => drawNote(svg, note, positions[i], "cantus", i));
  cp2.forEach((note, i) => { if (note) drawNote(svg, note, positions[i], "counterpoint2", i); });
  cp1.forEach((note, i) => { if (note) drawNote(svg, note, positions[i], "counterpoint1", i); });

  updateDisplays();
}

function handleScoreClick(event) {
  if (isPlaying) return;

  const svg = document.getElementById("scoreEditor");
  if (!svg) return;

  const rect = svg.getBoundingClientRect();
  const viewX = ((event.clientX - rect.left) / rect.width) * SCORE.width;
  const viewY = ((event.clientY - rect.top) / rect.height) * SCORE.height;

  const cantus = getNotesFromTextarea("cantus");
  let notes = getCurrentVoiceNotes();
  const noteCount = Math.max(cantus.length, 1);
  const positions = getScorePositions(noteCount);

  let nearestIndex = 0;
  let nearestDistance = Infinity;

  positions.forEach((x, i) => {
    const distance = Math.abs(x - viewX);
    if (distance < nearestDistance) {
      nearestIndex = i;
      nearestDistance = distance;
    }
  });

  const clickedNote = yToNaturalNote(viewY, editVoice);

  while (notes.length < noteCount) notes.push("");

  selectedIndex = nearestIndex;
  notes[nearestIndex] = clickedNote;

  setCurrentVoiceNotes(notes);
  renderScore();
  playNoteName(clickedNote, 0.55, 1, "femaleSample");

  svg.focus();
}

function undoCurrentVoiceNote() {
  if (isPlaying) return;
  const notes = getCurrentVoiceNotes();
  notes.pop();
  if (selectedIndex >= notes.length) selectedIndex = Math.max(0, notes.length - 1);
  setCurrentVoiceNotes(notes);
  renderScore();
}

function clearCurrentVoice() {
  if (isPlaying) return;
  setCurrentVoiceNotes([]);
  selectedIndex = 0;
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
  setNotesToTextarea("counterpoint1", exercise.counterpoint1 || []);
  setNotesToTextarea("counterpoint2", exercise.counterpoint2 || []);

  selectedIndex = 0;
  playbackIndex = 0;
  renderScore();
}

function setExample() {
  const select = document.getElementById("exerciseSelect");
  if (select) {
    select.value = "three-example-filled";
    updateExerciseDescription();
  }
  loadSelectedExercise();
}


function getSvgForVoice(voice) {
  const ids = {
    counterpoint1: "scoreEditorCounterpoint1",
    counterpoint2: "scoreEditorCounterpoint2",
    cantus: "scoreEditorCantus"
  };

  return document.getElementById(ids[voice]);
}

function updateActiveVoiceCards() {
  document.querySelectorAll(".voice-score-card").forEach((card) => {
    const voice = card.getAttribute("data-voice");
    card.classList.toggle("active-edit-voice", voice === editVoice);
  });
}

function drawStaffForVoice(svg, noteCount, voice) {
  const startX = SCORE.left - 30;
  const endX = SCORE.width - SCORE.right + 10;
  const positions = getScorePositions(noteCount);
  const staff = SCORE.staves[voice] || SCORE.staves.counterpoint1;
  const clefType = voice === "cantus" ? "bass" : "treble";

  for (let i = 0; i < 5; i++) {
    const y = staff.bottomLineY - i * SCORE.staffGap;
    svg.appendChild(createSvgElement("line", {
      x1: startX,
      y1: y,
      x2: endX,
      y2: y,
      class: "staff-line"
    }));
  }

  drawClef(svg, staff.bottomLineY, clefType);

  svg.appendChild(createSvgElement("text", {
    x: 22,
    y: staff.labelY,
    class: "voice-label"
  })).textContent = voice === "cantus" ? "Cantus / bass clef" : `${staff.label} / treble clef`;

  positions.forEach((x, i) => {
    svg.appendChild(createSvgElement("circle", {
      cx: x,
      cy: staff.bottomLineY + 42,
      r: 2.4,
      class: "slot-marker"
    }));

    svg.appendChild(createSvgElement("text", {
      x: x - 4,
      y: staff.bottomLineY + 64,
      class: "note-label"
    })).textContent = i + 1;

    if (i > 0) {
      const midX = (positions[i - 1] + x) / 2;
      svg.appendChild(createSvgElement("line", {
        x1: midX,
        y1: SCORE.playheadTop,
        x2: midX,
        y2: SCORE.playheadBottom,
        class: "measure-line"
      }));
    }
  });
}

function renderVoiceScore(voice, notes, noteCount) {
  const svg = getSvgForVoice(voice);
  if (!svg) return;

  clearSvg(svg);

  const positions = getScorePositions(noteCount);
  drawStaffForVoice(svg, noteCount, voice);
  drawPlayhead(svg, positions, noteCount);

  notes.forEach((note, i) => {
    if (note) {
      drawNote(svg, note, positions[i], voice, i);
    }
  });
}

function renderScore() {
  const cantus = getNotesFromTextarea("cantus");
  const cp1 = getNotesFromTextarea("counterpoint1");
  const cp2 = getNotesFromTextarea("counterpoint2");
  const noteCount = Math.max(cantus.length, cp1.length, cp2.length, 1);

  if (selectedIndex >= noteCount) selectedIndex = noteCount - 1;
  if (selectedIndex < 0) selectedIndex = 0;
  if (playbackIndex >= noteCount) playbackIndex = 0;
  if (playbackIndex < 0) playbackIndex = 0;

  renderVoiceScore("counterpoint1", cp1, noteCount);
  renderVoiceScore("counterpoint2", cp2, noteCount);
  renderVoiceScore("cantus", cantus, noteCount);

  updateActiveVoiceCards();
  updateDisplays();
}

function handleVoiceScoreClick(event) {
  if (isPlaying) return;

  const svg = event.currentTarget;
  const targetVoice = svg.getAttribute("data-voice");

  if (!["counterpoint1", "counterpoint2"].includes(targetVoice)) return;

  setEditVoice(targetVoice);

  const select = document.getElementById("editVoiceSelect");
  if (select) {
    select.value = targetVoice;
  }

  const rect = svg.getBoundingClientRect();
  const viewX = ((event.clientX - rect.left) / rect.width) * SCORE.width;
  const viewY = ((event.clientY - rect.top) / rect.height) * SCORE.height;

  const cantus = getNotesFromTextarea("cantus");
  let notes = getNotesFromTextarea(targetVoice);
  const noteCount = Math.max(cantus.length, 1);
  const positions = getScorePositions(noteCount);

  let nearestIndex = 0;
  let nearestDistance = Infinity;

  positions.forEach((x, i) => {
    const distance = Math.abs(x - viewX);
    if (distance < nearestDistance) {
      nearestIndex = i;
      nearestDistance = distance;
    }
  });

  const clickedNote = yToNaturalNote(viewY, targetVoice);

  while (notes.length < noteCount) notes.push("");

  selectedIndex = nearestIndex;
  notes[nearestIndex] = clickedNote;

  setNotesToTextarea(targetVoice, notes);
  renderScore();
  playNoteName(clickedNote, 0.55, 1, "femaleSample");

  svg.focus();
}

window.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("scoreEditor");

  if (svg) {
    svg.addEventListener("click", handleScoreClick);
  }


  ["counterpoint1", "counterpoint2"].forEach((voice) => {
    const voiceSvg = getSvgForVoice(voice);
    if (voiceSvg) {
      voiceSvg.addEventListener("click", handleVoiceScoreClick);
    }
  });

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

  const editVoiceSelect = document.getElementById("editVoiceSelect");
  if (editVoiceSelect) {
    editVoiceSelect.value = editVoice;
    editVoiceSelect.addEventListener("change", (event) => setEditVoice(event.target.value));
  }

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
  const wholeTicks = ticksPerQuarter * 4;

  const cantus = getNotesFromTextarea("cantus");
  const counterpoint1 = getNotesFromTextarea("counterpoint1");
  const counterpoint2 = getNotesFromTextarea("counterpoint2");

  if (!cantus.length && !counterpoint1.length && !counterpoint2.length) {
    alert(currentLanguage === "fr" ? "Aucune note à exporter." : "書き出す音がありません。");
    return;
  }

  const conductorEvents = [
    midiMetaEvent(0, 0x03, midiTextBytes("Tempo / Meter")),
    midiMetaEvent(0, 0x51, [0x0f, 0x42, 0x40]),
    midiMetaEvent(0, 0x58, [0x04, 0x02, 0x18, 0x08]),
    midiMetaEvent(0, 0x2f, [])
  ];

  const tracks = [
    midiTrackChunk(conductorEvents),
    midiBuildNoteTrack("Cantus", cantus, 0, wholeTicks, 72),
    midiBuildNoteTrack("Counterpoint 1", counterpoint1, 1, wholeTicks, 86),
    midiBuildNoteTrack("Counterpoint 2", counterpoint2, 2, wholeTicks, 82)
  ];

  const bytes = midiCreateFile(tracks, ticksPerQuarter);
  midiDownload(bytes, "three_voice_counterpoint_tempo60_4-4.mid");
}

