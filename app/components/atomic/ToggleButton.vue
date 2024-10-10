<script setup lang="ts">
const props = defineProps<{
  icon?: string
  color?: string
  title?: string
  to?: string
}>()

const value = defineModel<boolean>('modelValue')
</script>

<template>
  <SimpleButton
    v-bind="props"
    :class="value ? 'text-primary' : 'op75 text-hex-888'"
    @click="value = !value"
  >
    <span>{{ title }}</span>
    <div
      v-if="value"
      absolute right--0.75 top--0.75 h-2 w-2 border border-primary rounded-full bg-primary:50
    />
  </SimpleButton>
</template>
