<script setup lang="ts">
defineProps<{
  icon?: string
  color?: string
}>()
</script>

<template>
  <button
    :class="color || 'btn-simple-primary'"
    px2.5 py2 line-height-1em shadow
  >
    <div v-if="icon" :class="icon" />
    <slot />
  </button>
</template>
