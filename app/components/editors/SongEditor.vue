<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { parseLrc, secondsToTimestamp, serializeToLrc } from '@marure/parser'
import { inferSongInfoFromVideoTitle } from '@marure/utils'
import { useDebouncedRefHistory } from '@vueuse/core'
import YAML from 'js-yaml'

const props = defineProps<{
  song?: MaruSongDataParsed
  source?: string
}>()

const { t, locale, locales } = useI18n()
const { width: windowWidth } = useWindowSize()

const state = reactive<MaruSongDataParsed>(
  props.song
    ? structuredClone(toRaw(props.song))
    : createEmptySongData(),
)

const stateRef = toRef(state)

const {
  undo,
  redo,
  canRedo,
  canUndo,
  pause,
  resume,
} = useDebouncedRefHistory(stateRef, {
  deep: true,
  debounce: 500,
  capacity: 15,
})

const router = useRouter()
const route = useRoute()

const dirty = ref(false)

watch(
  state,
  () => {
    dirty.value = true
  },
  { deep: true },
)

const showImportMultiLineDialog = ref(false)

// Prevent unsaved changes
useEventListener('beforeunload', (e) => {
  syncLrc()
  if (dirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
})

async function save() {
  if (!stateRef.value.youtube) {
    // eslint-disable-next-line no-alert
    alert(t('youtube.requireId'))
    return
  }
  syncLrc()
  const copy = { ...toRaw(stateRef.value), lyrics: undefined }
  await saveSongsToLocal([copy])
  dirty.value = false
}

const controls = usePlayer(stateRef.value, false)

watch(
  () => stateRef.value.youtube,
  () => controls.reload(),
)

const dirtyLyrics = ref<'none' | 'lrc' | 'lyrics'>('none')
const showTab = ref<'lrc' | 'lyrics' | 'yaml'>('lyrics')
const { weakid } = useWeakId()

function syncLrc() {
  pause()
  if (dirtyLyrics.value === 'lrc') {
    stateRef.value.lrc = serializeToLrc({ lyrics: stateRef.value.lyrics, meta: {} })
  }
  else if (dirtyLyrics.value === 'lyrics') {
    stateRef.value.lyrics = parseLrc(stateRef.value.lrc).lyrics
  }
  dirtyLyrics.value = 'none'
  nextTick(() => resume())
}

const yaml = ref('')

function changeTab(tab: 'lrc' | 'lyrics' | 'yaml') {
  if (showTab.value === tab) {
    return
  }
  // for the redo and undo
  if (tab === 'lyrics' && dirtyLyrics.value === 'none') {
    dirtyLyrics.value = 'lyrics'
  }
  else if (tab === 'lrc' && dirtyLyrics.value === 'none') {
    dirtyLyrics.value = 'lrc'
  }
  syncLrc()
  if (tab === 'yaml')
    yaml.value = YAML.dump({ ...toRaw(stateRef.value), lyrics: undefined })
  showTab.value = tab
}

function insertMultiline(lyrics: string) {
  const after = stateRef.value.lyrics[stateRef.value.lyrics.length - 1]
  const t = after ? after.t + 0.1 : 0
  const lines = lyrics.split('\n')
  for (const line of lines) {
    if (!line.trim())
      continue

    const words = line.split('').map(word => ({ w: word }))
    stateRef.value.lyrics.push({
      t,
      words,
      trans: {},
    })
  }
}

function insertLineAfter(index: number) {
  const after = stateRef.value.lyrics[index + 1]
  let t = after ? after.t - 0.1 : stateRef.value.lyrics[index]!.t + 0.1
  if (controls.active.value?.index === index) {
    t = controls.current.value
  }
  stateRef.value.lyrics.splice(index + 1, 0, {
    t,
    words: [],
    trans: {},
  })
}

function insertAtCurrentTime() {
  for (let i = 0; i < stateRef.value.lyrics.length; i++) {
    // Skip if the timestamp already exists
    if (stateRef.value.lyrics[i]!.t === controls.current.value) {
      return
    }
    if (stateRef.value.lyrics[i]!.t > controls.current.value) {
      stateRef.value.lyrics.splice(i, 0, {
        t: controls.current.value,
        words: [],
        trans: {},
      })
      return
    }
  }
  stateRef.value.lyrics.push({
    t: controls.current.value,
    words: [],
    trans: {},
  })
}

function gotoSong() {
  router.push({ path: '/play', hash: route.hash })
}

function deleteLine(index: number) {
  stateRef.value.lyrics.splice(index, 1)
}

const lrc = computed({
  get: () => stateRef.value.lrc,
  set: (value: string) => {
    stateRef.value.lrc = value
    dirtyLyrics.value = 'lyrics'
  },
})

watch(
  stateRef.value.lyrics,
  () => {
    dirtyLyrics.value = 'lrc'
  },
  { deep: true },
)

// Auto fill song info from video title
watchEffect(() => {
  if (!controls.player.value)
    return
  if (stateRef.value.title && stateRef.value.artists?.length)
    return
  if (controls.status.value === 'loading' || !controls.player.value.videoTitle)
    return

  const parsed = inferSongInfoFromVideoTitle(controls.player.value.videoTitle)
  if (!parsed)
    return

  if (parsed.title)
    stateRef.value.title ||= parsed.title
  if (parsed.artists && !stateRef.value.artists?.length)
    stateRef.value.artists = parsed.artists
})

function exportNow() {
  exportSongMaru(stateRef.value)
}

const translations = reactive(Array.from(
  new Set([
    locale.value,
    ...stateRef.value.lyrics.flatMap(i => Object.keys(i.trans || {})),
  ]),
))

function toggleTranslations(lang: string) {
  if (translations.includes(lang)) {
    translations.splice(translations.indexOf(lang), 1)
  }
  else {
    translations.push(lang)
  }
}

const artistsString = computed({
  get: () => (stateRef.value.artists || []).join(', '),
  set: (value: string) => {
    stateRef.value.artists = value.split(',').map(v => v.trim())
  },
})

const tagsString = computed({
  get: () => (stateRef.value.tags || []).join(', '),
  set: (value: string) => {
    stateRef.value.tags = value.split(',').map(v => v.trim())
  },
})

const offsetString = computed({
  get: () => String(stateRef.value.offset || ''),
  set: (value: string) => {
    stateRef.value.offset = Number(value)
  },
})

const notesString = computed({
  get: () => (stateRef.value.notes || []).join('\n'),
  set: (value: string) => {
    stateRef.value.notes = value.split('\n')
  },
})

const { copied, copy } = useClipboard({ read: false })

const currentTimestamp = computed(() => secondsToTimestamp(controls.current.value - (stateRef.value.offset ?? 0)))

function copyCurrentTimestamp() {
  copy(currentTimestamp.value)
}

const showGPTDialog = ref(false)

function makeupChatGPT() {
  syncLrc()
  showGPTDialog.value = true
}

useEventListener('keydown', (e) => {
  // Skip if the user is typing in an input
  if (e.target instanceof HTMLInputElement || (e.target as HTMLElement).role === 'input') {
    return
  }

  if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    save()
  }
  else if (e.code === 'Space') {
    e.preventDefault()
    controls.toggle()
    ;(document.activeElement as HTMLElement)?.blur?.()
  }
  else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    undo()
  }
  else if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    redo()
  }
})

onMounted(() => {
  if (stateRef.value.lyrics.length === 0) {
    stateRef.value.lyrics.push({
      t: 0,
      words: [],
    })
  }
})
</script>

<template>
  <DraggableWindow :x="windowWidth - 32 - 480" :y="60">
    <div flex="~ col">
      <YouTubePlayer w-120 rounded-lg border="~ base" />
      <div flex="~ gap-2 items-center" mt--2 w-max self-end p1 px2 text-sm floating-glass>
        <!-- <IconButton
          :icon="controls.status.value === 'playing' ? 'i-uil-pause' : 'i-uil-play'"
          @click="controls.toggle()"
        /> -->
        <IconButton
          :title="$t('editor.insertAtCurrentTime')"
          icon="i-uil-plus-circle"
          @click="insertAtCurrentTime()"
        />
        <div font-mono>
          <span>{{ currentTimestamp }}</span>
          <span v-if="stateRef.offset" text-primary> +{{ stateRef.offset }}</span>
        </div>
        <IconButton
          :title="$t('editor.copyTimestamp')"
          :icon="copied ? 'i-uil:check text-green5' : 'i-uil:clipboard'"
          @click="copyCurrentTimestamp()"
        />
      </div>
    </div>
  </DraggableWindow>
  <div mxa max-w-300 flex="~ col gap-3">
    <BasicNav />
    <div flex="~ col gap-2" max-w-150>
      <h1 my4 text-2xl>
        {{ $t("lyrics.editLyrics") }}
      </h1>
      <TextInput :model-value="stateRef.youtube" label="YouTube ID" input-class="font-mono" disabled />
      <TextInput v-model="stateRef.title" :label="$t('song.title')" />
      <TextInput v-model="artistsString" :label="$t('song.artist')" />
      <TextInput v-model="tagsString" :label="$t('song.tags')" />
      <TextInput v-model="offsetString" :label="$t('song.offset')" />
      <TextInput
        v-model="notesString"
        :label="$t('common.notes')"
        type="textarea"
        input-class="h-30"
      />
    </div>

    <div flex="~ gap-2 items-center" mt5>
      <SimpleButton
        :class="showTab === 'lyrics' ? '' : 'op50'"
        @click="changeTab('lyrics')"
      >
        {{ $t("editor.visualization") }}
      </SimpleButton>
      <SimpleButton
        :class="showTab === 'lrc' ? '' : 'op50'"
        @click="changeTab('lrc')"
      >
        LRC
      </SimpleButton>
      <SimpleButton
        :class="showTab === 'yaml' ? '' : 'op50'"
        @click="changeTab('yaml')"
      >
        YAML
      </SimpleButton>
    </div>
    <div v-show="showTab === 'lyrics'" flex="~ col gap-1" ml--5>
      <div flex="~ gap-2 items-center" border="~ base rounded-xl" mb2 ml5 px4 py2>
        <div i-uil-english-to-chinese mr1 />
        <ToggleButton
          v-for="item of locales"
          :key="item.code"
          :model-value="translations.includes(item.code)"
          :title="item.name || item.code"
          @click="toggleTranslations(item.code)"
        />
      </div>
      <template
        v-for="line, idx of stateRef.lyrics"
        :key="weakid(line)"
      >
        <LyricsLineEditor
          v-model:line="stateRef.lyrics[idx]!"
          :index="idx"
          :next="stateRef.lyrics[idx + 1]"
          :translations="translations"
          :controls="controls"
          :offset="stateRef.offset"
          @delete="deleteLine(idx)"
        />
        <div flex="~ justify-center">
          <IconButton
            icon="i-uil:plus" my--2 op10 transition-all
            class="@hover:(my-0 text-primary op100)"
            :title="$t('editor.insertRow')"
            @click="insertLineAfter(idx)"
          />
        </div>
      </template>

      <div flex="~ justify-center" mt-10>
        <SimpleButton class="px4! py3!" icon="i-uil-file-plus-alt" @click="showImportMultiLineDialog = true">
          {{ $t("editor.insertMultiline") }}
        </SimpleButton>
      </div>

      <InsertMultilineLyricsDialog
        v-model="showImportMultiLineDialog"
        @import="insertMultiline"
      />
    </div>
    <div v-show="showTab === 'lrc'">
      <div pb3>
        <SimpleButton
          icon="i-simple-icons-openai"
          @click="makeupChatGPT()"
        >
          {{ $t('gpt.addTranslationsFurigana') }}
        </SimpleButton>
      </div>
      <LyricsRawEditor
        v-model="lrc"
        input-class="min-h-400"
      />

      <ModalPopup v-model="showGPTDialog" use-v-if direction="bottom" dialog-class="max-h-80vh">
        <GPTDialog :lrc="stateRef.lrc" />
      </ModalPopup>
    </div>
    <div v-show="showTab === 'yaml'">
      <div mb1 op50>
        {{ $t("editor.yamlNotSupportYet") }}
      </div>
      <LyricsRawEditor
        lang="yaml"
        :model-value="yaml"
        input-class="min-h-400"
      />
    </div>

    <div border="~ base rounded-xl" flex="~ col gap-2" fixed bottom-5 right-5 p2 shadow-xl bg-base>
      <SimpleButton
        icon="i-mdi-undo-variant"
        :disabled="!canUndo"
        @click="undo"
      >
        {{ $t("editor.undo") }}
      </SimpleButton>
      <SimpleButton
        :disabled="!canRedo"
        icon="i-mdi-redo-variant"
        @click="redo"
      >
        {{ $t("editor.redo") }}
      </SimpleButton>

      <SimpleButton
        :disabled="dirty"
        icon="i-uil-play-circle"
        @click="gotoSong()"
      >
        {{ $t("editor.gotoSong") }}
      </SimpleButton>
      <SimpleButton
        icon="i-uil-file-download-alt"
        @click="exportNow()"
      >
        {{ $t("lyrics.exportLyrics") }}
      </SimpleButton>
      <SimpleButton
        :disabled="!dirty"
        icon="i-uil-save"
        @click="save()"
      >
        {{ $t("common.save") }}
      </SimpleButton>
    </div>
  </div>
</template>
