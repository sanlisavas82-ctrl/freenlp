# FreeNLP

**Kostenlose Textanalyse direkt im Browser** – ohne Server, ohne Anmeldung, ohne
Kosten. Alle Berechnungen laufen lokal im Browser; es werden keine Daten
versendet.

Gebaut mit **React 19**, **TypeScript** und **Vite**.

## Funktionen

- **Statistiken:** Zeichen, Zeichen ohne Leerzeichen, Wörter, einzigartige
  Wörter, Sätze, Absätze, Silben, Ø Wortlänge, Ø Wörter pro Satz, längster und
  kürzester Satz, einmalige Wörter (Hapax), Lesezeit
- **Lesbarkeitsindex** (Flesch-Reading-Ease, Amstad-Formel) mit Einstufung
- **Stimmungsanalyse** (Sentiment) – positiv / negativ / neutral, mit
  Berücksichtigung von **Negationen** („nicht gut") und **Verstärkern** („sehr gut")
- **Gefundene Stimmungswörter** werden als Chips angezeigt (transparent, mit Negation)
- **Häufigste Wörter**, **Wortpaare** (Bigramme) und **Buchstaben-Häufigkeit** als Balken
- **Längster & kürzester Satz** im Volltext
- **Zwei Sprachen:** Deutsch (Standard) und Türkisch
  - Automatische **Spracherkennung** für die Analyse
  - Oberfläche auf Deutsch oder Türkisch umschaltbar
- **Export:** Ergebnis kopieren, als **`.txt`**, **`.md`** oder **`.csv`**
  herunterladen, oder per Druckfunktion als **PDF**
- **Text bleibt erhalten** (localStorage) – auch nach dem Neuladen
- **Hell/Dunkel-Umschalter** (System / Hell / Dunkel, gespeichert)

## Voraussetzungen

- [Node.js](https://nodejs.org/) 20+ und npm

## Erste Schritte

```bash
npm install      # Abhängigkeiten installieren
npm run dev      # Dev-Server starten (http://localhost:5173)
```

## Skripte

| Befehl            | Beschreibung                                       |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Startet den Vite-Dev-Server mit Hot Module Reload  |
| `npm run build`   | Type-Check (`tsc -b`) + Production-Build nach `dist/` |
| `npm run preview` | Lokale Vorschau des Production-Builds              |
| `npm run lint`    | Prüft den Code mit ESLint                          |
| `npm test`        | Führt die Unit-Tests (Vitest) aus                  |

## Projektstruktur

```
freenlp/
├── src/
│   ├── App.tsx            # UI-Komponente
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── lib/
│       ├── analyze.ts      # NLP-Logik (rein, testbar)
│       ├── analyze.test.ts # Unit-Tests
│       └── i18n.ts         # Oberflächen-Übersetzungen (DE/TR)
├── eslint.config.js        # ESLint Flat-Config (typbasiert)
├── tsconfig*.json
└── vite.config.ts
```

## Qualität

- Typbasierte ESLint-Config (`strictTypeChecked` + `stylisticTypeChecked`)
- Unit-Tests für das Analyse-Modul mit Vitest
- Vollständig typisiert (TypeScript, `strict`)
