<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import type { SongDataSource } from '~/composables/loader'

const props = defineProps<{
  song: MaruSongDataParsed
  source: SongDataSource
}>()

const settings = useSettings()
const router = useRouter()
const controls = usePlayer(props.song)
const showInfoModal = ref(false)
const { active, go, toggle } = controls
const { t } = useI18n()

async function saveSharedSong() {
  await saveSongsToLocal([props.song])
  router.replace(`/play#id=${props.song.youtube}`)
}

useShortcutsRegistry(() => ({
  title: t('shortcuts.songPlay'),
  key: 'song-play',
  shortcuts: [
    { title: t('shortcuts.playPause'), combos: [[t('shortcuts.space')]] },
    { title: t('shortcuts.prevLine'), combos: [[t('shortcuts.left')], [t('shortcuts.up')]] },
    { title: t('shortcuts.nextLine'), combos: [[t('shortcuts.right')], [t('shortcuts.down')]] },
    { title: t('shortcuts.repeatCurrentLine'), combos: [['R']] },
  ],
}))

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
        <NuxtLink to="/" class="@hover:(bg-gray/10 op100)" ml--0.5 rounded-full op50 transition>
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
      <SongNotes :notes="song.notes" lt-lg="hidden" p1 />
    </div>
    <LyricsTrack
      :song="song"
      :controls="controls"
      :source="source"
    >
      <div
        lg="hidden"
        absolute left-3 top-3 p1 floating-glass
        flex="~ gap-2 items-center"
      >
        <ActionButton to="/" icon="i-uil-angle-left-b" :title="$t('common.backToHome')" />
      </div>
      <!-- Top Right -->
      <div lg="hidden" absolute right-3 top-3 flex="~ gap-2 items-center">
        <div v-if="source === 'share'" z-hover rounded bg-base>
          <div rounded bg-amber:10 px2 py1 text-xs text-amber border="~ amber/25">
            {{ $t('messages.fromShare') }}
          </div>
        </div>
        <div
          v-if="source === 'share'"
          p1 floating-glass
          flex="~ gap-2 items-center"
        >
          <ActionButton
            type="icon"
            icon="i-uil-save"
            :title="$t('lyrics.saveLyrics')"
            @click="saveSharedSong()"
          />
        </div>
        <div
          p1 floating-glass
          flex="~ gap-2 items-center"
        >
          <ActionButton type="icon" icon="i-uil-info-circle" :title="$t('common.notes')" @click="showInfoModal = true" />
        </div>
      </div>

      <div pointer-events-auto absolute left-3 right-3 top-3 z-floating flex>
        <SettingsFloat mxa lt-lg="hidden" />
      </div>
    </LyricsTrack>
    <ModalPopup v-model="showInfoModal" dialog-class="max-h-90%! p4">
      <div pb-1 font-jp-serif>
        <p text-1.5em>
          {{ song.title }}
        </p>
        <ArtistsList :artists="song.artists" />
      </div>
      <SongNotes :notes="song.notes" />
    </ModalPopup>
  </div>
</template>

<style>
#player {
  width: 100.5% !important;
  height: 100.5% !important;
  transform: translate(-1px, -1px);
}
</style>
