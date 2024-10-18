import type { MaruSongData, MaruSongDataParsed } from '@marure/schema'
import { parseLrc } from './lrc'

export function parseSongData(song: MaruSongData): MaruSongDataParsed {
  return {
    ...song,
    lyrics: parseLrc(song.lrc).lyrics,
  }
}
