import { fileURLToPath } from 'node:url'
import { execaSync } from 'execa'
import MarkdownItMagicLink from 'markdown-it-magic-link'
import { appDescription, appName } from './app/constants'
import { dependencies } from './package.json'

const gitSha = execaSync('git', ['rev-parse', 'HEAD']).stdout.trim()

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    'nuxt-compile-markdown',
    '@nuxtjs/i18n',
  ],

  ssr: false,

  markdown: {
    shiki: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    },
    markdownItSetup(md) {
      md.use(MarkdownItMagicLink, {
        linksMap: {
          QiFi: 'https://github.com/qifi-dev/qrs',
        },
        imageOverrides: [
          ['https://github.com/qifi-dev/qrs', 'https://cdn.jsdelivr.net/gh/qifi-dev/qrs/public/logo.svg'],
        ],
      })
    },
  },

  runtimeConfig: {
    public: {
      buildTime: Date.now(),
      sha: gitSha,
    },
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
    scanPageMeta: false,
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    disableTransition: true,
    classSuffix: '',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    preset: 'netlify-static',
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-TW',
      },
      title: appName,
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        // { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        {
          rel: 'prefetch',
          href: 'https://www.youtube.com/iframe_api',
        },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: 'black' },
      ],
    },
  },

  devtools: {
    enabled: false,
  },

  features: {
    // For UnoCSS
    inlineStyles: false,
  },

  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
    transform: {
      include: [/\.vue/, /\.md/],
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  vite: {
    optimizeDeps: {
      include: [
        'unstorage/drivers/indexedb',
        ...Object.keys(dependencies),
      ],
      exclude: [
        'shiki',
      ],
    },
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => ['rb'].includes(tag),
    },
  },

  alias: {
    '@marure/romaji': fileURLToPath(new URL('./packages/romaji/src/index.ts', import.meta.url)),
    '@marure/schema': fileURLToPath(new URL('./packages/schema/src/index.ts', import.meta.url)),
    '@marure/parser': fileURLToPath(new URL('./packages/parser/src/index.ts', import.meta.url)),
    '@marure/utils': fileURLToPath(new URL('./packages/utils/src/index.ts', import.meta.url)),
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
      },
    },
  },

  i18n: {
    langDir: '../app/locales',
    locales: [
      { code: 'zh-Hant', language: 'zh-Hant', name: '繁體中文', file: 'zh-Hant.json' },
      { code: 'zh-Hans', language: 'zh-Hans', name: '简体中文', file: 'zh-Hans.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ja', language: 'ja', name: '日本語', file: 'ja.json' },
    ],
    defaultLocale: 'zh-Hant',
    strategy: 'no_prefix',
    vueI18n: './app/locales/i18n.config.ts',
  },

  compatibilityDate: '2024-08-14',
})
