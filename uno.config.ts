import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { ofetch } from "ofetch";

export default defineConfig({
  shortcuts: [
    {
      'bg-base': 'bg-white dark:bg-black',
      'bg-hover': 'bg-[#8882]',
      'color-base': 'text-#222 dark:text-#ddd',
      'border-base': 'border-gray:20',
      'floating-glass': 'bg-white:70 shadow-lg backdrop-blur-4 dark:bg-black:70 z-floating border border-base rounded-full',

      'box-input': 'box-input-shell box-input-inner focus:(border-primary ring-2 ring-primary:20)',
      'box-input-shell': 'bg-base color-base border-base border rounded-lg focus-within:(border-primary ring-2 ring-primary:20) disabled:(bg-gray:10 color-gray:50)',
      'box-input-inner': 'px2 py1 outline-none w-full bg-base rounded-lg placeholder-gray:50',

      'z-hover': 'z-50',
      'z-floating': 'z-100',
      'z-tooltip': 'z-200',
      'z-dialog': 'z-500',
      'z-dropzone': 'z-1000',
    },
    [/^btn-simple-(.*)$/, ([,color]) => {
      return [
        `hover:border-${color}/50 hover:color-${color}`,
        `active:bg-${color}/10`,
        'disabled:opacity-50 disabled:pointer-events-none',
        `border border-base border-rounded-lg`,
        `flex gap-1 items-center justify-center`,
      ].join(' ')
    }],
  ],
  theme: {
    colors: {
      primary: '#0a9cae',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      customFetch:async (url) => {
        if (url.startsWith("https://fonts.googleapis.com/")) {
          return Promise.resolve({ data: 'pre-fetched Google Fonts data' });
        }
        return await ofetch(url, { ignoreResponseError: true });
      },
      provider: 'google',
      fonts: {
        'sans': 'DM Sans',
        'serif': 'DM Serif Display',
        'mono': 'DM Mono',
        'jp-serif': 'Noto Serif JP',
        'jp-sans': 'Noto Sans JP',
      },
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
