<script setup lang="ts">
import { isMobileScreen } from '~/state/breakpoints'
import { showShortcutDialog } from '~/state/models'

onKeyStroke('?', () => {
  showShortcutDialog.value = true
})
</script>

<template>
  <ModalPopup v-model="showShortcutDialog" :direction="isMobileScreen ? 'bottom' : 'top'">
    <div flex p6>
      <div mxa max-w-150 w-full flex="~ col gap-5 items-center">
        快捷鍵列表
      </div>
    </div>
  </ModalPopup>
</template>
