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

export default defineConfig({
  shortcuts: {
    'bg-base': 'bg-white dark:bg-black',
    'bg-hover': 'bg-[#8882]',
    'color-base': 'text-#222 dark:text-#ddd',
    'border-base': 'border-gray:20',
    'floating-glass': 'bg-white:70 shadow-lg backdrop-blur-4 dark:bg-black:70 z-floating border border-base rounded-full',

    'z-floating': 'z-100',
    'z-tooltip': 'z-200',
  },
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
