<script setup lang="ts">
defineProps<{
  label?: string
}>()

const modelValue = defineModel<string>('modelValue')

const inputClass = 'min-h-400 box-input'
const editorEl = useTemplateRef('editor')

const isSupported = getSupported()
if (isSupported) {
  usePlainShiki(editorEl, {
    lang: 'lyric' as any,
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  })
}

function updateModelValue() {
  modelValue.value = editorEl.value?.textContent ?? ''
}

function getSupported() {
  try {
    const el = document.createElement('div')
    el.contentEditable = 'plaintext-only'
    return true
  }
  catch {
    return false
  }
}
</script>

<template>
  <label flex="~ col gap-1">
    <span v-if="label" op75>{{ label }}</span>
    <div
      v-if="isSupported"
      ref="editor"
      :class="inputClass"
      contenteditable="plaintext-only"
      @input="updateModelValue"
      v-text="modelValue"
    />
    <textarea
      v-else
      v-model="modelValue"
      :class="inputClass"
      :placeholder="label"
    />
  </label>
</template>
