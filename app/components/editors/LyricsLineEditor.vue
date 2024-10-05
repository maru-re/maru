<script setup lang="ts">
import type { LyricLine } from '@marure/schema'
import { parseLrcLineContent, serializeLineContentToLrc } from '@marure/parser'

const props = defineProps<{
  index: number
  next?: LyricLine
  controls?: PlayerControls
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

const duration = computed(() => props.next ? props.next.t - line.value.t : null)
const isActive = computed(() => props.controls?.active.value?.index === props.index)
</script>

<template>
  <div
    border="~ rounded-lg"
    flex="~ col gap-2"
    class="group/line-editor"
    relative ml5 p2
    tabindex="1"
    :class="isActive ? 'border-primary ring-3 ring-primary:20 bg-primary:5' : 'border-base bg-gray:4 dark:bg-gray:8'"
  >
    <div flex="~ gap-2 items-start">
      <div my2 ml--12 w-6 text-right text-sm font-mono op30>
        #{{ index + 1 }}
      </div>
      <div flex="~ col gap-1">
        <TimestampEditor
          v-model="line.t"
          :class="isActive ? 'border-primary ring-2 ring-primary:20' : ''"
        />
        <div v-if="duration != null" text-right text-sm font-mono op35>
          {{ duration.toFixed(2) }}s
        </div>
      </div>
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
      <div w-21 flex-none text-right text-sm op50 flex="~ gap-1 items-center justify-end">
        <div i-uil-english-to-chinese />
        {{ lang }}
      </div>
      <TextInput
        v-model="line.trans![lang]"
        w-full
      />
    </div>
  </div>
</template>
