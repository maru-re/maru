import type { MaruSongDataParsed } from '@marure/schema'
import { useNuxtApp } from 'nuxt/app'
import { reactive } from 'vue'

export interface ValidationErrors {
  youtube: string
  title: string
  artists: string
  tags: string
  offset?: string
  notes?: string
}

export function useValidation(stateRef: MaruSongDataParsed) {
  const errors = reactive<ValidationErrors>({
    youtube: '',
    title: '',
    artists: '',
    tags: '',
  })
  const nuxtApp = useNuxtApp()
  const { t } = nuxtApp.$i18n

  const validate = (): boolean => {
    let isValid = true

    errors.youtube = ''
    errors.title = ''
    errors.artists = ''
    errors.tags = ''

    if (!stateRef.youtube || !stateRef.youtube.trim()) {
      errors.youtube = t('editor.validator.youtube')
      isValid = false
    }

    if (!stateRef.title || !stateRef.title.trim()) {
      errors.title = t('editor.validator.title')
      isValid = false
    }
    if (!stateRef.artists || stateRef.artists?.includes('')) {
      errors.artists = t('editor.validator.artists')
      isValid = false
    }

    if (!stateRef.tags || stateRef.tags?.includes('')) {
      errors.tags = t('editor.validator.tags')
      isValid = false
    }
    return isValid
  }

  return {
    errors,
    validate,
  }
}
