由于单个二维码的传输大小限制，我们采用了一种名为 {QiFi} 的 <b>动态二维码</b>。

使用相机 App 扫描后，将导向 QRS 扫描器页面，继续扫描传输剩余信息。过程中可能会需要相机权限，请放心，网页代码开源且不保存相机画面。数据接收完成后，会自动返回 maru 打开对应歌曲。

部分相机 APP 会因为动态变化的二维码而无法正常扫描，您可以点击 <span rounded bg-gray:20 p1 inline-flex align-middle><span i-uil-pause-circle /></span> 暫停，这会有助于您扫描。

您也可以手动输入扫描网页的地址： [qrss.netlify.app](https://qrss.netlify.app)
