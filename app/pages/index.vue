<script setup lang="ts">
import Fuse from 'fuse.js'

const route = useRoute()
const router = useRouter()
const {
  recentIds,
  favoriteIds,
  collections,
} = useCollections()

const rawSearch = ref(String(route.query.s || ''))
const search = useDebounce(rawSearch, 300)

const fuse = computed(() => new Fuse(collections.value, {
  keys: ['title', 'artists', 'tags'],
  includeScore: true,
  threshold: 0.4,
}))

const { ignoreUpdates } = watchIgnorable(
  () => route.query.s,
  () => {
    const str = String(route.query.s || '')
    if (str !== search.value && str !== rawSearch.value)
      rawSearch.value = str
  },
  { flush: 'sync' },
)

watch(
  search,
  () => {
    ignoreUpdates(() => {
      router.replace({ query: { s: search.value.trim() || undefined } })
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
  if (!search.value.trim()) {
    return collections.value
  }
  return fuse.value.search(search.value).map(r => r.item)
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

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  await importFromFiles(files)
}
</script>

<template>
  <div>
    <div pb-10 pt-25 flex="~ col gap-2 items-center">
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
        基於 YouTube 的歌曲歌詞閱讀器
      </div>
      <div mt4 flex="~ gap-1 items-center" rounded bg-orange:10 px2 py1 text-sm text-orange>
        <div i-uil-flask flex-none />
        高強度開發中、許多功能尚未完善。歡迎回報問題
      </div>
      <div p5>
        <div
          border="~ dashed #888 rounded-2"
          flex="~ gap-2 items-center"
          relative px4 py2 op50
          hover="border-primary text-primary bg-primary/5 op100"
        >
          <div i-uil-file-plus-alt />
          <span>匯入歌詞檔案</span>
          <input
            type="file"
            accept=".json"
            multiple
            absolute inset-0 h-full w-full cursor-pointer opacity-0
            @change="onFileChange"
          >
        </div>
      </div>
    </div>
    <div sticky left-0 right-0 top-0 z-floating flex p3>
      <div
        flex="~ gap-3 items-center"
        ma h-3em max-w-100 w-full of-hidden px3 floating-glass
      >
        <div i-uil-search text-lg op25 />
        <input
          v-model="rawSearch"
          type="text"
          :placeholder="`搜尋已匯入的歌曲 (${collections.length})`"
          absolute inset-0 w-auto bg-transparent p5 px10 outline-none
        >
        <div flex-auto />
        <IconButton
          v-if="rawSearch"
          icon="i-uil-times"
          @click="rawSearch = ''"
        />
      </div>
    </div>
    <div flex="~ justify-center wrap">
      <NuxtLink to="/demo" op50 hover="op100 underline">
        Demo
      </NuxtLink>
      <span mx2 op50> · </span>
      <NuxtLink to="/settings" op50 hover="op100 underline">
        設定
      </NuxtLink>
      <span mx2 op50> · </span>
      <NuxtLink to="/about" op50 hover="op100 underline">
        關於我們
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

      <div v-else-if="search" text-center op50>
        沒找到符合的歌曲。
      </div>
    </div>
  </div>
</template>
