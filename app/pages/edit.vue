<script setup lang="ts">
import { appName } from '~/constants'

const { t } = useI18n()

// Make it non-reactive on purpose
const query = { ...useRouteHash().value }
const { data, source } = await useSongData(() => query, true)

useSeoMeta({
  title: () => data.value?.title
    ? t('seo.title.edit', { title: data.value.title, artists: data.value.artists?.join(', '), appName })
    : t('seo.title.new', { appName }),
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
