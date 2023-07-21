/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  // parserOptions: {
  //   parser: {
  //     ts: '@typescript-eslint/parser',
  //     tsx: '@typescript-eslint/parser',
  //   },
  //   // parser: require.resolve('@typescript-eslint/parser'),
  //   extraFileExtensions: ['.vue'],
  //   ecmaFeatures: {
  //     jsx: true,
  //   },
  // },
  rules: {
    'no-var': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    // allow debugger during development only
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
  },
  // overrides: [{ files: ['**/*.{ts,tsx}'] }],
}
