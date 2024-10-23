<script setup lang="ts">
import { Dropdown, Menu } from 'floating-vue'
import { isMobileScreen } from '~/state/breakpoints'

const { locale, locales, setLocale } = useI18n()
</script>

<template>
  <component
    :is="isMobileScreen ? Dropdown : Menu"
    placement="top"
  >
    <IconButton icon="i-uil-english-to-chinese" />
    <template #popper>
      <div p2 flex="~ col gap-1">
        <SimpleButton
          v-for="_locale in locales" :key="_locale.code"
          :class="_locale.code !== locale && 'op50'"
          :title="_locale.name"
          @click="setLocale(_locale.code)"
        />
      </div>
    </template>
  </component>
</template>
