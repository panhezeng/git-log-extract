import {defineStore} from 'pinia';
import {toRaw, unref} from 'vue';
export const id = 'personalize';
const initState = {
  git: {
    username: '',
    password: '',
    sshKey: '/Users/panhezeng/.ssh/id_rsa',
  },
  logQuery: {
    author: '潘何增\\|panhezeng',
    onlyMessage: true,
    noMerges: true,
    dedup: true,
    thisWeek: true,
    shallowSince: '',
  },
  ...(window[btoa('electron')].store.get(`store_${id}`, {}) as Record<any, any>),
};
export type StateType = typeof initState;

export const usePersonalizeStore = defineStore(id, {
  state: () => JSON.parse(JSON.stringify(initState)) as StateType,
  actions: {
    setData(data: Partial<StateType>) {
      this.$patch(data);
      window[btoa('electron')].store.set({[`store_${id}`]: toRaw(unref(this.$state))});
    },
  },
});
