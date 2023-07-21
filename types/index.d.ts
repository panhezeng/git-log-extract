/// <reference types="vite/client" />

/**
 * Describes all existing environment variables and their types.
 * Required for Code completion/intellisense and type checking.
 *
 * Note: To prevent accidentally leaking env variables to the client, only variables prefixed with `VITE_` are exposed to your Vite-processed code.
 *
 * @see https://github.com/vitejs/vite/blob/0a699856b248116632c1ac18515c0a5c7cf3d1db/packages/vite/types/importMeta.d.ts#L7-L14 Base Interface.
 * @see https://vitejs.dev/guide/env-and-mode.html#env-files Vite Env Variables Doc.
 */
interface ImportMetaEnv {
  /**
   * URL where `renderer` web page is running.
   * This variable is initialized in scripts/watch.ts
   */
  readonly VITE_DEV_SERVER_URL: undefined | string;
  readonly VITE_APP_TITLE: undefined | string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
  }
}

declare module '*.vue|ts|tsx' {
  import type {app, OpenDialogOptions, OpenDialogReturnValue} from 'electron';
  import type StoreType from 'electron-store';
  import type fs from 'fs-extra';
  import type path from 'path';
  import type {BranchSummary, LogResult} from 'simple-git';
  type WindowElectronParameters = {
    store: {
      set: Parameters<StoreType['set']>;
    };
    path: {
      resolve: Parameters<typeof path['resolve']>;
      join: Parameters<typeof path['join']>;
      sep: string;
    };
    fs: {
      existsSync: Parameters<typeof fs['existsSync']>;
      removeSync: Parameters<typeof fs['removeSync']>;
      emptyDirSync: Parameters<typeof fs['emptyDirSync']>;
      ensureDirSync: Parameters<typeof fs['ensureDirSync']>;
    };
    app: {
      getPath: Parameters<typeof app['getPath']>;
    };
  };

  type ProjectData = {
    directoryPath: string,
    repositoryAddress: string,
    username: string,
    password: string,
    sshKey: string,
    protocolType: 'https' | 'ssh',
  }

  export {WindowElectronParameters, ProjectData};
  global {
    interface Window {
      electron: {
        dialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
        app: typeof app;
        path: typeof path;
        fs: typeof fs;
        store: StoreType;
        git: {
          repositoryAuthUrl: (url: string, username: string, password: string) => Promise<string>;
          branchSummary: (
            projectString: string
          ) => Promise<BranchSummary>;
          logResult: (projectString: string, logOptions: string[]) => Promise<LogResult>;
        };
      };
      [key: string | number | symbol]: any;
    }
  }
}
