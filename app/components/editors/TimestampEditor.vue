<script setup lang="ts">
import { secondsToTimestamp, timestampToSeconds } from '@marure/parser'
import { Tooltip } from 'floating-vue'

const props = withDefaults(defineProps<{
  inputClass?: string
  currentTime?: number
  offset?: number
}>(), {
  offset: 0,
})

const emit = defineEmits<{
  (event: 'go', autoPlay: boolean): void
  (event: 'next'): void
}>()

const modelValue = defineModel('modelValue', {
  type: Number,
  default: 0,
})

const invalid = ref(false)
const input = ref<HTMLInputElement>()

const timestamp = ref(secondsToTimestamp(modelValue.value))

const { shift } = useMagicKeys()

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

function setToCurrentTime(emitNext = !(shift?.value)) {
  if (props.currentTime !== undefined) {
    modelValue.value = props.currentTime - props.offset
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
    <div
      border="~ base" flex="items-center gap-0.5"
      absolute left-0 top--9.5 z-0 hidden h-8 px1 floating-glass peer-focus-flex
    >
      <Tooltip>
        <IconButton icon="i-uil-angle-double-left" text-sm @click="adjustTime(-0.1)" @pointerdown.prevent />
        <template #popper>
          <div flex="~ items-center">
            {{ $t('editor.timestamp.stepBackward') }} <kbd ml2 kbd-key><div i-uil-arrow-up mx--1 /></kbd>
          </div>
        </template>
      </Tooltip>

      <Tooltip>
        <IconButton icon="i-uil-angle-double-right" text-sm @click="adjustTime(0.1)" @pointerdown.prevent />
        <template #popper>
          <div flex="~ items-center">
            {{ $t('editor.timestamp.skipForward') }} <kbd ml2 kbd-key><div i-uil-arrow-down mx--1 /></kbd>
          </div>
        </template>
      </Tooltip>

      <div h-20px w-1px border-r border-t-0 border-base />

      <Tooltip>
        <IconButton icon="i-uil:clock" text-sm @click="setToCurrentTime()" @pointerdown.prevent />
        <template #popper>
          <div space-y-1>
            <div flex="~ items-center" :class="!shift && 'op40'">
              {{ $t('editor.timestamp.setCurrentTimeOnly') }}
              <kbd ml2 kbd-key><div i-ph-arrow-fat-up h-1lh text-2.5 /></kbd>
              <kbd ml1 kbd-key>T<span mx-1>/</span><div i-ph-mouse-left-click-fill h-1lh text-2.5 /></kbd>
            </div>
            <div flex="~ items-center" :class="shift && 'op40'">
              {{ $t('editor.timestamp.setCurrentTime') }} <kbd ml2 kbd-key>T</kbd>
            </div>
          </div>
        </template>
      </Tooltip>
    </div>
    <slot />
  </div>
</template>
