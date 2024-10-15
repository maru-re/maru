<script setup lang="ts">
import type { LyricLine } from '@marure/schema'
import { parseLrcLineContent, serializeLineContentToLrc } from '@marure/parser'

const props = withDefaults(defineProps<{
  index: number
  next?: LyricLine
  controls?: PlayerControls
  offset?: number
  translations?: string[]
}>(), {
  offset: 0,
})

const emit = defineEmits<{
  (event: 'delete'): void
}>()

const { locales } = useI18n()

const line = defineModel<LyricLine>('line', { required: true })

watchImmediate(() => line.value.trans, () => {
  line.value.trans ??= {}
  for (const lang of props.translations || []) {
    line.value.trans[lang] ||= ''
  }
})

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

function goNextLineTimestamp() {
  const el = document.querySelector<HTMLInputElement>(`[data-editor-line="${props.index + 1}"] .timestamp-input`)
  el?.focus()
}
</script>

<template>
  <div>
    <div
      border="~ rounded-lg"
      flex="~ col gap-2"
      class="group/line-editor"
      :data-editor-line="index"
      relative ml5 p2
      tabindex="1"
      :class="isActive ? 'border-primary ring-3 ring-primary:20 bg-primary:5' : 'border-base bg-gray:4'"
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
            :current-time="controls?.current.value"
            :offset
            @go="autoPlay => props.controls?.go(line, autoPlay)"
            @next="goNextLineTimestamp"
          >
            <div
              v-if="isActive && duration && controls"
              pointer-events-none absolute inset-0 of-hidden rounded-lg
              mix-blend-darken dark:mix-blend-lighten
            >
              <div
                left-0 h-full bg-primary:20 dark:bg-primary:40
                :style="{ width: `${(controls.current.value - offset - line.t) / duration * 100}%` }"
              />
            </div>
          </TimestampEditor>
          <div
            v-if="duration != null" w-max self-end text-right text-sm font-mono
            :class="duration < 0 ? 'op100 bg-red:10 text-red px2 rounded-full font-bold' : 'op35'"
          >
            {{ duration.toFixed(2) }}s
          </div>
        </div>
        <div flex="~ col gap-2" w-full of-auto break-anywhere>
          <LyricsLine
            v-if="line.words.length"
            w-full rounded-lg bg-gray:5 py1 pb2 font-jp-serif
            role="" flex="~ col items-start" border="~ base"
            :line="line"
            :index="index"
            :settings="{ furigana: true, kanji: true, romaji: false, translation: false }"
          />
          <LyricsRawEditor
            v-model="input"
            lang="lyric-inline"
          >
            <!-- TODO:  -->
            <!-- <template #default="{ focused }">
              <div
                v-if="focused"
                pos="absolute top-110% left-50%"
                px2 py1 ring-2
                translate-x="-50%"
                ring-primary:50
                floating-glass
                flex="~ gap-2"
              >
                <ActionButton icon="i-uil:check" title="確定" />
              </div>
            </template> -->
          </LyricsRawEditor>
        </div>
      </div>
      <template v-if="line.words.length">
        <div v-for="lang of translations" :key="lang" flex="~ gap-2 items-center">
          <div w-28 flex-none text-right text-sm op50 flex="~ gap-1 items-center justify-end">
            <div i-uil-english-to-chinese />
            {{ locales.find(i => i.code === lang)?.name ?? lang }}
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
          class="@hover:(text-red op100)"
          :title="$t('editor.deleteRow')"
          @click="emit('delete')"
        />
      </div>
    </div>
  </div>
</template>
