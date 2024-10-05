<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'

const props = defineProps<{
  data?: MaruSongDataParsed
}>()

const state = reactive<MaruSongDataParsed>(props.data
  ? { ...props.data }
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
      <TextInput v-model="youtubeString" label="YouTube ID" input-class="font-mono" />
      <TextInput v-model="state.title" label="歌曲標題" />
      <TextInput v-model="artistsString" label="歌手" />
      <TextInput v-model="tagsString" label="標籤" />
    </div>
    <div>
      <div>
        <LyricsLineEditor
          v-for="line, idx of state.lyrics"
          :key="idx"
          v-model:line="state.lyrics[idx]!"
          :index="idx"
        />
      </div>
      <TextInput
        v-model="state.lrc"
        label="LRC 歌詞"
        type="textarea"
        input-class="h-400"
      />
    </div>

    <TextInput
      v-model="notesString"
      label="備註"
      type="textarea"
      input-class="h-100"
    />
    <pre v-text="JSON.stringify(state, null, 2)" />
  </div>
</template>
