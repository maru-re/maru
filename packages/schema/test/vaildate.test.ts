import { describe, expect, it } from 'vitest'
import { validate } from '../src/validate'

describe('parsed', () => {
  it('works', () => {
    expect(validate({
      schema: 'v1',
      youtube: 'QX4j2cV6LW0',
      title: 'Maru - 你好',
      lyrics: '',
    }))
      .toMatchInlineSnapshot(`
        {
          "lyrics": [],
          "title": "Maru - 你好",
          "version": "2",
          "youtube": "QX4j2cV6LW0",
        }
      `)
  })
})

describe('should throw error when schema is invalid', () => {
  it('empty', () => {
    expect(() => validate({}))
      .toThrowErrorMatchingInlineSnapshot(`[ValiError: Invalid type: Expected string but received undefined]`)
  })

  it('basic', () => {
    expect(() => validate({
      schema: 'v100',
      youtube: 'QX4j2cV6LW0',
      title: 'Maru - 你好',
      lyrics: '',
    }))
      .toThrowErrorMatchingInlineSnapshot(`[ValiError: Currently only supports schema v1]`)
  })
})
