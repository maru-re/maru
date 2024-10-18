import type { MaruSongDataParsed } from '@marure/schema'
import type { LocaleObject } from '@nuxtjs/i18n'
import { _settings } from '~/state/local-storage'

export function useSettings() {
  return _settings
}

export function useTranslationSettings() {
  const settings = useSettings()

  function getTranslationOptions(locales: LocaleObject[], song?: MaruSongDataParsed) {
    if (!song)
      return []

    const localeObjectMap = locales.reduce((acc, locale) => {
      acc[locale.code] = locale
      return acc
    }, {} as Record<string, LocaleObject>)

    const translationLocaleCodes = song.lyrics.reduce((acc, item) => {
      const codes = Object.keys(item.trans ?? {})
      for (const code of codes) {
        if (acc.includes(code)) {
          continue
        }
        acc.push(code)
      }
      return acc
    }, [] as string[])

    return translationLocaleCodes.map(v => localeObjectMap[v])
  }

  function setTranslationLocale(localeCode: string): void {
    const isTransaltionEnabled = settings.value.translation

    if (settings.value.translationLocale === localeCode && isTransaltionEnabled) {
      settings.value.translation = false
      return
    }

    settings.value.translationLocale = localeCode

    if (!isTransaltionEnabled) {
      settings.value.translation = true
    }
  }

  return {
    getTranslationOptions,
    setTranslationLocale,
  }
}
