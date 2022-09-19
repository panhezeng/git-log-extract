declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    PRODUCT_NAME: string;
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;
  export default component;
}

declare module '*.vue|ts|tsx' {
  import { app, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
  import StoreType from 'electron-store';
  import FSType from 'fs-extra';
  import PathType from 'path';
  import { BranchSummary, LogResult } from 'simple-git';

  type WindowElectronParameters = {
    store: {
      set: Parameters<StoreType['set']>;
    };
    path: {
      resolve: Parameters<typeof PathType['resolve']>;
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

  export { WindowElectronParameters };
  global {
    interface Window {
      electron: {
        dialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
        store: StoreType;
        path: typeof PathType;
        fs: typeof FSType;
        git: {
          repositoryAuthUrl: (
            url: string,
            username: string,
            password: string,
          ) => Promise<string>;
          branchSummary: (
            directoryPath: string,
            repositoryAuthUrl: string,
          ) => Promise<BranchSummary>;
          logResult: (
            directoryPath: string,
            logOptions: string[],
          ) => Promise<LogResult>;
        };
        app: typeof app;
      };
      [key: string | number | symbol]: any;
    }
  }
}
