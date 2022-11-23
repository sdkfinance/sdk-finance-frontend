import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const BaseTabsLayout: AsyncComponent = () => import(/* webpackChunkName: 'top-up-execute' */
  '@/layouts/base-tabs-layout.vue'
);

const TopUpExecute: AsyncComponent = () => import(
  /* webpackChunkName: 'top-up-execute' */
  '@/modules/top-up/pages/top-up-execute/index.vue'
);

const TopUpRequests: AsyncComponent = () => import(
  /* webpackChunkName: 'top-up-requests' */
  '@/modules/top-up/pages/top-up-requests/index.vue'
);

export const TOP_UP_CHILDREN: IRouteConfig[] = [
  {
    path: 'top-up-requests',
    name: 'top-up-requests',
    component: TopUpRequests,
    meta: {
      translation: 'pages.top_up.navigation.requests',
    },
  },
  {
    path: 'top-up-execute',
    name: 'top-up-execute',
    component: TopUpExecute,
    meta: {
      permission: () => false,
      translation: 'pages.top_up.navigation.execute',
    },
  },
];

export const TOP_UP: IRouteConfig = {
  path: '/dashboard/top-up',
  component: BaseTabsLayout,
  props: {
    links: TOP_UP_CHILDREN,
    title: 'pages.top_up.title',
  },
  meta: {
    permission: [ROLES.accountant],
    root: true,
    translation: 'navigation.link.top_up',
    icon: 'icon-top-up',
  },
  redirect: TOP_UP_CHILDREN[0],
  children: TOP_UP_CHILDREN,
};
