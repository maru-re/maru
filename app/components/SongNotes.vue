<script setup lang="ts">
const props = defineProps<{
  notes?: string[]
}>()

const html = computed(() => renderMarkdown(props.notes?.join('\n') || ''))
</script>

<template>
  <div
    v-if="notes?.length"
    flex="~ col gap-2 justify-end auto"
    of-auto text-xs text-hex-888
  >
    <div border="t base" my1 h-1px w-30px />
    <div
      break-words text-sm class="markdown-content"
      v-html="html"
    />
  </div>
</template>
