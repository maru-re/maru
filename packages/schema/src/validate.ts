import type { MaruSongData } from './schema'
import { parse } from 'valibot'
import { MaruSongSchama } from './schema'

export const SUPPORTED_VERSIONS = ['1']

export function validate(input: unknown): MaruSongData {
  return parse(MaruSongSchama, input)
}
