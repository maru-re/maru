<script setup lang="ts">
import { isMobileScreen } from '~/state/breakpoints'
import { showShortcutDialog } from '~/state/models'

onKeyStroke('?', () => {
  showShortcutDialog.value = !showShortcutDialog.value
})

const { t } = useI18n()

useShortcutsRegistry(() => ({
  title: t('shortcuts.general'),
  key: 'general',
  shortcuts: [
    { title: t('shortcuts.showTable'), combos: [['?'], ['Shift', '/']] },
  ],
}))

const groups = getShortcutsGroups()
</script>

<template>
  <ModalPopup
    v-model="showShortcutDialog"
    :direction="isMobileScreen ? 'bottom' : 'right'"
    :dialog-class="isMobileScreen ? 'w-full' : 'w-100!'"
  >
    <div flex p6>
      <div mxa max-w-200 w-full flex="~ col gap-5 items-center">
        {{ $t('shortcuts.table') }}
        <div w-full flex="~ col gap-10">
          <div v-for="group of groups" :key="group.key">
            <div flex="~ gap-3 justify-center items-center" mb2>
              <div border="t base" h-1px w-15 />
              <span text-sm op50>{{ group.title }}</span>
              <div border="t base" h-1px w-15 />
            </div>
            <div>
              <ShortcutItem
                v-for="item of group.shortcuts"
                :key="item.title"
                :title="item.title"
                :keys="item.combos"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalPopup>
</template>
