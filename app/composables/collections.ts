import type { MaruSongData } from '@marure/schema'
import { validate } from '@marure/schema'
import { _songsStorage } from '~/state/indexdb'

export async function saveSongToStorage(song: MaruSongData): Promise<void> {
  song = validate(song)
  localStorage.removeItem(`maru-song-${song.youtube}`)
  await _songsStorage.set(song.youtube, song)
}

export async function loadSongFromStorage(id: string): Promise<MaruSongData | undefined> {
  const data = localStorage.getItem(`maru-song-${id}`)
  if (data) {
    const song = JSON.parse(data)
    await _songsStorage.set(id, song)
    return song
  }
  return _songsStorage.get(id) as Promise<MaruSongData | undefined>
}

export async function removeSongFromStorage(id: string) {
  localStorage.removeItem(`maru-song-${id}`)
  await _songsStorage.remove(id)
}
