import { expect, it } from 'vitest'
import { secondsToTimestamp, timestampToSeconds } from '../src'

function t2s(timestamp: string, cols = 2, digits = 2) {
  const seconds = timestampToSeconds(timestamp)
  const newTimestamp = secondsToTimestamp(seconds, cols, digits)
  expect.soft(newTimestamp).toBe(timestamp)
  return expect(seconds)
}

function s2t(s: number) {
  const timestamp = secondsToTimestamp(s)
  const newSeconds = timestampToSeconds(timestamp)
  expect.soft(newSeconds).toBe(s)
  return expect(timestamp)
}

it('timestampToSeconds', () => {
  t2s('00:00', 2, 0).toBe(0)
  t2s('00:00.15').toBe(0.15)
  t2s('00:01', 2, 0).toBe(1)
  t2s('01:00:01', 2, 0).toBe(3601)
  t2s('01:04:01.10').toBe(3841.1)
})

it('secondsToTimestamp', () => {
  s2t(0).toBe('00:00.00')
  s2t(0.15).toBe('00:00.15')
  s2t(1).toBe('00:01.00')
  s2t(3601).toBe('01:00:01.00')
})
