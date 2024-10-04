<script setup lang="ts">
const { error } = getPlayer()!
</script>

<template>
  <div class="aspect-16/9 flex-none of-hidden shadow-lg">
    <div id="player" flex bg-hover text-center>
      <div v-if="!error" ma text-sm op50>
        YouTube 連接中...
      </div>
      <div v-else ma text-sm>
        <div text-red font-bold>
          YouTube 連接失敗
        </div>
        <div mb2 text-red>
          {{ error }}
        </div>
        <div op50>
          請嘗試重新整理頁面
        </div>
      </div>
    </div>
  </div>
</template>
