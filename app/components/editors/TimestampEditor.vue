<script setup lang="ts">
import { secondsToTimestamp, timestampToSeconds } from '@marure/parser'

defineProps<{
  inputClass?: string
}>()

const emit = defineEmits<{
  (event: 'go'): void
}>()

const modelValue = defineModel('modelValue', {
  type: Number,
  default: 0,
})

const invalid = ref(false)
const input = ref<HTMLInputElement>()

const timestamp = ref(secondsToTimestamp(modelValue.value))

watchEffect(() => {
  timestamp.value = secondsToTimestamp(modelValue.value)
})

function onBlur() {
  try {
    modelValue.value = timestampToSeconds(timestamp.value)
  }
  catch {}
  timestamp.value = secondsToTimestamp(modelValue.value)
  invalid.value = false
}

function onInput() {
  timestamp.value = input.value!.value as string
  try {
    timestampToSeconds(timestamp.value)
    invalid.value = false
  }
  catch {
    invalid.value = true
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    modelValue.value -= 0.1
  }
  else if (e.key === 'ArrowDown') {
    e.preventDefault()
    modelValue.value += 0.1
  }
  else if (e.key === 'Enter' || e.key === 'Escape') {
    e.preventDefault()
    input.value?.blur()
  }
}
</script>

<template>
  <div
    relative pl0.5 box-input-shell
    :class="[invalid ? 'border-red! text-red!' : '']"
    flex="~ items-center"
  >
    <IconButton
      icon="i-uil:play"
      tabindex="-1" h-max op50 hover="op100"
      @click="emit('go')"
    />
    <input
      ref="input"
      :value="timestamp"
      placeholder="00:00.00"
      w-full flex-auto py1 pr2 text-right font-mono box-input-inner
      @input="onInput"
      @keydown="onKeydown"
      @blur="onBlur"
    >
    <slot />
  </div>
</template>
