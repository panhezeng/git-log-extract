/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
interface Callback {
  (error?: Error, data?: any): void;
}

interface Options {
  params?: { [key: string]: string };
  timeout?: number;
}

/**
 * Callback index.
 */

let count = 0;

/**
 * Noop function.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

/**
 * JSONP handler
 *
 * Options:
 *  - params {Object} qs parameter ({callback:"cbName"})
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @params {String} url
 * @params {Object} optional options
 */

export default function (url: string, opts?: Options): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof opts === "undefined") {
      opts = {} as Options;
    }
    if (typeof opts.params === "undefined") {
      opts.params = {};
    }

    if (typeof opts.params.callback !== "string") {
      opts.params.callback = "__jp" + count++;
    }

    const callbackName = opts.params.callback;

    const timeout = opts?.timeout || 60000;

    let script: any;
    let timer: any;

    if (timeout) {
      timer = setTimeout(function () {
        cleanup();
        reject(new Error("Timeout"));
      }, timeout);
    }

    function cleanup() {
      if (script && script.parentNode) script.parentNode.removeChild(script);
      window[callbackName] = noop;
      if (timer) clearTimeout(timer);
    }

    window[callbackName] = function (data: any) {
      cleanup();
      resolve(data);
    };

    const paramsArray = [] as string[];
    for (const key in opts.params) {
      if (Object.prototype.hasOwnProperty.call(opts.params, key)) {
        paramsArray.push(`${key}=${opts.params[key]}`);
      }
    }
    if (url.includes("?")) {
      url = `${url}&${paramsArray.join("&")}`;
    } else {
      url = `${url}?${paramsArray.join("&")}`;
    }
    url = url.replace("?&", "?");

    const target = document.getElementsByTagName("script")[0] || document.head;
    if (target.parentNode) {
      // create script
      script = document.createElement("script");
      script.src = url;
      target.parentNode.insertBefore(script, target);
    }
  });
}
