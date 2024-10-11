<script setup lang="ts">
import { Tooltip } from 'floating-vue'
import { showSettingsDialog } from '~/state/models'

const route = useRoute()
</script>

<template>
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
</template>
