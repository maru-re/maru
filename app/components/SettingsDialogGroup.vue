<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div>
    <div flex="~ gap-3 justify-center items-center" mb2>
      <div border="t base" h-1px w-15 />
      <span text-sm op50>{{ title }}</span>
      <div border="t base" h-1px w-15 />
    </div>
    <div flex="~ gap-3 wrap items-center justify-center">
      <slot />
    </div>
  </div>
</template>
