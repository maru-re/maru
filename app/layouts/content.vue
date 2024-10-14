<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()

const isMatchedLocale = computed(() => locale.value === route.meta.locale)
</script>

<template>
  <div
    class="markdown-content"
    mxa max-w-175 p15 lt-lg="p6 mt-20" line-height-1.7em
  >
    <BasicNav />
    <div v-if="!isMatchedLocale" mb5 rounded bg-purple:15 px3 py1 text-purple>
      {{ t('messages.contentMissingTranslations') }}
    </div>
    <slot />
  </div>
</template>
