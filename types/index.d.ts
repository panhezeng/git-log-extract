/// <reference types="vite/client" />

/**
 * Describes all existing environment variables and their types.
 * Required for Code completion/intellisense and type checking.
 *
 * Note: To prevent accidentally leaking env variables to the client, only variables prefixed with `VITE_` are exposed to your Vite-processed code.
 *
 * @see https://github.com/vitejs/vite/blob/cab55b32de62e0de7d7789e8c2a1f04a8eae3a3f/packages/vite/types/importMeta.d.ts#L62-L69 Base Interface.
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

declare module '*.vue' {
  import type {DefineComponent} from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare module '*.vue|ts|tsx' {
  import type {app, OpenDialogOptions, OpenDialogReturnValue} from 'electron';
  import type StoreType from 'electron-store';
  import type FSType from 'fs-extra';
  import type PathType from 'path';
  import type {BranchSummary, LogResult} from 'simple-git';
  type WindowElectronParameters = {
    store: {
      set: Parameters<StoreType['set']>;
    };
    path: {
      resolve: Parameters<typeof PathType['resolve']>;
      join: Parameters<typeof PathType['join']>;
      sep: string;
    };
    fs: {
      existsSync: Parameters<typeof FSType['existsSync']>;
      removeSync: Parameters<typeof FSType['removeSync']>;
      emptyDirSync: Parameters<typeof FSType['emptyDirSync']>;
    };
    app: {
      getPath: Parameters<typeof app['getPath']>;
    };
  };

  export {WindowElectronParameters};
  global {
    interface Window {
      electron: {
        dialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
        app: typeof app;
        path: typeof PathType;
        fs: typeof FSType;
        store: StoreType;
        git: {
          repositoryAuthUrl: (url: string, username: string, password: string) => Promise<string>;
          branchSummary: (
            directoryPath: string,
            repositoryAuthUrl: string,
          ) => Promise<BranchSummary>;
          logResult: (directoryPath: string, logOptions: string[]) => Promise<LogResult>;
        };
      };
      [key: string | number | symbol]: any;
    }
  }
}
