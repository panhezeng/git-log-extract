import { Module, MutationTree } from 'vuex';
import { StateInterface as StateInterfaceIndex } from '@/store/index';
import { toRaw } from 'vue';

import StoreType from 'electron-store';
const electronStore = window.electronStore as StoreType;

export const names = {
  module: 'personalize',

  mutations: {
    SET_DATA: 'SET_DATA',
  },
};

const initState = {
  git: {
    username: '',
    password: '',
  },
  logQuery: {
    author: '',
    onlyMessage: true,
    noMerges: true,
    dedup: true,
    thisWeek: true,
  },
};
export type StateInterface = typeof initState;

Object.assign(initState, electronStore.get(`store_${names.module}`, {}));

const mutations: MutationTree<StateInterface> = {
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  [names.mutations.SET_DATA](state, data: Partial<StateInterface>) {
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
    Object.assign(state, data);
    electronStore.set({ [`store_${names.module}`]: toRaw(state) });
  },
};

export default {
  namespaced: true,
  state: () => initState,
  mutations,
} as Module<StateInterface, StateInterfaceIndex>;
