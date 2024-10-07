import type { CreatePlainShikiReturns, MountPlainShikiOptions } from 'plain-shiki'
import type { HighlighterCore, LanguageRegistration } from 'shiki/core'
import { createPlainShiki } from 'plain-shiki'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import grammarYaml from 'shiki/langs/yaml.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import grammarLyric from 'shiki-language-lyric'

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
  lang: 'lyric' | 'lyric-inline' | 'yaml'
}

let shikiPromise: Promise<HighlighterCore> | undefined

export function usePlainShiki(
  el: MaybeRefOrGetter<HTMLElement | null>,
  options: UsePlainShikiOptions,
) {
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
      langs: [grammarLyric, grammarLyricInline, grammarYaml],
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
