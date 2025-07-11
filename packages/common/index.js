export const channel = {
  app: {
    getPath: 'app.getPath',
  },
  dialog: 'dialog',
  path: {
    resolve: 'path.resolve',
    join: 'path.join',
    sep: 'path.sep',
  },
  fs: {
    existsSync: 'fs.existsSync',
    removeSync: 'fs.removeSync',
    emptyDirSync: 'fs.emptyDirSync',
    ensureDirSync: 'fs.ensureDirSync',
  },
  store: {
    get: 'store.get',
    set: 'store.set',
  },
  git: {
    repositoryAuthUrl: 'git.repositoryAuthUrl',
    branchSummary: 'git.branchSummary',
    logResult: 'git.logResult',
  },
};

export const config = {
  appTitle: 'Git Log Extract',
};

export function convertWindowsPathToUnix(winPath='') {
  // 如果路径中没有反斜杠，直接返回原路径
  if (!winPath.includes('\\')) {
    return winPath;
  }

  // 替换所有连续的反斜杠为单个正斜杠
  const normalized = winPath.replace(/\\+/g, '/');

  // 处理盘符（如 D:\ -> /d/）
  return normalized.replace(/^([A-Za-z]):\//, (_, letter) => `/${letter.toLowerCase()}/`);
}
