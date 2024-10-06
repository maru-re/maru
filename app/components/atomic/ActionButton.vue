<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'icon' | 'button' | 'toggle'
    title?: string
    icon: string
  }>(),
  {
    type: 'icon',
  },
)

const toggleActive = defineModel<boolean>('active')
</script>

<template>
  <SimpleButton
    v-if="props.type === 'button'"
    v-bind="props"
  />
  <IconButton
    v-else-if="props.type === 'icon'"
    v-bind="props"
  />
  <IconToggle
    v-else-if="props.type === 'toggle'"
    v-bind="props"
    v-model="toggleActive"
  />
</template>
