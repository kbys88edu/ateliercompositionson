const NATURAL_NOTES = [
  "C3", "D3", "E3", "F3", "G3", "A3", "B3",
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  "C6", "D6", "E6", "F6", "G6", "A6", "B6"
];

const NOTE_LETTER_STEPS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const SVG_NS = "http://www.w3.org/2000/svg";

const SCORE = {
  width: 1280,
  height: 360,
  left: 105,
  right: 55,
  staffGap: 10,
  noteStep: 5,
  bottomLineY: 145,
  cantusBottomLineY: 260,
  playheadTop: 55,
  playheadBottom: 308,
  quartersPerCantus: 4
};

const I18N = {
  ja: {
    backLink: "← トップへ戻る",
    languageLabel: "言語",
    title: "Module 3｜2声4分音符対位法チェッカー",
    lead: "ヘ音記号の全音符の定旋律1音に対して、ト音記号の対旋律を4分音符4つで入力します。タイでつながれた音は扱いません。五線譜をクリックして音を置き、↑↓で半音移動、←→で前後の4分音符へ移動できます。",
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
    playbackHint: "Space：再生 / 停止　｜　← / →：前後の4分音符へ移動",
    scoreInputTitle: "五線入力",
    scoreInputHelp: "上段はト音記号の4分音符対旋律、下段はヘ音記号の全音符定旋律です。タイ入力はありません。",
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
    needInput: "定旋律と4分音符の対旋律を入力してください。",
    lengthMismatch: (need, got) => `音数が一致していません。必要な4分音符は${need}音、現在は${got}音です。`,
    lengthOk: (n) => `4分音符の数は一致しています。全${n}音です。`,
    invalidNote: (i) => `${i}番目の4分音符：音名の形式が正しくありません。例：C4, F#4, Bb3`,
    downbeatOk: (m, name) => `小節${m}の拍頭：定旋律との音程は ${name} です。`,
    downbeatBad: (m, name) => `小節${m}の拍頭：定旋律との音程は ${name} です。拍頭では協和音程が必要です。`,
    offbeatOk: (q, name) => `${q}番目の4分音符：${name}。協和音程です。`,
    passingOk: (q, name) => `${q}番目の4分音符：${name}。順次進行による経過的な不協和として扱えます。`,
    neighborOk: (q, name) => `${q}番目の4分音符：${name}。補助音的な不協和として扱えます。`,
    offbeatBad: (q, name) => `${q}番目の4分音符：${name}。弱拍の不協和ですが、順次進行による経過音・補助音として説明しにくい形です。`,
    parallelFifth: (a, b) => `${a}番目 → ${b}番目：連続5度があります。`,
    parallelOctave: (a, b) => `${a}番目 → ${b}番目：連続8度または連続1度があります。`,
    noTies: "このモジュールではタイでつながれた音は入力しません。すべて独立した4分音符として扱います。",
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
    title: "Module 3 — Contrepoint à deux voix en noires",
    lead: "Pour chaque ronde du cantus en clé de fa, saisissez quatre noires dans le contrepoint en clé de sol. Ce module n’utilise pas de notes liées. Cliquez sur la portée pour placer une note, ↑↓ déplacent par demi-ton, ←→ changent de noire.",
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
    playbackHint: "Espace : lecture / arrêt　｜　← / → : noire précédente / suivante",
    scoreInputTitle: "Saisie sur portée",
    scoreInputHelp: "La portée supérieure montre le contrepoint en noires en clé de sol ; la portée inférieure montre le cantus en rondes en clé de fa. Il n’y a pas de liaison.",
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
    needInput: "Veuillez saisir le cantus et le contrepoint en noires.",
    lengthMismatch: (need, got) => `Le nombre de noires ne correspond pas. Requis : ${need}, saisi : ${got}.`,
    lengthOk: (n) => `Le nombre de noires correspond. Total : ${n}.`,
    invalidNote: (i) => `Noire ${i} : format de note invalide. Exemple : C4, F#4, Bb3`,
    downbeatOk: (m, name) => `Mesure ${m}, temps fort : l’intervalle avec le cantus est ${name}.`,
    downbeatBad: (m, name) => `Mesure ${m}, temps fort : l’intervalle avec le cantus est ${name}. Sur le temps fort, une consonance est requise.`,
    offbeatOk: (q, name) => `Noire ${q} : ${name}. Intervalle consonant.`,
    passingOk: (q, name) => `Noire ${q} : ${name}. Dissonance acceptable comme note de passage conjointe.`,
    neighborOk: (q, name) => `Noire ${q} : ${name}. Dissonance acceptable comme note auxiliaire.`,
    offbeatBad: (q, name) => `Noire ${q} : ${name}. Dissonance faible, mais elle n’est pas clairement justifiée par mouvement conjoint.`,
    parallelFifth: (a, b) => `Noire ${a} → ${b} : quintes parallèles.`,
    parallelOctave: (a, b) => `Noire ${a} → ${b} : octaves ou unissons parallèles.`,
    noTies: "Ce module n’utilise pas de notes liées : chaque note est traitée comme une noire indépendante.",
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
    id: "module3-c-major-01",
    level: "beginner",
    title: { ja: "初級 01｜C major｜順次進行", fr: "Débutant 01｜Do majeur｜Mouvement conjoint" },
    description: {
      ja: "全音符の定旋律1音につき4つの4分音符を置く基本課題です。",
      fr: "Exercice de base : quatre noires de contrepoint pour chaque note du cantus."
    },
    cantus: ["C4", "D4", "E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4", "C4"],
    counterpoint: []
  },
  {
    id: "module3-g-major-01",
    level: "beginner",
    title: { ja: "初級 02｜G major｜F#あり", fr: "Débutant 02｜Sol majeur｜Avec Fa#" },
    description: {
      ja: "G majorの4分音符対位法課題です。",
      fr: "Exercice en Sol majeur pour le contrepoint en noires."
    },
    cantus: ["G3", "A3", "B3", "C4", "D4", "E4", "D4", "C4", "B3", "A3", "G3"],
    counterpoint: []
  },
  {
    id: "module3-f-major-01",
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
    id: "module3-d-minor-01",
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
    id: "module3-example-filled",
    level: "beginner",
    title: { ja: "入力例つき", fr: "Exemple rempli" },
    description: {
      ja: "動作確認用。4分音符の対旋律が入っています。",
      fr: "Exemple de démonstration avec un contrepoint en noires."
    },
    cantus: ["C4", "D4", "E4", "F4"],
    counterpoint: [
      "G4", "A4", "G4", "E4",
      "F4", "G4", "A4", "F4",
      "G4", "A4", "B4", "G4",
      "A4", "G4", "F4", "C5"
    ]
  }
];

let currentLanguage = "ja";
let selectedIndex = 0;
let playbackIndex = 0;
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

function playMidiNote(midi, duration = 0.38, gainScale = 1) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const config = getTimbreConfig();
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

function playNoteName(note, duration = 0.38, gainScale = 1) {
  const midi = noteToMidi(note);
  if (midi === null) return;
  playMidiNote(midi, duration, gainScale);
}

function getPlaybackMode() {
  const select = document.getElementById("playbackModeSelect");
  return select ? select.value : "both";
}

function playSelectedNote() {
  const counterpoint = getNotesFromTextarea("counterpoint");
  const note = counterpoint[selectedIndex];
  if (!note) return;
  playNoteName(note, 0.45, 1);
}

function previewTimbre() {
  const counterpoint = getNotesFromTextarea("counterpoint");
  const cantus = getNotesFromTextarea("cantus");
  const note = counterpoint[selectedIndex] || cantus[Math.floor(selectedIndex / 4)] || "C4";
  playNoteName(note, 0.5, 1);
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

function getRequiredQuarterCount() {
  return getNotesFromTextarea("cantus").length * SCORE.quartersPerCantus;
}

function getPlaybackLength() {
  return Math.max(getRequiredQuarterCount(), getNotesFromTextarea("counterpoint").length, 0);
}

function playVerticalSonority(index) {
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const mode = getPlaybackMode();

  const qDuration = getStepDurationSeconds();
  const noteDuration = Math.max(0.18, qDuration * 0.86);
  const cantusIndex = Math.floor(index / SCORE.quartersPerCantus);

  const cantusNote = cantus[cantusIndex];
  const counterpointNote = counterpoint[index];

  if ((mode === "both" || mode === "cantus") && cantusNote) {
    const cantusDuration = index % SCORE.quartersPerCantus === 0 ? Math.max(0.5, qDuration * 3.85) : noteDuration;
    if (mode === "cantus" || index % SCORE.quartersPerCantus === 0) {
      playNoteName(cantusNote, cantusDuration, mode === "cantus" ? 1 : 0.62);
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
      errorCount++;
    }

    if (cDir !== 0 && cDir === cpDir && isPerfectOctaveOrUnison(interval1) && isPerfectOctaveOrUnison(interval2)) {
      addResult(results, "error", t("parallelOctave")(i + 1, i + 2));
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
  const e4Step = getDiatonicStep("E4");
  if (noteStep === null || e4Step === null) return null;
  return bottomLineY - (noteStep - e4Step) * SCORE.noteStep;
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

  const required = getRequiredQuarterCount();
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
  playNoteName(counterpoint[selectedIndex], 0.45, 1);
}

function moveSelection(delta) {
  if (isPlaying) return;

  const length = getRequiredQuarterCount();
  if (!length) return;

  selectedIndex += delta;
  if (selectedIndex < 0) selectedIndex = length - 1;
  if (selectedIndex >= length) selectedIndex = 0;

  renderScore();

  const note = getNotesFromTextarea("counterpoint")[selectedIndex];
  if (note) playNoteName(note, 0.35, 0.8);
}

function deleteSelectedNote() {
  if (isPlaying) return;

  const required = getRequiredQuarterCount();
  let counterpoint = getNotesFromTextarea("counterpoint");
  if (!required) return;

  while (counterpoint.length < required) counterpoint.push("");
  counterpoint[selectedIndex] = "";
  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
}

function drawClef(svg, bottomLineY, clefType) {
  const clef = clefType === "bass" ? "𝄢" : "𝄞";
  const className = clefType === "bass" ? "clef-symbol bass" : "clef-symbol treble";
  const y = bottomLineY - 20;

  svg.appendChild(createSvgElement("text", {
    x: 52,
    y,
    class: className
  })).textContent = clef;
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
    const isDownbeat = i % SCORE.quartersPerCantus === 0;

    svg.appendChild(createSvgElement("circle", {
      cx: x,
      cy: bottomLineY + 56,
      r: isDownbeat ? 3.4 : 2.2,
      class: isDownbeat ? "downbeat-marker" : "slot-marker"
    }));

    if (bottomLineY === SCORE.cantusBottomLineY && isDownbeat) {
      svg.appendChild(createSvgElement("text", {
        x: x - 4,
        y: bottomLineY + 82,
        class: "note-label"
      })).textContent = Math.floor(i / SCORE.quartersPerCantus) + 1;
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

function drawAccidental(svg, parsed, x, y, isCantus, isSelected, isCurrentPlayback) {
  if (!parsed.accidental) return;
  const symbol = parsed.accidental === "#" ? "♯" : "♭";

  svg.appendChild(createSvgElement("text", {
    x: x - 30,
    y: y + 1,
    class: `accidental${isCantus ? " cantus" : ""}${isSelected ? " selected" : ""}${isCurrentPlayback ? " playing" : ""}`
  })).textContent = symbol;
}

function drawQuarterFlag(svg, x, y, isSelected, isCurrentPlayback) {
  // Module 3 uses quarter notes. Quarter notes have no flag.
  return;
}

function drawNote(svg, note, x, voice, index, bottomLineY, duration = "quarter") {
  const y = noteToY(note, bottomLineY);
  const parsed = parseNote(note);
  if (y === null || !parsed) return;

  const isCantus = voice === "cantus";
  const isSelected = !isCantus && index === selectedIndex && !isPlaying;
  const isCurrentPlayback = index === playbackIndex && isPlaying;

  drawLedgerLines(svg, x, y, bottomLineY);
  drawAccidental(svg, parsed, x, y, isCantus, isSelected, isCurrentPlayback);

  if (isCantus) {
    // Whole note: open notehead, no stem.
    svg.appendChild(createSvgElement("ellipse", {
      cx: x,
      cy: y,
      rx: 8.8,
      ry: 5.8,
      transform: `rotate(-18 ${x} ${y})`,
      class: isCurrentPlayback ? "note-head open cantus playing" : "note-head open cantus"
    }));
  } else {
    // Quarter note: filled notehead + stem only. No flag.
    svg.appendChild(createSvgElement("ellipse", {
      cx: x,
      cy: y,
      rx: 8.5,
      ry: 5.8,
      transform: `rotate(-18 ${x} ${y})`,
      class: isCurrentPlayback ? "note-head playing" : isSelected ? "note-head selected" : "note-head"
    }));

    svg.appendChild(createSvgElement("line", {
      x1: x + 7,
      y1: y,
      x2: x + 7,
      y2: y - 34,
      class: isCurrentPlayback ? "note-stem playing" : isSelected ? "note-stem selected" : "note-stem"
    }));
  }

  svg.appendChild(createSvgElement("text", {
    x: x - 12,
    y: isCantus ? bottomLineY + 48 : bottomLineY - 62,
    class: isCurrentPlayback ? "note-label playing" : isSelected ? "note-label selected" : "note-label"
  })).textContent = note;
}

function renderScore() {
  const svg = document.getElementById("scoreEditor");
  if (!svg) return;

  clearSvg(svg);

  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const quarterCount = Math.max(cantus.length * SCORE.quartersPerCantus, counterpoint.length, 1);
  const positions = getScorePositions(quarterCount);

  if (selectedIndex >= quarterCount) selectedIndex = quarterCount - 1;
  if (selectedIndex < 0) selectedIndex = 0;
  if (playbackIndex >= quarterCount) playbackIndex = 0;
  if (playbackIndex < 0) playbackIndex = 0;

  drawStaff(svg, SCORE.bottomLineY, "Counterpoint / quarter notes / treble clef", quarterCount, "treble");
  drawStaff(svg, SCORE.cantusBottomLineY, "Cantus / whole notes / bass clef", quarterCount, "bass");
  drawPlayhead(svg, positions, quarterCount);

  counterpoint.forEach((note, i) => {
    if (note) drawNote(svg, note, positions[i], "counterpoint", i, SCORE.bottomLineY, "quarter");
  });

  cantus.forEach((note, i) => {
    const x = positions[i * SCORE.quartersPerCantus];
    if (note && x !== undefined) drawNote(svg, note, x, "cantus", i * SCORE.quartersPerCantus, SCORE.cantusBottomLineY, "whole");
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

  if (viewY > (SCORE.bottomLineY + SCORE.cantusBottomLineY) / 2) {
    return;
  }

  const required = getRequiredQuarterCount();
  let counterpoint = getNotesFromTextarea("counterpoint");
  const positions = getScorePositions(Math.max(required, 1));

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
  while (counterpoint.length < required) counterpoint.push("");

  selectedIndex = nearestIndex;
  counterpoint[nearestIndex] = clickedNote;

  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
  playNoteName(clickedNote, 0.45, 1);

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
    select.value = "module3-example-filled";
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
