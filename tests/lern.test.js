const { LERN_QUESTIONS, QUIZ_QUESTIONS } = require('../data.js');
const { gapMatch } = require('../utils.js');

const CATS = [
  "Medikamente", "Invasive Maßnahmen", "Leitsymptome", "Behandlungspfade",
  "EKG-Befunde", "Übergabe", "Werkzeuge", "Recht & Aufklärung"
];
const FORMATS = ["single", "multi", "order", "match", "gap", "vignette", "error"];
const NIVEAUS = ["Basis", "Fortgeschritten", "Prüfung"];

const byFormat = (f) => LERN_QUESTIONS.filter(q => q.format === f);

// ═══════════════════════════════════════════════════════
// GLOBAL / GEMEINSAME FELDER
// ═══════════════════════════════════════════════════════
describe('LERN_QUESTIONS – Grundgerüst', () => {
  test('enthält mindestens 25 Fragen (Showcase ~30)', () => {
    expect(LERN_QUESTIONS.length).toBeGreaterThanOrEqual(25);
  });

  test('IDs sind eindeutig und mit "L-" präfixiert (keine Kollision mit Quiz-IDs)', () => {
    const ids = LERN_QUESTIONS.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(typeof id).toBe('string');
      expect(id.startsWith('L-')).toBe(true);
    }
  });

  test('alle Fragen haben gültige gemeinsame Pflichtfelder', () => {
    for (const q of LERN_QUESTIONS) {
      expect(CATS).toContain(q.cat);
      expect(FORMATS).toContain(q.format);
      expect(Number.isInteger(q.bloom)).toBe(true);
      expect(q.bloom).toBeGreaterThanOrEqual(1);
      expect(q.bloom).toBeLessThanOrEqual(6);
      expect(NIVEAUS).toContain(q.niveau);
      expect(typeof q.q).toBe('string');
      expect(q.q.length).toBeGreaterThan(5);
      expect(q.fbRight).toBeTruthy();
      expect(q.fbWrong).toBeTruthy();
    }
  });

  test('alle 8 Kategorien sind mit je mindestens 3 Fragen vertreten', () => {
    for (const cat of CATS) {
      const n = LERN_QUESTIONS.filter(q => q.cat === cat).length;
      expect(n).toBeGreaterThanOrEqual(3);
    }
  });
});

// ═══════════════════════════════════════════════════════
// FORMAT-SPEZIFISCH
// ═══════════════════════════════════════════════════════
describe('Format single / vignette / error – Single-Choice-Basis', () => {
  test('single & vignette: opts >= 2, correct gültiger Index', () => {
    for (const q of [...byFormat('single'), ...byFormat('vignette')]) {
      expect(Array.isArray(q.opts)).toBe(true);
      expect(q.opts.length).toBeGreaterThanOrEqual(2);
      q.opts.forEach(o => expect(o).toBeTruthy());
      expect(Number.isInteger(q.correct)).toBe(true);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.opts.length);
      const lower = q.opts.map(o => o.trim().toLowerCase());
      expect(new Set(lower).size).toBe(lower.length);
    }
  });

  test('vignette: Szenariotext vorhanden', () => {
    for (const q of byFormat('vignette')) {
      expect(typeof q.vignette).toBe('string');
      expect(q.vignette.length).toBeGreaterThan(10);
    }
  });
});

describe('Format multi (A) – Mehrfachauswahl', () => {
  test('opts >= 3, correct ist Array mit >=2 gültigen, eindeutigen Indizes', () => {
    const multi = byFormat('multi');
    expect(multi.length).toBeGreaterThan(0);
    for (const q of multi) {
      expect(Array.isArray(q.opts)).toBe(true);
      expect(q.opts.length).toBeGreaterThanOrEqual(3);
      expect(Array.isArray(q.correct)).toBe(true);
      expect(q.correct.length).toBeGreaterThanOrEqual(2);
      expect(new Set(q.correct).size).toBe(q.correct.length);
      for (const idx of q.correct) {
        expect(Number.isInteger(idx)).toBe(true);
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(q.opts.length);
      }
      // es muss mindestens eine falsche Option geben
      expect(q.correct.length).toBeLessThan(q.opts.length);
    }
  });
});

describe('Format order (B) – Sortieren', () => {
  test('steps >= 3, alle Strings, eindeutig (Reihenfolge nicht mehrdeutig)', () => {
    const order = byFormat('order');
    expect(order.length).toBeGreaterThan(0);
    for (const q of order) {
      expect(Array.isArray(q.steps)).toBe(true);
      expect(q.steps.length).toBeGreaterThanOrEqual(3);
      q.steps.forEach(s => expect(typeof s).toBe('string') && expect(s).toBeTruthy());
      const lower = q.steps.map(s => s.trim().toLowerCase());
      expect(new Set(lower).size).toBe(lower.length);
    }
  });
});

describe('Format match (C) – Zuordnen', () => {
  test('pairs >= 3, left/right truthy und je eindeutig', () => {
    const match = byFormat('match');
    expect(match.length).toBeGreaterThan(0);
    for (const q of match) {
      expect(Array.isArray(q.pairs)).toBe(true);
      expect(q.pairs.length).toBeGreaterThanOrEqual(3);
      q.pairs.forEach(p => { expect(p.left).toBeTruthy(); expect(p.right).toBeTruthy(); });
      const lefts = q.pairs.map(p => p.left.trim().toLowerCase());
      const rights = q.pairs.map(p => p.right.trim().toLowerCase());
      expect(new Set(lefts).size).toBe(lefts.length);
      expect(new Set(rights).size).toBe(rights.length);
    }
  });
});

describe('Format gap (D) – Lückentext', () => {
  test('text mit ___, Anzahl Lücken == Anzahl answer-Teile, jede Teilantwort truthy', () => {
    const gaps = byFormat('gap');
    expect(gaps.length).toBeGreaterThan(0);
    for (const q of gaps) {
      expect(typeof q.text).toBe('string');
      const blanks = (q.text.match(/___/g) || []).length;
      expect(blanks).toBeGreaterThanOrEqual(1);
      expect(typeof q.answer).toBe('string');
      const parts = q.answer.split(';');
      expect(parts.length).toBe(blanks);
      parts.forEach(p => expect(p.trim().length).toBeGreaterThan(0));
    }
  });

  test('Datenqualität: Musterlösung matcht via gapMatch gegen sich selbst', () => {
    for (const q of byFormat('gap')) {
      for (const a of q.answer.split(';')) {
        expect(gapMatch(a, a)).toBe(true);
      }
    }
  });
});

describe('Format error (F) – Fehler-Identifikation', () => {
  test('statements >= 3, errorIndex gültig, correction vorhanden', () => {
    const errs = byFormat('error');
    expect(errs.length).toBeGreaterThan(0);
    for (const q of errs) {
      expect(Array.isArray(q.statements)).toBe(true);
      expect(q.statements.length).toBeGreaterThanOrEqual(3);
      q.statements.forEach(s => expect(s).toBeTruthy());
      expect(Number.isInteger(q.errorIndex)).toBe(true);
      expect(q.errorIndex).toBeGreaterThanOrEqual(0);
      expect(q.errorIndex).toBeLessThan(q.statements.length);
      expect(q.correction).toBeTruthy();
    }
  });
});

// ═══════════════════════════════════════════════════════
// LERNEN 3.0 – VOLLTRANSFORMATION (tools/transform-quiz.js)
// ═══════════════════════════════════════════════════════
describe('Lernen 3.0 – Coverage-Beweis & Verteilung', () => {
  test('JEDE der 1.318 Quizfragen ist von genau einer Lern-Aufgabe abgedeckt (src)', () => {
    const srcAll = LERN_QUESTIONS.flatMap(q => q.src || []);
    const srcSet = new Set(srcAll);
    expect(srcAll.length).toBe(srcSet.size); // keine Frage doppelt verbaut
    for (const q of QUIZ_QUESTIONS) {
      expect(srcSet.has(q.id)).toBe(true);
    }
  });

  test('Gesamtbestand: > 1.500 Aufgaben, > 30 % interaktive Formate', () => {
    expect(LERN_QUESTIONS.length).toBeGreaterThan(1500);
    const interactive = LERN_QUESTIONS.filter(q => q.format !== 'single').length;
    expect(interactive / LERN_QUESTIONS.length).toBeGreaterThan(0.3);
  });

  test('alle 6 interaktiven Formate sind substanziell vertreten', () => {
    expect(byFormat('gap').length).toBeGreaterThanOrEqual(100);
    expect(byFormat('vignette').length).toBeGreaterThanOrEqual(50);
    expect(byFormat('error').length).toBeGreaterThanOrEqual(20);
    expect(byFormat('order').length).toBeGreaterThanOrEqual(20);
    expect(byFormat('multi').length).toBeGreaterThanOrEqual(15);
    expect(byFormat('match').length).toBeGreaterThanOrEqual(10);
  });

  test('Lernpfad: jede Kategorie hat Basis-Aufgaben (Stufe 1 startbar)', () => {
    for (const cat of CATS) {
      const basis = LERN_QUESTIONS.filter(q => q.cat === cat && q.niveau === 'Basis').length;
      expect(basis).toBeGreaterThanOrEqual(3);
    }
  });

  test('Niveau ↔ Bloom konsistent: Prüfungsniveau verlangt mindestens Verstehen (Bloom ≥ 2)', () => {
    for (const q of LERN_QUESTIONS) {
      if (q.niveau === 'Prüfung') expect(q.bloom).toBeGreaterThanOrEqual(2);
    }
  });
});
