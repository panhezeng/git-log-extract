/* eslint-env node */
import { contextBridge } from "electron";
import fs from "fs-extra";

export default () => {
  contextBridge.exposeInMainWorld("electronFs", fs);
};
