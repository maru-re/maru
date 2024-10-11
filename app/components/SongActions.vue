<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { Dropdown } from 'floating-vue'
import { compressToEncodedURIComponent } from 'lz-string'
import { removeSongs } from '~/composables/store'

const props = withDefaults(
  defineProps<{
    song: MaruSongDataParsed
    source: SongDataSource
    type?: 'icon' | 'button'
  }>(),
  {
    type: 'icon',
  },
)

const router = useRouter()
const route = useRoute()

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

const shareUrl = computed(() => {
  try {
    return `https://maru.re/play#share=${compressToEncodedURIComponent(JSON.stringify(props.song))}`
  }
  catch (e) {
    console.error(e)
    return ''
  }
})

function copyShareLink() {
  navigator.clipboard.writeText(shareUrl.value)
}

async function exportCurrent() {
  exportSongMaru(props.song)
}

function editSong() {
  router.push({ path: '/edit', hash: route.hash })
}

async function remove() {
  await removeSongs([props.song.youtube])
  router.replace('/')
}

async function saveSong() {
  await saveSongsToLocal([props.song])
  router.replace(`/play#id=${props.song.youtube}`)
}
</script>

<template>
  <Dropdown v-if="source === 'local'">
    <ActionButton
      :type
      icon="i-ph-trash-duotone op40 hover:op100 hover:text-red"
      :title="$t('lyrics.removeLyrics')"
    />
    <template #popper="{ hide }">
      <div flex flex-col gap-2 p4>
        <h3>
          {{ $t("lyrics.removeLyricsConfirm") }}
        </h3>
        <div flex gap-2>
          <SimpleButton color="btn-simple-red" bg-red:10 px5 text-red:80 @click="remove">
            {{ $t("common.remove") }}
          </SimpleButton>
          <SimpleButton px5 @click="hide()">
            {{ $t("common.cancel") }}
          </SimpleButton>
        </div>
      </div>
    </template>
  </Dropdown>
  <ActionButton
    v-if="source === 'local'"
    :type
    icon="i-uil-file-download-alt"
    :title="$t('lyrics.exportLyrics')"
    @click="exportCurrent"
  />
  <ActionButton
    v-if="source === 'local'"
    lt-md="hidden"
    :type
    icon="i-uil-edit"
    :title="$t('lyrics.editLyrics')"
    @click="editSong"
  />
  <ActionButton
    v-if="source === 'share'"
    :type
    icon="i-uil-save"
    :title="$t('lyrics.saveLyrics')"
    @click="saveSong()"
  />
  <Dropdown>
    <ActionButton
      :type
      icon="i-uil-share-alt"
      :title="$t('lyrics.shareLyrics')"
    />
    <template #popper="{ hide }">
      <div p5 flex="~ col gap-2">
        <div>
          <pre max-h-50 max-w-100 of-auto ws-pre-wrap break-all rounded bg-gray:15 p2>{{ shareUrl }}</pre>
        </div>
        <SimpleButton icon="i-uil-copy" @click="copyShareLink(), hide()">
          {{ $t("copy.link") }}
        </SimpleButton>
      </div>
    </template>
  </Dropdown>
  <ActionButton
    :type
    :icon="favorited ? 'i-ph-star-fill text-yellow6 dark:text-yellow2' : 'i-ph-star-duotone op50'"
    :title="$t('actions.favorite')"
    @click="favorited = !favorited"
  />
</template>
