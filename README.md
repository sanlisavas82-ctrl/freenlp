# FreeNLP

Web-Anwendung auf Basis von **React 19**, **TypeScript** und **Vite**.

## Tech-Stack

- [Vite](https://vite.dev/) – Build-Tool & Dev-Server (HMR)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (5.9)
- [ESLint](https://eslint.org/) mit typbasierten Regeln (`typescript-eslint`)

## Voraussetzungen

- [Node.js](https://nodejs.org/) 20+ und npm

## Erste Schritte

```bash
npm install      # Abhängigkeiten installieren
npm run dev      # Dev-Server starten (http://localhost:5173)
```

## Skripte

| Befehl            | Beschreibung                                      |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Startet den Vite-Dev-Server mit Hot Module Reload |
| `npm run build`   | Type-Check (`tsc -b`) + Production-Build nach `dist/` |
| `npm run preview` | Lokale Vorschau des Production-Builds             |
| `npm run lint`    | Prüft den Code mit ESLint                         |
| `npm test`        | Führt die Unit-Tests (Vitest) aus                 |

## Linting

Das Projekt nutzt eine typbasierte ESLint-Flat-Config (`eslint.config.js`) mit:

- `tseslint.configs.recommendedTypeChecked`
- `tseslint.configs.strictTypeChecked`
- `tseslint.configs.stylisticTypeChecked`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

Die type-aware Regeln setzen `strictNullChecks` voraus (in `tsconfig.app.json` /
`tsconfig.node.json` über `"strict": true` aktiviert).

## Projektstruktur

```
freenlp/
├── src/              # Anwendungscode (Komponenten, Assets, Styles)
├── public/           # Statische Dateien
├── eslint.config.js  # ESLint Flat-Config (typbasiert)
├── tsconfig*.json    # TypeScript-Konfiguration
└── vite.config.ts    # Vite-Konfiguration
```
