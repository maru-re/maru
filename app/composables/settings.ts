import type { UiSettings } from '~/types/settings'

const settings = useLocalStorage<UiSettings>(
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

export function useSettings() {
  return settings
}
