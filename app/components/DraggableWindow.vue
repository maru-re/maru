<script setup lang="ts">
import Moveable from 'vue3-moveable'

interface Props {
  x?: number
  y?: number
  maxInset?: number
  resizable?: boolean
  id: string
}
const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
  maxInset: 0,
  resizable: false,
})

// let stickRight = false
// let stickBottom = false

const dragWindow = ref<HTMLElement | null>(null)
const dragHandle = ref<HTMLElement | null>(null)
const dragContent = ref<HTMLElement | null>(null)
const isDragging = ref(false)

// const { x: dragX, y: dragY, style, isDragging } = useDraggable(dragWindow, {
//   initialValue: { x: props.x, y: props.y },
//   handle: dragHandle,
//   preventDefault: true,
//   onEnd() {
//     stickRight = false
//     stickBottom = false
//     limitPosition()
//   },
// })
// #endregion

// #region : Avoid the window stayed outside
// const { width: windowWidth, height: windowHeight } = useWindowSize()
// const dragWindowBounding = useElementBounding(dragWindow)

// function limitPosition() {
//   if (dragWindowBounding.left.value < props.maxInset) {
//     dragX.value = props.maxInset
//   }
//   else if (stickRight || dragWindowBounding.right.value > windowWidth.value - props.maxInset) {
//     dragX.value = windowWidth.value - props.maxInset - dragWindowBounding.width.value
//     stickRight = true
//   }

//   if (dragWindowBounding.top.value < props.maxInset) {
//     dragY.value = props.maxInset
//   }
//   else if (stickBottom || dragWindowBounding.bottom.value > windowHeight.value - props.maxInset) {
//     dragY.value = windowHeight.value - props.maxInset - dragWindowBounding.height.value
//     stickBottom = true
//   }
// }

// onMounted(() => {
//   const limitPositionDebounced = useDebounceFn(limitPosition, 250)
//   useEventListener('resize', limitPositionDebounced, { passive: true })
// })
// #endregion

const moveableRef = useTemplateRef<InstanceType<typeof Moveable>>('moveableRef')
</script>

<template>
  <div
    ref="dragWindow"
    class="draggable-window"
    :class="{
      'pointer-events-none': isDragging,
    }"
    fixed left-0 top-0 z-floating
  >
    <div
      ref="dragContent"
      class="drag-content"
      :style="{
        left: `${x}px`,
        top: `${y}px`,
      }"
      absolute
    >
      <div
        ref="dragHandle"
        class="drag-handle @hover:(bg-gray/10 op100)"
        flex="~ items-center justify-center"
        draggable pointer-events-auto mxa w-20 cursor-move rounded-full op25
      >
        <div i-mdi-drag-horizontal ma text-size-xl />
      </div>
      <slot />
    </div>
    <Moveable
      ref="moveableRef"
      :draggable="true"
      :target="dragContent"
      :drag-target="dragHandle"
      :origin="false"
      @drag="e => e.target.style.transform = e.transform"
      @drag-start="isDragging = true"
      @drag-end="isDragging = false"
    />
  </div>
</template>
