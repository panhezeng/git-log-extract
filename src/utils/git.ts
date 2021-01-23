import { SimpleGit } from "simple-git";
import fs from "fs-extra";

export async function setGitMergeTool(git: SimpleGit, tool: string) {
  if (tool === "vscode") {
    const configListSummary = await git.listConfig();
    const projectGitConfig = configListSummary.values[".git/config"];
    if (
      typeof projectGitConfig["merge.tool"] === "string" &&
      projectGitConfig["merge.tool"] !== "vscode"
    ) {
      git.addConfig("merge.tool", "vscode");
      git.addConfig("mergetool.vscode.cmd", "code --wait $MERGED");
    }
  }
}

export function checkGitConflictFiles(files: string[]) {
  const conflictFiles = [] as string[];
  files.forEach((path) => {
    const content = fs.readFileSync(path, "utf8");
    if (content.includes("<<<<<<< HEAD")) {
      conflictFiles.push(path);
    }
  });
  return conflictFiles;
}
