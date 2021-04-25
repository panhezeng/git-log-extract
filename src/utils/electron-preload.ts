import PathType from "path";
import FSType from "fs-extra";
import StoreType from "electron-store";
import { BranchSummary, LogResult } from "simple-git";
import { OpenDialogOptions, OpenDialogReturnValue } from "electron";

export const electronStore = window.electronStore as StoreType;
export const path = window.electronPath as typeof PathType;
export const fs = window.electronFS as typeof FSType;
export const git = window.electronGit as {
  repositoryAuthURL: (
    url: string,
    username: string,
    password: string
  ) => string;
  branchSummary: (
    directoryPath: string,
    repositoryAuthURL: string
  ) => Promise<BranchSummary>;
  logResult: (
    directoryPath: string,
    logOptions: string[]
  ) => Promise<LogResult>;
};
export const electronMain = window.electronMain as {
  dialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
};
