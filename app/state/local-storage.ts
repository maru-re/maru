import type { MaruSongGist } from '@marure/schema'
import type { UiSettings } from '~/types/settings'

export const _settings = useLocalStorage<UiSettings>(
  'maru-settings',
  {
    romaji: false,
    kanji: true,
    furigana: true,
    translation: false,
    follow: true,
    autoPause: false,
    speed: 1,
    fontSize: 1,
  },
  {
    mergeDefaults: true,
  },
)

export const _lastVersion = useLocalStorage<string>('maru-version', 'null')
export const _recentIds = useLocalStorage<string[]>('maru-recent', [])
export const _favoriteIds = useLocalStorage<string[]>('maru-favorite', [])
export const _collections = useLocalStorage<MaruSongGist[]>('maru-collections', [])
