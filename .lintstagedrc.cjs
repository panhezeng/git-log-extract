module.exports = {
  'packages/**/src/**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts,vue}': 'eslint --cache --fix',
  'packages/**/src/**/*.{ts,tsx,cts,mts,vue}': 'npm run type-check',
};
