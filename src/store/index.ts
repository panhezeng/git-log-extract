import { store } from 'quasar/wrappers'
import { InjectionKey } from 'vue'
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex'

import requireContext from "src/utils/require-context";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const initState = {};
export type StateInterface = typeof initState;

// 自动加载所有vuex模块，必须放在 src/store/modules 目录内，而且命名规则为 模块名.module.js
// 文件名的模块名部分，以及 module.name 都来自 src/config/vuex/types 目录内模块配置文件内导出的name
const modules = {} as { [name: string]: any };
requireContext(
  require.context("src/store/", true, /(?<!\.\/index|\.d)\.ts$/)
).forEach(({ module }) => {
  if (Object.prototype.hasOwnProperty.call(module, "names")) {
    if (Object.prototype.hasOwnProperty.call(modules, module.names.module)) {
      throw new Error(
        `已存在同名vuex module ${module.names.module}，请修改命名`
      );
    }
    modules[module.names.module] = module.default;
  }
});

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<any>
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<any>> = Symbol('vuex-key')

export default store(function (/* { ssrContext } */) {
  const Store = createStore<StateInterface>({
    modules,
    state: () => initState,
    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });

  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey)
}
