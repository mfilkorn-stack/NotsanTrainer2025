# NotSanTrainer 2025

Trainingsapp für Notfallsanitäter – SAA und BPR 2025 – 6-Länder-Arbeitsgruppe

## Funktionen

- **Lernen 3.0** – 1.606 Aufgaben nach Bloom-Taxonomie: Lückentexte, Zuordnen, Sortieren, Mehrfachauswahl, Fallvignetten, Fehler-Identifikation; Lernpfad mit Mastery-Stufen, Leitner-Spaced-Repetition und dualem Feedback (siehe `docs/lernen-3.0-transformationsplan.md`)
- **Nachschlagewerk** – 29 Medikamente, 18 Invasive Maßnahmen, 7 Leitsymptome, 31 Krankheitsbilder, 26 EKG-Befunde, 8 Übergabe-Schemata, 24 Werkzeuge
- **Multiple-Choice Quiz** – 1.318 Fragen in 8 Kategorien mit Erläuterungen
- **Fallsimulationen** – Trainingsfälle, Prüfungsfälle, Algorithmus-Trainer
- **Gesamtprüfung** – 30 Fragen + 1 Prüfungsfall mit Timer
- **Statistik** – Lernfortschritt & Schwachstellen-Analyse
- **Offline-fähig** – Alle Daten lokal, kein Server nötig

> Die Lern-Aufgaben werden deterministisch aus den Quizfragen und den
> SAA/BPR-Strukturdaten generiert: `node tools/transform-quiz.js`
> (idempotent, schreibt den markierten Abschnitt in `data.js`).

## Deployment auf GitHub Pages

### 1. Repository erstellen

1. Auf [github.com](https://github.com) ein neues Repository erstellen (z.B. `notsan-trainer`)
2. Alle 4 Dateien hochladen:
   - `index.html`
   - `data.js`
   - `entities.js`
   - `app.jsx`

### 2. GitHub Pages aktivieren

1. Im Repository → **Settings** → **Pages**
2. Unter "Source" → **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)**
4. **Save** klicken
5. Nach ca. 1 Minute ist die App unter `https://DEIN-USERNAME.github.io/notsan-trainer/` erreichbar

### Alternativ: Manuell testen

Die App kann auch lokal getestet werden:

```bash
# Einfachen Webserver starten (Python)
python3 -m http.server 8000

# Oder mit Node.js
npx serve .
```

Dann `http://localhost:8000` im Browser öffnen.

> **Hinweis:** Die Dateien können NICHT direkt per `file://` geöffnet werden (Browser blockiert Cross-Origin-Requests für lokale Dateien). Ein lokaler Webserver ist erforderlich.

## Dateistruktur

```
notsan-trainer/
├── index.html       # Hauptseite (Ladebildschirm, CDN-Links)
├── data.js          # Alle Fachdaten (Medikamente, Fälle, Quiz etc.)
├── entities.js      # Verlinkungssystem für Querverweise
├── app.jsx          # React-Komponenten (UI, Logik)
└── README.md        # Diese Datei
```

## Technologie

- **React 18** (CDN)
- **Babel Standalone** (JSX-Transpilierung im Browser)
- **Vanilla CSS-in-JS** (keine externen CSS-Frameworks)
- **localStorage** für Lernfortschritt-Speicherung

## Quelle

SAA und BPR 2025 – Standardarbeitsanweisungen und Behandlungspfade im Rettungsdienst  
ÄLRD Baden-Württemberg, Brandenburg, Mecklenburg-Vorpommern, Nordrhein-Westfalen, Sachsen, Sachsen-Anhalt  
Stand: Juli 2025
