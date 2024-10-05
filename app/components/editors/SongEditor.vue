<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { parseLrc, serializeToLrc } from '~~/packages/parser/src'

const props = defineProps<{
  data?: MaruSongDataParsed
}>()

const state = reactive<MaruSongDataParsed>(
  props.data
    ? structuredClone(toRaw(props.data))
    : {
        schema: 'v1',
        title: '',
        youtube: '',
        artists: [],
        lyrics: [],
        lrc: '',
        tags: [],
      },
)

const dirty = ref(false)
watch(
  state,
  () => {
    dirty.value = true
  },
  { deep: true },
)

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
    alert('YouTube ID is required')
    return
  }
  state.lrc = serializeToLrc({ lyrics: state.lyrics, meta: {} })
  const copy = { ...toRaw(state), lyrics: undefined }
  await saveSongToStorage(copy)
  dirty.value = false
}

const controls = usePlayer(state)

const youtubeString = computed({
  get: () => state.youtube,
  set: (value: string) => {
    if (value.startsWith('https://www.youtube.com/watch')) {
      const url = new URL(value)
      state.youtube = url.searchParams.get('v') || ''
    }
    else if (value.startsWith('https://youtu.be/')) {
      const url = new URL(value)
      state.youtube = url.pathname.slice(1)
    }
    else {
      state.youtube = value
    }
  },
})

watch(
  () => state.youtube,
  () => controls.reload(),
)

const dirtyLyrics = ref<'none' | 'lrc' | 'lyrics'>('none')
const showTab = ref<'lrc' | 'lyrics'>('lyrics')

function syncLrc() {
  if (dirtyLyrics.value === 'lrc') {
    state.lrc = serializeToLrc({ lyrics: state.lyrics, meta: {} })
  }
  else if (dirtyLyrics.value === 'lyrics') {
    state.lyrics = parseLrc(state.lrc).lyrics
  }
  dirtyLyrics.value = 'none'
}

function changeTab(tab: 'lrc' | 'lyrics') {
  syncLrc()
  showTab.value = tab
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

// TODO: make this customizable
const translations = ['zh-Hant']

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
</script>

<template>
  <div px10 py20 flex="~ col gap-3">
    <YouTubePlayer w-100 rounded-lg border="~ base" />
    <div grid="~ gap-2 cols-4">
      <TextInput v-model="youtubeString" label="YouTube ID" input-class="font-mono" disabled />
      <TextInput v-model="state.title" label="歌曲標題" />
      <TextInput v-model="artistsString" label="歌手" />
      <TextInput v-model="tagsString" label="標籤" />
    </div>
    <TextInput
      v-model="notesString"
      label="備註"
      type="textarea"
      input-class="h-30"
    />
    <div flex="~ gap-2 items-center">
      <SimpleButton
        :class="showTab === 'lyrics' ? '' : 'op50'"
        @click="changeTab('lyrics')"
      >
        可視化
      </SimpleButton>
      <SimpleButton
        :class="showTab === 'lrc' ? '' : 'op50'"
        @click="changeTab('lrc')"
      >
        LRC
      </SimpleButton>
    </div>
    <div v-show="showTab === 'lyrics'" flex="~ col gap-1">
      <LyricsLineEditor
        v-for="line, idx of state.lyrics"
        :key="idx"
        v-model:line="state.lyrics[idx]!"
        :index="idx"
        :next="state.lyrics[idx + 1]"
        :translations="translations"
        :controls="controls"
      />
    </div>
    <div v-show="showTab === 'lrc'">
      <LyricsRawEditor v-model="lrc" />
    </div>

    <!-- <pre v-text="JSON.stringify(state, null, 2)" /> -->

    <div border="~ base rounded-xl" fixed bottom-5 right-5 p2 shadow-xl bg-base>
      <SimpleButton
        :disabled="!dirty"
        icon="i-uil-save"
        @click="save()"
      >
        儲存
      </SimpleButton>
    </div>
  </div>
</template>
