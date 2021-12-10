/* eslint-env node */
import { ipcMain, BrowserWindow } from "electron";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  ipcMain.handle("electronExample", async (event, args) => {});
};
