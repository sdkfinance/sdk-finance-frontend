import Vue from 'vue';
import VueRouter, { Route, RouteConfig } from 'vue-router';
import middlewarePipeline from '@/router/middlewarePipeline';
import { defaultGuard } from '@/router/middlewares/defaultGuard';
import { permissionGuard } from '@/router/middlewares/permissionGuard';

import store from '@/store';
import { ENTRANCE } from '@/modules/entrance/routes/entrance';
import { MAINTENANCE } from '@/modules/maintenance/routes';
import { DASHBOARDS_POWER_BI } from '@/modules/dashboards-power-bi/routes';
import { USER_DASHBOARD } from '@/modules/user-dashboard/routes';

import { ROLES } from '@/constants';
import { IPlainObject } from '@/types/interfaces';
import { DASHBOARD } from './dashboard';

export const DASHBOARD_NAMES: IPlainObject = {
  [ROLES.individual]: 'user-dashboard',
  DEFAULT: 'dashboard',
};

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  ENTRANCE,
  DASHBOARDS_POWER_BI,
  DASHBOARD,
  USER_DASHBOARD,
  MAINTENANCE,
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // @ts-ignore
  scrollBehavior(to: Route, from: Route, savedPosition: Position | void): any {

    if (savedPosition) {
      return savedPosition;
    }

    if (to.params?.viewPosition) {
      return to.params.viewPosition;
    }

    if (to.hash) {
      return {
        selector: to.hash,
      };
    }

    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const middleware = to?.meta?.middleware || [];

  const middlewares = [...middleware, permissionGuard, defaultGuard];
  const context = {
    to,
    from,
    next,
    store,
  };

  return middlewares[0]({
    ...context,
    next: middlewarePipeline(context, middlewares, 1),
  });
});

export default router;
