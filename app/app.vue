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
</template>
