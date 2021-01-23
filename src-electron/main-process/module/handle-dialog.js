import { ipcMain, dialog } from "electron";
export default (window) => {
  ipcMain.handle("electronDialog", async (event, arg) => {
    const result = await dialog.showOpenDialog(arg || {});
    return result;
  });
};
