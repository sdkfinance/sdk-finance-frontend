import { checkPermission } from '../middlewares';
import type { IRouteConfig } from '../types';

const checkAvailableRoute = (route: IRouteConfig): boolean => {
  if (!route.meta?.root) {
    return false;
  }

  return checkPermission(route.meta?.permission);
};

export const getAvailableDashboardRoutes = (routes: IRouteConfig[]): IRouteConfig[] =>
  routes.filter((route: IRouteConfig) => {
    if (route.children) {
      route.children = getAvailableDashboardRoutes(route.children);
    }

    return checkAvailableRoute(route);
  });
