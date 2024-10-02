import type { RomajiToken } from '../types'

export function transformOshimai(tokens: RomajiToken[]) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!
    const next = tokens[i + 1]
    if (token.source !== 'ん')
      continue

    if (next && /^[aeiouy]/.test(next.value)) {
      token.value += '\''
    }
    token.mergeForwards = true
  }
}
