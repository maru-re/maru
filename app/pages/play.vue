<script setup lang="ts">
import { appName } from '~/constants'

const hash = useRouteHash()
const { id, data, status, source, error } = useSongData(() => hash.value)
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
    <template v-else-if="status === 'missing' || !data">
      <h1 text-10em font-serif>
        404
      </h1>
      <p>
        歌曲不存在。
      </p>
    </template>
    <div mt10 flex="~ gap-2">
      <SimpleButton
        v-if="(status === 'missing' || !data) && id"
        icon="i-uil-plus-circle"
        :to="`/edit#id=${id}`"
        title="創建歌詞"
      />
      <SimpleButton
        icon="i-uil-home-alt"
        to="/"
        title="回到首頁"
      />
    </div>
  </div>
</template>
