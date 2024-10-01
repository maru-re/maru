<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { Dropdown } from 'floating-vue'
import { removeSong } from '~/composables/store'

const props = defineProps<{
  data: MaruSongDataParsed
}>()
const emit = defineEmits<{
  afterRemove: [id: string]
}>()

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

const controls = usePlayer(props.data)
const { active, go, toggle, error } = controls

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

function remove() {
  removeSong(props.data.youtube)
  emit('afterRemove', props.data.youtube)
}
</script>

<template>
  <div h-screen w-screen grid="~ cols-2" of-hidden lt-md="flex flex-col">
    <div flex="~ col gap-4" flex-none of-auto p4 px6 lt-md="p0 gap-0">
      <div flex="~ gap-3 items-center" lt-md="px3 py2 hidden">
        <NuxtLink to="/" hover="bg-hover op100" ml--0.5 rounded-full op50 transition>
          <div i-mdi-circle-double text-2xl />
        </NuxtLink>
        <div flex="~ col" font-jp-serif>
          <h1 text-xl>
            {{ data.title }}
          </h1>
          <ArtistsList :artists="data.artists" mt--1 />
        </div>
        <div flex-auto />
        <Dropdown>
          <IconButton
            flex-none
            icon="i-ph-trash-duotone op40 text-red"
          />
          <template #popper="{ hide }">
            <div flex flex-col gap-4 p-4>
              <h3>
                刪除此歌曲?
              </h3>
              <div flex gap-4>
                <SimpleButton text-red @click="remove">
                  删除
                </SimpleButton>
                <SimpleButton @click="hide()">
                  取消
                </SimpleButton>
              </div>
            </div>
          </template>
        </Dropdown>
        <IconToggle
          v-model="favorited"
          flex-none
          :icon="favorited ? 'i-ph-star-fill text-yellow6 dark:text-yellow2' : 'i-ph-star-duotone'"
        />
      </div>
      <div
        border-rounded-1.5em
        lt-md="rounded-0 border-0 border-b border-base"
        class="aspect-16/9 flex-none of-hidden shadow-lg"
      >
        <div id="player" flex bg-hover text-center>
          <div v-if="!error" ma text-sm op50>
            YouTube 連接中...
          </div>
          <div v-else ma text-sm>
            <div text-red font-bold>
              YouTube 連接失敗
            </div>
            <div mb2 text-red>
              {{ error }}
            </div>
            <div op50>
              請嘗試重新整理頁面
            </div>
          </div>
        </div>
      </div>
      <div lt-md="hidden" mt--4 min-h-80px flex rounded p2>
        <LyricsLine
          v-if="active"
          ma
          :line="data.lyrics[active.index]!"
        />
      </div>
      <!-- <QRCode :data="data" /> -->
      <div
        flex="~ col gap-2 justify-end auto"
        lt-md="p4 border-b border-base hidden"
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

    <LyricsTrack :data="data" :controls="controls" md="pr-50px" />
  </div>
</template>

<style>
#player {
  width: 100.5% !important;
  height: 100.5% !important;
  transform: translate(-1px, -1px);
}
</style>
