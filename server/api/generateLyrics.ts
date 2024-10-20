import type { LyricLine } from '~~/packages/schema/src'
import { getCaptions } from 'yt-caption-extractor'

export default defineEventHandler<{ query: { id: string, translations: string } }>(async (event) => {
  const { id, translations = 'zh-Hant' } = getQuery(event)
  const _translations = translations.split(',')

  const captions = await getCaptions(id, { lang: _translations })

  if (captions == null)
    return []

  const mergedLyrics: LyricLine[] = []
  const lyricMap = new Map<number, LyricLine>()

  for (const [lang, lyrics] of captions.entries()) {
    for (const lyric of lyrics) {
      const t = lyric.start
      if (lyricMap.has(t)) {
        const existingLyric = lyricMap.get(t)!
        existingLyric.trans![lang] = lyric.word
      }
      else {
        const newLyric: LyricLine = {
          t,
          words: [{ w: lyric.word }],
          trans: { [lang]: lyric.word },
        }
        lyricMap.set(t, newLyric)
        mergedLyrics.push(newLyric)
      }
    }
  }

  return mergedLyrics
})
