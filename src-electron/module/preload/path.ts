/* eslint-env node */
import { contextBridge } from "electron";
import path from "path";
export default () => {
  contextBridge.exposeInMainWorld("electronPath", path);
};
