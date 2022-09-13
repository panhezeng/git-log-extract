/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */

import requireContext from './utils/require-context';

// 自动加载 module/preload 目录下非 *exclude.js命名规则的 js 文件，并执行 export default function
requireContext(
  require.context('./module/preload', true, /(?<!exclude)\.ts$/)
).forEach(({ module }) => {
  if (module && typeof module.default === 'function') {
    module.default();
  }
});
