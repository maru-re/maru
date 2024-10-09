<script setup lang="ts">
import { appName } from '~/constants'

const hash = useRouteHash()
const { id, data, status, source, error } = useSongData(() => hash.value)
const { addRecent } = useCollections()
const { t } = useI18n()

useSeoMeta({
  title: () => data.value
    ? t('seo.title.play', { title: data.value.title, artists: data.value.artists?.join(', '), appName })
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
      <div>{{ $t("common.loading") }}</div>
    </template>
    <template v-else-if="status === 'error'">
      <h1 text-4xl text-red>
        {{ $t("common.error") }}
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
        {{ $t("songNotFound") }}
      </p>
    </template>
    <div mt10 flex="~ gap-2">
      <SimpleButton
        v-if="(status === 'missing' || !data) && id"
        icon="i-uil-plus-circle"
        :to="`/edit#id=${id}`"
        :title="$t('createLyrics')"
      />
      <SimpleButton
        icon="i-uil-home-alt"
        to="/"
        :title="$t('common.backToHome')"
      />
    </div>
  </div>
</template>
