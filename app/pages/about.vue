<script setup lang="ts">
import enAbout from '@/static/content/en/about.md'
import jpAbout from '@/static/content/jp/about.md'
import zhHansAbout from '@/static/content/zh-Hans/about.md'
import zhHantAbout from '@/static/content/zh-Hant/about.md'

const { locale } = useI18n()
const localeAbout = computed(() => {
  switch (locale.value) {
    case 'en':
      return enAbout
    case 'ja':
      return jpAbout
    case 'zh-Hans':
      return zhHansAbout
    case 'zh-Hant':
      return zhHantAbout
    default:
      return enAbout
  }
})

definePageMeta({
  layout: 'content',
})
</script>

<template>
  <NuxtLayout>
    <component :is="localeAbout" />
  </NuxtLayout>
</template>
