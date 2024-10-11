<script setup lang="ts">
import { NuxtLink } from '#components'

defineProps<{
  icon: string
  title?: string
  to?: string
}>()
</script>

<template>
  <component
    :is="to ? NuxtLink : 'button'"
    v-tooltip="title"
    :to="to"
    aspect-ratio-1 flex-none rounded-full p1
    :title="title"
    class="icon-button"
  >
    <slot>
      <div :class="icon" />
    </slot>
  </component>
</template>

<style>
.icon-button {
  --uno: 'hover:bg-primary:15 hover:color-primary dark:hover:bg-primary:30';
}
</style>
