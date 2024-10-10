<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'
import { version } from '../../package.json'

const data = useRuntimeConfig().public
const timeAgo = formatTimeAgo(new Date(data.buildTime))
</script>

<template>
  <div border="t base" my4 h-1px w-30px />
  <div>
    maru.re
    <span mx1 font-mono>v{{ version }}</span>
    (<a font-mono :href="`https://github.com/maru-re/maru/commit/${data.sha}`" target="_blank">{{ data.sha.slice(0, 7) }}</a>)
    <br>
    <span op75>built at</span> {{ timeAgo }}
  </div>
</template>
