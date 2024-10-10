import { describe, expect, it } from 'vitest'
import { inferSongInfoFromVideoTitle } from '../src/infer'

describe('inferSongInfoFromVideoTitle', () => {
  it('cases', () => {
    const titles = [
      '幾田りら「Sign」 Official Music Video',
      '幾田りら - レンズ / THE FIRST TAKE',
      'Uru - それを愛と呼ぶなら / THE FIRST TAKE',
      '【Official】Uru 『それを愛と呼ぶなら』 LIVE “Uru Tour 2023「contrast」” on WOWOWプラス',
      'milet「hanataba」(TBS系 日曜劇場「アンチヒーロー」主題歌) LIVE SESSION',
      'milet×Cateen - Ordinary days / THE FIRST TAKE',
      '中島美嘉 『雪の華』 MUSIC VIDEO',
      'Mika--僕が死のうと思ったのは/The Reason Why I Thought I\'d Die (Eng)',
      'DAOKO × 米津玄師『打上花火』MUSIC VIDEO',
    ]

    expect(titles.map(inferSongInfoFromVideoTitle))
      .toMatchInlineSnapshot(`
        [
          {
            "artists": [
              "幾田りら",
            ],
            "title": "Sign",
          },
          {
            "artists": [
              "幾田りら",
            ],
            "title": "レンズ",
          },
          {
            "artists": [
              "Uru",
            ],
            "title": "それを愛と呼ぶなら",
          },
          {
            "artists": [
              "Uru",
            ],
            "title": "それを愛と呼ぶなら",
          },
          {
            "artists": [
              "milet",
            ],
            "title": "hanataba",
          },
          {
            "artists": [
              "milet",
              "Cateen",
            ],
            "title": "Ordinary days",
          },
          {
            "artists": [
              "中島美嘉",
            ],
            "title": "雪の華",
          },
          {
            "artists": [
              "Mika",
            ],
            "title": "僕が死のうと思ったのは",
          },
          {
            "artists": [
              "DAOKO",
              "米津玄師",
            ],
            "title": "打上花火",
          },
        ]
      `)
  })
})
