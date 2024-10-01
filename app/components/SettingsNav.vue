<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import { Menu, Tooltip } from 'floating-vue'
import { useSettings } from '~/composables/settings'

const settings = useSettings()
const route = useRoute()

const bp = useBreakpoints(breakpointsTailwind)

const isPlayer = computed(() => route.path.startsWith('/songs') || route.path.startsWith('/demo'))
</script>

<template>
  <div
    flex="~ col gap-2 items-center"
    fixed right-3 top-3 w-max p2 floating-glass
    lt-md="top-unset bottom-3 right-3 flex-row-reverse"
  >
    <DarkToggle />
    <template v-if="isPlayer">
      <div border="t base" h-1px w-20px flex-none lt-md="border-t-0 border-r h-20px w-1px" />
      <Tooltip placement="left">
        <IconToggle v-model="settings.furigana" icon="i-uil-letter-japanese-a" />
        <template #popper>
          <div>
            <div mb1>
              是否顯示振假名
            </div>
            <div font-jp-serif>
              <span>漢字</span>
              <span i-uil-arrow-right mx1>-></span>
              <ruby>
                <rb>漢字</rb>
                <rt text-orange>かんじ</rt>
              </ruby>
            </div>
          </div>
        </template>
      </Tooltip>
      <Tooltip placement="left">
        <IconToggle v-model="settings.kanji" icon="i-uil-letter-chinese-a" />
        <template #popper>
          <div>
            <div mb1>
              是否顯示漢字
            </div>
            <div font-jp-serif>
              <span>かんじ</span>
              <span i-uil-arrow-right mx1>-></span>
              <span>漢字</span>
            </div>
          </div>
        </template>
      </Tooltip>
      <Tooltip placement="left">
        <IconToggle v-model="settings.romaji" icon="i-uil-letter-english-a" />
        <template #popper>
          <div>
            <div mb1>
              是否顯示羅馬字
            </div>
            <div>
              <span font-jp-serif>面白い</span>
              <span i-uil-arrow-right mx1>-></span>
              <span>o mo shi ro i</span>
            </div>
          </div>
        </template>
      </Tooltip>
      <Tooltip placement="left">
        <IconToggle v-model="settings.translation" icon="i-uil-english-to-chinese" />
        <template #popper>
          <div>
            是否顯示翻譯
          </div>
        </template>
      </Tooltip>
      <Menu placement="left">
        <IconButton icon="i-uil-text-size" />
        <template #popper>
          <div px4 py2>
            <div>
              歌詞字號
            </div>
            <div>
              <input v-model="settings.fontSize" type="range" min="0.6" max="2" step="0.2">
            </div>
          </div>
        </template>
      </Menu>
      <div border="t base" h-1px w-20px flex-none lt-md="border-t-0 border-r h-20px w-1px" />
      <Tooltip placement="left">
        <IconToggle v-model="settings.follow" icon="i-uil-right-indent-alt" />
        <template #popper>
          <div>
            跟隨歌詞滾動
          </div>
        </template>
      </Tooltip>
      <Tooltip placement="left">
        <IconToggle v-model="settings.autoPause" icon="i-uil-pause-circle" />
        <template #popper>
          <div>
            每句歌詞自動暫停
          </div>
        </template>
      </Tooltip>
    </template>
    <template v-if="route.path !== '/' && bp.isSmaller('md')">
      <div border="t base" h-1px w-20px flex-none lt-md="border-t-0 border-r h-20px w-1px" />
      <Tooltip placement="left">
        <IconButton to="/" icon="i-uil-angle-left-b" />
        <template #popper>
          <div>
            返回首頁
          </div>
        </template>
      </Tooltip>
    </template>
  </div>
</template>
