<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import type { SongDataSource } from '~/composables/loader'

const props = defineProps<{
  song: MaruSongDataParsed
  source: SongDataSource
}>()

const settings = useSettings()
const controls = usePlayer(props.song)
const { active, go, toggle } = controls

onMounted(() => {
  useEventListener('keydown', (e) => {
    if (e.altKey || e.metaKey || e.ctrlKey)
      return
    switch (e.code) {
      case 'Space':
        e.preventDefault()
        toggle()
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        go(props.song.lyrics[Math.max(0, (active.value?.index || 0) - 1)])
        break
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        go(props.song.lyrics[Math.min(props.song.lyrics.length - 1, (active.value?.index || 0) + 1)])
        break
      case 'KeyR':
        if (active.value !== null) {
          e.preventDefault()
          go(active.value.start)
        }
        break
      // default:
      //   console.log(e.code)
    }
  })
})
</script>

<template>
  <div
    grid="~ cols-[1fr_1fr]"
    h-screen w-screen of-hidden
    lt-lg="flex flex-col"
  >
    <div
      flex="~ col gap-4" flex-none of-auto p4 px6
      lt-sm="p0 gap-0"
    >
      <!-- Title Bar -->
      <div
        flex="~ gap-3 items-center"
        lt-sm="hidden"
        lt-lg=""
      >
        <NuxtLink to="/" hover="bg-hover op100" ml--0.5 rounded-full op50 transition>
          <div i-mdi-circle-double text-2xl />
        </NuxtLink>
        <div flex="~ col" lt-lg="flex-row items-end" font-jp-serif>
          <h1 text-xl>
            {{ song.title }}
          </h1>
          <ArtistsList :artists="song.artists" mt--1 />
        </div>
        <div v-if="source === 'share'" rounded bg-amber:10 px2 py1 text-xs text-amber>
          {{ $t('messages.fromShare') }}
        </div>
        <div flex-auto />
        <SongActions :song="song" :source="source" />
      </div>
      <YouTubePlayer
        border="~ base rounded-1.5em"
        lt-sm="rounded-0 border-0 border-b border-base"
        lt-lg="max-w-680px w-full mxa"
      />
      <div lt-lg="hidden" min-h-80px flex rounded p2>
        <LyricsLine
          v-if="active"
          role=""
          ma
          :style="{
            fontSize: `${settings.fontSize}rem`,
          }"
          :line="song.lyrics[active.index]!"
        />
      </div>
      <!-- <QRCode :data="data" /> -->
      <div
        flex="~ col gap-2 justify-end auto"
        lt-lg="p4 border-b border-base hidden"
        of-auto p1 text-xs text-hex-888
      >
        <div border="t base" my1 h-1px w-30px />
        <div v-if="song.notes?.length" text-sm>
          <div v-for="line, idx of song.notes" :key="idx">
            {{ line }}
          </div>
        </div>
      </div>
    </div>
    <LyricsTrack :data="song" :controls="controls" />
  </div>
</template>

<style>
#player {
  width: 100.5% !important;
  height: 100.5% !important;
  transform: translate(-1px, -1px);
}
</style>
