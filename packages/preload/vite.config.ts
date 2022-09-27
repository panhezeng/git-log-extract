import {join} from 'path';
import {defineConfig} from 'vite';
import {chrome} from '../../.electron-vendors.cache.json';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
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
  plugins: [],
});
