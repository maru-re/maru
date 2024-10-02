// This module contains local state of importing

import type { MaruSongData } from '@marure/schema'

export interface FileParseResult {
  file: File
  data?: MaruSongData
  error?: unknown
}

export interface SucceededResult {
  filename: string
  data: MaruSongData
}

export interface FailedResult {
  filename: string
  error: unknown
}

export const _importingState = ref<{
  isImporting: boolean
  isFinished: boolean
  count: number
  succeeded: SucceededResult[]
  failed: FailedResult[]
}>({
  isImporting: false,
  isFinished: false,
  count: 0,
  succeeded: [],
  failed: [],
})
