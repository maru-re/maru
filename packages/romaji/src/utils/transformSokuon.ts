import type { RomajiToken } from '../types'

export function transformSokuon(tokens: RomajiToken[]) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!
    const next = tokens[i + 1]
    if (
      token.source !== 'っ'
      || !next
      || !/^[^aeiou]/.test(next?.value)
    ) {
      continue
    }

    const char = next.value.at(0)!
    token.value = char === 'c' ? 't' : char
    next.mergeForwards = true
  }
}
