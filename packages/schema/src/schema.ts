import type { InferInput } from 'valibot'
import { array, description, isoDate, number, object, optional, pipe, record, regex, string } from 'valibot'

export const LyricWordSchema = object({
  t: optional(
    pipe(
      number(),
      description('Start time in seconds'),
    ),
  ),
  e: optional(
    pipe(
      number(),
      description('End time in seconds'),
    ),
  ),
  w: pipe(
    string(),
    description('Word text'),
  ),
  r: optional(
    pipe(
      string(),
      description('Ruby text'),
    ),
  ),
})

export const LyricTranslationSchema = pipe(
  record(string(), string()),
  description('Translation of the line. Key should be the language code, e.g. `zh-Hant`, `zh-Hans`, `en`'),
)

export const LyricLineSchema = object({
  t: pipe(
    number(),
    description('Start time in seconds'),
  ),
  words: array(LyricWordSchema),
  trans: optional(LyricTranslationSchema),
})

export const MaruSongSchama = object({
  schema: pipe(
    string(),
    regex(/^(v1)$/, 'Currently supported schema version: v1'),
    description('Schema version'),
  ),
  youtube: pipe(
    string(),
    description('The YouTube video ID, also used as the song ID'),
  ),
  title: string(),
  cover: optional(string()),
  artists: optional(array(string())),
  tags: optional(array(string())),
  dateSongReleased: optional(pipe(string(), isoDate())),
  dateLyricsUpdated: optional(pipe(string(), isoDate())),

  offset: optional(pipe(
    number(),
    description('Offset in seconds'),
  )),
  lrc: string(),
  notes: optional(array(string())),
  credits: optional(object({
    song: optional(string()),
    lyrics: optional(string()),
    translations: optional(string()),
    extra: optional(string()),
  })),
})

export type LyricLine = InferInput<typeof LyricLineSchema>
export type LyricWord = InferInput<typeof LyricWordSchema>
export type LyricTranslation = InferInput<typeof LyricTranslationSchema>
export type MaruSongData = InferInput<typeof MaruSongSchama>

export type MaruSongDataParsed = MaruSongData & {
  lyrics: LyricLine[]
}

export type MaruSongGist = Pick<
  MaruSongData,
  'schema' | 'youtube' | 'title' | 'cover' | 'artists' | 'tags' | 'dateSongReleased' | 'dateLyricsUpdated'
>
