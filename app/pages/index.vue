<script setup lang="ts">
import Fuse from 'fuse.js'
import SongsGrid from '~/components/SongsGrid.vue'

const {
  recentIds,
  favoriteIds,
  collections,
} = useCollections()

const hash = useRouteHash()
const rawSearch = ref(String(hash.value.s || ''))
const search = useDebounce(rawSearch, 300)
const searchEl = ref<HTMLInputElement | null>(null)
const searchAnchorEl = ref<HTMLDivElement | null>(null)

const fuse = computed(() => new Fuse(collections.value, {
  keys: ['title', 'artists', 'tags'],
  includeScore: true,
  threshold: 0.4,
}))

watch(
  () => hash.value.s,
  () => {
    const str = String(hash.value.s || '')
    if (str !== search.value && str !== rawSearch.value)
      rawSearch.value = str
  },
  { flush: 'sync' },
)

watch(
  search,
  () => {
    const { pathname, search: query } = window.location
    const searchText = search.value ? `#s=${search.value}` : `${pathname}${query}`
    history.replaceState({}, '', `${searchText}`)
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

const scrollToSearchResult = useDebounceFn(() => searchAnchorEl.value?.scrollIntoView({
  behavior: 'smooth',
  block: 'start',
}), 300)

onMounted(() => {
  if (search.value)
    scrollToSearchResult()
})
</script>

<template>
  <div p4>
    <FloatingActions />
    <DropZone />
    <ImportDialog />
    <SettingsDialog />
    <div flex="~ col gap-2 items-center" pb-10 pt-25 lt-md="pt-10 pb-5">
      <div i-mdi-circle-double text-5xl op75 />
      <div text-4xl font-jp-serif>
        <ruby>
          <rb>{{ $t("appname") }}</rb>
          <rt>にじゅうまる</rt>
        </ruby>
      </div>
      <div mt5 text-center op75>
        {{ $t("intro.title") }}
      </div>
      <div text-center op50>
        {{ $t("intro.description") }}
      </div>

      <div p5 flex="~ col gap-2 items-center justify-center">
        <div
          border="~ dashed #888 rounded-2"
          flex="~ gap-2 items-center"
          relative px4 py2 op50
          class="@hover:(border-primary bg-primary/5 text-primary op100)"
        >
          <div i-uil-file-plus-alt />
          <span>{{ $t("import.importFile") }}</span>
          <input
            type="file"
            :accept="SUPPORTED_IMPORT_EXT.map(ext => `.${ext}`).join(', ')"
            multiple
            absolute inset-0 h-full w-full cursor-pointer opacity-0
            @change="onFileChange"
          >
        </div>
        <div flex="~ justify-center wrap">
          <NuxtLink to="/play#demo=1" op50 class="@hover:(color-primary underline op100)">
            {{ $t("demo.title") }}
          </NuxtLink>
          <span mx2 op50 lt-md="hidden"> · </span>
          <NuxtLink to="/create" op50 class="@hover:(color-primary underline op100)" lt-md="hidden">
            {{ $t("lyrics.createLyrics") }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div flex="~ gap-1 items-center" mxa mb2 max-w-full w-max rounded-full bg-orange:10 px3 py1 text-wrap text-sm text-orange>
      <div i-uil-flask flex-none text-base />
      {{ $t("messages.wip") }}
    </div>
    <div v-if="collections.length > 0" sticky left-0 right-0 top-0 z-search flex py3>
      <div
        flex="~ gap-3 items-center"
        z-search ma h-3em max-w-100 w-full of-hidden px3 floating-glass
      >
        <div i-uil-search text-lg op25 />
        <input
          ref="searchEl"
          v-model="rawSearch"
          type="text"
          :placeholder="$t('search.searchImportedSong', [collections.length])"
          class="placeholder-hex-888"
          absolute inset-0 w-auto bg-transparent p5 px10 outline-none
          @keydown="scrollToSearchResult()"
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
      <NuxtLink to="/format" op50 class="@hover:(color-primary underline op100)">
        {{ $t("footer.fileFormat") }}
      </NuxtLink>
      <span mx2 op50> · </span>
      <NuxtLink to="/about" op50 class="@hover:(color-primary underline op100)">
        {{ $t("footer.about") }}
      </NuxtLink>
      <span mx2 op50> · </span>
      <a href="https://chat.maru.re" target="_blank" op50 class="@hover:(color-primary underline op100)">
        {{ $t("footer.contact.discord") }}
      </a>
      <span mx2 op50> · </span>
      <a href="https://github.com/maru-re/maru" target="_blank" op50 class="@hover:(color-primary underline op100)">
        {{ $t("footer.contact.github") }}
      </a>
    </div>

    <div ref="searchAnchorEl" mb8 />

    <div flex="~ col gap-8" min-h-100dvh p10>
      <SongsGrid v-if="!search.trimEnd() && favorited.length" :link="true" :songs="favorited" show-favorite="hover">
        <template #title>
          <div>{{ $t("actions.favorite") }}</div>
        </template>
      </SongsGrid>

      <SongsGrid v-if="!search.trimEnd() && recent.length" :link="true" :songs="recent">
        <template #title>
          <div>{{ $t("titles.recentSongs") }}</div>
        </template>
      </SongsGrid>

      <SongsGrid v-if="result?.length" :link="true" :songs="result" :manage="true">
        <template #title>
          <template v-if="search.trim()">
            <span>{{ $t("search.searchResult") }}</span>
            <span text-sm op50>{{ $t("search.searchResultCount", { resultLength: result.length, collectionsLength: collections.length }) }}</span>
          </template>
          <template v-else>
            <span>{{ $t('titles.allSong') }}</span>
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
        {{ $t("search.noResult") }}
      </div>
    </div>
  </div>
</template>
