<script setup lang="ts">
import { secondsToTimestamp, timestampToSeconds } from '@marure/parser'
import { Tooltip } from 'floating-vue'

const props = defineProps<{
  inputClass?: string
  currentTime?: number
}>()

const emit = defineEmits<{
  (event: 'go', autoPlay: boolean): void
  (event: 'next'): void
}>()

const modelValue = defineModel('modelValue', {
  type: Number,
  default: 0,
})

const editor = useEditorContext()

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

function adjustTime(delta: 0.1 | -0.1) {
  modelValue.value += delta
  emit('go', false)
}

function setToCurrentTime(emitNext = editor.value.goNextAfterSetCurrentTimestemp) {
  if (props.currentTime !== undefined) {
    modelValue.value = props.currentTime
    if (emitNext) {
      nextTick(() => emit('next'))
    }
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    adjustTime(-0.1)
  }
  else if (e.key === 'ArrowDown') {
    e.preventDefault()
    adjustTime(0.1)
  }
  else if (e.key === 'Escape') {
    e.preventDefault()
    input.value?.blur()
  }
  else if (e.key === 'Enter') {
    e.preventDefault()
    emit('next')
  }
  else if (e.code === 'KeyT') {
    e.preventDefault()
    setToCurrentTime()
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
      @click="emit('go', true)"
    />
    <input
      ref="input"
      class="timestamp-input peer"
      :value="timestamp"
      placeholder="00:00.00"
      w-full flex-auto py1 pr2 text-right font-mono box-input-inner
      @input="onInput"
      @keydown="onKeydown"
      @blur="onBlur"
    >
    <div border="~ base" flex="items-center gap-0.5" absolute right-0 top--8.5 z-0 hidden h-8 rounded-lg px-2 peer-focus-flex bg-base>
      <Tooltip>
        <IconButton icon="i-uil:step-backward" text-sm @click="adjustTime(-0.1)" @pointerdown.prevent />
        <template #popper>
          <div flex="~ items-center">
            往前微調時間<kbd kbd-key ml2><div i-uil-arrow-up mx--1 /></kbd>
          </div>
        </template>
      </Tooltip>

      <Tooltip>
        <IconButton icon="i-uil:skip-forward" text-sm @click="adjustTime(0.1)" @pointerdown.prevent />
        <template #popper>
          <div flex="~ items-center">
            往後微調時間<kbd kbd-key ml2><div i-uil-arrow-down mx--1 /></kbd>
          </div>
        </template>
      </Tooltip>

      <div h-20px w-1px border-r border-t-0 border-base />

      <Tooltip>
        <IconButton icon="i-uil:clock" text-sm @click="setToCurrentTime()" @pointerdown.prevent />
        <template #popper>
          <div flex="~ items-center">
            設為當前播放時間<kbd kbd-key ml2>T</kbd>
          </div>
        </template>
      </Tooltip>

      <Tooltip>
        <IconToggle v-model="editor.goNextAfterSetCurrentTimestemp" icon="i-uil:enter" text-sm active-class="text-green" @pointerdown.prevent />
        <template #popper>
          設為當前播放時間後，是否自動跳到下一個時間戳
        </template>
      </Tooltip>
    </div>
    <slot />
  </div>
</template>
