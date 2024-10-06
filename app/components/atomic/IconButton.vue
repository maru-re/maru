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
    :is="to ? NuxtLink : 'button'" :to="to"
    aspect-ratio-1 flex-none v-tooltip="title" rounded-full p1
    hover:bg-hex-8883
    :title="title"
  >
    <div :class="icon" />
  </component>
</template>
