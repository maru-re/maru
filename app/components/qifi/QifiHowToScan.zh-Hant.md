<div flex="~ col gap-4" mt2 p2 text-sm>

由於單個 QR Code 的傳輸大小限制，我們採用了名為 {QiFi} 的 <b>動態 QR Code</b>。

使用相機 App 掃描後，將導向 QRS 掃描器頁面，繼續掃描傳輸剩餘信息。過程中可能會需要相機權限，請放心，網頁代碼開源且不保存相機畫面。數據接收完成後，會自動回到 maru 打開對應歌曲。

部分相機 APP 會因為動態變化的二維碼而無法正常掃描，也你可以點擊 <span rounded bg-gray:20 p1><span i-uil-pause-circle inline-block align-middle /> <I18nT keypath="share.qifi.pausePlayback" /></span>，這會有助於你掃描。

你也可以手動輸入掃描網頁的地址：<a href="https://qrss.netlify.app" text-blue underline>qrss.netlify.app</a>

</div>
