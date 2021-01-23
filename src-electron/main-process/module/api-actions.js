/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require("axios");
import { ipcMain } from "electron";
import * as commentJson from "comment-json";

export default (window) => {
  axios.defaults.headers.post["Content-Type"] = "application/json";
  async function apiFunc(config, conf) {
    return axios({
      url: `${conf.urlValidation.pathname.prefix || ""}${config.url}`,
      method: config.method.toUpperCase(),
      headers: Object.assign(
        {},
        config.headers || {},
        conf.request.headers || {}
      ),
      params: Object.assign({}, config.params || {}, conf.request.params || {}),
      data: config.data || {},
    });
  }

  ipcMain.handle("testApi", async (e, config, project) => {
    let conf = commentJson.parse(project);
    axios.defaults.baseURL = conf.request.baseURL || "";
    let res;
    res = await apiFunc(JSON.parse(config), conf);
    return res.data;
  });
};
