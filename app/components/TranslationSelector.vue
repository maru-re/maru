<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { Menu } from 'floating-vue'

const props = defineProps<{
  type: 'toggle-button' | 'toggle'
  song?: MaruSongDataParsed
}>()

const settings = useSettings()
const { locales } = useI18n()

const {
  translations,
  translationsEnabled,
  setTranslationLocale,
  toggleTranslation,
} = useTranslationSettings(() => props.song)
</script>

<template>
  <Menu placement="bottom">
    <ActionButton
      icon="i-uil-english-to-chinese"
      :type="type"
      :active="translationsEnabled"
      :title="type === 'toggle-button' ? $t('settings.displayTranslation') : undefined"
      @click="toggleTranslation"
    />
    <template #popper>
      <div px4 py3 flex="~ col gap-2">
        <div v-if="!translations.length" op75>
          {{ $t('messages.noTranslations') }}
        </div>
        <template v-else>
          <div>
            {{ $t('settings.displayTranslation') }}
          </div>
          <ToggleButton
            v-for="trans in translations" :key="trans"
            :model-value="settings.translationLocale === trans && settings.translation"
            :title="locales.find(l => l.code === trans)?.name || trans"
            @click="setTranslationLocale(trans)"
          />
        </template>
      </div>
    </template>
  </Menu>
</template>
