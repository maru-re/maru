<script setup lang="ts">
const props = defineProps<{
  max?: number
  min?: number
  step?: number
}>()

const emit = defineEmits<{
  (name: 'next', e?: KeyboardEvent): void
}>()

const input = ref<HTMLInputElement>()
const value = defineModel('modelValue', {
  type: Number,
  default: 0,
})

const digits = computed(() => (props.max || 99).toString().length)
const valueDigits = computed(() => value.value.toString().length)
const placeholder = computed(() => '0'.repeat(Math.max(0, digits.value - valueDigits.value)) + ' '.repeat(valueDigits.value))

function focus(e?: KeyboardEvent) {
  if (!input.value)
    return
  input.value.focus()
  input.value.type = 'text'
  input.value.setSelectionRange(0, input.value.value.toString().length)
  input.value.type = 'number'
  if (e) {
    input.value.dispatchEvent(
      new KeyboardEvent('keydown', {
        code: e.code,
        key: e.key,
      }),
    )
  }
}

defineExpose({ focus })

function onKeyDown(e: KeyboardEvent) {
  if (' .,:'.includes(e.key)) {
    e.preventDefault()
    input.value?.blur()
    emit('next')
  }
  if (!input.value)
    return
  if (
    valueDigits.value >= digits.value
    && e.code !== 'Backspace'
    && input.value.selectionEnd === input.value.selectionStart
    && input.value.selectionEnd === input.value.toString().length
  ) {
    e.preventDefault()
    input.value.blur()
    emit('next', e)
  }
}
</script>

<template>
  <div border="~ transparent rounded" focus-within="border-base" relative>
    <input
      ref="input"
      v-model="value"
      type="number"
      :min="min"
      :max="max"
      :style="{ width: `${digits / 1.5}em` }"
      bg-transparent
      p0 text-right outline-none @keydown="onKeyDown"
    >
    <pre pointer-events-none absolute inset-0 text-right font-mono op30 v-text="placeholder" />
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
