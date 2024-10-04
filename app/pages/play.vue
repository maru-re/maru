<script setup lang="ts">
import { appName } from '~/constants'

const { data, status, source, error } = useSongData()
const { addRecent } = useCollections()

useSeoMeta({
  title: () => data.value
    ? `${data.value.title} - ${data.value.artists?.join(', ')} 歌詞 | 唱歌學日語 | ${appName}`
    : appName,
})

// useEventListener('beforeunload', (e) => {
//   if (source.value === 'share') {
//     e.preventDefault()
//     e.returnValue = ''
//   }
// })

watchEffect(() => {
  if (data.value?.youtube && source.value === 'local')
    addRecent(data.value.youtube)
})
</script>

<template>
  <SongPlay
    v-if="data"
    :key="data.youtube"
    :data="data"
    :source="source"
    @after-remove="$router.replace('/')"
  />
  <div v-else h-screen w-screen flex="~ col items-center justify-center" p5>
    <BasicNav />
    <template v-if="status === 'loading'">
      <div>加載中...</div>
    </template>
    <template v-else-if="status === 'error'">
      <h1 text-4xl text-red>
        錯誤
      </h1>
      <p>
        {{ error }}
      </p>
    </template>
    <template v-else-if="status === 'missing'">
      <h1 text-4xl text-red>
        404
      </h1>
      <p>
        歌曲不存在。
        <!-- TODO: make show a editer -->
      </p>
    </template>
    <NuxtLink to="/" mt-10 hover="underline">
      回到首頁
    </NuxtLink>
  </div>
</template>
