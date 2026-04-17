# CRM-Modul · Sales-Mockup

Klickbares Single-File-Mockup für Pitch-Termine mit
**Ärztlichen Leitern Rettungsdienst (ÄLRD)**.

Zweck: das geplante CRM-Modul des NotSan Trainers visuell greifbar machen,
den Lizenz-Case für den Rettungsdienstbereich positionieren.

---

## Inhalt

- `index.html` – komplettes Mockup (Single-File, keine Build-Schritte)
- `README.md` – diese Datei

Begleitpapiere (im Repo-Root):
- `../crm_modul_konzept.md` – Pitch-Begleitpapier, 1 Seite
- `../crm_kerninhalte.md` – fachliches Rohmaterial mit Quellen

---

## Mockup öffnen

Drei gleichwertige Wege:

### 1. Direkt im Browser (einfachste Variante)

Datei `index.html` per Doppelklick öffnen. Das Mockup kommt ohne
externe Skripte aus, alle Inhalte sind inline – funktioniert offline.

### 2. Lokaler Webserver (empfohlen für saubere Darstellung)

```bash
cd crm-mockup
python3 -m http.server 8080
# dann http://localhost:8080 im Browser
```

### 3. Als ZIP weitergeben

Der Ordner ist in sich geschlossen. Der gepackte Stand liegt unter
`../crm-mockup.zip` und lässt sich per E-Mail an ÄLRD-Kontakte
weitergeben.

---

## Klickpfad durch den Pitch (empfohlen, ~2-3 Min)

1. **Pitch-Einstieg** (Startbildschirm) – Kernbotschaft, 80 %-Zahl,
   drei Nutzenargumente.
2. **„Mockup starten"** → **Hauptmenü** mit der neuen CRM-Kachel.
3. **CRM-Kachel** → **Modulstart** mit Kompetenzlandkarte.
4. **Theorie-Karten** öffnen → Leitsatz 7 (Kommunikation).
5. Zurück zum Modul → **Szenario-Training** → **Fall 1 ACS**.
6. **Entscheidungspunkt** beantworten (Option B ist der Expertenpfad).
7. **Debrief** mit Expertenkommentar und Kompetenzlandkarten-Update.
8. In der Top-Navigation **„ÄLRD-Dashboard"** öffnen – Lizenz-Case.

Navigation oben rechts erlaubt jederzeit direkten Sprung zwischen
Pitch, Hauptmenü, CRM-Modul und ÄLRD-Dashboard.

---

## Was das Mockup zeigen will

- **Ein Fall, zwei Achsen.** Der gleiche SAA/BPR-Fall ist im Fach-Modus
  und im CRM-Modus spielbar. Kein zusätzlicher Content, doppelte
  Kompetenz-Abdeckung.
- **Training an den richtigen Fehlermustern.** CIRS-RD-Auswertungen
  zeigen Kommunikation, Rollenklarheit und Speaking Up als dominante
  Schwachstellen. Die Fragen des Szenarios zielen direkt darauf.
- **ÄLRD als Entscheider mitdenken.** Das Dashboard ist bewusst
  als *Ausblick* gekennzeichnet, keine fertige Funktion – aber es
  macht den Lizenz-Case (Steuerungsinstrument für den
  RD-Bereich) sofort verständlich.

## Was das Mockup *nicht* ist

- Kein Eingriff in den produktiven NotSan-Trainer-Code.
- Keine echte Persistenz, keine Datenbank, kein Scoring.
- Keine Integration in bestehende Fälle.

Reines Sales-Artefakt, eigenständig, in sich abgeschlossen.

---

## Stand & Kontext

- Stand: April 2026
- Designsprache bewusst konsistent zum produktiven NotSan Trainer
  (Farben, Typografie, Komponentenlogik).
- Inhaltlich belegt mit den 15 Rall-/Gaba-Leitsätzen, CIRS-RD-Auswertungen,
  Joint-Commission-Sentinel-Event-Daten. Quellenliste in
  `../crm_kerninhalte.md`.
