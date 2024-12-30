import type {WindowElectronParameters, ProjectData} from '*.vue|ts|tsx';
import {channel, config} from '@vite-electron-builder/common';
import type {OpenDialogOptions} from 'electron';
import {app, dialog, ipcMain} from 'electron';
import Store from 'electron-store';
import fs from 'fs-extra';
import path from 'path';
import type {BranchSummary, LogResult, SimpleGitOptions} from 'simple-git';
import {simpleGit} from 'simple-git';
import {URL} from 'url';

//
// ipcMain.handle(channel.example, async (event, ...args) => {});
// ipcMain.on(channel.example, async (event, ...args) => {
//   event.returnValue = '';
// });
// getWindow()?.webContents.send(channel.example, data);

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

ipcMain.on(channel.path.join, async (event, ...args: WindowElectronParameters['path']['join']) => {
  event.returnValue = path.join(...args);
});

ipcMain.on(channel.path.sep, async event => {
  event.returnValue = path.sep;
});

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

ipcMain.on(
  channel.fs.ensureDirSync,
  async (event, ...args: WindowElectronParameters['fs']['ensureDirSync']) => {
    event.returnValue = fs.ensureDirSync(...args);
  },
);

// node end

const store = new Store({
  name: 'git-log-extract-main-config',
  cwd: path.join(app.getPath('appData'), config.appTitle),
});

ipcMain.on(channel.store.set, async (event, ...args: WindowElectronParameters['store']['set']) => {
  store.set(...args);
});

ipcMain.on(channel.store.get, async (event, key: string, defaultValue?: unknown) => {
  event.returnValue = store.get(key, defaultValue);
});

function repositoryAuthUrl(url: string, username: string, password: string) {
  const urlObj = new URL(url);
  urlObj.username = username;
  urlObj.password = password;
  return urlObj.href;
}

ipcMain.handle(
  channel.git.repositoryAuthUrl,
  async (event, url: string, username: string, password: string) => {
    return repositoryAuthUrl(url, username, password);
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

function createProjectGit(project: ProjectData) {
  const git = createGit({
    baseDir: project.directoryPath,
  });
  let address = project.repositoryAddress;
  if (project.protocolType === 'ssh') {
    const GIT_SSH_COMMAND = `ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i ${project.sshKey}`;
    git.env('GIT_SSH_COMMAND', GIT_SSH_COMMAND);
  } else {
    address = repositoryAuthUrl(project.repositoryAddress, project.username, project.password);
  }
  return {git, address};
}

ipcMain.handle(
  channel.git.branchSummary,
  async (event, projectString: string, shallowSince: string) => {
    const project = JSON.parse(projectString) as ProjectData;
    const {git, address} = createProjectGit(project);
    await git.init();
    await git.addRemote('origin', address);
    try {
      await git.fetch([`--shallow-since="${shallowSince || '1 months ago'}"`]);
    } catch (e) {
      await git.remote(['update']);
    }
    const branchSummary: BranchSummary = await git.branch(['-r']);
    return branchSummary;
  },
);

ipcMain.handle(
  channel.git.logResult,
  async (event, projectString: string, logOptions: string[], shallowSince: string) => {
    const project = JSON.parse(projectString) as ProjectData;
    const {git} = createProjectGit(project);
    try {
      await git.fetch([`--shallow-since="${shallowSince || '1 months ago'}"`]);
    } catch (e) {
      await git.remote(['update']);
    }
    const logResult: LogResult = await git.log(logOptions);
    return logResult;
  },
);
