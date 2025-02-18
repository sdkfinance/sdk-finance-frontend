import { UserDataService } from '@sdk5/shared';
import type { RouteMiddleware } from '@sdk5/shared/types';

export const defaultGuard: RouteMiddleware = ({ to, next, store, abort }) => {
  const { disableGuard } = to?.meta || {};

  if (disableGuard || UserDataService.token) {
    return next();
  }

  return abort({ name: 'entrance', query: to.query });
};
