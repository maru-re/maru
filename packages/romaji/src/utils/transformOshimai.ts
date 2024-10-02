import type { RomajiToken } from '../types'

export function transformOshimai(tokens: RomajiToken[]) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!
    if (token.source !== 'ん')
      continue

    token.mergeForwards = true
  }
}
