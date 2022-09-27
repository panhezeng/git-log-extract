/* eslint-env node */

import {quasar, transformAssetUrls} from '@quasar/vite-plugin';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import {join} from 'path';
import {defineConfig} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';
import {chrome} from '../../.electron-vendors.cache.json';
import {appTitle} from '../common/src/index.json';
const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '@/renderer/': join(PACKAGE_ROOT, 'src') + '/',
      '@/common/': join(PACKAGE_ROOT, '../common/src') + '/',
    },
  },
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html'),
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  plugins: [
    vue({
      template: {transformAssetUrls},
    }),
    vueJsx(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: appTitle,
        },
      },
    }),
    quasar(),
  ],
});
