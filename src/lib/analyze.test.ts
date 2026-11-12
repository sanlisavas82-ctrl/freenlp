import { describe, it, expect } from 'vitest'
import { analyze, countSyllables } from './analyze'

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
})
