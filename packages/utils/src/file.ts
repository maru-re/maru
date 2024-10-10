export function normalizeFilename(str: string) {
  return str.replace(/[^\w\-\p{Script=Han}\p{Script=Katakana}\p{Script=Hiragana}]+/gu, '_')
}
