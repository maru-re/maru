<script setup lang="ts">
interface Props {
  x?: number
  y?: number
}
const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
})
const window = ref<HTMLElement | null>(null)
const handle = ref<HTMLElement | null>(null)

const { style } = useDraggable(window, {
  initialValue: { x: props.x, y: props.y },
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
