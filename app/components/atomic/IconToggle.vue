<script setup lang="ts">
defineProps<{
  icon: string
  activeClass?: string
}>()

const value = defineModel('modelValue', { default: true })
</script>

<template>
  <IconButton
    :icon="[icon, value ? activeClass : 'op20'].join(' ')"
    @click.prevent="value = !value"
  />
</template>
