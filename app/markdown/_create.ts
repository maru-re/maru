import { Fragment } from 'vue'

export function createMarkdownComponent(
  name: string,
  entries: Record<string, () => unknown>,
) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs }) {
      const { locale, t } = useI18n()
      const components = Object.fromEntries(
        Array.from(Object.entries(entries)
          .map(([key, value]) => [key.match(/\.([\w\-]+)\.\w+$/)![1], value]),
        ),
      )

      const usingFallback = computed(() => !components[locale.value])
      const component = shallowRef<any>()

      watch(locale, async () => {
        const mod = await (components[locale.value] || components['zh-Hant'])()
        component.value = mod.default
      }, {
        immediate: true,
      })

      return () => component.value
        ? usingFallback.value
          ? h(Fragment, [
            // @unocss-include
            h('div', { class: 'mb5 rounded bg-purple:15 px3 py1 text-purple' }, [
              t('messages.contentMissingTranslations'),
            ]),
            h(component.value, attrs),
          ])
          : h(component.value, attrs)
        : null
    },
  })
}
