# Änderungsverlauf

Der Weg von FreeNLP – von der leeren Projektvorlage bis zur fertigen,
zweisprachigen Textanalyse-App.

## Wo wir angefangen haben
- Leeres Vite-Projekt (React 19 + TypeScript)
- Ziel: die **typbasierte ESLint-Config** einrichten

## Wo wir stehen
Eine vollständige, getestete Textanalyse-App – komplett im Browser, ohne Server.

---

### Verlauf (nach Commits)

1. **Projekt-Setup** – Vite + React 19 + TypeScript, typbasierte ESLint-Config
   (`recommendedTypeChecked` + `strictTypeChecked` + `stylisticTypeChecked`)
2. **Textanalyse-Grundfunktion** – Statistiken + häufigste Wörter
3. **Mehr Analyse** – Lesbarkeitsindex (Flesch), Stimmungsanalyse, Wortpaare,
   „Ergebnis kopieren"
4. **Qualität & Komfort** – Unit-Tests (Vitest), localStorage-Persistenz,
   `.txt`-Export
5. **Zweisprachig** – Umschalter Deutsch / Türkisch (Stoppwörter, Stimmung,
   Silben pro Sprache)
6. **Automatische Spracherkennung** – Auto-Modus, Deutsch als Standard
7. **Oberfläche übersetzt** – komplette UI auf Deutsch oder Türkisch
   (Deutsch bleibt Standard)
8. **Finale Version** – zusätzliche Kennzahlen (Ø Wörter/Satz, längster Satz),
   größeres Stimmungs-Lexikon, Metadaten & README
9. **Roadmap-Issues abgearbeitet:**
   - #3 Weitere Kennzahlen: kürzester Satz, einmalige Wörter (Hapax)
   - #2 Stimmungsanalyse: Negationen & Verstärker berücksichtigt
   - #1 Export als Markdown (`.md`) und PDF (Druck)

### Funktionsumfang heute
- 11 Textstatistiken, Lesbarkeitsindex, Stimmungsanalyse
- Häufigste Wörter & Wortpaare
- Deutsch + Türkisch (Analyse automatisch erkannt, Oberfläche umschaltbar)
- Kopieren, `.txt`-Export, Persistenz, Dark-Mode
- Unit-Tests, strikte ESLint-Regeln, voll typisiert
