import { defineStore } from 'pinia';
import { toRaw, unref } from 'vue';
export const id = 'personalize';
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
export type StateType = typeof initState;

export const usePersonalizeStore = defineStore('personalize', {
  state: () => JSON.parse(JSON.stringify(initState)) as StateType,
  actions: {
    setData(data: Partial<StateType>) {
      this.$patch(data);
      window.electronStore.set({ [`store_${id}`]: toRaw(unref(this.$state)) });
    },
  },
});
