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

const controls = usePlayer(state, false)

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

function insertLineAfter(index: number) {
  const after = state.lyrics[index + 1]
  const t = after ? after.t - 0.1 : state.lyrics[index]!.t + 0.1
  state.lyrics.splice(index + 1, 0, {
    t,
    words: [],
    trans: {},
  })
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

useEventListener('keydown', (e) => {
  // Skip if the user is typing in an input
  if (e.target instanceof HTMLInputElement)
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
</script>

<template>
  <div fixed right-8 top-8 z-floating>
    <YouTubePlayer w-120 rounded-lg border="~ base" />
  </div>
  <div mxa max-w-300 flex="~ col gap-3">
    <BasicNav />
    <div flex="~ col gap-2" max-w-150>
      <h1 mb5 text-2xl>
        歌詞編輯
      </h1>
      <TextInput v-model="youtubeString" label="YouTube ID" input-class="font-mono" disabled />
      <TextInput v-model="state.title" label="歌曲標題" />
      <TextInput v-model="artistsString" label="歌手" />
      <TextInput v-model="tagsString" label="標籤" />
      <TextInput
        v-model="notesString"
        label="備註"
        type="textarea"
        input-class="h-30"
      />
    </div>

    <div flex="~ gap-2 items-center" mt5>
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
    <div v-show="showTab === 'lyrics'" flex="~ col gap-1" ml--5>
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
            title="插入行"
            @click="insertLineAfter(idx)"
          />
        </div>
      </template>
    </div>
    <div v-show="showTab === 'lrc'">
      <TextInput
        v-model="lrc"
        label="LRC 歌詞"
        type="textarea"
        input-class="h-400"
      />
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
