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
 *   const { contextBridge } = require('electron')
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */

/**

https://www.electronjs.org/docs/api/context-bridge

api 方法有限制，具体看文档，重点注意不能是构造函数和类，参数和返回结果最好简单，不能有构造函数和类，响应式对象需要 toRaw(data) 或 unref(data) 或 JSON.parse(JSON.stringify(data))
 命名请用 electron 开头，因为 api 会挂载在 window ，避免覆盖 window 原生 api
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