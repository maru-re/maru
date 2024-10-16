export default defineComponent({
  setup() {
    const { locale } = useI18n()
    const components = import.meta.glob('./About.*.md') as Record<string, () => Promise<{ default: string }>>

    const component = computed(() => {
      const key = `./About.${locale.value}.md`
      const defaultKey = './About.zh-Hant.md'
      const importComponent = components[key] || components[defaultKey]!
      return defineAsyncComponent(importComponent ?? (() => Promise.resolve({ default: () => 'undefined' })))
    })
    return () => component.value ? h(component.value) : h('div', 'Loading...')
  },
})
