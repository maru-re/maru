<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { Menu, Tooltip } from 'floating-vue'
import { useSettings, useTranslationSettings } from '~/composables/settings'

const props = defineProps<{
  song: MaruSongDataParsed
}>()
const settings = useSettings()
const { locales } = useI18n()

const translationOptions = computed(() => {
  return locales.value.filter(v => props.song.lyricLocales.includes(v.code))
})
const { translationBoolean, translationValue, setDisplayTranslation } = useTranslationSettings(translationOptions)
</script>

<template>
  <div
    flex="~ gap-2 items-center"
    w-max p2 floating-glass
  >
    <Tooltip placement="top">
      <IconToggle v-model="settings.furigana" icon="i-uil-letter-japanese-a" />
      <template #popper>
        <div>
          <div mb1>
            {{ $t("settings.displayFurigana") }}
          </div>
          <div font-jp-serif>
            <span>漢字</span>
            <span i-uil-arrow-right mx1>-></span>
            <ruby>
              <rb>漢字</rb>
              <rt text-0.625em text-orange>かんじ</rt>
            </ruby>
          </div>
        </div>
      </template>
    </Tooltip>
    <Tooltip placement="top">
      <IconToggle v-model="settings.kanji" icon="i-uil-letter-chinese-a" />
      <template #popper>
        <div>
          <div mb1>
            {{ $t("settings.displayKanji") }}
          </div>
          <div font-jp-serif>
            <span>かんじ</span>
            <span i-uil-arrow-right mx1>-></span>
            <span>漢字</span>
          </div>
        </div>
      </template>
    </Tooltip>
    <Tooltip placement="top">
      <IconToggle v-model="settings.romaji" icon="i-uil-letter-english-a" />
      <template #popper>
        <div>
          <div mb1>
            {{ $t("settings.displayRomaji") }}
          </div>
          <div>
            <span font-jp-serif>面白い</span>
            <span i-uil-arrow-right mx1>-></span>
            <span>o mo shi ro i</span>
          </div>
        </div>
      </template>
    </Tooltip>
    <Menu placement="top">
      <IconToggle v-model="translationBoolean" icon="i-uil-english-to-chinese" />
      <template #popper>
        <div px4 py3 flex="~ col gap-2">
          <div>
            {{ $t("settings.displayTranslation") }}
          </div>
          <SimpleButton
            v-for="_locale in translationOptions" :key="_locale.code"
            :class="_locale.code !== translationValue && 'op50'"
            :title="_locale.name"
            @click="setDisplayTranslation(_locale.code)"
          />
        </div>
      </template>
    </Menu>
    <Menu placement="top">
      <IconButton
        :class="settings.fontSize.toString() === '1' ? 'op40 @hover:color-base! @hover:op100' : 'color-primary'"
        icon="i-uil-text-size"
        @click="settings.fontSize = 1"
      />
      <template #popper>
        <div flex="~ col gap-2" w-50 px4 py3>
          <div>
            {{ $t("settings.lyricsSize") }}
            <span op50>{{ `${Math.round(settings.fontSize * 100)}%` }}</span>
          </div>
          <OptionSlider v-model="settings.fontSize" :min="0.6" :max="2" :step="0.2" :default="1" />
        </div>
      </template>
    </Menu>
    <div class="setting-nav-divider" />
    <Tooltip placement="top">
      <IconToggle v-model="settings.follow" icon="i-uil-right-indent-alt" />
      <template #popper>
        <div>
          {{ $t("settings.scrollWithLyrics") }}
        </div>
      </template>
    </Tooltip>
    <Tooltip placement="top">
      <IconToggle v-model="settings.autoPause" icon="i-uil-pause-circle" />
      <template #popper>
        <div>
          {{ $t("settings.autoPausePerLyrics") }}
        </div>
      </template>
    </Tooltip>
  </div>
</template>

<style>
.setting-nav-divider {
  --uno: 'border-t-0 border-base border-r h-20px w-1px flex-none';
}
</style>
