import { extractGist, type MaruSongData, type MaruSongGist } from '@marure/schema'

const RECENT_MAX = 10

const recentIds = useLocalStorage<string[]>('maru-recent', [])
const favoriteIds = useLocalStorage<string[]>('maru-favorite', [])
const collections = useLocalStorage<MaruSongGist[]>('maru-collections', [])

export function saveSongsToLocal(songs: MaruSongData[]) {
  const append: MaruSongGist[] = []
  for (const song of songs) {
    localStorage.setItem(`maru-song-${song.youtube}`, JSON.stringify(song))
    const gist = markRaw(extractGist(song))
    append.unshift(gist)
  }
  collections.value = [...append, ...collections.value.filter(g => !append.some(a => a.youtube === g.youtube))]
}

export function useCollections() {
  function addRecent(id: string) {
    recentIds.value = [id, ...recentIds.value.filter(i => i !== id)].slice(0, RECENT_MAX)
  }
  function isFavorite(id: string) {
    return favoriteIds.value.includes(id)
  }
  function toggleFavorite(id: string, value = !isFavorite(id)) {
    if (value) {
      favoriteIds.value = [id, ...favoriteIds.value.filter(i => i !== id)]
    }
    else {
      favoriteIds.value = favoriteIds.value.filter(i => i !== id)
    }
  }

  return {
    recentIds,
    favoriteIds,
    collections,
    addRecent,
    isFavorite,
    toggleFavorite,
  }
}

export function removeSong(id: string) {
  localStorage.removeItem(`maru-song-${id}`)
  collections.value = collections.value.filter(g => g.youtube !== id)
  favoriteIds.value = favoriteIds.value.filter(i => i !== id)
  recentIds.value = recentIds.value.filter(i => i !== id)
}
