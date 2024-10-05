<script setup lang="ts">
import type { LyricLine } from '@marure/schema'
import { parseLrcLineContent, serializeLineContentToLrc } from '@marure/parser'

defineProps<{
  index: number
}>()

const line = defineModel<LyricLine>('line', { required: true })

const input = computed({
  get() {
    return serializeLineContentToLrc(line.value.words)
  },
  set(value: string) {
    line.value.words = parseLrcLineContent(value)
  },
})
</script>

<template>
  <LyricsLine
    ml30 p2 text-primary font-jp-serif
    role="" flex="~ col items-start"
    :line="line"
    :index="index"
    :settings="{ furigana: true, kanji: true, romaji: false, translation: false }"
  />
  <div border="~ base rounded" p2 flex="~ gap-2 items-center" class="group/line-editor">
    <TimestampEditor v-model="line.t" />
    <TextInput v-model="input" w-full />
  </div>
</template>
