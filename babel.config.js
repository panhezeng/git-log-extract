// /* eslint-env node */
// module.exports = {
//   presets: ['@quasar/babel-preset-app', '@vue/cli-plugin-babel/preset'],
// };

/* eslint-env node */

module.exports = api => {
  return {
    presets: [
      [
        '@quasar/babel-preset-app',
        api.caller(caller => caller && caller.target === 'node')
          ? { targets: { node: 'current' } }
          : {}
      ]
    ]
  }
}


