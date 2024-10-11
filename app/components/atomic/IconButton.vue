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
    hover:bg-hex-8883
    :title="title"
  >
    <slot>
      <span :class="icon" />
    </slot>
  </component>
</template>
