import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { StateInterface as StateInterfaceIndex } from '@/store/index';

export const names = {
  module: 'exampleModule',
  getters: {
    SOME_GETTER: 'SOME_GETTER',
  },
  mutations: {
    SOME_MUTATION: 'SOME_MUTATION',
  },
  actions: {
    SOME_ACTION: 'SOME_ACTION',
  },
};

const initState = {
  example: '',
  exampleArray: [] as any[],
  exampleObject: {} as { [key: string]: any },
};
export type StateInterface = typeof initState;

const getters: GetterTree<StateInterface, StateInterfaceIndex> = {
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  [names.getters.SOME_GETTER](state, getters, rootState, rootGetters) {
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
    // your code
  },
};
const mutations: MutationTree<StateInterface> = {
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  [names.mutations.SOME_MUTATION](state, payload?: any) {
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
    // your code
  },
};
const actions: ActionTree<StateInterface, StateInterfaceIndex> = {
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  async [names.actions.SOME_ACTION](context, payload?: any) {
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
    // your code
  },
};

export default {
  namespaced: true,
  state: () => initState,
  getters,
  mutations,
  actions,
} as Module<StateInterface, StateInterfaceIndex>;
