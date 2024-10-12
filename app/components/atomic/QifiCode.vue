<script lang="ts" setup>
import type { Pausable } from '@vueuse/core'
import { appendFileHeaderMetaToBuffer, createGeneraterSVG } from '@qifi/generate'

const props = withDefaults(defineProps<{
  prefix?: string
  shareUrl: string
  fps?: number
  sliceSize?: number
}>(), {
  prefix: 'https://qrss.netlify.app/#',
  fps: 10,
  sliceSize: 500,
})

const emit = defineEmits(['done'])

const colorMode = useColorMode()

let fountain: ReturnType<typeof generater.fountain> | undefined
function startShare() {
  const data = new TextEncoder().encode(props.shareUrl)
  const merged = appendFileHeaderMetaToBuffer(data, {
    contentType: 'text/plain',
  })
  const generater = createGeneraterSVG(merged, {
    urlPrefix: props.prefix,
    sliceSize: props.sliceSize,
    border: 4,
    invert: colorMode.value === 'dark',
  })
  fountain = undefined
  return generater
}
let generater = startShare()
watch(() => [props.prefix, props.shareUrl, props.sliceSize, colorMode.value], () => generater = startShare())
const svg = ref('')

let interval: Pausable
onMounted(() => {
  interval = useIntervalFn(() => {
    fountain ||= generater.fountain()
    svg.value = fountain.next().value
  }, () => 1000 / props.fps)
})

function stopSometime() {
  interval.pause()
  setTimeout(() => {
    interval.resume()
  }, 1000 * 5)
}

function onDone() {
  emit('done')
}
</script>

<template>
  <div>
    <div
      class="sticky top-0 z-10 aspect-square [&>svg]:h-full [&>svg]:w-full"
      overflow-hidden
      v-html="svg"
    />
    <h1 flex items-center gap2 px4 text-xl>
      <span i-ph-qr-code inline-block />
      掃碼分享
    </h1>
    <div flex="~ col gap4" p4>
      <SimpleButton w-full @click="stopSometime">
        <span i-ph-pause />
        Pause 5s
      </SimpleButton>
      <SimpleButton w-full @click="onDone">
        <span i-ph-arrow-u-down-left />
        Done
      </SimpleButton>
      <Collapsable label="如何掃描?">
        <div flex="~ col gap-4" p2>
          <p>
            這是名為 <a href="https://github.com/qifi-dev/qrs" text-blue underline>QiFi/Qrs</a> 的動態二維碼。你可以使用系統自帶的掃描器 APP 或者相機 APP 掃描動態二維碼。
          </p>
          <p>
            通常而言這會自動打開瀏覽器，並將你導向一個掃描器頁面，你需要在那裡繼續掃描來傳輸 .maru 文件的剩餘信息，這個過程會需要你的相機權限，請放心，這個網頁的代碼開源，並且不會保存你的相機畫面。數據全部接收完成後，會自動在 maru 播放器中打開對應的歌曲。
          </p>
          <p>
            部分相機 APP 會因為動態變化的二維碼而無法正常掃描，這時你可以點擊 <span i-ph-pause inline-block /> 暫停 5 秒，這會有助於你掃描。
          </p>
          <p>
            你也可以手動輸入掃描網頁的地址：<a href="https://qrss.netlify.app" text-blue underline>https://qrss.netlify.app</a>
          </p>
        </div>
      </Collapsable>
    </div>
  </div>
</template>
