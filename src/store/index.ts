import { store } from 'quasar/wrappers';
import { createStore } from 'vuex';
import requireContext from '@/utils/require-context';

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state';

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
  require.context('@/store/', true, /(?<!\.\/index|\.d)\.ts$/)
).forEach(({ module }) => {
  if (Object.prototype.hasOwnProperty.call(module, 'names')) {
    if (Object.prototype.hasOwnProperty.call(modules, module.names.module)) {
      throw new Error(
        `已存在同名vuex module ${module.names.module}，请修改命名`
      );
    }
    modules[module.names.module] = module.default;
  }
});

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
