import type { InferInput } from 'valibot'
import { array, description, isoDate, number, object, optional, pipe, record, regex, string, tuple, union } from 'valibot'

export const LyricWordSchema = union([
  string(),
  tuple([string(), string()]),
])

export const LyricTranslationSchema = pipe(
  record(string(), string()),
  description('Translation of the line. Key should be the language code, e.g. `zh-Hant`, `zh-Hans`, `en`'),
)

export const LyricLineSchema = object({
  t: pipe(
    number(),
    description('Start time in seconds'),
  ),
  e: optional(pipe(
    number(),
    description('End time in seconds, if not provided, the end time is the start time of the next line'),
  )),
  words: array(LyricWordSchema),
  trans: optional(LyricTranslationSchema),
})

export const MaruSongSchama = object({
  version: pipe(
    string(),
    regex(/^1$/, 'Currently only supports schema v1'),
    description('Schema version, currently only supports "1"'),
  ),
  youtube: pipe(
    string(),
    description('The YouTube video ID, also used as the song ID'),
  ),
  title: string(),
  artists: optional(array(string())),
  tags: optional(array(string())),
  dateSongReleased: optional(pipe(string(), isoDate())),
  dateLyricsUpdated: optional(pipe(string(), isoDate())),

  lyrics: array(LyricLineSchema),
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

export type MaruSongGist = Pick<
  MaruSongData,
  'version' | 'youtube' | 'title' | 'artists' | 'tags' | 'dateSongReleased' | 'dateLyricsUpdated'
>
