<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div>
    <div flex="~ gap-3 justify-center items-center" mb2>
      <span px1.5 py1 text-sm op50>{{ title }}</span>
    </div>
    <div flex="~ col gap-3 items-start justify-center">
      <slot />
    </div>
  </div>
</template>
