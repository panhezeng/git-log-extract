import { RouteConfig } from "vue-router";

const routes: RouteConfig[] = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "main-layout" */ "@/layouts/Main.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(/* webpackChunkName: "index-page" */ "@/pages/Index.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () =>
      import(
        /* webpackChunkName: "error-404-page" */ "@/pages/error/Error404.vue"
      ),
  },
];

export default routes;
