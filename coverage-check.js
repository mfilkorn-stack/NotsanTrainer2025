// Temporäres Skript: Prüft welche Datenblatt-Einträge in Quizfragen fehlen
const { MEDICATIONS, INVASIVE, QUIZ_QUESTIONS } = require('./data.js');

function normalize(s) {
  return s.toLowerCase().replace(/[äöüß]/g, m => ({ä:'ae',ö:'oe',ü:'ue',ß:'ss'}[m])).replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isTermCovered(term, questions) {
  const normTerm = normalize(term);
  // Check if the key words of the term appear in any question
  const keywords = normTerm.split(' ').filter(w => w.length > 3);
  if (keywords.length === 0) return true; // skip very short terms

  for (const q of questions) {
    const text = normalize([q.q, ...q.opts, q.explanation].join(' '));
    // At least 60% of keywords must match for coverage
    const matchCount = keywords.filter(kw => text.includes(kw)).length;
    if (matchCount >= Math.ceil(keywords.length * 0.6)) return true;
  }
  return false;
}

// === MEDIKAMENTE ===
const medQuestions = QUIZ_QUESTIONS.filter(q => q.cat === "Medikamente");
console.log(`\n=== MEDIKAMENTE: ${medQuestions.length} Fragen ===\n`);

let totalMissing = 0;
let totalItems = 0;

for (const med of MEDICATIONS) {
  const missing = [];
  const fields = {
    indikationen: med.indikationen || [],
    kontra: med.kontra || [],
    relKontra: med.relKontra || [],
    uaw: med.uaw || [],
  };

  // Also check alter and besonderheiten as single items
  if (med.alter && med.alter !== "Keine Altersbegrenzung") {
    fields.alter = [med.alter];
  }

  for (const [fieldName, items] of Object.entries(fields)) {
    for (const item of items) {
      totalItems++;
      // For medication questions, also check if the medication name + term appears
      const medNorm = normalize(med.name);
      const termNorm = normalize(item);

      // Search in all questions (not just Medikamente cat) for better coverage
      if (!isTermCovered(item, medQuestions)) {
        missing.push({ field: fieldName, item });
        totalMissing++;
      }
    }
  }

  if (missing.length > 0) {
    console.log(`\n${med.name} (${med.id}) - ${missing.length} fehlende Einträge:`);
    for (const m of missing) {
      console.log(`  [${m.field}] ${m.item}`);
    }
  }
}

console.log(`\n--- Medikamente Zusammenfassung: ${totalMissing}/${totalItems} Einträge fehlen ---\n`);

// === INVASIVE MASSNAHMEN ===
const invQuestions = QUIZ_QUESTIONS.filter(q => q.cat === "Invasive Maßnahmen");
console.log(`\n=== INVASIVE MASSNAHMEN: ${invQuestions.length} Fragen ===\n`);

let totalMissingInv = 0;
let totalItemsInv = 0;

for (const inv of INVASIVE) {
  const missing = [];
  const fields = {
    indikationen: inv.indikationen || [],
    kontra: inv.kontra || [],
  };

  // Array fields
  if (Array.isArray(inv.aufklaerung)) fields.aufklaerung = inv.aufklaerung;
  if (Array.isArray(inv.einwilligung)) fields.einwilligung = inv.einwilligung;
  if (Array.isArray(inv.gegenmassnahmen)) fields.gegenmassnahmen = inv.gegenmassnahmen;
  else if (typeof inv.gegenmassnahmen === 'string' && inv.gegenmassnahmen) fields.gegenmassnahmen = [inv.gegenmassnahmen];
  if (Array.isArray(inv.verlaufskontrolle)) fields.verlaufskontrolle = inv.verlaufskontrolle;
  if (Array.isArray(inv.alternativen)) fields.alternativen = inv.alternativen;

  for (const [fieldName, items] of Object.entries(fields)) {
    for (const item of items) {
      totalItemsInv++;
      if (!isTermCovered(item, invQuestions)) {
        missing.push({ field: fieldName, item });
        totalMissingInv++;
      }
    }
  }

  if (missing.length > 0) {
    console.log(`\n${inv.name} (${inv.id}) - ${missing.length} fehlende Einträge:`);
    for (const m of missing) {
      console.log(`  [${m.field}] ${m.item}`);
    }
  }
}

console.log(`\n--- Invasive Maßnahmen Zusammenfassung: ${totalMissingInv}/${totalItemsInv} Einträge fehlen ---\n`);
console.log(`\n=== GESAMT: ${totalMissing + totalMissingInv}/${totalItems + totalItemsInv} Einträge fehlen ===\n`);
