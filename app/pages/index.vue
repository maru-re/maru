<script setup lang="ts">
import Fuse from 'fuse.js'

const route = useRoute()
const router = useRouter()
const {
  recentIds,
  favoriteIds,
  collections,
} = useCollections()

const search = ref(String(route.query.s || ''))
const fuse = computed(() => new Fuse(collections.value, {
  keys: ['title', 'artists', 'tags'],
  includeScore: true,
  threshold: 0.4,
}))

const debounced = useDebounce(search, 300)

const { ignoreUpdates } = watchIgnorable(
  () => route.query.s,
  () => {
    const str = String(route.query.s || '')
    if (str !== debounced.value && str !== search.value)
      search.value = str
  },
  { flush: 'sync' },
)

watch(
  debounced,
  () => {
    ignoreUpdates(() => {
      router.replace({ query: { s: debounced.value.trim() || undefined } })
    })
  },
  { immediate: true },
)

const tagsSum = computed(() => {
  const tags = collections.value.flatMap(s => s.tags)
  return tags.reduce((acc, tag) => {
    if (tag)
      acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)
})

const result = computed(() => {
  if (!debounced.value.trim()) {
    return collections.value
  }
  return fuse.value.search(debounced.value).map(r => r.item)
})

const recent = computed(() => {
  return recentIds.value
    ?.map(id => collections.value.find(s => s.youtube === id))
    .filter(x => !!x) || []
})

const favorited = computed(() => {
  return favoriteIds.value
    ?.map(id => collections.value.find(s => s.youtube === id))
    .filter(x => !!x) || []
})
</script>

<template>
  <div>
    <div py20 flex="~ col gap-2 items-center">
      <div i-mdi-circle-double text-5xl op75 />
      <div text-4xl font-jp-serif>
        <ruby>
          <rb>二重丸</rb>
          <rt>にじゅうまる</rt>
        </ruby>
      </div>
      <div mt5 text-center op75>
        「唱歌學日文」
      </div>
      <div text-center op50>
        基於 YouTube 的歌曲歌詞展示閱讀器
      </div>
    </div>
    <div sticky left-0 right-0 top-0 z-1000 flex p3>
      <div
        flex="~ gap-3 items-center"
        ma h-3em max-w-100 w-full of-hidden px3 floating-glass
      >
        <div i-uil-search text-lg op25 />
        <input
          v-model="search"
          type="text"
          placeholder="搜尋"
          absolute inset-0 w-auto bg-transparent p5 px10 outline-none
        >
        <div flex-auto />
        <IconButton v-if="search" icon="i-uil-times" @click="search = ''" />
      </div>
    </div>
    <div flex="~ justify-center">
      <NuxtLink to="/demo" op50 hover="op100 underline">
        Demo
      </NuxtLink>
      <span mx2 op50> · </span>
      <NuxtLink to="/about" op50 hover="op100 underline">
        關於我們
      </NuxtLink>
      <span mx2 op50> · </span>
      <NuxtLink to="/copyright" op50 hover="op100 underline">
        版權說明
      </NuxtLink>
      <span mx2 op50> · </span>
      <a href="https://github.com/maru-re/maru" target="_blank" op50 hover="op100 underline">
        GitHub
      </a>
    </div>

    <div p10 flex="~ col gap-4">
      <template v-if="!search.trimEnd() && favorited.length">
        <div>收藏歌曲</div>
        <div grid="~ cols-minmax-250px gap-2" mb-10>
          <SongCover v-for="song of favorited" :key="song.youtube" :song="song" />
        </div>
      </template>

      <template v-if="!search.trimEnd() && recent.length">
        <div>最近看過</div>
        <div grid="~ cols-minmax-250px gap-2" mb-10>
          <SongCover v-for="song of recent" :key="song.youtube" :song="song" />
        </div>
      </template>

      <template v-if="result?.length">
        <div flex="~ gap-2 items-center">
          <template v-if="search.trim()">
            <span>搜尋結果</span>
            <span text-sm op50>{{ result.length }} 之 {{ collections.length }}</span>
          </template>
          <template v-else>
            <span>所有歌曲</span>
            <span text-sm op50>{{ collections.length }}</span>
          </template>
          <div flex-auto />
          <div flex="~ gap-2 wrap justify-end">
            <button
              v-for="value, tag of tagsSum"
              :key="tag"
              :class="search === tag ? 'text-amber bg-amber:10 border-amber' : 'text-gray'"
              border="~ base rounded-full" px2 text-xs
              @click="router.replace({ query: { s: tag } })"
            >
              {{ tag }} <span text-0.9em op50>{{ value }}</span>
            </button>
          </div>
        </div>

        <div grid="~ cols-minmax-250px gap-2">
          <SongCover v-for="song of result" :key="song.youtube" :song="song" />
        </div>
      </template>

      <div v-else text-center op50>
        沒找到符合的歌曲。
      </div>
    </div>
  </div>
</template>
