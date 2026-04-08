# Rollout-Etappen NotSanTrainer 2025

Operative Unterteilung des [Rolloutplans](./rollout-plan-2025.md) in 10 Etappen. Jede Etappe ist eigenständig abschließbar und wird als eigener Commit / eigene Arbeitseinheit umgesetzt.

| # | Etappe | Ergebnis | Status |
|---|---|---|---|
| 1 | **Foundation & Doku** | Plan und Etappenübersicht im Repo | in Arbeit |
| 2 | **Feature-Cut Free vs. Plus** | Feature-Liste, Konstanten im Code, Gating-Layer mit "Plus-Hinweis"-UI | offen |
| 3 | **Lizenzmechanismus** | Architekturentscheidung (Offline-Schlüssel vs. Backend), Implementierung der Lizenzprüfung | offen |
| 4 | **Stripe-Integration** | Stripe-Account, Checkout-Flow für 19,99 €, Webhook → Lizenzcode-Versand, Wiederherstellungs-Flow | offen |
| 5 | **Rechtstexte** | Impressum (MadforMed GmbH), AGB B2C-Einmalkauf, AGB B2B-Schule/HiOrg, Datenschutz, Widerruf, AVV-Vorlage | offen |
| 6 | **Marke & Webpräsenz** | Domainstrategie, DPMA-Markenanmeldung "NotSanTrainer" (Klasse 41/42), Landingpage v1 mit 3 Segmenten | offen |
| 7 | **Outreach-Vorbereitung** | ÄLRD-AG-Anschreiben, Pilot-Schulen-Liste & Anschreiben-Vorlage, Marktzahlen-Verifikation (DBRD/BAND/Stat. Ämter) | offen |
| 8 | **B2C-Marketing-Launch** | Social-Content-Kalender (Reddit/Insta/TikTok), Influencer-Liste DACH NotSan, Prüfungstermin-Kampagnenplan | offen |
| 9 | **B2B-Outbound & Messen** | RETTmobil 2026 Anmeldung, Florian Dresden 2026 prüfen, Pilotprogramm-Onboarding-Kit | offen |
| 10 | **30h-Nachweis-Feature** | Spec, Datenmodell, Implementierung Sitzungs-Log + Zertifikatgenerierung | offen |

## Etappen-Details

### Etappe 1 — Foundation & Doku
- `docs/rollout-plan-2025.md` — vollständiger, vom Auftraggeber freigegebener Plan
- `docs/rollout-etappen.md` — diese Datei
- Commit + Push auf Branch `claude/notsantrainer-rollout-plan-2S7Xt`

### Etappe 2 — Feature-Cut Free vs. Plus
**Vorschlag (zur Bestätigung vor Umsetzung):**
- **Free:** komplettes Nachschlagewerk (Medikamente, BPR, invasive Maßnahmen, EKG-Basics, Algorithmus-Trainer), 3 Quiz-Kategorien à ~70 Fragen (~200 Fragen frei), 10 Fallsimulationen
- **Plus:** alle 1.223 Quizfragen, alle 306 Fälle, Prüfungssimulation mit Timer, Statistik & Schwachstellen-Analyse, alle EKGs, Gesamtprüfung
- **Code:** zentrale Konstante `LICENSE_TIER` + Helper `requirePlus()` an gesperrten Routen/Komponenten + UI-Overlay "Plus-Feature, jetzt für 19,99 € freischalten"

### Etappe 3 — Lizenzmechanismus
**Architekturentscheidung nötig vor Umsetzung:**
- **Variante A (DSGVO-Favorit):** Offline-Lizenzschlüssel, signiert mit Ed25519, Public-Key in App, anonyme Verifikation in localStorage. Keine Datenbank, kein Account.
- **Variante B:** Leichtes Backend mit Käuferkonto (E-Mail-Login, Lizenzwiederherstellung Self-Service). Nötig spätestens für Lehrer-Cockpit (Etappe 6+).
- Empfehlung: B2C startet mit Variante A, Backend kommt mit Schul-Lizenzen.

### Etappe 4 — Stripe-Integration
- Stripe-Account anlegen (MadforMed GmbH, Standardprodukt 19,99 €)
- Stripe Checkout Session-Endpoint
- Webhook `checkout.session.completed` → Lizenzschlüssel generieren → E-Mail mit Schlüssel
- "Lizenz wiederherstellen"-Flow (E-Mail eingeben → erneuter Versand)
- Test-Mode-Validierung vor Live-Schaltung

### Etappe 5 — Rechtstexte
- Impressum mit MadforMed GmbH, USt-ID, Geschäftsführer
- AGB B2C: Einmalkauf, Widerrufsverzicht für digitale Inhalte, "Lifetime-Updates"-Definition (= SAA/BPR-Updates der 6-Länder-Gruppe)
- AGB B2B Schule: 15 €/Schüler/Jahr, Mindestabnahme, Standortlizenz-Schwelle, Kündigungsfrist
- AGB B2B HiOrg: Verbandslizenz-Modell
- Datenschutzerklärung (PWA, Stripe, ggf. Backend)
- AVV-Vorlage für B2B mit Lehrer-Cockpit
- **Hinweis:** anwaltliche Prüfung empfohlen

### Etappe 6 — Marke & Webpräsenz
- Domain prüfen und sichern (notsantrainer.de, .com, .app)
- DPMA-Markenanmeldung "NotSanTrainer" (Wort/Wort-Bild, Klasse 41 Aus-/Fortbildung + 42 Software)
- Landingpage v1: B2C-CTA (19,99 € Einmalkauf), Schulen-CTA (15 €/Schüler/Jahr), HiOrg-CTA (Anfrage)
- 3 Case-Study-Drafts

### Etappe 7 — Outreach-Vorbereitung
- ÄLRD-AG-Anschreiben (fachliche Vorstellung, Bitte um Feedback, NICHT Verkauf)
- Liste der ~80–120 RDS in BW, BB, MV, NRW, SN, ST recherchieren (DRK-Landesschulen, ASB, JUH, MHD, kommunal, BF, privat)
- Pilot-Schulen-Anschreiben-Vorlage (90-Tage-Schultest gratis)
- Marktzahlen-Verifikation: DBRD, BAND, Statistische Landesämter

### Etappe 8 — B2C-Marketing-Launch
- Social-Content-Kalender 8 Wochen (Reddit/Insta/TikTok)
- Influencer-Liste DACH NotSan (Recherche)
- Prüfungstermin-Kalender 2026 der 6 Länder + Kampagnen-Trigger 4–6 Wochen vorher

### Etappe 9 — B2B-Outbound & Messen
- RETTmobil Fulda 2026: Standanmeldung prüfen, Deadline beachten
- Florian Dresden 2026: Prüfung
- Pilotprogramm-Onboarding-Kit: Welcome-Mail, Kurzanleitung Lehrkräfte, Feedback-Bogen, Logo-Template

### Etappe 10 — 30h-Nachweis-Feature (Roadmap)
- Spec abstimmen (welche Form akzeptieren ÄLRDs als Nachweis?)
- Datenmodell: Sitzungs-Log pro NotSan, kategorisierte Lernzeit, Zertifikatsvorlage
- Implementierung mit Backend-Anbindung (setzt Etappe 3 Variante B voraus)
- **Wichtig:** Bis Verfügbarkeit darf HiOrg-Vertrieb das Feature nicht versprechen
