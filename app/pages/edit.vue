<script setup lang="ts">
import { appName } from '~/constants'

// Make it non-reactive on purpose
const query = { ...useRoute().query }
const { data, source } = await useSongData(() => query, true)

useSeoMeta({
  title: () => data.value?.title
    ? `編輯歌詞 ${data.value.title} - ${data.value.artists?.join(', ')} 歌詞 | 唱歌學日語 | ${appName}`
    : `建立歌詞 | 唱歌學日語 | ${appName}`,
})
</script>

<template>
  <div px15 py20>
    <SongEditor
      :data="data"
      :source="source"
    />
  </div>
</template>
