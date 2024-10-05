<script setup lang="ts">
import type { LyricLine } from '@marure/schema'
import { parseLrcLineContent, serializeLineContentToLrc } from '@marure/parser'

const props = defineProps<{
  index: number
  translations?: string[]
}>()

const line = defineModel<LyricLine>('line', { required: true })

for (const lang of props.translations || []) {
  line.value.trans ??= {}
  line.value.trans[lang] ||= ''
}

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
  <div
    border="~ base rounded-lg"
    flex="~ col gap-2"
    class="group/line-editor"
    ml5 bg-gray:8 p2
    tabindex="1"
  >
    <div flex="~ gap-2 items-start">
      <div my2 ml--12 w-6 text-right text-sm font-mono op30>
        #{{ index + 1 }}
      </div>
      <TimestampEditor v-model="line.t" />
      <div w-full flex="~ col gap-2">
        <LyricsLine
          text-lg font-jp-serif box-input
          role="" flex="~ col items-start"
          :line="line"
          :index="index"
          :settings="{ furigana: true, kanji: true, romaji: false, translation: false }"
        />
        <TextInput v-model="input" w-full />
      </div>
    </div>
    <div v-for="lang of translations" :key="lang" flex="~ gap-2 items-center">
      <div w-30 text-right text-sm font-mono op50>
        {{ lang }}
      </div>
      <TextInput
        v-model="line.trans![lang]"
        w-full
      />
    </div>
  </div>
</template>
