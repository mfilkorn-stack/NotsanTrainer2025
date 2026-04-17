const {
  MEDICATIONS, INVASIVE, LEITSYMPTOME, BPR, SINNHAFT_DATA,
  EKG_DATA, QUIZ_QUESTIONS, CASES, EXAM_CASES, ALGORITHM_DATA,
  APP_VERSION, VERSION_HISTORY
} = require('../data.js');

// ═══════════════════════════════════════════════════════
// MEDIKAMENTE
// ═══════════════════════════════════════════════════════
describe('MEDICATIONS', () => {
  test('sollte mindestens 20 Medikamente enthalten', () => {
    expect(MEDICATIONS.length).toBeGreaterThanOrEqual(20);
  });

  test('alle Medikamente haben Pflichtfelder', () => {
    for (const med of MEDICATIONS) {
      expect(med.id).toBeTruthy();
      expect(med.name).toBeTruthy();
      expect(med.gruppe).toBeTruthy();
      expect(med.konzentration).toBeTruthy();
      expect(Array.isArray(med.indikationen)).toBe(true);
      expect(med.indikationen.length).toBeGreaterThan(0);
      expect(Array.isArray(med.kontra)).toBe(true);
      expect(Array.isArray(med.relKontra)).toBe(true);
      expect(med.dosierung).toBeTruthy();
      expect(Array.isArray(med.uaw)).toBe(true);
      expect(typeof med.besonderheiten).toBe('string');
    }
  });

  test('Medikamenten-IDs sind eindeutig', () => {
    const ids = MEDICATIONS.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ═══════════════════════════════════════════════════════
// INVASIVE MASSNAHMEN
// ═══════════════════════════════════════════════════════
describe('INVASIVE', () => {
  test('sollte mindestens 10 Maßnahmen enthalten', () => {
    expect(INVASIVE.length).toBeGreaterThanOrEqual(10);
  });

  test('alle Maßnahmen haben Pflichtfelder', () => {
    for (const inv of INVASIVE) {
      expect(inv.id).toBeTruthy();
      expect(inv.name).toBeTruthy();
      expect(Array.isArray(inv.indikationen)).toBe(true);
      expect(inv.indikationen.length).toBeGreaterThan(0);
      expect(Array.isArray(inv.kontra)).toBe(true);
      expect(inv.durchfuehrung).toBeTruthy();
    }
  });

  test('IDs sind eindeutig', () => {
    const ids = INVASIVE.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ═══════════════════════════════════════════════════════
// QUIZ-FRAGEN
// ═══════════════════════════════════════════════════════
describe('QUIZ_QUESTIONS', () => {
  test('sollte mindestens 100 Fragen enthalten', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(100);
  });

  test('alle Fragen haben genau 4 Antwortoptionen', () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.opts).toHaveLength(4);
    }
  });

  test('correct-Index ist im gültigen Bereich (0-3)', () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThanOrEqual(3);
      expect(Number.isInteger(q.correct)).toBe(true);
    }
  });

  test('alle Fragen haben eine Erklärung', () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.explanation).toBeTruthy();
      expect(q.explanation.length).toBeGreaterThan(10);
    }
  });

  test('alle Fragen haben eine Kategorie', () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.cat).toBeTruthy();
    }
  });

  test('Fragen-IDs sind eindeutig', () => {
    const ids = QUIZ_QUESTIONS.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('Fragetext ist nicht leer', () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.q).toBeTruthy();
      expect(q.q.length).toBeGreaterThan(5);
    }
  });

  test('Antwortoptionen sind nicht leer', () => {
    for (const q of QUIZ_QUESTIONS) {
      for (const opt of q.opts) {
        expect(opt).toBeTruthy();
        expect(opt.length).toBeGreaterThan(0);
      }
    }
  });

  test('keine doppelten Antwortoptionen innerhalb einer Frage', () => {
    const dups = QUIZ_QUESTIONS.filter(q => {
      const lower = q.opts.map(o => o.trim().toLowerCase());
      return lower.length !== new Set(lower).size;
    });
    if (dups.length > 0) {
      console.error('Doppelte Quiz-Optionen in Fragen mit IDs:', dups.map(q => q.id));
    }
    expect(dups).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════
// FÄLLE (CASES)
// ═══════════════════════════════════════════════════════
describe('CASES', () => {
  test('sollte mindestens 30 Fälle enthalten', () => {
    expect(CASES.length).toBeGreaterThanOrEqual(30);
  });

  test('alle Fälle haben Pflichtfelder', () => {
    for (const c of CASES) {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.bpr).toBeTruthy();
      expect(c.scenario).toBeTruthy();
      expect(Array.isArray(c.steps)).toBe(true);
      expect(c.steps.length).toBeGreaterThan(0);
    }
  });

  test('alle Fall-Steps haben mindestens 2 Optionen', () => {
    for (const c of CASES) {
      for (const step of c.steps) {
        expect(step.opts.length).toBeGreaterThanOrEqual(2);
        expect(step.opts.length).toBeLessThanOrEqual(4);
      }
    }
  });

  test('correct-Index der Steps ist gültig', () => {
    for (const c of CASES) {
      for (const step of c.steps) {
        expect(step.correct).toBeGreaterThanOrEqual(0);
        expect(step.correct).toBeLessThan(step.opts.length);
      }
    }
  });

  test('Fall-IDs sind eindeutig', () => {
    const ids = CASES.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('keine doppelten Antwortoptionen in Trainingsfall-Steps', () => {
    const dups = [];
    CASES.forEach(c => {
      c.steps.forEach((s, si) => {
        const lower = s.opts.map(o => o.trim().toLowerCase());
        if (lower.length !== new Set(lower).size) {
          dups.push({ caseId: c.id, step: si + 1, opts: s.opts });
        }
      });
    });
    if (dups.length > 0) console.error('Doppelte Optionen in Trainingsfall-Steps:', dups);
    expect(dups).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════
// PRÜFUNGSFÄLLE (EXAM_CASES)
// ═══════════════════════════════════════════════════════
describe('EXAM_CASES', () => {
  test('sollte mindestens 40 Prüfungsfälle enthalten', () => {
    expect(EXAM_CASES.length).toBeGreaterThanOrEqual(40);
  });

  test('alle Prüfungsfälle haben Pflichtfelder', () => {
    for (const ec of EXAM_CASES) {
      expect(ec.id).toBeTruthy();
      expect(ec.bpr).toBeTruthy();
      expect(ec.caseId).toBeTruthy();
      expect(ec.meldung).toBeTruthy();
      expect(ec.ankunft).toBeTruthy();
      expect(ec.findings).toBeTruthy();
    }
  });

  test('alle Prüfungsfälle haben genau 4 Diagnoseoptionen', () => {
    for (const ec of EXAM_CASES) {
      expect(ec.diagnoseOptionen).toHaveLength(4);
    }
  });

  test('correctDiagnose ist gültig (0-3)', () => {
    for (const ec of EXAM_CASES) {
      expect(ec.correctDiagnose).toBeGreaterThanOrEqual(0);
      expect(ec.correctDiagnose).toBeLessThanOrEqual(3);
    }
  });

  test('caseId referenziert existierenden Fall', () => {
    const caseIds = new Set(CASES.map(c => c.id));
    for (const ec of EXAM_CASES) {
      expect(caseIds.has(ec.caseId)).toBe(true);
    }
  });

  test('Prüfungsfall-IDs sind eindeutig', () => {
    const ids = EXAM_CASES.map(ec => ec.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('keine doppelten Diagnose-Optionen', () => {
    const dups = EXAM_CASES.filter(ec => {
      const lower = ec.diagnoseOptionen.map(o => o.trim().toLowerCase());
      return lower.length !== new Set(lower).size;
    });
    if (dups.length > 0) console.error('Doppelte Diagnose-Optionen in EXAM_CASES IDs:', dups.map(e => e.id));
    expect(dups).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════
// ALGORITHMEN
// ═══════════════════════════════════════════════════════
describe('ALGORITHM_DATA', () => {
  test('sollte mindestens 30 Algorithmen enthalten', () => {
    expect(ALGORITHM_DATA.length).toBeGreaterThanOrEqual(30);
  });

  test('alle Algorithmen haben Pflichtfelder', () => {
    for (const algo of ALGORITHM_DATA) {
      expect(algo.id).toBeTruthy();
      expect(algo.name).toBeTruthy();
      expect(algo.kat).toBeTruthy();
      expect(Array.isArray(algo.steps)).toBe(true);
      expect(algo.steps.length).toBeGreaterThan(0);
    }
  });

  test('Entscheidungen haben genau 2 Optionen', () => {
    for (const algo of ALGORITHM_DATA) {
      if (algo.decisions) {
        for (const d of algo.decisions) {
          expect(d.opts).toHaveLength(2);
          expect(d.correct === 0 || d.correct === 1).toBe(true);
          expect(d.q).toBeTruthy();
          expect(d.feedback).toBeTruthy();
        }
      }
    }
  });

  test('Lückentexte haben text und answer', () => {
    for (const algo of ALGORITHM_DATA) {
      if (algo.gaps) {
        for (const g of algo.gaps) {
          expect(g.text).toBeTruthy();
          expect(g.answer).toBeTruthy();
        }
      }
    }
  });

  test('Algorithmus-IDs sind eindeutig', () => {
    const ids = ALGORITHM_DATA.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ═══════════════════════════════════════════════════════
// LEITSYMPTOME & BPR
// ═══════════════════════════════════════════════════════
describe('LEITSYMPTOME', () => {
  test('sollte mindestens 5 Leitsymptome enthalten', () => {
    expect(LEITSYMPTOME.length).toBeGreaterThanOrEqual(5);
  });

  test('alle haben id und name', () => {
    for (const ls of LEITSYMPTOME) {
      expect(ls.id).toBeTruthy();
      expect(ls.name).toBeTruthy();
    }
  });
});

describe('BPR', () => {
  test('sollte mindestens 25 Behandlungspfade enthalten', () => {
    expect(BPR.length).toBeGreaterThanOrEqual(25);
  });

  test('alle haben id und name', () => {
    for (const b of BPR) {
      expect(b.id).toBeTruthy();
      expect(b.name).toBeTruthy();
    }
  });

  test('IDs sind eindeutig', () => {
    const ids = BPR.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ═══════════════════════════════════════════════════════
// EKG-DATEN
// ═══════════════════════════════════════════════════════
describe('EKG_DATA', () => {
  test('sollte mindestens 20 EKG-Befunde enthalten', () => {
    expect(EKG_DATA.length).toBeGreaterThanOrEqual(20);
  });

  test('alle haben id und name', () => {
    for (const e of EKG_DATA) {
      expect(e.id).toBeTruthy();
      expect(e.name).toBeTruthy();
    }
  });
});

// ═══════════════════════════════════════════════════════
// VERSION
// ═══════════════════════════════════════════════════════
describe('APP_VERSION', () => {
  test('ist definiert', () => {
    expect(APP_VERSION).toBeTruthy();
  });

  test('VERSION_HISTORY ist nicht leer', () => {
    expect(VERSION_HISTORY.length).toBeGreaterThan(0);
  });
});
