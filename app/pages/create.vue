<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'

const router = useRouter()
const id = ref('')
const input = computed({
  get: () => id.value,
  set: (value: string) => {
    if (value.startsWith('https://www.youtube.com/watch')) {
      const url = new URL(value)
      id.value = url.searchParams.get('v') || ''
    }
    else if (value.startsWith('https://youtu.be/')) {
      const url = new URL(value)
      id.value = url.pathname.slice(1)
    }
    else {
      id.value = value
    }
  },
})

const data = reactive<MaruSongDataParsed>({
  ...createEmptySongData(),
  youtube: id as any,
})

const controls = usePlayer(data)

function go() {
  router.push(`/edit?id=${id.value}`)
}

watch(
  () => id.value,
  () => controls.reload(),
)
</script>

<template>
  <div flex="~ col gap-2 items-center justify-center" h-full w-full p10>
    <BasicNav />
    <h1 text-2xl font-bold>
      建立歌詞
    </h1>
    <div mt5 op75>
      貼上 YouTube MV 歌曲連結
    </div>
    <TextInput
      v-model="input" w-100 font-mono
      input-class="text-center"
      placeholder="https://youtube.com/watch?v="
    />
    <SimpleButton icon="i-uil-edit" :disabled="!id" mt2 @click="go()">
      建立
    </SimpleButton>
    <YouTubePlayer border="~ base" mt10 w-120 rounded-xl shadow-lg />
  </div>
</template>
