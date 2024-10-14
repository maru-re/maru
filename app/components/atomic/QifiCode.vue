<script lang="ts" setup>
import type { Pausable } from '@vueuse/core'

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

let generator: Awaited<ReturnType<typeof startShare>> | undefined
let fountain: ReturnType<(Awaited<ReturnType<typeof startShare>>)['fountain']> | undefined
const svg = ref('')

async function startShare() {
  const { appendFileHeaderMetaToBuffer, createGeneraterSVG } = await import('@qifi/generate')
  const data = new TextEncoder().encode(props.shareUrl)
  const merged = appendFileHeaderMetaToBuffer(data, {
    contentType: 'text/plain',
  })
  const generater = createGeneraterSVG(merged, {
    urlPrefix: props.prefix,
    sliceSize: props.sliceSize,
    border: 1,
    invert: colorMode.value === 'dark',
  })
  return generater
}

watch(
  () => [props.prefix, props.shareUrl, props.sliceSize, colorMode.value],
  async () => {
    fountain = undefined
    svg.value = ''
    generator = await startShare()
  },
  {
    immediate: true,
  }
)

let interval: Pausable
onMounted(() => {
  interval = useIntervalFn(() => {
    fountain ||= generator?.fountain()
    if (fountain)
      svg.value = fountain.next().value
  }, () => 1000 / props.fps)
})

function stopSometime(seconds: number) {
  interval.pause()
  setTimeout(() => {
    interval.resume()
  }, 1000 * seconds)
}

function onDone() {
  emit('done')
}
</script>

<template>
  <div flex="~ col gap-2" p4>
    <h3 flex items-center gap2 p2 text-xl>
      <span i-uil-qrcode-scan inline-block />
      掃碼分享
    </h3>
    <div
      class="sticky top-0 z-10 aspect-square [&>svg]:h-full [&>svg]:w-full"
      overflow-hidden
      v-html="svg"
    />
    <div flex="~ gap-2">
      <SimpleButton w-full icon="i-uil-pause-circle" @click="stopSometime(3)">
        暫停 3 秒
      </SimpleButton>
      <SimpleButton w-full icon="i-uil-multiply " @click="onDone()">
        關閉
      </SimpleButton>
    </div>
    <div flex="~ col gap-4" mt2 p2 text-sm>
      <p>
        由於單個 QR Code 的傳輸大小限制，我們採用了名為 <a href="https://github.com/qifi-dev/qrs" text-blue underline>QiFi/Qrs</a> 的 <b>動態 QR Code</b>。
      </p>
      <p>
        使用相機 App 掃描後，將導向 QRS 掃描器頁面，繼續掃描傳輸剩餘信息。過程中可能會需要相機權限，請放心，網頁代碼開源且不保存相機畫面。數據接收完成後，會自動回到 maru 打開對應歌曲。
      </p>
      <p>
        部分相機 APP 會因為動態變化的二維碼而無法正常掃描，也你可以點擊 <span i-uil-pause-circle inline-block align-middle /> 暫停 5 秒，這會有助於你掃描。
      </p>
      <p>
        你也可以手動輸入掃描網頁的地址：<a href="https://qrss.netlify.app" text-blue underline>qrss.netlify.app</a>
      </p>
    </div>
  </div>
</template>
