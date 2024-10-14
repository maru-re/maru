export default defineComponent({
  setup() {
    const { locale } = useI18n()
    const components = Object.fromEntries(
      Array.from(Object.entries(import.meta.glob('./QifiHowToScan.*.md'))
        .map(([key, value]) => [key.match(/\.([\w\-]+)\.\w+$/)![1], value]),
      ),
    )

    // const usingFallback = computed(() => !components[locale.value])
    const component = shallowRef<any>()

    watch(locale, async () => {
      const mod = await (components[locale.value] || components['zh-Hant'])()
      component.value = mod.default
    }, {
      immediate: true,
    })

    return () => component.value ? h(component.value) : null
  },
})
