import { GetterTree, Module, MutationTree } from "vuex";
import { StateInterface as StateInterfaceIndex } from "src/store/index";
import { toRaw } from "vue";

import { electronStore } from "src/utils/electron-preload";

export const names = {
  module: "project",
  getters: {
    GET_PROJECT: "GET_PROJECT",
  },
  mutations: {
    SET_PROJECT: "SET_PROJECT",
  },
};

export const project = {
  name: "",
  directoryPath: "",
  repositoryURL: "",
  username: "",
  password: "",
  branches: [] as string[],
};

export type ProjectType = typeof project;

const projects = electronStore.get(
  `store_${names.module}.projects`,
  []
) as ProjectType[];

const initState = {
  projects,
};
export type StateInterface = typeof initState;

const getters: GetterTree<StateInterface, StateInterfaceIndex> = {
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  [names.getters.GET_PROJECT](state, getters, rootState, rootGetters) {
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
    return ({
      name,
      repositoryURL,
    }: {
      name?: string;
      repositoryURL?: string;
    }) => {
      const index = state.projects.findIndex(
        (project) =>
          project.name === name || project.repositoryURL === repositoryURL
      );
      if (index > -1) {
        return {
          data: state.projects[index],
          index: index,
        };
      } else {
        return {
          data: null,
          index: -1,
        };
      }
    };
  },
};

const mutations: MutationTree<StateInterface> = {
  [names.mutations.SET_PROJECT](
    state,
    {
      data,
      action,
      index = -1,
    }: {
      data: ProjectType;
      action: "add" | "edit" | "delete";
      index: number;
    }
  ) {
    if (action === "add") {
      state.projects.push(data);
    } else {
      if (index < 0 || index >= state.projects.length) {
        index = state.projects.findIndex(
          (existing) => existing.name === data.name
        );
      }
      if (index > -1) {
        if (action === "delete") {
          state.projects.splice(index, 1);
        } else if (action === "edit") {
          state.projects.splice(index, 1, data);
        }
      }
    }
    electronStore.set({
      [`store_${names.module}`]: { projects: toRaw(state.projects) },
    });
  },
};

export default {
  namespaced: true,
  state: () => initState,
  getters,
  mutations,
} as Module<StateInterface, StateInterfaceIndex>;
