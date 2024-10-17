<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { Dropdown } from 'floating-vue'
import { compressToEncodedURIComponent } from 'lz-string'
import { removeSongs } from '~/composables/store'
import { isMobileScreen } from '~/state/breakpoints'

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

const shareStatus = ref(false)
async function copyShareLink() {
  await navigator.clipboard.writeText(shareUrl.value)

  shareStatus.value = true
  setTimeout(() => {
    shareStatus.value = false
  }, 2000)
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

const showShareQifiCode = ref(false)
function shareWithQifi() {
  showShareQifiCode.value = true
}
</script>

<template>
  <Dropdown v-if="source === 'local'">
    <ActionButton
      :type
      icon="i-uil-trash-alt op40 @hover:op100 @hover:text-red"
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
      <div p3 flex="~ col gap-2">
        <!-- <div>
          <pre max-h-50 max-w-100 of-auto ws-pre-wrap break-all rounded bg-gray:15 p2>{{ shareUrl }}</pre>
        </div> -->
        <SimpleButton icon="i-uil-copy" @click="copyShareLink(), hide()">
          {{ $t("copy.link") }}
        </SimpleButton>
        <SimpleButton icon="i-uil-qrcode-scan" @click="shareWithQifi(), hide()">
          {{ $t('actions.shareViaQR') }}
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
  <ModalPopup
    v-model="showShareQifiCode"
    :direction="isMobileScreen ? 'top' : 'right'"
    :use-v-if="true"
    :dialog-class="isMobileScreen ? 'max-h-85vh! of-auto' : 'max-w-150!'"
  >
    <QifiCode
      :share-url="shareUrl"
      @done="showShareQifiCode = false"
    />
  </ModalPopup>
  <Notification :value="shareStatus">
    <span i-uil-check class="font-xl mr-2 inline-block align-middle" />
    <span class="align-middle">Copied</span>
  </Notification>
</template>
