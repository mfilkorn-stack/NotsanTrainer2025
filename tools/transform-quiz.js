#!/usr/bin/env node
/**
 * Lernen 3.0 – Transformations-Pipeline
 *
 * Überführt alle QUIZ_QUESTIONS (Single-Choice) deterministisch in das
 * pädagogische Schema des Lern-Moduls (Bloom-Stufe, Niveau, interaktives
 * Format, getrenntes Feedback) und schreibt das Ergebnis als markierten
 * Abschnitt in das LERN_QUESTIONS-Array von data.js.
 *
 * Leitplanke: KEINE neuen medizinischen Fakten. Jede Regel formt nur
 * vorhandenes, geprüftes Material um (Frage, Optionen, Erklärung,
 * Lexikon-Strukturdaten). Greift keine Regel sicher, bleibt die Frage
 * Single-Choice mit aufgewertetem Feedback (R7).
 *
 * Regeln (siehe docs/lernen-3.0-transformationsplan.md):
 *   R2 error    – Negativfragen mit Aussage-Optionen → Fehler-Identifikation
 *   R3 vignette – Fragetext mit Fallbeschreibung → Fallvignette
 *   R1 gap      – Antwort wörtlich in der Erklärung → Lückentext (aktiver Abruf)
 *   R4 order    – ALGORITHM_DATA.steps → Sortieraufgaben (generiert)
 *   R5 multi    – BPR.medikamente → Mehrfachauswahl (generiert)
 *   R6 match    – MEDICATIONS Gruppe/Leitindikation → Zuordnen (generiert)
 *   R7 single+  – Rest: Single-Choice + Bloom/Niveau/duales Feedback
 *
 * Aufruf: node tools/transform-quiz.js [--check]
 *   --check: nur Bericht ausgeben, data.js nicht verändern
 */
"use strict";
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data.js");
const d = require(DATA_PATH);
const { gapMatch } = require(path.join(__dirname, "..", "utils.js"));

const QUIZ = d.QUIZ_QUESTIONS;

// ───────────────────────── Helpers ─────────────────────────

/** Erklärungstext in Sätze zerlegen (Punkt + Großbuchstabe/Ziffer als Grenze). */
function sentences(text) {
  return String(text)
    .split(/(?<=\.)\s+(?=[A-ZÄÖÜ0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function norm(s) {
  return String(s).toLowerCase().replace(/\s+/g, " ").trim();
}

/** Bloom-Stufe einer Single-Choice-Frage heuristisch bestimmen. */
function bloomOfSingle(q) {
  const t = q.q.toLowerCase();
  if (/warum|weshalb|wieso|was bedeutet|woran erkenn|was versteht man|welche aussage|wof(ü|u)r steht|unterschied|im gegensatz|abgrenzung/.test(t)) return 2;
  if (/ma(ß|ss)nahme|mittel der (1\.|ersten) wahl|therapie|behandlung|vorgehen|versorgung|was (tun|geben|unternehmen)|wie (gehen sie vor|reagieren|verfahren)|zuerst|als erstes|priorit(ä|a)t|n(ä|a)chster schritt/.test(t)) return 3;
  return 1;
}

/** Kategorie-Zuordnung für aus Strukturdaten generierte Aufgaben. */
function catOfAlgo(algo) {
  return algo.kat === "Leitsymptome" ? "Leitsymptome" : "Behandlungspfade";
}
function catOfBpr(bpr) {
  return bpr.kategorie === "Rechtliche Grundlagen" ? "Recht & Aufklärung" : "Behandlungspfade";
}

/** Rein numerische Antwort (Zahl + optionale Einheit) – robust per gapMatch prüfbar. */
const NUMERIC_ANS = /^[<>≤≥]?\s*\d+[\d.,\-–\/x]*\s*(mg|µg|ml|g|l\/min|l|mmHg|Joule|J|%|I\.E\.|IE|mg\/kg|min|Minuten|Sekunden|s|cm|mm|Punkte?|Jahre?|Monate?)?\.?$/i;

function niveauOfBloom(bloom) {
  if (bloom <= 2) return "Basis";
  if (bloom === 3) return "Fortgeschritten";
  return "Prüfung";
}

/** Duales Feedback aus vorhandener Erklärung ableiten (kein neuer Inhalt). */
function dualFeedback(q) {
  const expl = q.explanation;
  return {
    fbRight: expl,
    fbWrong: `Richtig wäre: „${q.opts[q.correct]}". ${expl}`,
  };
}

// ───────────────────────── R1: Lückentext (gap) ─────────────────────────
/**
 * Sicherheitsbedingungen:
 *  - Antwort 1–32 Zeichen, ohne ';' (Trennzeichen der Mehrfach-Lücken)
 *  - Antwort steht NICHT im Fragetext (sonst Antwort-Leak)
 *  - genau EIN Vorkommen im Treffersatz der Erklärung
 *  - keine öffnende Klammer direkt nach der Lücke (Abkürzungs-Leak, z. B. "___ (VF)")
 *  - Restsatz bietet genug Kontext (≥ 20 Zeichen)
 */
function tryGap(q) {
  const ans = q.opts[q.correct];
  if (!ans || ans.length < 1 || ans.length > 32 || ans.includes(";") || ans.includes("_")) return null;
  // Negativfragen ("Welche ist KEINE …", "… NICHT …") nie als Lückentext:
  // die Lücke wäre nicht eindeutig beantwortbar (viele sachlich richtige Antworten)
  if (/\bkeine?\b|\bnicht\b/i.test(q.q)) return null;
  if (norm(q.q).includes(norm(ans))) return null;
  const ansLc = ans.toLowerCase();
  const sent = sentences(q.explanation).find((s) => s.toLowerCase().includes(ansLc));
  if (!sent) return null;
  const sentLc = sent.toLowerCase();
  const first = sentLc.indexOf(ansLc);
  if (sentLc.indexOf(ansLc, first + ans.length) !== -1) return null;
  const after = sent.slice(first + ans.length);
  if (/^\s*\(/.test(after)) return null;
  if (sent.length - ans.length < 20) return null;
  const text = sent.slice(0, first) + "___" + after;
  if ((text.match(/___/g) || []).length !== 1) return null;
  if (!gapMatch(ans, ans)) return null;
  const bloom = /\d/.test(ans) ? 1 : 2;
  return {
    id: `L-g-${q.id}`,
    cat: q.cat,
    format: "gap",
    bloom,
    niveau: "Basis",
    src: [q.id],
    q: q.q.replace(/\?$/, "? Vervollständige die Aussage."),
    text,
    answer: ans,
    fbRight: q.explanation,
    fbWrong: `Lösung: ${ans}. ${q.explanation}`,
  };
}

/**
 * R1b: Kurzantwort. Die korrekte Option ist eine reine Zahl(+Einheit) –
 * statt Wiedererkennen wird der Wert aktiv abgerufen und eingetippt.
 * gapMatch() vergleicht numerische Kerne tolerant ("3", "3 mg", "3mg").
 */
function tryKurzantwort(q) {
  const ans = q.opts[q.correct].trim();
  if (!NUMERIC_ANS.test(ans) || ans.includes(";")) return null;
  // Auswahl-Negationen ("Welche Dosis ist NICHT …") nicht als Kurzantwort;
  // Grenzwertfragen ("Ab welchem Alter … NICHT …?") bleiben erlaubt (eindeutig)
  if (/welche[rsn]?\s[^?]*\b(keine?|nicht)\b/i.test(q.q) && !/^(ab|wann|wie lange|bis)\b/i.test(q.q.trim())) return null;
  if (!gapMatch(ans, ans)) return null;
  return {
    id: `L-k-${q.id}`,
    cat: q.cat,
    format: "gap",
    bloom: 1,
    niveau: "Basis",
    src: [q.id],
    q: q.q,
    text: "Antwort: ___",
    answer: ans,
    fbRight: q.explanation,
    fbWrong: `Lösung: ${ans}. ${q.explanation}`,
  };
}

// ───────────────────────── R2: Fehler-Identifikation (error) ─────────────────────────
/**
 * Frage war bereits inhaltlich eine Fehler-Suche ("Welche Aussage ist
 * falsch / trifft nicht zu?") – nur das Format wird umbenannt.
 * Bedingung: alle Optionen sind ganze Aussagen (≥ 25 Zeichen, ≥ 4 Wörter).
 */
function tryError(q) {
  const t = q.q.toLowerCase();
  // Verständnis-/Wertfragen mit Negation sind KEINE Fehler-Suche:
  // "Warum wird X nicht …?" (Antwort = Begründung), "Ab welchem Alter … nicht?" (Antwort = Wert)
  if (/^(warum|weshalb|wieso|ab |wann |wie |in welchen)/.test(t)) return null;
  if (NUMERIC_ANS.test(q.opts[q.correct].trim())) return null;
  // Odd-one-out: "Welches X gehört/zählt/passt/darf/wird/ist … NICHT/KEINE …?"
  // (auch mit Einschub: "ist KEINE relative Kontraindikation")
  const oddOneOut = /(geh(ö|o)rt|z(ä|a)hlt|passt|darf|wird|werden|ist|sind|k(ö|o)nnen|kann|sollte) [^?]*nicht\b|nicht (gegeben|defibrilliert|angewendet|empfohlen|indiziert|zul(ä|a)ssig|erlaubt)|trifft nicht zu|nicht zutreffend|(ist|sind|hat|haben) [^?]*\bkein(e|er|em)?\b|\bkein(e)? (typische|korrekte|richtige|indikation|kontraindikation)/.test(t);
  // Klassische Aussagen-Prüfung: "Welche Aussage ist falsch?"
  const statementStyle = /ist falsch|\bfalsch\b/.test(t) && q.opts.every((o) => o.length >= 25 && o.split(/\s+/).length >= 4);
  if (!oddOneOut && !statementStyle) return null;
  return {
    id: `L-e-${q.id}`,
    cat: q.cat,
    format: "error",
    bloom: 4,
    niveau: "Prüfung",
    src: [q.id],
    q: q.q,
    statements: q.opts,
    errorIndex: q.correct,
    correction: q.explanation,
    fbRight: q.explanation,
    fbWrong: `Die gesuchte Antwort ist Nr. ${q.correct + 1}. ${q.explanation}`,
  };
}

// ───────────────────────── R3: Fallvignette (vignette) ─────────────────────────
/**
 * Fragetext enthält eine Fallbeschreibung und endet mit einem Fragesatz.
 * Reine Textaufteilung: Fallteil → vignette, Fragesatz → q. Optionen unverändert.
 */
function tryVignette(q) {
  if (!/(\d+\s*-?\s*j(ä|a)hrig|patient(in)?\b)/i.test(q.q)) return null;
  const qm = q.q.lastIndexOf("?");
  if (qm === -1) return null;
  const body = q.q.slice(0, qm + 1);
  const lastSentStart = Math.max(body.lastIndexOf(". "), body.lastIndexOf("! "), body.lastIndexOf(": "));
  if (lastSentStart < 40) return null;
  const vignette = body.slice(0, lastSentStart + 1).trim();
  const question = body.slice(lastSentStart + 1).trim();
  if (vignette.length < 40 || question.length < 15 || !question.endsWith("?")) return null;
  const fb = dualFeedback(q);
  return {
    id: `L-v-${q.id}`,
    cat: q.cat,
    format: "vignette",
    bloom: 4,
    niveau: "Prüfung",
    src: [q.id],
    vignette,
    q: question,
    opts: q.opts,
    correct: q.correct,
    fbRight: fb.fbRight,
    fbWrong: fb.fbWrong,
  };
}

// ───────────────────────── R4: Sortieren (order, generiert) ─────────────────────────
/**
 * Schrittfolgen 1:1 aus ALGORITHM_DATA (BPR-Strukturdaten). Absorbiert
 * Quizfragen, die erkennbar nach dem ersten Schritt desselben Algorithmus
 * fragen (konservatives Muster: "erster Schritt/zuerst/Maßnahme zuerst" +
 * Algorithmusname im Fragetext).
 */
function genOrder(absorbed) {
  const items = [];
  for (const algo of d.ALGORITHM_DATA) {
    const steps = algo.steps.slice(0, 6).map((s) => String(s));
    if (steps.length < 4) continue;
    const lower = steps.map((s) => norm(s));
    if (new Set(lower).size !== lower.length) continue;
    const src = [];
    const nameLc = norm(algo.name);
    for (const q of QUIZ) {
      if (absorbed.has(q.id)) continue;
      const t = norm(q.q);
      if (/(erste[rn]? (schritt|ma(ß|ss)nahme)|zuerst|als erstes)/.test(t) && t.includes(nameLc)) {
        src.push(q.id);
        absorbed.add(q.id);
      }
    }
    items.push({
      id: `L-o-${algo.id}`,
      cat: catOfAlgo(algo),
      format: "order",
      bloom: 3,
      niveau: "Fortgeschritten",
      src,
      q: `Bringe die ersten Schritte des Algorithmus „${algo.name}" in die richtige Reihenfolge.`,
      steps,
      fbRight: `${algo.name}: ${steps.join(" → ")}`,
      fbWrong: `Korrekte Reihenfolge (${algo.name}): ${steps.join(" → ")}`,
    });
  }
  return items;
}

// ───────────────────────── R5: Mehrfachauswahl (multi, generiert) ─────────────────────────
/**
 * Korrekte Optionen = Medikamentenliste des BPR (Strukturdaten).
 * Distraktoren = Medikamente ANDERER BPR, programmatisch geprüft, dass sie
 * nicht in der Medikamentenliste des Ziel-BPR stehen (gleiches Vokabular,
 * Namensabgleich → keine semantischen Grauzonen).
 */
function genMulti(absorbed) {
  const items = [];
  const allMeds = [...new Set(d.BPR.flatMap((b) => b.medikamente || []))].sort();
  for (const bpr of d.BPR) {
    const meds = (bpr.medikamente || []).slice(0, 4);
    if (meds.length < 2) continue;
    const medSet = new Set(meds.map(norm));
    const foils = allMeds.filter((m) => !medSet.has(norm(m))).slice(0, Math.max(2, 6 - meds.length));
    if (foils.length < 2) continue;
    const opts = [...meds, ...foils];
    const correct = meds.map((_, i) => i);
    const src = [];
    const nameLc = norm(bpr.name);
    for (const q of QUIZ) {
      if (absorbed.has(q.id)) continue;
      const t = norm(q.q);
      if (/welche medikamente (geh(ö|o)ren|werden|sind)/.test(t) && t.includes(nameLc)) {
        src.push(q.id);
        absorbed.add(q.id);
      }
    }
    items.push({
      id: `L-x-${bpr.id}`,
      cat: catOfBpr(bpr),
      format: "multi",
      bloom: 3,
      niveau: "Fortgeschritten",
      src,
      q: `Welche Medikamente gehören nach BPR „${bpr.name}" zur Versorgung? (Mehrfachauswahl)`,
      opts,
      correct,
      fbRight: `BPR ${bpr.name}: ${meds.join(", ")}.`,
      fbWrong: `Zum BPR ${bpr.name} gehören: ${meds.join(", ")} – die übrigen Optionen stammen aus anderen Behandlungspfaden.`,
    });
  }
  return items;
}

// ───────────────────────── R6: Zuordnen (match, generiert) ─────────────────────────
/**
 * Paare direkt aus dem Medikamenten-Lexikon: Name ↔ Wirkstoffgruppe bzw.
 * Name ↔ Leitindikation. 4er-Blöcke, rechte Seite je Block eindeutig
 * (sonst wäre die Zuordnung mehrdeutig).
 */
function chunkUniquePairs(pairs, chunkSize) {
  const chunks = [];
  let current = [];
  let usedRights = new Set();
  for (const p of pairs) {
    const r = norm(p.right);
    if (usedRights.has(r)) continue;
    current.push(p);
    usedRights.add(r);
    if (current.length === chunkSize) {
      chunks.push(current);
      current = [];
      usedRights = new Set();
    }
  }
  if (current.length >= 3) chunks.push(current);
  return chunks;
}

function genMatch(absorbed) {
  const items = [];
  const groupPairs = d.MEDICATIONS.map((m) => ({ left: m.name, right: m.gruppe })).filter((p) => p.right && p.right.length <= 48);
  chunkUniquePairs(groupPairs, 4).forEach((pairs, i) => {
    const src = [];
    for (const q of QUIZ) {
      if (absorbed.has(q.id)) continue;
      const t = norm(q.q);
      if (/wirkstoffgruppe|welcher gruppe/.test(t) && pairs.some((p) => t.includes(norm(p.left)))) {
        src.push(q.id);
        absorbed.add(q.id);
      }
    }
    items.push({
      id: `L-m-grp-${i + 1}`,
      cat: "Medikamente",
      format: "match",
      bloom: 2,
      niveau: "Basis",
      src,
      q: "Ordne jedem Medikament die passende Wirkstoffgruppe zu.",
      pairs,
      fbRight: pairs.map((p) => `${p.left} → ${p.right}`).join(" · "),
      fbWrong: "Merke: " + pairs.map((p) => `${p.left} → ${p.right}`).join(" · "),
    });
  });
  const indPairs = d.MEDICATIONS.map((m) => ({ left: m.name, right: (m.indikationen || [])[0] })).filter((p) => p.right && p.right.length <= 42);
  chunkUniquePairs(indPairs, 4).forEach((pairs, i) => {
    items.push({
      id: `L-m-ind-${i + 1}`,
      cat: "Medikamente",
      format: "match",
      bloom: 2,
      niveau: "Basis",
      src: [],
      q: "Ordne jedem Medikament seine Leitindikation nach SAA zu.",
      pairs,
      fbRight: pairs.map((p) => `${p.left} → ${p.right}`).join(" · "),
      fbWrong: "Merke: " + pairs.map((p) => `${p.left} → ${p.right}`).join(" · "),
    });
  });
  return items;
}

// ───────────────────────── R8: Entscheidungs-Vignetten (generiert) ─────────────────────────
/**
 * Die Entscheidungspunkte der BPR-Algorithmen (ALGORITHM_DATA.decisions)
 * sind situative Weichenstellungen mit hinterlegtem Feedback – ideale
 * Bloom-5-Aufgaben („Entscheiden wie im Einsatz"). Inhalte 1:1 übernommen.
 */
function genDecisions() {
  const items = [];
  for (const algo of d.ALGORITHM_DATA) {
    (algo.decisions || []).forEach((dec, i) => {
      if (!dec.q || !Array.isArray(dec.opts) || dec.opts.length < 2 || !dec.feedback) return;
      if (new Set(dec.opts.map(norm)).size !== dec.opts.length) return;
      const qm = dec.q.lastIndexOf("?");
      const body = qm === -1 ? dec.q : dec.q.slice(0, qm + 1);
      const split = Math.max(body.lastIndexOf(". "), body.lastIndexOf("! "));
      let situation = "";
      let question = body.trim();
      if (split >= 10 && body.slice(split + 1).trim().length >= 12) {
        situation = body.slice(0, split + 1).trim();
        question = body.slice(split + 1).trim();
      }
      // Telegrammstil ausformulieren (reine Abkürzungs-Expansion, kein neuer Inhalt)
      question = question
        .replace(/(^|\s)V\.a\.\?$/, "$1Welche Verdachtsdiagnose ergibt sich?")
        .replace(/(^|\s)Was tun\?$/, "$1Wie gehen Sie vor?");
      if (question.length <= 13 && !/^(welche|wie|was|wann|wo|warum|wer)/i.test(question)) {
        question = `${question.replace(/\?$/, "")} – wie entscheiden Sie?`;
      }
      const vignette = `Sie arbeiten den Algorithmus „${algo.name}" ab.${situation ? " " + situation : ""}`;
      items.push({
        id: `L-d-${algo.id}-${i + 1}`,
        cat: catOfAlgo(algo),
        format: "vignette",
        bloom: 5,
        niveau: "Prüfung",
        src: [],
        vignette,
        q: question,
        opts: dec.opts,
        correct: dec.correct,
        fbRight: dec.feedback,
        fbWrong: `Richtig wäre: „${dec.opts[dec.correct]}". ${dec.feedback}`,
      });
    });
  }
  return items;
}

// ───────────────────────── R9: Algorithmus-Lückentexte (generiert) ─────────────────────────
/** Fertige Lückentexte aus den BPR-Strukturdaten (ALGORITHM_DATA.gaps). */
function genAlgoGaps() {
  const items = [];
  for (const algo of d.ALGORITHM_DATA) {
    (algo.gaps || []).forEach((g, i) => {
      const blanks = (String(g.text).match(/___/g) || []).length;
      const parts = String(g.answer).split(";");
      if (blanks < 1 || blanks !== parts.length) return;
      if (!parts.every((p) => p.trim() && gapMatch(p, p))) return;
      items.push({
        id: `L-ag-${algo.id}-${i + 1}`,
        cat: catOfAlgo(algo),
        format: "gap",
        bloom: 2,
        niveau: "Basis",
        src: [],
        q: `Vervollständige die Kernaussage des Algorithmus „${algo.name}".`,
        text: g.text,
        answer: g.answer,
        fbRight: `${algo.name}: ${g.text.split("___").map((s, j) => s + (parts[j] || "")).join("")}`,
        fbWrong: `Lösung: ${parts.join(", ")} – ${algo.name}.`,
      });
    });
  }
  return items;
}

// ───────────────────────── R10: Dosis-Zuordnung (match, verdichtend) ─────────────────────────
/**
 * Dosisfragen desselben Templates werden zu Zuordnungsaufgaben verdichtet.
 * Linke Seite = Medikament + Kontext aus der Originalfrage (eindeutig!),
 * rechte Seite = korrekte Option der Originalfrage. Keine neuen Inhalte.
 */
function genDoseMatch(absorbed) {
  const medNames = d.MEDICATIONS.map((m) => m.name.replace(/\s*\(.*\)$/, ""));
  const candidates = [];
  for (const q of QUIZ) {
    if (absorbed.has(q.id)) continue;
    if (!/welche (initial)?dosis|wie hoch.*dosis|maximaldosis|h(ö|o)chstdosis/i.test(q.q)) continue;
    const ans = q.opts[q.correct];
    if (ans.length > 28) continue;
    const drug = medNames.find((n) => norm(q.q).includes(norm(n)));
    if (!drug) continue;
    // Kontext aus der Frage extrahieren, damit die linke Seite eindeutig bleibt
    const route = (q.q.match(/\b(i\.v\.|i\.m\.|i\.o\.|p\.o\.|nasal|buccal|inhalativ|s\.c\.)/i) || [])[0];
    const indMatch = q.q.match(/bei ([^?,.]{3,40})/i);
    let ind = indMatch ? indMatch[1].trim() : null;
    if (ind) {
      ind = ind
        .split("–")[0]
        .replace(/^(der|die|das|dem|den|einer|einem|eines)\s+/i, "")
        .replace(/\s+welche.*$/i, "")
        .replace(/\s+[a-z]$/i, "") // abgeschnittene Einzelbuchstaben (z. B. "i" von "i.v.")
        .trim();
      if (ind.length < 3) ind = null;
    }
    const maxdosis = /maximaldosis|h(ö|o)chstdosis/i.test(q.q);
    const ctxParts = [maxdosis ? "Maximaldosis" : null, ind, route || null].filter(Boolean);
    const left = `${drug}${ctxParts.length ? " (" + ctxParts.join(", ") + ")" : ""}`;
    if (left.length > 64) continue;
    candidates.push({ qid: q.id, left, right: ans });
  }
  const items = [];
  let current = [];
  let usedL = new Set();
  let usedR = new Set();
  const flush = () => {
    if (current.length >= 3) {
      const idx = items.length + 1;
      items.push({
        id: `L-m-dos-${idx}`,
        cat: "Medikamente",
        format: "match",
        bloom: 3,
        niveau: "Fortgeschritten",
        src: current.map((c) => c.qid),
        q: "Ordne jeder Situation die korrekte Dosis nach SAA zu.",
        pairs: current.map((c) => ({ left: c.left, right: c.right })),
        fbRight: current.map((c) => `${c.left} → ${c.right}`).join(" · "),
        fbWrong: "Merke: " + current.map((c) => `${c.left} → ${c.right}`).join(" · "),
      });
      current.forEach((c) => absorbed.add(c.qid));
    }
    current = [];
    usedL = new Set();
    usedR = new Set();
  };
  for (const c of candidates) {
    if (usedL.has(norm(c.left)) || usedR.has(norm(c.right))) continue;
    current.push(c);
    usedL.add(norm(c.left));
    usedR.add(norm(c.right));
    if (current.length === 4) flush();
  }
  flush();
  return items;
}

// ───────────────────────── R7: Single-Choice mit dualem Feedback ─────────────────────────
function upgradeSingle(q) {
  const bloom = bloomOfSingle(q);
  const fb = dualFeedback(q);
  return {
    id: `L-s-${q.id}`,
    cat: q.cat,
    format: "single",
    bloom,
    niveau: niveauOfBloom(bloom),
    src: [q.id],
    q: q.q,
    opts: q.opts,
    correct: q.correct,
    fbRight: fb.fbRight,
    fbWrong: fb.fbWrong,
  };
}

// ───────────────────────── Zusammenbau ─────────────────────────
function buildAll() {
  const absorbed = new Set();
  const generated = [
    ...genOrder(absorbed),
    ...genMulti(absorbed),
    ...genMatch(absorbed),
    ...genDoseMatch(absorbed),
    ...genDecisions(),
    ...genAlgoGaps(),
  ];
  const transformed = [];
  for (const q of QUIZ) {
    if (absorbed.has(q.id)) continue;
    const item = tryError(q) || tryVignette(q) || tryGap(q) || tryKurzantwort(q) || upgradeSingle(q);
    transformed.push(item);
  }
  return [...transformed, ...generated];
}

// ───────────────────────── Validierung ─────────────────────────
function validate(items) {
  const problems = [];
  const covered = new Set(items.flatMap((i) => i.src || []));
  for (const q of QUIZ) if (!covered.has(q.id)) problems.push(`Quizfrage ${q.id} nicht abgedeckt`);
  const ids = items.map((i) => i.id);
  if (new Set(ids).size !== ids.length) problems.push("Doppelte Lern-IDs");
  for (const it of items) {
    if (!it.fbRight || !it.fbWrong) problems.push(`${it.id}: Feedback fehlt`);
    if (!Number.isInteger(it.bloom) || it.bloom < 1 || it.bloom > 6) problems.push(`${it.id}: Bloom ungültig`);
    if (it.format === "gap") {
      const blanks = (it.text.match(/___/g) || []).length;
      if (blanks !== it.answer.split(";").length) problems.push(`${it.id}: Lücken != Antworten`);
    }
  }
  return problems;
}

// ───────────────────────── Serialisierung & data.js-Update ─────────────────────────
const KEY_ORDER = ["id", "cat", "format", "bloom", "niveau", "src", "q", "vignette", "text", "answer", "opts", "correct", "steps", "pairs", "statements", "errorIndex", "correction", "fbRight", "fbWrong"];

function serializeItem(item) {
  const parts = [];
  for (const k of KEY_ORDER) {
    if (!(k in item)) continue;
    parts.push(`${k}:${JSON.stringify(item[k])}`);
  }
  return `{${parts.join(",")}}`;
}

const MARK_START = "// ▼▼ AUTO-GENERATED-LERN (tools/transform-quiz.js) – Abschnitt nicht von Hand editieren ▼▼";
const MARK_END = "// ▲▲ AUTO-GENERATED-LERN ▲▲";

function writeIntoData(items) {
  let text = fs.readFileSync(DATA_PATH, "utf8");
  const block = `${MARK_START}\n${items.map((i) => serializeItem(i) + ",").join("\n")}\n${MARK_END}`;
  if (text.includes(MARK_START)) {
    const start = text.indexOf(MARK_START);
    const end = text.indexOf(MARK_END) + MARK_END.length;
    text = text.slice(0, start) + block + text.slice(end);
  } else {
    const anchor = text.indexOf("var LERN_QUESTIONS = [");
    if (anchor === -1) throw new Error("LERN_QUESTIONS nicht gefunden");
    const close = text.indexOf("\n];", anchor);
    if (close === -1) throw new Error("Array-Ende von LERN_QUESTIONS nicht gefunden");
    // Letztes Showcase-Item endet ohne Komma → Komma ergänzen
    text = text.slice(0, close) + ",\n" + block + text.slice(close);
  }
  fs.writeFileSync(DATA_PATH, text);
}

// ───────────────────────── Bericht ─────────────────────────
function report(items) {
  const byFormat = {};
  const byBloom = {};
  const byNiveau = {};
  items.forEach((i) => {
    byFormat[i.format] = (byFormat[i.format] || 0) + 1;
    byBloom[i.bloom] = (byBloom[i.bloom] || 0) + 1;
    byNiveau[i.niveau] = (byNiveau[i.niveau] || 0) + 1;
  });
  const singlePct = Math.round(((byFormat.single || 0) / items.length) * 100);
  console.log(`Aufgaben gesamt (generiert): ${items.length}`);
  console.log("Formate:", JSON.stringify(byFormat));
  console.log("Bloom:", JSON.stringify(byBloom));
  console.log("Niveau:", JSON.stringify(byNiveau));
  console.log(`Verbleibender Single-Choice-Anteil: ${singlePct} %`);
  console.log(`Abgedeckte Quizfragen: ${new Set(items.flatMap((i) => i.src || [])).size}/${QUIZ.length}`);
}

// ───────────────────────── Main ─────────────────────────
const items = buildAll();
const problems = validate(items);
if (problems.length) {
  console.error("VALIDIERUNG FEHLGESCHLAGEN:");
  problems.slice(0, 20).forEach((p) => console.error(" - " + p));
  process.exit(1);
}
report(items);
if (process.argv.includes("--check")) {
  console.log("(--check: data.js unverändert)");
} else {
  writeIntoData(items);
  console.log("data.js aktualisiert (LERN_QUESTIONS erweitert).");
}
