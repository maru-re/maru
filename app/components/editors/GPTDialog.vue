<script setup lang="ts">
const { lrc, autoCopy = true } = defineProps<{
  lrc: string
  autoCopy?: boolean
}>()

const { t, locale } = useI18n()

const gptText = computed(() => {
  return [
    `We use an extended LRC format:`,
    `1. \`{漢字}(かんじ)\` to annotate Kanji with Furigana, curly braces for Kanji and parentheses for Furigana.`,
    `2. After each lyrics, we use a new line \`[trans:<locale>]\` to annotate translations.`,
    '',
    'Here is a full example:',
    '```lrc',
    `[00:00.80] {明日}(あした){世界}(せかい)は{終}(お)わるんだって`,
    `[trans:zh-Hant] 話說明天世界就要結束了`,
    `[00:03.75] {君}(きみ)にはもう{会}(あ)えないんだって`,
    `[trans:zh-Hant] 話說再也見不到你了`,
    '```',
    '',
    `Please annotate the Kanji in the following lyrics, add translation for \`${locale.value}\`, and keeping the rest unchanged.`,
    '',
    '```lrc',
    lrc,
    '```',
    ``,
    t('gpt.prompts.useLocaleToResponse'),
  ].join('\n')
})

const { copied, copy } = useClipboard({ read: false, source: gptText })

onMounted(() => {
  if (autoCopy)
    copy()
})
</script>

<template>
  <div flex="~ col gap-2" p6>
    <div flex="~ gap-2 justify-center">
      <SimpleButton :icon="copied ? 'i-uil-check text-green5' : 'i-uil-clipboard'" @click="copy()">
        {{ $t('gpt.copyPrompts') }}
      </SimpleButton>
      <SimpleButton to="https://chatgpt.com" target="_blank" rel="noopener" icon="i-simple-icons-openai">
        {{ $t('gpt.gotoChatGptAndPaste') }}
      </SimpleButton>
    </div>
    <div text-center op50>
      {{ $t('gpt.noteAboutPrompts') }}
    </div>
    <pre mxa max-w-200 of-auto rounded-xl bg-hex-888:15 px3 py2 text-sm max-h-50dvh v-text="gptText" />
  </div>
</template>
