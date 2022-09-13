/* eslint-env node */
/**

 https://www.electronjs.org/docs/api/context-bridge

 api 方法有限制，具体看文档，重点注意不能是构造函数和类，参数和返回结果最好简单，不能有构造函数和类，响应式对象需要 toRaw(data) 或 unref(data) 或 JSON.parse(JSON.stringify(data))
 命名请用 electron 开头，因为 api 会挂载在 window ，避免覆盖 window 原生 api
 */

import { contextBridge } from 'electron';

export default () => {
  contextBridge.exposeInMainWorld('electronExample', {
    example: () => 'example',
  });
};
