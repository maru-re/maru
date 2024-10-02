<script setup lang="ts">
import type { MaruSongGist } from '@marure/schema'

const props = defineProps<{
  songs: MaruSongGist[]
  link?: boolean
  manage?: boolean
}>()

const selecting = ref(false)
const selectedId = ref<string[]>([])
const selectedSongs = computed(() => props.songs.filter(song => selectedId.value.includes(song.youtube)))

function toggleSelect(song: MaruSongGist) {
  const index = selectedId.value.indexOf(song.youtube)
  if (index === -1) {
    selectedId.value.push(song.youtube)
  }
  else {
    selectedId.value.splice(index, 1)
  }
}

function selectAll() {
  selecting.value = true
  if (selectedId.value.length === props.songs.length) {
    selectedId.value = []
  }
  else {
    selectedId.value = props.songs.map(song => song.youtube)
  }
}

async function exportSelected() {
  await exportSongs(selectedSongs.value.map(song => song.youtube))
}

async function deleteSelected() {
  await removeSongs(selectedSongs.value.map(song => song.youtube))
}

function revertSelection() {
  selectedId.value = props.songs.map(song => song.youtube).filter(id => !selectedId.value.includes(id))
}
</script>

<template>
  <div flex="~ gap-2 col">
    <div flex="~ gap-2 items-end">
      <slot name="title" />
      <div flex-auto />
      <slot name="title-action">
        <template v-if="manage">
          <SimpleButton text-xs icon="i-uil-check-square" @click="selectAll()">
            全選
          </SimpleButton>
          <SimpleButton v-if="selecting" text-xs icon="i-uil-square" @click="revertSelection()">
            反選
          </SimpleButton>
          <SimpleButton v-if="selecting" :disabled="!selectedSongs.length" text-xs icon="i-uil-folder-download" @click="exportSelected()">
            匯出所選 <span op50>{{ selectedSongs.length }}</span>
          </SimpleButton>
          <SimpleButton v-if="selecting" :disabled="!selectedSongs.length" icon="i-uil-trash" color="btn-simple-red" text-xs @click="deleteSelected()">
            刪除所選 <span op50>{{ selectedSongs.length }}</span>
          </SimpleButton>
          <SimpleButton text-xs :icon="selecting ? 'i-uil-times' : 'i-uil-th'" @click="selecting = !selecting">
            {{ selecting ? '取消選取' : '選取' }}
          </SimpleButton>
        </template>
      </slot>
    </div>
    <div grid="~ cols-minmax-230px gap-2">
      <!-- TODO: virtual list -->
      <SongEntry
        v-for="song of songs"
        :key="song.youtube"
        :song="song"
        :link="selecting ? false : link"
        :class="selecting ? (selectedId.includes(song.youtube) ? 'selected' : 'unselected') : ''"
        @click="selecting ? toggleSelect(song) : undefined"
      >
        <div
          v-if="selecting && selectedId.includes(song.youtube)"
          absolute right--2 top--2 h-5 w-5 rounded-full bg-primary shadow-xl
        >
          <div i-uil-check text-white />
        </div>
      </SongEntry>
    </div>
  </div>
</template>

<style>
.song-entry {
  --uno: transition-all duration-400;
}
.song-entry.selected .song-entry-cover {
  --uno: border-primary;
}
.song-entry.unselected {
  --uno: scale-95 saturate-0;
}
</style>
