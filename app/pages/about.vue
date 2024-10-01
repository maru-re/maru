<!-- eslint-disable vue/no-v-text-v-html-on-component -->

<!-- From https://web.archive.org/web/20230104064123/https://www.jpmarumaru.com/tw/JPSongCertify.asp -->
<script setup lang="ts">
</script>

<template>
  <div mxa max-w-150 p15 lt-lg="p6" text-sm line-height-1.5em>
    <BasicNav />
    <h3 mb5 text-lg font-bold>
      關於 maru.re
    </h3>
    <p py2>
      <ruby font-jp-serif><rb>二重丸</rb><rt>にじゅうまる</rt></ruby> (maru.re) 建立的初衷是為了延續 jpmarumaru.com 所提供的優質的日語學習平台。
      jpmarumaru.com 於 2024 年 8 月無徵兆關站停止服務。由於站點沒有公共的鏡像或備份，很多功能在市面上並無合適的替代方案。
    </p>
    <p py2>
      本 App 的作者 <a href="https://antfu.me" target="_blank">Anthony Fu</a> 復刻了部分 Marumaru 所提供的功能，用於自身學習日文的需求。
      App 完全免費且 <a href="https://github.com/maru-re/maru" target="_blank">開放源始程式碼</a>，希望可以集大家的力量一起完善，幫助到更多想要學習日文的同學、並提供更好的日語學習環境。
    </p>
    <p py2>
      本 App 為基於 YouTube 的歌曲歌詞展示閱讀器、並未提供內建的歌詞。需要使用者自行匯入支援格式之檔案，匯入檔案將緩存於使用者設備本地。App 僅提供展示與交互能力。
    </p>
  </div>
</template>

<style scoped>
a {
  --uno: 'op75 hover:op100 hover:underline';
}
</style>
