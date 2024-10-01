<script setup lang="ts">
import type { MaruSongData } from '@marure/schema'
import { validate } from '@marure/schema'

const isDragging = ref(false)

async function * traverseFileList(files?: FileList | (FileSystemEntry | null)[]): AsyncGenerator<File> {
  for (const item of files || []) {
    if (item == null)
      continue
    if (item instanceof File) {
      yield item
    }
    else {
      if (item.isDirectory) {
        const dir = item as FileSystemDirectoryEntry
        const reader = dir.createReader()
        const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
          reader.readEntries(resolve, reject)
        })
        yield * traverseFileList(entries)
      }
      else {
        if (item.isFile) {
          const file = item as FileSystemFileEntry
          yield await new Promise<File>((resolve, reject) => {
            file.file(resolve, reject)
          })
        }
      }
    }
  }
}

interface FileParseResult {
  file: File
  data?: MaruSongData
  error?: unknown
}

async function parseFiles(files?: FileList | (FileSystemEntry | null)[]): Promise<FileParseResult[]> {
  const result: FileParseResult[] = []

  for await (const file of traverseFileList(files)) {
    try {
      // TODO: suport zip
      const text = await file.text()
      const raw = JSON.parse(text)
      const data = validate(raw)
      result.push({ file, data })
    }
    catch (err) {
      result.push({ file, error: err })
    }
  }

  return result
}

async function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false

  const result = await parseFiles(
    [...e.dataTransfer?.items || []].map(i => i.webkitGetAsEntry()).filter(Boolean) || e.dataTransfer?.files,
  )

  const errors = result.filter(r => r.error)
  const success = result.filter(r => !r.error && r.data)

  const messages: string[] = []
  if (success.length) {
    messages.push(`成功解析 ${success.length} 個檔案:`)
    messages.push(...success.map(r => r.file.name))
    messages.push('')
  }

  if (errors.length) {
    messages.push(`解析失敗 ${errors.length} 個檔案:`)
    messages.push(...errors.map(r => `${r.file.name} (${r.error})`))
    messages.push('')
  }

  if (success.length) {
    messages.push('是否導入成功的檔案？')

    // TODO: proper dialog
    // eslint-disable-next-line no-alert
    if (confirm(messages.join('\n'))) {
      saveSongsToLocal(success.map(r => r.data!))
    }
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragExit(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

onMounted(() => {
  useEventListener('drop', onDrop)
  useEventListener('dragover', onDragOver)
  useEventListener('dragend', onDragExit)
  // useEventListener('dragleave', onDragExit)
})
</script>

<template>
  <div
    v-if="isDragging"
    pointer-events-auto fixed inset-0 z-1000 p10 backdrop-blur-5
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
