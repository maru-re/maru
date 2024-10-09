import zht from './zh-Hant.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'zh-Hant',
  fallbackLocale: 'zh-Hant',
  messages: {
    'zh-Hant': zht,
  },
}))
