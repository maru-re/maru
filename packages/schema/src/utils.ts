import type { MaruSongData, MaruSongGist } from './schema'

export function extractGist(data: MaruSongData): MaruSongGist {
  return {
    schema: data.schema,
    youtube: data.youtube,
    title: data.title,
    artists: data.artists,
    tags: data.tags,
    dateSongReleased: data.dateSongReleased,
    dateLyricsUpdated: data.dateLyricsUpdated,
  }
}
