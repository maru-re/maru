<script setup lang="ts">
import type { MaruSongData } from '@marure/schema'
import { compressToEncodedURIComponent } from 'lz-string'
import { renderSVG } from 'uqr'

const props = defineProps<{
  data: MaruSongData
}>()

const url = computed(() => {
  // TODO: data format more efficient than JSON
  return `${location.origin}/import?data=${compressToEncodedURIComponent(JSON.stringify(props.data))}`
})

const svg = computed(() => renderSVG(url.value))
</script>

<template>
  <div v-html="svg" />
</template>
