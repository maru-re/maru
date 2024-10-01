import type { MaruSongData } from './schema'
import { parse } from 'valibot'
import { MaruSongSchama } from './schema'

export const SUPPORTED_VERSIONS = ['v1']

export function validate(input: object): MaruSongData {
  if ((input as any).schema === 'v1')
    return parse(MaruSongSchama, input)
  else if ((input as any).schema == null)
    throw new Error('Invalid data format: Missing schema version')
  else
    throw new Error(`Unsupported schema version: ${(input as any).schema}, currently supported versions: ${SUPPORTED_VERSIONS.join(', ')}`)
}
