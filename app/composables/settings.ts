import type { LocaleObject } from '@nuxtjs/i18n'
import { _settings } from '~/state/local-storage'

export function useSettings() {
  return _settings
}

export function useTranslationSettings(translations: Ref<LocaleObject[]>) {
  const settings = useSettings()
  const { locale } = useI18n()

  const translationBoolean = computed({
    get: () => {
      return settings.value.translation !== false
    },
    set(value: boolean) {
      // When there is only one translation, true means that it is the translation
      settings.value.translation = value && translations.value.length === 1
        ? translations.value[0]!.code
        : value
    },
  })

  const translationValue = computed(() => {
    const v = settings.value.translation
    return v === true
      ? locale.value
      : v
  })

  function setDisplayTranslation(localeCode: string) {
    settings.value.translation = translationValue.value === localeCode
      ? false
      : localeCode
  }

  return {
    translationBoolean,
    translationValue,
    setDisplayTranslation,
  }
}
