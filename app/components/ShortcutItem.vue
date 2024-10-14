<script setup lang="ts">
defineProps<{
  title: string
  keys: string[][]
}>()
</script>

<template>
  <div w-full flex="~ justify-between items-center" py-2>
    <p text-sm>
      {{ title }}
    </p>
    <div flex="~ gap-1 items-center">
      <template v-for="(group, groupIndex) in keys" :key="groupIndex">
        <div v-if="groupIndex > 0" mx-1 text-xs text-gray-500>
          {{ $t('shortcuts.or') }}
        </div>
        <div flex="~ gap-1">
          <kbd
            v-for="(key, keyIndex) in group"
            :key="keyIndex"
            kbd-key
          >
            {{ key }}
          </kbd>
        </div>
      </template>
    </div>
  </div>
</template>
