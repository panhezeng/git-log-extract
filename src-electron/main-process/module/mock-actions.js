/* eslint-disable @typescript-eslint/no-var-requires */
const Koa = require("koa");
const cors = require("koa2-cors");
const fs = require("fs");
const Mock = require("mockjs");

import { ipcMain } from "electron";

export default (window) => {
  const PORT = 8081;
  let serviceIns = null;
  let apiHash = null;

  function readApiFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  ipcMain.handle("startMock", async (e, status, map) => {
    const service = new Koa();
    service.use(cors());
    apiHash = JSON.parse(map);

    service.use(async (ctx) => {
      try {
        let mockData;
        let curUrl = ctx.url;
        let curMethod = ctx.method;
        console.log(curUrl, curMethod);
        for (let url in apiHash) {
          if (curUrl === url) {
            mockData = JSON.parse(await readApiFile(apiHash[url]));
            ctx.body = await Mock.mock(mockData);
            break;
          } else {
            ctx.body = {
              success: false,
              message: "API Not Found!",
              data: {},
            };
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
    if (!serviceIns) {
      serviceIns = service.listen(PORT);
      if (serviceIns.listening === true) {
        status = "running";
        return status;
      }
    } else {
      status = "running";
      return status;
    }
  });

  ipcMain.handle("stopMock", async (e, status) => {
    if (serviceIns) serviceIns.close();
    serviceIns = null;
    apiHash = null;
    status = "stop";
    return status;
  });
};
