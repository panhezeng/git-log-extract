import { contextBridge } from "electron";
import fs from "fs-extra";

export default () => {
  contextBridge.exposeInMainWorld("electronFS", fs);
};
