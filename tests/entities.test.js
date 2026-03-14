// Entity-Tests benötigen die Daten aus data.js als globale Variablen,
// da entities.js sie direkt referenziert
const data = require('../data.js');

// Globale Variablen setzen, bevor entities.js geladen wird
Object.assign(global, data);

const { buildEntityMap, ENTITY_MAP, ENTITY_KEYS } = require('../entities.js');

describe('ENTITY_MAP', () => {
  test('ist nicht leer', () => {
    expect(Object.keys(ENTITY_MAP).length).toBeGreaterThan(0);
  });

  test('enthält Medikamenten-Einträge', () => {
    // Prüfe ob einige bekannte Medikamente als Entities vorhanden sind
    const keys = Object.keys(ENTITY_MAP);
    const hasAnyMedication = data.MEDICATIONS.some(m =>
      keys.includes(m.name.toLowerCase())
    );
    expect(hasAnyMedication).toBe(true);
  });

  test('enthält Invasive-Maßnahmen-Einträge', () => {
    const keys = Object.keys(ENTITY_MAP);
    const hasAnyInvasive = data.INVASIVE.some(i =>
      keys.includes(i.name.toLowerCase())
    );
    expect(hasAnyInvasive).toBe(true);
  });

  test('alle Entity-Einträge haben tab, id und label', () => {
    for (const [key, entry] of Object.entries(ENTITY_MAP)) {
      expect(entry.tab).toBeTruthy();
      expect(entry.id).toBeTruthy();
      expect(entry.label).toBeTruthy();
    }
  });

  test('tab-Werte sind gültige Kategorien', () => {
    const validTabs = ['meds', 'invasive', 'leitsymptome', 'bpr'];
    for (const [key, entry] of Object.entries(ENTITY_MAP)) {
      expect(validTabs).toContain(entry.tab);
    }
  });
});

describe('ENTITY_KEYS', () => {
  test('ist nach Länge absteigend sortiert', () => {
    for (let i = 1; i < ENTITY_KEYS.length; i++) {
      expect(ENTITY_KEYS[i - 1].length).toBeGreaterThanOrEqual(ENTITY_KEYS[i].length);
    }
  });

  test('enthält alle Keys aus ENTITY_MAP', () => {
    const mapKeys = Object.keys(ENTITY_MAP);
    expect(ENTITY_KEYS.length).toBe(mapKeys.length);
    for (const key of mapKeys) {
      expect(ENTITY_KEYS).toContain(key);
    }
  });
});

describe('buildEntityMap', () => {
  test('gibt ein Objekt zurück', () => {
    const map = buildEntityMap();
    expect(typeof map).toBe('object');
    expect(Object.keys(map).length).toBeGreaterThan(0);
  });

  test('Medikamenten-Aliase verweisen auf korrekte Medikamente', () => {
    const map = buildEntityMap();
    // "epi" sollte auf Epinephrin verweisen
    if (map['epi']) {
      expect(map['epi'].tab).toBe('meds');
    }
    // "o2" sollte auf Sauerstoff verweisen
    if (map['o2']) {
      expect(map['o2'].tab).toBe('meds');
    }
  });
});
