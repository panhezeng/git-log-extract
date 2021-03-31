import { contextBridge } from 'electron';
import { URL } from 'url';
import simpleGit, { BranchSummary, LogResult } from "simple-git";

export default () => {
  contextBridge.exposeInMainWorld('electronGit', {
    repositoryAuthURL: (url: string, username: string, password: string) => {
      const urlObj = new URL(url);
      urlObj.username = username;
      urlObj.password = password;

      return urlObj.href;
    },
    branchSummary: async (gitPath: string, repositoryAuthURL: string) => {
      const git = simpleGit(gitPath);
      // git.outputHandler((bin, stdout, stderr, args) => {
      //   stdout.pipe(process.stdout);
      //   stderr.pipe(process.stderr);
      //   stderr.on('data', function (stdData: any) {
      //     // console.log(stdData.toString());
      //   });
      // });
      await git.init();
      await git.addRemote('origin', repositoryAuthURL);
      await git.remote(['update']);
      const branchSummary: BranchSummary = await git.branch(['-r']);
      return branchSummary;
    },
    logResult: async (gitPath: string, logOptions: string[]) => {
      const git = simpleGit(gitPath);
      // console.log(await git.status())
      // git.outputHandler((bin, stdout, stderr, args) => {
      //   stdout.pipe(process.stdout);
      //   stderr.pipe(process.stderr);
      //   stderr.on('data', function (stdData: any) {
      //     console.log(stdData.toString());
      //   });
      // });
      // console.log('git 1');
      await git.remote(['update']);
      // // console.log('git 2');
      const logResult: LogResult = await git.log(logOptions);
      // console.log('git 3');
      return logResult;
    },
  });
};
