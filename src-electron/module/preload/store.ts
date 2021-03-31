import { contextBridge } from 'electron';
import Store from 'electron-store';

export default () => {
  const store = new Store({ name: 'git-log-extract-main-config' });
  contextBridge.exposeInMainWorld('electronStore', {
    set: (object: any) => {
      store.set(object);
    },
    get: (key: string, defaultValue?: unknown) => {
      const data = store.get(key, defaultValue);
      return data;
    },
  });
};
