<script setup lang="ts">
const props = defineProps<{
  type?: 'text' | 'textarea'
  inputClass?: string
  lang?: 'lyric' | 'lyric-inline' | 'yaml'
}>()

const modelValue = defineModel<string>('modelValue')

const sharedClass = 'box-input font-mono'
const editor = useTemplateRef<HTMLDivElement>('editor')
const container = useTemplateRef<HTMLLabelElement>('container')
const text = ref(modelValue.value)
const revision = ref(0)

const updatePaused = ref(false)
watch(
  modelValue,
  () => {
    if (updatePaused.value)
      return
    text.value = modelValue.value
    revision.value += 1
  },
  { flush: 'sync' },
)

const isSupported = getSupported()
if (isSupported) {
  usePlainShiki(
    editor,
    {
      lang: props.lang ?? 'lyric',
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    },
  )
}

const { focused } = useFocus(editor)

function updateModelValue() {
  updatePaused.value = true
  modelValue.value = editor.value?.textContent ?? ''
  nextTick(() => {
    updatePaused.value = false
  })
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
  <div ref="container" flex="~ col gap-1" relative>
    <slot :focused="focused" />
    <div
      v-if="isSupported"
      :key="revision"
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
      ref="editor"
      v-model="modelValue"
      :class="[sharedClass, inputClass]"
    />
  </div>
</template>
