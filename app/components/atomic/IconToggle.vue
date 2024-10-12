<script setup lang="ts">
defineProps<{
  icon: string
  activeClass?: string
}>()

const value = defineModel('modelValue', { default: true })
</script>

<template>
  <IconButton
    class="icon-toggle"
    :class="[
      { active: value },
      activeClass ? { [activeClass]: value } : null,
    ]"
    :icon
    @click.prevent="value = !value"
  />
</template>

<style>
.icon-toggle {
  --uno: 'op40 hover:op100 hover:color-inherit';
}
.icon-toggle.active {
  --uno: 'color-primary op100';
}
</style>
