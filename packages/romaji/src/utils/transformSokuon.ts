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

    token.value = next.value.at(0)!
    next.mergeForwards = true
  }
}
