<script setup lang="ts">
defineProps<{
  label?: string
}>()

const modelValue = defineModel<string>('modelValue')

const inputClass = 'min-h-400 box-input'
const editor = useTemplateRef<HTMLDivElement>('editor')
const text = ref(modelValue.value)

const isSupported = getSupported()
if (isSupported) {
  usePlainShiki(editor, {
    lang: 'lyric' as any,
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  })
}

function updateModelValue() {
  modelValue.value = editor.value?.textContent ?? ''
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
      font-mono
      :class="inputClass"
      contenteditable="plaintext-only"
      @input="updateModelValue"
      v-text="text"
    />
    <textarea
      v-else
      v-model="modelValue"
      font-mono
      :class="inputClass"
      :placeholder="label"
    />
  </label>
</template>
