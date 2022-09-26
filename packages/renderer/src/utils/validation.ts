import {Notify} from 'quasar';

export function localDirectoryPath(val: string, fail?: string) {
  if (window.electron.fs.existsSync(val)) {
    return true;
  } else {
    if (typeof fail === 'undefined') {
      return '请输入有效的本地目录路径';
    } else {
      return fail;
    }
  }
}

export function fileName(val: string, fail?: string) {
  if (val.length && !/[\\/:*?"<>|]/gi.test(val)) {
    return true;
  } else {
    if (typeof fail === 'undefined') {
      return '不能为空并且不能包含字符：\\/:*?"<>|';
    } else {
      return fail;
    }
  }
}

export function apiUrlSegment(val: string, fail?: string) {
  if (val.length && /^\/(\w|\d)+/.test(val)) {
    return true;
  } else {
    if (typeof fail === 'undefined') {
      return '不能为空并且必须是正确格式，比如 /list';
    } else {
      return fail;
    }
  }
}

export function apiUrl(url: string, validation: {prefix: string; suffix: string}, notify = true) {
  if (url === '') {
    if (notify) {
      Notify.create({
        position: 'top',
        color: 'red',
        textColor: 'white',
        icon: 'warning',
        message: 'api接口url必填',
      });
    }
    return false;
  } else if (!url.startsWith(validation.prefix) || !url.endsWith(validation.suffix)) {
    if (notify) {
      Notify.create({
        type: 'negative',
        message: `输入的接口URL第一段或最后一段错误，正确的接口第一段是 ${validation.prefix}，最后一段是${validation.suffix}`,
      });
    }
    return false;
  }
  return true;
}

export function JSONString(string: string) {
  try {
    return JSON.parse(string);
  } catch (e) {
    return null;
  }
}

export function objectKeyAndValueType(
  data: {[key: string]: any},
  validation: {[key: string]: any},
) {
  const chainKey = '__validationChainKey';
  const message: string[] = [];
  const queue = [] as [typeof data, typeof validation][];
  queue.push([data, validation]);
  while (queue.length) {
    const currentLevelLength = queue.length;
    for (let i = 0; i < currentLevelLength; i++) {
      const item = queue.shift();
      if (item) {
        data = item[0];
        validation = item[1];
        const validationKeys = Object.keys(validation);
        if (validationKeys.length) {
          for (let i = 0; i < validationKeys.length; i++) {
            const key = validationKeys[i];
            let currentChainKey = '';
            if (data[chainKey]) {
              currentChainKey = String(data[chainKey]) + '.';
            }
            currentChainKey += key;
            let dataChild = data[key];
            const validationChild = validation[key];
            if (!(key in data)) {
              message.push(`数据缺少<strong> ${currentChainKey} </strong>属性<br/>`);
            } else if (typeof dataChild !== typeof validationChild) {
              message.push(`数据<strong> ${currentChainKey} </strong>属性值的类型不对<br/>`);
            } else if (
              typeof data === 'object' &&
              data &&
              typeof validationChild === 'object' &&
              validationChild
            ) {
              dataChild = Object.assign(dataChild, {
                [chainKey]: currentChainKey,
              });
              queue.push([dataChild, validationChild]);
            }
          }
        }
      }
    }
  }
  return message;
}

export function responseData(data: any, validation: {[key: string]: any}) {
  let message = '接口返回的数据不是预期的JSON数据格式';
  let dataJSONString = '';
  function result() {
    if (message) {
      Notify.create({
        type: 'negative',
        message,
      });
      dataJSONString = '';
    }
    return dataJSONString;
  }
  if (typeof data === 'string') {
    dataJSONString = data;
    if (!JSONString(data)) {
      return result();
    }
  } else {
    try {
      dataJSONString = JSON.stringify(data, null, 2);
    } catch (e) {
      return result();
    }
  }
  if (typeof data === 'object' && data && typeof validation === 'object' && validation) {
    message = objectKeyAndValueType(data, validation).join();
  }
  return result();
}
