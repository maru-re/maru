<script setup lang="ts">
import { NuxtLink } from '#components'

defineProps<{
  icon: string
  to?: string
}>()
</script>

<template>
  <component
    :is="to ? NuxtLink : 'button'" :to="to"
    aspect-ratio-1 flex-none rounded-full p1 hover:bg-hex-8883
  >
    <div :class="icon" />
  </component>
</template>
