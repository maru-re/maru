import { createPlainShiki, type CreatePlainShikiReturns, type MountPlainShikiOptions } from 'plain-shiki'
import { type BundledLanguage, createHighlighterCore, createOnigurumaEngine } from 'shiki'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import lyric from 'shiki-language-lyric'

export type UsePlainShikiOptions = Omit<MountPlainShikiOptions, 'lang'> & {
  lang: MaybeRefOrGetter<BundledLanguage>
}

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
        lang: lang.value,
      })
    }
  })

  tryOnMounted(async () => {
    const shiki = await createHighlighterCore({
      langs: [lyric],
      themes: [vitesseLight, vitesseDark],
      engine: createOnigurumaEngine(() => import('@shikijs/core/wasm-inlined')),
    })

    plain = createPlainShiki(shiki)
    trigger()
  })

  tryOnUnmounted(() => {
    ctx?.dispose()
  })
}
