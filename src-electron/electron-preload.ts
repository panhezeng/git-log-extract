/* eslint-env node */
/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */

import { WindowElectronParameters } from '*.vue|ts|tsx';
import {
  contextBridge,
  ipcRenderer,
  OpenDialogOptions,
  OpenDialogReturnValue,
} from 'electron';
import channel from './channel';

contextBridge.exposeInMainWorld('electron', {
  app: {
    getPath(...args: WindowElectronParameters['app']['getPath']) {
      return ipcRenderer.sendSync(channel.app.getPath, ...args);
    },
  },
  async dialog(options: OpenDialogOptions) {
    const result = await ipcRenderer.invoke(channel.dialog, options);
    return result as OpenDialogReturnValue;
  },
  store: {
    get(key: string, defaultValue?: unknown) {
      return ipcRenderer.sendSync(channel.store.get, key, defaultValue);
    },
    set(...args: WindowElectronParameters['store']['set']) {
      ipcRenderer.send(channel.store.set, ...args);
    },
  },
  path: {
    resolve(...args: WindowElectronParameters['path']['resolve']) {
      return ipcRenderer.sendSync(channel.path.resolve, ...args);
    },
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
    async branchSummary(directoryPath: string, repositoryAuthUrl: string) {
      const result = await ipcRenderer.invoke(
        channel.git.branchSummary,
        directoryPath,
        repositoryAuthUrl,
      );
      return result;
    },
    async logResult(directoryPath: string, logOptions: string[]) {
      const result = await ipcRenderer.invoke(
        channel.git.logResult,
        directoryPath,
        logOptions,
      );
      return result;
    },
  },
});
