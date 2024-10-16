import type { MaruSongDataParsed } from '@marure/schema'

export function createEmptySongData(id = ''): MaruSongDataParsed {
  return {
    schema: 'v1',
    youtube: id,
    title: '',
    artists: [],
    tags: [],
    lrc: '',
    lyrics: [],
    lyricLocales: [],
  }
}
