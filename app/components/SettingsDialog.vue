<script setup lang="ts">
import type { MaruSongDataParsed } from '@marure/schema'
import { isMobileScreen } from '~/state/breakpoints'
import { showSettingsDialog, showShortcutDialog } from '~/state/models'

defineProps<{
  song?: MaruSongDataParsed
  source?: SongDataSource
}>()

const settings = useSettings()
const { t, locale } = useI18n()
</script>

<template>
  <ModalPopup v-model="showSettingsDialog" :direction="isMobileScreen ? 'bottom' : 'top'">
    <div flex p6>
      <div mxa max-w-150 w-full flex="~ col gap-5 items-center">
        <SettingsDialogGroup
          v-if="song && source"
          :title="$t('settings.songActions')"
        >
          <SongActions :song="song" :source="source" type="button" />
        </SettingsDialogGroup>
        <SettingsDialogGroup
          :title="$t('settings.groupLyricsDisplay')"
        >
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
            v-if="locale.startsWith('zh-')"
            v-model="settings.convertChineseHansHant"
            :title="t('settings.convertChineseHansHant')"
          />
        </SettingsDialogGroup>
        <SettingsDialogGroup
          :title="$t('settings.lyricsSize')"
        >
          <div flex="~ col gap-1" w-40>
            <div flex="~ gap-1 items-center">
              <div i-uil-text-size />
              {{ $t("settings.lyricsSize") }}
              <span op50>{{ `${Math.round(settings.fontSize * 100)}%` }}</span>
            </div>
            <OptionSlider v-model="settings.fontSize" :min="0.6" :max="2" :step="0.2" />
          </div>
        </SettingsDialogGroup>
        <SettingsDialogGroup
          :title="$t('settings.groupPlay')"
        >
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
        </SettingsDialogGroup>
        <SettingsDialogGroup
          v-if="!isMobileScreen"
          :title="$t('settings.groupGeneral')"
        >
          <ActionButton
            icon="i-uil-keyboard-alt"
            type="button"
            :title="$t('shortcuts.showTable')"
            @click="showShortcutDialog = !showShortcutDialog"
          />
        </SettingsDialogGroup>
      </div>
    </div>
  </ModalPopup>
</template>
