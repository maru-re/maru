<script setup lang="ts">
function removeAll() {
  removeAllData()
  location.pathname = '/'
}
</script>

<template>
  <div mxa max-w-150 p15 lt-lg="p6" text-sm line-height-1.5em>
    <BasicNav />
    <h3 mb5 text-lg font-bold>
      {{ $t("common.settings") }}
    </h3>
    <div py2 flex="~ gap-2">
      <SimpleButton icon="i-uil-trash" color="btn-simple-red" @click="removeAll()">
        <span translate-y-0.5px>
          {{ $t("actions.clearAllData") }}
        </span>
      </SimpleButton>
      <SimpleButton icon="i-uil-folder-download" @click="exportSongsZip()">
        <span translate-y-0.5px>
          {{ $t('actions.downloadAllLyrics') }}
        </span>
      </SimpleButton>
    </div>
  </div>
</template>
