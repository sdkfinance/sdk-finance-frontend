import { useDashboardNameByRole } from '@sdk5/shared/composables';
import { UserInstance } from '@sdk5/shared/services';
import type { RouteMiddleware } from '@sdk5/shared/types';

const { getDashboardName } = useDashboardNameByRole();

export const redirectLogged: RouteMiddleware = ({ next, store }) => {
  if (store.getters!['UserData/token']) {
    return next({
      name: getDashboardName(UserInstance.role) || 'entrance',
    });
  }

  return next();
};
