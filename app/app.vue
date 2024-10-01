<script setup lang="ts">
import { appName } from '~/constants'

import 'floating-vue/dist/style.css'
import './app.css'

useHead({
  title: appName,
})
</script>

<template>
  <div class="texture-overlay" />
  <NuxtPage />
  <ClientOnly>
    <SettingsNav />
    <DropZone />
  </ClientOnly>
</template>
