<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { parseLrc, secondsToTimestamp, serializeToLrc } from '~~/packages/parser/src'
import { inferSongInfoFromVideoTitle } from '~~/packages/utils/src'
import YAML from 'js-yaml'

const props = defineProps<{
  data?: MaruSongDataParsed
  source?: string
}>()

const { t, locale, locales } = useI18n()

const state = reactive<MaruSongDataParsed>(
  props.data
    ? structuredClone(toRaw(props.data))
    : createEmptySongData(),
)

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
  if (dirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
})

async function save() {
  if (!state.youtube) {
    // eslint-disable-next-line no-alert
    alert(t('youtube.requireId'))
    return
  }
  state.lrc = serializeToLrc({ lyrics: state.lyrics, meta: {} })
  const copy = { ...toRaw(state), lyrics: undefined }
  await saveSongsToLocal([copy])
  dirty.value = false
}

const controls = usePlayer(state, false)

watch(
  () => state.youtube,
  () => controls.reload(),
)

const dirtyLyrics = ref<'none' | 'lrc' | 'lyrics'>('none')
const showTab = ref<'lrc' | 'lyrics' | 'yaml'>('lyrics')

function syncLrc() {
  if (dirtyLyrics.value === 'lrc') {
    state.lrc = serializeToLrc({ lyrics: state.lyrics, meta: {} })
  }
  else if (dirtyLyrics.value === 'lyrics') {
    state.lyrics = parseLrc(state.lrc).lyrics
  }
  dirtyLyrics.value = 'none'
}

const yaml = ref('')

function changeTab(tab: 'lrc' | 'lyrics' | 'yaml') {
  if (showTab.value === tab) {
    return
  }
  syncLrc()
  if (tab === 'yaml')
    yaml.value = YAML.dump({ ...state, lyrics: undefined })
  showTab.value = tab
}

function insertMultiline(lyrics: string) {
  const after = state.lyrics[state.lyrics.length - 1]
  const t = after ? after.t + 0.1 : 0
  const lines = lyrics.split('\n')
  for (const line of lines) {
    if (!line.trim())
      continue

    const words = line.split('').map(word => ({ w: word }))
    state.lyrics.push({
      t,
      words,
      trans: {},
    })
  }
}

function insertLineAfter(index: number) {
  const after = state.lyrics[index + 1]
  let t = after ? after.t - 0.1 : state.lyrics[index]!.t + 0.1
  if (controls.active.value?.index === index) {
    t = controls.current.value
  }
  state.lyrics.splice(index + 1, 0, {
    t,
    words: [],
    trans: {},
  })
}

function insertAtCurrentTime() {
  for (let i = 0; i < state.lyrics.length; i++) {
    // Skip if the timestamp already exists
    if (state.lyrics[i]!.t === controls.current.value) {
      return
    }
    if (state.lyrics[i]!.t > controls.current.value) {
      state.lyrics.splice(i, 0, {
        t: controls.current.value,
        words: [],
        trans: {},
      })
      return
    }
  }
  state.lyrics.push({
    t: controls.current.value,
    words: [],
    trans: {},
  })
}

function gotoSong() {
  router.push({ path: '/play', hash: route.hash })
}

function deleteLine(index: number) {
  state.lyrics.splice(index, 1)
}

const lrc = computed({
  get: () => state.lrc,
  set: (value: string) => {
    state.lrc = value
    dirtyLyrics.value = 'lyrics'
  },
})

watch(
  state.lyrics,
  () => {
    dirtyLyrics.value = 'lrc'
  },
  { deep: true },
)

// Auto fill song info from video title
watchEffect(() => {
  if (!controls.player.value)
    return
  if (state.title && state.artists?.length)
    return
  if (controls.status.value === 'loading' || !controls.player.value.videoTitle)
    return

  const parsed = inferSongInfoFromVideoTitle(controls.player.value.videoTitle)
  if (!parsed)
    return

  if (parsed.title)
    state.title ||= parsed.title
  if (parsed.artists && !state.artists?.length)
    state.artists = parsed.artists
})

function exportNow() {
  exportSongMaru(state)
}

const translations = reactive(Array.from(
  new Set([
    locale.value,
    ...state.lyrics.flatMap(i => Object.keys(i.trans || {})),
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
  get: () => (state.artists || []).join(', '),
  set: (value: string) => {
    state.artists = value.split(',').map(v => v.trim())
  },
})

const tagsString = computed({
  get: () => (state.tags || []).join(', '),
  set: (value: string) => {
    state.tags = value.split(',').map(v => v.trim())
  },
})

const notesString = computed({
  get: () => (state.notes || []).join('\n'),
  set: (value: string) => {
    state.notes = value.split('\n')
  },
})

const { copied, copy } = useClipboard({ read: false })

const currentTimestamp = computed(() => secondsToTimestamp(controls.current.value))

function copyCurrentTimestamp() {
  copy(currentTimestamp.value)
}

useEventListener('keydown', (e) => {
  // Skip if the user is typing in an input
  if (e.target instanceof HTMLInputElement || (e.target as HTMLElement).role === 'input')
    return
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    save()
    return
  }
  if (e.key === ' ') {
    e.preventDefault()
    controls.toggle()
    ;(document.activeElement as HTMLElement)?.blur?.()
  }
})

onMounted(() => {
  if (state.lyrics.length === 0) {
    state.lyrics.push({
      t: 0,
      words: [],
    })
  }
})
</script>

<template>
  <div fixed right-8 top-8 z-floating flex="~ col">
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
        {{ currentTimestamp }}
      </div>
      <IconButton
        :title="$t('editor.copyTimestamp')"
        :icon="copied ? 'i-uil:check text-green5' : 'i-uil:clipboard'"
        @click="copyCurrentTimestamp()"
      />
    </div>
  </div>
  <div mxa max-w-300 flex="~ col gap-3">
    <BasicNav />
    <div flex="~ col gap-2" max-w-150>
      <h1 my4 text-2xl>
        {{ $t("lyrics.editLyrics") }}
      </h1>
      <TextInput :model-value="state.youtube" label="YouTube ID" input-class="font-mono" disabled />
      <TextInput v-model="state.title" :label="$t('song.title')" />
      <TextInput v-model="artistsString" :label="$t('song.artist')" />
      <TextInput v-model="tagsString" :label="$t('song.tags')" />
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
        {{ $t("visualization") }}
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
        v-for="line, idx of state.lyrics"
        :key="idx"
      >
        <LyricsLineEditor
          v-model:line="state.lyrics[idx]!"
          :index="idx"
          :next="state.lyrics[idx + 1]"
          :translations="translations"
          :controls="controls"
          @delete="deleteLine(idx)"
        />
        <div flex="~ justify-center">
          <IconButton
            icon="i-uil:plus" my--2 op10 transition-all
            hover="op100 my-0 text-primary bg-gray:20"
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
      <LyricsRawEditor
        v-model="lrc"
        input-class="min-h-400"
      />
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
