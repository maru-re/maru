<script setup lang="ts">
function removeAll() {
  removeAllData()
  location.pathname = '/'
}
</script>

<template>
  <div mxa max-w-150 p15 lt-md="p6" text-sm line-height-1.5em>
    <BasicNav />
    <h3 mb5 text-lg font-bold>
      設定
    </h3>
    <div py2>
      <SimpleButton icon="i-uil-trash" color="btn-simple-red" @click="removeAll()">
        <div translate-y-0.5px>
          清除所有資料
        </div>
      </SimpleButton>
    </div>
  </div>
</template>
