<script setup lang="ts">
const settings = useSettings()
const { t, locale } = useI18n()
</script>

<template>
  <div flex p6>
    <div mxa max-w-120 w-full>
      <div flex="~ gap-3 wrap items-center justify-center">
        <ToggleButton
          v-model="settings.furigana"
          icon="i-uil-letter-japanese-a"
          :title="t('settings.displayFurigana')"
        />
        <ToggleButton
          v-model="settings.kanji"
          icon="i-uil-letter-chinese-a"
          :title="t('settings.displayKanji')"
        />
        <ToggleButton
          v-model="settings.romaji"
          icon="i-uil-letter-english-a"
          :title="t('settings.displayRomaji')"
        />
        <ToggleButton
          v-model="settings.translation"
          icon="i-uil-english-to-chinese"
          :title="t('settings.displayTranslation')"
        />
        <ToggleButton
          v-model="settings.follow"
          icon="i-uil-right-indent-alt"
          :title="t('settings.scrollWithLyrics')"
        />
        <ToggleButton
          v-model="settings.autoPause"
          icon="i-uil-pause-circle"
          :title="t('settings.autoPausePerLyrics')"
        />

        <ToggleButton
          v-model="settings.loopSong"
          icon="i-uil-redo"
          :title="t('settings.loopSong')"
        />

        <ToggleButton
          v-if="locale.startsWith('zh-')"
          v-model="settings.convertChineseHansHant"
          :title="t('settings.convertChineseHansHant')"
        />
      </div>
    </div>
  </div>
</template>
