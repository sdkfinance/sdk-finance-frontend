/* eslint-disable no-restricted-imports */
export * from 'vue';
declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: (typeof import('vue-router'))['RouterLink'];
    RouterView: (typeof import('vue-router'))['RouterView'];
  }
}
