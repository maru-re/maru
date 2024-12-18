<script setup lang="ts">
const { lrc, autoCopy = true } = defineProps<{
  lrc: string
  autoCopy?: boolean
}>()

const { t, locale } = useI18n()

/**
 * 使用正则将歌词中的汉字格式化为 {漢字}() 的形式，防止 GPT 偷懒，gpt-4o 正确率较高，4o-mini 比较快
 * 可以处理已经有部分格式化的歌词，会将其去除
 * 若 () 不匹配将是未定义的行为
 * 翻译行不会被处理
 * @param {string} lrcContent - 输入的LRC歌词字符串
 * @returns {string} - 处理后的LRC歌词字符串
 */
function annotateKanjiInLRC(lrcContent: string): string {
  // 正则表达式逻辑：
  // 1. \{?([\u4E00-\u9FFF々]+)}? 匹配可能带 { 的连续汉字（包括 々）和可能的 }。
  // 2. (\([^\)]*\))? 匹配可能的括号和括号内内容。
  const regex = /\{?([\u4E00-\u9FFF々]+)}?(\([^)]*\))?/g

  // 按行处理LRC内容
  return lrcContent
    .split('\n')
    .map((line) => {
      // 如果行以 [trans: 开头，直接返回原行
      if (line.trim().startsWith('[trans:')) {
        return line
      }
      // 否则替换汉字格式
      return line.replace(regex, (match, p1) => `{${p1}}()`)
    })
    .join('\n')
}

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
    annotateKanjiInLRC(lrc),
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
