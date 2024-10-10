<script setup lang="ts">
import { Tooltip } from 'floating-vue'
import { appName } from '~/constants'

import { showSettingsDialog } from '~/state/models'

import 'floating-vue/dist/style.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './app.css'

useHead({
  title: appName,
})

const route = useRoute()
</script>

<template>
  <div class="texture-overlay" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <div fixed right-3 top-3 flex="~ gap-2" z-floating lt-lg="bottom-3 left-3 top-unset right-unset" class="p2 floating-glass">
    <DarkToggle />
    <I18nSelector v-if="route.path === '/'" />
    <Tooltip placement="bottom">
      <IconButton
        icon="i-uil-setting"
        @click="showSettingsDialog = !showSettingsDialog"
      />
      <template #popper>
        <div>
          設定
        </div>
      </template>
    </Tooltip>
  </div>

  <ModalPopup v-model="showSettingsDialog" direction="top">
    <SettingsPanel />
  </ModalPopup>
</template>
