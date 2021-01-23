import { GetterTree, Module, MutationTree } from "vuex";
import { StateInterface as StateInterfaceIndex } from "@/store/index";
import { electronStore } from "@/utils/store/index";

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
  repositoryURL: "",
  username: "",
  password: "",
  repositoryAuthURL: "",
  branches: [] as string[],
};

export type ProjectType = typeof project;

export interface StateInterface {
  projects: ProjectType[];
}

const projects = electronStore.get(
  `store_${names.module}.projects`,
  []
) as ProjectType[];

const state: StateInterface = {
  projects,
};

const getters: GetterTree<StateInterface, StateInterfaceIndex> = {
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  [names.getters.GET_PROJECT](state, getters, rootState, rootGetters) {
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
    return ({
      name,
      repositoryURL,
      repositoryAuthURL,
    }: {
      name?: string;
      repositoryURL?: string;
      repositoryAuthURL?: string;
    }) => {
      const index = state.projects.findIndex(
        (project) =>
          project.name === name ||
          project.repositoryURL === repositoryURL ||
          project.repositoryAuthURL === repositoryAuthURL
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
      [`store_${names.module}`]: { projects: state.projects },
    });
  },
};

export default {
  namespaced: true,
  state: () => state,
  getters,
  mutations,
} as Module<StateInterface, StateInterfaceIndex>;
