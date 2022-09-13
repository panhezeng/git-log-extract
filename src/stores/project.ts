import { defineStore } from 'pinia';
import { toRaw, unref } from 'vue';
export const id = 'project';
export const project = {
  name: '',
  directoryPath: '',
  repositoryUrl: '',
  username: '',
  password: '',
  branches: [] as string[],
};

export type ProjectType = typeof project;

const projects = window.electronStore.get(
  `store_${id}.projects`,
  []
) as ProjectType[];

const initState = {
  projects,
};

export type StateType = typeof initState;

export const useProjectStore = defineStore(id, {
  state: () => JSON.parse(JSON.stringify(initState)) as StateType,
  getters: {
    getProject: (state) => {
      return ({
        name,
        repositoryUrl,
      }: {
        name?: string;
        repositoryUrl?: string;
      }) => {
        const index = state.projects.findIndex(
          (project) =>
            project.name === name || project.repositoryUrl === repositoryUrl
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
  },
  actions: {
    setProject({
      data,
      action,
      index = -1,
    }: {
      data: ProjectType;
      action: 'add' | 'edit' | 'delete';
      index: number;
    }) {
      if (action === 'add') {
        this.$state.projects.push(data);
      } else {
        if (index < 0 || index >= this.$state.projects.length) {
          index = this.$state.projects.findIndex(
            (existing) => existing.name === data.name
          );
        }
        if (index > -1) {
          if (action === 'delete') {
            this.$state.projects.splice(index, 1);
          } else if (action === 'edit') {
            this.$state.projects.splice(index, 1, data);
          }
        }
      }
      window.electronStore.set({
        [`store_${id}`]: { projects: toRaw(unref(this.$state.projects)) },
      });
    },
  },
});
