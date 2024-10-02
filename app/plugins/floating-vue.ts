import FloatingVue from 'floating-vue'
// @ts-expect-error Missing types
import VueVirtualScroller from 'vue-virtual-scroller'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue, {
    overflowPadding: 10,
  })
  nuxtApp.vueApp.use(VueVirtualScroller)
})
