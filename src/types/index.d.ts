declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: "hash" | "history" | "abstract" | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;
  export default component;
}

declare module "*.vue|ts|tsx" {
  import StoreType from "electron-store";
  import PathType from "path";
  import FSType from "fs-extra";
  import { BranchSummary, LogResult } from "simple-git";
  import { OpenDialogOptions, OpenDialogReturnValue } from "electron";
  global {
    interface Window {
      electronStore: StoreType;
      electronPath: typeof PathType;
      electronFs: typeof FSType;
      electronGit: {
        repositoryAuthUrl: (
          url: string,
          username: string,
          password: string
        ) => string;
        branchSummary: (
          directoryPath: string,
          repositoryAuthUrl: string
        ) => Promise<BranchSummary>;
        logResult: (
          directoryPath: string,
          logOptions: string[]
        ) => Promise<LogResult>;
      };
      electronMain: {
        dialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
      };
      [key: string | number | symbol]: any;
    }
  }
}
