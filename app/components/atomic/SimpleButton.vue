<script setup lang="ts">
import { NuxtLink } from '#components'

defineProps<{
  icon?: string
  color?: string
  title?: string
  to?: string
}>()
</script>

<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    :class="color || 'btn-simple-primary'"
    px2.5 py2 line-height-1em shadow
  >
    <div v-if="icon" :class="icon" />
    <slot>
      {{ title }}
    </slot>
  </component>
</template>
