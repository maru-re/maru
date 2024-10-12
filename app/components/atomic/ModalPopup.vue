<script setup lang='ts'>
const props = withDefaults(defineProps<{
  direction?: string
  mask?: boolean
  dialogClass?: string
  closable?: boolean
  useVIf?: boolean
}>(), {
  direction: 'bottom',
  mask: true,
  closable: true,
  useVIf: false,
})

const emit = defineEmits(['clickOutside'])
const modelValue = defineModel<boolean>('modelValue')

function onClickEmptySpace() {
  if (props.closable) {
    modelValue.value = false
  }
  emit('clickOutside')
}

const positionClass = computed(() => {
  switch (props.direction) {
    case 'bottom':
      return 'bottom-0 left-0 right-0 border-t'
    case 'top':
      return 'top-0 left-0 right-0 border-b'
    case 'left':
      return 'bottom-0 left-0 top-0 border-r w-max'
    case 'right':
      return 'bottom-0 top-0 right-0 border-l w-max'
    default:
      return ''
  }
})

const containerPositionClass = computed(() => {
  if (props.mask)
    return 'bottom-0 left-0 right-0 top-0'
  switch (props.direction) {
    case 'bottom':
      return 'bottom-0 left-0 right-0'
    case 'top':
      return 'top-0 left-0 right-0'
    case 'left':
      return 'bottom-0 left-0 top-0'
    case 'right':
      return 'bottom-0 top-0 right-0'
    default:
      return ''
  }
})

const transform = computed(() => {
  switch (props.direction) {
    case 'bottom':
      return 'translateY(100%)'
    case 'top':
      return 'translateY(-100%)'
    case 'left':
      return 'translateX(-100%)'
    case 'right':
      return 'translateX(100%)'
    default:
      return ''
  }
})

const enable = ref(false)
watch(() => modelValue.value, async (value) => {
  if (!value) {
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  enable.value = !!value
})

const show = ref(false)
watch(() => modelValue.value, async (value) => {
  if (value) {
    await new Promise(resolve => setTimeout(resolve))
  }
  show.value = !!value
})
</script>

<template>
  <div
    v-if="!useVIf || enable"
    fixed z-dialog
    :class="[containerPositionClass, show ? '' : 'pointer-events-none']"
  >
    <div
      v-if="mask"
      class="absolute bottom-0 left-0 right-0 top-0 transition-opacity duration-500 ease-out bg-base"
      :class="show ? 'opacity-50' : 'opacity-0'"
      @click="onClickEmptySpace()"
    />
    <div
      class="scrolls absolute max-h-screen max-w-screen overflow-auto border-base transition-all duration-200 ease-out bg-base"
      :class="[positionClass, dialogClass]"
      :style="show ? {} : { transform }"
    >
      <slot />
    </div>
  </div>
</template>
