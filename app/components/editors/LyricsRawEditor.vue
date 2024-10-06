<script setup lang="ts">
const props = defineProps<{
  label?: string
  type?: 'text' | 'textarea'
  inputClass?: string
  lang?: 'lyric' | 'lyric-inline'
}>()

const modelValue = defineModel<string>('modelValue')

const sharedClass = 'box-input font-mono'
const editor = useTemplateRef<HTMLDivElement>('editor')
const text = ref(modelValue.value)

const isSupported = getSupported()
if (isSupported) {
  usePlainShiki(editor, {
    lang: props.lang ?? 'lyric',
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
      role="input"
      p2
      :class="[sharedClass, inputClass]"
      contenteditable="plaintext-only"
      @input="updateModelValue"
      v-text="text"
    />
    <textarea
      v-else
      v-model="modelValue"
      :class="[sharedClass, inputClass]"
      :placeholder="label"
    />
  </label>
</template>
