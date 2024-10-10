<script setup lang="ts">
const { error } = getPlayer()!
</script>

<template>
  <div class="relative aspect-16/9 flex-none of-hidden shadow-lg">
    <div id="player" h-full w-full flex bg-hover text-center>
      <div v-if="!error" ma text-sm op50>
        {{ $t("youtube.connecting") }}
      </div>
      <div v-else ma text-sm>
        <div text-red font-bold>
          {{ $t("youtube.connectionFail") }}
        </div>
        <div mb2 text-red>
          {{ error }}
        </div>
        <div op50>
          {{ $t("tryRefreshPage") }}
        </div>
      </div>
    </div>
  </div>
</template>
