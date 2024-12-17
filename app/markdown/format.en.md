# Import Data Format Description

## For Users

Nijūmaru lyrics files use the `.maru` extension. You can import them into the app by dragging and dropping or using a share link. ZIP archives containing lyrics files are also supported.

You can use the [built-in lyrics editor](/create) to create or edit lyrics. The editor is currently only supported on desktop computers.

You can also join our [Discord server](https://chat.maru.re) to discuss and share experiences in creating lyrics with others.

## For Developers

Lyrics files use the YAML format. Here's an example:

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
  [trans:en] How I wish it were only a dream
  [00:07.62] {未}(いま)だにあなたのことを{夢}(ゆめ)にみる
  [trans:en] Even now I still dream of you
  [00:13.20] {忘}(わす)れた{物}(もの)を{取}(と)りに{帰}(かえ)るように
  [trans:en] I brush the dust off from old memories
  [00:18.68] {古}(ふる)びた{思}(おも)い{出}(で)の{埃}(ほこり)を{払}(はら)う
  [trans:en] Like returning home to retrieve a forgotten item
  [00:26.92] {戻}(もど)らない{幸}(しあわ)せがあることを
  [trans:en] In the end it was you who taught me that
  [00:32.40] {最後}(さいご)にあなたが{教}(おし)えてくれた
  [trans:en] Some happinesses can't be reclaimed
# Extra notes to be displayed in the app, a string list
notes:
  - Sample lyrics for demo ends here, all rights reserved by the publishing company.
```

The LRC part supports some extended features, such as using `{}()` to mark furigana, `<00:00.00>` for inline timestamps, and `[trans:locale]` to mark translations.

For detailed field descriptions, please refer to the TypeScript definition file. You can also get type hints and data structure validation by installing the npm package `npm i @marure/schema`.
