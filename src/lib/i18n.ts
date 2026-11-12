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
  clear: string
  readability: string
  sentiment: string
  score: string
  topWords: string
  topBigrams: string
  empty: string
  footer: string
  stats: {
    characters: string
    charactersNoSpaces: string
    words: string
    uniqueWords: string
    sentences: string
    paragraphs: string
    syllables: string
    averageWordLength: string
    averageWordsPerSentence: string
    longestSentenceWords: string
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
    copy: 'Ergebnis kopieren',
    copied: 'Kopiert ✓',
    download: 'Als Datei (.txt)',
    clear: 'Leeren',
    readability: 'Lesbarkeit',
    sentiment: 'Stimmung',
    score: 'Score',
    topWords: 'Häufigste Wörter',
    topBigrams: 'Häufige Wortpaare',
    empty: 'Noch keine Daten – gib oben einen Text ein, um die Analyse zu starten.',
    footer: 'FreeNLP · Alle Berechnungen laufen lokal in deinem Browser.',
    stats: {
      characters: 'Zeichen',
      charactersNoSpaces: 'Ohne Leerzeichen',
      words: 'Wörter',
      uniqueWords: 'Einzigartige Wörter',
      sentences: 'Sätze',
      paragraphs: 'Absätze',
      syllables: 'Silben',
      averageWordLength: 'Ø Wortlänge',
      averageWordsPerSentence: 'Ø Wörter/Satz',
      longestSentenceWords: 'Längster Satz (W.)',
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
    copy: 'Sonucu kopyala',
    copied: 'Kopyalandı ✓',
    download: 'Dosya (.txt)',
    clear: 'Temizle',
    readability: 'Okunabilirlik',
    sentiment: 'Duygu',
    score: 'Puan',
    topWords: 'En sık kelimeler',
    topBigrams: 'Sık kelime çiftleri',
    empty: 'Henüz veri yok – analizi başlatmak için yukarıya bir metin girin.',
    footer: 'FreeNLP · Tüm hesaplamalar tarayıcınızda yerel olarak çalışır.',
    stats: {
      characters: 'Karakter',
      charactersNoSpaces: 'Boşluksuz',
      words: 'Kelime',
      uniqueWords: 'Benzersiz kelime',
      sentences: 'Cümle',
      paragraphs: 'Paragraf',
      syllables: 'Hece',
      averageWordLength: 'Ort. kelime uzunluğu',
      averageWordsPerSentence: 'Ort. kelime/cümle',
      longestSentenceWords: 'En uzun cümle (kel.)',
      readingMinutes: 'Okuma süresi (dk)',
    },
    sentimentLabels: { positiv: 'Pozitif', negativ: 'Negatif', neutral: 'Nötr' },
  },
}
