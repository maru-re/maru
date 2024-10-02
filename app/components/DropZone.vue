<script setup lang="ts">
const isDragging = ref(false)

async function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false

  await importFromFiles(
    [...e.dataTransfer?.items || []].map(i => i.webkitGetAsEntry()).filter(x => !!x)
    || e.dataTransfer?.files,
  )
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragExit() {
  isDragging.value = false
}

onMounted(() => {
  useEventListener('drop', onDrop)
  useEventListener('dragover', onDragOver)
  useEventListener('dragend', onDragExit)
  useEventListener('pointerleave', onDragExit)
  // useEventListener('dragleave', onDragExit)
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
        拖拽檔案到這裡
      </div>
    </div>
  </div>
</template>
