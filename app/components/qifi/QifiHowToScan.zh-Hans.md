<div flex="~ col gap-4" mt2 p2 text-sm>

由于单个 QR Code 的传输大小限制，我们采用了一种名为 {QiFi} 的 <b>动态 QR Code</b>。

使用相机 App 扫描后，将导向 QRS 扫描器页面，继续扫描传输剩余信息。过程中可能会需要相机权限，请放心，网页代码开源且不保存相机画面。数据接收完成后，会自动返回 maru 打开对应歌曲。

部分相机 APP 会因为动态变化的二维码而无法正常扫描，您可以点击 <span rounded bg-gray:20 p1><span i-uil-pause-circle inline-block align-middle /> <I18nT keypath="share.qifi.pausePlayback" /></span>，这会有助于您扫描。

您也可以手动输入扫描网页的地址：<a href="https://qrss.netlify.app" text-blue underline>qrss.netlify.app</a>

</div>
