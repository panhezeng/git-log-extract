/* eslint-env node */
import {
  contextBridge,
  ipcRenderer,
  OpenDialogOptions,
  OpenDialogReturnValue,
} from "electron";
export default () => {
  contextBridge.exposeInMainWorld("electronMain", {
    dialog: async (options: OpenDialogOptions) => {
      const result = await ipcRenderer.invoke("electronDialog", options);
      return result as OpenDialogReturnValue;
    },
  });
};
