<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { Dropdown, Tooltip } from 'floating-vue'
import { compressToEncodedURIComponent } from 'lz-string'
import type { SongDataSource } from '~/composables/loader'
import { removeSongs } from '~/composables/store'

const props = defineProps<{
  data: MaruSongDataParsed
  source: SongDataSource
}>()
const emit = defineEmits<{
  afterRemove: [id: string]
}>()

const router = useRouter()
const route = useRoute()

const {
  isFavorite,
  toggleFavorite,
} = useCollections()

const favorited = computed({
  get() {
    return isFavorite(props.data.youtube)
  },
  set(value: boolean) {
    toggleFavorite(props.data.youtube, value)
  },
})

const shareUrl = computed(() => {
  try {
    return `${location.origin}/play?share=${compressToEncodedURIComponent(JSON.stringify(props.data))}`
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
  exportSongMaru(props.data)
}

function editSong() {
  router.push({ path: '/edit', query: route.query })
}

async function saveSong() {
  await saveSongsToLocal([props.data])
  router.replace(`/play?id=${props.data.youtube}`)
}

const settings = useSettings()
const controls = usePlayer(props.data)
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
        go(props.data.lyrics[Math.max(0, (active.value?.index || 0) - 1)])
        break
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        go(props.data.lyrics[Math.min(props.data.lyrics.length - 1, (active.value?.index || 0) + 1)])
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

async function remove() {
  await removeSongs([props.data.youtube])
  emit('afterRemove', props.data.youtube)
}
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
            {{ data.title }}
          </h1>
          <ArtistsList :artists="data.artists" mt--1 />
        </div>
        <div flex-auto />
        <Dropdown v-if="source === 'local'">
          <ActionButton
            type="icon"
            icon="i-ph-trash-duotone op40 hover:op100 hover:text-red"
            title="刪除歌詞"
          />
          <template #popper="{ hide }">
            <div flex flex-col gap-2 p4>
              <h3>
                確認要刪除此歌曲？
              </h3>
              <div flex gap-2>
                <SimpleButton color="btn-simple-red" bg-red:10 px5 text-red:80 @click="remove">
                  刪除
                </SimpleButton>
                <SimpleButton px5 @click="hide()">
                  取消
                </SimpleButton>
              </div>
            </div>
          </template>
        </Dropdown>
        <ActionButton
          v-if="source === 'local'"
          type="icon"
          icon="i-uil-file-download-alt"
          title="導出歌詞"
          @click="exportCurrent"
        />
        <ActionButton
          v-if="source === 'local'"
          type="icon"
          icon="i-uil-edit"
          title="編輯歌詞"
          @click="editSong"
        />
        <ActionButton
          v-if="source === 'share'"
          type="icon"
          icon="i-uil-save"
          title="儲存歌詞"
          @click="saveSong()"
        />
        <Dropdown>
          <ActionButton
            type="icon"
            icon="i-uil-share-alt"
            title="分享歌詞"
          />
          <template #popper="{ hide }">
            <div p5 flex="~ col gap-2">
              <div>
                <pre max-h-50 max-w-100 of-auto ws-pre-wrap break-all rounded bg-gray:15 p2>{{ shareUrl }}</pre>
              </div>
              <SimpleButton icon="i-uil-copy" @click="copyShareLink(), hide()">
                複製連結
              </SimpleButton>
            </div>
          </template>
        </Dropdown>
        <IconToggle
          v-model="favorited"
          flex-none
          :icon="favorited ? 'i-ph-star-fill text-yellow6 dark:text-yellow2' : 'i-ph-star-duotone'"
        />
      </div>
      <YouTubePlayer
        border="~ base rounded-1.5em"
        lt-sm="rounded-0 border-0 border-b border-base"
        lt-lg="max-w-680px w-full mxa"
      />
      <div lt-lg="hidden" min-h-80px flex rounded p2>
        <LyricsLine
          v-if="active"
          ma
          :style="{
            fontSize: `${settings.fontSize}rem`,
          }"
          :line="data.lyrics[active.index]!"
        />
      </div>
      <!-- <QRCode :data="data" /> -->
      <div
        flex="~ col gap-2 justify-end auto"
        lt-lg="p4 border-b border-base hidden"
        of-auto p1 text-xs text-hex-888
      >
        <div border="t base" my1 h-1px w-30px />
        <div v-if="data.notes?.length" text-sm>
          <div v-for="line, idx of data.notes" :key="idx">
            {{ line }}
          </div>
        </div>
        <!-- <div border="t base" my1 h-1px w-30px />
        <p v-if="data.credits?.lyrics" text-xs>
          此頁面的資料提取自 jpmarumaru.com（已關站）的歷史快照，感謝原站長與網友們的無私貢獻。<br>
          <a :href="data.credits.lyrics" op75 hover="op100 underline" target="_blank">來自 web.archive.org 的源網站快照</a>
          <span> · </span>
          <a href="/about" target="_blank" op75 hover="op100 underline">關於我們</a>
          <span> · </span>
          <a href="/copyright" target="_blank" op75 hover="op100 underline">版權著作權說明</a>
        </p> -->
      </div>
    </div>
    <LyricsTrack :data="data" :controls="controls" />
  </div>
</template>

<style>
#player {
  width: 100.5% !important;
  height: 100.5% !important;
  transform: translate(-1px, -1px);
}
</style>
