import type {WindowElectronParameters} from '*.vue|ts|tsx';
import {channel} from '@vite-electron-builder/common';
import type {OpenDialogOptions, OpenDialogReturnValue} from 'electron';
import {ipcRenderer} from 'electron';

const electron = {
  app: {
    getPath(...args: WindowElectronParameters['app']['getPath']) {
      return ipcRenderer.sendSync(channel.app.getPath, ...args);
    },
  },
  async dialog(options: OpenDialogOptions) {
    const result = await ipcRenderer.invoke(channel.dialog, options);
    return result as OpenDialogReturnValue;
  },
  path: {
    resolve(...args: WindowElectronParameters['path']['resolve']) {
      return ipcRenderer.sendSync(channel.path.resolve, ...args);
    },
    join(...args: WindowElectronParameters['path']['join']) {
      return ipcRenderer.sendSync(channel.path.join, ...args);
    },
    sep: ipcRenderer.sendSync(channel.path.sep),
  },
  fs: {
    existsSync(...args: WindowElectronParameters['fs']['existsSync']) {
      return ipcRenderer.sendSync(channel.fs.existsSync, ...args);
    },
    removeSync(...args: WindowElectronParameters['fs']['removeSync']) {
      return ipcRenderer.sendSync(channel.fs.removeSync, ...args);
    },
    emptyDirSync(...args: WindowElectronParameters['fs']['emptyDirSync']) {
      return ipcRenderer.sendSync(channel.fs.emptyDirSync, ...args);
    },
    ensureDirSync(...args: WindowElectronParameters['fs']['ensureDirSync']) {
      return ipcRenderer.sendSync(channel.fs.ensureDirSync, ...args);
    },
  },
  store: {
    get(key: string, defaultValue?: unknown) {
      return ipcRenderer.sendSync(channel.store.get, key, defaultValue);
    },
    set(...args: WindowElectronParameters['store']['set']) {
      ipcRenderer.send(channel.store.set, ...args);
    },
  },
  git: {
    async repositoryAuthUrl(url: string, username: string, password: string) {
      const result = await ipcRenderer.invoke(
        channel.git.repositoryAuthUrl,
        url,
        username,
        password,
      );
      return result;
    },
    async branchSummary(projectString: string, shallowSince: string) {
      const result = await ipcRenderer.invoke(
        channel.git.branchSummary,
        projectString,
        shallowSince,
      );
      return result;
    },
    async logResult(projectString: string, logOptions: string[], shallowSince: string) {
      const result = await ipcRenderer.invoke(
        channel.git.logResult,
        projectString,
        logOptions,
        shallowSince,
      );
      return result;
    },
  },
};

export {electron};
