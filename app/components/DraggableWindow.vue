<script setup lang="ts">
import Moveable, { type OnDrag, type OnResize, type OnResizeStart } from 'vue3-moveable'

interface Props {
  x?: number
  y?: number
  initialWidth?: number
  initialHeight?: number
  minWidth?: number
  minHeight?: number
  maxInset?: number
  resizable?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
  initialWidth: 240,
  initialHeight: 240,
  maxInset: 7,
  resizable: false,
})

const pos = readonly({
  x: props.x,
  y: props.y,
})

const dragWindow = useTemplateRef<HTMLElement>('dragWindow')
const dragHandle = useTemplateRef<HTMLElement>('dragHandle')

// #region : Draggable
const isDragging = ref(false)
function handleDrag(e: OnDrag) {
  isDragging.value = true
  e.target.style.transform = e.transform
}
// #endregion

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

onMounted(() => {
  const limitPositionDebounced = useDebounceFn(limitPosition, 250)
  useEventListener('resize', limitPositionDebounced, { passive: true })
})
// #endregion

// #region : Resizable
function handleResize(e: OnResize) {
  e.target.style.width = `${e.width}px`
  e.target.style.height = `${e.height}px`
  e.target.style.transform = e.drag.transform
}
function handleResizeStart(e: OnResizeStart) {
  e.setMin([240, 160])
}
// #endregion

// #region : Reset
function reset() {
  if (!dragWindow.value || !moveableRef.value)
    return
  dragWindow.value.style.top = ''
  dragWindow.value.style.left = ''
  dragWindow.value.style.width = ''
  dragWindow.value.style.height = ''
  dragWindow.value.style.transform = ''
  moveableRef.value.updateRect()
}
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
        '--moveable-left': `${pos.x}px`,
        '--moveable-top': `${pos.y}px`,
        '--moveable-width': `${props.initialWidth}px`,
        '--moveable-height': `${props.initialHeight}px`,
      }"
      absolute h-full w-full
      v-bind="$attrs"
    >
      <div
        ref="dragHandle"
        class="drag-handle left-50% top-0 transform-translate-x--50% transform-translate-y--100% @hover:(bg-gray/10 op100)"
        flex="~ items-center justify-center"
        draggable absolute mxa h-6 w-20 cursor-move rounded-full op25
        @dblclick.left="reset"
      >
        <div i-mdi-drag-horizontal ma text-size-xl />
      </div>
      <slot />
    </div>
    <Moveable
      ref="moveableRef"
      :target="dragWindow"
      :origin="false"
      :draggable="true"
      :drag-target="dragHandle"
      :throttle-drag="3"
      :resizable="resizable"
      :throttle-resize="3"
      :snappable="true"
      :bounds="{
        left: 7,
        right: 7,
        top: 31,
        bottom: 7,
        position: 'css',
      }"
      :style="{
        '--bounds-color': 'transparent',
        '--moveable-color': 'transparent',
        'opacity': 'var(--moveable-control-opacity, 0)',
        'transition': 'opacity .15s ease',
      }"
      @resize="handleResize"
      @resize-start="handleResizeStart"
      @drag="handleDrag"
      @drag-end="isDragging = false"
    />
  </Teleport>
</template>

<style>
.drag-window {
  left: var(--moveable-left);
  top: var(--moveable-top);
  width: var(--moveable-width);
  height: var(--moveable-height);
}
.drag-window:hover + .moveable-control-box {
  --moveable-control-opacity: 0.2;
}
.moveable-control-box:hover {
  --moveable-control-opacity: 1;
}
.moveable-control-box .moveable-control {
  background: rgba(0 0 0 / 0.5) !important;
}
</style>
