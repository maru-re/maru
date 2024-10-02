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
  <div fixed right-3 top-3 p2 floating-glass lt-lg="hidden">
    <DarkToggle />
  </div>
  <DropZone />
  <ImportDialog />
</template>
