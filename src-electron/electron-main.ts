import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import requireContext from './utils/require-context';
// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    fs.unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
  }
  // eslint-disable-next-line no-empty
} catch (_) {}

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      sandbox: false,
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (mainWindow === undefined) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

// 自动加载 module/main 目录下非 *exclude.js命名规则的 js 文件，并执行 export default function
// 所有需要在主进程执行的功能代码，都可以放到 module/main 目录下，会自动执行，代码分离解耦
requireContext(
  require.context('./module/main', true, /(?<!exclude)\.ts$/)
).forEach(({ module }) => {
  if (module && typeof module.default === 'function') {
    module.default();
  }
});
