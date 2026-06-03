# Pädagogische Aufwertung – Bloom-Taxonomie-Analyse & interaktive Formate

**Autorin der Analyse:** Dr. Sarah Keller (Rettungsdienstpädagogik)
**Quelle (medizinischer Inhalt):** ausschließlich SAA/BPR 2025 (6-Länder-Arbeitsgruppe). Es werden **keine neuen medizinischen Fakten** eingeführt – verändert wird ausschließlich die **kognitive Tiefe** der Fragestellung und das **Antwortformat**.
**Umsetzung in der App:** Die hier dokumentierten Aufgaben sind als Array `LERN_QUESTIONS` in `data.js` hinterlegt und werden im neuen Bereich **„Lernen"** (`LernModul` in `app.jsx`) interaktiv gerendert.

---

## Methodik

In drei Phasen pro Frage:

1. **Taxonomie-Analyse** (Bloom, revised 2001): Einordnung der *bestehenden* (Single-Choice-)Fragen und Festlegung einer **Ziel-Stufe**.
2. **Überarbeitete Fragestellung**: handlungsorientierte Umformulierung auf die Ziel-Stufe.
3. **Interaktives Format** (A–F): Multi-Select (A), Sortieren (B), Zuordnen (C), Lückentext (D), Fallvignette (E), Fehler-Identifikation (F).

Jede Aufgabe ist mit **Bloom-Stufe**, **Niveau** (Basis / Fortgeschritten / Prüfung) und **getrenntem Feedback** (richtig vs. falsch) versehen.

### Bloom-Stufen (revised)
| Stufe | Name | Typische Verben |
|---|---|---|
| 1 | Erinnern | nennen, benennen, abrufen |
| 2 | Verstehen | erklären, begründen, einordnen |
| 3 | Anwenden | durchführen, anwenden, auswählen |
| 4 | Analysieren | differenzieren, gegenüberstellen, ableiten |
| 5 | Evaluieren | bewerten, entscheiden, priorisieren |
| 6 | Erschaffen | entwerfen, entwickeln |

---

## Phase 1 – Taxonomie-Analyse (Showcase, 26 Aufgaben)

| ID | Frage (Kurzform) | Aktuelle Stufe | Ziel-Stufe | Format | Begründung |
|---|---|---|---|---|---|
| L-med-01 | Maßnahmen Anaphylaxie Grad III | 1 | 3 | A | Von Faktenabruf zu Auswahl korrekter Maßnahmenbündel |
| L-med-02 | Epinephrin-Dosis i.m. (altersgestaffelt) | 1 | 3 | D | Aktives Reproduzieren statt Wiedererkennen |
| L-med-03 | Medikament ↔ Indikation | 1 | 2 | C | Verknüpfen statt isoliertem Abruf |
| L-med-04 | STEMI inferior – Priorität | 2 | 4 | E | Befund analysieren → Therapieentscheidung |
| L-inv-01 | Indikationen i.o.-Zugang | 1 | 3 | A | Indikationsgrenzen anwenden |
| L-inv-02 | i.o. – falsche Aussage erkennen | 2 | 5 | F | Aussage bewerten/Fehler begründen |
| L-inv-03 | Spannungspneumothorax – Maßnahme | 2 | 4 | E | Klinik analysieren → Maßnahme ableiten |
| L-ls-01 | O₂-Steuerung bei COPD | 2 | 4 | E | Hyperkapnierisiko differenzieren |
| L-ls-02 | Maßnahmen Bronchialobstruktion | 1 | 3 | A | Maßnahmenbündel auswählen |
| L-ls-03 | Schock-Leitkriterium RRsyst | 1 | 2 | D | Grenzwert verstehen/reproduzieren |
| L-bpf-01 | BPR Anaphylaxie – Reihenfolge | 1 | 3 | B | Ablauflogik anwenden |
| L-bpf-02 | Reanimation nach 3. Defi | 2 | 4 | E | Situativ richtige Kombination ableiten |
| L-bpf-03 | Krampfanfall – Fehler erkennen | 2 | 5 | F | Vorgehen bewerten (keine orale Manipulation) |
| L-bpf-04 | Amiodaron-Timing | 1 | 2 | single | Faktenfrage mit dualem Feedback |
| L-ekg-01 | Ableitung ↔ Versorgungsgebiet | 2 | 4 | C | Lokalisation zuordnen/ableiten |
| L-ekg-02 | VF erkennen + Konsequenz | 2 | 4 | E | Rhythmus analysieren → Handlung |
| L-ekg-03 | Defibrillierbare Rhythmen | 1 | 3 | A | Klassifikation anwenden |
| L-ueb-01 | SINNHAFT – Reihenfolge | 1 | 2 | B | Schema-Struktur verstehen |
| L-ueb-02 | SINNHAFT – Fehler erkennen | 2 | 4 | F | Alter vs. Geburtsdatum differenzieren |
| L-ueb-03 | SINNHAFT – Lückentext | 1 | 1 | D | Aktiver Abruf statt Wiedererkennen |
| L-wz-01 | GCS-Wertebereich | 1 | 2 | D | Bereich reproduzieren/verstehen |
| L-wz-02 | GCS-Komponente ↔ Maxpunkte | 1 | 2 | C | Zuordnung statt Abruf |
| L-wz-03 | GCS-Kategorien | 1 | 2 | A | Abgrenzen, was NICHT dazugehört |
| L-rec-01 | Transportverweigerung (ACS) | 2 | 5 | E | Rechtssicher entscheiden + begründen |
| L-rec-02 | Einwilligung – Fehler erkennen | 2 | 5 | F | Mutmaßlichen Willen bewerten |
| L-rec-03 | 4 Kriterien Einwilligungsfähigkeit | 1 | 3 | A | Kriterien anwenden/abgrenzen |

### Kommentar zur Ausgangslage

Das bestehende Lernmodul (1.318 Quizfragen) ist – wie für Multiple-Choice-Lernsoftware im Rettungsdienst **typisch** – stark auf die **Bloom-Stufen 1–2 (Erinnern/Verstehen)** konzentriert: nahezu alle Items sind Single-Choice-Faktenfragen mit genau einer richtigen Antwort. Das trainiert Wiedererkennen, aber kaum **Anwenden, Analysieren und Evaluieren** – also genau die Kompetenzen, die in der realen Einsatzsituation und in der praktischen Prüfung gefordert sind. Die Showcase-Überarbeitung hebt 26 repräsentative Aufgaben (alle 8 Kategorien) gezielt auf **Stufe 3–5** und nutzt dafür **handlungsorientierte Formate** mit getrenntem Feedback.

---

## Phase 2 & 3 – Überarbeitete Fragestellungen + interaktive Formate

> Markierung korrekter Antworten: **[richtig]**. Formate: A Multi-Select · B Sortieren · C Zuordnen · D Lückentext · E Vignette · F Fehler-Identifikation.

### Kategorie: Medikamente

**L-med-01**
- ORIGINAL: „Welches Medikament ist Mittel der 1. Wahl bei Anaphylaxie?" (Single-Choice, Faktenabruf)
- TAXONOMIE-STUFE: 1 → 3 (Anwenden)
- ÜBERARBEITETE FRAGE: „Welche DREI Maßnahmen sind beim anaphylaktischen Schock (Grad III) nach SAA/BPR indiziert?"
- FORMAT: A (Multi-Select)
- ANTWORTOPTIONEN: Epinephrin 0,5 mg i.m. **[richtig]** · Vollelektrolytlösung i.v. **[richtig]** · Atropin 0,5 mg i.v. · Bedarfsgerechte Sauerstoffgabe **[richtig]** · Furosemid 40 mg i.v. · Glucose 40 % i.v.
- FEEDBACK (falsch): Atropin, Furosemid und Glucose sind bei der Anaphylaxie nicht indiziert – sie adressieren den Pathomechanismus nicht.
- FEEDBACK (richtig): Epinephrin i.m. (1. Wahl), Volumen (VEL) und O₂; ergänzt durch Dimetinden und Prednisolon (BPR Anaphylaxie).
- NIVEAU: Fortgeschritten

**L-med-02**
- ORIGINAL: „Wie hoch ist die Epinephrin-Dosis i.m. beim Erwachsenen?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 3 (Anwenden)
- ÜBERARBEITETE FRAGE: „Vervollständige die altersabhängige Epinephrin-Dosis i.m. bei Anaphylaxie."
- FORMAT: D (Lückentext)
- ANTWORTOPTIONEN: „>12 J. **0,5** mg, 6–12 J. **0,3** mg, <6 J. **0,15** mg"
- FEEDBACK (falsch): SAA Epinephrin i.m.: >12 J. 0,5 mg, 6–12 J. 0,3 mg, <6 J. 0,15 mg.
- FEEDBACK (richtig): Korrekt – altersgestaffelte i.m.-Dosierung von Epinephrin bei Anaphylaxie.
- NIVEAU: Prüfung

**L-med-03**
- ORIGINAL: „Wofür ist ASS indiziert?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 2 (Verstehen)
- ÜBERARBEITETE FRAGE: „Ordne jedem Medikament die passende Leitindikation zu."
- FORMAT: C (Zuordnen)
- ANTWORTOPTIONEN: ASS ↔ Akutes Koronarsyndrom · Salbutamol ↔ Bronchialobstruktion · Naloxon ↔ Opioidintoxikation · Glucose ↔ Hypoglykämie
- FEEDBACK (falsch): ASS→ACS, Salbutamol→Bronchialobstruktion, Naloxon→Opioidintoxikation, Glucose→Hypoglykämie.
- FEEDBACK (richtig): Alle Zuordnungen korrekt – diese Leitindikationen stehen so in den SAA.
- NIVEAU: Basis

**L-med-04**
- ORIGINAL: „Welche Medikamente gehören zum ACS?" (Single-Choice)
- TAXONOMIE-STUFE: 2 → 4 (Analysieren)
- ÜBERARBEITETE FRAGE: Vignette „68 J., Vernichtungsschmerz, ST-Hebungen II/III/aVF … Welche medikamentöse Maßnahme hat Priorität?"
- FORMAT: E (Fallvignette)
- ANTWORTOPTIONEN: Glyceroltrinitrat ohne i.v.-Zugang · ASS 250 mg i.v. + Heparin 5.000 I.E. i.v. **[richtig]** · Präklinische Lyse durch NotSan · Furosemid 40 mg i.v.
- FEEDBACK (falsch): Beim ACS/STEMI sind ASS + Heparin Basis; Nitro birgt beim Hinterwandinfarkt Hypotonie-Risiko; Lyse ist keine NotSan-Maßnahme.
- FEEDBACK (richtig): Inferiorer STEMI (II/III/aVF → RCA): ASS 250 mg + Heparin 5.000 I.E. i.v. (BPR ACS).
- NIVEAU: Prüfung

### Kategorie: Invasive Maßnahmen

**L-inv-01**
- ORIGINAL: „Wann ist ein i.o.-Zugang indiziert?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 3 (Anwenden)
- ÜBERARBEITETE FRAGE: „In welchen Situationen ist ein i.o.-Zugang nach SAA gerechtfertigt?"
- FORMAT: A (Multi-Select)
- ANTWORTOPTIONEN: Herz-Kreislauf-Stillstand **[richtig]** · lebensbedrohliche Lage mit zwingender parenteraler Indikation UND unmöglichem i.v.-Zugang **[richtig]** · bequemerer Zugang trotz tastbarer Vene · schnellere Infusion beim stabilen Patienten · Routinegabe
- FEEDBACK (falsch): Der i.o.-Zugang ist kein Komfort-Zugang – nur bei vitaler Indikation mit unmöglichem i.v.-Zugang.
- FEEDBACK (richtig): Nur bei Kreislaufstillstand oder lebensbedrohlicher Lage mit unmöglichem i.v.-Zugang (SAA i.o.).
- NIVEAU: Fortgeschritten

**L-inv-02**
- ORIGINAL: „Welche der folgenden ist eine Kontraindikation des i.o.-Zugangs?" (Single-Choice)
- TAXONOMIE-STUFE: 2 → 5 (Evaluieren)
- ÜBERARBEITETE FRAGE: „Welche der folgenden Aussagen zum i.o.-Zugang ist FALSCH?"
- FORMAT: F (Fehler-Identifikation)
- ANTWORTOPTIONEN: Punktionsort proximale Tibia · Fraktur des Zielknochens = KI · **[FALSCH]** „Vorheriger Punktionsversuch am selben Knochen ist erlaubt" · Infektion/Implantat = KI
- FEEDBACK (falsch): Die falsche Aussage ist Nr. 3 – ein vorheriger Punktionsversuch am selben Knochen ist eine KI.
- FEEDBACK (richtig): Richtig erkannt – nach einem Fehlversuch darf derselbe Knochen nicht erneut punktiert werden (Paravasat-Gefahr).
- NIVEAU: Fortgeschritten

**L-inv-03**
- ORIGINAL: „Was ist bei Spannungspneumothorax indiziert?" (Single-Choice)
- TAXONOMIE-STUFE: 2 → 4 (Analysieren)
- ÜBERARBEITETE FRAGE: Vignette „Polytrauma, einseitig fehlendes AG, Halsvenenstauung, RR fallend … welche invasive Maßnahme zuerst?"
- FORMAT: E (Fallvignette)
- ANTWORTOPTIONEN: Thoraxentlastungspunktion links **[richtig]** · i.o.-Zugang rechts · sofortige Intubation · Abwarten bis Notarzt
- FEEDBACK (falsch): Führende Bedrohung ist der Spannungspneumothorax – zuerst Thoraxentlastung.
- FEEDBACK (richtig): Klinik des Spannungspneumothorax → sofortige Thoraxentlastungspunktion (SAA).
- NIVEAU: Prüfung

### Kategorie: Leitsymptome

**L-ls-01**
- ORIGINAL: „Welcher SpO₂-Zielwert gilt bei COPD?" (Single-Choice)
- TAXONOMIE-STUFE: 2 → 4 (Analysieren)
- ÜBERARBEITETE FRAGE: Vignette „72 J., COPD, SpO₂ 84 %, Giemen … wie steuern Sie die Sauerstoffgabe?"
- FORMAT: E (Fallvignette)
- ANTWORTOPTIONEN: Kein O₂ wegen Hyperkapnierisiko · bedarfsgerechte O₂-Gabe, Ziel-SpO₂ 88–92 % **[richtig]** · hochdosiert 15 l/min ohne Zielwert · Ziel-SpO₂ 100 %
- FEEDBACK (falsch): O₂ wird auch bei COPD gegeben – kontrolliert mit Ziel 88–92 %, weder verweigert noch unkontrolliert.
- FEEDBACK (richtig): Bei Hyperkapnierisiko bedarfsgerechte O₂-Gabe, Ziel-SpO₂ 88–92 % (SAA Sauerstoff).
- NIVEAU: Fortgeschritten

**L-ls-02**
- ORIGINAL: „Welches Medikament wird bei Bronchialobstruktion vernebelt?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 3 (Anwenden)
- ÜBERARBEITETE FRAGE: „Welche Maßnahmen gehören nach BPR zur Bronchialobstruktion?"
- FORMAT: A (Multi-Select)
- ANTWORTOPTIONEN: Salbutamol-Vernebelung **[richtig]** · Ipratropiumbromid-Vernebelung **[richtig]** · Prednisolon i.v. **[richtig]** · Furosemid i.v. · Glucose 40 % i.v.
- FEEDBACK (falsch): Furosemid und Glucose haben bei der Bronchialobstruktion keine Indikation.
- FEEDBACK (richtig): Salbutamol + Ipratropium vernebeln, Prednisolon i.v. (BPR Bronchialobstruktion).
- NIVEAU: Fortgeschritten

**L-ls-03**
- ORIGINAL: „Ab welchem RRsyst spricht man von Schock?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 2 (Verstehen)
- ÜBERARBEITETE FRAGE: „Vervollständige das Schock-Leitkriterium."
- FORMAT: D (Lückentext)
- ANTWORTOPTIONEN: „systolischer Blutdruck unter **90** mmHg"
- FEEDBACK (falsch): Der systolische Grenzwert für das Schockkriterium liegt bei < 90 mmHg.
- FEEDBACK (richtig): Korrekt – RRsyst < 90 mmHg ist ein Leitkriterium des Schocks (BPR Schock).
- NIVEAU: Basis

### Kategorie: Behandlungspfade

**L-bpf-01**
- ORIGINAL: „Was ist der erste Schritt bei Anaphylaxie?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 3 (Anwenden)
- ÜBERARBEITETE FRAGE: „Bringe die Schritte des BPR Anaphylaxie in die richtige Reihenfolge."
- FORMAT: B (Sortieren)
- ANTWORTOPTIONEN (Soll-Reihenfolge): 1. Allergenexposition stoppen · 2. A-B-C-D-E-Beurteilung · 3. Epinephrin i.m. · 4. i.v.-Zugang + VEL · 5. Dimetinden i.v. · 6. Prednisolon i.v.
- FEEDBACK (falsch): Erst Auslöser stoppen und ABCDE, dann Epinephrin i.m. (1. Wahl) – Antihistaminikum und Steroid nachgeordnet.
- FEEDBACK (richtig): Korrekte BPR-Reihenfolge der Anaphylaxie-Versorgung.
- NIVEAU: Fortgeschritten

**L-bpf-02**
- ORIGINAL: „Welches Medikament nach der 3. Defibrillation?" (Single-Choice)
- TAXONOMIE-STUFE: 2 → 4 (Analysieren)
- ÜBERARBEITETE FRAGE: Vignette „VF persistiert nach der 3. Defi … welche Medikamentengabe ist korrekt?"
- FORMAT: E (Fallvignette)
- ANTWORTOPTIONEN: nur Atropin 3 mg · Epinephrin 1 mg + Amiodaron 300 mg i.v. **[richtig]** · Amiodaron 150 mg allein · keine Medikamente
- FEEDBACK (falsch): Nach der 3. Defi: Epinephrin 1 mg UND Amiodaron 300 mg; Atropin hat keinen Stellenwert.
- FEEDBACK (richtig): Nach der 3. Defi bei VF/pVT: Epinephrin 1 mg + Amiodaron 300 mg i.v. (BPR ALS).
- NIVEAU: Prüfung

**L-bpf-03**
- ORIGINAL: „Was ist beim Krampfanfall zu tun?" (Single-Choice)
- TAXONOMIE-STUFE: 2 → 5 (Evaluieren)
- ÜBERARBEITETE FRAGE: „Welche Aussage zum Vorgehen beim Krampfanfall ist FALSCH?"
- FORMAT: F (Fehler-Identifikation)
- ANTWORTOPTIONEN: vor Verletzungen schützen · **[FALSCH]** „Beißkeil zwischen die Zähne einbringen" · Midazolam 0,1 mg/kgKG i.v. / 10 mg i.m. · Basismaßnahmen + O₂
- FEEDBACK (falsch): Die falsche Aussage ist Nr. 2 – beim Krampfanfall keine orale Manipulation.
- FEEDBACK (richtig): Richtig – KEINE orale Manipulation (Verletzungs-/Aspirationsgefahr).
- NIVEAU: Prüfung

**L-bpf-04**
- ORIGINAL: „Wann wird Amiodaron erstmals gegeben?" (Single-Choice, unverändert übernommen)
- TAXONOMIE-STUFE: 1 → 2 (Verstehen, durch duales Feedback)
- ÜBERARBEITETE FRAGE: „Wann wird Amiodaron bei der Reanimation erstmals gegeben?"
- FORMAT: single (Single-Choice mit getrenntem Feedback)
- ANTWORTOPTIONEN: nach der 1. Defi · nach der 3. Defi **[richtig]** · sofort bei VF · erst nach der 5. Defi
- FEEDBACK (falsch): Erste Amiodaron-Gabe (300 mg) nach der 3. Defi, zweite (150 mg) nach der 5.
- FEEDBACK (richtig): Amiodaron 300 mg erstmals nach der 3. erfolglosen Defibrillation (BPR ALS).
- NIVEAU: Basis

### Kategorie: EKG-Befunde

**L-ekg-01**
- ORIGINAL: „ST-Hebung in II/III/aVF – welche Koronararterie?" (Single-Choice)
- TAXONOMIE-STUFE: 2 → 4 (Analysieren)
- ÜBERARBEITETE FRAGE: „Ordne den EKG-Ableitungen das passende Infarkt-/Versorgungsgebiet zu."
- FORMAT: C (Zuordnen)
- ANTWORTOPTIONEN: II, III, aVF ↔ inferior (RCA) · V1–V4 ↔ anterior (LAD) · I, aVL, V5–V6 ↔ lateral (RCX/LCX)
- FEEDBACK (falsch): II/III/aVF = inferior (RCA), V1–V4 = anterior (LAD), I/aVL/V5–V6 = lateral.
- FEEDBACK (richtig): Korrekte Lokalisationszuordnung der Infarktgebiete.
- NIVEAU: Fortgeschritten

**L-ekg-02**
- ORIGINAL: „Welcher Rhythmus ist Kammerflimmern?" (Single-Choice)
- TAXONOMIE-STUFE: 2 → 4 (Analysieren)
- ÜBERARBEITETE FRAGE: Vignette „chaotische Flimmerlinie ohne QRS … welcher Rhythmus und welche Konsequenz?"
- FORMAT: E (Fallvignette)
- ANTWORTOPTIONEN: Asystolie – keine Defi · Kammerflimmern (VF) – sofort defibrillieren **[richtig]** · Sinusrhythmus · PEA – nur Kompression
- FEEDBACK (falsch): Das Bild zeigt VF (defibrillierbar) – nicht Asystolie/PEA oder Sinusrhythmus.
- FEEDBACK (richtig): Chaotische Flimmerlinie ohne QRS = VF → sofortige Defibrillation (BPR ALS).
- NIVEAU: Prüfung

**L-ekg-03**
- ORIGINAL: „Ist VF defibrillierbar?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 3 (Anwenden)
- ÜBERARBEITETE FRAGE: „Welche Rhythmen sind defibrillierbar?"
- FORMAT: A (Multi-Select)
- ANTWORTOPTIONEN: Kammerflimmern (VF) **[richtig]** · pulslose VT (pVT) **[richtig]** · Asystolie · PEA
- FEEDBACK (falsch): Nur VF und pVT sind defibrillierbar; bei Asystolie/PEA → CPR + Epinephrin.
- FEEDBACK (richtig): Defibrillierbar sind VF und pVT (BPR ALS).
- NIVEAU: Fortgeschritten

### Kategorie: Übergabe

**L-ueb-01**
- ORIGINAL: „Wofür steht SINNHAFT?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 2 (Verstehen)
- ÜBERARBEITETE FRAGE: „Bringe die Schritte des SINNHAFT-Übergabeschemas in die richtige Reihenfolge."
- FORMAT: B (Sortieren)
- ANTWORTOPTIONEN (Soll-Reihenfolge): S–Start · I–Identifikation · N–Notfallereignis · N–Notfallpriorität · H–Handlungen · A–Anamnese · F–Fazit · T–Teamfragen
- FEEDBACK (falsch): Die Reihenfolge ergibt das Akronym S-I-N-N-H-A-F-T.
- FEEDBACK (richtig): Korrekte SINNHAFT-Reihenfolge.
- NIVEAU: Basis

**L-ueb-02**
- ORIGINAL: „Was wird bei der Identifikation genannt?" (Single-Choice)
- TAXONOMIE-STUFE: 2 → 4 (Analysieren)
- ÜBERARBEITETE FRAGE: „Welche Aussage zum SINNHAFT-Schema ist FALSCH?"
- FORMAT: F (Fehler-Identifikation)
- ANTWORTOPTIONEN: Ruhe herstellen (Start) · **[FALSCH]** „Identifikation nennt Geschlecht, Name, Geburtsdatum" · Symptombeginn beim Notfallereignis · Fazit + Teamfragen am Ende
- FEEDBACK (falsch): Die falsche Aussage ist Nr. 2 – genannt wird das ALTER, nicht das Geburtsdatum.
- FEEDBACK (richtig): Richtig – SINNHAFT nennt das Alter (leichter zu merken), nicht das Geburtsdatum.
- NIVEAU: Fortgeschritten

**L-ueb-03**
- ORIGINAL: „Wie heißt das strukturierte Übergabeschema?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 1 (Erinnern, aktiver Abruf statt Wiedererkennen)
- ÜBERARBEITETE FRAGE: „Vervollständige die Aussage zum Übergabeschema."
- FORMAT: D (Lückentext)
- ANTWORTOPTIONEN: „Das Schema **SINNHAFT** beginnt mit 'Start', bei dem zunächst **Ruhe** hergestellt wird."
- FEEDBACK (falsch): Das Schema heißt SINNHAFT; im Schritt 'Start' wird zuerst Ruhe hergestellt.
- FEEDBACK (richtig): Korrekt – SINNHAFT beginnt mit 'Start' (erst Ruhe, dann Face-to-Face).
- NIVEAU: Basis

### Kategorie: Werkzeuge

**L-wz-01**
- ORIGINAL: „Welchen Maximalwert hat der GCS?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 2 (Verstehen)
- ÜBERARBEITETE FRAGE: „Vervollständige den Wertebereich der Glasgow Coma Scale."
- FORMAT: D (Lückentext)
- ANTWORTOPTIONEN: „von **3** bis **15** Punkten"
- FEEDBACK (falsch): Der GCS-Bereich ist 3 (tiefstes Koma) bis 15 (wach, orientiert).
- FEEDBACK (richtig): GCS: minimal 3, maximal 15 (Augen 4 + verbal 5 + motorisch 6).
- NIVEAU: Basis

**L-wz-02**
- ORIGINAL: „Wie viele Punkte gibt es maximal für die motorische Reaktion?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 2 (Verstehen)
- ÜBERARBEITETE FRAGE: „Ordne jeder GCS-Komponente ihre maximale Punktzahl zu."
- FORMAT: C (Zuordnen)
- ANTWORTOPTIONEN: Augenöffnen ↔ 4 · Verbale Reaktion ↔ 5 · Motorische Reaktion ↔ 6
- FEEDBACK (falsch): Augenöffnen max. 4, verbal max. 5, motorisch max. 6.
- FEEDBACK (richtig): GCS-Maxima: 4 + 5 + 6 = 15.
- NIVEAU: Basis

**L-wz-03**
- ORIGINAL: „Welche drei Kategorien beurteilt der GCS?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 2 (Verstehen, durch Abgrenzung)
- ÜBERARBEITETE FRAGE: „Welche Kategorien werden beim GCS beurteilt?"
- FORMAT: A (Multi-Select)
- ANTWORTOPTIONEN: Augenöffnen **[richtig]** · Verbale Reaktion **[richtig]** · Motorische Reaktion **[richtig]** · Pupillenreaktion · Atemfrequenz
- FEEDBACK (falsch): Pupillenreaktion und Atemfrequenz gehören nicht zum GCS.
- FEEDBACK (richtig): Der GCS beurteilt Augenöffnen, verbale und motorische Reaktion.
- NIVEAU: Basis

### Kategorie: Recht & Aufklärung

**L-rec-01**
- ORIGINAL: „Was gilt bei Transportverweigerung?" (Single-Choice)
- TAXONOMIE-STUFE: 2 → 5 (Evaluieren)
- ÜBERARBEITETE FRAGE: Vignette „50 J., V.a. ACS, lehnt Transport ab, wirkt orientiert … wie gehen Sie vor?"
- FORMAT: E (Fallvignette)
- ANTWORTOPTIONEN: ohne Weiteres akzeptieren und abfahren · Behandlungspflichtigkeit + Einwilligungsfähigkeit prüfen, aufklären, NA hinzuziehen, dokumentieren **[richtig]** · gegen den Willen mitnehmen · nur Polizei rufen
- FEEDBACK (falsch): Auch ein orientierter Patient muss bei hoher Behandlungspflichtigkeit aufgeklärt werden; NA hinzuziehen, dokumentieren – kein Zwang, aber nicht einfach abfahren.
- FEEDBACK (richtig): Hohe Behandlungspflichtigkeit (V.a. ACS): prüfen, aufklären, NA, dokumentieren (BPR Transportverweigerung).
- NIVEAU: Prüfung

**L-rec-02**
- ORIGINAL: „Was gilt bei bewusstlosen Patienten?" (Single-Choice)
- TAXONOMIE-STUFE: 2 → 5 (Evaluieren)
- ÜBERARBEITETE FRAGE: „Welche der folgenden Aussagen ist FALSCH?"
- FORMAT: F (Fehler-Identifikation)
- ANTWORTOPTIONEN: invasive Maßnahme = Körperverletzung, Einwilligung nötig · mutmaßlicher Wille bei Nicht-Einwilligungsfähigen · **[FALSCH]** „ohne schriftliche Einwilligung gar keine Maßnahmen" · Aufklärung der Dringlichkeit angemessen
- FEEDBACK (falsch): Die falsche Aussage ist Nr. 3 – beim Bewusstlosen gilt der mutmaßliche Wille, lebensrettende Maßnahmen erfolgen umgehend.
- FEEDBACK (richtig): Richtig erkannt – auf eine schriftliche Einwilligung zu warten wäre fehlerhaft.
- NIVEAU: Fortgeschritten

**L-rec-03**
- ORIGINAL: „Welche Kriterien gelten für die Einwilligungsfähigkeit?" (Single-Choice)
- TAXONOMIE-STUFE: 1 → 3 (Anwenden)
- ÜBERARBEITETE FRAGE: „Welche vier Kriterien bestimmen die Einwilligungsfähigkeit?"
- FORMAT: A (Multi-Select)
- ANTWORTOPTIONEN: Informationsverständnis **[richtig]** · Informationsverarbeitung **[richtig]** · Bewertung der Informationen **[richtig]** · Bestimmbarkeit des eigenen Willens **[richtig]** · Alter über 18 · Ausweisdokument
- FEEDBACK (falsch): Einwilligungsfähigkeit bemisst sich an den 4 mentalen Kriterien – nicht an Alter oder Ausweis.
- FEEDBACK (richtig): Die 4 Kriterien: Informationsverständnis, -verarbeitung, Bewertung, Bestimmbarkeit des Willens (BPR Einwilligungsfähigkeit).
- NIVEAU: Fortgeschritten

---

## Zusammenfassung der Aufwertung

- **26 Aufgaben** über **alle 8 Kategorien**, durchgängig mit Bloom-Stufe, Niveau und **getrenntem Feedback** (richtig/falsch).
- **Taxonomie-Verschiebung:** von überwiegend Stufe 1–2 (bestehendes Quiz) auf **Stufe 3–5** (16 von 26 Aufgaben auf Stufe ≥ 3).
- **Formatvielfalt:** A Multi-Select (6×), B Sortieren (2×), C Zuordnen (3×), D Lückentext (4×), E Vignette (6×), F Fehler-Identifikation (4×), Single (1×).
- **Technik:** additiver Bereich „Lernen" (`LernModul`); bestehende 1.318 Quizfragen, Fälle, Prüfung und alle Tests bleiben unverändert. Validierung über `tests/lern.test.js`.
- **Quelle:** durchgehend SAA/BPR 2025; keine externen Quellen, keine neuen medizinischen Fakten.

