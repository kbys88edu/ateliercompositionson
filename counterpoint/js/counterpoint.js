const NATURAL_NOTES = [
  "C3", "D3", "E3", "F3", "G3", "A3", "B3",
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  "C6", "D6", "E6", "F6", "G6", "A6", "B6"
];

const NOTE_LETTER_STEPS = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6
};

const SVG_NS = "http://www.w3.org/2000/svg";

const SCORE = {
  width: 960,
  height: 300,
  left: 95,
  right: 45,
  staffGap: 10,
  bottomLineY: 145,
  noteStep: 5,
  playheadTop: 55,
  playheadBottom: 228
};

const I18N = {
  ja: {
    backLink: "← トップへ戻る",
    languageLabel: "言語",
    title: "第一種2声対位法チェッカー",
    lead: "五線譜をクリックして対旋律を入力します。↑で半音上行、↓で半音下行、← / → で前後の音へ移動します。スペースキーで定旋律と対旋律を同時に再生・停止できます。",
    exerciseLabel: "課題",
    levelFilterLabel: "レベル",
    levelAll: "すべて",
    levelBeginner: "初級",
    levelIntermediate: "中級",
    levelAdvanced: "上級",
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
    playbackHint: "Space：再生 / 停止　｜　← / →：前後の音へ移動",
    scoreInputTitle: "五線入力",
    scoreInputHelp: "五線をクリックして音を置きます。置いた音は青色で選択され、↑↓で半音移動、←→で前後の音へ移動できます。",
    currentInput: "現在の入力",
    cantusLabel: "定旋律：",
    counterpointLabel: "対旋律：",
    analyze: "解析する",
    analysisResult: "解析結果",
    notAnalyzed: "まだ解析していません。",
    play: "再生",
    stop: "停止",
    noInput: "未入力",
    status: (cp, cf, pos, len) => `対旋律：${cp}音 / 定旋律：${cf}音 / 再生位置：${pos}/${len}`,
    summaryOk: (ok) => `大きな問題は見つかりませんでした。OK項目：${ok}件`,
    summaryCounts: (e, w, ok) => `禁止：${e}件 / 注意：${w}件 / OK：${ok}件`,
    labelOk: "OK",
    labelWarn: "注意",
    labelError: "禁止",
    needInput: "定旋律と対旋律を入力してください。",
    lengthMismatch: (cf, cp) => `音数が一致していません。定旋律は${cf}音、対旋律は${cp}音です。`,
    lengthOk: (n) => `音数は一致しています。全${n}音です。`,
    invalidNote: (i) => `${i}音目：音名の形式が正しくありません。例：C4, F#4, Bb3`,
    intervalOk: (i, c, cp, name) => `${i}音目：${c} - ${cp} は ${name} です。`,
    intervalBad: (i, c, cp, name) => `${i}音目：${c} - ${cp} は ${name} です。第一種対位法では不協和音程です。`,
    startOk: (name) => `開始音程は ${name} です。`,
    startBad: (name) => `開始音程は ${name} です。第一種では完全1度・完全5度・完全8度で始めるのが基本です。`,
    endOk: (name) => `終止音程は ${name} です。`,
    endBad: (name) => `終止音程は ${name} です。第一種では完全1度または完全8度で終止するのが基本です。`,
    parallelFifth: (i) => `${i}音目 → ${i + 1}音目：連続5度があります。`,
    parallelOctave: (i) => `${i}音目 → ${i + 1}音目：連続8度または連続1度があります。`,
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
    title: "Correcteur de contrepoint à deux voix — première espèce",
    lead: "Cliquez sur la portée pour saisir le contrepoint. ↑ monte d’un demi-ton, ↓ descend d’un demi-ton, ← / → déplace la sélection. La barre d’espace lance ou arrête la lecture.",
    exerciseLabel: "Exercice",
    levelFilterLabel: "Niveau",
    levelAll: "Tous",
    levelBeginner: "Débutant",
    levelIntermediate: "Intermédiaire",
    levelAdvanced: "Avancé",
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
    playbackHint: "Espace : lecture / arrêt　｜　← / → : note précédente / suivante",
    scoreInputTitle: "Saisie sur portée",
    scoreInputHelp: "Cliquez sur la portée pour placer une note. La note sélectionnée apparaît en bleu. ↑↓ déplacent par demi-ton, ←→ changent de note.",
    currentInput: "Saisie actuelle",
    cantusLabel: "Cantus :",
    counterpointLabel: "Contrepoint :",
    analyze: "Analyser",
    analysisResult: "Résultat de l’analyse",
    notAnalyzed: "Pas encore analysé.",
    play: "Lecture",
    stop: "Arrêter",
    noInput: "Non saisi",
    status: (cp, cf, pos, len) => `Contrepoint : ${cp} notes / Cantus : ${cf} notes / Position : ${pos}/${len}`,
    summaryOk: (ok) => `Aucun problème majeur détecté. Éléments OK : ${ok}`,
    summaryCounts: (e, w, ok) => `Interdits : ${e} / Attention : ${w} / OK : ${ok}`,
    labelOk: "OK",
    labelWarn: "Attention",
    labelError: "Interdit",
    needInput: "Veuillez saisir le cantus et le contrepoint.",
    lengthMismatch: (cf, cp) => `Le nombre de notes ne correspond pas. Cantus : ${cf}, contrepoint : ${cp}.`,
    lengthOk: (n) => `Le nombre de notes correspond. Total : ${n}.`,
    invalidNote: (i) => `Note ${i} : format de note invalide. Exemple : C4, F#4, Bb3`,
    intervalOk: (i, c, cp, name) => `Note ${i} : ${c} - ${cp} forme ${name}.`,
    intervalBad: (i, c, cp, name) => `Note ${i} : ${c} - ${cp} forme ${name}. En première espèce, cet intervalle est dissonant.`,
    startOk: (name) => `L’intervalle initial est ${name}.`,
    startBad: (name) => `L’intervalle initial est ${name}. En première espèce, on commence normalement par l’unisson, la quinte ou l’octave.`,
    endOk: (name) => `L’intervalle final est ${name}.`,
    endBad: (name) => `L’intervalle final est ${name}. En première espèce, on termine normalement par l’unisson ou l’octave.`,
    parallelFifth: (i) => `Note ${i} → ${i + 1} : quintes parallèles.`,
    parallelOctave: (i) => `Note ${i} → ${i + 1} : octaves ou unissons parallèles.`,
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
    id: "species1-c-major-01",
    level: "beginner",
    title: { ja: "初級 01｜C major｜順次進行", fr: "Débutant 01｜Do majeur｜Mouvement conjoint" },
    description: {
      ja: "ほぼ順次進行のみの基本課題。ひとつの山を作ります。",
      fr: "Exercice fondamental, presque entièrement conjoint, avec une seule arche."
    },
    cantus: ["C4", "D4", "E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4", "C4"],
    counterpoint: []
  },
  {
    id: "species1-c-major-02",
    level: "beginner",
    title: { ja: "初級 02｜C major｜短い山型", fr: "Débutant 02｜Do majeur｜Petite arche" },
    description: {
      ja: "短めの課題。終止に向けて自然に下行します。",
      fr: "Exercice court, avec une descente naturelle vers la cadence."
    },
    cantus: ["C4", "D4", "E4", "G4", "F4", "E4", "D4", "C4"],
    counterpoint: []
  },
  {
    id: "species1-g-major-01",
    level: "beginner",
    title: { ja: "初級 03｜G major｜F#あり", fr: "Débutant 03｜Sol majeur｜Avec Fa#" },
    description: {
      ja: "G majorの基本課題。F#を含みます。",
      fr: "Exercice de base en Sol majeur, avec Fa#."
    },
    cantus: ["G3", "A3", "B3", "C4", "D4", "E4", "D4", "C4", "B3", "A3", "G3"],
    counterpoint: []
  },
  {
    id: "species1-f-major-01",
    level: "beginner",
    title: { ja: "初級 04｜F major｜Bbあり", fr: "Débutant 04｜Fa majeur｜Avec Sib" },
    description: {
      ja: "F majorの基本課題。Bbを含みます。",
      fr: "Exercice de base en Fa majeur, avec Sib."
    },
    cantus: ["F3", "G3", "A3", "Bb3", "C4", "D4", "C4", "Bb3", "A3", "G3", "F3"],
    counterpoint: []
  },
  {
    id: "species1-c-major-03",
    level: "intermediate",
    title: { ja: "中級 01｜C major｜3度跳躍", fr: "Intermédiaire 01｜Do majeur｜Sauts de tierce" },
    description: {
      ja: "3度跳躍を含む課題。跳躍後の反対方向への回復を確認します。",
      fr: "Inclut des sauts de tierce, compensés par un mouvement contraire."
    },
    cantus: ["C4", "E4", "D4", "F4", "G4", "A4", "G4", "E4", "F4", "D4", "C4"],
    counterpoint: []
  },
  {
    id: "species1-c-major-04",
    level: "intermediate",
    title: { ja: "中級 02｜C major｜低音域", fr: "Intermédiaire 02｜Do majeur｜Registre grave" },
    description: {
      ja: "低めの音域から始まる課題。音域のバランスに注意します。",
      fr: "Commence dans un registre plus grave. Travail sur l’équilibre de tessiture."
    },
    cantus: ["C3", "D3", "F3", "E3", "G3", "A3", "G3", "F3", "E3", "D3", "C3"],
    counterpoint: []
  },
  {
    id: "species1-a-minor-01",
    level: "intermediate",
    title: { ja: "中級 03｜A minor｜自然短音階", fr: "Intermédiaire 03｜La mineur｜Mineur naturel" },
    description: {
      ja: "自然短音階に近い短調課題です。終止音程に注意してください。",
      fr: "Exercice en mineur naturel. Attention à l’intervalle final."
    },
    cantus: ["A3", "B3", "C4", "D4", "E4", "F4", "E4", "D4", "C4", "B3", "A3"],
    counterpoint: []
  },
  {
    id: "species1-d-minor-01",
    level: "intermediate",
    title: { ja: "中級 04｜D minor｜Bbあり", fr: "Intermédiaire 04｜Ré mineur｜Avec Sib" },
    description: {
      ja: "D minorの課題。Bbを含み、旋法的な短調の練習になります。",
      fr: "Exercice en Ré mineur, avec Sib, proche d’un traitement modal."
    },
    cantus: ["D4", "E4", "F4", "G4", "A4", "Bb4", "A4", "G4", "F4", "E4", "D4"],
    counterpoint: []
  },
  {
    id: "species1-c-major-05",
    level: "advanced",
    title: { ja: "上級 01｜C major｜長めの旋律", fr: "Avancé 01｜Do majeur｜Mélodie plus longue" },
    description: {
      ja: "少し長めの課題。全体の方向性と頂点の扱いを意識します。",
      fr: "Exercice plus long. Travail sur la direction globale et le sommet mélodique."
    },
    cantus: ["C4", "D4", "E4", "G4", "F4", "A4", "G4", "E4", "F4", "D4", "E4", "D4", "C4"],
    counterpoint: []
  },
  {
    id: "species1-g-major-02",
    level: "advanced",
    title: { ja: "上級 02｜G major｜跳躍と回復", fr: "Avancé 02｜Sol majeur｜Sauts et compensations" },
    description: {
      ja: "跳躍と順次進行のバランスを取る課題です。",
      fr: "Exercice sur l’équilibre entre sauts et mouvements conjoints."
    },
    cantus: ["G3", "B3", "A3", "C4", "D4", "E4", "D4", "B3", "C4", "A3", "B3", "A3", "G3"],
    counterpoint: []
  },
  {
    id: "species1-f-major-02",
    level: "advanced",
    title: { ja: "上級 03｜F major｜広めの音域", fr: "Avancé 03｜Fa majeur｜Tessiture élargie" },
    description: {
      ja: "やや広い音域を使う課題。対旋律の音域管理が難しくなります。",
      fr: "Tessiture un peu plus large. Le contrôle de la seconde voix devient plus difficile."
    },
    cantus: ["F3", "A3", "G3", "Bb3", "C4", "D4", "F4", "E4", "D4", "C4", "Bb3", "G3", "F3"],
    counterpoint: []
  },
  {
    id: "species1-d-minor-02",
    level: "advanced",
    title: { ja: "上級 04｜D minor｜短調・長め", fr: "Avancé 04｜Ré mineur｜Mineur plus long" },
    description: {
      ja: "短調で長めの課題。終止と不協和音程の回避を丁寧に確認します。",
      fr: "Exercice plus long en mineur. Vérifiez soigneusement la cadence et les dissonances."
    },
    cantus: ["D4", "F4", "E4", "G4", "A4", "Bb4", "A4", "F4", "G4", "E4", "F4", "E4", "D4"],
    counterpoint: []
  },
  {
    id: "species1-example-filled",
    level: "beginner",
    title: { ja: "入力例つき", fr: "Exemple rempli" },
    description: {
      ja: "動作確認用。対旋律があらかじめ入っています。",
      fr: "Exemple de démonstration avec un contrepoint déjà saisi."
    },
    cantus: ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4"],
    counterpoint: ["G4", "F4", "G4", "A4", "Bb4", "A4", "G4", "F4", "C5"]
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

function playMidiNote(midi, duration = 0.35, gainScale = 1) {
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

function playNoteName(note, duration = 0.35, gainScale = 1) {
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

  playNoteName(note, 0.55, 1);
}

function previewTimbre() {
  const counterpoint = getNotesFromTextarea("counterpoint");
  const cantus = getNotesFromTextarea("cantus");
  const note = counterpoint[selectedIndex] || cantus[selectedIndex] || "C4";
  playNoteName(note, 0.5, 1);
}

function getTempo() {
  const input = document.getElementById("tempoInput");
  const raw = input ? parseInt(input.value, 10) : 72;

  if (Number.isNaN(raw)) return 72;

  return Math.min(180, Math.max(40, raw));
}

function getStepDurationSeconds() {
  return 60 / getTempo();
}

function getPlaybackLength() {
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");

  return Math.max(cantus.length, counterpoint.length, 0);
}

function playVerticalSonority(index) {
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const mode = getPlaybackMode();

  const stepDuration = getStepDurationSeconds();
  const noteDuration = Math.max(0.28, stepDuration * 0.95);

  const cantusNote = cantus[index];
  const counterpointNote = counterpoint[index];

  if ((mode === "both" || mode === "cantus") && cantusNote) {
    playNoteName(cantusNote, noteDuration, mode === "cantus" ? 1 : 0.72);
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
  if (isPlaying) {
    stopPlayback(false);
  } else {
    startPlayback();
  }
}

function startPlayback() {
  const length = getPlaybackLength();

  if (!length) return;

  if (playbackIndex >= length) {
    playbackIndex = 0;
  }

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

  selectedIndex = playbackIndex;
  renderScore();
  playVerticalSonority(playbackIndex);

  const stepMs = getStepDurationSeconds() * 1000;

  playbackTimerId = window.setTimeout(() => {
    playbackIndex += 1;

    if (playbackIndex >= length) {
      isPlaying = false;
      playbackIndex = 0;
      selectedIndex = 0;
      playbackTimerId = null;
      updatePlayPauseButton();
      renderScore();
      return;
    }

    playCurrentStep();
  }, stepMs);
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
  const counterpoint = getNotesFromTextarea("counterpoint");

  const cantusDisplay = document.getElementById("cantusDisplay");
  const counterpointDisplay = document.getElementById("counterpointDisplay");
  const scoreStatus = document.getElementById("scoreStatus");

  if (cantusDisplay) {
    cantusDisplay.textContent = cantus.join(" ");
  }

  if (counterpointDisplay) {
    counterpointDisplay.textContent = counterpoint.length
      ? counterpoint.join(" ")
      : t("noInput");
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

  resultBox.innerHTML = results
    .map((item) => {
      let label = t("labelOk");
      if (item.type === "warn") label = t("labelWarn");
      if (item.type === "error") label = t("labelError");

      return `
        <div class="result-item ${item.type}">
          <span class="result-label">${label}</span>
          ${item.message}
        </div>
      `;
    })
    .join("");
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

  if (cantus.length === 0 || counterpoint.length === 0) {
    addResult(results, "error", t("needInput"));
    renderSummary(1, 0, 0);
    renderResults(results);
    renderScore();
    return;
  }

  if (cantus.length !== counterpoint.length) {
    addResult(results, "error", t("lengthMismatch")(cantus.length, counterpoint.length));
    errorCount++;
  } else {
    addResult(results, "ok", t("lengthOk")(cantus.length));
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
      addResult(results, "error", t("invalidNote")(i + 1));
      analysisIssues.push({ voice: "counterpoint", index: i, type: "error" });
      errorCount++;
      continue;
    }

    const interval = cpMidi - cMidi;
    const intervalName = getIntervalName(interval);

    if (isConsonant(interval)) {
      addResult(results, "ok", t("intervalOk")(i + 1, cantus[i], counterpoint[i], intervalName));
      okCount++;
    } else {
      addResult(results, "error", t("intervalBad")(i + 1, cantus[i], counterpoint[i], intervalName));
      errorCount++;
    }
  }

  if (length > 0 && cantusMidi[0] !== null && counterMidi[0] !== null) {
    const firstInterval = counterMidi[0] - cantusMidi[0];

    if (
      Math.abs(firstInterval) === 0 ||
      getSimpleInterval(firstInterval) === 7 ||
      getSimpleInterval(firstInterval) === 0
    ) {
      addResult(results, "ok", t("startOk")(getIntervalName(firstInterval)));
      okCount++;
    } else {
      addResult(results, "error", t("startBad")(getIntervalName(firstInterval)));
      errorCount++;
    }
  }

  if (length > 0 && cantusMidi[length - 1] !== null && counterMidi[length - 1] !== null) {
    const lastInterval = counterMidi[length - 1] - cantusMidi[length - 1];

    if (Math.abs(lastInterval) === 0 || getSimpleInterval(lastInterval) === 0) {
      addResult(results, "ok", t("endOk")(getIntervalName(lastInterval)));
      okCount++;
    } else {
      addResult(results, "error", t("endBad")(getIntervalName(lastInterval)));
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

    const bothMove = cDir !== 0 && cpDir !== 0;
    const sameDirection = cDir === cpDir;

    if (bothMove && sameDirection && isPerfectFifth(interval1) && isPerfectFifth(interval2)) {
      addResult(results, "error", t("parallelFifth")(i + 1));
      errorCount++;
    }

    if (bothMove && sameDirection && isPerfectOctaveOrUnison(interval1) && isPerfectOctaveOrUnison(interval2)) {
      addResult(results, "error", t("parallelOctave")(i + 1));
      errorCount++;
    }
  }

  renderSummary(errorCount, warnCount, okCount);
  renderResults(results);
  renderScore();
}

function createSvgElement(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);

  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });

  return el;
}

function clearSvg(svg) {
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }
}

function noteToY(note) {
  const noteStep = getDiatonicStep(note);
  const e4Step = getDiatonicStep("E4");

  if (noteStep === null || e4Step === null) return null;

  return SCORE.bottomLineY - (noteStep - e4Step) * SCORE.noteStep;
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

/* Editing selection must not move playbackIndex. */
function moveSelectedNote(semitone) {
  if (isPlaying) return;

  const cantus = getNotesFromTextarea("cantus");
  let counterpoint = getNotesFromTextarea("counterpoint");

  if (!cantus.length) return;

  const noteCount = cantus.length;

  while (counterpoint.length < noteCount) {
    counterpoint.push("");
  }

  if (selectedIndex < 0) selectedIndex = 0;
  if (selectedIndex >= noteCount) selectedIndex = noteCount - 1;

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

/* Left/right changes selectedIndex only. The red playhead stays at playbackIndex. */
function moveSelection(delta) {
  if (isPlaying) return;

  const length = getPlaybackLength();

  if (!length) return;

  selectedIndex += delta;

  if (selectedIndex < 0) selectedIndex = length - 1;
  if (selectedIndex >= length) selectedIndex = 0;

  renderScore();

  const counterpoint = getNotesFromTextarea("counterpoint");
  const note = counterpoint[selectedIndex];

  if (note) {
    playNoteName(note, 0.35, 0.8);
  }
}

function deleteSelectedNote() {
  if (isPlaying) return;

  const cantus = getNotesFromTextarea("cantus");
  let counterpoint = getNotesFromTextarea("counterpoint");

  if (!cantus.length) return;

  while (counterpoint.length < cantus.length) {
    counterpoint.push("");
  }

  counterpoint[selectedIndex] = "";
  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
}

function drawStaff(svg, noteCount) {
  const startX = SCORE.left - 30;
  const endX = SCORE.width - SCORE.right + 10;

  for (let i = 0; i < 5; i++) {
    const y = SCORE.bottomLineY - i * SCORE.staffGap;
    svg.appendChild(createSvgElement("line", { x1: startX, y1: y, x2: endX, y2: y, class: "staff-line" }));
  }

  svg.appendChild(createSvgElement("text", { x: 22, y: SCORE.bottomLineY - 25, class: "voice-label" })).textContent = "Counterpoint";
  svg.appendChild(createSvgElement("text", { x: 22, y: SCORE.bottomLineY + 58, class: "voice-label" })).textContent = "Cantus";

  const positions = getScorePositions(noteCount);

  positions.forEach((x, i) => {
    svg.appendChild(createSvgElement("circle", { cx: x, cy: SCORE.bottomLineY + 65, r: 2.8, class: "slot-marker" }));
    svg.appendChild(createSvgElement("text", { x: x - 4, y: SCORE.bottomLineY + 92, class: "note-label" })).textContent = i + 1;

    if (i > 0) {
      const midX = (positions[i - 1] + x) / 2;
      svg.appendChild(createSvgElement("line", {
        x1: midX,
        y1: SCORE.bottomLineY - 52,
        x2: midX,
        y2: SCORE.bottomLineY + 78,
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

function drawLedgerLines(svg, x, y) {
  const topLineY = SCORE.bottomLineY - 4 * SCORE.staffGap;
  const bottomLineY = SCORE.bottomLineY;

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

function drawAccidental(svg, parsed, x, y, isCantus, isSelected, isCurrentPlayback, issueClass = "") {
  if (!parsed.accidental) return;
  const symbol = parsed.accidental === "#" ? "♯" : "♭";

  svg.appendChild(createSvgElement("text", {
    x: x - 30,
    y: y + 1,
    class: `accidental${isCantus ? " cantus" : ""}${isSelected ? " selected" : ""}${isCurrentPlayback ? " playing" : ""}${issueClass ? " " + issueClass : ""}`
  })).textContent = symbol;
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

function drawNote(svg, note, x, voice, index, bottomLineY) {
  const y = noteToY(note, bottomLineY);
  const parsed = parseNote(note);
  if (y === null || !parsed) return;

  const isCantus = voice === "cantus";
  const isSelected = !isCantus && index === selectedIndex && !isPlaying;
  const isCurrentPlayback = index === playbackIndex && isPlaying;
  const issueClass = getIssueClass(voice, index);

  drawLedgerLines(svg, x, y, bottomLineY);
  drawIssueRing(svg, x, y, issueClass);
  drawAccidental(svg, parsed, x, y, isCantus, isSelected, isCurrentPlayback, issueClass);

  svg.appendChild(createSvgElement("ellipse", {
    cx: x,
    cy: y,
    rx: 8.5,
    ry: 5.8,
    transform: `rotate(-18 ${x} ${y})`,
    class: [
      "note-head",
      isCantus ? "cantus" : "",
      isCurrentPlayback ? "playing" : "",
      isSelected ? "selected" : "",
      issueClass
    ].filter(Boolean).join(" ")
  }));

  svg.appendChild(createSvgElement("line", {
    x1: isCantus ? x - 7 : x + 7,
    y1: y,
    x2: isCantus ? x - 7 : x + 7,
    y2: isCantus ? y + 34 : y - 34,
    class: [
      "note-stem",
      isCantus ? "cantus" : "",
      isCurrentPlayback ? "playing" : "",
      isSelected ? "selected" : "",
      issueClass
    ].filter(Boolean).join(" ")
  }));

  svg.appendChild(createSvgElement("text", {
    x: x - 12,
    y: isCantus ? bottomLineY + 48 : bottomLineY - 62,
    class: [
      "note-label",
      isCurrentPlayback ? "playing" : "",
      isSelected ? "selected" : "",
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
  const noteCount = Math.max(cantus.length, counterpoint.length, 1);
  const positions = getScorePositions(noteCount);

  if (selectedIndex >= noteCount) selectedIndex = noteCount - 1;
  if (selectedIndex < 0) selectedIndex = 0;
  if (playbackIndex >= noteCount) playbackIndex = 0;
  if (playbackIndex < 0) playbackIndex = 0;

  drawStaff(svg, noteCount);
  drawPlayhead(svg, positions, noteCount);

  cantus.forEach((note, i) => drawNote(svg, note, positions[i], "cantus", i));

  counterpoint.forEach((note, i) => {
    if (note) {
      drawNote(svg, note, positions[i], "counterpoint", i);
    }
  });

  updateDisplays();
}

/* Clicking edits/selects a note only. It does not move the red playhead. */
function handleScoreClick(event) {
  if (isPlaying) return;

  const svg = document.getElementById("scoreEditor");
  if (!svg) return;

  const rect = svg.getBoundingClientRect();

  const viewX = ((event.clientX - rect.left) / rect.width) * SCORE.width;
  const viewY = ((event.clientY - rect.top) / rect.height) * SCORE.height;

  const cantus = getNotesFromTextarea("cantus");
  let counterpoint = getNotesFromTextarea("counterpoint");

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

  const clickedNote = yToNaturalNote(viewY);

  while (counterpoint.length < noteCount) {
    counterpoint.push("");
  }

  selectedIndex = nearestIndex;
  counterpoint[nearestIndex] = clickedNote;

  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
  playNoteName(clickedNote, 0.55, 1);

  svg.focus();
}

function undoCounterpointNote() {
  if (isPlaying) return;

  const counterpoint = getNotesFromTextarea("counterpoint");
  counterpoint.pop();

  if (selectedIndex >= counterpoint.length) selectedIndex = Math.max(0, counterpoint.length - 1);
  if (playbackIndex >= counterpoint.length) playbackIndex = Math.max(0, counterpoint.length - 1);

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

  const filteredExercises = EXERCISES.filter((exercise) => {
    return selectedLevel === "all" || exercise.level === selectedLevel;
  });

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
    select.value = "species1-example-filled";
    updateExerciseDescription();
  }

  loadSelectedExercise();
}

window.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("scoreEditor");

  if (svg) {
    svg.addEventListener("click", handleScoreClick);
  }

  document.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName?.toLowerCase();
    const isTextInput = activeTag === "textarea" || activeTag === "input" || activeTag === "select";

    if (event.code === "Space") {
      event.preventDefault();
      togglePlayback();
      return;
    }

    if (isTextInput) {
      return;
    }

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
  if (exerciseSelect) {
    exerciseSelect.addEventListener("change", updateExerciseDescription);
  }

  const levelFilterSelect = document.getElementById("levelFilterSelect");
  if (levelFilterSelect) {
    levelFilterSelect.addEventListener("change", () => populateExerciseSelect(false));
  }

  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) {
    languageSelect.value = currentLanguage;
  }

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

