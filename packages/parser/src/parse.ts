import type { MaruSongData, MaruSongDataParsed } from '@marure/schema'
import { parseLrc } from './lrc'

export function parseSongData(song: MaruSongData): MaruSongDataParsed {
  const parsed = parseLrc(song.lrc)

  return {
    ...song,
    lyrics: parsed.lyrics,
    lyricLocales: parsed.locales,
  }
}
