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

const { style, isDragging } = useDraggable(window, {
  initialValue: { x: props.x, y: props.y },
  handle,
  preventDefault: true,
})
</script>

<template>
  <div
    ref="window"
    class="draggable-window"
    :class="{
      'pointer-events-none': isDragging,
    }"
    fixed
    :style
    z-floating
  >
    <div
      ref="handle"
      hover="op100 bg-gray/10"
      flex="~ items-center justify-center"
      draggable pointer-events-auto mxa w-20 cursor-move rounded-full op25
    >
      <div i-mdi-drag-horizontal ma text-size-xl />
    </div>
    <slot />
  </div>
</template>
