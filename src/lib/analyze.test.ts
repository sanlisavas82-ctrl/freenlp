import { describe, it, expect } from 'vitest'
import { analyze, countSyllables, detectLanguage } from './analyze'

describe('countSyllables', () => {
  it('zählt Vokalgruppen als Silben', () => {
    expect(countSyllables('haus')).toBe(1)
    expect(countSyllables('hallo')).toBe(2)
    expect(countSyllables('analyse')).toBe(4)
  })

  it('gibt für ein Wort mindestens 1 zurück', () => {
    expect(countSyllables('rhythm')).toBeGreaterThanOrEqual(1)
  })
})

describe('analyze – leerer Text', () => {
  const result = analyze('')

  it('liefert überall Nullwerte', () => {
    expect(result.words).toBe(0)
    expect(result.sentences).toBe(0)
    expect(result.readability).toBe(0)
  })

  it('ist neutral ohne Stimmungssignal', () => {
    expect(result.sentiment).toBe('neutral')
    expect(result.readabilityLabel).toBe('–')
  })
})

describe('analyze – Zählungen', () => {
  const result = analyze('Das Haus ist schön. Das Haus ist groß.')

  it('zählt Wörter und Sätze', () => {
    expect(result.words).toBe(8)
    expect(result.sentences).toBe(2)
  })

  it('filtert Stoppwörter und zählt Häufigkeit', () => {
    const top = result.topWords.find((entry) => entry.word === 'haus')
    expect(top?.count).toBe(2)
    expect(result.topWords.some((entry) => entry.word === 'ist')).toBe(false)
  })

  it('berechnet längsten Satz und Wörter pro Satz', () => {
    expect(result.longestSentenceWords).toBe(4)
    expect(result.averageWordsPerSentence).toBe(4)
  })

  it('berechnet kürzesten Satz und einmalige Wörter', () => {
    const r = analyze('Das Haus ist groß. Es regnet heute wirklich stark.')
    expect(r.shortestSentenceWords).toBe(4)
    // Inhaltswörter: haus, groß, regnet, heute, wirklich, stark → alle einmalig
    expect(r.hapaxCount).toBe(6)
  })

  it('liefert den Text des längsten und kürzesten Satzes', () => {
    const r = analyze('Kurz. Dies ist ein deutlich längerer Satz mit vielen Wörtern.')
    expect(r.shortestSentence).toBe('Kurz.')
    expect(r.longestSentence).toContain('deutlich längerer Satz')
  })

  it('zählt die Buchstaben-Häufigkeit', () => {
    const r = analyze('aabbbc')
    expect(r.topLetters[0]).toEqual({ word: 'b', count: 3 })
    expect(r.topLetters[1]).toEqual({ word: 'a', count: 2 })
  })
})

describe('analyze – Wortpaare', () => {
  it('erkennt wiederkehrende Bigramme', () => {
    const result = analyze('guten tag guten tag')
    const pair = result.topBigrams.find((entry) => entry.word === 'guten tag')
    expect(pair?.count).toBe(2)
  })
})

describe('analyze – Stimmung', () => {
  it('erkennt positive Texte', () => {
    expect(analyze('Das ist super und toll und gut.').sentiment).toBe('positiv')
  })

  it('erkennt negative Texte', () => {
    expect(analyze('Das ist schlecht und furchtbar.').sentiment).toBe('negativ')
  })

  it('bleibt ohne Signalwörter neutral', () => {
    expect(analyze('Das Haus steht am Baum.').sentiment).toBe('neutral')
  })

  it('dreht die Polarität bei Negation um', () => {
    expect(analyze('Das ist nicht gut.').sentiment).toBe('negativ')
    expect(analyze('Das ist nicht schlecht.').sentiment).toBe('positiv')
  })

  it('gewichtet Verstärker stärker', () => {
    const plain = analyze('Es ist gut aber auch schlecht.')
    expect(plain.sentiment).toBe('neutral')
    const boosted = analyze('Es ist sehr gut aber auch schlecht.')
    expect(boosted.sentimentScore).toBeGreaterThan(plain.sentimentScore)
    expect(boosted.sentiment).toBe('positiv')
  })

  it('listet die gefundenen Stimmungswörter auf', () => {
    const r = analyze('Das ist super und gut, aber leider schlecht.')
    expect(r.positiveWords).toContain('super')
    expect(r.positiveWords).toContain('gut')
    expect(r.negativeWords).toContain('schlecht')
  })
})

describe('analyze – Türkisch', () => {
  it('erkennt positive türkische Texte', () => {
    expect(analyze('Bu araç harika ve çok güzel.', 'tr').sentiment).toBe('positiv')
  })

  it('erkennt negative türkische Texte', () => {
    expect(analyze('Bu çok kötü ve berbat.', 'tr').sentiment).toBe('negativ')
  })

  it('filtert türkische Stoppwörter', () => {
    const result = analyze('araç araç bu ve bir', 'tr')
    expect(result.topWords.some((entry) => entry.word === 've')).toBe(false)
    const top = result.topWords.find((entry) => entry.word === 'araç')
    expect(top?.count).toBe(2)
  })
})

describe('detectLanguage', () => {
  it('erkennt Deutsch', () => {
    expect(detectLanguage('Das ist ein schöner Tag und die Sonne scheint.')).toBe('de')
  })

  it('erkennt Türkisch an Wörtern und Buchstaben', () => {
    expect(detectLanguage('Bu çok güzel bir gün ve hava harika.')).toBe('tr')
  })

  it('fällt bei leerem Text auf Deutsch zurück', () => {
    expect(detectLanguage('')).toBe('de')
  })
})
