const {
  normalize, gapMatch, getEkgIdForQuiz,
  getScoreColor, getScoreLabel, getTimerColor, calcExamScore
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
