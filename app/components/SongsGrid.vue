<script setup lang="ts">
import type { MaruSongGist } from '@marure/schema'
import { Dropdown } from 'floating-vue'

const props = withDefaults(
  defineProps<{
    songs: MaruSongGist[]
    link?: boolean
    manage?: boolean
    showFavorite?: boolean | 'hover'
  }>(),
  {
    showFavorite: true,
  },
)

const ASPECT_RATIO = 5 / 2
const min = 220
const padding = 10
const scroller = templateRef<HTMLElement>('scroller')
const size = useElementSize(scroller)
const spec = computed(() => {
  const containerWidth = size.width.value || (window.innerWidth - 50)
  const cols = Math.floor(containerWidth / (min + padding))
  const width = containerWidth / cols
  const height = (width - padding) / ASPECT_RATIO + padding
  return { width, height, cols }
})

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
  await exportSongsZip(selectedSongs.value.map(song => song.youtube))
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
            {{ $t("common.selectAll") }}
          </SimpleButton>
          <SimpleButton v-if="selecting" text-xs icon="i-uil-square" @click="revertSelection()">
            {{ $t("common.selectInverse") }}
          </SimpleButton>
          <SimpleButton v-if="selecting" :disabled="!selectedSongs.length" text-xs icon="i-uil-folder-download" @click="exportSelected()">
            {{ $t("actions.exportSelected") }} <span op50>{{ selectedSongs.length }}</span>
          </SimpleButton>
          <Dropdown v-if="selecting" placement="top" :class="selectedSongs.length ? '' : 'pointer-events-none'">
            <SimpleButton :disabled="!selectedSongs.length" icon="i-uil-trash" color="btn-simple-red" text-xs>
              {{ $t('actions.removeSelected') }} <span op50>{{ selectedSongs.length }}</span>
            </SimpleButton>
            <template #popper="{ hide }">
              <div flex flex-col gap-2 p4 text-sm>
                <h3>
                  {{ $t("lyrics.batchRemoveLyricsConfirm", [selectedSongs.length]) }}
                </h3>
                <div flex gap-2 text-sm>
                  <SimpleButton color="btn-simple-red" bg-red:10 px4 text-xs text-red:80 @click="deleteSelected(), hide()">
                    {{ $t("common.remove") }}
                  </SimpleButton>
                  <SimpleButton px4 text-xs @click="hide()">
                    {{ $t("common.cancel") }}
                  </SimpleButton>
                </div>
              </div>
            </template>
          </Dropdown>
          <SimpleButton text-xs :icon="selecting ? 'i-uil-times' : 'i-uil-th'" @click="selecting = !selecting">
            {{ selecting ? $t("common.deselect") : $t("common.select") }}
          </SimpleButton>
        </template>
      </slot>
    </div>
    <RecycleScroller
      ref="scroller"
      :items="songs"
      :item-size="spec.height"
      :item-secondary-size="spec.width"
      key-field="youtube"
      :grid-items="spec.cols"
    >
      <template #default="{ item }">
        <SongEntry
          :song="item"
          :link="selecting ? false : link"
          :show-favorite="showFavorite"
          :class="selecting ? (selectedId.includes(item.youtube) ? 'selected' : 'unselected') : ''"
          @click="selecting ? toggleSelect(item) : undefined"
        >
          <div
            v-if="selecting && selectedId.includes(item.youtube)"
            absolute right--2 top--2 h-5 w-5 rounded-full bg-primary shadow-xl
          >
            <div i-uil-check text-white />
          </div>
        </SongEntry>
      </template>
    </RecycleScroller>
  </div>
</template>

<style>
.song-entry {
  --uno: transition-all duration-400;
}
.song-entry.selected .song-entry-cover {
  --uno: border-2 border-primary;
}
.song-entry.unselected .song-entry-cover {
  --uno: border-2 border-transparent;
}
.song-entry.unselected {
  --uno: scale-95 saturate-0;
}

.vue-recycle-scroller__item-view.hover {
  --uno: z-hover;
  animation: z-zoom-in 0.5s forwards;
}

.vue-recycle-scroller__item-view {
  --uno: z-0;
  animation: z-zoom-out 0.5s forwards;
}

@keyframes z-zoom-in {
  from {
    --uno: z-0;
  }
  to {
    --uno: z-hover;
  }
}

@keyframes z-zoom-out {
  from {
    --uno: z-hover;
  }
  to {
    --uno: z-0;
  }
}

.vue-recycle-scroller {
  --uno: 'of-visible of-y-visible!';
}

.vue-recycle-scroller__item-wrapper {
  --uno: 'of-visible!';
}
</style>
