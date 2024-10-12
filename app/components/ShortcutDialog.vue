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
      <div mxa max-w-200 w-full flex="~ col gap-5 items-center">
        快捷鍵列表
        <div w-full grid="~ md:cols-[1fr_1fr] gap-5">
          <ShortcutDialogGroup title="GLOBAL">
            <ShortcutItem title="打開說明列表" :keys="[['?'], ['shift', '/']]" />
          </ShortcutDialogGroup>
        </div>
      </div>
    </div>
  </ModalPopup>
</template>
