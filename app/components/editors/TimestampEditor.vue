<script setup lang="ts">
import { secondsToTimestamp } from '@marure/parser'

const modelValue = defineModel('modelValue', {
  type: Number,
  default: 0,
})

const minute = ref(0)
const second = ref(0)
const microsecond = ref(0)

watch(
  modelValue,
  () => {
    const value = secondsToTimestamp(modelValue.value).split(/[.:]/g)
    minute.value = Number(value[0])
    second.value = Number(value[1])
    microsecond.value = Number(value[2])
  },
  { immediate: true },
)

const inputM = ref<any>()
const inputS = ref<any>()
const inputMS = ref<any>()

const inputs = [
  inputM,
  inputS,
  inputMS,
]

function focusNext(idx: number, e: KeyboardEvent) {
  const input = inputs[idx]
  input?.value?.focus(e)
}
</script>

<template>
  <div flex="~" h-max w-max font-mono box-input>
    <DigitInput ref="inputM" v-model="minute" :min="0" :step="1" :max="60" @next="(e: any) => focusNext(1, e)" />
    <span op50>:</span>
    <DigitInput ref="inputS" v-model="second" :min="0" :step="1" :max="60" @next="(e: any) => focusNext(2, e)" />
    <span op50>.</span>
    <DigitInput ref="inputMS" v-model="microsecond" :min="0" :step="1" :max="9999" />
  </div>
</template>
