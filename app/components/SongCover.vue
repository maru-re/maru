<script setup lang="ts">
import type { MaruSongGist } from '@marure/schema'

defineProps<{
  song: MaruSongGist
}>()
</script>

<template>
  <div class="group aspect-5/2" relative>
    <NuxtLink
      :to="`/songs/${song.youtube}`"
      border="rounded-xl"
      absolute inset-0 block of-hidden transition-all duration-500 bg-base
      class="aspect-5/2"
      group-hover="aspect-16/9 z-hover translate-y--16.25% shadow-2xl scale-115"
    >
      <img
        :src="`https://img.youtube.com/vi/${song.youtube}/mqdefault.jpg`"
        alt="YouTube Thumbnail"
        loading="lazy"
        h-full w-full object-cover
      >
      <div absolute bottom-0 left-0 right-0 from-black:80 to-black:0 bg-gradient-to-t px3 py2 pt10 text-white>
        <h2 font-jp-serif>
          {{ song.title }}
        </h2>
        <div text-xs>
          <ArtistsList :artists="song.artists" />
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
