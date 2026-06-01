const SVG_NS = "http://www.w3.org/2000/svg";

const SCORE = {
  width: 1480,
  height: 430,
  left: 128,
  right: 64,
  measureWidth: 118,
  staffGap: 14,
  noteStep: 7,
  counterpointBottomLineY: 150,
  cantusBottomLineY: 320,
  playheadTop: 56,
  playheadBottom: 400,
  noteImageWidth: 31.3,
  noteImageHeight: 18.4,
  accidentalWidth: 19,
  accidentalHeight: 52
};

const NOTE_LETTER_STEPS = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6
};

const NATURAL_NOTES = [
  "C2", "D2", "E2", "F2", "G2", "A2", "B2",
  "C3", "D3", "E3", "F3", "G3", "A3", "B3",
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  "C6"
];

const SAMPLE_VOICE_SETS = {
  femaleSample: {
    folder: "female",
    notes: ["C4", "G4", "C5", "G5"],
    transposeSemitones: 0
  },
  maleSample: {
    folder: "male",
    notes: ["C2", "G2", "C3", "G3", "C4", "G4"],
    transposeSemitones: 0
  }
};

const I18N = {
  ja: {
    backLink: "← トップへ戻る",
    languageLabel: "言語",
    title: "第一種2声対位法チェッカー",
    lead: "下段の定旋律に対して、上段に1対1の対旋律を入力します。上段の五線譜をクリックして入力してください。",
    exerciseLabel: "課題",
    loadExercise: "課題を読み込む",
    loadExample: "例題を読み込む",
    deleteSelected: "選択音を削除",
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
    timbreHumanVoice: "人の声",
    playbackHint: "Space：再生 / 停止　｜　← / →：前後の音へ移動　｜　↑ / ↓：選択音を半音移動",
    scoreInputTitle: "五線入力",
    scoreInputHelp: "上段の対旋律だけ編集できます。下段の定旋律はヘ音記号で表示されます。",
    currentInput: "現在の入力",
    cantusLabel: "定旋律：",
    counterpointLabel: "対旋律：",
    analyze: "解析する",
    analysisResult: "解析結果",
    play: "再生",
    stop: "停止"
  },
  fr: {
    backLink: "← Retour",
    languageLabel: "Langue",
    title: "Correcteur de contrepoint à deux voix",
    lead: "Écrivez le contrepoint note contre note sur la portée supérieure. Le cantus firmus est affiché en clé de fa sur la portée inférieure.",
    exerciseLabel: "Exercice",
    loadExercise: "Charger",
    loadExample: "Charger l’exemple",
    deleteSelected: "Supprimer la note",
    deleteLast: "Supprimer la dernière note",
    clearCounterpoint: "Effacer le contrepoint",
    refreshScore: "Actualiser",
    playSelected: "Jouer la note",
    exportMidi: "Exporter MIDI",
    resetStart: "Revenir au début",
    playbackModeLabel: "Lecture",
    playBoth: "Deux voix",
    playCantus: "Cantus seul",
    playCounterpoint: "Contrepoint seul",
    timbreLabel: "Timbre",
    timbreHumanVoice: "Voix humaine",
    playbackHint: "Espace : lecture / arrêt ｜ ← / → : note précédente / suivante ｜ ↑ / ↓ : demi-ton",
    scoreInputTitle: "Saisie sur portée",
    scoreInputHelp: "Seule la portée supérieure est éditable. Le cantus est affiché en clé de fa.",
    currentInput: "Entrée actuelle",
    cantusLabel: "Cantus :",
    counterpointLabel: "Contrepoint :",
    analyze: "Analyser",
    analysisResult: "Résultat",
    play: "Lecture",
    stop: "Arrêter"
  }
};

const EXERCISES = [
  {
    id: "c-major-arch",
    titleJa: "C major / アーチ型",
    titleFr: "Do majeur / arche",
    descriptionJa: "Cから上行し、中央で頂点を作って戻る基本課題です。",
    descriptionFr: "Cantus conjoint en arche depuis do.",
    cantus: ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4"]
  },
  {
    id: "d-minor-step",
    titleJa: "D minor / 順次進行",
    titleFr: "Ré mineur / mouvement conjoint",
    descriptionJa: "短調の感覚を保ちながら順次進行を練習します。",
    descriptionFr: "Travail conjoint dans une couleur mineure.",
    cantus: ["D4", "E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4"]
  },
  {
    id: "g-major-low",
    titleJa: "G major / 低めの音域",
    titleFr: "Sol majeur / registre grave",
    descriptionJa: "やや低い音域で、安定した協和音程を作る課題です。",
    descriptionFr: "Cantus dans un registre un peu plus grave.",
    cantus: ["G3", "A3", "B3", "C4", "D4", "C4", "B3", "A3", "G3"]
  },
  {
    id: "f-major-small-peak",
    titleJa: "F major / 小さな頂点",
    titleFr: "Fa majeur / petit sommet",
    descriptionJa: "短い上行と下行を含む、まとまりやすい定旋律です。",
    descriptionFr: "Ligne courte avec un petit sommet.",
    cantus: ["F3", "G3", "A3", "C4", "B3", "A3", "G3", "F3"]
  },
  {
    id: "a-minor-return",
    titleJa: "A minor / 回帰",
    titleFr: "La mineur / retour",
    descriptionJa: "開始音へ自然に戻ることを意識する課題です。",
    descriptionFr: "Exercice centré sur le retour au son initial.",
    cantus: ["A3", "B3", "C4", "D4", "E4", "D4", "C4", "B3", "A3"]
  },
  {
    id: "c-major-leap",
    titleJa: "C major / 小さな跳躍",
    titleFr: "Do majeur / petit saut",
    descriptionJa: "小さな跳躍を含む定旋律に対して対旋律を作ります。",
    descriptionFr: "Cantus avec un petit saut.",
    cantus: ["C4", "E4", "D4", "F4", "G4", "E4", "F4", "D4", "C4"]
  },
  {
    id: "e-minor-middle",
    titleJa: "E minor / 中音域",
    titleFr: "Mi mineur / registre médian",
    descriptionJa: "中音域で対旋律の輪郭を整える課題です。",
    descriptionFr: "Travail de contour dans le registre médian.",
    cantus: ["E4", "F4", "G4", "A4", "B4", "A4", "G4", "F4", "E4"]
  },
  {
    id: "g-major-long",
    titleJa: "G major / 長め",
    titleFr: "Sol majeur / plus long",
    descriptionJa: "少し長い定旋律で、連続5度・8度を避ける練習です。",
    descriptionFr: "Cantus plus long pour éviter les quintes/octaves parallèles.",
    cantus: ["G3", "A3", "B3", "D4", "C4", "B3", "A3", "C4", "B3", "A3", "G3"]
  },
  {
    id: "f-major-descend",
    titleJa: "F major / 下降中心",
    titleFr: "Fa majeur / descente",
    descriptionJa: "下降形を中心にした定旋律です。",
    descriptionFr: "Cantus principalement descendant.",
    cantus: ["F4", "E4", "D4", "C4", "B3", "C4", "D4", "C4", "F3"]
  },
  {
    id: "c-major-extended",
    titleJa: "C major / 拡張",
    titleFr: "Do majeur / étendu",
    descriptionJa: "やや長めの総合練習です。",
    descriptionFr: "Exercice de synthèse un peu plus long.",
    cantus: ["C4", "D4", "E4", "G4", "F4", "E4", "D4", "F4", "E4", "D4", "C4"]
  }
];

let currentLanguage = "ja";
let selectedIndex = 0;

const voiceMuteState = {
  counterpoint: false,
  cantus: false
};

let playbackIndex = 0;
let isPlaying = false;
let playbackTimerId = null;
let audioContext = null;
let lastIssues = [];

const sampleVoiceCache = {};

function t(key) {
  return I18N[currentLanguage]?.[key] || I18N.ja[key] || key;
}

function setLanguage(lang) {
  currentLanguage = lang === "fr" ? "fr" : "ja";
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (I18N[currentLanguage]?.[key]) {
      el.textContent = I18N[currentLanguage][key];
    }
  });

  populateExercises();
  if (!window.module1InitialExerciseLoaded) {
    window.module1InitialExerciseLoaded = true;
    const select = document.getElementById("exerciseSelect");
    if (select && select.options.length && !select.value) {
      select.selectedIndex = 0;
    }
    if (!getNotesFromTextarea("cantus").length) {
      loadSelectedExercise();
    }
  }
  setupModule1KeyboardControls();
  updateExerciseDescription();
  updatePlayPauseButton();
}

function populateExercises() {
  const select = document.getElementById("exerciseSelect");
  if (!select) {
    updateExerciseDescription();
    return;
  }

  const previousValue = select.value;
  select.innerHTML = "";

  EXERCISES.forEach((exercise) => {
    const option = document.createElement("option");
    option.value = exercise.id;
    option.textContent = currentLanguage === "fr"
      ? (exercise.titleFr || exercise.titleJa || exercise.id)
      : (exercise.titleJa || exercise.titleFr || exercise.id);
    select.appendChild(option);
  });

  if (previousValue && EXERCISES.some((exercise) => exercise.id === previousValue)) {
    select.value = previousValue;
  }

  updateExerciseDescription();
}

function updateExerciseDescription() {
  const description = document.getElementById("exerciseDescription");
  if (!description) return;

  const select = document.getElementById("exerciseSelect");
  const id = select ? select.value : (EXERCISES[0] ? EXERCISES[0].id : null);
  const exercise = EXERCISES.find((item) => item.id === id) || EXERCISES[0];

  if (!exercise) {
    description.textContent = "";
    return;
  }

  description.textContent = currentLanguage === "fr"
    ? (exercise.descriptionFr || exercise.descriptionJa || "")
    : (exercise.descriptionJa || exercise.descriptionFr || "");
}

function loadSelectedExercise() {
  const select = document.getElementById("exerciseSelect");
  const id = select ? select.value : (EXERCISES[0] ? EXERCISES[0].id : null);
  const exercise = EXERCISES.find((item) => item.id === id) || EXERCISES[0];
  if (!exercise) return;

  setNotesToTextarea("cantus", exercise.cantus || []);
  setNotesToTextarea("counterpoint", []);
  selectedIndex = 0;
  playbackIndex = 0;
  stopPlayback(true);
  updateExerciseDescription();
  renderScore();
}

function setExample() {
  loadExample();
}

function loadExample() {
  setNotesToTextarea("cantus", ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4"]);
  setNotesToTextarea("counterpoint", ["G4", "F4", "G4", "A4", "B4", "A4", "G4", "F4", "C5"]);
  selectedIndex = 0;
  playbackIndex = 0;
  lastIssues = [];
  renderScore();
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function getSampleVoiceBasePath() {
  return "audio/voice";
}

function parseNote(note) {
  if (!note) return null;
  const match = String(note).trim().match(/^([A-Ga-g])(#|b)?(-?\d)$/);
  if (!match) return null;

  return {
    letter: match[1].toUpperCase(),
    accidental: match[2] || "",
    octave: parseInt(match[3], 10)
  };
}

function noteToMidi(note) {
  const parsed = parseNote(note);
  if (!parsed) return null;

  const base = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11
  };

  let value = base[parsed.letter];
  if (parsed.accidental === "#") value += 1;
  if (parsed.accidental === "b") value -= 1;

  return 12 * (parsed.octave + 1) + value;
}

function midiToNote(midi, preference = "sharp") {
  const sharpNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const flatNames = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const names = preference === "flat" ? flatNames : sharpNames;

  const pitch = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;

  return `${names[pitch]}${octave}`;
}

function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
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

  if (abs === 0) return currentLanguage === "fr" ? "unisson" : "完全1度";
  if (abs === 12) return currentLanguage === "fr" ? "octave" : "完全8度";

  const ja = {
    0: "完全8度または複合完全音程",
    1: "短2度",
    2: "長2度",
    3: "短3度",
    4: "長3度",
    5: "完全4度",
    6: "増4度 / 減5度",
    7: "完全5度",
    8: "短6度",
    9: "長6度",
    10: "短7度",
    11: "長7度"
  };

  const fr = {
    0: "octave ou intervalle parfait composé",
    1: "seconde mineure",
    2: "seconde majeure",
    3: "tierce mineure",
    4: "tierce majeure",
    5: "quarte juste",
    6: "triton",
    7: "quinte juste",
    8: "sixte mineure",
    9: "sixte majeure",
    10: "septième mineure",
    11: "septième majeure"
  };

  return currentLanguage === "fr" ? fr[simple] : ja[simple];
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

function playFallbackVoice(midi, duration = 0.45, gainScale = 1) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const freq = midiToFrequency(midi);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1200, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18 * gainScale, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.08);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(getModule1AudioDestination());

  osc.start(now);
  osc.stop(now + duration + 0.1);
}

async 
let module1ReverbNodes = null;

function getModule1ReverbNodes() {
  const context = getAudioContext();
  if (!context) return null;

  if (module1ReverbNodes && module1ReverbNodes.context === context) {
    return module1ReverbNodes;
  }

  const input = context.createGain();
  const dry = context.createGain();
  const wet = context.createGain();
  const delay = context.createDelay(0.25);
  const feedback = context.createGain();
  const filter = context.createBiquadFilter();

  dry.gain.value = 0.86;
  wet.gain.value = 0.14;
  delay.delayTime.value = 0.038;
  feedback.gain.value = 0.18;
  filter.type = "lowpass";
  filter.frequency.value = 4200;

  input.connect(dry);
  dry.connect(context.destination);

  input.connect(wet);
  wet.connect(delay);
  delay.connect(filter);
  filter.connect(context.destination);
  filter.connect(feedback);
  feedback.connect(delay);

  module1ReverbNodes = { context, input, dry, wet, delay, feedback, filter };
  return module1ReverbNodes;
}

function getModule1AudioDestination() {
  const reverb = getModule1ReverbNodes();
  const context = getAudioContext();
  return reverb ? reverb.input : context.destination;
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
  gain.connect(getModule1AudioDestination());

  source.start(now);
  source.stop(now + duration + 0.12);
}

function playMidiNote(midi, duration = 0.38, gainScale = 1, voiceSet = "femaleSample") {
  playSampleVoiceNote(voiceSet, midi, duration, gainScale);
}

function playNoteName(note, duration = 0.38, gainScale = 1, voiceSet = "femaleSample") {
  const midi = noteToMidi(note);
  if (midi === null) return;
  playMidiNote(midi, duration, gainScale, voiceSet);
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

function getPlaybackMode() {
  return "both";
}

function getStepDurationSeconds() {
  const input = document.getElementById("tempoInput");
  const tempo = Math.min(180, Math.max(40, Number(input?.value) || 66));
  return 60 / tempo;
}

function getPlaybackLength() {
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  return Math.max(cantus.length, counterpoint.length, 1);
}

function updatePlayPauseButton() {
  const button = document.getElementById("playPauseButton");
  if (!button) return;
  button.textContent = isPlaying ? t("stop") : t("play");
}

function togglePlayback() {
  if (isPlaying) {
    stopPlayback(false);
  } else {
    startPlayback();
  }
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
  window.clearTimeout(playbackTimerId);
  playbackTimerId = null;

  if (resetToStart) playbackIndex = 0;

  updatePlayPauseButton();
  renderScore();
}

function playCurrentStep() {
  if (!isPlaying) return;

  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const length = getPlaybackLength();
  const duration = getStepDurationSeconds();

  if (playbackIndex >= length) {
    stopPlayback(true);
    return;
  }

  renderScore();

  if (!isVoiceMuted("cantus") && cantus[playbackIndex]) {
    playNoteName(cantus[playbackIndex], duration * 0.88, 0.72, "maleSample");
  }

  if (!isVoiceMuted("counterpoint") && counterpoint[playbackIndex]) {
    playNoteName(counterpoint[playbackIndex], duration * 0.88, 1, "femaleSample");
  }

  playbackTimerId = window.setTimeout(() => {
    playbackIndex += 1;
    playCurrentStep();
  }, duration * 1000);
}

function previewTimbre() {
  playNoteName("C4", 0.45, 1, "femaleSample");
  window.setTimeout(() => playNoteName("C4", 0.55, 0.8, "maleSample"), 180);
}

function playSelectedNote() {
  const counterpoint = getNotesFromTextarea("counterpoint");
  const note = counterpoint[selectedIndex];
  if (!note) return;
  playNoteName(note, 0.45, 1, "femaleSample");
}

function moveNoteChromatic(note, semitone) {
  const midi = noteToMidi(note);
  if (midi === null) return note;
  const preference = semitone > 0 ? "sharp" : "flat";
  return midiToNote(midi + semitone, preference);
}

function moveSelection(delta) {
  const length = getPlaybackLength();
  selectedIndex = Math.min(length - 1, Math.max(0, selectedIndex + delta));
  renderScore();

  const counterpoint = getNotesFromTextarea("counterpoint");
  if (counterpoint[selectedIndex]) {
    playNoteName(counterpoint[selectedIndex], 0.25, 1, "femaleSample");
  }
}

function moveSelectedNote(semitone) {
  const cantus = getNotesFromTextarea("cantus");
  let counterpoint = getNotesFromTextarea("counterpoint");
  const length = Math.max(cantus.length, 1);

  while (counterpoint.length < length) counterpoint.push("");

  if (selectedIndex < 0) selectedIndex = 0;
  if (selectedIndex >= length) selectedIndex = length - 1;

  const currentNote = counterpoint[selectedIndex];
  counterpoint[selectedIndex] = currentNote ? moveNoteChromatic(currentNote, semitone) : "G4";

  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
  playNoteName(counterpoint[selectedIndex], 0.25, 1, "femaleSample");
}

function deleteSelectedNote() {
  const cantus = getNotesFromTextarea("cantus");
  let counterpoint = getNotesFromTextarea("counterpoint");

  while (counterpoint.length < cantus.length) counterpoint.push("");
  counterpoint[selectedIndex] = "";

  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
}

function undoCounterpointNote() {
  const counterpoint = getNotesFromTextarea("counterpoint");
  counterpoint.pop();

  if (selectedIndex >= counterpoint.length) {
    selectedIndex = Math.max(0, counterpoint.length - 1);
  }

  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
}

function clearCounterpoint() {
  selectedIndex = 0;
  setNotesToTextarea("counterpoint", []);
  lastIssues = [];
  renderResults([]);
  renderSummary("");
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


function getSenzokuScoreWidth(noteCount) {
  const count = Math.max(noteCount, 1);
  return Math.max(SCORE.width, SCORE.left + count * SCORE.measureWidth + SCORE.right + 48);
}

function getMeasureStartX(index) {
  return SCORE.left + index * SCORE.measureWidth;
}

function getMeasureNoteX(index) {
  return getMeasureStartX(index) + SCORE.measureWidth * 0.54;
}

function getMeasureIndexFromX(x, noteCount) {
  const count = Math.max(noteCount, 1);
  const raw = Math.floor((x - SCORE.left) / SCORE.measureWidth);
  return Math.max(0, Math.min(count - 1, raw));
}


function supportsMusicNotationGlyph(glyph) {
  const canvas = supportsMusicNotationGlyph.canvas || (supportsMusicNotationGlyph.canvas = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  ctx.font = '32px "Bravura", "Petaluma", "Noto Music", "Segoe UI Symbol", serif';
  const musicWidth = ctx.measureText(glyph).width;

  ctx.font = "32px monospace";
  const fallbackWidth = ctx.measureText(glyph).width;

  return Math.abs(musicWidth - fallbackWidth) > 0.5 || musicWidth > 12;
}

function getWholeNoteGlyph() {
  // SMuFL noteheadWhole. Bravura / Petaluma / many modern notation fonts support this.
  return "\uE0A2";
}

function getFallbackWholeNoteGlyph() {
  // Unicode musical symbol whole note. Used only if SMuFL glyph is unavailable.
  return "𝅝";
}

function getAccidentalGlyph(parsed) {
  if (!parsed) return "";
  if (parsed.accidental === "#") return "\uE262"; // SMuFL accidentalSharp
  if (parsed.accidental === "b") return "\uE260"; // SMuFL accidentalFlat
  return "";
}

function getFallbackAccidentalGlyph(parsed) {
  if (!parsed) return "";
  if (parsed.accidental === "#") return "♯";
  if (parsed.accidental === "b") return "♭";
  return "";
}

function getAccidentalSymbol(parsed) {
  if (!parsed) return "";
  if (parsed.accidental === "#") return "♯";
  if (parsed.accidental === "b") return "♭";
  return "";
}

function drawSenzokuMeasureHighlight(svg, noteCount) {
  const x = getMeasureStartX(selectedIndex);
  svg.appendChild(createSvgElement("rect", {
    x,
    y: SCORE.counterpointBottomLineY - 112,
    width: SCORE.measureWidth,
    height: 156,
    class: "senzoku-input-highlight"
  }));

  svg.appendChild(createSvgElement("line", {
    x1: x,
    y1: SCORE.counterpointBottomLineY - 118,
    x2: x,
    y2: SCORE.counterpointBottomLineY + 66,
    class: "senzoku-cursor-line"
  }));

  svg.appendChild(createSvgElement("path", {
    d: `M ${x - 5} ${SCORE.counterpointBottomLineY - 116} L ${x + 5} ${SCORE.counterpointBottomLineY - 116} L ${x} ${SCORE.counterpointBottomLineY - 106} Z`,
    class: "senzoku-cursor-triangle"
  }));
}

function drawSenzokuBarlines(svg, noteCount) {
  const top = SCORE.counterpointBottomLineY - 96;
  const bottom = SCORE.cantusBottomLineY + 56;

  for (let i = 0; i <= noteCount; i += 1) {
    const x = getMeasureStartX(i);
    svg.appendChild(createSvgElement("line", {
      x1: x,
      y1: top,
      x2: x,
      y2: bottom,
      class: i % 4 === 0 ? "senzoku-measure-line strong" : "senzoku-measure-line"
    }));
  }
}







function isVoiceMuted(voice) {
  return !!voiceMuteState[voice];
}

function syncVoiceMuteButtons() {
  const counterpointButton = document.getElementById("muteCounterpointButton");
  const cantusButton = document.getElementById("muteCantusButton");

  if (counterpointButton) {
    const muted = isVoiceMuted("counterpoint");
    counterpointButton.classList.toggle("muted", muted);
    counterpointButton.setAttribute("aria-pressed", muted ? "true" : "false");
  }

  if (cantusButton) {
    const muted = isVoiceMuted("cantus");
    cantusButton.classList.toggle("muted", muted);
    cantusButton.setAttribute("aria-pressed", muted ? "true" : "false");
  }
}

function toggleVoiceMute(voice) {
  if (!Object.prototype.hasOwnProperty.call(voiceMuteState, voice)) return;

  voiceMuteState[voice] = !voiceMuteState[voice];
  syncVoiceMuteButtons();
  renderScore();
}

function toggleVoiceMuteFromButton(voice) {
  toggleVoiceMute(voice);
}

function drawVoiceMuteButton(svg, voice, x, y) {
  const muted = isVoiceMuted(voice);
  const group = createSvgElement("g", {
    class: ["voice-mute-button", muted ? "muted" : "", voice].filter(Boolean).join(" "),
    "data-voice": voice,
    tabindex: "0",
    role: "button",
    "aria-label": muted ? `${voice} muted` : `${voice} active`
  });

  group.appendChild(createSvgElement("rect", {
    x,
    y,
    width: 44,
    height: 28,
    rx: 9,
    ry: 9,
    class: "voice-mute-button-bg"
  }));

  const label = createSvgElement("text", {
    x: x + 22,
    y: y + 14.7,
    class: "voice-mute-button-label"
  });
  label.textContent = "M";
  group.appendChild(label);

  group.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleVoiceMute(voice);
  });

  group.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      toggleVoiceMute(voice);
    }
  });

  svg.appendChild(group);
}

function drawSenzokuSystemLabels(svg) {
  svg.appendChild(createSvgElement("text", {
    x: 22,
    y: SCORE.counterpointBottomLineY - 76,
    class: "voice-label senzoku-label"
  })).textContent = "Counterpoint";

  svg.appendChild(createSvgElement("text", {
    x: 22,
    y: SCORE.cantusBottomLineY - 76,
    class: "voice-label senzoku-label"
  })).textContent = "Cantus";
}


const NOTATION_IMAGE_BASE = "images/notation/";

const NOTATION_IMAGES = {
  staff: `${NOTATION_IMAGE_BASE}staff-5lines.png`,
  trebleClef: `${NOTATION_IMAGE_BASE}treble-clef.png`,
  bassClef: `${NOTATION_IMAGE_BASE}bass-clef.png`,
  wholeNote: `${NOTATION_IMAGE_BASE}whole-note.png`,
  sharp: `${NOTATION_IMAGE_BASE}sharp.png`,
  flat: `${NOTATION_IMAGE_BASE}flat.png`,
  natural: `${NOTATION_IMAGE_BASE}natural.png`
};

function createSvgImage(href, x, y, width, height, className = "", preserveAspectRatio = "xMidYMid meet") {
  const image = createSvgElement("image", {
    x,
    y,
    width,
    height,
    href,
    class: className,
    preserveAspectRatio
  });

  image.setAttributeNS("http://www.w3.org/1999/xlink", "href", href);
  return image;
}

function getSenzokuScoreWidth(noteCount) {
  const count = Math.max(noteCount, 1);
  return Math.max(SCORE.width, SCORE.left + count * SCORE.measureWidth + SCORE.right + 24);
}

function getMeasureStartX(index) {
  return SCORE.left + index * SCORE.measureWidth;
}

function getMeasureNoteX(index) {
  return getMeasureStartX(index) + SCORE.measureWidth * 0.52;
}

function getMeasureIndexFromX(x, noteCount) {
  const count = Math.max(noteCount, 1);
  const raw = Math.floor((x - SCORE.left) / SCORE.measureWidth);
  return Math.max(0, Math.min(count - 1, raw));
}

function getAccidentalImage(parsed) {
  if (!parsed || !parsed.accidental) return "";
  if (parsed.accidental === "#") return NOTATION_IMAGES.sharp;
  if (parsed.accidental === "b") return NOTATION_IMAGES.flat;
  return "";
}

function drawSenzokuMeasureHighlight(svg, noteCount) {
  const x = getMeasureStartX(selectedIndex);
  svg.appendChild(createSvgElement("rect", {
    x,
    y: SCORE.counterpointBottomLineY - 92,
    width: SCORE.measureWidth,
    height: 132,
    class: "senzoku-input-highlight"
  }));

  svg.appendChild(createSvgElement("line", {
    x1: x,
    y1: SCORE.counterpointBottomLineY - 98,
    x2: x,
    y2: SCORE.counterpointBottomLineY + 52,
    class: "senzoku-cursor-line"
  }));

  svg.appendChild(createSvgElement("path", {
    d: `M ${x - 5} ${SCORE.counterpointBottomLineY - 96} L ${x + 5} ${SCORE.counterpointBottomLineY - 96} L ${x} ${SCORE.counterpointBottomLineY - 86} Z`,
    class: "senzoku-cursor-triangle"
  }));
}

function drawSenzokuBarlines(svg, noteCount) {
  const top = SCORE.counterpointBottomLineY - 74;
  const bottom = SCORE.cantusBottomLineY + 42;

  for (let i = 0; i <= noteCount; i += 1) {
    const x = getMeasureStartX(i);
    svg.appendChild(createSvgElement("line", {
      x1: x,
      y1: top,
      x2: x,
      y2: bottom,
      class: i % 4 === 0 ? "senzoku-measure-line strong" : "senzoku-measure-line"
    }));
  }
}

function drawSenzokuSystemLabels(svg) {
  svg.appendChild(createSvgElement("text", {
    x: 24,
    y: SCORE.counterpointBottomLineY - 56,
    class: "voice-label senzoku-label"
  })).textContent = "Counterpoint";

  svg.appendChild(createSvgElement("text", {
    x: 24,
    y: SCORE.cantusBottomLineY - 56,
    class: "voice-label senzoku-label"
  })).textContent = "Cantus";
}

function noteToY(note, bottomLineY = SCORE.counterpointBottomLineY) {
  const noteStep = getDiatonicStep(note);
  const referenceNote = bottomLineY === SCORE.cantusBottomLineY ? "G2" : "E4";
  const referenceStep = getDiatonicStep(referenceNote);

  if (noteStep === null || referenceStep === null) return null;

  return bottomLineY - (noteStep - referenceStep) * SCORE.noteStep;
}

function yToNaturalNote(y) {
  const referenceStep = getDiatonicStep("E4");
  const rawStep = Math.round((SCORE.counterpointBottomLineY - y) / SCORE.noteStep);
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
  const count = Math.max(noteCount, 1);
  return Array.from({ length: count }, (_, i) => getMeasureNoteX(i));
}

function drawClef(svg, bottomLineY, clefType = "treble") {
  const isBass = clefType === "bass";
  const href = isBass ? NOTATION_IMAGES.bassClef : NOTATION_IMAGES.trebleClef;

  const width = isBass ? 68 : 72;
  const height = isBass ? 88 : 136;

  // Clefs overlap the staff area.
  const x = SCORE.left - 60;
  const y = isBass ? bottomLineY - 76 : bottomLineY - 117;

  svg.appendChild(createSvgImage(href, x, y, width, height, [
    "png-notation",
    "png-clef",
    isBass ? "bass" : "treble"
  ].join(" ")));
}

function drawStaff(svg, bottomLineY, label, noteCount, clefType = "treble") {
  const endX = getMeasureStartX(noteCount);

  // Extend the staff slightly to the left so it visually passes under the clef.
  const staffX = SCORE.left - 18;
  const staffY = bottomLineY - SCORE.staffGap * 4;
  const staffWidth = Math.max(SCORE.measureWidth, endX - staffX);
  const staffHeight = SCORE.staffGap * 4 + 2;

  svg.appendChild(createSvgImage(
    NOTATION_IMAGES.staff,
    staffX,
    staffY - 1,
    staffWidth,
    staffHeight + 2,
    "png-notation png-staff",
    "none"
  ));

  drawClef(svg, bottomLineY, clefType);

  if (clefType === "bass") {
    const positions = getScorePositions(noteCount);
    positions.forEach((x, i) => {
      svg.appendChild(createSvgElement("text", {
        x: x - 4,
        y: bottomLineY + 78,
        class: "note-label"
      })).textContent = i + 1;
    });
  }
}

function drawPlayhead(svg, positions, noteCount) {
  if (!isPlaying || !positions[playbackIndex]) return;

  svg.appendChild(createSvgElement("line", {
    x1: positions[playbackIndex],
    y1: SCORE.playheadTop,
    x2: positions[playbackIndex],
    y2: SCORE.playheadBottom,
    class: "playhead"
  }));
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

function drawAccidental(svg, parsed, x, y, className = "") {
  const href = getAccidentalImage(parsed);
  if (!href) return;

  let width = SCORE.accidentalWidth;
  let height = SCORE.accidentalHeight;

  if (parsed.accidental === "b") {
    width = 18;
    height = 46;
  }

  svg.appendChild(createSvgImage(
    href,
    x - 34,
    y - height * 0.53,
    width,
    height,
    ["png-notation", "png-accidental", className].filter(Boolean).join(" ")
  ));
}

function getIssueClass(voice, index) {
  return lastIssues.some((issue) => issue.voice === voice && issue.index === index) ? "error" : "";
}

function drawIssueRing(svg, x, y, issueClass) {
  if (!issueClass) return;
  svg.appendChild(createSvgElement("circle", { cx: x, cy: y, r: 15, class: "issue-ring" }));
}

function drawNote(svg, note, x, voice, index, bottomLineY) {
  const y = noteToY(note, bottomLineY);
  const parsed = parseNote(note);
  if (y === null || !parsed) return;

  const isCantus = voice === "cantus";
  const isSelected = !isCantus && index === selectedIndex && !isPlaying;
  const isCurrentPlayback = index === playbackIndex && isPlaying;
  const issueClass = getIssueClass(voice, index);

  // Optical correction only; pitch logic remains unchanged.
  // Bass noteheads were slightly too low/then too high. Set a mild upward correction.
  const noteImageYOffset = isCantus ? -2 : -0.5;
  const noteDrawY = y + noteImageYOffset;

  drawLedgerLines(svg, x, y, bottomLineY);
  drawIssueRing(svg, x, y, issueClass);
  drawAccidental(svg, parsed, x, y, [
    isCantus ? "cantus" : "",
    isVoiceMuted(isCantus ? "cantus" : "counterpoint") ? "muted-voice" : "",
    isSelected ? "selected" : "",
    isCurrentPlayback ? "playing" : "",
    issueClass
  ].filter(Boolean).join(" "));

  const imageClass = [
    "png-notation",
    "png-notehead",
    "png-whole-note",
    isCantus ? "cantus" : "",
    isVoiceMuted(isCantus ? "cantus" : "counterpoint") ? "muted-voice" : "",
    isSelected ? "selected" : "",
    isCurrentPlayback ? "playing" : "",
    issueClass
  ].filter(Boolean).join(" ");

  svg.appendChild(createSvgImage(
    NOTATION_IMAGES.wholeNote,
    x - SCORE.noteImageWidth / 2,
    noteDrawY - SCORE.noteImageHeight / 2,
    SCORE.noteImageWidth,
    SCORE.noteImageHeight,
    imageClass
  ));

  if (!isCantus && isSelected) {
    svg.appendChild(createSvgElement("circle", {
      cx: x,
      cy: y,
      r: 13,
      class: "senzoku-selected-ring"
    }));
  }
}

function renderScore() {
  const svg = document.getElementById("scoreEditor");
  if (!svg) return;

  clearSvg(svg);

  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const noteCount = Math.max(cantus.length, counterpoint.length, 1);
  const scoreWidth = getSenzokuScoreWidth(noteCount);
  const positions = getScorePositions(noteCount);

  svg.setAttribute("viewBox", `0 0 ${scoreWidth} ${SCORE.height}`);
  svg.style.minWidth = `${scoreWidth}px`;

  if (selectedIndex >= noteCount) selectedIndex = noteCount - 1;
  if (selectedIndex < 0) selectedIndex = 0;
  if (playbackIndex >= noteCount) playbackIndex = 0;
  if (playbackIndex < 0) playbackIndex = 0;

  drawSenzokuMeasureHighlight(svg, noteCount);
  drawStaff(svg, SCORE.counterpointBottomLineY, "Counterpoint / treble clef", noteCount, "treble");
  drawStaff(svg, SCORE.cantusBottomLineY, "Cantus / bass clef", noteCount, "bass");
  drawSenzokuBarlines(svg, noteCount);
  drawSenzokuSystemLabels(svg);
  drawPlayhead(svg, positions, noteCount);

  counterpoint.forEach((note, i) => {
    if (note) drawNote(svg, note, positions[i], "counterpoint", i, SCORE.counterpointBottomLineY);
  });

  cantus.forEach((note, i) => {
    if (note) drawNote(svg, note, positions[i], "cantus", i, SCORE.cantusBottomLineY);
  });

  updateDisplays();
}

function handleScoreClick(event) {
  if (isPlaying) return;

  const svg = document.getElementById("scoreEditor");
  if (!svg) return;

  const rect = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const viewX = ((event.clientX - rect.left) / rect.width) * viewBox.width;
  const viewY = ((event.clientY - rect.top) / rect.height) * viewBox.height;

  // Edit upper staff only.
  if (viewY > (SCORE.counterpointBottomLineY + SCORE.cantusBottomLineY) / 2) return;

  const cantus = getNotesFromTextarea("cantus");
  let counterpoint = getNotesFromTextarea("counterpoint");
  const noteCount = Math.max(cantus.length, 1);

  const clickedIndex = getMeasureIndexFromX(viewX, noteCount);
  const clickedNote = yToNaturalNote(viewY);

  while (counterpoint.length < noteCount) counterpoint.push("");

  selectedIndex = clickedIndex;
  counterpoint[clickedIndex] = clickedNote;

  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
  playNoteName(clickedNote, 0.45, 1, "femaleSample");
}


function handleModule1Keyboard(event) {
  const tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
  const isEditable = tag === "input" || tag === "textarea" || tag === "select" || (event.target && event.target.isContentEditable);
  if (isEditable) return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveSelection(-1);
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveSelection(1);
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

  if (event.key === " " || event.code === "Space") {
    event.preventDefault();
    togglePlayback();
    return;
  }

  if (event.key === "Backspace" || event.key === "Delete") {
    event.preventDefault();
    deleteSelectedNote();
  }
}

function setupModule1KeyboardControls() {
  if (window.module1KeyboardControlsReady) return;
  window.module1KeyboardControlsReady = true;
  window.addEventListener("keydown", handleModule1Keyboard);
}

function updateDisplays() {
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");

  document.getElementById("cantusDisplay").textContent = cantus.join(" ");
  document.getElementById("counterpointDisplay").textContent = counterpoint.length ? counterpoint.join(" ") : "未入力";

  const scoreStatus = document.getElementById("scoreStatus");
  if (scoreStatus) scoreStatus.textContent = `対旋律：${counterpoint.length}音 / 定旋律：${cantus.length}音`;
}

function addIssue(index, voice, type, message, results) {
  if (type === "error") {
    lastIssues.push({ index, voice });
  }
  results.push({ type, message });
}

function renderSummary(text) {
  const box = document.getElementById("summary");
  if (box) box.textContent = text;
}

function renderResults(results) {
  const box = document.getElementById("result");
  if (!box) return;

  box.innerHTML = results.map((item) => {
    const label = item.type === "error"
      ? (currentLanguage === "fr" ? "Erreur" : "禁止")
      : item.type === "warn"
        ? (currentLanguage === "fr" ? "Attention" : "注意")
        : "OK";

    return `<div class="result-item ${item.type}"><span class="result-label">${label}</span>${item.message}</div>`;
  }).join("");
}

function analyzeCounterpoint() {
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const results = [];
  lastIssues = [];

  let errorCount = 0;
  let okCount = 0;

  if (!cantus.length || !counterpoint.length) {
    renderSummary(currentLanguage === "fr" ? "Veuillez saisir les deux voix." : "定旋律と対旋律を入力してください。");
    renderResults([]);
    return;
  }

  if (cantus.length !== counterpoint.length) {
    results.push({
      type: "error",
      message: currentLanguage === "fr"
        ? `Le nombre de notes ne correspond pas. Cantus : ${cantus.length}, contrepoint : ${counterpoint.length}.`
        : `音数が一致していません。定旋律は${cantus.length}音、対旋律は${counterpoint.length}音です。`
    });
    errorCount++;
  } else {
    results.push({
      type: "ok",
      message: currentLanguage === "fr"
        ? `Le nombre de notes correspond : ${cantus.length}.`
        : `音数は一致しています。全${cantus.length}音です。`
    });
    okCount++;
  }

  const length = Math.min(cantus.length, counterpoint.length);
  const cantusMidi = [];
  const counterMidi = [];

  for (let i = 0; i < length; i++) {
    const cMidi = noteToMidi(cantus[i]);
    const cpMidi = noteToMidi(counterpoint[i]);

    cantusMidi.push(cMidi);
    counterMidi.push(cpMidi);

    if (cMidi === null || cpMidi === null) {
      addIssue(i, "counterpoint", "error", `${i + 1}音目：音名の形式が正しくありません。例：C4, F#4, Bb3`, results);
      errorCount++;
      continue;
    }

    const interval = cpMidi - cMidi;
    const intervalName = getIntervalName(interval);

    if (isConsonant(interval)) {
      results.push({ type: "ok", message: `${i + 1}音目：${cantus[i]} - ${counterpoint[i]} は ${intervalName} です。` });
      okCount++;
    } else {
      addIssue(i, "counterpoint", "error", `${i + 1}音目：${cantus[i]} - ${counterpoint[i]} は ${intervalName} です。第一種では不協和音程です。`, results);
      errorCount++;
    }
  }

  if (length > 0 && cantusMidi[0] !== null && counterMidi[0] !== null) {
    const interval = counterMidi[0] - cantusMidi[0];
    const simple = getSimpleInterval(interval);
    if ([0, 7].includes(simple)) {
      results.push({ type: "ok", message: `開始音程は ${getIntervalName(interval)} です。` });
      okCount++;
    } else {
      addIssue(0, "counterpoint", "error", `開始音程は ${getIntervalName(interval)} です。第一種では完全1度・完全5度・完全8度が基本です。`, results);
      errorCount++;
    }
  }

  if (length > 0 && cantusMidi[length - 1] !== null && counterMidi[length - 1] !== null) {
    const interval = counterMidi[length - 1] - cantusMidi[length - 1];
    if (getSimpleInterval(interval) === 0) {
      results.push({ type: "ok", message: `終止音程は ${getIntervalName(interval)} です。` });
      okCount++;
    } else {
      addIssue(length - 1, "counterpoint", "error", `終止音程は ${getIntervalName(interval)} です。第一種では完全1度または完全8度で終止するのが基本です。`, results);
      errorCount++;
    }
  }

  for (let i = 0; i < length - 1; i++) {
    const c1 = cantusMidi[i];
    const c2 = cantusMidi[i + 1];
    const cp1 = counterMidi[i];
    const cp2 = counterMidi[i + 1];

    if ([c1, c2, cp1, cp2].some((value) => value === null)) continue;

    const interval1 = cp1 - c1;
    const interval2 = cp2 - c2;
    const cDir = direction(c1, c2);
    const cpDir = direction(cp1, cp2);

    if (cDir !== 0 && cpDir !== 0 && cDir === cpDir && isPerfectFifth(interval1) && isPerfectFifth(interval2)) {
      addIssue(i + 1, "counterpoint", "error", `${i + 1}音目 → ${i + 2}音目：連続5度があります。`, results);
      errorCount++;
    }

    if (cDir !== 0 && cpDir !== 0 && cDir === cpDir && isPerfectOctaveOrUnison(interval1) && isPerfectOctaveOrUnison(interval2)) {
      addIssue(i + 1, "counterpoint", "error", `${i + 1}音目 → ${i + 2}音目：連続8度または連続1度があります。`, results);
      errorCount++;
    }
  }

  renderSummary(errorCount === 0 ? `大きな問題は見つかりませんでした。OK項目：${okCount}件` : `禁止：${errorCount}件 / OK：${okCount}件`);
  renderResults(results);
  renderScore();
}

function exportMidi() {
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const length = Math.max(cantus.length, counterpoint.length);
  if (!length) return;

  const ticksPerQuarter = 480;
  const quarter = ticksPerQuarter;
  const tempo = 66;
  const microsecondsPerQuarter = Math.round(60000000 / tempo);

  const bytes = [];

  function push(...values) { bytes.push(...values); }
  function str(text) { return [...text].map((ch) => ch.charCodeAt(0)); }
  function varLen(value) {
    let buffer = value & 0x7f;
    const out = [];
    while ((value >>= 7)) {
      buffer <<= 8;
      buffer |= ((value & 0x7f) | 0x80);
    }
    while (true) {
      out.push(buffer & 0xff);
      if (buffer & 0x80) buffer >>= 8;
      else break;
    }
    return out;
  }

  const header = [...str("MThd"), 0, 0, 0, 6, 0, 1, 0, 2, (ticksPerQuarter >> 8) & 255, ticksPerQuarter & 255];

  function makeTrack(channel, notes, voiceSet) {
    const data = [];
    function d(...values) { data.push(...values); }
    d(0, 0xff, 0x51, 0x03, (microsecondsPerQuarter >> 16) & 255, (microsecondsPerQuarter >> 8) & 255, microsecondsPerQuarter & 255);
    notes.forEach((note) => {
      const midi = noteToMidi(note);
      if (midi === null) {
        d(...varLen(quarter));
        return;
      }
      d(0, 0x90 + channel, midi, 80);
      d(...varLen(quarter), 0x80 + channel, midi, 0);
    });
    d(0, 0xff, 0x2f, 0);
    return [...str("MTrk"), (data.length >> 24) & 255, (data.length >> 16) & 255, (data.length >> 8) & 255, data.length & 255, ...data];
  }

  push(...header);
  push(...makeTrack(0, cantus, "maleSample"));
  push(...makeTrack(1, counterpoint, "femaleSample"));

  const blob = new Blob([new Uint8Array(bytes)], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "module1-first-species-counterpoint.mid";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

window.addEventListener("DOMContentLoaded", () => {
  populateExercises();

  const exerciseSelect = document.getElementById("exerciseSelect");
  if (exerciseSelect) {
    exerciseSelect.addEventListener("change", updateExerciseDescription);
  }

  const svg = document.getElementById("scoreEditor");
  if (svg) {
    svg.addEventListener("click", handleScoreClick);
  }

  document.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName?.toLowerCase();
    if (activeTag === "textarea" || activeTag === "input" || activeTag === "select") return;

    if (event.code === "Space") {
      event.preventDefault();
      togglePlayback();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveSelection(-1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveSelection(1);
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

  setLanguage("ja");
  renderScore();
});
