/* eslint-env node */
import { ipcMain, dialog, OpenDialogOptions } from 'electron';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default () => {
  ipcMain.handle(
    'electronDialog',
    async (event, options: OpenDialogOptions) => {
      const result = await dialog.showOpenDialog(options);
      return result;
    }
  );
};
