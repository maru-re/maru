<script setup lang="ts">
import { appName } from '~/constants'

import 'floating-vue/dist/style.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './app.css'

useHead({
  title: appName,
})
</script>

<template>
  <div class="texture-overlay" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <div fixed right-3 top-3 flex="~ gap-2" lt-lg="hidden">
    <DarkToggle class="p2 floating-glass" />
    <I18nSelector class="p2 floating-glass" />
  </div>
</template>
