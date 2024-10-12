<script setup lang="ts">
interface Props {
  x?: number
  y?: number
  maxInset?: number
}
const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
  maxInset: 0,
})

const dragWindow = ref<HTMLElement | null>(null)
const dragHandle = ref<HTMLElement | null>(null)

const { x: dragX, y: dragY, style, isDragging } = useDraggable(dragWindow, {
  initialValue: { x: props.x, y: props.y },
  handle: dragHandle,
  preventDefault: true,
  onEnd: limitPosition,
})
// #endregion

// #region : Avoid the window stayed outside
const { width: windowWidth, height: windowHeight } = useWindowSize()
const dragWindowBounding = useElementBounding(dragWindow)

function limitPosition() {
  if (dragWindowBounding.left.value < props.maxInset) {
    dragX.value = props.maxInset
  }
  else if (dragWindowBounding.right.value > (windowWidth.value - props.maxInset)) {
    dragX.value = windowWidth.value - props.maxInset - dragWindowBounding.width.value
  }

  if (dragWindowBounding.top.value < props.maxInset) {
    dragY.value = props.maxInset
  }
  else if (dragWindowBounding.bottom.value > (windowHeight.value - props.maxInset)) {
    dragY.value = windowHeight.value - props.maxInset - dragWindowBounding.height.value
  }
}

onMounted(() => {
  const limitPositionDebounced = useDebounceFn(() => limitPosition(), 250)
  useEventListener('resize', () => limitPositionDebounced())
})
// #endregion
</script>

<template>
  <div
    ref="dragWindow"
    class="draggable-window"
    :class="{
      'pointer-events-none': isDragging,
    }"
    fixed
    :style
    z-floating
  >
    <div
      ref="dragHandle"
      hover="op100 bg-gray/10"
      flex="~ items-center justify-center"
      draggable pointer-events-auto mxa w-20 cursor-move rounded-full op25
    >
      <div i-mdi-drag-horizontal ma text-size-xl />
    </div>
    <slot />
  </div>
</template>
