import { store } from "quasar/wrappers";
import Vuex from "vuex";
import requireContext from "@/utils/require-context";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  example: unknown;
}

// const state: StateInterface = { example: "" };

// 自动加载所有vuex模块，必须放在 src/store/modules 目录内，而且命名规则为 模块名.module.js
// 文件名的模块名部分，以及 module.name 都来自 src/config/vuex/types 目录内模块配置文件内导出的name
const modules = {} as any;
requireContext(
  require.context("@/store/", true, /(?<!\.\/index|\.d)\.ts$/)
).forEach(({ module }: any) => {
  if (Object.prototype.hasOwnProperty.call(module, "names")) {
    if (Object.prototype.hasOwnProperty.call(modules, module.names.module)) {
      throw new Error(`已存在同名vuex module ${module.name}，请修改命名`);
    }
    modules[module.names.module] = module.default;
  }
});

export default store(function ({ Vue }) {
  Vue.use(Vuex);

  const Store = new Vuex.Store<StateInterface>({
    modules,
    // state: () => state,
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV,
  });

  return Store;
});
