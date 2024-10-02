import type { RomajiToken } from '../types'

export function transformOnbiki(tokens: RomajiToken[]) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!
    const prev = tokens[i - 1]
    if (
      'ぁぃぅぇぉー'.includes(token.source)
      || !prev
      || !/[aeiou]$/.test(prev?.value)
    ) {
      continue
    }

    const vowel = prev.value.at(-1)!
    if (token.source === 'ー') {
      token.value = vowel
      token.mergeForwards = true
    }
    else if (token.value === vowel) {
      token.mergeForwards = true
    }
  }
}
