import { useMemo, useState, type ChangeEvent } from 'react'
import './App.css'

const SAMPLE =
  'FreeNLP ist ein kostenloses Werkzeug zur Textanalyse. ' +
  'Es läuft komplett im Browser – ohne Server, ohne Anmeldung und ohne Kosten. ' +
  'Füge einfach deinen Text ein und sieh dir sofort Statistiken an: ' +
  'Wortanzahl, Sätze, Lesezeit und die häufigsten Wörter. ' +
  'Probiere es aus und analysiere deine eigenen Texte!'

const STOPWORDS = new Set<string>([
  'der', 'die', 'das', 'und', 'oder', 'aber', 'ist', 'sind', 'war', 'waren',
  'ein', 'eine', 'einen', 'einem', 'einer', 'eines', 'im', 'in', 'an', 'auf',
  'zu', 'zur', 'zum', 'mit', 'ohne', 'für', 'von', 'vom', 'bei', 'aus', 'nach',
  'über', 'unter', 'auch', 'nicht', 'nur', 'noch', 'schon', 'als', 'wie', 'so',
  'dass', 'den', 'dem', 'des', 'sich', 'es', 'er', 'sie', 'wir', 'ihr', 'ich',
  'du', 'man', 'the', 'and', 'or', 'of', 'to', 'in', 'is', 'it', 'a', 'an',
])

interface WordCount {
  word: string
  count: number
}

interface Analysis {
  characters: number
  charactersNoSpaces: number
  words: number
  uniqueWords: number
  sentences: number
  paragraphs: number
  averageWordLength: number
  readingMinutes: number
  topWords: WordCount[]
}

function analyze(text: string): Analysis {
  const tokens = text.toLowerCase().match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? []
  const sentences = text.match(/[^.!?]+[.!?]+/gu) ?? []
  const paragraphs = text
    .split(/\n\s*\n/u)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)

  const frequency = new Map<string, number>()
  let letterTotal = 0
  for (const token of tokens) {
    letterTotal += token.length
    if (token.length < 2 || STOPWORDS.has(token)) {
      continue
    }
    frequency.set(token, (frequency.get(token) ?? 0) + 1)
  }

  const topWords: WordCount[] = [...frequency.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/gu, '').length,
    words: tokens.length,
    uniqueWords: new Set(tokens).size,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    averageWordLength: tokens.length > 0 ? letterTotal / tokens.length : 0,
    readingMinutes: tokens.length / 200,
    topWords,
  }
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

function App() {
  const [text, setText] = useState('')
  const analysis = useMemo(() => analyze(text), [text])
  const hasText = text.trim().length > 0

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }

  const stats: { label: string; value: string }[] = [
    { label: 'Zeichen', value: formatInteger(analysis.characters) },
    { label: 'Ohne Leerzeichen', value: formatInteger(analysis.charactersNoSpaces) },
    { label: 'Wörter', value: formatInteger(analysis.words) },
    { label: 'Einzigartige Wörter', value: formatInteger(analysis.uniqueWords) },
    { label: 'Sätze', value: formatInteger(analysis.sentences) },
    { label: 'Absätze', value: formatInteger(analysis.paragraphs) },
    { label: 'Ø Wortlänge', value: formatDecimal(analysis.averageWordLength) },
    { label: 'Lesezeit (min)', value: formatDecimal(analysis.readingMinutes) },
  ]

  const maxCount = analysis.topWords.length > 0 ? analysis.topWords[0].count : 1

  return (
    <>
      <header className="app-header">
        <h1>
          Free<span className="accent">NLP</span>
        </h1>
        <p className="tagline">
          Kostenlose Textanalyse – direkt im Browser, ohne Server.
        </p>
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
            setText(SAMPLE)
          }}
        >
          Beispieltext
        </button>
        <span className="spacer" />
        <button
          type="button"
          className="btn"
          disabled={!hasText}
          onClick={() => {
            setText('')
          }}
        >
          Leeren
        </button>
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
          <div className="words">
            {analysis.topWords.map((item) => (
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
        ) : (
          <p className="empty">
            Noch keine Daten – gib oben einen Text ein, um die Analyse zu starten.
          </p>
        )}
      </section>

      <footer className="app-footer">
        FreeNLP · Alle Berechnungen laufen lokal in deinem Browser.
      </footer>
    </>
  )
}

export default App
