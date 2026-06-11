# Lernen 3.0 – Transformationsplan: Vom Abfrage-Quiz zum Kompetenz-Trainer

**Ziel:** Alle 1.318 Quizfragen werden in das pädagogische Schema des Lern-Moduls
(Bloom-Stufe · Niveau · interaktives Format · getrenntes Feedback) überführt.
Single-Choice („eine Antwort richtig") bleibt nur noch **vereinzelt** dort
bestehen, wo kein anderes Format sicher möglich ist – und in der
Prüfungssimulation, die bewusst das reale Prüfungsformat abbildet.

**Leitplanke (unverändert aus Lernen 2.0):** Es werden **keine neuen
medizinischen Fakten** erzeugt. Jede Transformation formt ausschließlich
vorhandenes, geprüftes Material um (Fragen, Antwortoptionen, Erklärungstexte,
Lexikon-Strukturdaten aus SAA/BPR 2025). Wo eine Regel nicht sicher greift,
bleibt die Frage Single-Choice – mit aufgewertetem Feedback.

---

## 1. Ausgangslage

| Bestand | Umfang | Format | Bloom-Schwerpunkt |
|---|---|---|---|
| `QUIZ_QUESTIONS` | 1.318 | 100 % Single-Choice | Stufe 1–2 (Erinnern/Verstehen) |
| `LERN_QUESTIONS` (Showcase 2.0) | 26 | 6 interaktive Formate | Stufe 2–5 |
| Strukturdaten (Lexikon) | 29 Medikamente · 18 invasive Maßnahmen · 34 BPR · 34 Algorithmen · 26 EKG | – | – |

Problem: Single-Choice trainiert **Wiedererkennen**. Im Einsatz und in der
Prüfung wird aber **aktiver Abruf** (Dosis nennen, nicht ankreuzen),
**Verknüpfen**, **Priorisieren** und **Entscheiden** verlangt.

## 2. Didaktisches Fundament

Die Umbau-Regeln und neuen App-Funktionen setzen fünf evidenzbasierte
Lernprinzipien um:

1. **Active Recall / Testing-Effekt** – Lückentexte erzwingen das aktive
   Erinnern statt des Wiedererkennens einer Option (Format D).
2. **Elaboriertes Feedback** – getrenntes Feedback für richtige und falsche
   Antworten (`fbRight`/`fbWrong`); bei Fehlern wird die korrekte Regel samt
   Begründung genannt, nicht nur „falsch".
3. **Spaced Repetition (Leitner-System)** – falsch beantwortete Aufgaben
   wandern in einen Wiederholungsstapel und werden in wachsenden Abständen
   (sofort → 1 → 3 → 7 Tage) erneut fällig, bis sie „sitzen".
4. **Mastery Learning (Lernpfad)** – pro Kategorie drei Stufen, die dem
   Bloom-Aufbau folgen; die nächste Stufe öffnet sich erst ab 80 % der
   vorherigen. So wird Verstehen vor Anwenden vor Entscheiden gesichert.
5. **Interleaving & Scaffolding** – innerhalb einer Sitzung steigen die
   Aufgaben Bloom-aufsteigend an; der Modus „Alle Kategorien" mischt Themen.

### Bloom-Stufen ↔ Formate ↔ Lernpfad

| Lernpfad-Stufe | Niveau | Bloom | Typische Formate |
|---|---|---|---|
| 1 · Wissen festigen | Basis | 1–2 | Lückentext (gap), Single-Choice mit dualem Feedback |
| 2 · Anwenden & Verknüpfen | Fortgeschritten | 3 | Multi-Select, Zuordnen, Sortieren |
| 3 · Entscheiden wie im Einsatz | Prüfung | 4–5 | Fallvignette, Fehler-Identifikation |

## 3. Transformations-Regeln (deterministisch & sicher)

Die Pipeline `tools/transform-quiz.js` wendet pro Quizfrage die erste
zutreffende Regel an. Jede generierte Aufgabe trägt `src: [Quiz-IDs]` –
damit ist maschinell prüfbar, dass **alle 1.318 Fragen** abgedeckt sind.

| Regel | Erkennung | Transformation | Warum sicher? |
|---|---|---|---|
| **R1 → gap** | Korrekte Option (Zahl oder kurzer Begriff) kommt wörtlich im Erklärungstext vor | Satz aus der Erklärung wird zum Lückentext, korrekte Option wird Lücke | Nur Umformung vorhandener, geprüfter Texte; Antwort bleibt identisch |
| **R2 → error** | Frage enthält „FALSCH/nicht zu/keine…" und Optionen sind ganze Aussagen | Optionen → `statements`, korrekte Option → `errorIndex`, Erklärung → `correction` | Aufgabe war inhaltlich bereits Fehler-Identifikation, nur das Format wird ehrlich |
| **R3 → vignette** | Fragetext beginnt mit Fallbeschreibung („57-jähriger Patient…") und endet mit Fragesatz | Fallteil → `vignette`, Fragesatz → `q` | Reine Textaufteilung, Optionen unverändert |
| **R4 → order** (generiert) | `ALGORITHM_DATA.steps` (34 Algorithmen) | Erste 4–6 Schritte als Sortieraufgabe | Schrittfolge stammt 1:1 aus den BPR-Strukturdaten |
| **R5 → multi** (generiert) | `BPR.medikamente` (Medikamentenbündel pro Pfad) | „Welche Medikamente gehören zum BPR X?"; Distraktoren = Medikamente anderer BPR, programmatisch geprüft ∉ BPR X | Richtige wie falsche Optionen kommen aus demselben geprüften Vokabular; Überschneidung wird per Wirkstoffnamen-Abgleich ausgeschlossen |
| **R6 → match** (generiert) | `MEDICATIONS` (Name ↔ Wirkstoffgruppe ↔ Leitindikation) | Zuordnungsaufgaben in 4er-Blöcken, Eindeutigkeit der rechten Seite wird erzwungen | Paare direkt aus Lexikon-Strukturdaten |
| **R7 → single+** (Rest) | keine Regel greift sicher | Single-Choice bleibt, erhält Bloom-Stufe, Niveau, `fbRight` (= Erklärung) und `fbWrong` (= „Richtig wäre: …" + Erklärung) | Keine inhaltliche Änderung, nur didaktische Anreicherung |

**Schutzmechanismen in R1 (Lückentext):**
- Lücke nur, wenn die Antwort *nicht* bereits im Fragetext steht (kein Leak).
- Nur der Satz mit dem Treffer wird verwendet (kurz, fokussiert).
- Kein Treffer mehrfach im Satz, keine Klammer-Abkürzung direkt nach der
  Lücke (z. B. „___ (VF)" würde die Antwort verraten) → dann bleibt R7.
- Antwortlänge 1–32 Zeichen; Prüfung gegen `gapMatch()` aus `utils.js`.

**Absorption:** Wird eine Quizfrage von R1–R3 umgeformt, ersetzt die neue
Aufgabe die alte 1:1 (`src` = 1 Frage). R4–R6 sind verdichtende Aufgaben aus
Strukturdaten; erkennbar deckungsgleiche Single-Fragen (z. B. „Erster Schritt
bei …?") werden ihnen als `src` zugeschlagen und tauchen nicht doppelt auf.

## 4. Architektur

```
tools/transform-quiz.js   ← deterministische Pipeline (Node, ohne Abhängigkeiten)
        │  liest QUIZ_QUESTIONS + MEDICATIONS/BPR/ALGORITHM_DATA aus data.js
        ▼  schreibt generierten Abschnitt zwischen Marker in data.js
data.js: LERN_QUESTIONS = [ 26 Showcase-Aufgaben (handkuratiert, unverändert)
                            + AUTO-GENERATED-Block (Re-Run jederzeit möglich) ]
        ▼
app.jsx: LernModul 3.0  – Lernpfad (Mastery-Stufen je Kategorie)
                        – Leitner-Wiederholungsstapel („Fällig heute")
                        – Freies Üben (alle Formate, Kategorie-Filter)
utils.js: leitnerUpdate(), leitnerDueIds(), niveauStage() (pur & testbar)
tests/lern.test.js: Invarianten für ALLE Aufgaben + Coverage-Beweis (src ⊇ 1.318 IDs)
```

- **Klassisches Quiz & Prüfungssimulation bleiben bestehen.** Die Prüfung
  bildet bewusst das Single-Choice-Prüfungsformat ab – das sind die
  „vereinzelten Fragen mit nur einer richtigen Antwort" am Ende des Lernwegs.
- **Free/Plus:** Lernen 3.0 spiegelt das Quiz-Gating (frei: Leitsymptome,
  Werkzeuge, Recht & Aufklärung; Plus: übrige Kategorien + „Alle").

## 5. Phasen

| Phase | Inhalt | Status |
|---|---|---|
| 1 | Pipeline `tools/transform-quiz.js` + Generierung aller Aufgaben in `data.js` | diese Iteration |
| 2 | LernModul 3.0: Lernpfad, Leitner-Wiederholung, Bloom-aufsteigende Sitzungen | diese Iteration |
| 3 | Tests: Format-Invarianten auf Gesamtbestand, Coverage-Beweis, Leitner-Logik | diese Iteration |
| 4 | Ausbau (nächste Iterationen): Konfidenz-Abfrage (Metakognition), adaptive Distraktoren aus Fehlerstatistik, Sprachausgabe für Übergabe-Training, Team-Szenarien | offen |

## 6. Qualitätssicherung

- `tests/lern.test.js` prüft **jede** Aufgabe (nicht nur Showcase) auf
  Pflichtfelder, gültige Indizes, eindeutige Optionen, Lücken == Antworten.
- **Coverage-Invariante:** Vereinigung aller `src`-IDs == alle 1.318 Quiz-IDs.
- Pipeline ist idempotent: erneuter Lauf erzeugt identischen Output
  (stabile Sortierung, kein Zufall).
- Bestehende 91 Tests (Quiz, Fälle, Entities, Utils) bleiben unverändert grün.

## 7. Ergebnis des Pipeline-Laufs (Stand: v0.10.0)

**1.606 Aufgaben** = 26 handkuratierte Showcase-Aufgaben (Lernen 2.0,
unverändert) + 1.580 generierte Aufgaben. **Alle 1.318 Quizfragen sind
abgedeckt** (maschinell geprüft, jede Frage genau einmal).

| Format | Anzahl | Quelle |
|---|---|---|
| Lückentext (gap) | 283 | Erklärungs-Cloze (R1), Kurzantwort numerisch (R1b), Algorithmus-Lückentexte (R9) |
| Fallvignette | 129 | 124 Entscheidungspunkte der BPR-Algorithmen (R8) + Textaufteilung (R3) |
| Sortieren (order) | 34 | Algorithmus-Schrittfolgen (R4) |
| Fehler-Identifikation | 33 | Negativ-/Odd-one-out-Fragen (R2) |
| Mehrfachauswahl (multi) | 22 | BPR-Medikamentenbündel (R5) |
| Zuordnen (match) | 14 | Wirkstoffgruppen, Leitindikationen, Dosis-Cluster (R6/R10) |
| Single-Choice+ | 1.065 | Rest mit Bloom/Niveau/dualem Feedback (R7) |

Bloom-Verteilung: Stufe 1: 887 · Stufe 2: 390 · Stufe 3: 141 · Stufe 4: 38 ·
Stufe 5: 124. Niveau: Basis 1.277 · Fortgeschritten 141 · Prüfung 162.

**„Nur noch vereinzelte Single-Choice":** Im Aufgaben-*Bestand* sind noch 67 %
Single-Choice (medizinische Sicherheit geht vor – nur regelhaft sichere
Transformationen wurden automatisiert). In der *Lernerfahrung* gilt das Ziel
bereits jetzt: `composeSession()` deckelt Single-Choice pro Sitzung auf
**max. ~1/3**, interaktive Formate haben Vorrang, und der Leitner-Stapel zieht
bevorzugt die Formate nach, die falsch beantwortet wurden. Phase 4 senkt den
Bestands-Anteil weiter durch kuratierte Handarbeit (Vorlage: die 26
Showcase-Aufgaben) – priorisiert nach Fehlerstatistik der Nutzer.
