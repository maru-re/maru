<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { parseSongData } from '@marure/parser'
import { validate } from '@marure/schema'
import { appName } from '~/constants'

const route = useRoute()
const { addRecent } = useCollections()
const id = (route.params as any).id as string

const raw = loadSongFromStorage(id)
const data = ref<MaruSongDataParsed | null>(null)
const error = ref<unknown | null>(null)

try {
  data.value = raw
    ? parseSongData(validate(raw))
    : null
}
catch (err) {
  error.value = err
  console.error(err)
}

useSeoMeta({
  title: () => data.value
    ? `${data.value.title} - ${data.value.artists?.join(', ')} 歌詞 | 唱歌學日語 | ${appName}`
    : appName,
})

watchEffect(() => {
  if (data.value?.youtube)
    addRecent(data.value.youtube)
})
</script>

<template>
  <SongPlay v-if="data && typeof data.title === 'string'" :data="data" @after-remove="$router.replace('/')" />
  <div v-else h-screen w-screen flex="~ col items-center justify-center" p5>
    <BasicNav />
    <template v-if="error">
      <h1 text-4xl text-red>
        錯誤
      </h1>
      <p>
        {{ error }}
      </p>
    </template>
    <template v-else-if="!raw">
      <h1 text-4xl text-red>
        404
      </h1>
      <p>
        歌曲不存在。
      </p>
    </template>
    <NuxtLink to="/" mt-10 hover="underline">
      回到首頁
    </NuxtLink>
  </div>
</template>
