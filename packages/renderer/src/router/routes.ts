import type {RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/renderer/layouts/Main.vue'),
    children: [
      {
        path: '',
        component: () => import('@/renderer/pages/index.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/renderer/pages/error/index.vue'),
  },
];

export default routes;
