<script setup lang="ts">
import type { LyricLine } from '@marure/schema'
import { parseLrcLineContent, serializeLineContentToLrc } from '@marure/parser'

const props = defineProps<{
  index: number
  next?: LyricLine
  controls?: PlayerControls
  translations?: string[]
}>()

const emit = defineEmits<{
  (event: 'delete'): void
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
          w-32
          :class="isActive ? 'border-primary' : ''"
          @go="props.controls?.go(line)"
        >
          <div v-if="isActive && duration && controls" pointer-events-none absolute inset-0 of-hidden rounded-lg mix-blend-darken dark:mix-blend-lighten>
            <div
              left-0 h-full bg-primary:20 dark:bg-primary:40
              :style="{ width: `${(controls.current.value - line.t) / duration * 100}%` }"
            />
          </div>
        </TimestampEditor>
        <div v-if="duration != null" text-right text-sm font-mono op35>
          {{ duration.toFixed(2) }}s
        </div>
      </div>
      <div w-full flex="~ col gap-2">
        <LyricsLine
          v-if="line.words.length"
          text-lg font-jp-serif box-input
          role="" flex="~ col items-start"
          :line="line"
          :index="index"
          :settings="{ furigana: true, kanji: true, romaji: false, translation: false }"
        />
        <LyricsRawEditor
          v-model="input"
          lang="lyric-inline"
        />
      </div>
    </div>
    <template v-if="line.words.length">
      <div v-for="lang of translations" :key="lang" flex="~ gap-2 items-center">
        <div w-28 flex-none text-right text-sm op50 flex="~ gap-1 items-center justify-end">
          <div i-uil-english-to-chinese />
          {{ lang }}
        </div>
        <TextInput
          v-model="line.trans![lang]"
          w-full
        />
      </div>
    </template>
    <div absolute right--10 top-2>
      <IconButton
        icon="i-uil:trash-alt"
        op10 hover="op100 text-red"
        title="刪除行"
        @click="emit('delete')"
      />
    </div>
  </div>
</template>
