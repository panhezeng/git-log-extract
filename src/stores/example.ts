import { defineStore } from 'pinia';
import axios, { AxiosRequestConfig } from 'axios';

const initState = {
  example: [] as any[],
};
export type StateType = typeof initState;

export const useExampleStore = defineStore('example', {
  state: () => JSON.parse(JSON.stringify(initState)) as StateType,
  getters: {
    exampleString: (state) => JSON.stringify(state.example),
    getExampleByParams: (state) => {
      return (index: number) => state.example[index];
    },
  },
  actions: {
    setExample(data: any[]) {
      this.example = data;
    },
    async fetchExample(params?: AxiosRequestConfig['params']) {
      try {
        const response = await axios.get('http://icanhazip.com', {
          params,
        });
        const data = response.data;
        this.setExample([data]);
      } catch (e) {
        return e;
      }
    },
  },
});
