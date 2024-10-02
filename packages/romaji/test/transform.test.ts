import { describe, expect, it } from 'vitest'
import { createTokens } from '../src'
import { transformOnbiki } from '../src/utils/transformOnbiki'
import { transformOshimai } from '../src/utils/transformOshimai'
import { transformSokuon } from '../src/utils/transformSokuon'

describe('transformOnbiki', () => {
  it('onbiki', () => {
    const tokens = createTokens('ねー')
    transformOnbiki(tokens)
    expect(tokens).toMatchInlineSnapshot(`
      [
        {
          "index": 0,
          "source": "ね",
          "value": "ne",
        },
        {
          "index": 1,
          "mergeForwards": true,
          "source": "ー",
          "value": "e",
        },
      ]
    `)
  })

  it('kogakimoji', () => {
    const tokens = createTokens('ねぇ')
    transformOnbiki(tokens)
    expect(tokens).toMatchInlineSnapshot(`
      [
        {
          "index": 0,
          "source": "ね",
          "value": "ne",
        },
        {
          "index": 1,
          "mergeForwards": true,
          "source": "ぇ",
          "value": "e",
        },
      ]
    `)
  })
})

describe('transformOshimai', () => {
  it('basic', () => {
    const tokens = createTokens('ねん')
    transformOshimai(tokens)
    expect(tokens).toMatchInlineSnapshot(`
      [
        {
          "index": 0,
          "source": "ね",
          "value": "ne",
        },
        {
          "index": 1,
          "mergeForwards": true,
          "source": "ん",
          "value": "n",
        },
      ]
    `)
  })

  it('before vowel', () => {
    const tokens = createTokens('んあ')
    transformOshimai(tokens)
    expect(tokens).toMatchInlineSnapshot(`
      [
        {
          "index": 0,
          "mergeForwards": true,
          "source": "ん",
          "value": "n'",
        },
        {
          "index": 1,
          "source": "あ",
          "value": "a",
        },
      ]
    `)
  })
})

describe('transformSokuon', () => {
  it('basic', () => {
    const tokens = createTokens('って')
    transformSokuon(tokens)
    expect(tokens).toMatchInlineSnapshot(`
      [
        {
          "index": 0,
          "source": "っ",
          "value": "t",
        },
        {
          "index": 1,
          "mergeForwards": true,
          "source": "て",
          "value": "te",
        },
      ]
    `)
  })
})
