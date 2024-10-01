import { describe, expect, it } from 'vitest'
import { validate } from '../src/validate'

describe('parsed', () => {
  it('works', () => {
    expect(validate({
      schema: 'v1',
      youtube: 'QX4j2cV6LW0',
      title: 'Maru - 你好',
      lrc: '',
    }))
      .toMatchInlineSnapshot(`
        {
          "lrc": "",
          "schema": "v1",
          "title": "Maru - 你好",
          "youtube": "QX4j2cV6LW0",
        }
      `)
  })
})

describe('should throw error when schema is invalid', () => {
  it('empty', () => {
    expect(() => validate({}))
      .toThrowErrorMatchingInlineSnapshot(`[Error: Invalid data format: Missing schema version]`)
  })

  it('basic', () => {
    expect(() => validate({
      schema: 'v100',
      youtube: 'QX4j2cV6LW0',
      title: 'Maru - 你好',
      lyrics: '',
    }))
      .toThrowErrorMatchingInlineSnapshot(`[Error: Unsupported schema version: v100, currently supported versions: v1]`)
  })
})
