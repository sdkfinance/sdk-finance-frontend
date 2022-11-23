import { AsyncComponent } from 'vue';

import { IRouteConfig } from '@/types/interfaces';

const EntranceLayout: AsyncComponent = () => import(
  /* webpackChunkName: 'entrance-layout' */ '@/layouts/entrance-layout.vue'
);

const DashboardList: AsyncComponent = () => import(
  /* webpackChunkName: 'dashboards-power-bi' */ '@/modules/dashboards-power-bi/pages/dashboard-list.vue'
);

const DashboardsView: AsyncComponent = () => import(
  /* webpackChunkName: 'dashboards-power-bi' */ '@/modules/dashboards-power-bi/pages/dashboard-view.vue'
);

export const DASHBOARDS_POWER_BI_CHILDREN: IRouteConfig[] = [
  {
    path: '',
    name: 'dashboards-list',
    component: DashboardList,
    meta: {
      disableGuard: true,
      root: false,
    },
  },
  {
    path: ':id',
    name: 'dashboards-view',
    component: DashboardsView,
    meta: {
      disableGuard: true,
      root: false,
    },
  },
];

export const DASHBOARDS_POWER_BI: IRouteConfig = {
  path: '/dashboards',
  component: EntranceLayout,
  redirect: DASHBOARDS_POWER_BI_CHILDREN[0],
  children: DASHBOARDS_POWER_BI_CHILDREN,
  props: { isTopLogoVisible: true },
  meta: {
    disableGuard: true,
    root: false,
  },
};
