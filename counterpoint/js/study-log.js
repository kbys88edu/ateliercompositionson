/*
 * Study log — records one line per answered question / analysed exercise,
 * keeps the log in this browser (localStorage), and renders a daily report
 * page that can be printed to PDF, copied as text or sent by e-mail.
 *
 *   <script src="study-log.js" data-site="ear" data-log-url="log/"></script>
 *
 * Trainers call  window.StudyLog.record({ tool, toolLabel, question, answer, ok, timeSec })
 * Checkers call  window.StudyLog.record({ tool, toolLabel, kind: "analysis", question, detail, status, counts })
 */
(() => {
  "use strict";

  const STORAGE_KEY = "acsStudyLog.v1";
  const META_KEY = "acsStudyLog.meta";
  const MAX_ENTRIES = 3000;

  const script = document.currentScript;
  const SITE = (script && script.dataset.site) || "ear";
  const LOG_URL = (script && script.dataset.logUrl) || "";

  const I18N = {
    ja: {
      title: "学習記録",
      fab: "学習記録",
      today: "今日",
      date: "日付",
      learner: "学習者名",
      learnerPlaceholder: "名前（PDFとメールに入ります）",
      note: "先生へのメモ",
      notePlaceholder: "気づいたこと、質問、難しかったところなど",
      total: "合計",
      correct: "正解",
      accuracy: "正答率",
      analyses: "解析",
      questions: "問",
      items: "件",
      noEntries: "この日の記録はまだありません。練習ページで回答や解析をすると自動で記録されます。",
      byTool: "ツール別",
      entries: "記録",
      time: "時刻",
      question: "問題",
      answer: "回答",
      result: "結果",
      ok: "正解",
      ng: "不正解",
      warn: "注意あり",
      error: "禁則あり",
      clean: "問題なし",
      print: "PDFで保存（印刷）",
      copy: "テキストをコピー",
      mail: "メールで共有",
      json: "JSONを書き出す",
      clearDay: "この日の記録を消去",
      clearConfirm: "この日の記録をすべて消去します。よろしいですか？",
      copied: "コピーしました。",
      copyFailed: "コピーできませんでした。テキストを選択して手動でコピーしてください。",
      printHint: "印刷ダイアログで「PDFに保存」を選ぶと PDF として保存できます。",
      mailSubject: "学習記録",
      generated: "作成",
      sec: "秒",
      privacy: "記録はこのブラウザの中にだけ保存されます。別の端末やブラウザには引き継がれません。",
      back: "← 戻る",
      counts: (e, w, ok) => `禁則 ${e} / 注意 ${w} / OK ${ok}`
    },
    en: {
      title: "Study log",
      fab: "Study log",
      today: "Today",
      date: "Date",
      learner: "Learner",
      learnerPlaceholder: "Your name (appears in the PDF and e-mail)",
      note: "Note for the teacher",
      notePlaceholder: "What you noticed, questions, difficult points",
      total: "Total",
      correct: "Correct",
      accuracy: "Accuracy",
      analyses: "Analyses",
      questions: "questions",
      items: "items",
      noEntries: "Nothing recorded on this day yet. Answers and analyses on the practice pages are recorded automatically.",
      byTool: "By tool",
      entries: "Entries",
      time: "Time",
      question: "Question",
      answer: "Answer",
      result: "Result",
      ok: "Correct",
      ng: "Wrong",
      warn: "Warnings",
      error: "Errors",
      clean: "No issues",
      print: "Save as PDF (print)",
      copy: "Copy as text",
      mail: "Share by e-mail",
      json: "Export JSON",
      clearDay: "Clear this day",
      clearConfirm: "Delete every entry of this day?",
      copied: "Copied.",
      copyFailed: "Could not copy. Select the text and copy it manually.",
      printHint: "Choose “Save as PDF” in the print dialog to keep a PDF.",
      mailSubject: "Study log",
      generated: "Generated",
      sec: "s",
      privacy: "The log is stored only in this browser. It does not sync to other devices or browsers.",
      back: "← Back",
      counts: (e, w, ok) => `errors ${e} / warnings ${w} / OK ${ok}`
    },
    fr: {
      title: "Journal d’étude",
      fab: "Journal",
      today: "Aujourd’hui",
      date: "Date",
      learner: "Élève",
      learnerPlaceholder: "Votre nom (figure dans le PDF et l’e-mail)",
      note: "Note pour le professeur",
      notePlaceholder: "Remarques, questions, points difficiles",
      total: "Total",
      correct: "Justes",
      accuracy: "Réussite",
      analyses: "Analyses",
      questions: "questions",
      items: "éléments",
      noEntries: "Rien d’enregistré ce jour. Les réponses et analyses des pages d’exercice sont enregistrées automatiquement.",
      byTool: "Par outil",
      entries: "Entrées",
      time: "Heure",
      question: "Question",
      answer: "Réponse",
      result: "Résultat",
      ok: "Juste",
      ng: "Faux",
      warn: "Avertissements",
      error: "Fautes",
      clean: "Aucun problème",
      print: "Enregistrer en PDF (imprimer)",
      copy: "Copier le texte",
      mail: "Partager par e-mail",
      json: "Exporter en JSON",
      clearDay: "Effacer ce jour",
      clearConfirm: "Supprimer toutes les entrées de ce jour ?",
      copied: "Copié.",
      copyFailed: "Copie impossible. Sélectionnez le texte et copiez-le manuellement.",
      printHint: "Choisissez « Enregistrer en PDF » dans la boîte de dialogue d’impression.",
      mailSubject: "Journal d’étude",
      generated: "Créé le",
      sec: "s",
      privacy: "Le journal n’est conservé que dans ce navigateur. Il n’est pas synchronisé avec d’autres appareils.",
      back: "← Retour",
      counts: (e, w, ok) => `fautes ${e} / avertissements ${w} / OK ${ok}`
    }
  };

  function currentLang() {
    let lang = "ja";
    try {
      if (SITE === "ear") lang = localStorage.getItem("earTrainingLanguage") || document.documentElement.lang || "ja";
      else lang = document.documentElement.lang || "ja";
    } catch (error) {
      lang = document.documentElement.lang || "ja";
    }
    lang = String(lang).slice(0, 2).toLowerCase();
    return I18N[lang] ? lang : "ja";
  }

  function t(key) {
    const lang = currentLang();
    const value = (I18N[lang] && I18N[lang][key]) || I18N.ja[key] || key;
    return value;
  }

  // ---------------------------------------------------------------- storage
  function readAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (error) {
      return [];
    }
  }

  function writeAll(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-MAX_ENTRIES)));
      return true;
    } catch (error) {
      return false;
    }
  }

  function readMeta() {
    try {
      return JSON.parse(localStorage.getItem(META_KEY) || "{}") || {};
    } catch (error) {
      return {};
    }
  }

  function writeMeta(meta) {
    try {
      localStorage.setItem(META_KEY, JSON.stringify(meta));
    } catch (error) {
      // ignore
    }
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function dayKey(ts) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function timeLabel(ts) {
    const d = new Date(ts);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function todayKey() {
    return dayKey(Date.now());
  }

  // ---------------------------------------------------------------- record
  function record(input) {
    if (!input || !input.tool) return null;
    const list = readAll();
    const now = Date.now();
    const entry = {
      id: `${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      ts: new Date(now).toISOString(),
      site: SITE,
      tool: String(input.tool),
      toolLabel: String(input.toolLabel || input.tool),
      kind: input.kind === "analysis" ? "analysis" : "quiz",
      question: input.question == null ? "" : String(input.question),
      answer: input.answer == null ? "" : String(input.answer),
      detail: input.detail == null ? "" : String(input.detail),
      status: input.status || (input.ok === true ? "ok" : input.ok === false ? "ng" : ""),
      timeSec: typeof input.timeSec === "number" && Number.isFinite(input.timeSec) ? Math.round(input.timeSec * 10) / 10 : null,
      counts: input.counts && typeof input.counts === "object" ? input.counts : null
    };

    // An analysis of the same exercise with the same notes within two minutes
    // replaces the previous line instead of piling up duplicates.
    if (entry.kind === "analysis") {
      const last = list[list.length - 1];
      if (last && last.kind === "analysis" && last.tool === entry.tool && last.question === entry.question
          && last.detail === entry.detail && now - Date.parse(last.ts) < 120000) {
        list[list.length - 1] = entry;
        writeAll(list);
        updateFab();
        return entry;
      }
    }

    list.push(entry);
    writeAll(list);
    updateFab();
    return entry;
  }

  function entriesForDay(key) {
    return readAll().filter((entry) => dayKey(entry.ts) === key);
  }

  function days() {
    const seen = new Set();
    readAll().forEach((entry) => seen.add(dayKey(entry.ts)));
    return Array.from(seen).sort().reverse();
  }

  function clearDay(key) {
    writeAll(readAll().filter((entry) => dayKey(entry.ts) !== key));
    updateFab();
  }

  // ---------------------------------------------------------------- summary
  function statusLabel(entry) {
    if (entry.kind === "analysis") {
      if (entry.status === "error") return t("error");
      if (entry.status === "warn") return t("warn");
      return t("clean");
    }
    if (entry.status === "ok") return t("ok");
    if (entry.status === "ng") return t("ng");
    return "";
  }

  function summarize(entries) {
    const quiz = entries.filter((entry) => entry.kind === "quiz");
    const analyses = entries.filter((entry) => entry.kind === "analysis");
    const correct = quiz.filter((entry) => entry.status === "ok").length;
    const byTool = new Map();
    entries.forEach((entry) => {
      const key = entry.tool;
      if (!byTool.has(key)) byTool.set(key, { tool: key, label: entry.toolLabel, total: 0, correct: 0, quiz: 0, analyses: 0 });
      const row = byTool.get(key);
      row.total += 1;
      if (entry.kind === "quiz") {
        row.quiz += 1;
        if (entry.status === "ok") row.correct += 1;
      } else {
        row.analyses += 1;
      }
    });
    return {
      total: entries.length,
      quiz: quiz.length,
      analyses: analyses.length,
      correct,
      accuracy: quiz.length ? Math.round((correct / quiz.length) * 100) : null,
      byTool: Array.from(byTool.values())
    };
  }

  function buildText(key, entries, meta) {
    const s = summarize(entries);
    const lines = [];
    lines.push(`${t("title")} ${key}`);
    if (meta.learner) lines.push(`${t("learner")}: ${meta.learner}`);
    lines.push(`${t("total")}: ${s.quiz} ${t("questions")}` + (s.quiz ? ` / ${t("correct")} ${s.correct} (${s.accuracy}%)` : "")
      + (s.analyses ? ` / ${t("analyses")} ${s.analyses} ${t("items")}` : ""));
    lines.push("");
    s.byTool.forEach((row) => {
      const parts = [];
      if (row.quiz) parts.push(`${row.quiz} ${t("questions")} / ${t("correct")} ${row.correct}`);
      if (row.analyses) parts.push(`${t("analyses")} ${row.analyses}`);
      lines.push(`[${label(row.label)}] ${parts.join(" / ")}`);
      entries.filter((entry) => entry.tool === row.tool).forEach((entry, index) => {
        const mark = entry.kind === "quiz" ? (entry.status === "ok" ? "○" : "×") : (entry.status === "error" ? "×" : entry.status === "warn" ? "△" : "○");
        const time = entry.timeSec != null ? ` ${entry.timeSec}${t("sec")}` : "";
        const answer = entry.answer ? ` → ${entry.answer}` : "";
        const detail = entry.detail && entry.kind === "analysis" ? `  (${entry.detail})` : "";
        lines.push(`  ${index + 1}. ${timeLabel(entry.ts)} ${entry.question}${answer} ${mark}${time}${detail}`);
      });
      lines.push("");
    });
    if (meta.note) {
      lines.push(`${t("note")}:`);
      lines.push(meta.note);
      lines.push("");
    }
    lines.push(`${t("generated")}: ${new Date().toLocaleString()}`);
    return lines.join("\n");
  }

  // ---------------------------------------------------------------- floating link
  let fab = null;

  function updateFab() {
    if (!fab) return;
    const count = entriesForDay(todayKey()).length;
    fab.querySelector("b").textContent = String(count);
    fab.querySelector("span").textContent = t("fab");
  }

  function mountFab() {
    if (!LOG_URL || document.querySelector("[data-study-log-page]")) return;
    fab = document.createElement("a");
    fab.className = "study-log-fab";
    fab.href = LOG_URL;
    fab.setAttribute("data-study-log-fab", "");
    fab.innerHTML = "<span></span><b>0</b>";
    document.body.appendChild(fab);
    updateFab();
  }

  // ---------------------------------------------------------------- report page
  function label(text) {
    const translate = window.EarTrainingLang && window.EarTrainingLang.translateText;
    return translate ? translate(text) : text;
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[ch]));
  }

  function renderPage(root) {
    const meta = readMeta();
    const available = days();
    const selected = root.dataset.day && (available.includes(root.dataset.day) || root.dataset.day === todayKey())
      ? root.dataset.day
      : todayKey();
    const entries = entriesForDay(selected);
    const s = summarize(entries);
    const options = Array.from(new Set([todayKey(), ...available])).sort().reverse();

    root.innerHTML = `
      <div class="study-log-toolbar no-print">
        <label class="study-log-field">
          <span>${t("date")}</span>
          <select data-log-day>
            ${options.map((day) => `<option value="${day}" ${day === selected ? "selected" : ""}>${day}${day === todayKey() ? ` (${t("today")})` : ""}</option>`).join("")}
          </select>
        </label>
        <label class="study-log-field study-log-field-grow">
          <span>${t("learner")}</span>
          <input type="text" data-log-learner value="${escapeHtml(meta.learner || "")}" placeholder="${escapeHtml(t("learnerPlaceholder"))}">
        </label>
      </div>

      <section class="study-log-report">
        <header class="study-log-head">
          <h1>${t("title")} <span class="study-log-day">${selected}</span></h1>
          <div class="study-log-learner-print">${meta.learner ? `${t("learner")}: ${escapeHtml(meta.learner)}` : ""}</div>
        </header>

        <div class="study-log-stats">
          <div><span>${t("total")}</span><strong>${s.quiz}</strong><em>${t("questions")}</em></div>
          <div><span>${t("correct")}</span><strong>${s.correct}</strong></div>
          <div><span>${t("accuracy")}</span><strong>${s.accuracy == null ? "--" : `${s.accuracy}%`}</strong></div>
          <div><span>${t("analyses")}</span><strong>${s.analyses}</strong><em>${t("items")}</em></div>
        </div>

        ${entries.length === 0 ? `<p class="study-log-empty">${t("noEntries")}</p>` : `
        <h2>${t("byTool")}</h2>
        <table class="study-log-table">
          <thead><tr><th></th><th>${t("total")}</th><th>${t("correct")}</th><th>${t("accuracy")}</th><th>${t("analyses")}</th></tr></thead>
          <tbody>
            ${s.byTool.map((row) => `<tr><td>${escapeHtml(label(row.label))}</td><td>${row.quiz}</td><td>${row.correct}</td><td>${row.quiz ? `${Math.round((row.correct / row.quiz) * 100)}%` : "--"}</td><td>${row.analyses}</td></tr>`).join("")}
          </tbody>
        </table>

        <h2>${t("entries")}</h2>
        <table class="study-log-table study-log-entries">
          <thead><tr><th>#</th><th>${t("time")}</th><th></th><th>${t("question")}</th><th>${t("answer")}</th><th>${t("result")}</th></tr></thead>
          <tbody>
            ${entries.map((entry, index) => `
              <tr class="is-${entry.status || "none"}">
                <td>${index + 1}</td>
                <td>${timeLabel(entry.ts)}</td>
                <td>${escapeHtml(label(entry.toolLabel))}</td>
                <td>${escapeHtml(entry.question)}${entry.kind === "analysis" && entry.detail ? `<div class="study-log-detail">${escapeHtml(entry.detail)}</div>` : ""}</td>
                <td>${escapeHtml(entry.answer)}</td>
                <td>${escapeHtml(statusLabel(entry))}${entry.timeSec != null ? `<div class="study-log-detail">${entry.timeSec}${t("sec")}</div>` : ""}</td>
              </tr>`).join("")}
          </tbody>
        </table>`}

        <section class="study-log-note">
          <h2>${t("note")}</h2>
          <textarea class="no-print" data-log-note rows="4" placeholder="${escapeHtml(t("notePlaceholder"))}">${escapeHtml(meta.note || "")}</textarea>
          <div class="study-log-note-print">${escapeHtml(meta.note || "").replace(/\n/g, "<br>")}</div>
        </section>

        <footer class="study-log-foot">${t("generated")}: ${new Date().toLocaleString()}</footer>
      </section>

      <div class="study-log-actions no-print">
        <button type="button" data-log-print>${t("print")}</button>
        <button type="button" data-log-copy>${t("copy")}</button>
        <a data-log-mail href="#">${t("mail")}</a>
        <button type="button" data-log-json>${t("json")}</button>
        <button type="button" class="study-log-danger" data-log-clear ${entries.length ? "" : "disabled"}>${t("clearDay")}</button>
        <p class="study-log-hint">${t("printHint")}<br>${t("privacy")}</p>
        <p class="study-log-message" data-log-message aria-live="polite"></p>
      </div>
    `;

    const message = root.querySelector("[data-log-message]");
    const say = (text) => { message.textContent = text; };

    root.querySelector("[data-log-day]").addEventListener("change", (event) => {
      root.dataset.day = event.target.value;
      renderPage(root);
    });

    root.querySelector("[data-log-learner]").addEventListener("input", (event) => {
      const next = readMeta();
      next.learner = event.target.value.trim();
      writeMeta(next);
      root.querySelector(".study-log-learner-print").textContent = next.learner ? `${t("learner")}: ${next.learner}` : "";
      updateMail();
    });

    root.querySelector("[data-log-note]").addEventListener("input", (event) => {
      const next = readMeta();
      next.note = event.target.value;
      writeMeta(next);
      root.querySelector(".study-log-note-print").innerHTML = escapeHtml(next.note).replace(/\n/g, "<br>");
      updateMail();
    });

    root.querySelector("[data-log-print]").addEventListener("click", () => window.print());

    root.querySelector("[data-log-copy]").addEventListener("click", async () => {
      const text = buildText(selected, entries, readMeta());
      try {
        await navigator.clipboard.writeText(text);
        say(t("copied"));
      } catch (error) {
        say(t("copyFailed"));
      }
    });

    const mail = root.querySelector("[data-log-mail]");
    function updateMail() {
      const text = buildText(selected, entries, readMeta());
      mail.href = `mailto:?subject=${encodeURIComponent(`${t("mailSubject")} ${selected}`)}&body=${encodeURIComponent(text)}`;
    }
    updateMail();

    root.querySelector("[data-log-json]").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify({ day: selected, meta: readMeta(), entries }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `study-log-${selected}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    root.querySelector("[data-log-clear]").addEventListener("click", () => {
      if (!window.confirm(t("clearConfirm"))) return;
      clearDay(selected);
      renderPage(root);
    });
  }

  function mountPage() {
    const root = document.querySelector("[data-study-log-page]");
    if (!root) return;
    renderPage(root);
    document.addEventListener("earTrainingLanguageChanged", () => renderPage(root));
  }

  window.StudyLog = {
    record,
    all: readAll,
    today: () => entriesForDay(todayKey()),
    entriesForDay,
    days,
    clearDay,
    summarize,
    buildText,
    render: mountPage,
    t
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { mountFab(); mountPage(); });
  } else {
    mountFab();
    mountPage();
  }
})();
