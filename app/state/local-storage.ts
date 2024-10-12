import type { MaruSongGist } from '@marure/schema'
import type { UiSettings } from '~/types/settings'

export const _settings = useLocalStorage<UiSettings>(
  'maru-settings',
  {
    romaji: true,
    kanji: true,
    furigana: true,
    translation: true,
    follow: true,
    autoPause: false,
    speed: 1,
    fontSize: 1.2,
    convertChineseHansHant: true,
    loopSong: false,
  },
  {
    mergeDefaults: true,
  },
)

export const _lastVersion = useLocalStorage<string>('maru-version', 'null')
export const _recentIds = useLocalStorage<string[]>('maru-recent', [])
export const _favoriteIds = useLocalStorage<string[]>('maru-favorite', [])
export const _collections = useLocalStorage<MaruSongGist[]>('maru-collections', [])
