/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
import axios, { AxiosInstance } from "axios";
import { boot } from "quasar/wrappers";
import { QSsrContext } from "@quasar/app/types/ssr";

import { Store } from "vuex";
import { ComponentOptions } from "vue/types/options";
import { BootFileParams } from "@quasar/app/types/boot";
import { Notify } from "quasar";

import Vue from "vue";

declare module "vuex/types/index" {
  interface Store<S> {
    $axios: AxiosInstance;
  }
}

declare module "vue-router/types/router" {
  interface VueRouter {
    $axios: AxiosInstance;
  }
}
declare module "vue/types/vue" {
  interface Vue {
    $axios: AxiosInstance;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    axios?: AxiosInstance;
  }
}
/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
Vue.mixin({
  beforeCreate() {
    (this as any).$axios = this.$root.$options.axios;
  },
});

// 避免交叉请求状态污染 (cross-request state pollution)
/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
export default boot(
  ({
    app,
    store,
    router,
    ssrContext,
  }: BootFileParams<any> & {
    store: Store<any>;
  } & { ssrContext?: QSsrContext }) => {
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
    const instance = axios.create();
    app.axios = instance;
    store.$axios = instance;
    router.$axios = instance;
    //sessionid
    // const cookies =
    //   process.env.SERVER && ssrContext ? Cookies.parseSSR(ssrContext) : Cookies;
    // const token = cookies.get("token");
    // if (token) {
    //   instance.defaults.headers.common.Authorization = "JWT " + token;
    // }
    if (process.env.SERVER) {
      // 浏览器端会自动把 window.location.origin 补在 api url 前面，但是 nodejs 环境 axios 是把服务器本地 ip 127.0.0.1 补在前面，所以需要明确设置 baseURL
      instance.defaults.baseURL = process.env.API_BASE_URL;
      if (ssrContext && ssrContext.req.headers.cookie) {
        instance.defaults.headers.common.Cookie = ssrContext.req.headers.cookie;
      }
      // if (
      //   !token &&
      //   Object.prototype.hasOwnProperty.call(ssrContext.req.query, "token")
      // ) {
      //   instance.defaults.headers.common.Authorization =
      //     "JWT " + ssrContext.req.query.token;
      // }
    }
    // Add a request interceptor
    instance.interceptors.request.use(
      (config) => {
        // Do something before request is sent
        return config;
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error);
      }
    );
    // Add a response interceptor
    instance.interceptors.response.use(
      (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        if (
          response.status >= 400 ||
          (response.data && response.data.success === false)
        ) {
          if (process.env.CLIENT) {
            Notify.create({
              type: "negative",
              message:
                response.data.message || response.data.msg || response.status,
            });
          }
          return Promise.reject(response);
        }
        return response;
      },
      (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      }
    );
  }
);
