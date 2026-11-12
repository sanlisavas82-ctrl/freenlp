import type { Language, SentimentLabel } from './analyze'

export interface UiStrings {
  tagline: string
  placeholder: string
  detected: string
  langNames: Record<Language, string>
  example: string
  copy: string
  copied: string
  download: string
  downloadMd: string
  downloadCsv: string
  print: string
  clear: string
  readability: string
  sentiment: string
  score: string
  positiveWords: string
  negativeWords: string
  longestSentence: string
  shortestSentence: string
  topWords: string
  topBigrams: string
  topLetters: string
  wordLengths: string
  empty: string
  footer: string
  theme: { auto: string; light: string; dark: string }
  stats: {
    characters: string
    charactersNoSpaces: string
    words: string
    uniqueWords: string
    sentences: string
    paragraphs: string
    syllables: string
    averageWordLength: string
    lexicalDiversity: string
    averageWordsPerSentence: string
    longestSentenceWords: string
    shortestSentenceWords: string
    hapaxCount: string
    readingMinutes: string
  }
  sentimentLabels: Record<SentimentLabel, string>
}

export const UI: Record<Language, UiStrings> = {
  de: {
    tagline: 'Kostenlose Textanalyse – direkt im Browser, ohne Server.',
    placeholder: 'Füge hier deinen Text ein oder tippe los …',
    detected: 'Erkannt',
    langNames: { de: 'Deutsch', tr: 'Türkisch' },
    example: 'Beispieltext',
    copy: 'Kopieren',
    copied: 'Kopiert ✓',
    download: '.txt',
    downloadMd: '.md',
    downloadCsv: '.csv',
    print: 'PDF',
    clear: 'Leeren',
    readability: 'Lesbarkeit',
    sentiment: 'Stimmung',
    score: 'Score',
    positiveWords: 'Positive Wörter',
    negativeWords: 'Negative Wörter',
    longestSentence: 'Längster Satz',
    shortestSentence: 'Kürzester Satz',
    topWords: 'Häufigste Wörter',
    topBigrams: 'Häufige Wortpaare',
    topLetters: 'Buchstaben-Häufigkeit',
    wordLengths: 'Wortlängen-Verteilung',
    empty: 'Noch keine Daten – gib oben einen Text ein, um die Analyse zu starten.',
    footer: 'FreeNLP · Alle Berechnungen laufen lokal in deinem Browser.',
    theme: { auto: '🌓 System', light: '☀️ Hell', dark: '🌙 Dunkel' },
    stats: {
      characters: 'Zeichen',
      charactersNoSpaces: 'Ohne Leerzeichen',
      words: 'Wörter',
      uniqueWords: 'Einzigartige Wörter',
      sentences: 'Sätze',
      paragraphs: 'Absätze',
      syllables: 'Silben',
      averageWordLength: 'Ø Wortlänge',
      lexicalDiversity: 'Vielfalt (TTR)',
      averageWordsPerSentence: 'Ø Wörter/Satz',
      longestSentenceWords: 'Längster Satz (W.)',
      shortestSentenceWords: 'Kürzester Satz (W.)',
      hapaxCount: 'Einmalige Wörter',
      readingMinutes: 'Lesezeit (min)',
    },
    sentimentLabels: { positiv: 'Positiv', negativ: 'Negativ', neutral: 'Neutral' },
  },
  tr: {
    tagline: 'Ücretsiz metin analizi – doğrudan tarayıcıda, sunucusuz.',
    placeholder: 'Metnini buraya yapıştır veya yazmaya başla …',
    detected: 'Algılanan',
    langNames: { de: 'Almanca', tr: 'Türkçe' },
    example: 'Örnek metin',
    copy: 'Kopyala',
    copied: 'Kopyalandı ✓',
    download: '.txt',
    downloadMd: '.md',
    downloadCsv: '.csv',
    print: 'PDF',
    clear: 'Temizle',
    readability: 'Okunabilirlik',
    sentiment: 'Duygu',
    score: 'Puan',
    positiveWords: 'Olumlu kelimeler',
    negativeWords: 'Olumsuz kelimeler',
    longestSentence: 'En uzun cümle',
    shortestSentence: 'En kısa cümle',
    topWords: 'En sık kelimeler',
    topBigrams: 'Sık kelime çiftleri',
    topLetters: 'Harf sıklığı',
    wordLengths: 'Kelime uzunluğu dağılımı',
    empty: 'Henüz veri yok – analizi başlatmak için yukarıya bir metin girin.',
    footer: 'FreeNLP · Tüm hesaplamalar tarayıcınızda yerel olarak çalışır.',
    theme: { auto: '🌓 Sistem', light: '☀️ Açık', dark: '🌙 Koyu' },
    stats: {
      characters: 'Karakter',
      charactersNoSpaces: 'Boşluksuz',
      words: 'Kelime',
      uniqueWords: 'Benzersiz kelime',
      sentences: 'Cümle',
      paragraphs: 'Paragraf',
      syllables: 'Hece',
      averageWordLength: 'Ort. kelime uzunluğu',
      lexicalDiversity: 'Çeşitlilik (TTR)',
      averageWordsPerSentence: 'Ort. kelime/cümle',
      longestSentenceWords: 'En uzun cümle (kel.)',
      shortestSentenceWords: 'En kısa cümle (kel.)',
      hapaxCount: 'Tek geçen kelime',
      readingMinutes: 'Okuma süresi (dk)',
    },
    sentimentLabels: { positiv: 'Pozitif', negativ: 'Negatif', neutral: 'Nötr' },
  },
}
