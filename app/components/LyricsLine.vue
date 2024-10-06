<script setup lang="ts">
import type { LyricLine } from '@marure/schema'
import { hiraganaToRomaji } from '@marure/romaji'
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
            {{ word.w }}
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
      v-if="settings.translation && line.trans?.['zh-Hant']"
      class="lyric-line-translate"
      lang="zh" mt-1
    >
      {{ line.trans['zh-Hant'] }}
    </div>
  </div>
</template>
