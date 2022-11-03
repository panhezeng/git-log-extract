export default {
  'packages/**/src/**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts,vue}': 'yarn run lint:es',
  'packages/**/src/**/*.{html,css,js,jsx,ts,tsx,vue,less}': 'yarn run lint:style',
};
