import type { MaruSongData, MaruSongGist } from './schema'

export function extractGist(data: MaruSongData): MaruSongGist {
  return {
    version: data.version,
    youtube: data.youtube,
    title: data.title,
    artists: data.artists,
    tags: data.tags,
    dateSongReleased: data.dateSongReleased,
    dateLyricsUpdated: data.dateLyricsUpdated,
  }
}
