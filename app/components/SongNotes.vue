<script setup lang="ts">
defineProps<{
  notes?: string[]
}>()
</script>

<template>
  <div
    flex="~ col gap-2 justify-end auto"
    of-auto text-xs text-hex-888
  >
    <div border="t base" my1 h-1px w-30px />
    <div v-if="notes?.length" break-words text-sm>
      <div v-for="line, idx of notes" :key="idx">
        {{ line }}
      </div>
    </div>
  </div>
</template>
