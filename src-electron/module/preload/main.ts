import { contextBridge, ipcRenderer, OpenDialogOptions } from 'electron';
export default () => {
  contextBridge.exposeInMainWorld('electronMain', {
    dialog: async (options: OpenDialogOptions) => {
      const result = await ipcRenderer.invoke('electronDialog', options);
      return result;
    },
  });
};
