<script setup lang="ts">
const props = defineProps<{
  label?: string
  type?: 'input' | 'textarea'
  inputClass?: string
}>()

const modelValue = defineModel<string>('modelValue')
</script>

<template>
  <label flex="~ col gap-1">
    <span op75>{{ props.label }}</span>
    <textarea
      v-if="props.type === 'textarea'"
      v-model="modelValue"
      :placeholder="props.label"
      box-input
      :class="inputClass"
    />
    <input
      v-else
      v-model="modelValue"
      :placeholder="props.label"
      box-input
      :class="inputClass"
    >
  </label>
</template>
