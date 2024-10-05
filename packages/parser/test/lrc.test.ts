import { describe, expect, it } from 'vitest'
import { parseLrc, parseLrcLineContent, serializeToLrc } from '../src'

describe('lrc', () => {
  it('case 1', () => {
    const input = `
[ar:Chubby Checker oppure  Beatles, The]
[al:Hits Of The 60's - Vol. 2 – Oldies]
[ti:Let's Twist Again]
[au:Written by Kal Mann / Dave Appell, 1961]
[length: 2:23]

[00:12.00]Naku Penda Piya-Naku Taka Piya-Mpenziwe
[00:15.30]Some more lyrics ...
`
    expect(parseLrc(input)).toMatchInlineSnapshot(`
      {
        "lyrics": [
          {
            "t": 12,
            "words": [
              {
                "r": undefined,
                "t": undefined,
                "w": "Naku Penda Piya-Naku Taka Piya-Mpenziwe",
              },
            ],
          },
          {
            "t": 15.3,
            "words": [
              {
                "r": undefined,
                "t": undefined,
                "w": "Some more lyrics ...",
              },
            ],
          },
        ],
        "meta": {
          "al": "Hits Of The 60's - Vol. 2 – Oldies",
          "ar": "Chubby Checker oppure  Beatles, The",
          "au": "Written by Kal Mann / Dave Appell, 1961",
          "length": "2:23",
          "ti": "Let's Twist Again",
        },
      }
    `)
  })

  it('case 2', () => {
    const result = parseLrc(`
[ar: Camila Cabello, Young Thug]
[ti: Havana]
[al: Havana (Single)]
[length: 03:36]
[00:00.00]Song: Havana
[00:02.00]Singer: Camila Cabello, Young Thug
[00:04.00]
[00:08.86]Havana ooh na-na (ayy)
[00:11.56]Half of my heart is in Havana 
[00:14.11]Ooh-na-na (ayy ayy)
[00:16.03]He took me back 
[00:17.25]To East Atlanta na-na-na
[00:19.95]
[00:20.60]All of my heart is in Havana (ayy)
[00:23.51]There's somethin' 'bout his manners 

(uh huh)
[00:26.04]Havana ooh na-na
`)

    expect(result)
      .toMatchInlineSnapshot(`
        {
          "lyrics": [
            {
              "t": 0,
              "words": [
                {
                  "r": undefined,
                  "t": undefined,
                  "w": "Song: Havana",
                },
              ],
            },
            {
              "t": 2,
              "words": [
                {
                  "r": undefined,
                  "t": undefined,
                  "w": "Singer: Camila Cabello, Young Thug",
                },
              ],
            },
            {
              "t": 4,
              "words": [],
            },
            {
              "t": 8.86,
              "words": [
                {
                  "r": undefined,
                  "t": undefined,
                  "w": "Havana ooh na-na (ayy)",
                },
              ],
            },
            {
              "t": 11.56,
              "words": [
                {
                  "r": undefined,
                  "t": undefined,
                  "w": "Half of my heart is in Havana",
                },
              ],
            },
            {
              "t": 14.11,
              "words": [
                {
                  "r": undefined,
                  "t": undefined,
                  "w": "Ooh-na-na (ayy ayy)",
                },
              ],
            },
            {
              "t": 16.03,
              "words": [
                {
                  "r": undefined,
                  "t": undefined,
                  "w": "He took me back",
                },
              ],
            },
            {
              "t": 17.25,
              "words": [
                {
                  "r": undefined,
                  "t": undefined,
                  "w": "To East Atlanta na-na-na",
                },
              ],
            },
            {
              "t": 19.95,
              "words": [],
            },
            {
              "t": 20.6,
              "words": [
                {
                  "r": undefined,
                  "t": undefined,
                  "w": "All of my heart is in Havana (ayy)",
                },
              ],
            },
            {
              "t": 23.51,
              "words": [
                {
                  "r": undefined,
                  "t": undefined,
                  "w": "There's somethin' 'bout his manners 

        (uh huh)",
                },
              ],
            },
            {
              "t": 26.04,
              "words": [
                {
                  "r": undefined,
                  "t": undefined,
                  "w": "Havana ooh na-na",
                },
              ],
            },
          ],
          "meta": {
            "al": "Havana (Single)",
            "ar": "Camila Cabello, Young Thug",
            "length": "03:36",
            "ti": "Havana",
          },
        }
      `)

    expect(serializeToLrc(result))
      .toMatchInlineSnapshot(`
        "[ar:Camila Cabello, Young Thug]
        [ti:Havana]
        [al:Havana (Single)]
        [length:03:36]

        [00:00.00] Song: Havana
        [00:02.00] Singer: Camila Cabello, Young Thug
        [00:04.00]
        [00:08.86] Havana ooh na-na (ayy)
        [00:11.56] Half of my heart is in Havana
        [00:14.11] Ooh-na-na (ayy ayy)
        [00:16.03] He took me back
        [00:17.25] To East Atlanta na-na-na
        [00:19.95]
        [00:20.60] All of my heart is in Havana (ayy)
        [00:23.51] There's somethin' 'bout his manners 

        (uh huh)
        [00:26.04] Havana ooh na-na"
      `)
  })

  it('with translations', () => {
    const input = `
[00:06.80] あたま{テカテカ}(てかてか) さえて{ピカピカ}(ぴかぴか)
[trans:zh-Hant] 光溜溜的大頭 又閃又亮晶晶
[00:11.25] それがどうした ぼく{ドラ}(どら)えもん
[trans:zh-Hant] 那又怎麼樣呢 我是哆啦A夢
[00:15.65] みらいのせかいの {ネコ}(ねこ)がた{ロボット}(ろぼっと)
  `
    const result = parseLrc(input)
    expect(result).toMatchInlineSnapshot(`
      {
        "lyrics": [
          {
            "t": 6.8,
            "trans": {
              "zh-Hant": "光溜溜的大頭 又閃又亮晶晶",
            },
            "words": [
              {
                "r": undefined,
                "t": undefined,
                "w": "あたま",
              },
              {
                "r": "てかてか",
                "t": undefined,
                "w": "テカテカ",
              },
              {
                "r": undefined,
                "t": undefined,
                "w": " さえて",
              },
              {
                "r": "ぴかぴか",
                "t": undefined,
                "w": "ピカピカ",
              },
            ],
          },
          {
            "t": 11.25,
            "trans": {
              "zh-Hant": "那又怎麼樣呢 我是哆啦A夢",
            },
            "words": [
              {
                "r": undefined,
                "t": undefined,
                "w": "それがどうした ぼく",
              },
              {
                "r": "どら",
                "t": undefined,
                "w": "ドラ",
              },
              {
                "r": undefined,
                "t": undefined,
                "w": "えもん",
              },
            ],
          },
          {
            "t": 15.65,
            "words": [
              {
                "r": undefined,
                "t": undefined,
                "w": "みらいのせかいの ",
              },
              {
                "r": "ねこ",
                "t": undefined,
                "w": "ネコ",
              },
              {
                "r": undefined,
                "t": undefined,
                "w": "がた",
              },
              {
                "r": "ろぼっと",
                "t": undefined,
                "w": "ロボット",
              },
            ],
          },
        ],
        "meta": {},
      }
    `)
    expect(serializeToLrc(result)).toMatchInlineSnapshot(`
      "[00:06.80] あたま{てかてか}(テカテカ) さえて{ぴかぴか}(ピカピカ)
      [trans:zh-Hant] 光溜溜的大頭 又閃又亮晶晶
      [00:11.25] それがどうした ぼく{どら}(ドラ)えもん
      [trans:zh-Hant] 那又怎麼樣呢 我是哆啦A夢
      [00:15.65] みらいのせかいの {ねこ}(ネコ)がた{ろぼっと}(ロボット)"
    `)
  })
})

describe('lrc-line', () => {
  // https://en.wikipedia.org/wiki/LRC_(file_format)
  it('parse A2 extension', () => {
    expect(parseLrcLineContent('<00:00.04> When <00:00.16> the <00:00.82> truth <00:01.29> is <00:01.63> found <00:03.09> to <00:03.37> be <00:05.92> lies'))
      .toMatchInlineSnapshot(`
        [
          {
            "r": undefined,
            "t": 0.04,
            "w": "When ",
          },
          {
            "r": undefined,
            "t": 0.16,
            "w": "the ",
          },
          {
            "r": undefined,
            "t": 0.82,
            "w": "truth ",
          },
          {
            "r": undefined,
            "t": 1.29,
            "w": "is ",
          },
          {
            "r": undefined,
            "t": 1.63,
            "w": "found ",
          },
          {
            "r": undefined,
            "t": 3.09,
            "w": "to ",
          },
          {
            "r": undefined,
            "t": 3.37,
            "w": "be ",
          },
          {
            "r": undefined,
            "t": 5.92,
            "w": "lies",
          },
        ]
      `)
  })

  it('parse ruby', () => {
    expect(parseLrcLineContent('{昨日}(きのう)の{朝}(あさ) {早}(はや)くに'))
      .toMatchInlineSnapshot(`
        [
          {
            "r": "きのう",
            "t": undefined,
            "w": "昨日",
          },
          {
            "r": undefined,
            "t": undefined,
            "w": "の",
          },
          {
            "r": "あさ",
            "t": undefined,
            "w": "朝",
          },
          {
            "r": undefined,
            "t": undefined,
            "w": " ",
          },
          {
            "r": "はや",
            "t": undefined,
            "w": "早",
          },
          {
            "r": undefined,
            "t": undefined,
            "w": "くに",
          },
        ]
      `)
  })

  it('parse ruby escape', () => {
    expect(parseLrcLineContent('{\\}}(\\))'))
      .toMatchInlineSnapshot(`
        [
          {
            "r": "\\)",
            "t": undefined,
            "w": "\\}",
          },
        ]
      `)
  })
})
