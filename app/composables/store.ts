import { extractGist, type MaruSongData, type MaruSongGist } from '@marure/schema'
import { _collections, _favoriteIds, _lastVersion, _recentIds } from '~/state/local-storage'
import { version } from '../../package.json'

const RECENT_MAX = 10

export function checkVersion() {
  if (_lastVersion.value !== version) {
    // Clear all data if the version is not stored (too old)
    if (_lastVersion.value === 'null') {
      removeAllData()
    }
    // Migrations, if needed
    // if (lastVersion.value === '0.0.0') {
    // }
    _lastVersion.value = version
  }
}

export function removeAllData() {
  Object.keys(localStorage)
    .forEach((i) => {
      if (i.startsWith('maru-'))
        localStorage.removeItem(i)
    })
  _collections.value = []
  _favoriteIds.value = []
  _recentIds.value = []
}

export function saveSongsToLocal(songs: MaruSongData[]) {
  const append: MaruSongGist[] = []
  for (const song of songs) {
    saveSongToStorage(song)
    const gist = markRaw(extractGist(song))
    append.unshift(gist)
  }
  _collections.value = [...append, ..._collections.value.filter(g => !append.some(a => a.youtube === g.youtube))]
}

export function useCollections() {
  function addRecent(id: string) {
    _recentIds.value = [id, ..._recentIds.value.filter(i => i !== id)].slice(0, RECENT_MAX)
  }
  function isFavorite(id: string) {
    return _favoriteIds.value.includes(id)
  }
  function toggleFavorite(id: string, value = !isFavorite(id)) {
    if (value) {
      _favoriteIds.value = [id, ..._favoriteIds.value.filter(i => i !== id)]
    }
    else {
      _favoriteIds.value = _favoriteIds.value.filter(i => i !== id)
    }
  }

  return {
    recentIds: _recentIds,
    favoriteIds: _favoriteIds,
    collections: _collections,
    addRecent,
    isFavorite,
    toggleFavorite,
  }
}

export function removeSong(id: string) {
  removeSongFromStorage(id)
  _collections.value = _collections.value.filter(g => g.youtube !== id)
  _favoriteIds.value = _favoriteIds.value.filter(i => i !== id)
  _recentIds.value = _recentIds.value.filter(i => i !== id)
}
