// Reine, testbare NLP-Hilfsfunktionen für FreeNLP.
// Alles läuft lokal im Browser – keine externen Dienste.

export type Language = 'de' | 'tr'

export interface WordCount {
  word: string
  count: number
}

export type SentimentLabel = 'positiv' | 'negativ' | 'neutral'

export interface Analysis {
  characters: number
  charactersNoSpaces: number
  words: number
  uniqueWords: number
  sentences: number
  paragraphs: number
  syllables: number
  averageWordLength: number
  readingMinutes: number
  readability: number
  readabilityLabel: string
  sentiment: SentimentLabel
  sentimentScore: number
  topWords: WordCount[]
  topBigrams: WordCount[]
}

interface Lexicon {
  stopwords: Set<string>
  positive: Set<string>
  negative: Set<string>
}

const LEXICONS: Record<Language, Lexicon> = {
  de: {
    stopwords: new Set<string>([
      'der', 'die', 'das', 'und', 'oder', 'aber', 'ist', 'sind', 'war', 'waren',
      'ein', 'eine', 'einen', 'einem', 'einer', 'eines', 'im', 'in', 'an', 'auf',
      'zu', 'zur', 'zum', 'mit', 'ohne', 'für', 'von', 'vom', 'bei', 'aus', 'nach',
      'über', 'unter', 'auch', 'nicht', 'nur', 'noch', 'schon', 'als', 'wie', 'so',
      'dass', 'den', 'dem', 'des', 'sich', 'es', 'er', 'sie', 'wir', 'ihr', 'ich',
      'du', 'man',
    ]),
    positive: new Set<string>([
      'gut', 'super', 'toll', 'klasse', 'schön', 'wunderbar', 'großartig', 'perfekt',
      'liebe', 'freude', 'glücklich', 'positiv', 'danke', 'erfolg', 'stark', 'genial',
      'hilfreich', 'angenehm', 'empfehlen', 'besser', 'beste', 'spitze', 'fantastisch',
    ]),
    negative: new Set<string>([
      'schlecht', 'schlimm', 'furchtbar', 'schrecklich', 'hass', 'traurig', 'wütend',
      'problem', 'fehler', 'negativ', 'nie', 'kaputt', 'schwach', 'ärger', 'langweilig',
      'enttäuscht', 'nutzlos', 'schlechter', 'schlimmer', 'mangel', 'katastrophe',
    ]),
  },
  tr: {
    stopwords: new Set<string>([
      've', 'veya', 'ama', 'bir', 'bu', 'şu', 'için', 'ile', 'de', 'da', 'ki',
      'mi', 'mı', 'mu', 'mü', 'çok', 'az', 'daha', 'en', 'ne', 'gibi', 'ya', 'her',
      'bütün', 'ben', 'sen', 'biz', 'siz', 'onlar', 'bana', 'sana', 'değil', 'ise',
      'çünkü', 'ancak', 'fakat', 'var', 'yok', 'olarak', 'kadar', 'sonra', 'önce',
    ]),
    positive: new Set<string>([
      'güzel', 'iyi', 'harika', 'mükemmel', 'sevgi', 'mutlu', 'başarı', 'teşekkür',
      'muhteşem', 'süper', 'hoş', 'faydalı', 'olumlu', 'seviyorum', 'güçlü', 'tavsiye',
    ]),
    negative: new Set<string>([
      'kötü', 'berbat', 'korkunç', 'nefret', 'üzgün', 'kızgın', 'problem', 'sorun',
      'hata', 'olumsuz', 'asla', 'bozuk', 'zayıf', 'sıkıcı', 'felaket', 'maalesef',
    ]),
  },
}

const READABILITY_LABELS: Record<Language, string[]> = {
  de: ['sehr schwer', 'schwer', 'mittel', 'leicht', 'sehr leicht'],
  tr: ['çok zor', 'zor', 'orta', 'kolay', 'çok kolay'],
}

export function countSyllables(word: string): number {
  // Vokale für Deutsch und Türkisch (inkl. ı, ö, ü, ä).
  const groups = word.toLowerCase().match(/[aeiouyäöüı]+/gu)
  return Math.max(1, groups ? groups.length : 0)
}

function readabilityLabelFor(score: number, language: Language): string {
  const labels = READABILITY_LABELS[language]
  if (score >= 80) return labels[4]
  if (score >= 60) return labels[3]
  if (score >= 40) return labels[2]
  if (score >= 20) return labels[1]
  return labels[0]
}

export function analyze(text: string, language: Language = 'de'): Analysis {
  const lexicon = LEXICONS[language]
  const tokens =
    text.toLowerCase().match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? []
  const sentenceMatches = text.match(/[^.!?]+[.!?]+/gu) ?? []
  const paragraphs = text
    .split(/\n\s*\n/u)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)

  const sentenceCount = Math.max(sentenceMatches.length, tokens.length > 0 ? 1 : 0)

  const frequency = new Map<string, number>()
  let letterTotal = 0
  let syllableTotal = 0
  let positiveHits = 0
  let negativeHits = 0
  const contentWords: string[] = []

  for (const token of tokens) {
    letterTotal += token.length
    syllableTotal += countSyllables(token)
    if (lexicon.positive.has(token)) positiveHits += 1
    if (lexicon.negative.has(token)) negativeHits += 1
    if (token.length >= 2 && !lexicon.stopwords.has(token)) {
      frequency.set(token, (frequency.get(token) ?? 0) + 1)
      contentWords.push(token)
    }
  }

  const topWords: WordCount[] = [...frequency.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const bigramFreq = new Map<string, number>()
  for (let i = 0; i + 1 < contentWords.length; i += 1) {
    const pair = `${contentWords[i]} ${contentWords[i + 1]}`
    bigramFreq.set(pair, (bigramFreq.get(pair) ?? 0) + 1)
  }
  const topBigrams: WordCount[] = [...bigramFreq.entries()]
    .map(([word, count]) => ({ word, count }))
    .filter((entry) => entry.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  const wordCount = tokens.length
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0
  const avgSyllables = wordCount > 0 ? syllableTotal / wordCount : 0
  // Flesch-Reading-Ease (deutsche Amstad-Formel), auf 0–100 begrenzt.
  const rawReadability = 180 - avgSentenceLength - 58.5 * avgSyllables
  const readability =
    wordCount > 0 ? Math.min(100, Math.max(0, Math.round(rawReadability))) : 0

  const sentimentTotal = positiveHits + negativeHits
  const sentimentScore =
    sentimentTotal > 0 ? (positiveHits - negativeHits) / sentimentTotal : 0
  let sentiment: SentimentLabel = 'neutral'
  if (sentimentScore > 0.2) sentiment = 'positiv'
  else if (sentimentScore < -0.2) sentiment = 'negativ'

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/gu, '').length,
    words: wordCount,
    uniqueWords: new Set(tokens).size,
    sentences: sentenceMatches.length,
    paragraphs: paragraphs.length,
    syllables: syllableTotal,
    averageWordLength: wordCount > 0 ? letterTotal / wordCount : 0,
    readingMinutes: wordCount / 200,
    readability,
    readabilityLabel: wordCount > 0 ? readabilityLabelFor(readability, language) : '–',
    sentiment,
    sentimentScore,
    topWords,
    topBigrams,
  }
}
