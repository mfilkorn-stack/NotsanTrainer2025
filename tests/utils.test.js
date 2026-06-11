const {
  normalize, gapMatch, getEkgIdForQuiz,
  getScoreColor, getScoreLabel, getTimerColor, calcExamScore,
  leitnerUpdate, leitnerDueIds, composeSession
} = require('../utils.js');

// ═══════════════════════════════════════════════════════
// NORMALIZE
// ═══════════════════════════════════════════════════════
describe('normalize', () => {
  test('konvertiert zu Kleinbuchstaben', () => {
    expect(normalize('HALLO')).toBe('hallo');
  });

  test('entfernt Klammern und Anführungszeichen', () => {
    expect(normalize('(Test)')).toBe('test');
    expect(normalize('[Test]')).toBe('test');
    expect(normalize('„Test"')).toBe('test');
  });

  test('normalisiert Leerzeichen', () => {
    expect(normalize('  zu  viel   platz  ')).toBe('zu viel platz');
  });

  test('trimmt Leerzeichen', () => {
    expect(normalize('  test  ')).toBe('test');
  });
});

// ═══════════════════════════════════════════════════════
// GAP MATCH
// ═══════════════════════════════════════════════════════
describe('gapMatch', () => {
  // Null/undefined handling
  test('gibt false bei null/undefined Eingabe', () => {
    expect(gapMatch(null, 'test')).toBe(false);
    expect(gapMatch('test', null)).toBe(false);
    expect(gapMatch(undefined, 'test')).toBe(false);
    expect(gapMatch('', 'test')).toBe(false);
  });

  // Direct match
  test('erkennt exakte Übereinstimmung', () => {
    expect(gapMatch('Thoraxentlastungspunktion', 'Thoraxentlastungspunktion')).toBe(true);
  });

  test('ignoriert Groß-/Kleinschreibung', () => {
    expect(gapMatch('thoraxentlastungspunktion', 'Thoraxentlastungspunktion')).toBe(true);
    expect(gapMatch('CPAP', 'cpap')).toBe(true);
  });

  // Numeric comparison
  test('erkennt numerische Übereinstimmung trotz unterschiedlicher Formatierung', () => {
    expect(gapMatch('0,5 mg', '0.5mg')).toBe(true);
    expect(gapMatch('15', '15 mg/kgKG')).toBe(true);
  });

  // Alternative matching (split by / or ,)
  test('erkennt Alternativen (getrennt durch /)', () => {
    expect(gapMatch('CPAP', 'CPAP/NIV')).toBe(true);
    expect(gapMatch('NIV', 'CPAP/NIV')).toBe(true);
  });

  // Substring matching
  test('erkennt Teilstring-Übereinstimmung', () => {
    expect(gapMatch('Kompression', 'Kompressionsverband')).toBe(true);
    expect(gapMatch('EKG', '12-Kanal-EKG')).toBe(true);
  });

  // No match
  test('gibt false bei komplett unterschiedlichen Eingaben', () => {
    expect(gapMatch('Hund', 'Thoraxentlastungspunktion')).toBe(false);
  });

  // Leere Eingabe nach Normalisierung
  test('gibt false bei nur Leerzeichen', () => {
    expect(gapMatch('   ', 'test')).toBe(false);
  });

  // Semicolon-getrennte Antworten (in data.js Format)
  test('matched Teilantworten aus Semicolon-Format', () => {
    // data.js hat z.B. "15;1000;Repetition" als answer
    expect(gapMatch('15', '15')).toBe(true);
    expect(gapMatch('1000', '1000')).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════
// GET EKG ID FOR QUIZ
// ═══════════════════════════════════════════════════════
describe('getEkgIdForQuiz', () => {
  test('gibt korrektes EKG-ID für bekannte Quiz-Fragen', () => {
    expect(getEkgIdForQuiz('eq1')).toBe('vf');
    expect(getEkgIdForQuiz('eq2')).toBe('stemi_inferior');
    expect(getEkgIdForQuiz('eq5')).toBe('vhf');
    expect(getEkgIdForQuiz('eq11')).toBe('asystolie');
    expect(getEkgIdForQuiz('eq35')).toBe('sinusrhythmus');
    expect(getEkgIdForQuiz('eq44')).toBe('stemi_anterior');
  });

  test('gibt sinusrhythmus als Fallback für unbekannte IDs', () => {
    expect(getEkgIdForQuiz('eq999')).toBe('sinusrhythmus');
    expect(getEkgIdForQuiz('unknown')).toBe('sinusrhythmus');
    expect(getEkgIdForQuiz('')).toBe('sinusrhythmus');
  });
});

// ═══════════════════════════════════════════════════════
// SCORE COLOR & LABEL
// ═══════════════════════════════════════════════════════
describe('getScoreColor', () => {
  test('gibt green für >= 80%', () => {
    expect(getScoreColor(80)).toBe('green');
    expect(getScoreColor(100)).toBe('green');
    expect(getScoreColor(95)).toBe('green');
  });

  test('gibt yellow für >= 60% und < 80%', () => {
    expect(getScoreColor(60)).toBe('yellow');
    expect(getScoreColor(79)).toBe('yellow');
    expect(getScoreColor(70)).toBe('yellow');
  });

  test('gibt accent für < 60%', () => {
    expect(getScoreColor(59)).toBe('accent');
    expect(getScoreColor(0)).toBe('accent');
    expect(getScoreColor(30)).toBe('accent');
  });
});

describe('getScoreLabel', () => {
  test('gibt korrektes Label für Prozentbereiche', () => {
    expect(getScoreLabel(80)).toBe('Sehr gut');
    expect(getScoreLabel(100)).toBe('Sehr gut');
    expect(getScoreLabel(60)).toBe('Gut');
    expect(getScoreLabel(79)).toBe('Gut');
    expect(getScoreLabel(59)).toBe('Üben');
    expect(getScoreLabel(0)).toBe('Üben');
  });
});

// ═══════════════════════════════════════════════════════
// TIMER COLOR
// ═══════════════════════════════════════════════════════
describe('getTimerColor', () => {
  test('gibt accent für <= 60 Sekunden', () => {
    expect(getTimerColor(60)).toBe('accent');
    expect(getTimerColor(1)).toBe('accent');
    expect(getTimerColor(0)).toBe('accent');
  });

  test('gibt orange für <= 300 Sekunden (5 min)', () => {
    expect(getTimerColor(300)).toBe('orange');
    expect(getTimerColor(61)).toBe('orange');
    expect(getTimerColor(200)).toBe('orange');
  });

  test('gibt warning für <= 600 Sekunden (10 min)', () => {
    expect(getTimerColor(600)).toBe('warning');
    expect(getTimerColor(301)).toBe('warning');
  });

  test('gibt muted für > 600 Sekunden', () => {
    expect(getTimerColor(601)).toBe('muted');
    expect(getTimerColor(2400)).toBe('muted');
  });
});

// ═══════════════════════════════════════════════════════
// EXAM SCORE CALCULATION
// ═══════════════════════════════════════════════════════
describe('calcExamScore', () => {
  test('berechnet Gesamtscore und Prozent korrekt', () => {
    const result = calcExamScore(20, 1, 5, 25, 5);
    expect(result.totalScore).toBe(26);
    expect(result.totalQuestions).toBe(31);
    expect(result.pct).toBe(84);
    expect(result.passed).toBe(true);
  });

  test('erkennt bestandene Prüfung (>= 70%)', () => {
    const result = calcExamScore(18, 1, 5, 25, 5);
    // 24/31 = 77.4%
    expect(result.passed).toBe(true);
  });

  test('erkennt nicht bestandene Prüfung (< 70%)', () => {
    const result = calcExamScore(10, 0, 2, 25, 5);
    // 12/31 = 38.7%
    expect(result.passed).toBe(false);
  });

  test('Grenzfall genau 70%', () => {
    // 7/10 = 70%
    const result = calcExamScore(6, 1, 0, 8, 1);
    expect(result.pct).toBe(70);
    expect(result.passed).toBe(true);
  });

  test('Grenzfall knapp unter 70%', () => {
    // 21/31 = 67.7% → gerundet 68%
    const result = calcExamScore(17, 0, 4, 25, 5);
    expect(result.pct).toBe(68);
    expect(result.passed).toBe(false);
  });
});

describe('gapMatch – aktiver Abruf wird nicht durch Mini-Schnipsel ausgehebelt', () => {
  test('beliebige 2-Zeichen-Teilstrings gelten NICHT als richtig', () => {
    expect(gapMatch('ll', 'Vollelektrolytlösung')).toBe(false);
    expect(gapMatch('un', 'Thoraxentlastungspunktion')).toBe(false);
  });

  test('Dezimalzahlen zerfallen nicht in falsche Alternativen', () => {
    expect(gapMatch('0', '0,5 mg')).toBe(false);
    expect(gapMatch('0,5', '0,5 mg')).toBe(true);
  });

  test('sinnvolle Token und Token-Präfixe gelten weiterhin', () => {
    expect(gapMatch('EKG', '12-Kanal-EKG')).toBe(true);
    expect(gapMatch('Kompression', 'Kompressionsverband')).toBe(true);
  });
});

const DAY = 86400000;

describe('leitnerUpdate – Spaced Repetition', () => {
  test('falsche Antwort → Box 1, sofort fällig', () => {
    const e = leitnerUpdate({ box: 3, due: 0 }, false, 1000);
    expect(e.box).toBe(1);
    expect(e.due).toBe(1000);
  });

  test('richtige Antworten steigen Box für Box mit wachsenden Intervallen', () => {
    let e = leitnerUpdate(undefined, true, 0);
    expect(e.box).toBe(1);
    e = leitnerUpdate(e, true, 0);
    expect(e.box).toBe(2);
    expect(e.due).toBe(1 * DAY);
    e = leitnerUpdate(e, true, 0);
    expect(e.box).toBe(3);
    expect(e.due).toBe(3 * DAY);
    e = leitnerUpdate(e, true, 0);
    expect(e.box).toBe(4); // gemeistert
    e = leitnerUpdate(e, true, 0);
    expect(e.box).toBe(4); // bleibt gedeckelt
  });
});

describe('leitnerDueIds – Fälligkeit', () => {
  const deck = {
    a: { box: 1, due: 100 },   // fällig
    b: { box: 2, due: 5000 },  // noch nicht fällig
    c: { box: 4, due: 0 },     // gemeistert → nie fällig
  };
  test('liefert nur fällige, nicht gemeisterte Aufgaben', () => {
    expect(leitnerDueIds(deck, 1000)).toEqual(['a']);
  });
  test('leeres/fehlendes Deck → leere Liste', () => {
    expect(leitnerDueIds({}, 1000)).toEqual([]);
    expect(leitnerDueIds(undefined, 1000)).toEqual([]);
  });
});

describe('composeSession – Single-Choice nur vereinzelt, Bloom-aufsteigend', () => {
  const mk = (n, format, bloom) => Array.from({ length: n }, (_, i) => ({ id: `${format}${i}`, format, bloom }));

  test('bei genug interaktiven Aufgaben ist Single-Choice auf ~1/3 gedeckelt', () => {
    const pool = [...mk(20, 'gap', 1), ...mk(20, 'single', 1)];
    const s = composeSession(pool, 10);
    expect(s.length).toBe(10);
    expect(s.filter(i => i.format === 'single').length).toBeLessThanOrEqual(4);
  });

  test('zu wenig Interaktive → Singles füllen auf volle Sitzungsgröße auf', () => {
    const pool = [...mk(2, 'multi', 3), ...mk(20, 'single', 1)];
    const s = composeSession(pool, 10);
    expect(s.length).toBe(10);
    expect(s.filter(i => i.format !== 'single').length).toBe(2);
  });

  test('Ergebnis ist Bloom-aufsteigend sortiert (Scaffolding)', () => {
    const pool = [...mk(5, 'vignette', 5), ...mk(5, 'gap', 1), ...mk(5, 'multi', 3)];
    const s = composeSession(pool, 12);
    const blooms = s.map(i => i.bloom);
    expect([...blooms].sort((a, b) => a - b)).toEqual(blooms);
  });

  test('kleiner Pool als Sitzungsgröße → alle Aufgaben einmal', () => {
    const pool = [...mk(3, 'gap', 1), ...mk(2, 'single', 2)];
    expect(composeSession(pool, 10).length).toBe(5);
  });
});
