<script setup lang="ts">
import type { LyricLine } from '@marure/schema'
import { hiraganaToRomaji } from '@marure/romaji'
import { convertCC } from '~/addons/simplecc'
import type { UiSettings } from '~/types/settings'

const props = defineProps<{
  line: LyricLine
  index?: number
  settings?: Partial<UiSettings>
}>()

const globalSettings = useSettings()
const settings = computed(() => props.settings || globalSettings.value)

const romaji = computed(() => {
  const text = props.line.words.map(w => w.r || w.w).join(' ')
  return hiraganaToRomaji(text)
})

const { locale } = useI18n()
const translation = ref<string>()

watchEffect(async () => {
  if (!settings.value.translation) {
    translation.value = ''
    return
  }
  const matched = props.line.trans?.[locale.value]
  if (matched) {
    translation.value = matched
    return
  }

  translation.value = ''

  if (!settings.value.convertChineseHansHant)
    return

  if (locale.value === 'zh-Hans' && props.line.trans?.['zh-Hant']) {
    const hant = props.line.trans['zh-Hant']
    translation.value = await convertCC(hant, 't2s')
  }
  if (locale.value === 'zh-Hant' && props.line.trans?.['zh-Hans']) {
    const hans = props.line.trans['zh-Hans']
    translation.value = await convertCC(hans, 's2t')
  }
})
</script>

<template>
  <div
    role="button" :line="index"
    flex="~ col items-center"
    px-2em transition duration-500
    class="lyric-line group"
  >
    <div class="lyric-line-source" lang="jp">
      <div v-if="!line.words.length" i-uil-ellipsis-h op50 />
      <template v-for="word, i of line.words" :key="i">
        <template v-if="word.r">
          <ruby v-if="settings.kanji && settings.furigana" :st="word.t">
            <rb>{{ word.w }}</rb>
            <rt mb-2px>{{ word.r }}</rt>
          </ruby>
          <span v-else-if="!settings.kanji" :st="word.t">
            {{ word.r }}
          </span>
          <span v-else :st="word.t">
            {{ word.w }}
          </span>
        </template>
        <span v-else :st="word.t">
          {{ word.w }}
        </span>
      </template>
    </div>
    <div v-if="settings.romaji" class="lyric-line-romaji" lang="en">
      {{ romaji }}
    </div>
    <div
      v-if="settings.translation && translation"
      class="lyric-line-translate"
      :lang="locale" mt-1
    >
      {{ translation }}
    </div>
  </div>
</template>
