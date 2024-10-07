<script setup lang="ts">
import type { MaruSongGist } from '@marure/schema'

const props = withDefaults(
  defineProps<{
    song: MaruSongGist
    link?: boolean
    showFavorite?: boolean | 'hover'
  }>(),
  {
    link: true,
  },
)

const {
  isFavorite,
  toggleFavorite,
} = useCollections()

const favorited = computed({
  get() {
    return isFavorite(props.song.youtube)
  },
  set(value: boolean) {
    toggleFavorite(props.song.youtube, value)
  },
})
</script>

<template>
  <div class="song-entry relative aspect-5/2" hover:z-hover ma-5px :class="link ? 'group' : ''">
    <NuxtLink
      class="song-entry-cover aspect-5/2"
      :class="link ? '' : 'pointer-events-none'"
      :to="`/play#id=${song.youtube}`"
      border="transparent rounded-xl"
      absolute inset-0 block of-hidden transition-all duration-500 bg-base
      group-hover="aspect-16/9 translate-y--16.25% shadow-2xl scale-115"
    >
      <img
        :src="song.cover || `https://img.youtube.com/vi/${song.youtube}/mqdefault.jpg`"
        alt="Song Thumbnail"
        loading="lazy"
        h-full w-full object-cover
      >
      <div absolute bottom-0 left-0 right-0 from-black:80 to-black:0 bg-gradient-to-t px3 py2 pt10 text-white>
        <h2 line-clamp-2 font-jp-serif>
          {{ song.title }}
        </h2>
        <div text-xs>
          <ArtistsList :artists="song.artists" line-clamp-1 />
        </div>
      </div>
      <div
        v-if="showFavorite"
        absolute right-1 top-1 rounded-full transition-all duration-250
        group-hover="bg-black:50 op100"
        flex="~ items-center justify-center"
        :class="(showFavorite === 'hover' || !favorited) && 'op0'"
      >
        <IconToggle
          v-model="favorited"
          text-sm text-white transition-all duration-250 hover:bg-black:75
          :icon="favorited ? 'i-ph-star-fill text-yellow6 dark:text-yellow2' : 'i-ph-star op80! '"
        />
      </div>
    </NuxtLink>
    <slot />
  </div>
</template>
