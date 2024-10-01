import type { LyricLine, LyricWordRich } from '@marure/schema'
import { timestampToSeconds } from './timestamp'

const reTimeStamp = /<([\d:.]+)>\s*/g
const reRuby = /\{((?:\\\}|[^}])+)\}\(((?:\\\)|[^)])+)\)/g

export function parseLrcLine(line: string): LyricWordRich[] {
  const items: LyricWordRich[] = []

  let i = 0
  let buffer = ''
  let ts: string | undefined

  function pushText(ruby?: string) {
    if (buffer) {
      items.push({
        w: buffer,
        r: ruby,
        t: ts ? timestampToSeconds(ts) : undefined,
      })
      buffer = ''
      ts = undefined
    }
  }

  while (i < line.length) {
    const char = line[i]
    switch (char) {
      case '<': {
        reTimeStamp.lastIndex = i
        const match = reTimeStamp.exec(line)
        if (match) {
          pushText()
          ts = match[1]
          i = reTimeStamp.lastIndex
        }
        continue
      }
      case '{': {
        reRuby.lastIndex = i
        const match = reRuby.exec(line)
        if (match) {
          pushText()
          buffer = match[1] || ''
          pushText(match[2])
          i = reRuby.lastIndex
        }
        continue
      }
    }
    buffer += char
    i += 1
  }

  pushText()

  return items
}

export interface ParsedLrc {
  meta: Record<string, string>
  lyrics: LyricLine[]
}

const reLrcTag = /(\[[^:]+:.+\])/g
const reLrcTagFull = /^\[([^:]+):(.+)\]$/

export function parseLrc(lrc: string): ParsedLrc {
  const parts = lrc.split(reLrcTag)
    .map(i => i.trim())
    .filter(Boolean)

  const lines: LyricLine[] = []
  const meta: Record<string, string> = {}

  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i]!
    const match = reLrcTagFull.exec(part)
    if (!match) {
      throw new Error(`Expected part "${part}"`)
    }
    const key = match[1]!
    const value = match[2]!
    if (key?.match(/^\d+$/)) {
      const time = `${key}:${value}`
      let text = parts[i + 1] || ''
      if (reLrcTagFull.test(text))
        text = ''
      else
        i += 1
      lines.push({
        t: timestampToSeconds(time),
        words: parseLrcLine(text),
      })
    }
    else {
      meta[key] = value?.trim()
    }
  }

  return {
    meta,
    lyrics: lines,
  }
}
