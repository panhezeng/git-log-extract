import { WindowElectronParameters } from '*.vue|ts|tsx';
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  nativeTheme,
  OpenDialogOptions,
} from 'electron';
import Store from 'electron-store';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import simpleGit, {
  BranchSummary,
  LogResult,
  SimpleGitOptions,
} from 'simple-git';
import { URL } from 'url';
import channel from './channel';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    fs.unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
  }
  // eslint-disable-next-line no-empty
} catch (_) {}

//
// ipcMain.handle('electronExampleHandle', async (event, ...args) => {});
// ipcMain.on('electronExampleOn', async (event, ...args) => {
//   event.returnValue = '';
// });

ipcMain.on(
  channel.app.getPath,
  async (event, ...args: WindowElectronParameters['app']['getPath']) => {
    event.returnValue = app.getPath(...args);
  },
);

const store = new Store({
  name: 'git-log-extract-main-config',
  cwd: app.getPath('appData') + '/' + process.env.PRODUCT_NAME,
});

ipcMain.on(
  channel.store.set,
  async (event, ...args: WindowElectronParameters['store']['set']) => {
    store.set(...args);
  },
);

ipcMain.on(
  channel.store.get,
  async (event, key: string, defaultValue?: unknown) => {
    event.returnValue = store.get(key, defaultValue);
  },
);

ipcMain.on(
  channel.path.resolve,
  async (event, ...args: WindowElectronParameters['path']['resolve']) => {
    event.returnValue = path.resolve(...args);
  },
);

ipcMain.on(
  channel.fs.existsSync,
  async (event, ...args: WindowElectronParameters['fs']['existsSync']) => {
    event.returnValue = fs.existsSync(...args);
  },
);

ipcMain.on(
  channel.fs.removeSync,
  async (event, ...args: WindowElectronParameters['fs']['removeSync']) => {
    event.returnValue = fs.removeSync(...args);
  },
);

ipcMain.on(
  channel.fs.emptyDirSync,
  async (event, ...args: WindowElectronParameters['fs']['emptyDirSync']) => {
    event.returnValue = fs.emptyDirSync(...args);
  },
);

ipcMain.handle(
  channel.git.repositoryAuthUrl,
  async (event, url: string, username: string, password: string) => {
    const urlObj = new URL(url);
    urlObj.username = username;
    urlObj.password = password;
    return urlObj.href;
  },
);

function createGit(
  options?: Partial<SimpleGitOptions>,
  onProgress?: (data: string) => void,
) {
  if (typeof options === 'undefined') {
    options = { baseDir: '' };
  }
  // if (onProgress) {
  //   options.progress  = (data: SimpleGitProgressEvent) => {
  //     console.log(
  //       `git.${data.method} ${data.stage} stage ${data.progress}% complete`
  //     );
  //     onProgress(data);
  //   };
  // }
  const git = simpleGit(options);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  git.outputHandler((bin, stdout, stderr, args) => {
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
    stderr.on('data', function (stdData: { toString: () => string }) {
      // console.log(stdData.toString());
      if (onProgress) {
        onProgress(stdData.toString());
      }
    });
  });
  return git;
}

ipcMain.handle(
  channel.git.branchSummary,
  async (event, directoryPath: string, repositoryAuthUrl: string) => {
    const git = createGit({
      baseDir: directoryPath,
    });
    await git.init();
    await git.addRemote('origin', repositoryAuthUrl);
    await git.fetch(['--shallow-since="1 months ago"']);
    // await git.remote(["update"]);
    const branchSummary: BranchSummary = await git.branch(['-r']);
    return branchSummary;
  },
);

ipcMain.handle(
  channel.git.logResult,
  async (event, directoryPath: string, logOptions: string[]) => {
    const git = createGit({ baseDir: directoryPath });
    await git.fetch(['--shallow-since="1 months ago"']);
    // console.log('git 1');
    // await git.remote(["update"]);
    // // console.log('git 2');
    const logResult: LogResult = await git.log(logOptions);
    // console.log('git 3');
    return logResult;
  },
);

ipcMain.handle(channel.dialog, async (event, options: OpenDialogOptions) => {
  return await dialog.showOpenDialog(options);
});

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
      // sandbox: false,
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
