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
  averageWordsPerSentence: number
  longestSentenceWords: number
  shortestSentenceWords: number
  longestSentence: string
  shortestSentence: string
  hapaxCount: number
  readingMinutes: number
  readability: number
  readabilityLabel: string
  sentiment: SentimentLabel
  sentimentScore: number
  positiveWords: string[]
  negativeWords: string[]
  topWords: WordCount[]
  topBigrams: WordCount[]
  topLetters: WordCount[]
}

interface Lexicon {
  stopwords: Set<string>
  positive: Set<string>
  negative: Set<string>
  negations: Set<string>
  intensifiers: Set<string>
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
      'liebe', 'lieben', 'freude', 'glücklich', 'positiv', 'danke', 'erfolg', 'stark',
      'genial', 'hilfreich', 'angenehm', 'empfehlen', 'besser', 'beste', 'spitze',
      'fantastisch', 'freundlich', 'zufrieden', 'begeistert', 'wertvoll', 'sicher',
      'einfach', 'schnell', 'erfolgreich', 'gelungen', 'vorteil', 'chance', 'lob',
      'loben', 'freue', 'spaß', 'gern', 'gerne', 'optimal', 'herausragend',
    ]),
    negative: new Set<string>([
      'schlecht', 'schlimm', 'furchtbar', 'schrecklich', 'hass', 'hassen', 'traurig',
      'wütend', 'problem', 'fehler', 'negativ', 'nie', 'kaputt', 'schwach', 'ärger',
      'langweilig', 'enttäuscht', 'enttäuschend', 'nutzlos', 'schlechter', 'schlimmer',
      'mangel', 'katastrophe', 'teuer', 'kompliziert', 'schwierig', 'unmöglich',
      'angst', 'sorge', 'nachteil', 'risiko', 'verlust', 'leider', 'kritik', 'müll',
      'furcht', 'böse', 'falsch', 'schwierigkeiten', 'versagen', 'chaos',
    ]),
    negations: new Set<string>([
      'nicht', 'kein', 'keine', 'keinen', 'keiner', 'keinem', 'kaum', 'nie',
      'niemals', 'ohne', 'nein', 'weder', 'nichts',
    ]),
    intensifiers: new Set<string>([
      'sehr', 'besonders', 'extrem', 'total', 'richtig', 'so', 'äußerst',
      'wirklich', 'ziemlich', 'höchst',
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
      'keyifli', 'memnun', 'kolay', 'hızlı', 'değerli', 'başarılı', 'sevinç', 'umut',
      'kaliteli', 'rahat', 'muhteşem', 'şahane', 'avantaj', 'güven', 'sağlam',
    ]),
    negative: new Set<string>([
      'kötü', 'berbat', 'korkunç', 'nefret', 'üzgün', 'kızgın', 'problem', 'sorun',
      'hata', 'olumsuz', 'asla', 'bozuk', 'zayıf', 'sıkıcı', 'felaket', 'maalesef',
      'pahalı', 'zor', 'imkansız', 'korku', 'endişe', 'dezavantaj', 'risk', 'kayıp',
      'yanlış', 'kriz', 'başarısız', 'üzücü', 'çirkin', 'kırık', 'eksik', 'şikayet',
    ]),
    negations: new Set<string>([
      'değil', 'yok', 'hiç', 'asla', 'olmadan', 'hayır', 'yoktur',
    ]),
    intensifiers: new Set<string>([
      'çok', 'oldukça', 'aşırı', 'gerçekten', 'epey', 'fazla',
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

// Einfache Heuristik: erkennt Deutsch oder Türkisch an Stoppwörtern
// und sprachtypischen Buchstaben. Standard ist Deutsch.
export function detectLanguage(text: string): Language {
  const tokens = text.toLowerCase().match(/[\p{L}]+/gu) ?? []
  if (tokens.length === 0) return 'de'

  let germanScore = 0
  let turkishScore = 0
  for (const token of tokens) {
    if (LEXICONS.de.stopwords.has(token)) germanScore += 1
    if (LEXICONS.tr.stopwords.has(token)) turkishScore += 1
  }
  // Türkisch-spezifische Buchstaben (ş, ğ, ı) stark gewichten.
  turkishScore += (text.match(/[şğı]/gu) ?? []).length * 2
  // Deutsches ß als Signal für Deutsch.
  germanScore += (text.match(/ß/gu) ?? []).length * 2

  return turkishScore > germanScore ? 'tr' : 'de'
}

export function readabilityLabel(score: number, language: Language): string {
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
  const contentWords: string[] = []

  for (const token of tokens) {
    letterTotal += token.length
    syllableTotal += countSyllables(token)
    if (token.length >= 2 && !lexicon.stopwords.has(token)) {
      frequency.set(token, (frequency.get(token) ?? 0) + 1)
      contentWords.push(token)
    }
  }

  // Stimmung: berücksichtigt Negation ("nicht gut") und Verstärker ("sehr gut")
  // in einem Fenster von bis zu zwei Wörtern vor dem Stimmungswort.
  let positiveScore = 0
  let negativeScore = 0
  const positiveSet = new Set<string>()
  const negativeSet = new Set<string>()
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    const isPositive = lexicon.positive.has(token)
    const isNegative = lexicon.negative.has(token)
    if (!isPositive && !isNegative) continue

    let negated = false
    let weight = 1
    for (let j = Math.max(0, i - 2); j < i; j += 1) {
      if (lexicon.negations.has(tokens[j])) negated = true
      if (lexicon.intensifiers.has(tokens[j])) weight = 2
    }

    const countsAsPositive = negated ? !isPositive : isPositive
    const label = negated ? `(nicht) ${token}` : token
    if (countsAsPositive) {
      positiveScore += weight
      positiveSet.add(label)
    } else {
      negativeScore += weight
      negativeSet.add(label)
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

  let longestSentenceWords = 0
  let shortestSentenceWords = 0
  let longestSentence = ''
  let shortestSentence = ''
  for (const sentence of sentenceMatches) {
    const count = (sentence.match(/[\p{L}\p{N}]+/gu) ?? []).length
    if (count === 0) continue
    if (count > longestSentenceWords) {
      longestSentenceWords = count
      longestSentence = sentence.trim()
    }
    if (shortestSentenceWords === 0 || count < shortestSentenceWords) {
      shortestSentenceWords = count
      shortestSentence = sentence.trim()
    }
  }

  let hapaxCount = 0
  for (const count of frequency.values()) {
    if (count === 1) hapaxCount += 1
  }

  const letterFreq = new Map<string, number>()
  for (const letter of text.toLowerCase().match(/\p{L}/gu) ?? []) {
    letterFreq.set(letter, (letterFreq.get(letter) ?? 0) + 1)
  }
  const topLetters: WordCount[] = [...letterFreq.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)

  const wordCount = tokens.length
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0
  const avgSyllables = wordCount > 0 ? syllableTotal / wordCount : 0
  // Flesch-Reading-Ease (deutsche Amstad-Formel), auf 0–100 begrenzt.
  const rawReadability = 180 - avgSentenceLength - 58.5 * avgSyllables
  const readability =
    wordCount > 0 ? Math.min(100, Math.max(0, Math.round(rawReadability))) : 0

  const sentimentTotal = positiveScore + negativeScore
  const sentimentScore =
    sentimentTotal > 0 ? (positiveScore - negativeScore) / sentimentTotal : 0
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
    averageWordsPerSentence: avgSentenceLength,
    longestSentenceWords,
    shortestSentenceWords,
    longestSentence,
    shortestSentence,
    hapaxCount,
    readingMinutes: wordCount / 200,
    readability,
    readabilityLabel: wordCount > 0 ? readabilityLabel(readability, language) : '–',
    sentiment,
    sentimentScore,
    positiveWords: [...positiveSet],
    negativeWords: [...negativeSet],
    topWords,
    topBigrams,
    topLetters,
  }
}
