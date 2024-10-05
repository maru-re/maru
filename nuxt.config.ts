import { fileURLToPath } from 'node:url'
import { appDescription, appName } from './app/constants'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    'nuxt-compile-markdown',
  ],

  ssr: false,

  markdown: {
    shiki: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
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
        'fuse.js',
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
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
      },
    },
  },

  compatibilityDate: '2024-08-14',
})
