<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { parseLrc, secondsToTimestamp, serializeToLrc } from '~~/packages/parser/src'
import YAML from 'js-yaml'

const props = defineProps<{
  data?: MaruSongDataParsed
  source?: string
}>()

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
  syncLrc()
  if (tab === 'yaml')
    yaml.value = YAML.dump({ ...state, lyrics: undefined })
  showTab.value = tab
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
  router.push({ path: '/play', query: route.query })
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

function exportNow() {
  exportSongMaru(state)
}

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
        title="在當前時間戳插入"
        icon="i-uil-plus-circle"
        @click="insertAtCurrentTime()"
      />
      <div font-mono>
        {{ currentTimestamp }}
      </div>
      <IconButton
        title="複製時間戳"
        :icon="copied ? 'i-uil:check text-green5' : 'i-uil:clipboard'"
        @click="copyCurrentTimestamp()"
      />
    </div>
  </div>
  <div mxa max-w-300 flex="~ col gap-3">
    <BasicNav />
    <div flex="~ col gap-2" max-w-150>
      <h1 my4 text-2xl>
        歌詞編輯
      </h1>
      <TextInput :model-value="state.youtube" label="YouTube ID" input-class="font-mono" disabled />
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
      <SimpleButton
        :class="showTab === 'yaml' ? '' : 'op50'"
        @click="changeTab('yaml')"
      >
        YAML
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
      <LyricsRawEditor
        v-model="lrc"
        input-class="min-h-400"
      />
    </div>
    <div v-show="showTab === 'yaml'">
      <div mb1 op50>
        YAML 編輯功能暫未實裝
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
        前往歌曲
      </SimpleButton>
      <SimpleButton
        icon="i-uil-file-download-alt"
        @click="exportNow()"
      >
        導出歌詞
      </SimpleButton>
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
