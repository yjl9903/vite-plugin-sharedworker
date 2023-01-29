import { defineConfig } from 'vite';

import {
  presetUno,
  presetIcons,
  presetWebFonts,
  presetTypography,
  presetAttributify,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss';
import Uno from 'unocss/vite';

import BuildInfo from 'vite-plugin-info';
import SharedWorker from 'vite-plugin-sharedworker';

export default defineConfig({
  plugins: [
    BuildInfo(),
    SharedWorker(),
    Uno({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.1,
          extraProperties: {
            height: '1em',
            'flex-shrink': '0',
            display: 'inline-block'
          }
        }),
        presetWebFonts({
          provider: 'google',
          fonts: {
            sans: ['Inter', 'Noto Sans Simplified Chinese'],
            mono: 'Input Mono'
          }
        }),
        presetTypography()
      ],
      transformers: [transformerDirectives(), transformerVariantGroup()],
      shortcuts: {
        button: 'inline-flex items-center justify-center rounded-2 cursor-pointer select-none p2',
        'border-base': 'border-gray/40 dark:border-gray/40',
        'text-base-50': 'text-neutral-50 dark:text-light-50',
        'text-base-100': 'text-neutral-100 dark:text-light-100',
        'text-base-200': 'text-neutral-200 dark:text-light-200',
        'text-base-300': 'text-neutral-300 dark:text-light-300',
        'text-base-400': 'text-neutral-400 dark:text-light-400',
        'text-base-500': 'text-neutral-500 dark:text-light-500',
        'text-base-600': 'text-neutral-600 dark:text-light-600',
        'text-base-700': 'text-neutral-700 dark:text-light-700',
        'text-base-800': 'text-neutral-800 dark:text-light-800',
        'text-base-900': 'text-neutral-900 dark:text-light-900'
      },
      theme: {
        colors: {
          'main-50': '#fafafa',
          'main-100': '#f5f5f5',
          'main-200': '#e5e5e5',
          'main-300': '#d4d4d4',
          'main-400': '#a3a3a3',
          'main-500': '#737373',
          'main-600': '#525252',
          'main-700': '#404040',
          'main-800': '#262626',
          'main-900': '#171717'
        },
        boxShadow: {
          box: '0 2px 3px rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 10%)'
        }
      }
    })
  ]
});
