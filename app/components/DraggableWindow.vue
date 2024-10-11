<script setup lang="ts">
const window = ref<HTMLElement | null>(null)
const handle = ref<HTMLElement | null>(null)

const { width } = useWindowSize()
const { style } = useDraggable(window, {
  initialValue: { x: width.value - 32 - 480, y: 60 },
  handle,
  preventDefault: true,
})
</script>

<template>
  <div
    ref="window"
    class="draggable-window"
    fixed
    :style
    z-floating
  >
    <div
      ref="handle"
      draggable
      i-mdi-drag-horizontal
      mxa h-8 w-15 cursor-move text-size-lg
    />
    <slot />
  </div>
</template>

<style lang="scss" scoped>

</style>
