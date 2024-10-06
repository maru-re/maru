<script setup lang="ts">
import Fuse from 'fuse.js'
import SongsGrid from '~/components/SongsGrid.vue'

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

// const tagsSum = computed(() => {
//   const tags = collections.value.flatMap(s => s.tags)
//   return tags.reduce((acc, tag) => {
//     if (tag)
//       acc[tag] = (acc[tag] || 0) + 1
//     return acc
//   }, {} as Record<string, number>)
// })

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
    <DropZone />
    <ImportDialog />
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

      <div p5 flex="~ col gap-2 items-center justify-center">
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
            :accept="SUPPORTED_IMPORT_EXT.map(ext => `.${ext}`).join(', ')"
            multiple
            absolute inset-0 h-full w-full cursor-pointer opacity-0
            @change="onFileChange"
          >
        </div>
        <div flex="~ justify-center wrap">
          <NuxtLink to="/play?demo=1" op50 hover="op100 underline">
            Demo
          </NuxtLink>
          <span mx2 op50> · </span>
          <NuxtLink to="/create" op50 hover="op100 underline">
            建立歌詞
          </NuxtLink>
        </div>
      </div>
    </div>
    <div flex="~ gap-1 items-center" mxa mb2 w-max rounded-full bg-orange:10 px3 py1 text-sm text-orange>
      <div i-uil-flask flex-none text-base />
      網站開發中、許多功能尚未完善。歡迎透過 Discord 回報問題
    </div>
    <div v-if="collections.length > 0" sticky left-0 right-0 top-0 z-floating flex p3>
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
      <NuxtLink to="/format" op50 hover="op100 underline">
        檔案格式
      </NuxtLink>
      <span mx2 op50> · </span>
      <NuxtLink to="/about" op50 hover="op100 underline">
        關於我們
      </NuxtLink>
      <span mx2 op50> · </span>
      <a href="https://chat.maru.re" target="_blank" op50 hover="op100 underline">
        Discord
      </a>
      <span mx2 op50> · </span>
      <a href="https://github.com/maru-re/maru" target="_blank" op50 hover="op100 underline">
        GitHub
      </a>
    </div>

    <div p10 flex="~ col gap-8">
      <SongsGrid v-if="!search.trimEnd() && favorited.length" :link="true" :songs="favorited" show-favorite="hover">
        <template #title>
          <div>收藏歌曲</div>
        </template>
      </SongsGrid>

      <SongsGrid v-if="!search.trimEnd() && recent.length" :link="true" :songs="recent">
        <template #title>
          <div>最近看過</div>
        </template>
      </SongsGrid>

      <SongsGrid v-if="result?.length" :link="true" :songs="result" :manage="true">
        <template #title>
          <template v-if="search.trim()">
            <span>搜尋結果</span>
            <span text-sm op50>{{ result.length }} 之 {{ collections.length }}</span>
          </template>
          <template v-else>
            <span>所有歌曲</span>
            <span text-sm op50>{{ collections.length }}</span>
          </template>
        </template>
        <!-- Tag Filter -->
        <!-- <template #title-action>
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
        </template> -->
      </SongsGrid>

      <div v-else-if="search" text-center op50>
        沒找到符合的歌曲。
      </div>
    </div>
  </div>
</template>
