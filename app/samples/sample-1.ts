import type { MaruSongDataParsed } from '@marure/schema'
import { parseSongData } from '@marure/parser'
import { useNuxtApp } from 'nuxt/app'
import { shallowRef, watchEffect } from 'vue'
import YAML from 'yaml'

export default function sampleData() {
  const nuxtApp = useNuxtApp()
  const songData = shallowRef<MaruSongDataParsed>()

  watchEffect(() => {
    const parsedData = YAML.parse(`
schema: v1
youtube: SX_ViT4Ra7k
title: Lemon
artists:
  - 米津玄師
tags:
  - J-POP
dateLyricsUpdated: '2024-06-12'
lrc: |-
  [00:00.00] < ${nuxtApp.$i18n.t('demo.sampleTitle')} >
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
  [00:37.90] {言}(い)えずに{隠}(かく)してた{昏}(くら)い{過去}(かこ)も
  [trans:zh-Hant] 隱藏起來沒說出口的晦暗過去
  [00:43.52] あなたがいなきゃ{永遠}(えいえん)に{昏}(くら)いまま
  [trans:zh-Hant] 沒有了你也將永遠黑暗
  [00:49.25] きっともうこれ{以上}(いじょう) {傷}(きず)つくことなど
  [trans:zh-Hant] 我知道今後一定
  [00:54.82] ありはしないとわかっている
  [trans:zh-Hant] 沒有比這更傷人的了
  [00:59.90] あの{日}(ひ)の{悲}(かな)しみさえ あの{日}(ひ)の{苦}(くる)しみさえ
  [trans:zh-Hant] 那些日子的悲傷 那些日子的痛苦
  [01:05.32] そのすべてを{愛}(あい)してた あなたとともに
  [trans:zh-Hant] 我全都深愛著 連你一起
  [01:10.80] {胸}(むね)に{残}(のこ)り{離}(はな)れない {苦}(にが)い{レモン}(れもん)の{匂}(にお)い
  [trans:zh-Hant] 殘留胸中消散不去 苦澀檸檬的氣味
  [01:16.60] {雨}(あめ)が{降}(ふ)り{止}(や)むまでは{帰}(かえ)れない
  [trans:zh-Hant] 在雨停歇前無法回去
  [01:22.15] {今}(いま)でもあなたはわたしの{光}(ひかり)
  [trans:zh-Hant] 如今你依然是我的光
  [01:30.00] < ${nuxtApp.$i18n.t('demo.sampleTextEnd')} >
notes:
  - ${nuxtApp.$i18n.t('demo.sampleReminder')} 
credits:
  lyrics: >-
    https://web.archive.org/web/20240612224459/https://www.jpmarumaru.com/tw/JPSongPlay-11243.html
    `)
    songData.value = parseSongData(parsedData)
  })

  return songData.value
}
