<script setup lang="ts">
import { secondsToTimestamp, timestampToSeconds } from '@marure/parser'

const modelValue = defineModel('modelValue', {
  type: Number,
  default: 0,
})

const invalid = ref(false)

const _text = ref(secondsToTimestamp(modelValue.value))

const data = computed({
  get() {
    return _text.value
  },
  set(v) {
    _text.value = v
    const seconds = timestampToSeconds(v)
    if (!Number.isNaN(seconds)) {
      invalid.value = false
      modelValue.value = seconds
      _text.value = secondsToTimestamp(seconds)
    }
    else {
      invalid.value = true
    }
  },
})

const input = ref<HTMLInputElement>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    input.value?.blur()
  }
}
</script>

<template>
  <input
    ref="input"
    v-model="data"
    placeholder="00:00.00"
    w-25 text-right font-mono box-input
    :class="invalid ? 'border-red text-red' : ''"
    @keydown="onKeydown"
  >
</template>
