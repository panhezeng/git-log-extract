import { Module, MutationTree } from "vuex";
import { StateInterface as StateInterfaceIndex } from "@/store/index";
import { electronStore } from "@/utils/store/index";
export const names = {
  module: "personalize",

  mutations: {
    SET_DATA: "SET_DATA",
  },
};

export interface StateInterface {
  git: {
    username: string;
    password: string;
  };
  logQuery: {
    author: string;
    onlyMessage: boolean;
    noMerges: boolean;
    dedup: boolean;
    thisWeek: boolean;
  };
}
const state: StateInterface = Object.assign(
  {
    git: {
      username: "",
      password: "",
    },
    logQuery: {
      author: "",
      onlyMessage: true,
      noMerges: true,
      dedup: true,
      thisWeek: true,
    },
  },
  electronStore.get(`store_${names.module}`, {})
);

const mutations: MutationTree<StateInterface> = {
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  [names.mutations.SET_DATA](state, data: Partial<StateInterface>) {
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
    Object.assign(state, data);
    electronStore.set({ [`store_${names.module}`]: state });
  },
};

export default {
  namespaced: true,
  state: () => state,
  mutations,
} as Module<StateInterface, StateInterfaceIndex>;
