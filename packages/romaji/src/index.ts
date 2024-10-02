import type { RomajiToken } from './types'
import { hiraganaToRomajiMap } from './data'
import { transformOnbiki } from './utils/transformOnbiki'
import { transformOshimai } from './utils/transformOshimai'
import { transformSokuon } from './utils/transformSokuon'

export function katakanaToHiragana(katakana: string): string {
  return katakana.replace(/[\u30A1-\u30F6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60
    return String.fromCharCode(chr)
  })
}

interface HiraganaToRomajiOptions {
  mode?: 'split' | 'merge'
}

export function hiraganaToRomaji(hiragana: string, options: HiraganaToRomajiOptions = {}) {
  const {
    mode = 'merge',
  } = options

  const text = katakanaToHiragana(hiragana)
  const tokens = createTokens(text)

  transformOshimai(tokens)
  transformOnbiki(tokens)
  transformSokuon(tokens)

  return tokens
    .filter(({ value }) => value)
    .map(token => mode === 'merge' && token.mergeForwards ? token.value : ` ${token.value}`)
    .join('')
    .trimStart()
}

function createTokens(text: string) {
  const tokens: RomajiToken[] = []
  let chars = text

  for (const [kana, value] of hiraganaToRomajiMap) {
    chars = chars.replace(kana, (match, index) => {
      tokens.push({
        index,
        source: match,
        value,
      })
      return ' '.repeat(match.length)
    })
  }

  [...chars].forEach((char, i) => {
    if (char !== ' ') {
      tokens.push({
        index: i,
        source: char,
        value: '',
      })
    }
  })

  return tokens.sort((a, b) => a.index - b.index)
}
