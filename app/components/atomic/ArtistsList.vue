<script setup lang="ts">
defineProps<{
  artists?: string[]
}>()
</script>

<template>
  <div font-jp-serif op50>
    <template v-for="a, idx in artists" :key="a">
      <span v-if="idx" mr-1 op50>,</span>
      <NuxtLink :to="`/?s=${encodeURIComponent(a)}`">
        {{ a }}
      </NuxtLink>
    </template>
  </div>
</template>
