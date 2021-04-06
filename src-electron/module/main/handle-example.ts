import { ipcMain, BrowserWindow } from 'electron';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (window: BrowserWindow) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ipcMain.handle('electronExample', async (event, args) => {});
};
