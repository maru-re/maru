import type { CreatePlainShikiReturns, MountPlainShikiOptions } from 'plain-shiki'
import type { HighlighterCore, LanguageRegistration } from 'shiki/core'
import { createPlainShiki } from 'plain-shiki'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'

const grammarLyric: LanguageRegistration = {
  // $schema: 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
  displayName: 'Lyric',
  fileTypes: [
    'lrc',
  ],
  name: 'lyric',
  scopeName: 'source.lyric',
  patterns: [
    {
      include: '#line',
    },
  ],
  repository: {
    'line': {
      begin: '^\\s*(\\[)([^\\]]*?)(\\])',
      beginCaptures: {
        1: {
          name: 'punctuation.begin.lyric',
        },
        2: {
          patterns: [
            {
              include: '#timestamp',
            },
            {
              include: '#key-value',
            },
          ],
        },
        3: {
          name: 'punctuation.end.lyric',
        },
      },
      end: '$',
      // name: 'string.lyric',
      patterns: [
        {
          include: '#text',
        },
      ],
    },
    'timestamp': {
      match: '(\\d{2})(:)(\\d{2})(\\.)(\\d{2,})',
      captures: {
        1: {
          name: 'constant.numeric.minute.lyric',
        },
        2: {
          name: 'punctuation.separator.colon.lyric',
        },
        3: {
          name: 'constant.numeric.second.lyric',
        },
        4: {
          name: 'punctuation.separator.dot.lyric',
        },
        5: {
          name: 'constant.numeric.millisecond.lyric',
        },
      },
    },
    'key-value': {
      match: '([^:]+)(:)(.*)',
      captures: {
        1: {
          name: 'variable.other.key.lyric',
        },
        2: {
          name: 'punctuation.separator.colon.lyric',
        },
        3: {
          name: 'string.value.lyric',
        },
      },
    },
    'text': {
      patterns: [
        {
          include: '#ruby',
        },
      ],
    },
    'ruby': {
      match: '(\\{)([^}]*)(\\})(\\()([^(]*)(\\))',
      captures: {
        1: {
          name: 'punctuation.definition.begin.lyric',
        },
        2: {
          name: 'constant.lyric',
        },
        3: {
          name: 'punctuation.definition.end.lyric',
        },
        4: {
          name: 'punctuation.brace.begin.lyric',
        },
        5: {
          name: 'variable.ruby.lyric',
        },
        6: {
          name: 'punctuation.brace.end.lyric',
        },
      },
    },
  },
}

const grammarLyricInline: LanguageRegistration = {
  ...grammarLyric,
  name: 'lyric-inline',
  scopeName: 'source.lyric.inline',
  patterns: [
    {
      include: '#text',
    },
  ],
}

export type UsePlainShikiOptions = Omit<MountPlainShikiOptions, 'lang'> & {
  lang: 'lyric' | 'lyric-inline'
}

let shikiPromise: Promise<HighlighterCore> | undefined

export function usePlainShiki(el: MaybeRefOrGetter<HTMLElement | null>, options: UsePlainShikiOptions) {
  const target = toRef(el)
  const lang = toRef(options.lang)

  let plain: CreatePlainShikiReturns
  let ctx: ReturnType<(typeof plain)['mount']>

  const { trigger } = watchTriggerable([target, lang], () => {
    ctx?.dispose()
    if (target.value) {
      ctx = plain?.mount(target.value, {
        ...options,
        lang: lang.value as any,
      })
    }
  })

  tryOnMounted(async () => {
    shikiPromise ||= createHighlighterCore({
      langs: [grammarLyric, grammarLyricInline],
      themes: [vitesseLight, vitesseDark],
      engine: createJavaScriptRegexEngine(),
    })

    plain = createPlainShiki(await shikiPromise)
    trigger()
  })

  tryOnUnmounted(() => {
    ctx?.dispose()
  })
}
