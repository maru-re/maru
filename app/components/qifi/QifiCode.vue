<script lang="ts" setup>
import type { Pausable } from '@vueuse/core'
import type { Component } from 'vue'
import QifiHowToScanZhHans from '~/components/qifi/QifiHowToScan.zh-Hans.md'
import QifiHowToScanEn from './QifiHowToScan.en.md'
import QifiHowToScanZhHant from './QifiHowToScan.zh-Hant.md'

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
  },
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

const howToScan = {
  'zh-Hans': QifiHowToScanZhHans,
  'zh-Hant': QifiHowToScanZhHant,
  'en': QifiHowToScanEn,
  // TODO QifiHowToScanJp
} as Record<string, Component | undefined>

// Configure this to support language fallback.
const { t } = useI18n({
  useScope: 'local',
  messages: Object.keys(howToScan).reduce((acc, key) => {
    acc[key] = { howToScanComponent: key }
    return acc
  }, {} as Record<string, Record<string, string>>),

})
</script>

<template>
  <div flex="~ col gap-2" p4>
    <h3 flex items-center gap2 p2 text-xl>
      <span i-uil-qrcode-scan inline-block />
      {{ $t('actions.shareViaQR') }}
    </h3>
    <div
      class="sticky top-0 z-10 aspect-square [&>svg]:h-full [&>svg]:w-full"
      overflow-hidden
      v-html="svg"
    />
    <div flex="~ gap-2">
      <SimpleButton w-full icon="i-uil-pause-circle" @click="stopSometime(3)">
        {{ $t('share.qifi.pausePlayback') }}
      </SimpleButton>
      <SimpleButton w-full icon="i-uil-multiply " @click="onDone()">
        {{ $t('share.qifi.close') }}
      </SimpleButton>
    </div>
    <component :is="howToScan[t('howToScanComponent')]" />
  </div>
</template>
