<script setup lang="ts">
import { appName } from '~/constants'
import data from '../samples/sample-1'

useSeoMeta({
  title: () => `Demo | 唱歌學日語 | ${appName}`,
})
</script>

<template>
  <SongPlay :data="data" />
</template>
