/* eslint-env node */
import { contextBridge } from "electron";
import Store from "electron-store";

export default () => {
  const store = new Store({ name: "git-log-extract-main-config" });
  contextBridge.exposeInMainWorld("electronStore", {
    set: (p1: string | Partial<{ [key: string]: any }>, p2?: unknown) => {
      if (typeof p1 === "string") {
        store.set(p1, p2);
      } else {
        store.set(p1);
      }
    },
    get: (key: string, defaultValue?: unknown) => {
      const data = store.get(key, defaultValue);
      return data;
    },
  });
};
