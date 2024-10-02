<script setup lang="ts">
import { useImportingState } from '~/composables/import'
import SongsGrid from './SongsGrid.vue'

const state = useImportingState()

function onClickOutside() {
  if (state.value.isFinished) {
    state.value = {
      isImporting: false,
      isFinished: false,
      count: 0,
      failed: [],
      succeeded: [],
    }
  }
}
</script>

<template>
  <ModalDialog
    :model-value="state.isImporting"
    dialog-class="w-80vw! h-80vh grid grid-rows-[max-content_1fr_max-content] p0!"
    @click-outside="onClickOutside"
  >
    <div p2 text-xl flex="~ gap-2 items-center justify-center" border="b base">
      <div flex="~ auto gap-2 items-center justify-start" px-2>
        <template v-if="!state.isFinished">
          <div i-svg-spinners-8-dots-rotate />
          匯入檔案中... <span op50>({{ state.count }})</span>
        </template>
        <template v-else-if="!state.failed.length">
          <div i-uil-check-circle text-green6 dark:text-green />
          <div text-green6 dark:text-green>
            匯入完成！
          </div>
        </template>
        <template v-else-if=" !state.succeeded.length">
          <div i-uil-times-circle text-red6 dark:text-red />
          <div text-red6 dark:text-red>
            匯入失敗！
          </div>
        </template>
        <template v-else>
          <div i-uil-check-circle text-amber6 dark:text-amber />
          <div text-amber6 dark:text-amber>
            部分匯入成功！
          </div>
        </template>
      </div>
      <SimpleButton text-sm :class="state.isFinished ? '' : 'op0 pointer-events-none'" @click="onClickOutside()">
        <div i-uil-check />
        完成
      </SimpleButton>
    </div>
    <div of-auto>
      <div v-if="state.failed.length" border="b base" p6>
        <div text-red6 dark:text-red>
          匯入失敗
          <span op50>({{ state.failed.length }})</span>
        </div>
        <div flex="~ col gap-2" py2>
          <template v-for="i, idx in state.failed" :key="idx">
            <div flex="~ gap-1 items-center">
              <div i-uil-file-question-alt />
              <div op75>
                {{ i.filename }}
              </div>
              <div op50>
                -
              </div>
              <div text-red6 saturate-50 dark:text-red>
                {{ i.error }}
              </div>
            </div>
          </template>
        </div>
      </div>
      <div p6>
        <div>
          成功匯入
          <span op50>({{ state.succeeded.length }})</span>
        </div>
        <SongsGrid :songs="state.succeeded.map(i => i.data)" />
      </div>
    </div>
  </ModalDialog>
</template>
