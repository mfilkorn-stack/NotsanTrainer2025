// NotSanTrainer 2025 - Shared Utility Functions
// Used by app.jsx (via <script> tag) and by tests (via import)

function normalize(s) {
  return s.toLowerCase().trim()
    .replace(/[()[\]{}„""''«»]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function gapMatch(userRaw, expectedRaw) {
  if (!userRaw || !expectedRaw) return false;
  const userVal = normalize(userRaw);
  if (!userVal) return false;
  const expected = normalize(expectedRaw);
  // Direct match after normalization
  if (userVal === expected) return true;
  // Extract core numbers for numeric comparison
  const userNums = userVal.replace(/[^0-9.,]/g, "").replace(",", ".");
  const expNums = expected.replace(/[^0-9.,]/g, "").replace(",", ".");
  if (userNums && expNums && userNums === expNums) return true;
  // Split expected by / or , for alternatives
  const expectedParts = expected.split(/[\/,]/).map(p => p.trim()).filter(Boolean);
  if (expectedParts.some(ep => userVal.includes(ep) || ep.includes(userVal))) return true;
  // Check if user typed the essential part (numbers + key word)
  if (userVal.length >= 2 && expected.includes(userVal)) return true;
  if (expected.length >= 2 && userVal.includes(expected)) return true;
  return false;
}

function getEkgIdForQuiz(qId) {
  const map = {
    eq1:"vf", eq2:"stemi_inferior", eq3:"hyperkaliaemie", eq4:"avblock1",
    eq5:"vhf", eq6:"vt", eq7:"lae_ekg", eq8:"hypothermie_ekg",
    eq9:"avblock2_1", eq10:"lsb", eq11:"asystolie", eq12:"stemi_posterior",
    eq13:"torsade", eq14:"torsade", eq15:"perikarditis_ekg", eq16:"vhf",
    eq17:"vhflattern", eq18:"asystolie", eq19:"pea", eq20:"hypokaliaemie",
    eq21:"avblock3", eq22:"avblock2_2", eq23:"lae_ekg", eq24:"rsb",
    eq25:"stemi_inferior", eq26:"vhf", eq27:"svt", eq28:"avblock3",
    eq29:"sinusbrady", eq30:"lsb", eq31:"vf", eq32:"torsade",
    eq33:"torsade", eq34:"pea", eq35:"sinusrhythmus", eq36:"vf",
    eq37:"stemi_inferior", eq38:"perikarditis_ekg", eq39:"pea",
    eq40:"sinusrhythmus", eq41:"lae_ekg", eq42:"sinusrhythmus",
    eq43:"svt", eq44:"stemi_anterior", eq45:"vhf", eq46:"vt",
    eq47:"vf", eq48:"hyperkaliaemie", eq49:"sinusrhythmus", eq50:"stemi_inferior"
  };
  return map[qId] || "sinusrhythmus";
}

function getScoreColor(pct) {
  if (pct >= 80) return "green";
  if (pct >= 60) return "yellow";
  return "accent";
}

function getScoreLabel(pct) {
  if (pct >= 80) return "Sehr gut";
  if (pct >= 60) return "Gut";
  return "Üben";
}

function getTimerColor(timeLeft) {
  if (timeLeft <= 60) return "accent";
  if (timeLeft <= 300) return "orange";
  if (timeLeft <= 600) return "warning";
  return "muted";
}

function calcExamScore(quizScore, caseDiagScore, caseTreatScore, numQuestions, numTreatSteps) {
  const totalScore = quizScore + caseDiagScore + caseTreatScore;
  const totalQuestions = numQuestions + 1 + numTreatSteps;
  return {
    totalScore,
    totalQuestions,
    pct: Math.round(totalScore / totalQuestions * 100),
    passed: Math.round(totalScore / totalQuestions * 100) >= 70
  };
}

// Export for Node.js/Vitest, no-op in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { normalize, gapMatch, getEkgIdForQuiz, getScoreColor, getScoreLabel, getTimerColor, calcExamScore };
}
