<script setup lang="ts">
const props = defineProps<{
  label?: string
  type?: 'input' | 'textarea'
  inputClass?: string
  disabled?: boolean
}>()

const modelValue = defineModel<string>('modelValue')
</script>

<template>
  <label flex="~ col gap-1">
    <span v-if="props.label" op75>{{ props.label }}</span>
    <textarea
      v-if="props.type === 'textarea'"
      v-model="modelValue"
      :placeholder="props.label"
      box-input
      :class="inputClass"
      :disabled
    />
    <input
      v-else
      v-model="modelValue"
      :placeholder="props.label"
      box-input
      :class="inputClass"
      :disabled
    >
  </label>
</template>
