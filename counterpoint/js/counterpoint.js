(() => {
  "use strict";

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

  const EXERCISES = [
    { id: "c-major-arch", title: "C major / アーチ型", desc: "Cから上行し、中央で頂点を作って戻る基本課題です。", cantus: ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4"] },
    { id: "d-minor-step", title: "D minor / 順次進行", desc: "短調の感覚を保ちながら順次進行を練習します。", cantus: ["D4", "E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4"] },
    { id: "g-major-low", title: "G major / 低めの音域", desc: "やや低い音域で、安定した協和音程を作る課題です。", cantus: ["G3", "A3", "B3", "C4", "D4", "C4", "B3", "A3", "G3"] },
    { id: "f-major-small-peak", title: "F major / 小さな頂点", desc: "短い上行と下行を含む、まとまりやすい定旋律です。", cantus: ["F3", "G3", "A3", "C4", "B3", "A3", "G3", "F3"] },
    { id: "a-minor-return", title: "A minor / 回帰", desc: "開始音へ自然に戻ることを意識する課題です。", cantus: ["A3", "B3", "C4", "D4", "E4", "D4", "C4", "B3", "A3"] },
    { id: "c-major-leap", title: "C major / 小さな跳躍", desc: "小さな跳躍を含む定旋律に対して対旋律を作ります。", cantus: ["C4", "E4", "D4", "F4", "G4", "E4", "F4", "D4", "C4"] },
    { id: "e-minor-middle", title: "E minor / 中音域", desc: "中音域で対旋律の輪郭を整える課題です。", cantus: ["E4", "F4", "G4", "A4", "B4", "A4", "G4", "F4", "E4"] },
    { id: "g-major-long", title: "G major / 長め", desc: "少し長い定旋律で、連続5度・8度を避ける練習です。", cantus: ["G3", "A3", "B3", "D4", "C4", "B3", "A3", "C4", "B3", "A3", "G3"] },
    { id: "f-major-descend", title: "F major / 下降中心", desc: "下降形を中心にした定旋律です。", cantus: ["F4", "E4", "D4", "C4", "B3", "C4", "D4", "C4", "F3"] },
    { id: "c-major-extended", title: "C major / 拡張", desc: "やや長めの総合練習です。", cantus: ["C4", "D4", "E4", "G4", "F4", "E4", "D4", "F4", "E4", "D4", "C4"] }
  ];

  let selectedIndex = 0;
  let playbackIndex = 0;
  let isPlaying = false;
  let playbackTimerId = null;
  let audioContext = null;
  let reverbNodes = null;
  let lastIssues = [];

  const voiceMuteState = {
    counterpoint: false,
    cantus: false
  };

  const sampleVoiceCache = {};

  function getSampleVoiceBasePath() {
    return "audio/voice";
  }

  function getVoiceSampleCandidates(voiceSet, midi) {
    const folder = voiceSet === "maleSample" ? "male" : "female";

    const anchors = [
      { midi: 55, name: "G3" },
      { midi: 60, name: "C4" },
      { midi: 67, name: "G4" },
      { midi: 72, name: "C5" },
      { midi: 79, name: "G5" }
    ];

    let best = anchors[0];
    anchors.forEach((anchor) => {
      if (Math.abs(anchor.midi - midi) < Math.abs(best.midi - midi)) {
        best = anchor;
      }
    });

    const base = getSampleVoiceBasePath();

    return [
      { url: `${base}/${folder}/${best.name}.wav`, rootMidi: best.midi },
      { url: `${base}/${folder}/${best.name}.mp3`, rootMidi: best.midi },
      { url: `${base}/${folder}/${best.name}.ogg`, rootMidi: best.midi },

      // alternate naming, if the uploaded files use flat folders
      { url: `${base}/${folder}_${best.name}.wav`, rootMidi: best.midi },
      { url: `${base}/${folder}_${best.name}.mp3`, rootMidi: best.midi },
      { url: `${base}/${folder}_${best.name}.ogg`, rootMidi: best.midi }
    ];
  }

  async function loadVoiceSample(candidate) {
    const ctx = ensureAudioReady();
    const cacheKey = candidate.url;

    if (sampleVoiceCache[cacheKey]) {
      return sampleVoiceCache[cacheKey];
    }

    const response = await fetch(candidate.url, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`Sample not found: ${candidate.url}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));

    sampleVoiceCache[cacheKey] = {
      buffer: audioBuffer,
      rootMidi: candidate.rootMidi
    };

    return sampleVoiceCache[cacheKey];
  }

  async function playSampleVoiceNote(voiceSet, midi, duration = 0.75, gainScale = 1) {
    const ctx = ensureAudioReady();
    const candidates = getVoiceSampleCandidates(voiceSet, midi);

    let sample = null;

    for (const candidate of candidates) {
      try {
        sample = await loadVoiceSample(candidate);
        break;
      } catch (error) {
        // Try next candidate.
      }
    }

    if (!sample) {
      playFallbackMidiNote(midi, duration, gainScale);
      return;
    }

    const now = ctx.currentTime;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    source.buffer = sample.buffer;
    source.playbackRate.setValueAtTime(Math.pow(2, (midi - sample.rootMidi) / 12), now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(6200, now);

    const attack = 0.018;
    const release = 0.22;
    const targetGain = 0.72 * gainScale;

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



  function $(id) {
    return document.getElementById(id);
  }

  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  }

  function createSvgImage(href, x, y, width, height, className = "", preserveAspectRatio = "xMidYMid meet") {
    const image = svgEl("image", { x, y, width, height, href, class: className, preserveAspectRatio });
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", href);
    return image;
  }

  function clearSvg(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  function parseNote(note) {
    const match = String(note || "").trim().match(/^([A-Ga-g])(#|b)?(-?\d)$/);
    if (!match) return null;
    return {
      letter: match[1].toUpperCase(),
      accidental: match[2] || "",
      octave: Number(match[3])
    };
  }

  function noteToMidi(note) {
    const parsed = parseNote(note);
    if (!parsed) return null;
    const pcs = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    let pc = pcs[parsed.letter];
    if (parsed.accidental === "#") pc += 1;
    if (parsed.accidental === "b") pc -= 1;
    return (parsed.octave + 1) * 12 + pc;
  }

  function midiToFrequency(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function midiToNote(midi) {
    const names = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
    const pc = ((midi % 12) + 12) % 12;
    const octave = Math.floor(midi / 12) - 1;
    return `${names[pc]}${octave}`;
  }

  
  function diatonicStepIndex(note) {
    const parsed = parseNote(note);
    if (!parsed) return null;
    const steps = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
    return parsed.octave * 7 + steps[parsed.letter];
  }

  function noteFromDiatonicStep(stepIndex) {
    const letters = ["C", "D", "E", "F", "G", "A", "B"];
    const octave = Math.floor(stepIndex / 7);
    const letter = letters[((stepIndex % 7) + 7) % 7];
    return `${letter}${octave}`;
  }

  function getBottomLineReference(bottomLineY) {
    return Math.abs(bottomLineY - SCORE.cantusBottomLineY) < 10 ? "G2" : "E4";
  }


  function midiToNoteSharp(midi) {
    const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const pc = ((midi % 12) + 12) % 12;
    const octave = Math.floor(midi / 12) - 1;
    return `${names[pc]}${octave}`;
  }

  function midiToNoteFlat(midi) {
    const names = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    const pc = ((midi % 12) + 12) % 12;
    const octave = Math.floor(midi / 12) - 1;
    return `${names[pc]}${octave}`;
  }

function moveNoteChromatic(note, semitone) {
    const midi = noteToMidi(note);
    if (midi === null) return note;

    const nextMidi = midi + semitone;
    if (semitone > 0) {
      return midiToNoteSharp(nextMidi);
    }

    if (semitone < 0) {
      return midiToNoteFlat(nextMidi);
    }

    return note;
  }

  function noteToY(note, bottomLineY) {
    const noteStep = diatonicStepIndex(note);
    if (noteStep === null) return null;

    const referenceNote = getBottomLineReference(bottomLineY);
    const referenceStep = diatonicStepIndex(referenceNote);
    if (referenceStep === null) return null;

    const diatonicDistance = noteStep - referenceStep;
    return bottomLineY - (diatonicDistance * (SCORE.staffGap / 2));
  }

  function yToNaturalNote(y) {
    const referenceStep = diatonicStepIndex("E4");
    const diatonicDistance = Math.round((SCORE.counterpointBottomLineY - y) / (SCORE.staffGap / 2));
    const targetStep = referenceStep + diatonicDistance;

    return noteFromDiatonicStep(targetStep);
  }

  function getNotesFromTextarea(id) {
    const el = $(id);
    if (!el || !el.value.trim()) return [];
    return el.value.trim().split(/\s+/).filter(Boolean);
  }

  function setNotesToTextarea(id, notes) {
    const el = $(id);
    if (!el) return;
    el.value = Array.isArray(notes) ? notes.filter(Boolean).join(" ") : String(notes || "");
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

  function getScorePositions(noteCount) {
    return Array.from({ length: Math.max(noteCount, 1) }, (_, i) => getMeasureNoteX(i));
  }

  function getMeasureIndexFromX(x, noteCount) {
    const raw = Math.floor((x - SCORE.left) / SCORE.measureWidth);
    return Math.max(0, Math.min(Math.max(noteCount, 1) - 1, raw));
  }

  function populateExercises() {
    const select = $("exerciseSelect");
    if (!select) return;

    select.innerHTML = "";
    EXERCISES.forEach((exercise) => {
      const option = document.createElement("option");
      option.value = exercise.id;
      option.textContent = exercise.title;
      select.appendChild(option);
    });
  }

  function getSelectedExercise() {
    const select = $("exerciseSelect");
    const id = select && select.value ? select.value : EXERCISES[0].id;
    return EXERCISES.find((exercise) => exercise.id === id) || EXERCISES[0];
  }

  function updateExerciseDescription() {
    const desc = $("exerciseDescription");
    const exercise = getSelectedExercise();
    if (desc) desc.textContent = exercise ? exercise.desc : "課題を選択してください。";
  }

  function loadSelectedExercise() {
    const exercise = getSelectedExercise();
    if (!exercise) return;

    setNotesToTextarea("cantus", exercise.cantus);
    setNotesToTextarea("counterpoint", []);
    selectedIndex = 0;
    playbackIndex = 0;
    stopPlayback(false);
    updateExerciseDescription();
    renderScore();
    updateDisplays();
  }

  function loadExample() {
    setNotesToTextarea("cantus", ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4"]);
    setNotesToTextarea("counterpoint", ["G4", "F4", "G4", "A4", "B4", "A4", "G4", "F4", "C5"]);
    selectedIndex = 0;
    playbackIndex = 0;
    stopPlayback(false);
    renderScore();
    updateDisplays();
  }

  function drawSenzokuMeasureHighlight(svg) {
    const x = getMeasureStartX(selectedIndex);

    svg.appendChild(svgEl("rect", {
      x,
      y: SCORE.counterpointBottomLineY - 112,
      width: SCORE.measureWidth,
      height: 156,
      class: "senzoku-input-highlight"
    }));

    svg.appendChild(svgEl("line", {
      x1: x,
      y1: SCORE.counterpointBottomLineY - 118,
      x2: x,
      y2: SCORE.counterpointBottomLineY + 66,
      class: "senzoku-cursor-line"
    }));

    svg.appendChild(svgEl("path", {
      d: `M ${x - 5} ${SCORE.counterpointBottomLineY - 116} L ${x + 5} ${SCORE.counterpointBottomLineY - 116} L ${x} ${SCORE.counterpointBottomLineY - 106} Z`,
      class: "senzoku-cursor-triangle"
    }));
  }

  function drawClef(svg, bottomLineY, clefType = "treble") {
    const isBass = clefType === "bass";
    const href = isBass ? NOTATION_IMAGES.bassClef : NOTATION_IMAGES.trebleClef;
    const width = isBass ? 68 : 72;
    const height = isBass ? 88 : 136;
    const x = SCORE.left - 60;
    const y = isBass ? bottomLineY - 76 : bottomLineY - 117;

    // SVG fallback clef below PNG.
    const fallback = svgEl("text", {
      x: SCORE.left - 54,
      y: isBass ? bottomLineY - 20 : bottomLineY - 25,
      class: ["stable-clef", isBass ? "bass" : "treble", "clef-fallback"].join(" ")
    });
    fallback.textContent = isBass ? "𝄢" : "𝄞";
    svg.appendChild(fallback);

    svg.appendChild(createSvgImage(href, x, y, width, height, `png-notation png-clef ${isBass ? "bass" : "treble"}`));
  }

  function drawStaff(svg, bottomLineY, noteCount, clefType = "treble") {
    const staffX = SCORE.left - 18;
    const staffEndX = Math.max(staffX + SCORE.measureWidth, getMeasureStartX(noteCount));
    const staffY = bottomLineY - SCORE.staffGap * 4;
    const staffWidth = Math.max(SCORE.measureWidth, staffEndX - staffX);
    const staffHeight = SCORE.staffGap * 4 + 2;

    for (let i = 0; i < 5; i += 1) {
      const y = bottomLineY - SCORE.staffGap * i;
      svg.appendChild(svgEl("line", { x1: staffX, y1: y, x2: staffEndX, y2: y, class: "stable-staff-line png-staff-fallback-line" }));
    }

    svg.appendChild(createSvgImage(NOTATION_IMAGES.staff, staffX, staffY - 1, staffWidth, staffHeight + 2, "png-notation png-staff", "none"));
    drawClef(svg, bottomLineY, clefType);

    if (clefType === "bass") {
      getScorePositions(noteCount).forEach((x, i) => {
        const label = svgEl("text", { x: x - 4, y: bottomLineY + 78, class: "note-label" });
        label.textContent = String(i + 1);
        svg.appendChild(label);
      });
    }
  }

  function drawBarlines(svg, noteCount) {
    const top = SCORE.counterpointBottomLineY - 96;
    const bottom = SCORE.cantusBottomLineY + 56;
    for (let i = 0; i <= noteCount; i += 1) {
      const x = getMeasureStartX(i);
      svg.appendChild(svgEl("line", { x1: x, y1: top, x2: x, y2: bottom, class: i % 4 === 0 ? "senzoku-measure-line strong" : "senzoku-measure-line" }));
    }
  }

  function drawVoiceLabels(svg) {
    const cp = svgEl("text", { x: 22, y: SCORE.counterpointBottomLineY - 76, class: "voice-label senzoku-label" });
    cp.textContent = "Counterpoint";
    svg.appendChild(cp);

    const cf = svgEl("text", { x: 22, y: SCORE.cantusBottomLineY - 76, class: "voice-label senzoku-label" });
    cf.textContent = "Cantus";
    svg.appendChild(cf);
  }

  function drawAccidental(svg, parsed, x, y, className = "") {
    if (!parsed || !parsed.accidental) return;

    const fallback = svgEl("text", { x: x - 27, y: y + 1, class: ["stable-accidental", className].join(" ") });
    fallback.textContent = parsed.accidental === "#" ? "♯" : "♭";
    svg.appendChild(fallback);

    const href = parsed.accidental === "#" ? NOTATION_IMAGES.sharp : NOTATION_IMAGES.flat;
    const width = parsed.accidental === "#" ? SCORE.accidentalWidth : 18;
    const height = parsed.accidental === "#" ? SCORE.accidentalHeight : 46;
    svg.appendChild(createSvgImage(href, x - 34, y - height * 0.53, width, height, ["png-notation", "png-accidental", className].join(" ")));
  }

  function getIssueClass() {
    return "";
  }

  function drawLedgerLines(svg, x, y, bottomLineY) {
    const topLineY = bottomLineY - SCORE.staffGap * 4;
    const halfGap = SCORE.staffGap / 2;

    if (y > bottomLineY + halfGap) {
      for (let ly = bottomLineY + SCORE.staffGap; ly <= y + 0.1; ly += SCORE.staffGap) {
        svg.appendChild(svgEl("line", {
          x1: x - 23,
          y1: ly,
          x2: x + 23,
          y2: ly,
          class: "ledger-line"
        }));
      }
    }

    if (y < topLineY - halfGap) {
      for (let ly = topLineY - SCORE.staffGap; ly >= y - 0.1; ly -= SCORE.staffGap) {
        svg.appendChild(svgEl("line", {
          x1: x - 23,
          y1: ly,
          x2: x + 23,
          y2: ly,
          class: "ledger-line"
        }));
      }
    }
  }

  function drawIssueRing() {
    // minimal stable version
  }

  function isVoiceMuted(voice) {
    return !!voiceMuteState[voice];
  }

  function drawNote(svg, note, x, voice, index, bottomLineY) {
    const y = noteToY(note, bottomLineY);
    const parsed = parseNote(note);
    if (y === null || !parsed) return;

    const isCantus = voice === "cantus";
    const muted = isVoiceMuted(isCantus ? "cantus" : "counterpoint");
    const isSelected = !isCantus && index === selectedIndex && !isPlaying;
    const isCurrentPlayback = index === playbackIndex && isPlaying;
    const noteDrawY = y + (isCantus ? -2 : -0.5);

    drawLedgerLines(svg, x, y, bottomLineY);
    drawAccidental(svg, parsed, x, y, [
      isCantus ? "cantus" : "",
      muted ? "muted-voice" : "",
      isSelected ? "selected" : "",
      isCurrentPlayback ? "playing" : ""
    ].filter(Boolean).join(" "));
    svg.appendChild(createSvgImage(
      NOTATION_IMAGES.wholeNote,
      x - SCORE.noteImageWidth / 2,
      noteDrawY - SCORE.noteImageHeight / 2,
      SCORE.noteImageWidth,
      SCORE.noteImageHeight,
      ["png-notation", "png-notehead", "png-whole-note", isCantus ? "cantus" : "", muted ? "muted-voice" : "", isSelected ? "selected" : "", isCurrentPlayback ? "playing" : ""].filter(Boolean).join(" ")
    ));

    if (!isCantus && isSelected) {
      svg.appendChild(svgEl("circle", { cx: x, cy: y, r: 13, class: "senzoku-selected-ring" }));
    }
  }

  function renderScore() {
    const svg = $("scoreEditor");
    if (!svg) return;

    clearSvg(svg);

    const cantus = getNotesFromTextarea("cantus");
    const counterpoint = getNotesFromTextarea("counterpoint");
    const noteCount = Math.max(cantus.length, counterpoint.length, 1);
    const scoreWidth = getSenzokuScoreWidth(noteCount);
    const positions = getScorePositions(noteCount);

    svg.setAttribute("viewBox", `0 0 ${scoreWidth} ${SCORE.height}`);
    svg.setAttribute("width", String(scoreWidth));
    svg.setAttribute("height", String(SCORE.height));
    svg.style.width = `${scoreWidth}px`;
    svg.style.minWidth = `${scoreWidth}px`;
    svg.style.height = `${SCORE.height}px`;

    selectedIndex = Math.max(0, Math.min(noteCount - 1, selectedIndex));
    playbackIndex = Math.max(0, Math.min(noteCount - 1, playbackIndex));

    drawSenzokuMeasureHighlight(svg);
    drawStaff(svg, SCORE.counterpointBottomLineY, noteCount, "treble");
    drawStaff(svg, SCORE.cantusBottomLineY, noteCount, "bass");
    drawBarlines(svg, noteCount);
    drawVoiceLabels(svg);

    counterpoint.forEach((note, i) => {
      if (note) drawNote(svg, note, positions[i], "counterpoint", i, SCORE.counterpointBottomLineY);
    });

    cantus.forEach((note, i) => {
      if (note) drawNote(svg, note, positions[i], "cantus", i, SCORE.cantusBottomLineY);
    });

    updateDisplays();
    syncVoiceMuteButtons();
  }

  function clickToScorePoint(event) {
    const svg = $("scoreEditor");
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    return {
      viewX: ((event.clientX - rect.left) / rect.width) * viewBox.width,
      viewY: ((event.clientY - rect.top) / rect.height) * viewBox.height
    };
  }

  function handleScoreClick(event) {
    if (isPlaying) return;

    ensureAudioReady();

    const point = clickToScorePoint(event);
    if (!point) return;

    if (point.viewY > (SCORE.counterpointBottomLineY + SCORE.cantusBottomLineY) / 2) return;

    const cantus = getNotesFromTextarea("cantus");
    const counterpoint = getNotesFromTextarea("counterpoint");
    const noteCount = Math.max(cantus.length, counterpoint.length, 1);
    const index = getMeasureIndexFromX(point.viewX, noteCount);

    while (counterpoint.length < noteCount) counterpoint.push("");

    const existing = counterpoint[index];
    const noteX = getMeasureNoteX(index);
    const existingY = existing ? noteToY(existing, SCORE.counterpointBottomLineY) : null;

    selectedIndex = index;

    if (existing && existingY !== null && Math.abs(point.viewX - noteX) < 28 && Math.abs(point.viewY - existingY) < 24) {
      setNotesToTextarea("counterpoint", counterpoint);
      renderScore();
      playNoteName(existing, 0.65, 1.15, "femaleSample");
      return;
    }

    const newNote = yToNaturalNote(point.viewY);
    counterpoint[index] = newNote;
    setNotesToTextarea("counterpoint", counterpoint);
    renderScore();
    playNoteName(newNote, 0.65, 1.15, "femaleSample");
  }

  function moveSelection(delta) {
    const length = Math.max(getPlaybackLength(), 1);
    selectedIndex = Math.max(0, Math.min(length - 1, selectedIndex + delta));
    renderScore();

    const note = getNotesFromTextarea("counterpoint")[selectedIndex];
    if (note) playNoteName(note, 0.55, 1.1, "femaleSample");
  }

  function moveSelectedNote(semitone) {
    const cantus = getNotesFromTextarea("cantus");
    const counterpoint = getNotesFromTextarea("counterpoint");
    const length = Math.max(cantus.length, counterpoint.length, 1);

    while (counterpoint.length < length) counterpoint.push("");

    selectedIndex = Math.max(0, Math.min(length - 1, selectedIndex));
    const current = counterpoint[selectedIndex] || "G4";
    const next = moveNoteChromatic(current, semitone);

    counterpoint[selectedIndex] = next;
    setNotesToTextarea("counterpoint", counterpoint);
    renderScore();
    playNoteName(next, 0.55, 1.1, "femaleSample");
  }

  function undoCounterpointNote() {
    const counterpoint = getNotesFromTextarea("counterpoint");
    counterpoint.pop();
    selectedIndex = Math.max(0, counterpoint.length - 1);
    setNotesToTextarea("counterpoint", counterpoint);
    renderScore();
  }

  function clearCounterpoint() {
    setNotesToTextarea("counterpoint", []);
    selectedIndex = 0;
    renderScore();
  }

  function deleteSelectedNote() {
    const counterpoint = getNotesFromTextarea("counterpoint");
    if (selectedIndex >= 0 && selectedIndex < counterpoint.length) {
      counterpoint[selectedIndex] = "";
      setNotesToTextarea("counterpoint", counterpoint);
      renderScore();
    }
  }

  function playSelectedNote() {
    const note = getNotesFromTextarea("counterpoint")[selectedIndex];
    if (note) playNoteName(note, 0.75, 1.15, "femaleSample");
  }

  function getPlaybackLength() {
    return Math.max(getNotesFromTextarea("cantus").length, getNotesFromTextarea("counterpoint").length, 1);
  }

  function getStepDurationSeconds() {
    const tempo = Math.min(180, Math.max(40, Number($("tempoInput")?.value) || 72));
    return 60 / tempo;
  }

  function getAudioContext() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    return audioContext;
  }

  function ensureAudioReady() {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function getReverbDestination() {
    const ctx = ensureAudioReady();
    if (reverbNodes && reverbNodes.context === ctx) return reverbNodes.input;

    const input = ctx.createGain();
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    const delay = ctx.createDelay(0.35);
    const feedback = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    dry.gain.value = 0.82;
    wet.gain.value = 0.18;
    delay.delayTime.value = 0.045;
    feedback.gain.value = 0.22;
    filter.type = "lowpass";
    filter.frequency.value = 4600;

    input.connect(dry);
    dry.connect(ctx.destination);

    input.connect(wet);
    wet.connect(delay);
    delay.connect(filter);
    filter.connect(ctx.destination);
    filter.connect(feedback);
    feedback.connect(delay);

    reverbNodes = { context: ctx, input };
    return input;
  }

  function playFallbackMidiNote(midi, duration = 0.75, gainScale = 1) {
    const ctx = ensureAudioReady();
    const now = ctx.currentTime;
    const freq = midiToFrequency(midi);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = "triangle";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 2, now);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2200, now);

    const attack = 0.025;
    const release = 0.22;
    const targetGain = 0.34 * gainScale;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetGain), now + attack);
    gain.gain.setValueAtTime(Math.max(0.0001, targetGain), now + Math.max(attack + 0.02, duration - release));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(getReverbDestination());

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + release + 0.04);
    osc2.stop(now + duration + release + 0.04);
  }

function playMidiNote(midi, duration = 0.75, gainScale = 1, voiceSet = "femaleSample") {
    ensureAudioReady();

    const promise = playSampleVoiceNote(voiceSet, midi, duration, gainScale);

    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {
        playFallbackMidiNote(midi, duration, gainScale);
      });
    }
  }

  function playNoteName(note, duration = 0.75, gainScale = 1, voiceSet = "femaleSample") {
    const midi = noteToMidi(note);
    if (midi !== null) {
      playMidiNote(midi, duration, gainScale, voiceSet);
    }
  }

  function updatePlayPauseButton() {
    const btn = $("playPauseButton");
    if (btn) btn.textContent = isPlaying ? "停止" : "再生";
  }

  function startPlayback() {
    ensureAudioReady();

    if (isPlaying) return;
    isPlaying = true;
    playbackIndex = Math.max(0, Math.min(playbackIndex, getPlaybackLength() - 1));
    updatePlayPauseButton();
    playCurrentStep();
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

    if (!voiceMuteState.cantus && cantus[playbackIndex]) playNoteName(cantus[playbackIndex], duration * 1.05, 0.95, "maleSample");
    if (!voiceMuteState.counterpoint && counterpoint[playbackIndex]) playNoteName(counterpoint[playbackIndex], duration * 1.05, 1.15, "femaleSample");

    playbackTimerId = window.setTimeout(() => {
      playbackIndex += 1;
      playCurrentStep();
    }, duration * 1000);
  }

  function stopPlayback(reset = false) {
    isPlaying = false;
    if (playbackTimerId) window.clearTimeout(playbackTimerId);
    playbackTimerId = null;
    if (reset) playbackIndex = 0;
    updatePlayPauseButton();
    renderScore();
  }

  function togglePlayback() {
    if (isPlaying) stopPlayback(false);
    else startPlayback();
  }

  function syncVoiceMuteButtons() {
    const cp = $("muteCounterpointButton");
    const cf = $("muteCantusButton");

    if (cp) {
      cp.classList.toggle("muted", voiceMuteState.counterpoint);
      cp.setAttribute("aria-pressed", voiceMuteState.counterpoint ? "true" : "false");
    }
    if (cf) {
      cf.classList.toggle("muted", voiceMuteState.cantus);
      cf.setAttribute("aria-pressed", voiceMuteState.cantus ? "true" : "false");
    }
  }

  function toggleVoiceMute(voice) {
    voiceMuteState[voice] = !voiceMuteState[voice];
    syncVoiceMuteButtons();
    renderScore();
  }

  function updateDisplays() {
    const cantus = getNotesFromTextarea("cantus");
    const counterpoint = getNotesFromTextarea("counterpoint");
    const cantusDisplay = $("cantusDisplay");
    const counterpointDisplay = $("counterpointDisplay");
    const count = $("counterpointCount");

    if (cantusDisplay) cantusDisplay.textContent = cantus.join(" ");
    if (counterpointDisplay) counterpointDisplay.textContent = counterpoint.filter(Boolean).join(" ");
    if (count) count.textContent = String(counterpoint.filter(Boolean).length);
  }

  function analyzeCounterpoint() {
    const result = $("analysisInlineResult");
    const cantus = getNotesFromTextarea("cantus");
    const counterpoint = getNotesFromTextarea("counterpoint").filter(Boolean);

    if (!result) return;

    if (!cantus.length) {
      result.innerHTML = "定旋律が読み込まれていません。";
      return;
    }

    if (!counterpoint.length) {
      result.innerHTML = "対旋律が未入力です。";
      return;
    }

    const issues = [];
    const len = Math.min(cantus.length, counterpoint.length);

    for (let i = 0; i < len; i += 1) {
      const cMidi = noteToMidi(cantus[i]);
      const pMidi = noteToMidi(counterpoint[i]);
      if (cMidi === null || pMidi === null) continue;

      const interval = Math.abs(pMidi - cMidi) % 12;
      const allowed = [0, 3, 4, 7, 8, 9].includes(interval);

      if (!allowed) {
        issues.push(`${i + 1}音目：不協和音程の可能性`);
      }
    }

    if (!issues.length) {
      result.innerHTML = "大きな問題は見つかりませんでした。";
      return;
    }

    result.innerHTML = `${issues.length} 件の指摘があります。<br>${issues.join("<br>")}`;
  }

  function exportMidi() {
    alert("MIDI書き出しは次の段階で再接続します。現在は表示・入力・再生の安定化を優先しています。");
  }

  
  function normalizeLetterInput(letter) {
    const upper = String(letter || "").toUpperCase();
    if (upper === "H") return "B";
    if (["A", "B", "C", "D", "E", "F", "G"].includes(upper)) return upper;
    return "";
  }

  function octaveForLetterInput(letter) {
    const upper = normalizeLetterInput(letter);
    // Keep first-species counterpoint in a comfortable upper-staff range.
    if (["A", "B"].includes(upper)) return 4;
    return 4;
  }

  function inputLetterNote(letter) {
    const normalized = normalizeLetterInput(letter);
    if (!normalized) return;

    const cantus = getNotesFromTextarea("cantus");
    const counterpoint = getNotesFromTextarea("counterpoint");
    const length = Math.max(cantus.length, counterpoint.length, 1);

    while (counterpoint.length < length) counterpoint.push("");

    selectedIndex = Math.max(0, Math.min(length - 1, selectedIndex));

    const note = `${normalized}${octaveForLetterInput(normalized)}`;
    counterpoint[selectedIndex] = note;

    setNotesToTextarea("counterpoint", counterpoint);
    renderScore();
    updateDisplays();
    playNoteName(note, 0.65, 1.15, "femaleSample");

    if (selectedIndex < length - 1) {
      selectedIndex += 1;
      renderScore();
      updateDisplays();
    }
  }

function handleKeyboard(event) {
    const tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea") return;

    const key = event.key;

    if (/^[a-hA-H]$/.test(key)) {
      event.preventDefault();
      event.stopPropagation();
      inputLetterNote(key);
      return;
    }

    if (key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      moveSelection(-1);
    } else if (key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      moveSelection(1);
    } else if (key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      moveSelectedNote(1);
    } else if (key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();
      moveSelectedNote(-1);
    } else if (key === " " || event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();
      togglePlayback();
    } else if (key === "Delete" || key === "Backspace") {
      event.preventDefault();
      event.stopPropagation();
      deleteSelectedNote();
    }
  }

  function bindEvents() {
    $("exerciseSelect")?.addEventListener("change", loadSelectedExercise);
    $("loadExerciseButton")?.addEventListener("click", loadSelectedExercise);
    $("loadExampleButton")?.addEventListener("click", loadExample);
    $("refreshScoreButton")?.addEventListener("click", renderScore);
    $("exportMidiButton")?.addEventListener("click", exportMidi);
    $("deleteLastButton")?.addEventListener("click", undoCounterpointNote);
    $("clearCounterpointButton")?.addEventListener("click", clearCounterpoint);
    $("playSelectedButton")?.addEventListener("click", playSelectedNote);
    $("playPauseButton")?.addEventListener("click", togglePlayback);
    $("resetStartButton")?.addEventListener("click", () => stopPlayback(true));
    $("muteCounterpointButton")?.addEventListener("click", () => toggleVoiceMute("counterpoint"));
    $("muteCantusButton")?.addEventListener("click", () => toggleVoiceMute("cantus"));
    $("scoreEditor")?.addEventListener("click", handleScoreClick);
    $("analyzeButton")?.addEventListener("click", analyzeCounterpoint);

    window.addEventListener("keydown", handleKeyboard, { capture: true });
    document.addEventListener("keydown", handleKeyboard, { capture: true });
  }

  function init() {
    populateExercises();
    bindEvents();
    loadSelectedExercise();
    updatePlayPauseButton();
    syncVoiceMuteButtons();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("load", () => {
    if (!$("scoreEditor")?.children.length) init();
  });

  // expose minimal API for inline compatibility
  window.loadSelectedExercise = loadSelectedExercise;
  window.loadExample = loadExample;
  window.setExample = loadExample;
  window.renderScore = renderScore;
  window.undoCounterpointNote = undoCounterpointNote;
  window.clearCounterpoint = clearCounterpoint;
  window.playSelectedNote = playSelectedNote;
  window.togglePlayback = togglePlayback;
  window.stopPlayback = stopPlayback;
  window.analyzeCounterpoint = analyzeCounterpoint;
  window.exportMidi = exportMidi;
  window.toggleVoiceMuteFromButton = toggleVoiceMute;
})();
