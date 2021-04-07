import { fs } from '@/utils/electron-preload';
export const localDirectoryPath = (val: string, fail: any) => {
  if (fs.existsSync(val)) {
    return true;
  } else {
    if (typeof fail === 'undefined') {
      return '请输入有效的本地目录路径';
    } else {
      return fail;
    }
  }
};
export const fileName = (val: string, fail: any) => {
  if (val.length && !/[\\/:*?"<>|]/gi.test(val)) {
    return true;
  } else {
    if (typeof fail === 'undefined') {
      return '不能包含字符：\\/:*?"<>|';
    } else {
      return fail;
    }
  }
};
