import type { MaruSongData } from '@marure/schema'

export function saveSongToStorage(song: MaruSongData) {
  // TODO: move to IndexedDB
  localStorage.setItem(`maru-song-${song.youtube}`, JSON.stringify(song))
}

export function loadSongFromStorage(id: string): MaruSongData | undefined {
  const data = localStorage.getItem(`maru-song-${id}`)
  if (!data)
    return
  return JSON.parse(data)
}

export function removeSongFromStorage(id: string) {
  localStorage.removeItem(`maru-song-${id}`)
}
