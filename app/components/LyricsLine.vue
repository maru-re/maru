<script setup lang="ts">
import type { LyricLine } from '@marure/schema'

defineProps<{
  line: LyricLine
  index?: number
}>()

const settings = useSettings()

function lineToRomaji(line: LyricLine) {
  const str = line.words.map((word) => {
    if (typeof word === 'string') {
      return word
    }
    return word[1]
  }).join(' ')
  return hiraganaToRomaji(str).filter(Boolean).join(' ')
}
</script>

<template>
  <div
    role="button" :line="index"
    flex="~ col items-center"
    px-1.5em transition duration-500
    class="lyric-line group"
  >
    <div class="lyric-line-source" lang="jp">
      <template v-for="word, i of line.words" :key="i">
        <template v-if="typeof word === 'string'">
          {{ word }}
        </template>
        <template v-else-if="settings.kanji">
          <ruby v-if="settings.furigana">{{ word[0] }}<rt mb-2px>{{ word[1] }}</rt></ruby>
          <template v-else>
            {{ word[0] }}
          </template>
        </template>
        <template v-else>
          {{ word[1] }}
        </template>
      </template>
    </div>
    <div v-if="settings.romaji" class="lyric-line-romaji" lang="en">
      {{ lineToRomaji(line) }}
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
