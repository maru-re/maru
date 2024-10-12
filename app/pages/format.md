---
meta:
  locale: zh-Hant
  layout: content
---

# 匯入資料格式說明

## 面向使用者

二重丸的歌詞檔案以 `.maru` 為副檔名，你可以通過拖拽的或分享連結的方式將其匯入到 App 中。也支持匯入含有歌詞檔案的 ZIP 壓縮包。

歌詞創作與編輯的功能還在開發中，目前只能由工程師整理歌詞檔案進行分享。

## 面向工程師

歌詞檔案使用 YAML 格式，以下是一個範例：

```yaml
# Schema version, currently has to be v1
schema: v1
# The YouTube video ID of the song, also used as the song ID in the app
youtube: SX_ViT4Ra7k
# The title of the song
title: Lemon
# The artists of the song, a string list
artists:
  - 米津玄師
# The tags for categorizing the song, a string list
tags:
  - J-POP
# Date when the lyrics was last updated
dateLyricsUpdated: 2024-06-12
# The lyrics of the song, in LRC format. A multi-line string
lrc: |-
  [00:00.00] < 展示用歌詞樣本 >
  [00:02.40] {夢}(ゆめ)ならばどれほどよかったでしょう
  [trans:zh-Hant] 如果是場夢該有多好
  [00:07.62] {未}(いま)だにあなたのことを{夢}(ゆめ)にみる
  [trans:zh-Hant] 至今仍會不時夢見你
  [00:13.20] {忘}(わす)れた{物}(もの)を{取}(と)りに{帰}(かえ)るように
  [trans:zh-Hant] 就像要取回遺忘的東西
  [00:18.68] {古}(ふる)びた{思}(おも)い{出}(で)の{埃}(ほこり)を{払}(はら)う
  [trans:zh-Hant] 將陳舊回憶上的灰塵拂去
  [00:26.92] {戻}(もど)らない{幸}(しあわ)せがあることを
  [trans:zh-Hant] 有些幸福一去不復返
  [00:32.40] {最後}(さいご)にあなたが{教}(おし)えてくれた
  [trans:zh-Hant] 這是最後你教會我的
# Extra notes to be displayed in the app, a string list
notes:
  - 本歌詞樣本僅用於展示 App 之功能，版權歸發行公司所有。
# An object containing the credits for the song
credits:
  lyrics: https://www.uta-net.com/song/248573/
```

詳細的欄位請參照 TypeScript 定義文件。
