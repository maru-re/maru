<!-- eslint-disable vue/no-v-text-v-html-on-component -->

<!-- From https://web.archive.org/web/20230104064123/https://www.jpmarumaru.com/tw/JPSongCertify.asp -->
<script setup lang="ts">
</script>

<template>
  <div mxa max-w-150 p15 lt-lg="p6">
    <BasicNav />
    <h3 mb5 text-lg font-bold>
      歌曲版權、著作權說明
    </h3>
    <ul list-disc py2 text-sm line-height-1.5em>
      <li>本 App 為基於 YouTube 的歌曲歌詞展示閱讀器，基於使用者開啟之檔案內容提供展示與交互能力。</li>
      <li>用戶開啟之檔案緩存於用戶瀏覽器的本地存儲、用於方便下次開啟，本 App 不會上傳任何資料。</li>
      <li>音樂影片嵌入自 YouTube，在符合 YouTube 使用條款下、由 YouTube 決定影片是否允許被嵌入播放。版權、著作權歸影片原作者所有。</li>
      <li>App 開放原始程式碼、永久免費、非營利。</li>
    </ul>
  </div>
</template>

<style scoped>
li {
  margin: 1rem 0;
}
a {
  --uno: 'op75 hover:op100 hover:underline';
}
</style>
