<script setup lang="ts">
defineProps<{
  icon: string
}>()

const value = defineModel('modelValue', { default: true })
</script>

<template>
  <IconButton
    :icon="[icon, value ? '' : 'op20'].join(' ')"
    @click.prevent="value = !value"
  />
</template>
