<script setup lang="ts">
const props = defineProps<{
  type?: 'text' | 'textarea'
  inputClass?: string
  lang?: 'lyric' | 'lyric-inline' | 'yaml'
}>()

const modelValue = defineModel<string>('modelValue')

const sharedClass = 'box-input font-mono'
const container = useTemplateRef<HTMLLabelElement>('container')
const editor = useTemplateRef<HTMLDivElement>('editor')
const { focused } = useFocus(editor)
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
const {
  trigger: triggerHighlight,
  update: updateHighlight,
} = usePlainShiki(
  editor,
  {
    enabled: isSupported,
    immediate: false,
    lang: props.lang ?? 'lyric',
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
)

const { stop } = useIntersectionObserver(
  container,
  (entries) => {
    if (entries[0]?.isIntersecting) {
      triggerHighlight()
      stop()
    }
  },
)

function insertRuby() {
  const selection = document.getSelection()
  if (!selection || selection.isCollapsed) {
    return false
  }

  const { anchorNode, focusNode } = selection
  if (!anchorNode || anchorNode !== focusNode || !editor.value?.contains(anchorNode)) {
    return false
  }

  let start = selection.anchorOffset
  let end = selection.focusOffset
  if (start > end) {
    [start, end] = [end, start]
  }

  const text = anchorNode.textContent!
  anchorNode.textContent = `${text.slice(0, start)}{${text.slice(start, end)}}()${text.slice(end)}`
  selection.setPosition(anchorNode, end + 3)
  updateHighlight()
  updateModelValue()
  return true
}

function onKeyDown(event: KeyboardEvent) {
  if (event.altKey && event.key === 'r') {
    insertRuby()
  }
}

function onBeforeInput(event: Event) {
  const { data, inputType } = event as InputEvent
  if (inputType === 'insertText' && data === '{' && insertRuby()) {
    event.preventDefault()
  }
}

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
      @keydown="onKeyDown"
      @beforeinput="onBeforeInput"
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
