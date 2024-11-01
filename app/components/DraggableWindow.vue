<script setup lang="ts">
import Moveable, { type OnDragEnd, type OnDragStart } from 'vue3-moveable'

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

const posX = ref(props.x)
const posY = ref(props.y)

const dragWindow = ref<HTMLElement | null>(null)
const dragHandle = ref<HTMLElement | null>(null)
const isDragging = ref(false)

// #region : Avoid the window stayed outside
const moveableRef = useTemplateRef<InstanceType<typeof Moveable>>('moveableRef')

const { width: windowWidth, height: windowHeight } = useWindowSize()
const dragWindowBounding = useElementBounding(dragWindow)

function limitPosition() {
  let x = dragWindowBounding.left.value
  let y = dragWindowBounding.top.value
  if (dragWindowBounding.left.value < props.maxInset) {
    x = props.maxInset
  }
  else if (dragWindowBounding.right.value > windowWidth.value - props.maxInset) {
    x = Math.max(windowWidth.value - props.maxInset - dragWindowBounding.width.value, 0)
  }

  if (dragWindowBounding.top.value < props.maxInset) {
    y = props.maxInset
  }
  else if (dragWindowBounding.bottom.value > windowHeight.value - props.maxInset) {
    y = Math.max(windowHeight.value - props.maxInset - dragWindowBounding.height.value, 0)
  }
  moveableRef.value?.request('draggable', { x, y }, true)
}

function handleDragStart() {
  isDragging.value = true
}
function handleDragEnd() {
  isDragging.value = false
}

onMounted(() => {
  const limitPositionDebounced = useDebounceFn(limitPosition, 250)
  useEventListener('resize', limitPositionDebounced, { passive: true })
})
// #endregion
</script>

<template>
  <Teleport to="body">
    <div
      ref="dragWindow"
      class="drag-window"
      :class="{
        'pointer-events-none': isDragging,
        'pointer-events-auto': !isDragging,
      }"
      :style="{
        left: `${posX}px`,
        top: `${posY}px`,
      }"
      absolute
    >
      <div
        ref="dragHandle"
        class="drag-handle @hover:(bg-gray/10 op100)"
        flex="~ items-center justify-center"
        draggable mxa w-20 cursor-move rounded-full op25
      >
        <div i-mdi-drag-horizontal ma text-size-xl />
      </div>
      <slot />
    </div>
    <Moveable
      ref="moveableRef"
      :draggable="true"
      :snappable="true"
      :target="dragWindow"
      :drag-target="dragHandle"
      :throttle-drag="3"
      :origin="false"
      :bounds="{
        left: 1,
        right: 1,
        top: 1,
        bottom: 1,
        position: 'css',
      }"
      @drag="e => e.target.style.transform = e.transform"
      @drag-start="handleDragStart"
      @drag-end="handleDragEnd"
    />
  </Teleport>
</template>
