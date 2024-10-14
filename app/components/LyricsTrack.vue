<script setup lang="ts">
import type { LyricLine, MaruSongDataParsed } from '@marure/schema'
import { Tooltip } from 'floating-vue'
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

const showInfoModal = ref(false)

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

function getLineElementByIndex(index: number | undefined): HTMLElement | null {
  if (index === undefined)
    return null
  return document.querySelector(`.lyric-line[line="${index}"]`) as HTMLElement | null
}

function isElementInViewportY(el: Element) {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  )
}

const activeLineEl = computed(() => getLineElementByIndex(active.value?.index))
const targetIsVisible = ref(false)

useIntersectionObserver(activeLineEl, (entries) => {
  if (!entries || !entries.length)
    return
  const { isIntersecting } = entries[0]!
  targetIsVisible.value = isIntersecting
})

function scrollToActiveLine(behavior: ScrollBehavior) {
  const line = activeLineEl.value
  if (!line)
    return

  const container = lyricsOverflow.value!
  const rectContainer = container.getBoundingClientRect()
  const targetClientTop = rectContainer.top + rectContainer.height * SCROLL_PERCENTAGE
  const rectLine = line.getBoundingClientRect()
  const currentClientTop = rectLine.top
  container.scrollTo({
    top: container.scrollTop + currentClientTop - targetClientTop,
    behavior,
  })
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

    const line = activeLineEl.value
    if (line) {
      const isLineVisible = isElementInViewportY(line)
      targetIsVisible.value = isLineVisible

      // When seeking in player, the new active line may not be in view so check the old one
      const oldLine = getLineElementByIndex((o[0] as number | undefined) || 0)
      const isOldLineVisible = !!oldLine && isElementInViewportY(oldLine)

      if (isLayoutChange || isLineVisible || isOldLineVisible) {
        nextTick(() => {
          scrollToActiveLine(isLayoutChange ? 'instant' : 'smooth')
        })
      }
    }
  })
})
</script>

<template>
  <div relative h-full w-full of-hidden>
    <div
      lg="hidden"
      absolute left-3 top-3 p1 floating-glass
      flex="~ gap-2 items-center"
    >
      <Tooltip placement="top">
        <IconButton to="/" icon="i-uil-angle-left-b" />
        <template #popper>
          <div>
            {{ $t("common.backToHome") }}
          </div>
        </template>
      </Tooltip>
    </div>
    <div
      lg="hidden"
      absolute right-3 top-3 p1 floating-glass
      flex="~ gap-2 items-center"
    >
      <Tooltip placement="top">
        <IconButton icon="i-uil-info-circle" @click="showInfoModal = true" />
        <template #popper>
          <div>
            {{ $t("common.notes") }}
          </div>
        </template>
      </Tooltip>
    </div>
    <div
      v-if="activeLineEl && !targetIsVisible"
      absolute bottom-3 right-3 p2 floating-glass
      flex="~ gap-2 items-center"
      @click="() => scrollToActiveLine('smooth')"
    >
      <Tooltip placement="left" distance="8">
        <IconButton icon="i-uil-right-indent-alt" />
        <template #popper>
          <div>
            {{ $t("actions.scrollToCurrent") }}
          </div>
        </template>
      </Tooltip>
    </div>
    <div pointer-events-auto absolute left-3 right-3 top-3 z-floating flex>
      <SettingsNav mxa lt-lg="hidden" />
    </div>

    <!-- Track -->
    <div
      ref="lyricsOverflow"
      relative h-full w-full of-x-hidden of-y-auto
    >
      <div
        flex="~ col gap-1.2em" class="lyrics-track"
        of-hidden py-1000px text-center
        :style="{
          fontSize: `${settings.fontSize}rem`,
        }"
      >
        <div pb10 font-jp-serif>
          <p text-2em>
            {{ data.title }}
          </p>
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

    <ModalPopup v-model="showInfoModal" dialog-class="max-h-90vh! p4">
      <div pb-1 font-jp-serif>
        <p text-1.5em>
          {{ data.title }}
        </p>
        <ArtistsList :artists="data.artists" />
      </div>
      <SongNotes :notes="data.notes" />
    </ModalPopup>
  </div>
</template>

<style>
.lyric-line {
  --uno: 'text-center';
  text-wrap: balance;
}

.lyric-line.active {
  --uno: op100 scale-105;
}
.lyric-line.inactive {
  --uno: op30 filter-saturate-0 scale-90;
}
.lyric-line.next {
  --uno: op60 filter-saturate-50 scale-90;
}

.lyric-line-source {
  --uno: 'text-1.125em font-jp-serif mb--0.2em';
}
.lyric-line-romaji {
  --uno: 'text-0.875em text-rose7:75 dark:text-rose3:75';
}

.lyric-line-translate {
  --uno: 'text-0.875em op50';
}
</style>
