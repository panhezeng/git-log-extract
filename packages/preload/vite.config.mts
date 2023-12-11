import {chrome} from '../../.electron-vendors.cache.json';
import {preload} from 'unplugin-auto-expose';
import {join} from 'node:path';
import {injectAppVersion} from '../../version/inject-app-version-plugin.mjs';
import {defineConfig} from 'vite';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */

export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      '@/preload/': join(PACKAGE_ROOT, 'src') + '/',
      '@/common/': join(PACKAGE_ROOT, '../common/src') + '/',
    },
  },
  build: {
    ssr: true,
    sourcemap: 'inline',
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  plugins: [preload.vite(), injectAppVersion()],
});
