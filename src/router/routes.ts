import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "main-layout" */ "layouts/Main.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(/* webpackChunkName: "index-page" */ "pages/Index.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () =>
      import(/* webpackChunkName: "error-page" */ "pages/error/Index.vue"),
  },
];

export default routes;
