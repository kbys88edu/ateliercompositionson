const NATURAL_NOTES = [
  "C3", "D3", "E3", "F3", "G3", "A3", "B3",
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  "C6", "D6", "E6", "F6", "G6", "A6", "B6"
];

const NOTE_LETTER_STEPS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const SVG_NS = "http://www.w3.org/2000/svg";

const NOTATION_IMAGE_BASE = "images/notation/";
const NOTATION_IMAGES = {
  staff: `${NOTATION_IMAGE_BASE}staff-5lines.png`,
  trebleClef: `${NOTATION_IMAGE_BASE}treble-clef.png`,
  bassClef: `${NOTATION_IMAGE_BASE}bass-clef.png`,
  halfNoteUp: `${NOTATION_IMAGE_BASE}half-note-up.png`,
  halfNoteDown: `${NOTATION_IMAGE_BASE}half-note-down.png`,
  wholeNote: `${NOTATION_IMAGE_BASE}whole-note.png`,
  sharp: `${NOTATION_IMAGE_BASE}sharp.png`,
  flat: `${NOTATION_IMAGE_BASE}flat.png`,
  natural: `${NOTATION_IMAGE_BASE}natural.png`
};

function createSvgImage(href, x, y, width, height, className = "", preserveAspectRatio = "xMidYMid meet") {
  const image = createSvgElement("image", {
    href,
    x,
    y,
    width,
    height,
    class: className,
    preserveAspectRatio
  });
  image.setAttributeNS("http://www.w3.org/1999/xlink", "href", href);
  return image;
}


const SCORE = {
  width: 1240,
  height: 440,
  left: 124,
  right: 60,
  staffGap: 14,
  noteStep: 7,
  bottomLineY: 177,
  cantusBottomLineY: 326,
  playheadTop: 72,
  playheadBottom: 376,
  halfsPerCantus: 2
};

const I18N = {
  ja: {
    backLink: "← トップへ戻る",
    languageLabel: "言語",
    title: "Module 2.5｜タイ付きリズム対位法チェッカー",
    lead: "全音符の定旋律に対して、対旋律を二分音符とタイで入力します。Tキーまたはボタンで、選択音から次の音へタイを付けられます。",
    levelFilterLabel: "レベル",
    levelAll: "すべて",
    levelBeginner: "初級",
    levelIntermediate: "中級",
    levelAdvanced: "上級",
    exerciseLabel: "課題",
    loadExercise: "課題を読み込む",
    loadExample: "例題を読み込む",
    toggleTie: "タイを切り替え",
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
    playbackHint: "Space：再生 / 停止　｜　← / →：前後の二分音符へ移動　｜　T：タイ切り替え",
    scoreInputTitle: "五線入力",
    scoreInputHelp: "上段に二分音符とタイを使った対旋律、下段に全音符の定旋律を表示します。",
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
    status: (cp, cf, pos, len) => `対旋律：${cp}音 / 必要：${Math.max(1, (cf - 1) * 2 + 1)}音 / 再生位置：${pos}/${len}`,
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
    noTies: "タイでつながれた音は、同じ高さの持続音として扱います。",
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
    title: "Module 2.5 — Contrepoint rythmique avec liaisons",
    lead: "Saisissez un contrepoint en blanches avec liaisons. La touche T ou le bouton ajoutent une liaison vers la note suivante.",
    levelFilterLabel: "Niveau",
    levelAll: "Tous",
    levelBeginner: "Débutant",
    levelIntermediate: "Intermédiaire",
    levelAdvanced: "Avancé",
    exerciseLabel: "Exercice",
    loadExercise: "Charger l’exercice",
    loadExample: "Charger l’exemple",
    toggleTie: "Basculer la liaison",
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
    playbackHint: "Espace : lecture / arrêt　｜　← / → : blanche précédente / suivante　｜　T : liaison",
    scoreInputTitle: "Saisie sur portée",
    scoreInputHelp: "La portée supérieure montre le contrepoint en blanches avec liaisons ; la portée inférieure montre le cantus en rondes.",
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
    status: (cp, cf, pos, len) => `Contrepoint : ${cp} notes / requis : ${Math.max(1, (cf - 1) * 2 + 1)} / Position : ${pos}/${len}`,
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
    noTies: "Les notes liées sont traitées comme une tenue de même hauteur.",
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
      "G4", "G4",
      "A4", "A4",
      "G4", "B4",
      "C5"
    ],
    ties: [true, false, true, false, false, false, false]
  }
];

let currentLanguage = "fr";
let selectedIndex = 0;
let playbackIndex = 0;
let isPlaying = false;
let playbackTimerId = null;
let isCounterpointMuted = false;
let isCantusMuted = false;
let audioContext = null;

const undoStack = [];

function getEditorStateSnapshot() {
  return {
    counterpoint: getNotesFromTextarea("counterpoint"),
    ties: getTieStates(),
    selectedIndex,
    playbackIndex
  };
}

function pushUndoState() {
  undoStack.push(getEditorStateSnapshot());
  if (undoStack.length > 100) undoStack.shift();
}

function restoreEditorState(state) {
  if (!state) return;
  stopPlayback(false);
  setNotesToTextarea("counterpoint", state.counterpoint || []);
  setTieStates(state.ties || []);
  selectedIndex = Number.isInteger(state.selectedIndex) ? state.selectedIndex : 0;
  playbackIndex = Number.isInteger(state.playbackIndex) ? state.playbackIndex : 0;
  renderScore();
  updateDisplays();
}

function undoLastEdit() {
  if (isPlaying) return;
  const state = undoStack.pop();
  if (!state) return;
  restoreEditorState(state);
}


function getTieStates() {
  const area = document.getElementById("counterpointTies");
  if (!area) return [];
  const raw = area.value.trim();
  if (!raw) return [];
  return raw.split(/\s+/).map((v) => v === "1");
}

function setTieStates(states) {
  const area = document.getElementById("counterpointTies");
  if (!area) return;
  area.value = states.map((v) => v ? "1" : "0").join(" ");
}

function normalizeTieStates(states, required) {
  const out = Array(Math.max(0, required)).fill(false);
  for (let i = 0; i < Math.min(out.length, states.length); i += 1) {
    out[i] = !!states[i];
  }
  if (out.length) out[out.length - 1] = false;
  return out;
}

function syncTiePitch(counterpoint, ties, index) {
  if (!counterpoint[index]) return;
  const pitch = counterpoint[index];

  let left = index;
  while (left > 0 && ties[left - 1]) {
    left -= 1;
  }

  let right = index;
  while (right < counterpoint.length - 1 && ties[right]) {
    right += 1;
  }

  for (let i = left; i <= right; i += 1) {
    counterpoint[i] = pitch;
  }
}

function toggleTieAtSelected() {
  if (isPlaying) return;
  const required = getRequiredHalfCount();
  if (!required || selectedIndex >= required - 1) return;

  // In this module, ties are only allowed across the barline.
  // With two half notes per cantus measure, this means: second half -> next measure.
  // First half -> second half in the same measure is disabled.
  if (selectedIndex % SCORE.halfsPerCantus !== SCORE.halfsPerCantus - 1) return;

  pushUndoState();
  const counterpoint = getNotesFromTextarea("counterpoint");
  while (counterpoint.length < required) counterpoint.push("");

  const ties = normalizeTieStates(getTieStates(), required);
  if (!counterpoint[selectedIndex]) counterpoint[selectedIndex] = "G4";

  ties[selectedIndex] = !ties[selectedIndex];

  if (ties[selectedIndex]) {
    counterpoint[selectedIndex + 1] = counterpoint[selectedIndex];
    syncTiePitch(counterpoint, ties, selectedIndex);
  }

  setNotesToTextarea("counterpoint", counterpoint);
  setTieStates(ties);
  renderScore();
}

function isTiedFromPrevious(counterpoint, ties, index) {
  return index > 0 && ties[index - 1] && counterpoint[index] && counterpoint[index] === counterpoint[index - 1];
}

function getTieSpan(counterpoint, ties, index) {
  if (!counterpoint[index]) return 1;
  let span = 1;
  while (
    index + span < counterpoint.length &&
    ties[index + span - 1] &&
    counterpoint[index + span] === counterpoint[index]
  ) {
    span += 1;
  }
  return span;
}

function drawTiePath(svg, x1, x2, y) {
  const start = x1 + 14;
  const end = x2 - 14;
  if (end <= start) return;

  const width = Math.max(42, end - start);
  const tieY = y - 31;

  svg.appendChild(createSvgImage(
    `${NOTATION_IMAGE_BASE}tie.png`,
    start,
    tieY,
    width,
    16,
    "png-notation png-tie",
    "none"
  ));
}

function drawCounterpointTies(svg, positions, counterpoint) {
  const ties = normalizeTieStates(getTieStates(), Math.max(positions.length, counterpoint.length));
  ties.forEach((isTied, i) => {
    if (!isTied || !counterpoint[i] || !counterpoint[i + 1]) return;
    if (counterpoint[i] !== counterpoint[i + 1]) return;

    const y = noteToY(counterpoint[i], SCORE.bottomLineY, "treble");
    if (y === null || positions[i] === undefined || positions[i + 1] === undefined) return;

    drawTiePath(svg, positions[i], positions[i + 1], y - 2);
  });
}


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

  const summary = document.getElementById("analysisInlineResult");
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
  return select ? select.value : "humanVoice";
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


const SAMPLE_VOICE_SETS = {
  femaleSample: {
    folder: "female",
    notes: ["G3", "C4", "G4", "C5", "G5"],
    transposeSemitones: 0
  },
  maleSample: {
    folder: "male",
    notes: ["G2", "C3", "G3", "C4", "G4"],
    transposeSemitones: 0
  }
};

const sampleVoiceCache = {};

function getSampleVoiceBasePath() {
  return "audio/voice";
}

function getNearestSampleNote(targetMidi, sampleNotes, setName = "") {
  const exactName = typeof midiToSampleNoteName === "function"
    ? midiToSampleNoteName(targetMidi)
    : midiToNote(targetMidi, "sharp");

  if (sampleNotes.includes(exactName)) {
    return exactName;
  }

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

  const ctx = getAudioContext();
  const cacheKey = `${setName}:${note}`;
  if (sampleVoiceCache[cacheKey]) return sampleVoiceCache[cacheKey];

  const base = getSampleVoiceBasePath();
  const urls = [
    `${base}/${set.folder}/${note}.wav`,
    `${base}/${set.folder}/${note}.mp3`,
    `${base}/${set.folder}/${note}.ogg`,
    `${base}/${set.folder}_${note}.wav`,
    `${base}/${set.folder}_${note}.mp3`,
    `${base}/${set.folder}_${note}.ogg`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: "force-cache" });
      if (!response.ok) continue;
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      sampleVoiceCache[cacheKey] = buffer;
      return buffer;
    } catch (error) {
      // Try next candidate.
    }
  }

  return null;
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
  filter.frequency.setValueAtTime(1400, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22 * gainScale, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.08);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.1);
}

function playVoiceLikeNote(midi, duration = 0.45, gainScale = 1) {
  playFallbackVoice(midi, duration, gainScale);
}

async function playSampleVoiceNote(setName, midi, duration = 0.75, gainScale = 1) {
  const set = SAMPLE_VOICE_SETS[setName];
  if (!set) return;

  const nearestNote = getNearestSampleNote(midi, set.notes, setName);
  const sourceMidi = noteToMidi(nearestNote);
  if (sourceMidi === null) return;

  const buffer = await loadSampleVoiceBuffer(setName, nearestNote);

  if (!buffer) {
    playFallbackVoice(midi, duration, gainScale);
    return;
  }

  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  source.buffer = buffer;
  source.playbackRate.setValueAtTime(Math.pow(2, (midi - sourceMidi + set.transposeSemitones) / 12), now);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(6200, now);

  const attack = 0.016;
  const release = 0.22;
  const targetGain = 0.95 * gainScale;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetGain), now + attack);
  gain.gain.setValueAtTime(Math.max(0.0001, targetGain), now + Math.max(attack + 0.02, duration - release));
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(getReverbDestination());

  source.start(now);
  source.stop(now + duration + release + 0.04);
}


function playMidiNote(midi, duration = 0.75, gainScale = 1, voiceSet = "femaleSample") {
  const timbre = getTimbre();

  if (timbre === "humanVoice") {
    const promise = playSampleVoiceNote(voiceSet, midi, duration, gainScale);
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => playVoiceLikeNote(midi, duration, gainScale));
    }
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
  mainGain.gain.exponentialRampToValueAtTime(config.gain * gainScale, now + 0.02);
  mainGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  mainOsc.connect(mainGain);
  mainGain.connect(getReverbDestination());

  mainOsc.start(now);
  mainOsc.stop(now + duration + 0.05);
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
  playNoteName(note, 0.85, 1);
}

function previewTimbre() {
  const counterpoint = getNotesFromTextarea("counterpoint");
  const cantus = getNotesFromTextarea("cantus");
  const note = counterpoint[selectedIndex] || cantus[Math.floor(selectedIndex / 4)] || "C4";
  playNoteName(note, 0.85, 1);
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
  const cantusLength = getNotesFromTextarea("cantus").length;
  if (!cantusLength) return 0;

  // Module 2.5: all measures use two half-note slots,
  // but the final counterpoint measure closes with one whole note.
  return Math.max(1, (cantusLength - 1) * SCORE.halfsPerCantus + 1);
}

function getPlaybackLength() {
  return getRequiredHalfCount();
}

function playVerticalSonority(index) {
  const cantus = getNotesFromTextarea("cantus");
  const counterpoint = getNotesFromTextarea("counterpoint");
  const mode = getPlaybackMode();

  const qDuration = getStepDurationSeconds();
  const noteDuration = Math.max(0.9, qDuration * 1.45);
  const cantusIndex = Math.floor(index / SCORE.halfsPerCantus);

  const cantusNote = cantus[cantusIndex];
  const counterpointNote = counterpoint[index];

  if (!isCantusMuted && (mode === "both" || mode === "cantus") && cantusNote) {
    const cantusDuration = index % SCORE.halfsPerCantus === 0 ? Math.max(1.15, qDuration * 4.25) : noteDuration;
    if (mode === "cantus" || index % SCORE.halfsPerCantus === 0) {
      playNoteName(cantusNote, cantusDuration, mode === "cantus" ? 1 : 0.95, "maleSample");
    }
  }

  if (!isCounterpointMuted && (mode === "both" || mode === "counterpoint") && counterpointNote) {
    const ties = normalizeTieStates(getTieStates(), Math.max(counterpoint.length, getRequiredHalfCount()));
    if (!isTiedFromPrevious(counterpoint, ties, index)) {
      const span = getTieSpan(counterpoint, ties, index);
      const isFinalCounterpointWhole = index === getRequiredHalfCount() - 1;
      const counterpointDuration = isFinalCounterpointWhole ? Math.max(noteDuration, qDuration * 2.75) : noteDuration;
      playNoteName(counterpointNote, Math.max(counterpointDuration, counterpointDuration * span * 1.18), 1.15, "femaleSample");
    }
  }
}

function updatePlayPauseButton() {
  const button = document.getElementById("playPauseButton");
  if (!button) return;
  button.textContent = isPlaying ? "■" : "▶";
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
  const summary = document.getElementById("analysisInlineResult");
  if (!summary || !results.length) return;

  const important = results
    .filter((item) => item.type === "error" || item.type === "warn")
    .slice(0, 8)
    .map((item) => item.message);

  if (important.length) {
    summary.innerHTML += "<br>" + important.join("<br>");
  }
}

function renderSummary(errorCount, warnCount, okCount) {
  const summary = document.getElementById("analysisInlineResult");
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

  const required = cantus.length * SCORE.halfsPerCantus;
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
    const measure = Math.floor(i / SCORE.halfsPerCantus);
    const beatInMeasure = i % SCORE.halfsPerCantus;
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
    const measure1 = Math.floor(i / SCORE.halfsPerCantus);
    const measure2 = Math.floor((i + 1) / SCORE.halfsPerCantus);

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

function noteToY(note, bottomLineY = SCORE.bottomLineY, clefType = null) {
  const noteStep = getDiatonicStep(note);
  const resolvedClef = clefType || (bottomLineY === SCORE.cantusBottomLineY ? "bass" : "treble");
  const referenceNote = resolvedClef === "bass" ? "G2" : "E4";
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



function getHalfSpacing(positions) {
  if (!positions || positions.length < 2) return (SCORE.width - SCORE.left - SCORE.right);
  return positions[1] - positions[0];
}

function drawMeasureBarlines(svg, positions, noteCount) {
  if (!positions || !positions.length) return;

  const spacing = getHalfSpacing(positions);
  const staffStartX = SCORE.left - 64;
  const staffEndX = positions[positions.length - 1] + spacing / 2;
  const topY = SCORE.bottomLineY - SCORE.staffGap * 4;
  const bottomY = SCORE.cantusBottomLineY;

  svg.appendChild(createSvgElement("line", {
    x1: staffStartX,
    y1: topY,
    x2: staffStartX,
    y2: bottomY,
    class: "measure-barline"
  }));

  for (let i = SCORE.halfsPerCantus; i < noteCount; i += SCORE.halfsPerCantus) {
    const x = (positions[i - 1] + positions[i]) / 2;
    svg.appendChild(createSvgElement("line", {
      x1: x,
      y1: topY,
      x2: x,
      y2: bottomY,
      class: "measure-barline"
    }));
  }

  svg.appendChild(createSvgElement("line", {
    x1: staffEndX - 7,
    y1: topY,
    x2: staffEndX - 7,
    y2: bottomY,
    class: "measure-barline final-thin"
  }));

  svg.appendChild(createSvgElement("line", {
    x1: staffEndX,
    y1: topY,
    x2: staffEndX,
    y2: bottomY,
    class: "measure-barline final-thick"
  }));
}

function moveNoteChromatic(note, semitone) {
  const midi = noteToMidi(note);
  if (midi === null) return note;
  if (semitone > 0) return midiToNote(midi + semitone, "sharp");
  if (semitone < 0) return midiToNote(midi + semitone, "flat");
  return note;
}

function moveSelectedNote(semitone) {
  if (isPlaying) return;

  const required = getRequiredHalfCount();
  let counterpoint = getNotesFromTextarea("counterpoint");
  if (!required) return;

  while (counterpoint.length < required) counterpoint.push("");

  if (selectedIndex < 0) selectedIndex = 0;
  if (selectedIndex >= required) selectedIndex = required - 1;

  pushUndoState();
  const ties = normalizeTieStates(getTieStates(), required);
  const currentNote = counterpoint[selectedIndex];
  if (!currentNote) {
    counterpoint[selectedIndex] = "G4";
  } else {
    counterpoint[selectedIndex] = moveNoteChromatic(currentNote, semitone);
  }

  syncTiePitch(counterpoint, ties, selectedIndex);
  setNotesToTextarea("counterpoint", counterpoint);
  setTieStates(ties);
  renderScore();
  playNoteName(counterpoint[selectedIndex], 0.85, 1, "femaleSample");
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

  pushUndoState();
  while (counterpoint.length < required) counterpoint.push("");
  const ties = normalizeTieStates(getTieStates(), required);
  counterpoint[selectedIndex] = "";
  if (selectedIndex > 0) ties[selectedIndex - 1] = false;
  ties[selectedIndex] = false;
  setNotesToTextarea("counterpoint", counterpoint);
  setTieStates(ties);
  renderScore();
}

function getCantusClefType(cantusNotes = null) {
  const notes = Array.isArray(cantusNotes) ? cantusNotes : getNotesFromTextarea("cantus");
  const threshold = noteToMidi("F4");
  return notes.some((note) => {
    const midi = noteToMidi(note);
    return midi !== null && midi >= threshold;
  }) ? "treble" : "bass";
}

function drawClef(svg, bottomLineY, clefType = "treble") {
  const isBass = clefType === "bass";
  const href = isBass ? NOTATION_IMAGES.bassClef : NOTATION_IMAGES.trebleClef;

  const width = isBass ? 62 : 64;
  const height = isBass ? 80 : 124;
  const x = SCORE.left - 82;
  const y = isBass ? bottomLineY - 70 : bottomLineY - 102;

  svg.appendChild(createSvgImage(href, x, y, width, height, `png-notation png-clef ${isBass ? "bass" : "treble"}`));
}

function drawStaff(svg, bottomLineY, label, noteCount, clefType = "treble") {
  const startX = SCORE.left - 64;
  const endX = SCORE.width - SCORE.right + 6;
  const staffY = bottomLineY - SCORE.staffGap * 4;
  const staffWidth = endX - startX;
  const staffHeight = SCORE.staffGap * 4 + 2;

  svg.appendChild(createSvgImage(NOTATION_IMAGES.staff, startX, staffY - 1, staffWidth, staffHeight + 2, "png-notation png-staff", "none"));
  drawClef(svg, bottomLineY, clefType);

  svg.appendChild(createSvgElement("text", { x: 22, y: bottomLineY - 64, class: "voice-label" })).textContent = label;
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
  const ledgerHalfWidth = 22;

  if (y < topLineY - SCORE.noteStep) {
    for (let ly = topLineY - SCORE.staffGap; ly >= y - 1; ly -= SCORE.staffGap) {
      svg.appendChild(createSvgElement("line", {
        x1: x - ledgerHalfWidth,
        y1: ly,
        x2: x + ledgerHalfWidth,
        y2: ly,
        class: "ledger-line"
      }));
    }
  }

  if (y > bottomLineY + SCORE.noteStep) {
    // Counterpoint noteheads are shifted 2px upward visually.
    // Add a small tolerance so C4 still gets its ledger line through the notehead.
    for (let ly = bottomLineY + SCORE.staffGap; ly <= y + 4; ly += SCORE.staffGap) {
      svg.appendChild(createSvgElement("line", {
        x1: x - ledgerHalfWidth,
        y1: ly,
        x2: x + ledgerHalfWidth,
        y2: ly,
        class: "ledger-line"
      }));
    }
  }
}

function drawAccidental(svg, parsedOrAccidental, x, y, isCantus = false) {
  const accidental = typeof parsedOrAccidental === "string"
    ? parsedOrAccidental
    : parsedOrAccidental && parsedOrAccidental.accidental;

  if (!accidental) return;

  const href = accidental === "#" ? NOTATION_IMAGES.sharp : accidental === "b" ? NOTATION_IMAGES.flat : NOTATION_IMAGES.natural;

  const width = isCantus
    ? (accidental === "#" ? 19 : 18)
    : (accidental === "#" ? 15 : 14);

  const height = isCantus
    ? (accidental === "#" ? 40 : 39)
    : (accidental === "#" ? 30 : 29);

  const accidentalYOffset = accidental === "b" ? (isCantus ? -14 : -8) : 0;

  svg.appendChild(createSvgImage(
    href,
    x - (isCantus ? 32 : 27),
    y - height / 2 + accidentalYOffset,
    width,
    height,
    `png-notation png-accidental ${isCantus ? "cantus" : "counterpoint"} accidental-${accidental === "#" ? "sharp" : accidental === "b" ? "flat" : "natural"}`
  ));
}

function drawHalfFlag(svg, x, y, isSelected, isCurrentPlayback) {
  const d = `M ${x + 7} ${y - 34} C ${x + 24} ${y - 28}, ${x + 24} ${y - 12}, ${x + 8} ${y - 8}`;
  svg.appendChild(createSvgElement("path", {
    d,
    class: `flag${isSelected ? " selected" : ""}${isCurrentPlayback ? " playing" : ""}`
  }));
}

function drawNote(svg, note, x, voice, index, bottomLineY, duration = "half", clefType = null) {
  const y = noteToY(note, bottomLineY, clefType);
  const parsed = parseNote(note);
  if (y === null || !parsed) return;

  const isCantus = voice === "cantus";
  const isSelected = !isCantus && index === selectedIndex && !isPlaying;
  const isCurrentPlayback = index === playbackIndex && isPlaying;

  // Use the same pitch center logic for counterpoint as for cantus.
  // No separate C4 offset or B4 offset.
  const renderY = isCantus ? y : y - 2;

  drawAccidental(svg, parsed, x, renderY, isCantus);

  if (isCantus) {
    const cantusScale = 0.9975;
    const cantusWidth = 30 * cantusScale;
    const cantusHeight = 18 * cantusScale;
    svg.appendChild(createSvgImage(
      NOTATION_IMAGES.wholeNote,
      x - cantusWidth / 2,
      renderY - cantusHeight / 2,
      cantusWidth,
      cantusHeight,
      `png-notation png-notehead whole-note${isCurrentPlayback ? " playing" : ""}`
    ));
  } else {
    // Counterpoint notehead is rendered in the same centered way as cantus.
    // The final counterpoint measure uses a whole note, so it has no stem.
    const noteheadWidth = 29.1;
    const noteheadHeight = 17.1;
    const stemDirection = renderY < bottomLineY - SCORE.staffGap * 2 ? "down" : "up";
    const noteTypeClass = duration === "whole" ? "whole-note" : `half-note ${stemDirection}`;

    svg.appendChild(createSvgImage(
      NOTATION_IMAGES.wholeNote,
      x - noteheadWidth / 2,
      renderY - noteheadHeight / 2,
      noteheadWidth,
      noteheadHeight,
      `png-notation png-notehead ${noteTypeClass}${isSelected ? " selected" : ""}${isCurrentPlayback ? " playing" : ""}`
    ));

    if (duration === "whole") {
      // no stem
    } else if (stemDirection === "down") {
      svg.appendChild(createSvgElement("line", {
        x1: x - 8,
        y1: renderY - 1,
        x2: x - 8,
        y2: renderY + 54,
        class: isCurrentPlayback ? "note-stem playing" : isSelected ? "note-stem selected" : "note-stem",
        stroke: "#181818",
        "stroke-width": 2.2,
        "stroke-linecap": "round"
      }));
    } else {
      svg.appendChild(createSvgElement("line", {
        x1: x + 12,
        y1: renderY + 1,
        x2: x + 12,
        y2: renderY - 54,
        class: isCurrentPlayback ? "note-stem playing" : isSelected ? "note-stem selected" : "note-stem",
        stroke: "#181818",
        "stroke-width": 2.2,
        "stroke-linecap": "round"
      }));
    }
  }

  // Draw ledger lines after notehead so the C4 ledger line crosses the notehead,
  // matching the cantus behavior.
  drawLedgerLines(svg, x, renderY, bottomLineY);

  svg.appendChild(createSvgElement("text", {
    x: x - 12,
    y: isCantus ? bottomLineY + 62 : bottomLineY - 78,
    class: isCurrentPlayback ? "note-label playing" : isSelected ? "note-label selected" : "note-label"
  })).textContent = note;
}

function drawSvgMuteButton(svg, x, y, label, muted, onToggle) {
  const group = createSvgElement("g", {
    class: `svg-mute-button${muted ? " muted" : ""}`,
    role: "button",
    tabindex: "0",
    "aria-label": `${muted ? "Unmute" : "Mute"} ${label}`
  });

  const rect = createSvgElement("rect", {
    x,
    y,
    width: 40,
    height: 40,
    rx: 8,
    fill: muted ? "#181818" : "#ffffff",
    stroke: "rgba(0,0,0,0.45)",
    "stroke-width": 1.4
  });
  const textEl = createSvgElement("text", {
    x: x + 20,
    y: y + 26,
    "text-anchor": "middle",
    "font-size": 22,
    "font-weight": 800,
    fill: muted ? "#ffffff" : "#181818",
    style: "font-family: -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif; user-select:none;"
  });
  textEl.textContent = "M";

  group.appendChild(rect);
  group.appendChild(textEl);
  group.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onToggle();
  });
  group.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      onToggle();
    }
  });
  svg.appendChild(group);
}

function drawMuteButtons(svg) {
  drawSvgMuteButton(svg, 10, SCORE.bottomLineY - 54, "counterpoint", isCounterpointMuted, toggleCounterpointMute);
  drawSvgMuteButton(svg, 10, SCORE.cantusBottomLineY - 54, "cantus", isCantusMuted, toggleCantusMute);
}

function renderScore() {
  const svg = document.getElementById("scoreEditor");
  if (!svg) return;

  clearSvg(svg);

  const cantus = getNotesFromTextarea("cantus");
  const requiredHalfCount = getRequiredHalfCount();
  const counterpoint = getNotesFromTextarea("counterpoint").slice(0, requiredHalfCount);
  const halfCount = Math.max(requiredHalfCount, 1);
  const positions = getScorePositions(halfCount);

  if (selectedIndex >= halfCount) selectedIndex = halfCount - 1;
  if (selectedIndex < 0) selectedIndex = 0;
  if (playbackIndex >= halfCount) playbackIndex = 0;
  if (playbackIndex < 0) playbackIndex = 0;

  const cantusClefType = getCantusClefType(cantus);
  drawStaff(svg, SCORE.bottomLineY, "Counterpoint", halfCount, "treble");
  drawStaff(svg, SCORE.cantusBottomLineY, "Cantus", halfCount, cantusClefType);
  drawMuteButtons(svg);
  drawMeasureBarlines(svg, positions, halfCount);
  drawPlayhead(svg, positions, halfCount);

  counterpoint.forEach((note, i) => {
    const durationType = i === halfCount - 1 ? "whole" : "half";
    if (note) drawNote(svg, note, positions[i], "counterpoint", i, SCORE.bottomLineY, durationType, "treble");
  });

  drawCounterpointTies(svg, positions, counterpoint);

  cantus.forEach((note, i) => {
    const x = positions[i * SCORE.halfsPerCantus];
    if (note && x !== undefined) drawNote(svg, note, x, "cantus", i * SCORE.halfsPerCantus, SCORE.cantusBottomLineY, "whole", cantusClefType);
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

  const required = getRequiredHalfCount();
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
  pushUndoState();
  while (counterpoint.length < required) counterpoint.push("");
  const ties = normalizeTieStates(getTieStates(), required);

  selectedIndex = nearestIndex;
  counterpoint[nearestIndex] = clickedNote;
  syncTiePitch(counterpoint, ties, nearestIndex);

  setNotesToTextarea("counterpoint", counterpoint);
  setTieStates(ties);
  renderScore();
  playNoteName(clickedNote, 0.45, 1, "femaleSample");

  svg.focus();
}

function undoCounterpointNote() {
  if (isPlaying) return;
  pushUndoState();
  const counterpoint = getNotesFromTextarea("counterpoint");
  counterpoint.pop();

  if (selectedIndex >= counterpoint.length) selectedIndex = Math.max(0, counterpoint.length - 1);

  setNotesToTextarea("counterpoint", counterpoint);
  renderScore();
}

function clearCounterpoint() {
  pushUndoState();
  stopPlayback(true);
  selectedIndex = 0;
  playbackIndex = 0;
  setNotesToTextarea("counterpoint", []);
  setTieStates([]);
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
    option.textContent = exercise.title[currentLanguage] || exercise.title.ja;

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

  description.textContent = exercise.description[currentLanguage] || exercise.description.ja;
}

function loadSelectedExercise() {
  const exercise = getSelectedExercise();
  if (!exercise) return;

  stopPlayback(true);
  setNotesToTextarea("cantus", exercise.cantus);
  const required = Math.max(1, ((exercise.cantus || []).length - 1) * SCORE.halfsPerCantus + 1);
  setNotesToTextarea("counterpoint", (exercise.counterpoint || []).slice(0, required));
  setTieStates(normalizeTieStates(exercise.ties || [], required));

  selectedIndex = 0;
  playbackIndex = 0;
  renderScore();
}


function normalizeLetterInput(letter) {
  const upper = String(letter || "").toUpperCase();
  if (upper === "H") return "B";
  if (["A", "B", "C", "D", "E", "F", "G"].includes(upper)) return upper;
  return "";
}

function inputLetterNote(letter) {
  const normalized = normalizeLetterInput(letter);
  if (!normalized || isPlaying) return;

  const required = getRequiredHalfCount();
  if (!required) return;

  let counterpoint = getNotesFromTextarea("counterpoint");
  while (counterpoint.length < required) counterpoint.push("");
  const ties = normalizeTieStates(getTieStates(), required);

  selectedIndex = Math.max(0, Math.min(required - 1, selectedIndex));

  pushUndoState();
  const octave = ["A", "B"].includes(normalized) ? 4 : 4;
  const note = `${normalized}${octave}`;
  counterpoint[selectedIndex] = note;
  syncTiePitch(counterpoint, ties, selectedIndex);

  setNotesToTextarea("counterpoint", counterpoint);
  setTieStates(ties);
  renderScore();
  updateDisplays();
  playNoteName(note, 0.65, 1.15, "femaleSample");

  if (selectedIndex < required - 1) {
    selectedIndex += 1;
    renderScore();
    updateDisplays();
  }
}

function updateMuteButtons() {
  const cp = document.getElementById("muteCounterpointButton");
  const cf = document.getElementById("muteCantusButton");
  if (cp) cp.classList.toggle("muted", isCounterpointMuted);
  if (cf) cf.classList.toggle("muted", isCantusMuted);
}

function toggleCounterpointMute() {
  isCounterpointMuted = !isCounterpointMuted;
  updateMuteButtons();
  renderScore();
}

function toggleCantusMute() {
  isCantusMuted = !isCantusMuted;
  updateMuteButtons();
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

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      undoLastEdit();
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      togglePlayback();
      return;
    }

    if (isTextInput) return;

    if (/^[a-hA-H]$/.test(event.key)) {
      event.preventDefault();
      inputLetterNote(event.key);
      return;
    }

    if (event.key === "t" || event.key === "T") {
      event.preventDefault();
      toggleTieAtSelected();
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
  if (exerciseSelect) exerciseSelect.addEventListener("change", updateExerciseDescription);

  const levelFilterSelect = document.getElementById("levelFilterSelect");
  if (levelFilterSelect) levelFilterSelect.addEventListener("change", () => populateExerciseSelect(false));

  populateExerciseSelect();
  setLanguage(currentLanguage);
  renderScore();
  updatePlayPauseButton();
  updateMuteButtons();
});function getReverbDestination() {
  const ctx = getAudioContext();
  if (window.__module2ReverbNodes && window.__module2ReverbNodes.context === ctx) {
    return window.__module2ReverbNodes.input;
  }

  const input = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const preDelay = ctx.createDelay(0.25);
  const earlyDelay = ctx.createDelay(0.35);
  const lateDelay = ctx.createDelay(0.55);
  const feedback = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  dry.gain.value = 0.76;
  wet.gain.value = 0.24;
  preDelay.delayTime.value = 0.035;
  earlyDelay.delayTime.value = 0.075;
  lateDelay.delayTime.value = 0.145;
  feedback.gain.value = 0.28;
  filter.type = "lowpass";
  filter.frequency.value = 4300;

  input.connect(dry);
  dry.connect(ctx.destination);

  input.connect(wet);
  wet.connect(preDelay);
  preDelay.connect(earlyDelay);
  earlyDelay.connect(lateDelay);
  lateDelay.connect(filter);
  filter.connect(ctx.destination);
  filter.connect(feedback);
  feedback.connect(earlyDelay);

  window.__module2ReverbNodes = { context: ctx, input };
  return input;
}



window.toggleCounterpointMute = toggleCounterpointMute;
window.toggleCantusMute = toggleCantusMute;

window.toggleTieAtSelected = toggleTieAtSelected;

window.undoLastEdit = undoLastEdit;
