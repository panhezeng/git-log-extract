import type {WindowElectronParameters} from '*.vue|ts|tsx';
import channel from '@/common/channel';
import {appTitle} from '@/common/index.json';
import type {OpenDialogOptions} from 'electron';
import {app, dialog, ipcMain} from 'electron';
import Store from 'electron-store';
import fs from 'fs-extra';
import path from 'path';
import type {BranchSummary, LogResult, SimpleGitOptions} from 'simple-git';
import simpleGit from 'simple-git';
import {URL} from 'url';
//
// ipcMain.handle('electronExampleHandle', async (event, ...args) => {});
// ipcMain.on('electronExampleOn', async (event, ...args) => {
//   event.returnValue = '';
// });

// electron start
ipcMain.handle(channel.dialog, async (event, options: OpenDialogOptions) => {
  return await dialog.showOpenDialog(options);
});

ipcMain.on(
  channel.app.getPath,
  async (event, ...args: WindowElectronParameters['app']['getPath']) => {
    event.returnValue = app.getPath(...args);
  },
);
// electron end

// node start
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

// node end

const store = new Store({
  name: 'git-log-extract-main-config',
  cwd: app.getPath('appData') + '/' + appTitle,
});

ipcMain.on(channel.store.set, async (event, ...args: WindowElectronParameters['store']['set']) => {
  store.set(...args);
});

ipcMain.on(channel.store.get, async (event, key: string, defaultValue?: unknown) => {
  event.returnValue = store.get(key, defaultValue);
});

ipcMain.handle(
  channel.git.repositoryAuthUrl,
  async (event, url: string, username: string, password: string) => {
    const urlObj = new URL(url);
    urlObj.username = username;
    urlObj.password = password;
    return urlObj.href;
  },
);

function createGit(options?: Partial<SimpleGitOptions>, onProgress?: (data: string) => void) {
  if (typeof options === 'undefined') {
    options = {baseDir: ''};
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
    stderr.on('data', function (stdData: {toString: () => string}) {
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
    const git = createGit({baseDir: directoryPath});
    await git.fetch(['--shallow-since="1 months ago"']);
    // console.log('git 1');
    // await git.remote(["update"]);
    // // console.log('git 2');
    const logResult: LogResult = await git.log(logOptions);
    // console.log('git 3');
    return logResult;
  },
);