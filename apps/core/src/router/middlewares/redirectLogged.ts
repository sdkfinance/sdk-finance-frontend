import { useDashboardNameByRole } from '@sdk5/shared/composables';
import { UserDataService } from '@sdk5/shared/services';
import type { RouteMiddleware } from '@sdk5/shared/types';

const { getDashboardName } = useDashboardNameByRole();

export const redirectLogged: RouteMiddleware = ({ next, store }) => {
  if (UserDataService.token && UserDataService.role) {
    return next({
      name: getDashboardName(UserDataService.role) || 'entrance',
    });
  }

  return next();
};
