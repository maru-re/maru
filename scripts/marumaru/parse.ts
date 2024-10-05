import type { LyricLine, LyricWord, MaruSongData } from '@marure/schema'
import { serializeToLrc } from '~~/packages/parser/src'
import * as cheerio from 'cheerio'

export function parse(html: string, sourceUrl: string) {
  const $ = cheerio.load(html)

  const site: MaruSongData = {
    schema: 'v1',
    youtube: $('#VideoID').text().trim(),
    title: $('#SongName').text().trim(),
    credits: {
      lyrics: sourceUrl,
    },
    artists: $('#Singer').text().split(/[,;、×]|\bfeat\.?|\bft\s*\.?|\bwith\b/gi).map(s => s.trim()).filter(Boolean),
    tags: $('#SongType').text().split(/[,;、]/g).map(s => s.trim()).filter(Boolean),
    lrc: '',
  }

  const snapshotTime = html.match(/https:\/\/web\.archive\.org\/web\/(\d+)\//)?.[1]
  if (snapshotTime) {
    const dataString = `${snapshotTime.slice(0, 4)}-${snapshotTime.slice(4, 6)}-${snapshotTime.slice(6, 8)}`
    site.dateLyricsUpdated = dataString
  }

  const lyrics: (LyricLine & { pk?: string })[] = []

  const credits = $([...$('[lang="ja"]')].find(i => $(i).attr('style')?.includes('#333'))).find('br').replaceWith('\n').end().text()
  if (credits)
    site.notes = credits.split(/\n+/g)

  const $list = $('#LyricsList')
  $list.find('.LyricsYomi').each((_, _el) => {
    const el = $(_el)
    const sn = el.attr('sn') || ''
    const st = el.attr('st') || ''
    const pk = el.attr('pk') || ''
    const words: LyricWord[] = []

    if (!sn || !st) {
      return
    }

    const time = st2sec(st)

    el.contents().each((_, _word) => {
      const word = $(_word)
      const rb = word.find('rb').text()
      const rt = word.find('rt').text()
      const text = word.text()
      if (rt)
        words.push({ r: rb, w: rt })
      else
        words.push({ w: rb || text })
    })

    const translations: Record<string, string> = {}

    lyrics.push({ t: time, pk, words, trans: translations })
  })

  $list.find('.Translate_zh').each((_, _el) => {
    const el = $(_el)
    const pk = el.attr('pk') || ''
    const translation = el.text().trim()
    const line = lyrics.find(line => line.pk === pk)
    if (line) {
      line.trans ||= {}
      line.trans['zh-Hant'] = translation
    }
  })

  site.lrc = serializeToLrc({ meta: {}, lyrics })

  return site
}

export function st2sec(st: string) {
  const [h, m, s] = st.split(':').map(Number) as [number, number, number]
  return h * 3600 + m * 60 + s
}

export function normalizeFilename(str: string) {
  return str.replace(/[^\w\-\p{Script=Han}\p{Script=Katakana}\p{Script=Hiragana}]+/gu, '_')
}
