<script setup lang="ts">
import type { LyricLine, MaruSongData, MaruSongDataParsed } from '@marure/schema'
import type { PlayerControls } from '~/composables/player'

const props = defineProps<{
  controls: PlayerControls
  data: MaruSongDataParsed
}>()

const {
  active,
  go,
} = props.controls

const SCROLL_PERCENTAGE = 0.30

const settings = useSettings()

const lyricsOverflow = templateRef<HTMLDivElement>('lyricsOverflow')

let lastClick: {
  x: number
  y: number
  time: number
  line: LyricLine
} | null = null

function onPointerDown(e: PointerEvent, line: LyricLine) {
  lastClick = {
    x: e.clientX,
    y: e.clientY,
    time: Date.now(),
    line,
  }
}

function onPointerUp(e: PointerEvent, line: LyricLine) {
  if (!lastClick) {
    return
  }
  if (lastClick.line !== line) {
    lastClick = null
    return
  }
  const { x, y, time } = lastClick
  const distance = Math.hypot(e.clientX - x, e.clientY - y)
  const duration = Date.now() - time
  if (distance > 10 || duration > 300) {
    lastClick = null
    return
  }
  e.preventDefault()
  go(line)
}

function getClassLine(no: number) {
  if (active.value == null)
    return ''
  if (active.value.index === no)
    return 'active'
  if (!settings.value.follow)
    return ''
  if (active.value.index === no - 1)
    return 'next'
  return 'inactive'
}

onMounted(() => {
  lyricsOverflow.value!.scrollTo({
    top: 900,
    behavior: 'instant',
  })

  watch(() => [
    active.value?.index,
    settings.value.follow,

    // Layout changes:
    settings.value.furigana,
    settings.value.kanji,
    settings.value.romaji,
    settings.value.translation,
    settings.value.fontSize,
  ], (n, o) => {
    if (!settings.value.follow || active.value == null)
      return

    // If layout changes, scroll instantly
    let isLayoutChange = false
    for (let i = 2; i < n.length; i++) {
      if (n[i] !== o[i])
        isLayoutChange = true
    }

    const line = document.querySelector(`.lyric-line[line="${active.value?.index}"]`)
    if (line) {
      nextTick(() => {
        const container = lyricsOverflow.value!
        const rectContainer = container.getBoundingClientRect()
        const targetClientTop = rectContainer.top + rectContainer.height * SCROLL_PERCENTAGE
        const rectLine = line.getBoundingClientRect()
        const currentClientTop = rectLine.top
        container.scrollTo({
          top: container.scrollTop + currentClientTop - targetClientTop,
          behavior: isLayoutChange ? 'instant' : 'smooth',
        })
      })
    }
  })
})
</script>

<template>
  <div
    ref="lyricsOverflow"
    relative of-x-hidden of-y-auto
    :style="{
      fontSize: `${settings.fontSize}rem`,
    }"
  >
    <div lt-lg="absolute" pointer-events-auto sticky left-3 right-3 top-3 z-floating flex>
      <SettingsNav mxa />
    </div>
    <div
      flex="~ col gap-1em" class="lyrics-track"
      of-hidden py-1000px text-center
    >
      <div pb10 font-jp-serif>
        <h1 text-2em>
          {{ data.title }}
        </h1>
        <ArtistsList :artists="data.artists" />
      </div>

      <LyricsLine
        v-for="line, index of data.lyrics"
        :key="index"
        :class="getClassLine(index)"
        :index="index"
        :line="line"
        @pointerdown="e => onPointerDown(e, line)"
        @pointerup="e => onPointerUp(e, line)"
      />
    </div>
  </div>
</template>

<style>
.lyric-line.active {
  --uno: op100 scale-120;
}
.lyric-line.inactive {
  --uno: op30 filter-saturate-0;
}
.lyric-line.next {
  --uno: op60 filter-saturate-50;
}

.lyric-line-source {
  --uno: 'text-1.125em font-jp-serif mb-0.5';
}
.lyric-line-romaji {
  --uno: 'text-0.875em text-rose7:75 dark:text-rose3:75';
}

.lyric-line-translate {
  --uno: 'text-0.875em text-orange7:75 dark:text-orange3:75 mt--0.2';
}
</style>
