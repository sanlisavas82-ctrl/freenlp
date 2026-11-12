import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import {
  analyze,
  detectLanguage,
  readabilityLabel,
  type Analysis,
  type Language,
} from './lib/analyze'
import { UI, type UiStrings } from './lib/i18n'
import './App.css'

type LangMode = 'auto' | Language

const STORAGE_KEY = 'freenlp:text'
const LANG_KEY = 'freenlp:lang'

const LANGUAGES: { id: LangMode; label: string }[] = [
  { id: 'auto', label: 'Auto' },
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

function buildSummary(analysis: Analysis, t: UiStrings, uiLang: Language): string {
  const lines = [
    'FreeNLP',
    `${t.stats.characters}: ${formatInteger(analysis.characters)}`,
    `${t.stats.words}: ${formatInteger(analysis.words)}`,
    `${t.stats.sentences}: ${formatInteger(analysis.sentences)}`,
    `${t.readability}: ${formatInteger(analysis.readability)} (${readabilityLabel(analysis.readability, uiLang)})`,
    `${t.sentiment}: ${t.sentimentLabels[analysis.sentiment]}`,
    `${t.stats.readingMinutes}: ${formatDecimal(analysis.readingMinutes)}`,
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

function loadInitialMode(): LangMode {
  try {
    const stored = localStorage.getItem(LANG_KEY)
    if (stored === 'tr' || stored === 'de' || stored === 'auto') {
      return stored
    }
    return 'auto'
  } catch {
    return 'auto'
  }
}

function App() {
  const [text, setText] = useState(loadInitialText)
  const [mode, setMode] = useState<LangMode>(loadInitialMode)
  const [copied, setCopied] = useState(false)

  // Oberflächensprache: nur bei expliziter Türkisch-Wahl türkisch, sonst Deutsch.
  const uiLang: Language = mode === 'tr' ? 'tr' : 'de'
  const t = UI[uiLang]
  // Analysesprache: im Auto-Modus automatisch erkannt.
  const language: Language = mode === 'auto' ? detectLanguage(text) : mode
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
      localStorage.setItem(LANG_KEY, mode)
    } catch {
      // Speicher nicht verfügbar – ohne Persistenz weiterarbeiten.
    }
  }, [mode])

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
    setCopied(false)
  }

  const handleCopy = () => {
    void navigator.clipboard.writeText(buildSummary(analysis, t, uiLang)).then(
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

  const handleDownload = () => {
    const blob = new Blob([buildSummary(analysis, t, uiLang)], {
      type: 'text/plain;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'freenlp-analyse.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const stats: { label: string; value: string }[] = [
    { label: t.stats.characters, value: formatInteger(analysis.characters) },
    { label: t.stats.charactersNoSpaces, value: formatInteger(analysis.charactersNoSpaces) },
    { label: t.stats.words, value: formatInteger(analysis.words) },
    { label: t.stats.uniqueWords, value: formatInteger(analysis.uniqueWords) },
    { label: t.stats.sentences, value: formatInteger(analysis.sentences) },
    { label: t.stats.paragraphs, value: formatInteger(analysis.paragraphs) },
    { label: t.stats.syllables, value: formatInteger(analysis.syllables) },
    { label: t.stats.averageWordLength, value: formatDecimal(analysis.averageWordLength) },
    { label: t.stats.readingMinutes, value: formatDecimal(analysis.readingMinutes) },
  ]

  return (
    <>
      <header className="app-header">
        <h1>
          Free<span className="accent">NLP</span>
        </h1>
        <p className="tagline">{t.tagline}</p>
        <div className="lang-switch" role="group" aria-label="Sprache / Dil">
          {LANGUAGES.map((option) => (
            <button
              key={option.id}
              type="button"
              className={option.id === mode ? 'lang active' : 'lang'}
              aria-pressed={option.id === mode}
              onClick={() => {
                setMode(option.id)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        {mode === 'auto' && hasText && (
          <p className="lang-hint">
            {t.detected}: {t.langNames[language]}
          </p>
        )}
      </header>

      <textarea
        className="editor"
        value={text}
        onChange={handleChange}
        placeholder={t.placeholder}
        aria-label={t.tagline}
      />

      <div className="toolbar">
        <button
          type="button"
          className="btn"
          onClick={() => {
            setText(SAMPLES[uiLang])
            setCopied(false)
          }}
        >
          {t.example}
        </button>
        <span className="spacer" />
        <button type="button" className="btn" disabled={!hasText} onClick={handleCopy}>
          {copied ? t.copied : t.copy}
        </button>
        <button
          type="button"
          className="btn"
          disabled={!hasText}
          onClick={handleDownload}
        >
          {t.download}
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
          {t.clear}
        </button>
      </div>

      <div className="highlights">
        <div className="highlight">
          <span className="hl-value">{formatInteger(analysis.readability)}</span>
          <span className="hl-title">{t.readability}</span>
          <span className="hl-sub">
            {hasText ? readabilityLabel(analysis.readability, uiLang) : '–'}
          </span>
        </div>
        <div className={`highlight sentiment-${analysis.sentiment}`}>
          <span className="hl-value hl-word">
            {t.sentimentLabels[analysis.sentiment]}
          </span>
          <span className="hl-title">{t.sentiment}</span>
          <span className="hl-sub">
            {t.score} {formatDecimal(analysis.sentimentScore)}
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
        <h2>{t.topWords}</h2>
        {analysis.topWords.length > 0 ? (
          <WordBars items={analysis.topWords} />
        ) : (
          <p className="empty">{t.empty}</p>
        )}
      </section>

      {analysis.topBigrams.length > 0 && (
        <section className="section">
          <h2>{t.topBigrams}</h2>
          <WordBars items={analysis.topBigrams} />
        </section>
      )}

      <footer className="app-footer">{t.footer}</footer>
    </>
  )
}

export default App
