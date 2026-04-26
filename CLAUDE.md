# Projekt-Notizen

## SAA und BPR Referenzdokument
Die aktuelle Version der SAA und BPR findest du immer unter:
https://github.com/mfilkorn-stack/NotsanTrainer2025/blob/b865e6cf310aeb555b90aba7970881cff0d278ba/saa_bpr_2025.pdf

## User-Präferenzen
- Der User möchte immer den Terminal-Befehl zum Kopieren erhalten (z.B. für git, npm, gh CLI Befehle)

## Workflow-Regel: API Stream-Timeout vermeiden
Der Anthropic-Fehler `API Error: Stream idle timeout - partial response received`
tritt auf, wenn ein einzelner Output (z.B. ein großer `Write`) zu lange ohne
Token-Fortschritt erzeugt wird. Diesen Fehler grundsätzlich vermeiden:

- **Niemals** sehr große Dateien in einem einzigen `Write`-Call erzeugen.
- Skripte / Dokumente / Code-Dumps **inkrementell** aufbauen: zuerst Grundgerüst
  schreiben, dann in mehreren kleinen `Edit`-Schritten Abschnitte anhängen
  (Faustregel: max. ~150–200 Zeilen pro Tool-Call).
- Bei langen `Read`-Outputs gezielt `offset`/`limit` nutzen statt ganze Dateien
  zu laden.
- Bei generierten Artefakten (Folien, PDFs, lange JSON/CSV) lieber ein
  Generator-Skript schrittweise schreiben und dann einmal ausführen, statt das
  Endprodukt direkt zu dumpen.
