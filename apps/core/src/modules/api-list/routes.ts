import type { IRouteConfig } from '@sdk5/shared/types';

const ApiListPage = () => import('./pages/api-list.vue');
const ApiListLayout = () => import('./layouts/api-list-layout.vue');

export const API_LIST: IRouteConfig = {
  path: '/api-list',
  component: ApiListLayout,
  meta: {
    disableGuard: true,
  },
  children: [
    {
      path: '',
      name: 'api-list',
      meta: {
        disableGuard: true,
      },
      component: ApiListPage,
    },
  ],
};
