import type {Router} from 'vue-router';
import {createRouter, createWebHashHistory} from 'vue-router';
import routes from './routes';

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export const router = createRouter({
  scrollBehavior: () => ({left: 0, top: 0}),
  routes,
  history: createWebHashHistory(),
});
