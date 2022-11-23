import { AsyncComponent } from 'vue';

import { IRouteConfig } from '@/types/interfaces';

const Providers: AsyncComponent = () => import(
  /* webpackChunkName: 'providers' */ '@/modules/contracts/pages/providers/index.vue'
);

const ProvidersDashboard: AsyncComponent = () => import(
  /* webpackChunkName: 'providers-dashboard' */ '@/modules/contracts/pages/providers/providers-dashboard.vue'
);

const ProvidersList: AsyncComponent = () => import(
  /* webpackChunkName: 'providers-list' */ '@/modules/contracts/pages/providers/providers-list.vue'
);

export const PROVIDERS_CHILDREN: IRouteConfig[] = [
  {
    path: 'dashboard',
    name: 'providers-dashboard',
    component: ProvidersDashboard,
    meta: {
      root: true,
      translation: 'pages.providers.tabs.dashboard',
    },
  },
  {
    path: 'list',
    name: 'providers-list',
    component: ProvidersList,
    meta: {
      root: true,
      translation: 'pages.providers.tabs.list',
    },
  },
];

export const PROVIDERS_ROUTES: IRouteConfig = {
  path: 'providers',
  name: 'providers',
  component: Providers,
  meta: {
    root: true,
    translation: 'navigation.link.providers',
  },
  children: PROVIDERS_CHILDREN,
  redirect: PROVIDERS_CHILDREN[0],
};
