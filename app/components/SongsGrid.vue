<script setup lang="ts">
import type { MaruSongGist } from '~~/packages/schema/src'

defineProps<{
  songs: MaruSongGist[]
  link?: boolean
}>()
</script>

<template>
  <div flex="~ gap-2 col">
    <div flex="~ gap-2 items-end">
      <slot name="title" />
      <div flex-auto />
      <slot name="title-action" />
    </div>
    <div grid="~ cols-minmax-230px gap-2">
      <!-- TODO: virtual list -->
      <SongCover v-for="song of songs" :key="song.youtube" :song="song" :link="link" />
    </div>
  </div>
</template>
