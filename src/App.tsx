import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { analyze, type Analysis, type Language } from './lib/analyze'
import './App.css'

const STORAGE_KEY = 'freenlp:text'
const LANG_KEY = 'freenlp:lang'

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'de', label: 'Deutsch' },
  { id: 'tr', label: 'Türkçe' },
]

const SAMPLES: Record<Language, string> = {
  de:
    'FreeNLP ist ein kostenloses Werkzeug zur Textanalyse. ' +
    'Es läuft komplett im Browser – ohne Server, ohne Anmeldung und ohne Kosten. ' +
    'Das Werkzeug ist super und die Analyse ist wirklich hilfreich. ' +
    'Füge einfach deinen Text ein und sieh dir sofort die Analyse an. ' +
    'Probiere das Werkzeug aus und analysiere deine eigenen Texte!',
  tr:
    'FreeNLP ücretsiz bir metin analizi aracıdır. ' +
    'Tamamen tarayıcıda çalışır – sunucu yok, kayıt yok, ücret yok. ' +
    'Bu araç gerçekten harika ve analiz çok faydalı. ' +
    'Metnini yapıştır ve istatistikleri hemen gör. ' +
    'Aracı dene ve kendi metinlerini analiz et!',
}

function formatInteger(value: number): string {
  return value.toLocaleString('de-DE')
}

function formatDecimal(value: number): string {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

function buildSummary(analysis: Analysis): string {
  const lines = [
    'FreeNLP – Analyse',
    `Zeichen: ${formatInteger(analysis.characters)}`,
    `Wörter: ${formatInteger(analysis.words)}`,
    `Sätze: ${formatInteger(analysis.sentences)}`,
    `Lesbarkeit: ${formatInteger(analysis.readability)} (${analysis.readabilityLabel})`,
    `Stimmung: ${analysis.sentiment}`,
    `Lesezeit: ${formatDecimal(analysis.readingMinutes)} min`,
  ]
  return lines.join('\n')
}

function WordBars({ items }: { items: Analysis['topWords'] }) {
  const maxCount = items.length > 0 ? items[0].count : 1
  return (
    <div className="words">
      {items.map((item) => (
        <div className="word-row" key={item.word}>
          <span className="term">{item.word}</span>
          <span
            className="bar"
            style={{ width: `${String((item.count / maxCount) * 100)}%` }}
          />
          <span className="count">{formatInteger(item.count)}</span>
        </div>
      ))}
    </div>
  )
}

function loadInitialText(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function loadInitialLanguage(): Language {
  try {
    return localStorage.getItem(LANG_KEY) === 'tr' ? 'tr' : 'de'
  } catch {
    return 'de'
  }
}

function App() {
  const [text, setText] = useState(loadInitialText)
  const [language, setLanguage] = useState<Language>(loadInitialLanguage)
  const [copied, setCopied] = useState(false)
  const analysis = useMemo(() => analyze(text, language), [text, language])
  const hasText = text.trim().length > 0

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, text)
    } catch {
      // Speicher nicht verfügbar – ohne Persistenz weiterarbeiten.
    }
  }, [text])

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, language)
    } catch {
      // Speicher nicht verfügbar – ohne Persistenz weiterarbeiten.
    }
  }, [language])

  const handleDownload = () => {
    const blob = new Blob([buildSummary(analysis)], {
      type: 'text/plain;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'freenlp-analyse.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
    setCopied(false)
  }

  const handleCopy = () => {
    void navigator.clipboard.writeText(buildSummary(analysis)).then(
      () => {
        setCopied(true)
        window.setTimeout(() => {
          setCopied(false)
        }, 1500)
      },
      () => {
        // Zwischenablage nicht verfügbar – still ignorieren.
      },
    )
  }

  const stats: { label: string; value: string }[] = [
    { label: 'Zeichen', value: formatInteger(analysis.characters) },
    { label: 'Ohne Leerzeichen', value: formatInteger(analysis.charactersNoSpaces) },
    { label: 'Wörter', value: formatInteger(analysis.words) },
    { label: 'Einzigartige Wörter', value: formatInteger(analysis.uniqueWords) },
    { label: 'Sätze', value: formatInteger(analysis.sentences) },
    { label: 'Absätze', value: formatInteger(analysis.paragraphs) },
    { label: 'Silben', value: formatInteger(analysis.syllables) },
    { label: 'Ø Wortlänge', value: formatDecimal(analysis.averageWordLength) },
    { label: 'Lesezeit (min)', value: formatDecimal(analysis.readingMinutes) },
  ]

  return (
    <>
      <header className="app-header">
        <h1>
          Free<span className="accent">NLP</span>
        </h1>
        <p className="tagline">
          Kostenlose Textanalyse – direkt im Browser, ohne Server.
        </p>
        <div className="lang-switch" role="group" aria-label="Sprache wählen">
          {LANGUAGES.map((option) => (
            <button
              key={option.id}
              type="button"
              className={option.id === language ? 'lang active' : 'lang'}
              aria-pressed={option.id === language}
              onClick={() => {
                setLanguage(option.id)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <textarea
        className="editor"
        value={text}
        onChange={handleChange}
        placeholder="Füge hier deinen Text ein oder tippe los …"
        aria-label="Text zum Analysieren"
      />

      <div className="toolbar">
        <button
          type="button"
          className="btn"
          onClick={() => {
            setText(SAMPLES[language])
            setCopied(false)
          }}
        >
          Beispieltext
        </button>
        <span className="spacer" />
        <button type="button" className="btn" disabled={!hasText} onClick={handleCopy}>
          {copied ? 'Kopiert ✓' : 'Ergebnis kopieren'}
        </button>
        <button
          type="button"
          className="btn"
          disabled={!hasText}
          onClick={handleDownload}
        >
          Als Datei (.txt)
        </button>
        <button
          type="button"
          className="btn"
          disabled={!hasText}
          onClick={() => {
            setText('')
            setCopied(false)
          }}
        >
          Leeren
        </button>
      </div>

      <div className="highlights">
        <div className="highlight">
          <span className="hl-value">{formatInteger(analysis.readability)}</span>
          <span className="hl-title">Lesbarkeit</span>
          <span className="hl-sub">{analysis.readabilityLabel}</span>
        </div>
        <div className={`highlight sentiment-${analysis.sentiment}`}>
          <span className="hl-value hl-word">{analysis.sentiment}</span>
          <span className="hl-title">Stimmung</span>
          <span className="hl-sub">
            Score {formatDecimal(analysis.sentimentScore)}
          </span>
        </div>
      </div>

      <div className="stats">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <span className="value">{stat.value}</span>
            <span className="label">{stat.label}</span>
          </div>
        ))}
      </div>

      <section className="section">
        <h2>Häufigste Wörter</h2>
        {analysis.topWords.length > 0 ? (
          <WordBars items={analysis.topWords} />
        ) : (
          <p className="empty">
            Noch keine Daten – gib oben einen Text ein, um die Analyse zu starten.
          </p>
        )}
      </section>

      {analysis.topBigrams.length > 0 && (
        <section className="section">
          <h2>Häufige Wortpaare</h2>
          <WordBars items={analysis.topBigrams} />
        </section>
      )}

      <footer className="app-footer">
        FreeNLP · Alle Berechnungen laufen lokal in deinem Browser.
      </footer>
    </>
  )
}

export default App
