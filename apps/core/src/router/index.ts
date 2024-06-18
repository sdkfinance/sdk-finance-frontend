import { permissionGuard } from '@sdk5/shared/middlewares';
import router from '@sdk5/shared/router';
import type { RouteConfig } from 'vue-router';

import { API_LIST } from '@/modules/api-list/routes';
import { DASHBOARDS_POWER_BI } from '@/modules/dashboards-power-bi/routes';
import { ENTRANCE } from '@/modules/entrance/routes/entrance';
import { MAINTENANCE } from '@/modules/maintenance/routes';
import middlewarePipeline from '@/router/middlewarePipeline';
import { defaultGuard } from '@/router/middlewares/defaultGuard';
import store from '@/store';

export async function setupAppRoutes() {
  const routes: RouteConfig[] = [
    ENTRANCE,
    DASHBOARDS_POWER_BI,
    MAINTENANCE,
    API_LIST,
    {
      path: '*',
      redirect: '/',
    },
  ];

  if (import.meta.env.VUE_APP_FRONT_OFFICE_ROUTES !== 'false') {
    const { FRONT_OFFICE_ROUTES } = await import('@sdk5/front-office');
    routes.push(FRONT_OFFICE_ROUTES);
  }

  routes.forEach((route) => {
    router.addRoute(route);
  });
  router.beforeEach((to, from, next) => {
    const middleware = to?.meta?.middleware || [];
    const middlewares = [...middleware, defaultGuard, permissionGuard];
    const context = {
      to,
      from,
      next,
      store,
      abort: next,
    };

    return middlewares[0]({
      ...context,
      next: middlewarePipeline(context, middlewares, 1),
    });
  });
}

export default router;
