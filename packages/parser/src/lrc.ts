import type { LyricLine, LyricWord } from '@marure/schema'
import { secondsToTimestamp, timestampToSeconds } from './timestamp'

const reTimeStamp = /<([\d:.]+)>\s*/g
const reRuby = /\{((?:\\\}|[^}])+)\}\(((?:\\\)|[^)])+)\)/g

export function parseLrcLine(line: string): LyricWord[] {
  const items: LyricWord[] = []

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
          continue
        }
        break
      }
      case '{': {
        reRuby.lastIndex = i
        const match = reRuby.exec(line)
        if (match) {
          pushText()
          buffer = match[1] || ''
          pushText(match[2])
          i = reRuby.lastIndex
          continue
        }
        break
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

export function parseLrc(lrc: string = ''): ParsedLrc {
  const parts = lrc.split(reLrcTag)
    .map(i => i.trim())
    .filter(Boolean)

  const lines: LyricLine[] = []
  const meta: Record<string, string> = {}

  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i]!
    const match = reLrcTagFull.exec(part)
    if (!match) {
      throw new Error(`Unexpected part "${part}" on parsing LRC`)
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
    // Custom tags
    else if (key === 'trans') {
      const lastLine = lines[lines.length - 1]
      let text = parts[i + 1] || ''
      if (reLrcTagFull.test(text))
        text = ''
      else
        i += 1
      if (lastLine) {
        lastLine.trans ||= {}
        lastLine.trans[value] = text
      }
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

export function serializedToLrc(lrc: ParsedLrc): string {
  const lines: string[] = []

  for (const [key, value] of Object.entries(lrc.meta)) {
    lines.push(`[${key}:${value}]`)
  }
  if (lines.length)
    lines.push('')

  for (const line of lrc.lyrics) {
    const time = line.t
    const text = line
      .words
      .map((i) => {
        let str = ''
        if (i.t)
          str += `<${i.t}> `
        if (i.r)
          str += `{${i.r}}(${i.w})`
        else
          str += i.w
        return str
      })
      .join('')

    lines.push(`[${secondsToTimestamp(time)}] ${text}`.trimEnd())

    for (const [key, value] of Object.entries(line.trans || {})) {
      lines.push(`[trans:${key}] ${value}`)
    }
  }

  return lines.join('\n')
}
