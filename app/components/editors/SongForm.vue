<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import type { Reactive } from 'vue'

const props = defineProps<{
  stateRef: Reactive<MaruSongDataParsed>
  errors: Reactive<ValidationErrors>
}>()

const stateRef = toRef(props.stateRef)
const { title, artists, tags } = toRefs(props.errors)

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
</script>

<template>
  <div flex="~ col gap-2" max-w-150>
    <h1 my4 text-2xl>
      {{ $t("lyrics.editLyrics") }}
    </h1>
    <TextInput :model-value="stateRef.youtube" label="YouTube ID" input-class="font-mono" disabled />
    <div>
      <TextInput v-model="stateRef.title" :label="$t('song.title')" />
      <span class="text-sm text-red-500">{{ title }}</span>
    </div>
    <div>
      <TextInput v-model="artistsString" :label="$t('song.artist')" />
      <span v-if="artists" class="text-sm text-red-500">{{ artists }}</span>
    </div>
    <div>
      <TextInput v-model="tagsString" :label="$t('song.tags')" />
      <span v-if="tags" class="text-sm text-red-500">{{ tags }}</span>
    </div>
    <TextInput v-model="offsetString" :label="$t('song.offset')" />
    <TextInput
      v-model="notesString"
      :label="$t('common.notes')"
      type="textarea"
      input-class="h-30"
    />
  </div>
</template>
