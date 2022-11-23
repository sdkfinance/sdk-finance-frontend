import { DASHBOARD_NAMES } from '@/router';
import { UserInstance } from '@/services/UserService';

import { routeMiddleware } from './types/routeMiddleware';

export const redirectLogged: routeMiddleware = ({ next, store }) => {
  if (store.getters!['UserData/token']) {
    return next({
      name: DASHBOARD_NAMES[UserInstance.role] || DASHBOARD_NAMES.DEFAULT,
    });
  }

  return next();
};
