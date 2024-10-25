import type { MaruSongDataParsed } from '@marure/schema'
import { _settings } from '~/state/local-storage'

export function useSettings() {
  return _settings
}

export function useTranslationSettings(song: MaybeRefOrGetter<MaruSongDataParsed | undefined>) {
  const settings = useSettings()

  const translations = computed(() => {
    const _song = toValue(song)
    if (!_song)
      return []

    const locales = new Set<string>()
    for (const line of _song.lyrics) {
      for (const [key, value] of Object.entries(line.trans ?? {})) {
        if (value?.trim())
          locales.add(key)
      }
    }

    return Array.from(locales)
  })

  const translationsEnabled = computed(() => settings.value.translation && translations.value.includes(settings.value.translationLocale))

  function toggleTranslation() {
    settings.value.translation = !settings.value.translation
  }

  function setTranslationLocale(localeCode: string) {
    if (settings.value.translationLocale === localeCode && settings.value.translation) {
      settings.value.translation = false
    }
    else {
      settings.value.translationLocale = localeCode
      settings.value.translation = true
    }
  }

  return {
    translations,
    translationsEnabled,
    toggleTranslation,
    setTranslationLocale,
  }
}
