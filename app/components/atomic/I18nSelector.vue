<script setup lang="ts">
import { Menu } from 'floating-vue'

const { locale, locales, setLocale } = useI18n()
</script>

<template>
  <Menu placement="top">
    <IconButton icon="i-ph-translate" />
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
  </Menu>
</template>
