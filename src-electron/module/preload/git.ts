import { contextBridge } from "electron";
import { URL } from "url";
import simpleGit, {
  BranchSummary,
  LogResult,
  SimpleGitOptions,
} from "simple-git";

function createGit(
  options?: Partial<SimpleGitOptions>,
  onProgress?: (data: string) => void
) {
  if (typeof options === "undefined") {
    options = { baseDir: "" };
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
    stderr.on("data", function (stdData: { toString: () => string }) {
      // console.log(stdData.toString());
      if (onProgress) {
        onProgress(stdData.toString());
      }
    });
  });
  return git;
}

export default () => {
  contextBridge.exposeInMainWorld("electronGit", {
    repositoryAuthURL: (url: string, username: string, password: string) => {
      const urlObj = new URL(url);
      urlObj.username = username;
      urlObj.password = password;
      return urlObj.href;
    },
    branchSummary: async (directoryPath: string, repositoryAuthURL: string) => {
      const git = createGit({
        baseDir: directoryPath,
      });
      await git.init();
      await git.addRemote("origin", repositoryAuthURL);
      await git.remote(["update"]);
      const branchSummary: BranchSummary = await git.branch(["-r"]);
      return branchSummary;
    },
    logResult: async (directoryPath: string, logOptions: string[]) => {
      const git = createGit({ baseDir: directoryPath });
      // console.log('git 1');
      await git.remote(["update"]);
      // // console.log('git 2');
      const logResult: LogResult = await git.log(logOptions);
      // console.log('git 3');
      return logResult;
    },
  });
};
