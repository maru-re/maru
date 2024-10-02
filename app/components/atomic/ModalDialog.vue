<script setup lang="ts">
const props = defineProps<{
  closable?: boolean
  dialogClass?: string
}>()

const emit = defineEmits(['clickOutside'])
const value = defineModel<boolean>('modelValue')
function onClickEmptySpace() {
  if (props.closable) {
    value.value = false
  }
  emit('clickOutside')
}
</script>

<template>
  <div
    v-show="value"
    class="fixed inset-0 z-dialog bg-black bg-opacity-50 backdrop-blur-5"
    @click="onClickEmptySpace()"
  >
    <div fixed inset-0 flex items-center justify-center p10>
      <div
        class="max-h-80vh w-full of-auto rounded-lg p-6 floating-glass bg-base"
        :class="dialogClass"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
