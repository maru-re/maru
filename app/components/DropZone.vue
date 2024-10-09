<script setup lang="ts">
const isDragging = ref(false)

// Use for track drag state
let dragCounter = 0

function isFileDrag(e: DragEvent) {
  return e.dataTransfer?.types && e.dataTransfer.types.includes('Files')
}

async function onDrop(e: DragEvent) {
  e.preventDefault()
  if (!isFileDrag(e))
    return

  isDragging.value = false
  dragCounter = 0

  await importFromFiles(
    [...e.dataTransfer?.items || []].map(i => i.webkitGetAsEntry()).filter(x => !!x)
    || e.dataTransfer?.files,
  )
}

function onDragEnter(e: DragEvent) {
  e.preventDefault()
  if (!isFileDrag(e))
    return

  dragCounter++
  isDragging.value = true
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  if (!isFileDrag(e))
    return

  dragCounter--
  if (dragCounter === 0) {
    isDragging.value = false
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

onMounted(() => {
  useEventListener('dragenter', onDragEnter)
  useEventListener('dragover', onDragOver)
  useEventListener('dragleave', onDragLeave)
  useEventListener('drop', onDrop)
})
</script>

<template>
  <div
    v-if="isDragging"
    pointer-events-auto fixed inset-0 z-dropzone p10 backdrop-blur-5
  >
    <div
      border="3 dashed base rounded-2xl"
      flex="~ col items-center justify-center"
      h-full w-full bg-white:50 dark:bg-black:50
    >
      <div text-xl>
        {{ $t("dragFileToHere") }}
      </div>
    </div>
  </div>
</template>
