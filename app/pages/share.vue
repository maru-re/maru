<script setup lang="ts">
import { parseSongData } from '@marure/parser'
import { validate } from '@marure/schema'
import { decompressFromEncodedURIComponent } from 'lz-string'
import { appName } from '~/constants'

const route = useRoute()
const error = shallowRef<any>()
const data = computed(() => {
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  error.value = undefined
  try {
    return parseSongData(validate(JSON.parse(
      decompressFromEncodedURIComponent(
        route.query.d as string,
      ),
    )))
  }
  catch (e) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    error.value = e
    console.error(e)
    return undefined
  }
})

useSeoMeta({
  title: () => data.value
    ? `${data.value.title} - ${data.value.artists?.join(', ')} 歌詞 | 唱歌學日語 | ${appName}`
    : appName,
})

// TODO: prompt to save when navigating away
</script>

<template>
  <SongPlay
    v-if="data && typeof data.title === 'string'"
    :data="data"
    source="share"
    @after-remove="$router.replace('/')"
  />
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
    <NuxtLink to="/" mt-10 hover="underline">
      回到首頁
    </NuxtLink>
  </div>
</template>
